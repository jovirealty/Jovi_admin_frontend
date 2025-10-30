// src/hooks/addproperty/admin/useStaffPropertyDetail.jsx
import { useCallback, useEffect, useState } from "react";

export default function useStaffPropertyDetail(id) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const base = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${base}/auth/staff/property-listings/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || "Failed to fetch property.");
      }

      setData(json.data || null);
      return json;
    } catch (err) {
      setError(err?.message || "Something went wrong while fetching property.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { loading, error, data, refetch: fetchDetail };
}