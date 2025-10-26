import { useCallback, useState } from "react";

export default function useStaffProperty() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const fetchList = useCallback(async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            const base = import.meta.env.VITE_API_BASE;
            const res = await fetch(`${base}/auth/staff/property-listings`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const json = await res.json().catch(() => ({}));
            if(!res.ok) {
                throw new Error(json?.message || "Failed to fetch properties.");
            }

            setData(Array.isArray(json?.data) ? json.data : []);
            return json;
        } catch (err) {
            setError(err?.message || "Something went wrong while fetching properties.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, data, fetchList };
}