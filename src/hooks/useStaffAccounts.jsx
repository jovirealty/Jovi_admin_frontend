import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_BASE = import.meta.env.VITE_API_BASE;

function localAuthHeader() {
  const t = localStorage.getItem("accessToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function useStaffAccounts({ q="", page=1, limit=25 } = {}) {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { authHeader } = useAuth();

    useEffect(() => {
        let abort = false;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`${API_BASE}/auth/staff/accounts`, {
                    headers: {
                        ...authHeader(), 
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });
                if(!res.ok) {
                    throw new Error(await `Error: ${res.text()}` || `HTTP ${res.status}`);
                }

                const data = await res.json();
                const items = Array.isArray(data) ? data : data.items || [];

                if(!abort) {
                    setAccounts(items);
                }
            } catch (err) {
                if(abort) {
                    setError(err.message);
                    console.error("Failed to fetch staff accounts", err.message);
                }
            } finally {
                if (!abort) setLoading(false);
            }
        }
        load();
        return () => { 
            abort = true;
        };
    }, [authHeader, q, page, limit]);

    return { accounts, loading, error };
}

// --------------- Create a staff account (POST) ---------------
export async function createStaffAccount(payload) {
    const res = await fetch(`${API_BASE}/auth/staff/accounts/signup`, {
        method: "POST",
        headers: {
            ...localAuthHeader(),
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if(!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create account");
    }
    return res.json();
}

// ---------------- Get one staff account (GET) ----------------
export async function getStaffAccount(accountId) {
    const res = await fetch(`${API_BASE}/auth/staff/accounts/${accountId}`, {
        headers: {
            ...localAuthHeader(),
            "Content-Type": "application/json",
        },  
        credentials: "include",
    });
    if(!res.ok) {
        throw new Error(`Not found (${res.status})`);
    }
    return res.json();
}

// ---------- agent lookup by email (email OR joviEmail) ----------
export async function lookupAgentByEmail(email) {
    const res = await fetch(`${API_BASE}/auth/staff/agent-lookup?email=${encodeURIComponent(email)}`, {
        headers: {
            ...localAuthHeader(),
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if(res.status === 404) {
        return null; // not found
    }
    if (!res.ok) {
        let msg = "Lookup failed";
        try { msg = (await res.json()).error || msg; } catch {}
        throw new Error(msg);
    }
    return res.json(); // { id, fullName, email, joviEmail }
}