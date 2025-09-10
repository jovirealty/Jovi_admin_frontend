import { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);
const API = import.meta.env.VITE_API_BASE;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // try refresh on load
    useEffect(() => {
        fetch(`${API}/auth/refresh`, { method: "POST", credentials: "include" })
            .then(response => (response.ok ? response.json() : null))
            .then(data => {
                if(data?.accessToken) {
                    setAccessToken(data.accessToken);
                    return fetch(`${API}/auth/me`, {
                        credentials: "include",
                        headers: { Authorization: `Bearer ${data.accessToken}` }
                    }).then(res => (res.ok ? res.json() : null));
                }
            })
            .then(me => setUser(me || null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ email, password })
        });
        if(!res.ok) {
            throw new Error((await res.json()).error || "Login failed");
        }
        const data = await res.json();
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await fetch(`${API}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
        setAccessToken(null);
    };

    const authHeader = () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {});

    return (
        <AuthCtx.Provider value={{ user, loading, login, logout, authHeader }}>
            { children }
        </AuthCtx.Provider>
    );
}

export const useAuth = () => useContext(AuthCtx);