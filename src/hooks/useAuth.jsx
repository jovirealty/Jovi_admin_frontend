import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { flushSync } from "react-dom"; // For forcing sync state updates post-login

const AuthCtx = createContext(null);
const API = import.meta.env.VITE_API_BASE;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
    const [loading, setLoading] = useState(true);
    const isRefreshingRef = useRef(false);
    const failedQueueRef = useRef([]);

    // Define logout early, as it's referenced in refreshToken
    const logout = useCallback(async () => {
        await fetch(`${API}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        failedQueueRef.current = [];
    }, []);

    // Initial refresh on mount
    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${API}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                });
                if (!r.ok) return;
                const data = await r.json();
                if (!data?.accessToken) return;

                setAccessToken(data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);

                const meRes = await fetch(`${API}/auth/me`, {
                    credentials: "include",
                    headers: { Authorization: `Bearer ${data.accessToken}` },
                });
                if (meRes.ok) {
                    const me = await meRes.json();
                    setUser(me || null);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Process queued requests
    const processQueue = useCallback((error, token = null) => {
        failedQueueRef.current.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueueRef.current = [];
    }, []);

    // Refresh logic (reusable)
    const refreshToken = useCallback(async () => {
        if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
                failedQueueRef.current.push({ resolve, reject });
            });
        }

        isRefreshingRef.current = true;
        processQueue(null);

        try {
            const refreshRes = await fetch(`${API}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });
            if (!refreshRes.ok) {
                throw new Error("Refresh failed");
            }
            const refreshData = await refreshRes.json();
            if (!refreshData?.accessToken) {
                throw new Error("No access token in refresh");
            }

            const newToken = refreshData.accessToken;
            setAccessToken(newToken);
            localStorage.setItem("accessToken", newToken);

            const meRes = await fetch(`${API}/auth/me`, {
                credentials: "include",
                headers: { Authorization: `Bearer ${newToken}` },
            });
            if (meRes.ok) {
                const me = await meRes.json();
                setUser(me || null);
            }

            processQueue(null, newToken);
            return newToken;
        } catch (refreshError) {
            processQueue(refreshError, null);
            await logout();
            throw refreshError;
        } finally {
            isRefreshingRef.current = false;
        }
    }, [processQueue, logout]);

    // Proactive refresh timer (after refreshToken)
    useEffect(() => {
        if (!accessToken) return;
        try {
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            const expiry = payload.exp * 1000;
            const timeout = expiry - Date.now() - 60000; // 1 min before expiry
            if (timeout > 0) {
                const id = setTimeout(async () => {
                    try {
                        await refreshToken();
                    } catch (err) {
                        console.error("Proactive refresh failed:", err);
                    }
                }, timeout);
                return () => clearTimeout(id);
            }
        } catch (err) {
            console.warn("Invalid JWT for proactive refresh:", err);
        }
    }, [accessToken, refreshToken]);

    // authHeader (defined before authenticatedFetch)
    const authHeader = useCallback(() => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), [accessToken]);

    // Authenticated fetch wrapper (after authHeader)
    const authenticatedFetch = useCallback(async (url, options = {}) => {
        const headers = {
            ...options.headers,
            ...authHeader(),
            "Content-Type": "application/json", // Default, override if needed (e.g., FormData)
        };

        const wrappedOptions = {
            ...options,
            headers,
            credentials: "include",
        };

        let res = await fetch(url, wrappedOptions);

        if (res.status === 401 && !options._retry) {
            try {
                const newToken = await refreshToken();
                const retryHeaders = {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                };
                res = await fetch(url, {
                    ...wrappedOptions,
                    headers: retryHeaders,
                    _retry: true,
                });
            } catch (retryError) {
                throw retryError; // Let caller handle (e.g., redirect)
            }
        }

        return res;
    }, [accessToken, refreshToken, authHeader]);

    const login = async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            throw new Error((await res.json()).error || "Login failed");
        }
        const data = await res.json();
        // Force sync update for immediate post-login fetches
        flushSync(() => {
            setAccessToken(data.accessToken);
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
        });
        return data.user;
    };

    return (
        <AuthCtx.Provider value={{ user, loading, login, logout, authHeader, authenticatedFetch }}>
            {children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);