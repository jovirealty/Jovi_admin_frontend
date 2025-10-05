import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

function localAuthHeader() {
  const t = localStorage.getItem("accessToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function useStaffAccounts({ q = "", page = 1, limit = 25 } = {}) {
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

        const res = await fetch(url, {
          headers: { ...localAuthHeader(), "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP ${res.status}`);
        }
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
  }, [q, page, limit]);

  return { accounts, loading, error, ...meta };
}

export async function createStaffAccount(payload) {
  const res = await fetch(`${API_BASE}/auth/staff/accounts/signup`, {
    method: "POST",
    headers: { ...localAuthHeader(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create account");
  }
  return res.json();
}

export async function getStaffAccount(accountId) {
  const res = await fetch(`${API_BASE}/auth/staff/accounts/${accountId}`, {
    headers: { ...localAuthHeader(), "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Not found (${res.status})`);
  return res.json();
}

export async function lookupAgentByEmail(email) {
  const res = await fetch(
    `${API_BASE}/auth/staff/agent-lookup?email=${encodeURIComponent(email)}`,
    {
      headers: { ...localAuthHeader(), "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    let msg = "Lookup failed";
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// Update agentLists (+ sync staff name). Accepts optional `file` for avatar upload.
export async function updateAgentAndStaffProfile(accountId, payload = {}, file) {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });
  if (file) form.append("photo", file);

  const res = await fetch(`${API_BASE}/auth/staff/accounts/${accountId}/profile`, {
    method: "PUT",
    headers: { ...localAuthHeader() }, // no Content-Type for FormData
    credentials: "include",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update profile");
  }
  return res.json();
}
