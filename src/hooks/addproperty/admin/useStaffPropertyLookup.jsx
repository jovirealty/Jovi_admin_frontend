import { useCallback, useState } from "react";
import { useAuth } from "../../useAuth";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function useStaffPropertyLookup() {
    const token = localStorage.getItem("accessToken");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const lookupStaff = useCallback(async (q) => {
        setLoading(true);
        setError(null);

        try {
            const url = `${API_BASE}/auth/staff/staff-property-lookup?q=${encodeURIComponent(q)}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`} : {}),
                },
                credentials: "include",
            });

            if(res.status === 404) {
                setError("[hook] - No agent found for that email / name.");
                return { found: false, agent: null };
            }

            if(!res.ok) {
                const dataError = await res.json().catch(() => ({}));
                throw new Error(dataError?.error || "Lookup failed");
            }

            const data = await res.json();
            return data;

        } catch (e) {
            console.log("it failed in usedStaffPropertyLookup:", e);
            setError("Lookup failed. Please try again.");
            return { found: false, agent: null };
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {lookupStaff, loading, error, setError};
}