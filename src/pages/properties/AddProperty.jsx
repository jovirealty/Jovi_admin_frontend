// src/pages/admin/AddProperty.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import SectionCard from "../../components/form/SectionCard";
import ImageUploader from "../../components/form/ImageUploader";
import AgentGate from "../../components/form/AgentGate";
import ListingTypeTabs from "../../components/form/ListingTypeTabs";
import useStaffPropertyLookup from "../../hooks/addproperty/admin/useStaffPropertyLookup";
import {
  HEATING_TYPES,
  COOLING_TYPES,
  PARKING_TYPES,
  VIEW_TYPES,
} from "../../data/propertyFormOptions";
import {
  SALE_PROPERTY_TYPES,
  RENT_PROPERTY_TYPES,
  PROPERTY_SUBTYPES,
} from "../../data/listingOptions";

// ---------- small primitives ----------
const Field = ({ label, required, hint, children }) => (
  <label className="block">
    <div className="mb-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
      {label} {required && <span className="text-red-600">*</span>}
    </div>
    {children}
    {hint && (
      <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        {hint}
      </p>
    )}
  </label>
);

const inputBase =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";
const selectBase = inputBase;
const textareaBase = `${inputBase} min-h-28`;

// ---------- mock API (replace) ----------
async function fetchAgentByEmailOrName(q) {
  if (!q) return null;
  return { id: "agent_123", name: "Rebecca Chen", email: "rebecca.chen@demo.com" };
}

// ---------- Validation helpers ----------
const today = () => new Date().toISOString().slice(0, 10);

const REQUIRED_SALE = {
  // Property Information
  status: true,
  listPrice: true,
  type: true,
  subtype: true,
  description: true,
  listingDate: true, // auto-filled, but still required
  // Location
  stateProvince: true,
  city: true,
  postalCode: true,
  // Interior
  bedrooms: true,
  totalBath: true,
};

const REQUIRED_RENT = {
  // header prompt
  isPrivateRoom: true,
  // Property Information
  status: true,
  rentPrice: true,
  type: true,
  subtype: true,
  description: true,
  // Location
  stateProvince: true,
  city: true,
  postalCode: true,
  // Interior
  bedrooms: true,
  totalBath: true,
};

function validate(form, mode) {
  const req = mode === "sale" ? REQUIRED_SALE : REQUIRED_RENT;
  const errors = {};

  const need = (key, fn) => {
    const v = form[key];
    const ok = fn ? fn(v) : !!String(v ?? "").trim();
    if (!ok) errors[key] = "This field is required.";
  };

  Object.keys(req).forEach((k) => {
    if (!req[k]) return;
    // numeric fields: require positive number
    if (["listPrice", "rentPrice", "bedrooms", "totalBath"].includes(k)) {
      need(k, (v) => v !== "" && !isNaN(Number(v)) && Number(v) >= 0);
    } else {
      need(k);
    }
  });

  return errors;
}

// ---------- Shared sections ----------
function LocationSection({ form, onChange, required }) {
  return (
    <SectionCard title="Location Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Unit Number">
            <input className={inputBase} value={form.unitNumber || ""} onChange={onChange("unitNumber")} />
          </Field>
          <Field label="Street Number">
            <input className={inputBase} value={form.streetNumber || ""} onChange={onChange("streetNumber")} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Street Name">
            <input className={inputBase} value={form.streetName || ""} onChange={onChange("streetName")} />
          </Field>
          <Field label="Street Suffix">
            <input className={inputBase} value={form.streetSuffix || ""} onChange={onChange("streetSuffix")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="State/Province" required={required.stateProvince}>
            <input className={inputBase} value={form.stateProvince || ""} onChange={onChange("stateProvince")} />
          </Field>
          <Field label="City" required={required.city}>
            <input className={inputBase} value={form.city || ""} onChange={onChange("city")} />
          </Field>
          <Field label="Postal Code" required={required.postalCode}>
            <input className={inputBase} value={form.postalCode || ""} onChange={onChange("postalCode")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Latitude">
            <input className={inputBase} value={form.latitude || ""} onChange={onChange("latitude")} />
          </Field>
          <Field label="Longitude">
            <input className={inputBase} value={form.longitude || ""} onChange={onChange("longitude")} />
          </Field>
          <Field label="Subdivision">
            <input className={inputBase} value={form.subdivision || ""} onChange={onChange("subdivision")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

function InteriorSection({ form, onChange, required }) {
  return (
    <SectionCard title="Interior Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Bedrooms" required={required.bedrooms}>
            <input className={inputBase} type="number" min={0} value={form.bedrooms ?? ""} onChange={onChange("bedrooms")} />
          </Field>
          <Field label="Total Bath" required={required.totalBath}>
            <input className={inputBase} type="number" min={0} value={form.totalBath ?? ""} onChange={onChange("totalBath")} />
          </Field>
          <Field label="Half Bath">
            <input className={inputBase} type="number" min={0} value={form.halfBath ?? ""} onChange={onChange("halfBath")} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Living Area (sqft)">
            <input className={inputBase} type="number" min={0} value={form.livingArea ?? ""} onChange={onChange("livingArea")} />
          </Field>
          <Field label="Floor Area (sqft)">
            <input className={inputBase} type="number" min={0} value={form.floorArea ?? ""} onChange={onChange("floorArea")} />
          </Field>
        </div>

        <Field label="Interior Features">
          <input className={inputBase} placeholder="e.g., Vaulted ceiling, Walk-in closet" value={form.interiorFeatures || ""} onChange={onChange("interiorFeatures")} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Heating System">
            <select className={selectBase} value={form.heatingSystem || ""} onChange={onChange("heatingSystem")}>
              <option value="">Select heating</option>
              {HEATING_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Total Fireplace">
            <input className={inputBase} type="number" min={0} value={form.totalFireplace ?? ""} onChange={onChange("totalFireplace")} />
          </Field>
          <Field label="Laundry Feature">
            <input className={inputBase} value={form.laundryFeature || ""} onChange={onChange("laundryFeature")} />
          </Field>
        </div>

        <Field label="Fireplace Feature">
          <input className={inputBase} value={form.fireplaceFeature || ""} onChange={onChange("fireplaceFeature")} />
        </Field>

        <Field label="Appliances">
          <input className={inputBase} placeholder="Fridge, Stove, Dishwasher" value={form.appliances || ""} onChange={onChange("appliances")} />
        </Field>
      </div>
    </SectionCard>
  );
}

function ExteriorSection({ form, onChange }) {
  return (
    <SectionCard title="Exterior Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Parking">
          <select className={selectBase} value={form.parking || ""} onChange={onChange("parking")}>
            <option value="">Select parking</option>
            {PARKING_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Lot Size (acre)">
            <input className={inputBase} value={form.lotAcre || ""} onChange={onChange("lotAcre")} />
          </Field>
          <Field label="Lot Size (sqft)">
            <input className={inputBase} value={form.lotSqft || ""} onChange={onChange("lotSqft")} />
          </Field>
          <Field label="Lot Dimensions">
            <input className={inputBase} value={form.lotDim || ""} onChange={onChange("lotDim")} />
          </Field>
        </div>

        <Field label="Lot Features">
          <input className={inputBase} value={form.lotFeatures || ""} onChange={onChange("lotFeatures")} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Open Parking">
            <input className={inputBase} type="number" min={0} value={form.openParking ?? ""} onChange={onChange("openParking")} />
          </Field>
          <Field label="Total Parking">
            <input className={inputBase} type="number" min={0} value={form.totalParking ?? ""} onChange={onChange("totalParking")} />
          </Field>
          <Field label="Parking Features">
            <input className={inputBase} value={form.parkingFeatures || ""} onChange={onChange("parkingFeatures")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Has View">
            <select className={selectBase} value={form.hasView || ""} onChange={onChange("hasView")}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>
          <Field label="View Description">
            <select className={selectBase} value={form.viewDescription || ""} onChange={onChange("viewDescription")}>
              <option value="">Select view</option>
              {VIEW_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Exterior Features">
            <input className={inputBase} value={form.exteriorFeatures || ""} onChange={onChange("exteriorFeatures")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

function BuildingCommunitySection({ form, onChange }) {
  return (
    <SectionCard title="Building & Community Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Strata / HOA (monthly)">
          <input className={inputBase} type="number" min={0} value={form.strata ?? ""} onChange={onChange("strata")} />
        </Field>
        <Field label="Amenities">
          <input className={inputBase} placeholder="Gym, Pool, Sauna…" value={form.amenities || ""} onChange={onChange("amenities")} />
        </Field>
        <Field label="Pet Policy">
          <input className={inputBase} placeholder="Pets allowed / size limits" value={form.petPolicy || ""} onChange={onChange("petPolicy")} />
        </Field>
      </div>
    </SectionCard>
  );
}

// ---------- sale / rent specific ----------
function PropertyInfoSale({ form, onChange, required }) {
  return (
    <SectionCard title="Property Information (Sale)">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Property Status" required={required.status}>
          <select className={selectBase} value={form.status || ""} onChange={onChange("status")}>
            {["Active", "Inactive", "Hold", "Deactivated", "Coming soon"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Sale Listing ID" hint="Generated server-side on save">
          <input className={inputBase} value={form.saleListingId || ""} onChange={onChange("saleListingId")} disabled />
        </Field>

        <Field label="List Price (CAD)" required={required.listPrice}>
          <input className={inputBase} type="number" min={0} value={form.listPrice ?? ""} onChange={onChange("listPrice")} />
        </Field>

        <Field label="Currency">
          <select className={selectBase} value={form.currency || "CAD"} onChange={onChange("currency")}>
            <option>CAD</option>
            <option>USD</option>
          </select>
        </Field>

        <Field label="Property Type" required={required.type}>
          <select className={selectBase} value={form.type || ""} onChange={onChange("type")}>
            <option value="">Select type</option>
            {SALE_PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Property Subtype" required={required.subtype}>
          <select className={selectBase} value={form.subtype || ""} onChange={onChange("subtype")}>
            <option value="">Select subtype</option>
            {PROPERTY_SUBTYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Listing Date" required={required.listingDate}>
          <input className={inputBase} type="date" value={form.listingDate || ""} onChange={onChange("listingDate")} />
        </Field>

        <Field label="Year Built">
          <input className={inputBase} type="number" min={1700} max={new Date().getFullYear()} value={form.yearBuilt ?? ""} onChange={onChange("yearBuilt")} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Property Description" required={required.description}>
            <textarea className={textareaBase} value={form.description || ""} onChange={onChange("description")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

function FinancialSale({ form, onChange }) {
  return (
    <SectionCard title="Financial Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Tax Year">
          <input className={inputBase} type="number" min={1990} max={new Date().getFullYear()} value={form.taxYear ?? ""} onChange={onChange("taxYear")} />
        </Field>
        <Field label="Annual Tax Amount">
          <input className={inputBase} type="number" min={0} value={form.taxAmount ?? ""} onChange={onChange("taxAmount")} />
        </Field>
        <Field label="Price per Square Foot">
          <input className={inputBase} type="number" min={0} value={form.pricePerSqft ?? ""} onChange={onChange("pricePerSqft")} />
        </Field>
      </div>
    </SectionCard>
  );
}

function PropertyInfoRent({ form, onChange, required }) {
  return (
    <SectionCard title="Property Information (Rent)">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Property Status" required={required.status}>
          <select className={selectBase} value={form.status || ""} onChange={onChange("status")}>
            {["Active", "Inactive", "Hold", "Deactivated", "Coming soon"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="This is a private room in a shared property" required={required.isPrivateRoom}>
          <select className={selectBase} value={form.isPrivateRoom ?? ""} onChange={onChange("isPrivateRoom")}>
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </Field>

        <Field label="Price per month (CAD)" required={required.rentPrice}>
          <input className={inputBase} type="number" min={0} value={form.rentPrice ?? ""} onChange={onChange("rentPrice")} />
        </Field>

        <Field label="Rent Listing ID" hint="Generated server-side on save">
          <input className={inputBase} value={form.rentListingId || ""} onChange={onChange("rentListingId")} disabled />
        </Field>

        <Field label="Property Type" required={required.type}>
          <select className={selectBase} value={form.type || ""} onChange={onChange("type")}>
            <option value="">Select type</option>
            {RENT_PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Property Subtype" required={required.subtype}>
          <select className={selectBase} value={form.subtype || ""} onChange={onChange("subtype")}>
            <option value="">Select subtype</option>
            {PROPERTY_SUBTYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Listing Date">
          <input className={inputBase} type="date" value={form.listingDate || ""} onChange={onChange("listingDate")} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Property Description" required={required.description}>
            <textarea className={textareaBase} value={form.description || ""} onChange={onChange("description")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

// ---------- page ----------
export default function AddProperty() {
  const [agent, setAgent] = useState(null);
  const [mode, setMode] = useState("sale"); // "sale" | "rent"
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    currency: "CAD",
    listingDate: today(), // auto-fill
  });
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  const { lookupStaff, loading: lookupLoading, error: lookupError, setError: setLookupError } = useStaffPropertyLookup();

  // keep listingDate auto-set if empty
  useEffect(() => {
    if (!form.listingDate) {
      setForm((s) => ({ ...s, listingDate: today() }));
    }
  }, [form.listingDate]);

  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e?.target?.value ?? e }));

  const submitPayload = useMemo(() => ({
    ...form,
    propertyFor: mode,       // REQUIRED for backend save
    agentId: agent?.id,
    images,
  }),[form, agent, mode, images]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!agent) return;

    // propertyFor must be present
    if (!mode) {
      setErrors({ propertyFor: "[Proeprty field sale/rent] - This field is required.", ...errors });
      return;
    }
    const v = validate(form, mode);
    setErrors(v);

    if (Object.keys(v).length) {
      // scroll to error summary
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // ✅ All good: dump full object to console
    // (hook your upload + POST here)
    // eslint-disable-next-line no-console
    console.log("LISTING_PAYLOAD", submitPayload);
    alert("Valid! Check console for the full payload.");
  };

  const requiredMap = mode === "sale" ? REQUIRED_SALE : REQUIRED_RENT;

  return (
    <form onSubmit={onSubmit} className="p-6">
    {/* Breadcrumb */}
    <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
      <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link> /{" "}
      <Link to="/admin/property" className="hover:underline">Property</Link> /{" "}
        <span className="text-neutral-700 dark:text-neutral-200">Add property</span>
    </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Add Property Listing
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Fields marked <span className="text-red-600">*</span> are required.
          </p>
        </div>
        {agent && (
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            Listing under: <b>{agent.name}</b> ({agent.email})
          </div>
        )}
      </div>

      {/* Agent Gate */}
      {!agent && (
        <AgentGate
          onAgentFound={setAgent}
          isLoading={lookupLoading}
          error={lookupError}
          clearError={() => setLookupError(null)}
          fetchAgent={async (q) => {
            if (!q?.trim()) return null;
            const { found, agent } = await lookupStaff(q);
            // Adapt the shape for your page state
            if (found && agent) {
              // what we keep in AddProperty state:
              return {
                id: agent.agentListId,         // store the agentListId for backend save
                name: agent.fullName,
                email: agent.email,
                staffId: agent.staffId,        // handy if you need it later
              };
            }
            return null;
          }}
        />
      )}

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorRef}
          className="mt-4 mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
        >
          <div className="font-medium">Please complete the required fields:</div>
          <ul className="mt-2 list-disc pl-5 space-y-0.5">
            {Object.keys(errors).map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form (only after agent) */}
      {agent && (
        <>
          <div className="mb-4">
            <ListingTypeTabs mode={mode} setMode={setMode} />
          </div>

          {/* Images */}
          <SectionCard
            title="Images"
            subtitle="JPEG/JPG/PNG only, ≤1MB each, max 40."
          >
            <ImageUploader images={images} setImages={setImages} />
          </SectionCard>

          {/* Conditional sections */}
          {mode === "sale" ? (
            <>
              <PropertyInfoSale
                form={form}
                onChange={onChange}
                required={requiredMap}
              />
              <LocationSection
                form={form}
                onChange={onChange}
                required={requiredMap}
              />
              <InteriorSection
                form={form}
                onChange={onChange}
                required={requiredMap}
              />
              <ExteriorSection form={form} onChange={onChange} />
              <BuildingCommunitySection form={form} onChange={onChange} />
              <FinancialSale form={form} onChange={onChange} />
            </>
          ) : (
            <>
              <PropertyInfoRent
                form={form}
                onChange={onChange}
                required={requiredMap}
              />
              <LocationSection
                form={form}
                onChange={onChange}
                required={requiredMap}
              />
              <InteriorSection
                form={form}
                onChange={onChange}
                required={requiredMap}
              />
              <ExteriorSection form={form} onChange={onChange} />
            </>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Save listing
            </button>
          </div>
        </>
      )}
    </form>
  );
}
