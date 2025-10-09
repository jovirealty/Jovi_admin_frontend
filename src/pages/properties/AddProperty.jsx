import { useState } from "react";
import SectionCard from "../../components/form/SectionCard";
import ImageUploader from "../../components/form/ImageUploader";
import {
  PROPERTY_TYPES,
  TENURE_TYPES,
  HEATING_TYPES,
  COOLING_TYPES,
  PARKING_TYPES,
  HOA_AMENITIES,
  VIEW_TYPES,
} from "../../data/propertyFormOptions";

const Field = ({ label, required, hint, children }) => (
  <label className="block">
    <div className="mb-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
      {label} {required && <span className="text-red-600">*</span>}
    </div>
    {children}
    {hint && (
      <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
    )}
  </label>
);

const inputBase =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";
const selectBase = inputBase;
const textareaBase = `${inputBase} min-h-28`;

export default function AddProperty() {
  // minimal form state; wire to backend as needed
  const [form, setForm] = useState({
    // property info
    title: "",
    priceMin: "",
    priceMax: "",
    currency: "USD",
    type: "",
    tenure: "",
    beds: "",
    baths: "",
    sqft: "",
    yearBuilt: "",
    units: "",
    // location
    address: "",
    street: "",
    streetNo: "",
    area: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Canada",
    gmap: "",
    // interior
    heating: "",
    cooling: "",
    flooring: "",
    appliances: "",
    // exterior
    lotSize: "",
    parking: "",
    view: "",
    exteriorFeatures: "",
    // building & community
    hoa: "",
    hoaAmenities: [],
    // financial
    taxes: "",
    taxYear: "",
    rent: "",
    // legal & additional
    mls: "",
    legalDesc: "",
    disclosures: "",
    remarks: "",
  });

  const [images, setImages] = useState([]); // {id, file, url}
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const toggleAmenity = (value) =>
    setForm((s) => {
      const has = s.hoaAmenities.includes(value);
      return {
        ...s,
        hoaAmenities: has
          ? s.hoaAmenities.filter((v) => v !== value)
          : [...s.hoaAmenities, value],
      };
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: integrate API call
      // payload idea:
      // const payload = { ...form, images }; // images => upload first, send URLs
      // await api.createProperty(payload)
      alert("Property saved (demo). Wire this to your API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        <span className="hover:underline cursor-pointer">Dashboard</span> /{" "}
        <span className="text-neutral-700 dark:text-neutral-200">Add property</span>
      </div>

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Add property
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Provide complete details. Fields marked * are required.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            {submitting ? "Saving…" : "Save property"}
          </button>
        </div>
      </div>

      {/* Image Section */}
      <SectionCard title="Images" subtitle="Upload clear, well-lit photos (max 5).">
        <ImageUploader images={images} setImages={setImages} />
      </SectionCard>

      {/* Property Information */}
      <SectionCard title="Property Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Property name" required>
            <input
              className={inputBase}
              placeholder="The Painted Lady"
              value={form.title}
              onChange={onChange("title")}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Currency" required>
              <select
                className={selectBase}
                value={form.currency}
                onChange={onChange("currency")}
              >
                <option>USD</option>
                <option>CAD</option>
              </select>
            </Field>
            <Field label="Price (min)" required>
              <input
                className={inputBase}
                type="number"
                min={0}
                placeholder="690000"
                value={form.priceMin}
                onChange={onChange("priceMin")}
              />
            </Field>
            <Field label="Price (max)" required>
              <input
                className={inputBase}
                type="number"
                min={0}
                placeholder="735000"
                value={form.priceMax}
                onChange={onChange("priceMax")}
              />
            </Field>
          </div>

          <Field label="Property type" required>
            <select
              className={selectBase}
              value={form.type}
              onChange={onChange("type")}
            >
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tenure">
            <select
              className={selectBase}
              value={form.tenure}
              onChange={onChange("tenure")}
            >
              <option value="">Select tenure</option>
              {TENURE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Beds" required>
              <input
                className={inputBase}
                type="number"
                min={0}
                value={form.beds}
                onChange={onChange("beds")}
              />
            </Field>
            <Field label="Baths" required>
              <input
                className={inputBase}
                type="number"
                min={0}
                value={form.baths}
                onChange={onChange("baths")}
              />
            </Field>
            <Field label="Sqft" required>
              <input
                className={inputBase}
                type="number"
                min={0}
                value={form.sqft}
                onChange={onChange("sqft")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Year built">
              <input
                className={inputBase}
                type="number"
                min={1700}
                max={new Date().getFullYear()}
                value={form.yearBuilt}
                onChange={onChange("yearBuilt")}
              />
            </Field>
            <Field label="Units">
              <input
                className={inputBase}
                type="number"
                min={0}
                value={form.units}
                onChange={onChange("units")}
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* Location Information */}
      <SectionCard title="Location Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Address" required>
            <input
              className={inputBase}
              placeholder="1234 Baker Street"
              value={form.address}
              onChange={onChange("address")}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Street">
              <input
                className={inputBase}
                value={form.street}
                onChange={onChange("street")}
              />
            </Field>
            <Field label="Street number">
              <input
                className={inputBase}
                value={form.streetNo}
                onChange={onChange("streetNo")}
              />
            </Field>
            <Field label="Area">
              <input
                className={inputBase}
                value={form.area}
                onChange={onChange("area")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Field label="City" required>
              <input
                className={inputBase}
                value={form.city}
                onChange={onChange("city")}
              />
            </Field>
            <Field label="Province/State" required>
              <input
                className={inputBase}
                value={form.province}
                onChange={onChange("province")}
              />
            </Field>
            <Field label="Postal/ZIP" required>
              <input
                className={inputBase}
                value={form.postalCode}
                onChange={onChange("postalCode")}
              />
            </Field>
            <Field label="Country">
              <input
                className={inputBase}
                value={form.country}
                onChange={onChange("country")}
              />
            </Field>
          </div>

          <Field
            label="Google map link"
            hint="Paste a full Google Maps URL"
          >
            <input
              className={inputBase}
              placeholder="https://maps.google.com/…"
              value={form.gmap}
              onChange={onChange("gmap")}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Interior Information */}
      <SectionCard title="Interior Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Heating">
            <select
              className={selectBase}
              value={form.heating}
              onChange={onChange("heating")}
            >
              <option value="">Select heating</option>
              {HEATING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cooling">
            <select
              className={selectBase}
              value={form.cooling}
              onChange={onChange("cooling")}
            >
              <option value="">Select cooling</option>
              {COOLING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Flooring">
            <input
              className={inputBase}
              placeholder="Hardwood, Tile, Carpet"
              value={form.flooring}
              onChange={onChange("flooring")}
            />
          </Field>

          <Field label="Appliances">
            <input
              className={inputBase}
              placeholder="Fridge, Stove, Dishwasher"
              value={form.appliances}
              onChange={onChange("appliances")}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Exterior Information */}
      <SectionCard title="Exterior Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Lot size">
            <input
              className={inputBase}
              placeholder="e.g., 6,000 sqft"
              value={form.lotSize}
              onChange={onChange("lotSize")}
            />
          </Field>

          <Field label="Parking">
            <select
              className={selectBase}
              value={form.parking}
              onChange={onChange("parking")}
            >
              <option value="">Select parking</option>
              {PARKING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="View">
            <select
              className={selectBase}
              value={form.view}
              onChange={onChange("view")}
            >
              <option value="">Select view</option>
              {VIEW_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Exterior features">
            <input
              className={inputBase}
              placeholder="Garden, Fire pit, Fenced yard"
              value={form.exteriorFeatures}
              onChange={onChange("exteriorFeatures")}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Building & Community Information */}
      <SectionCard title="Building & Community Information">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="HOA/Strata fee (monthly)">
              <input
                className={inputBase}
                type="number"
                min={0}
                value={form.hoa}
                onChange={onChange("hoa")}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Community amenities">
                <div className="flex flex-wrap gap-2">
                  {HOA_AMENITIES.map((a) => {
                    const active = form.hoaAmenities.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={`rounded-full border px-3 py-1.5 text-sm ${
                          active
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                            : "border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Financial Information */}
      <SectionCard title="Financial Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Property taxes (annual)">
            <input
              className={inputBase}
              type="number"
              min={0}
              value={form.taxes}
              onChange={onChange("taxes")}
            />
          </Field>
          <Field label="Tax year">
            <input
              className={inputBase}
              type="number"
              min={1990}
              max={new Date().getFullYear()}
              value={form.taxYear}
              onChange={onChange("taxYear")}
            />
          </Field>
          <Field label="Expected rent (if applicable)">
            <input
              className={inputBase}
              type="number"
              min={0}
              value={form.rent}
              onChange={onChange("rent")}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Legal & Additional Information */}
      <SectionCard title="Legal & Additional Information">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="MLS® #" hint="Enter MLS ID if available">
              <input
                className={inputBase}
                value={form.mls}
                onChange={onChange("mls")}
              />
            </Field>
            <Field label="Legal description">
              <input
                className={inputBase}
                placeholder="Lot, Plan, District…"
                value={form.legalDesc}
                onChange={onChange("legalDesc")}
              />
            </Field>
            <Field label="Disclosures">
              <input
                className={inputBase}
                placeholder="e.g., PCDS available"
                value={form.disclosures}
                onChange={onChange("disclosures")}
              />
            </Field>
          </div>

          <Field label="Remarks / Description">
            <textarea
              className={textareaBase}
              placeholder="Highlight the best features…"
              value={form.remarks}
              onChange={onChange("remarks")}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Bottom actions */}
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
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {submitting ? "Saving…" : "Save property"}
        </button>
      </div>
    </form>
  );
}
