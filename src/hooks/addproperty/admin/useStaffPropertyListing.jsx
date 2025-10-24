import { useCallback, useState } from "react";

export default function useStaffPropertyListing() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const createListing = useCallback(async ({ agent, mode, form, media }) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const token = localStorage.getItem("accessToken");
            // Build payload the backend validator expects (Joi):
            // userId, agentListId, agentDetail, propertyDetails

            // NOTE: choose sale vs rent price fields based on `mode`

            const propertyDetails = {
                propertyFor: mode, // "sale" | "rent"
                status: form.status,
                type: form.type,
                subtype: form.subtype,
                description: form.description,
                listingDate: form.listingDate || new Date().toISOString().slice(0, 10),
                yearBuilt: form.yearBuilt ?? undefined,

                currency: form.currency || "CAD",
                listPrice: mode === "sale" ? Number(form.listPrice || 0) : undefined,
                rentPrice: mode === "rent" ? Number(form.rentPrice || 0) : undefined,

                // Location
                unitNumber: form.unitNumber || "",
                streetNumber: form.streetNumber || "",
                streetName: form.streetName || "",
                streetSuffix: form.streetSuffix || "",
                stateProvince: form.stateProvince,
                city: form.city,
                postalCode: form.postalCode || "",
                latitude: form.latitude || "",
                longitude: form.longitude || "",
                subdivision: form.subdivision || "",

                // Interior
                bedrooms: Number(form.bedrooms ?? 0),
                totalBath: Number(form.totalBath ?? 0),
                halfBath: Number(form.halfBath ?? 0),
                livingArea: Number(form.livingArea ?? 0),
                floorArea: Number(form.floorArea ?? 0),
                interiorFeatures: form.interiorFeatures || "",
                heatingSystem: form.heatingSystem || "",
                totalFireplace: Number(form.totalFireplace ?? 0),
                fireplaceFeature: form.fireplaceFeature || "",
                laundryFeature: form.laundryFeature || "",
                appliances: form.appliances || "",

                // Exterior
                parking: form.parking || "",
                lotAcre: Number(form.lotAcre ?? 0),
                lotSqft: Number(form.lotSqft ?? 0),
                lotDimensions: form.lotDimensions || "",
                lotFeatures: form.lotFeatures || "",
                openParking: Number(form.openParking ?? 0),
                totalParking: Number(form.totalParking ?? 0),
                parkingFeatures: form.parkingFeatures || "",
                hasView: form.hasView === "Yes" ? true : form.hasView === "No" ? false : undefined,
                viewDescription: form.viewDescription || "",
                exteriorFeatures: form.exteriorFeatures || "",

                // Community & Financial (sale-only inputs are still optional on BE)
                strata: Number(form.strata ?? 0),
                amenities: form.amenities || "",
                petPolicy: form.petPolicy || "",
                taxYear: Number(form.taxYear ?? 0),
                annualTaxAmount: Number(form.annualTaxAmount ?? 0),
                pricePerSqft: Number(form.pricePerSqft ?? 0),
            };

            const payload = {
                userId: String(agent?.staffId),                 // staff _id
                agentListId: agent?.id,                 // agentListId
                agentDetail: { fullName: agent?.name, email: agent?.email },
                propertyDetails,
            };

            // Build multipart body
            const fd = new FormData();
            fd.append("payload", JSON.stringify(payload));

            (media || []).slice(0,40).forEach((m) => {
                const f =
                    m?.file ||
                    m?.blob ||
                    (m instanceof File ? m : null);
                    if (f) fd.append("media", f, f.name || "upload");
            });

            const base = import.meta.env.VITE_API_BASE;
            // NB: route must start with a "/" on the server router (see note below)
            const url  = `${base}/auth/staff/create-property-listing`;

            const res = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json?.message || "Failed to create listing.");
            }
            setData(json?.data || json);
            return json;
        }
        catch (error) { 
            setError(e.message || "Something went wrong.");
            throw e;
        }
        finally { setLoading(false); }
    }, []);

    return { createListing, loading, error, setError, data };
}