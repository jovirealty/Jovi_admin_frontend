import { useState, useEffect } from "react";
import { useAuth } from "./useAuth"; // Adjust path as needed

const API_BASE = import.meta.env.VITE_API_BASE;

// Non-hook fetch util for async functions (with refresh retry)
async function apiFetch(url, options = {}) {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token");

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Default
    };

    const wrappedOptions = {
        ...options,
        headers,
        credentials: "include",
    };

    let res = await fetch(url, wrappedOptions);

    if (res.status === 401) {
        // Attempt refresh (similar to context logic)
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });
        if (!refreshRes.ok) throw new Error("Session expired");
        const refreshData = await refreshRes.json();
        if (!refreshData?.accessToken) throw new Error("Refresh failed");

        // Update localStorage
        localStorage.setItem("accessToken", refreshData.accessToken);
        accessToken = refreshData.accessToken;

        // Retry
        const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
        };
        res = await fetch(url, {
            ...wrappedOptions,
            headers: retryHeaders,
        });
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }

    return res;
}

export function useStaffAccounts({ q = "", page = 1, limit = 25 } = {}) {
    const { authenticatedFetch } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [meta, setMeta] = useState({ page: 1, limit: 25, total: 0, pages: 1 });

    useEffect(() => {
        let abort = false;

        (async () => {
            setLoading(true);
            setError("");
            try {
                const url = new URL(`${API_BASE}/auth/staff/accounts`);
                if (q) url.searchParams.set("q", q);
                url.searchParams.set("page", String(page));
                url.searchParams.set("limit", String(limit));

                const res = await authenticatedFetch(url.toString()); // Use context wrapper
                const data = await res.json();
                if (!abort) {
                    setAccounts(Array.isArray(data?.accounts) ? data.accounts : []);
                    setMeta({
                        page: Number(data?.page ?? page),
                        limit: Number(data?.limit ?? limit),
                        total: Number(data?.total ?? 0),
                        pages: Number(data?.pages ?? 1),
                    });
                }
            } catch (err) {
                if (!abort) setError(err?.message || "Failed to fetch staff accounts");
            } finally {
                if (!abort) setLoading(false);
            }
        })();

        return () => {
            abort = true;
        };
    }, [q, page, limit, authenticatedFetch]);

    return { accounts, loading, error, ...meta };
}

export async function createStaffAccount(payload) {
    const res = await apiFetch(`${API_BASE}/auth/staff/accounts/signup`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.json();
}

export async function getStaffAccount(accountId) {
    const res = await apiFetch(`${API_BASE}/auth/staff/accounts/${accountId}`);
    return res.json();
}

export async function lookupAgentByEmail(email) {
    const res = await apiFetch(`${API_BASE}/auth/staff/agent-lookup?email=${encodeURIComponent(email)}`);
    if (res.status === 404) return null;
    return res.json();
}

// Update agentLists (+ sync staff name). Accepts optional `file` for avatar upload.
export async function updateAgentAndStaffProfile(accountId, payload = {}, file) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) form.append(k, v);
    });
    if (file) form.append("photo", file);

    const res = await apiFetch(`${API_BASE}/auth/staff/accounts/${accountId}/profile`, {
        method: "PUT",
        headers: {}, // No Content-Type for FormData; let browser set
        body: form,
    });
    return res.json();
}