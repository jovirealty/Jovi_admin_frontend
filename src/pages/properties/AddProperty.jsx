// src/pages/properties/AddProperty.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import SectionCard from "../../components/form/SectionCard";
import AgentGate from "../../components/form/AgentGate";
import ListingTypeTabs from "../../components/form/ListingTypeTabs";
import MediaUploader from "../../components/media_uploader/MediaUploader";

import useStaffPropertyListing from "../../hooks/addproperty/admin/useStaffPropertyListing";
import useStaffPropertyLookup from "../../hooks/addproperty/admin/useStaffPropertyLookup";

import {
  HEATING_TYPES,
  PARKING_TYPES,
  VIEW_TYPES,
} from "../../data/propertyFormOptions";
import {
  SALE_PROPERTY_TYPES,
  RENT_PROPERTY_TYPES,
  PROPERTY_SUBTYPES,
} from "../../data/listingOptions";

/* ---------- small atoms / helpers ---------- */
const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none border-neutral-300 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";
const selectBase = inputBase;
const textareaBase = `${inputBase} min-h-28`;
const cls = (key, errors, base = inputBase) =>
  `${base} ${errors[key] ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" : ""}`;
const today = () => new Date().toISOString().slice(0, 10);

const Field = ({ label, required, hint, error, children }) => (
  <label className="block">
    <div className="mb-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
      {label} {required && <span className="text-red-600">*</span>}
    </div>
    {children}
    {hint && <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
  </label>
);

/* ---------- validation (Postal Code is NOT required) ---------- */
const REQUIRED_COMMON = {
  status: true,
  type: true,
  subtype: true,
  description: true,
  stateProvince: true,
  city: true,
  bedrooms: true,
  totalBath: true,
};
const REQUIRED_SALE = { ...REQUIRED_COMMON, listPrice: true };
const REQUIRED_RENT = { ...REQUIRED_COMMON, rentPrice: true, isPrivateRoom: true };

function validate(form, mode) {
  const req = mode === "sale" ? REQUIRED_SALE : REQUIRED_RENT;
  const errs = {};
  const text = (k) => String(form[k] ?? "").trim();
  Object.keys(req).forEach((k) => {
    if (!req[k]) return;
    if (["bedrooms", "totalBath", "listPrice", "rentPrice"].includes(k)) {
      const n = Number(form[k]);
      if (Number.isNaN(n) || n < 0) errs[k] = "Enter a valid number.";
      return;
    }
    if (!text(k)) errs[k] = "This field is required.";
  });
  return errs;
}

/* ---------- reusable composite: price + currency ---------- */
function PriceWithCurrency({
  label,
  priceKey,
  currencyKey = "currency",
  form,
  onChange,
  required,
  errors,
}) {
  return (
    <Field label={label} required={required} error={errors[priceKey]}>
      <div className="flex items-center gap-2">
        <select
          className={`${selectBase} w-28`}
          value={form[currencyKey] || "CAD"}
          onChange={onChange(currencyKey)}
        >
          <option>CAD</option>
          <option>USD</option>
        </select>
        <input
          type="number"
          min={0}
          className={cls(priceKey, errors)}
          value={form[priceKey] ?? ""}
          onChange={onChange(priceKey)}
          placeholder="0"
        />
      </div>
    </Field>
  );
}

/* ---------- sections (unchanged except error classes) ---------- */
function LocationSection({ form, onChange, required, errors }) {
  return (
    <SectionCard title="Location Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Unit Number">
            <input className={cls("unitNumber", errors)} value={form.unitNumber || ""} onChange={onChange("unitNumber")} />
          </Field>
          <Field label="Street Number">
            <input className={cls("streetNumber", errors)} value={form.streetNumber || ""} onChange={onChange("streetNumber")} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Street Name">
            <input className={cls("streetName", errors)} value={form.streetName || ""} onChange={onChange("streetName")} />
          </Field>
          <Field label="Street Suffix">
            <input className={cls("streetSuffix", errors)} value={form.streetSuffix || ""} onChange={onChange("streetSuffix")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="State/Province" required={required.stateProvince} error={errors.stateProvince}>
            <input className={cls("stateProvince", errors)} value={form.stateProvince || ""} onChange={onChange("stateProvince")} />
          </Field>
          <Field label="City" required={required.city} error={errors.city}>
            <input className={cls("city", errors)} value={form.city || ""} onChange={onChange("city")} />
          </Field>
          <Field label="Postal Code">
            <input className={cls("postalCode", errors)} value={form.postalCode || ""} onChange={onChange("postalCode")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Latitude">
            <input className={cls("latitude", errors)} value={form.latitude || ""} onChange={onChange("latitude")} />
          </Field>
          <Field label="Longitude">
            <input className={cls("longitude", errors)} value={form.longitude || ""} onChange={onChange("longitude")} />
          </Field>
          <Field label="Subdivision">
            <input className={cls("subdivision", errors)} value={form.subdivision || ""} onChange={onChange("subdivision")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

function InteriorSection({ form, onChange, required, errors }) {
  return (
    <SectionCard title="Interior Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Bedrooms" required={required.bedrooms} error={errors.bedrooms}>
            <input className={cls("bedrooms", errors)} type="number" min={0} value={form.bedrooms ?? ""} onChange={onChange("bedrooms")} />
          </Field>
          <Field label="Total Bath" required={required.totalBath} error={errors.totalBath}>
            <input className={cls("totalBath", errors)} type="number" min={0} value={form.totalBath ?? ""} onChange={onChange("totalBath")} />
          </Field>
          <Field label="Half Bath">
            <input className={cls("halfBath", errors)} type="number" min={0} value={form.halfBath ?? ""} onChange={onChange("halfBath")} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Living Area (sqft)">
            <input className={cls("livingArea", errors)} type="number" min={0} value={form.livingArea ?? ""} onChange={onChange("livingArea")} />
          </Field>
          <Field label="Floor Area (sqft)">
            <input className={cls("floorArea", errors)} type="number" min={0} value={form.floorArea ?? ""} onChange={onChange("floorArea")} />
          </Field>
        </div>

        <Field label="Interior Features">
          <input className={cls("interiorFeatures", errors)} placeholder="e.g., Vaulted ceiling, Walk-in closet" value={form.interiorFeatures || ""} onChange={onChange("interiorFeatures")} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Heating System">
            <select className={cls("heatingSystem", errors, selectBase)} value={form.heatingSystem || ""} onChange={onChange("heatingSystem")}>
              <option value="">Select heating</option>
              {HEATING_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Total Fireplace">
            <input className={cls("totalFireplace", errors)} type="number" min={0} value={form.totalFireplace ?? ""} onChange={onChange("totalFireplace")} />
          </Field>
          <Field label="Laundry Feature">
            <input className={cls("laundryFeature", errors)} value={form.laundryFeature || ""} onChange={onChange("laundryFeature")} />
          </Field>
        </div>

        <Field label="Fireplace Feature">
          <input className={cls("fireplaceFeature", errors)} value={form.fireplaceFeature || ""} onChange={onChange("fireplaceFeature")} />
        </Field>

        <Field label="Appliances">
          <input className={cls("appliances", errors)} placeholder="Fridge, Stove, Dishwasher" value={form.appliances || ""} onChange={onChange("appliances")} />
        </Field>
      </div>
    </SectionCard>
  );
}

function ExteriorSection({ form, onChange, errors }) {
  return (
    <SectionCard title="Exterior Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Parking">
          <select className={cls("parking", errors, selectBase)} value={form.parking || ""} onChange={onChange("parking")}>
            <option value="">Select parking</option>
            {PARKING_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Lot Size (acre)">
            <input className={cls("lotAcre", errors)} value={form.lotAcre || ""} onChange={onChange("lotAcre")} />
          </Field>
          <Field label="Lot Size (sqft)">
            <input className={cls("lotSqft", errors)} value={form.lotSqft || ""} onChange={onChange("lotSqft")} />
          </Field>
          <Field label="Lot Dimensions">
            <input className={cls("lotDimensions", errors)} value={form.lotDimensions || ""} onChange={onChange("lotDimensions")} />
          </Field>
        </div>

        <Field label="Lot Features">
          <input className={cls("lotFeatures", errors)} value={form.lotFeatures || ""} onChange={onChange("lotFeatures")} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Open Parking">
            <input className={cls("openParking", errors)} type="number" min={0} value={form.openParking ?? ""} onChange={onChange("openParking")} />
          </Field>
          <Field label="Total Parking">
            <input className={cls("totalParking", errors)} type="number" min={0} value={form.totalParking ?? ""} onChange={onChange("totalParking")} />
          </Field>
          <Field label="Parking Features">
            <input className={cls("parkingFeatures", errors)} value={form.parkingFeatures || ""} onChange={onChange("parkingFeatures")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Has View">
            <select className={cls("hasView", errors, selectBase)} value={form.hasView || ""} onChange={onChange("hasView")}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>
          <Field label="View Description">
            <select className={cls("viewDescription", errors, selectBase)} value={form.viewDescription || ""} onChange={onChange("viewDescription")}>
              <option value="">Select view</option>
              {VIEW_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Exterior Features">
            <input className={cls("exteriorFeatures", errors)} value={form.exteriorFeatures || ""} onChange={onChange("exteriorFeatures")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

function BuildingCommunitySection({ form, onChange, errors }) {
  return (
    <SectionCard title="Building & Community Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Strata / HOA (monthly)">
          <input className={cls("strata", errors)} type="number" min={0} value={form.strata ?? ""} onChange={onChange("strata")} />
        </Field>
        <Field label="Amenities">
          <input className={cls("amenities", errors)} placeholder="Gym, Pool, Sauna…" value={form.amenities || ""} onChange={onChange("amenities")} />
        </Field>
        <Field label="Pet Policy">
          <input className={cls("petPolicy", errors)} placeholder="Pets allowed / size limits" value={form.petPolicy || ""} onChange={onChange("petPolicy")} />
        </Field>
      </div>
    </SectionCard>
  );
}

/* ---------- sale & rent info (status includes the “Select” guard) ---------- */
function PropertyInfoSale({ form, onChange, required, errors }) {
  return (
    <SectionCard title="Property Information (Sale)">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Property Status" required={required.status} error={errors.status}>
          <select className={cls("status", errors, selectBase)} value={form.status || ""} onChange={onChange("status")}>
            <option value="">Select status</option>
            {["Active", "Inactive", "Hold", "Deactivated", "Coming soon"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <PriceWithCurrency
          label="List Price"
          priceKey="listPrice"
          form={form}
          onChange={onChange}
          required={required.listPrice}
          errors={errors}
        />

        <Field label="Property Type" required={required.type} error={errors.type}>
          <select className={cls("type", errors, selectBase)} value={form.type || ""} onChange={onChange("type")}>
            <option value="">Select type</option>
            {SALE_PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Property Subtype" required={required.subtype} error={errors.subtype}>
          <select className={cls("subtype", errors, selectBase)} value={form.subtype || ""} onChange={onChange("subtype")}>
            <option value="">Select subtype</option>
            {PROPERTY_SUBTYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Listing Date">
          <input className={cls("listingDate", errors)} type="date" value={form.listingDate || ""} onChange={onChange("listingDate")} />
        </Field>

        <Field label="Year Built">
          <input className={cls("yearBuilt", errors)} type="number" min={1700} max={new Date().getFullYear()} value={form.yearBuilt ?? ""} onChange={onChange("yearBuilt")} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Property Description" required={required.description} error={errors.description}>
            <textarea className={cls("description", errors, textareaBase)} value={form.description || ""} onChange={onChange("description")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

function FinancialSale({ form, onChange, errors }) {
  return (
    <SectionCard title="Financial Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Tax Year">
          <input className={cls("taxYear", errors)} type="number" min={1990} max={new Date().getFullYear()} value={form.taxYear ?? ""} onChange={onChange("taxYear")} />
        </Field>
        <Field label="Annual Tax Amount">
          <input className={cls("annualTaxAmount", errors)} type="number" min={0} value={form.annualTaxAmount ?? ""} onChange={onChange("annualTaxAmount")} />
        </Field>
        <Field label="Price per Square Foot">
          <input className={cls("pricePerSqft", errors)} type="number" min={0} value={form.pricePerSqft ?? ""} onChange={onChange("pricePerSqft")} />
        </Field>
      </div>
    </SectionCard>
  );
}

function PropertyInfoRent({ form, onChange, required, errors }) {
  return (
    <SectionCard title="Property Information (Rent)">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Property Status" required={required.status} error={errors.status}>
          <select className={cls("status", errors, selectBase)} value={form.status || ""} onChange={onChange("status")}>
            <option value="">Select status</option>
            {["Active", "Inactive", "Hold", "Deactivated", "Coming soon"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field
          label="This is a private room in a shared property"
          required={required.isPrivateRoom}
          error={errors.isPrivateRoom}
        >
          <select
            className={cls("isPrivateRoom", errors, selectBase)}
            value={form.isPrivateRoom === true ? "Yes" : form.isPrivateRoom === false ? "No" : ""}
            onChange={(e) => onChange("isPrivateRoom")({ target: { value: e.target.value === "Yes" } })}
          >
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </Field>

        <PriceWithCurrency
          label="Price per month"
          priceKey="rentPrice"
          form={form}
          onChange={onChange}
          required={required.rentPrice}
          errors={errors}
        />

        <Field label="Property Type" required={required.type} error={errors.type}>
          <select className={cls("type", errors, selectBase)} value={form.type || ""} onChange={onChange("type")}>
            <option value="">Select type</option>
            {RENT_PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Property Subtype" required={required.subtype} error={errors.subtype}>
          <select className={cls("subtype", errors, selectBase)} value={form.subtype || ""} onChange={onChange("subtype")}>
            <option value="">Select subtype</option>
            {PROPERTY_SUBTYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Listing Date">
          <input className={cls("listingDate", errors)} type="date" value={form.listingDate || ""} onChange={onChange("listingDate")} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Property Description" required={required.description} error={errors.description}>
            <textarea className={cls("description", errors, textareaBase)} value={form.description || ""} onChange={onChange("description")} />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

/* ---------- Blocking overlay ---------- */
function BlockingOverlay({ show, text = "Creating listing…" }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="rounded-xl bg-white px-6 py-5 text-center shadow-xl dark:bg-neutral-900">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600 dark:border-neutral-700 dark:border-t-blue-500" />
        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-200">{text}</p>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function AddProperty() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [mode, setMode] = useState("sale");
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState({ currency: "CAD", listingDate: today() });
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  const { createListing, loading: submitLoading, error: submitError, setError: setSubmitError } =
    useStaffPropertyListing();
  const { lookupStaff, loading: lookupLoading, error: lookupError, setError: setLookupError } =
    useStaffPropertyLookup();

  useEffect(() => {
    if (!form.listingDate) setForm((s) => ({ ...s, listingDate: today() }));
  }, [form.listingDate]);

  const onChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e?.target?.value ?? e }));
  const requiredMap = mode === "sale" ? REQUIRED_SALE : REQUIRED_RENT;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!agent) return;

    const v = validate(form, mode);
    setErrors(v);
    if (Object.keys(v).length) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    try {
      await createListing({ agent, mode, form, media });
      // ✅ redirect on success
      navigate("/admin/property", { replace: true });
    } catch {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative p-6" aria-busy={submitLoading}>
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Property", to: "/admin/property" },
          { label: "Add property" },
        ]}
      />

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
          <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
            <span>
              Listing under: <b>{agent.name}</b> ({agent.email})
            </span>
            <button
              type="button"
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
              onClick={() => {
                setAgent(null);
                setErrors({});
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Change agent
            </button>
          </div>
        )}
      </div>

      {!agent && (
        <AgentGate
          onAgentFound={setAgent}
          isLoading={lookupLoading}
          error={lookupError}
          clearError={() => setLookupError(null)}
          fetchAgent={async (q) => {
            if (!q?.trim()) return null;
            const { found, agent } = await lookupStaff(q);
            if (found && agent) {
              return { id: agent.agentListId, name: agent.fullName, email: agent.email, staffId: agent.staffId };
            }
            return null;
          }}
        />
      )}

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

      {submitError && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {submitError}
        </div>
      )}

      {agent && (
        <>
          <div className="mb-4">
            <ListingTypeTabs mode={mode} setMode={setMode} />
          </div>

          <SectionCard title="Media" subtitle="Photos (JPEG/JPG/PNG ≤1MB each) and Videos (MP4/MOV), max 40.">
            <MediaUploader value={media} onChange={setMedia} subtypeForResource={form.subtype || ""} />
          </SectionCard>

          {mode === "sale" ? (
            <>
              <PropertyInfoSale form={form} onChange={onChange} required={requiredMap} errors={errors} />
              <LocationSection form={form} onChange={onChange} required={requiredMap} errors={errors} />
              <InteriorSection form={form} onChange={onChange} required={requiredMap} errors={errors} />
              <ExteriorSection form={form} onChange={onChange} errors={errors} />
              <BuildingCommunitySection form={form} onChange={onChange} errors={errors} />
              <FinancialSale form={form} onChange={onChange} errors={errors} />
            </>
          ) : (
            <>
              <PropertyInfoRent form={form} onChange={onChange} required={requiredMap} errors={errors} />
              <LocationSection form={form} onChange={onChange} required={requiredMap} errors={errors} />
              <InteriorSection form={form} onChange={onChange} required={requiredMap} errors={errors} />
              <ExteriorSection form={form} onChange={onChange} errors={errors} />
            </>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
              onClick={() => navigate("/admin/property")}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Save listing
            </button>
          </div>
        </>
      )}

      <BlockingOverlay show={submitLoading} />
    </form>
  );
}
