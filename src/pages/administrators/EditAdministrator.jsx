import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ————————————————————————————————————————————————
// Helper (mock) — keep your existing data fetching
const findAdministrator = (id) => {
  return {
    fullName: "Sample Administrator",
    licenseNumber: "123456",
    email: "sample.admin@jovirealty.com",
    isSuperAdmin: false,
    personalRealEstateCorporationName: "Jovi Realty Corp",
    phoneNumber: "6041234567",
    aboutUs:
      "Sample bio for administrator with experience in real estate management.",
    photoUrl:
      "https://media-jovirealty.s3.ca-central-1.amazonaws.com/Admins/AdminProfiles/sample-admin.jpg",
    accountActive: true,
  };
};

function DeleteConfirm({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:w-[520px]">
        <div className="mb-2 text-base font-semibold text-gray-900">Confirm</div>
        <p className="mb-6 text-sm text-gray-600">Do you really want to remove this administrator?</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// Small inline switch
function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

export default function EditAdministrator() {
  const { agentListId } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const record = findAdministrator(agentListId);
  const [fullName, setFullName] = useState(record?.fullName || "");
  const [email, setEmail] = useState(record?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(record?.phoneNumber || "");
  const [aboutUs, setAboutUs] = useState(record?.aboutUs || "");
  const [personalRealEstateCorporationName, setPersonalRealEstateCorporationName] = useState(
    record?.personalRealEstateCorporationName || "Jovi Realty Corp"
  );
  const [isSuperAdmin, setIsSuperAdmin] = useState(record?.isSuperAdmin || false);
  const [accountActive, setAccountActive] = useState(record?.accountActive ?? true);
  const [photoPreview, setPhotoPreview] = useState(record?.photoUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    else if (!/^[a-zA-Z\s-]+$/.test(fullName)) newErrors.fullName = "Use letters, spaces, and hyphens only.";
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";
    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ""))) newErrors.phoneNumber = "10-digit number required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Administrator updated (demo).");
      navigate(`/admin/administrators?page=${page}`);
    }, 600);
  };

  const handlePhotoClick = () => fileInputRef.current?.click();
  const handleUploadToServer = () => alert("Image uploaded to server (demo).");

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb + actions */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center lg:mb-8">
        <nav className="text-sm text-gray-500">
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <span className="mx-1">/</span>
          <Link to={`/admin/administrators?page=${page}`} className="hover:underline">Administrators</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-700">Edit</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/administrators/${agentListId}/show?page=${page}`}
            className="rounded-xl border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
          >
            Show
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-xl border border-red-600 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Unified white container so the gap between columns is white */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* LEFT: Profile (kept, improved) */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-2xl p-2">
              <div className="flex flex-col items-center text-center">
                {/* Avatar — SQUARE with rounded border */}
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Administrator"
                      className="h-28 w-28 rounded-2xl object-cover shadow-sm ring-1 ring-gray-200"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-100 text-2xl font-semibold text-gray-400 ring-1 ring-gray-200">
                      {fullName?.[0] || "A"}
                    </div>
                  )}
                  <button
                    onClick={handlePhotoClick}
                    className="absolute -bottom-2 -right-2 rounded-xl bg-white p-2 shadow ring-1 ring-gray-300 hover:bg-gray-50"
                    title="Change photo"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-gray-700">
                      <path d="M4 5a2 2 0 012-2h2l1-1h2l1 1h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" fill="currentColor" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>

                {/* Name + role */}
                <div className="mt-4">
                  <p className="text-base font-semibold text-gray-900">{fullName}</p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>

                {/* Account Active switch (replaces stats & side menu) */}
                <div className="mt-6 w-full">
                  <div className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Account Active</span>
                    <Switch checked={accountActive} onChange={setAccountActive} />
                  </div>
                  <p className="mt-2 text-left text-xs text-gray-500">
                    Toggle to deactivate or reactivate the account.
                  </p>
                </div>

                {/* Upload button only when file selected */}
                {selectedFile && (
                  <button
                    onClick={handleUploadToServer}
                    className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    Upload to Server
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT: Form with borders on all inputs */}
          <section className="lg:col-span-8 xl:col-span-9">
            <form onSubmit={onSubmit}>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Personal Information</h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="flex rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="inline-flex items-center rounded-l-xl bg-gray-50 px-3 text-gray-500">
                      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H5z"/></svg>
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-r-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                </div>

                {/* License Number */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    value={record.licenseNumber}
                    disabled
                    className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="flex rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="inline-flex items-center rounded-l-xl bg-gray-50 px-3 text-gray-500">@</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-r-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="flex rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="inline-flex items-center rounded-l-xl bg-gray-50 px-3 text-gray-500">
                      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="block w-full rounded-r-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                      title="10-digit number (e.g., 6041234567)"
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
                </div>

                {/* PREC */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Personal Real Estate Corporation Name</label>
                  <select
                    value={personalRealEstateCorporationName}
                    onChange={(e) => setPersonalRealEstateCorporationName(e.target.value)}
                    className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Jovi Realty Corp">Jovi Realty Corp</option>
                    <option value="Vancouver Properties Inc">Vancouver Properties Inc</option>
                    <option value="Pacific Real Estate Group">Pacific Real Estate Group</option>
                    <option value="Metro Homes Ltd">Metro Homes Ltd</option>
                    <option value="Coastal Estates LLC">Coastal Estates LLC</option>
                  </select>
                </div>
              </div>

              {/* About */}
              <div className="mt-7">
                <label className="mb-1 block text-sm font-medium text-gray-700">About Us (Bio)</label>
                <div className="overflow-hidden rounded-2xl border border-gray-300">
                  <textarea
                    value={aboutUs}
                    onChange={(e) => setAboutUs(e.target.value)}
                    className="min-h-[110px] w-full resize-y border-0 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    placeholder="Write a short introduction"
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/administrators?page=${page}`)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm ring-1 ring-blue-600/20 transition hover:bg-blue-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      <DeleteConfirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert("Administrator deleted (demo). Hook API call here.");
          navigate(`/admin/administrators?page=${page}`);
        }}
      />
    </div>
  );
}
