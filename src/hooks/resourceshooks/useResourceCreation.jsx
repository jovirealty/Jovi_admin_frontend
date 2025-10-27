// src/hooks/resourceshooks/useResourceCreation.jsx
import { useCallback, useState } from "react";

export default function useResourceCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createResource = useCallback(async ({
    category,
    title,
    subTitle,
    content,
    properties,
    resourceMedia = [],
    publish = false,
    coverFile,
  }) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const token = localStorage.getItem("accessToken");

      // Build payload per schema and validator
      const payload = {
        category,
        title: title.trim(),
        subTitle: subTitle?.trim() || "",
        content,  // HTML string from editor
        properties: {
          tags: properties.tags || [],
          metaTitle: properties.metaTitle?.trim() || "",
          metaDescription: properties.metaDescription?.trim() || "",
          metaKeywords: properties.metaKeywords?.trim() || "",
        },
        resourceMedia,  // Array of URLs (comma-separated in UI, split client-side)
        publish,
      };

      // Use FormData for multipart (cover file + JSON payload)
      const fd = new FormData();
      fd.append("payload", JSON.stringify(payload));

      if (coverFile) {
        fd.append("coverPhoto", coverFile, coverFile.name || "cover.jpg");
      }

      const base = import.meta.env.VITE_API_BASE;
      const url = `${base}/auth/staff/resources`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || json?.message || "Failed to create resource.");
      }

      setData(json?.data || json);
      return json;
    } catch (err) {
      setError(err?.message || "Something went wrong.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createResource, loading, error, setError, data };
}