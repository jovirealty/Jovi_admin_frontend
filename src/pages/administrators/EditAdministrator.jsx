import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStaffAccount, updateAgentAndStaffProfile } from "../../hooks/useStaffAccounts";
import { ConfirmModel } from "../../components/model_dialog/ConfirmModel";

// Helper to format dates for readonly display
const fmt = (v) => (v ? new Date(v).toLocaleString() : "—");

export default function EditAdministrator() {
  const { id } = useParams(); // staff account _id
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // Raw payload fetched from API (combined view of staff + agentLists)
  const [admin, setAdmin] = useState(null);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mlsId, setMlsId] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licensedAs, setLicensedAs] = useState("");
  const [licensedFor, setLicensedFor] = useState("");
  const [personalRealEstateCorporationName, setPrecName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [joviEmail, setJoviEmail] = useState("");
  const [knownAs, setKnownAs] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  // Non-editable reference data
  const [agentListId, setAgentListId] = useState("");
  const [roles, setRoles] = useState([]);
  const [lastLoginAt, setLastLoginAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await getStaffAccount(id);
        if (cancelled) return;
        setAdmin(data);
        // Prefill
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setMlsId(data.mlsId || "");
        setLicenseNumber(data.licenseNumber || "");
        setLicensedAs(data.licensedAs || "");
        setLicensedFor(data.licensedFor || "");
        setPrecName(data.personalRealEstateCorporationName || "");
        setPhoneNumber(data.phoneNumber || "");
        setTeamName(data.teamName || "");
        setAboutUs(data.aboutUs || "");
        setPhotoUrl(data.photoUrl || "");
        setJoviEmail(data.joviEmail || "");
        setKnownAs(data.knownAs || "");
        setAgentListId(data.agentListId || "");
        setRoles(Array.isArray(data.roles) ? data.roles : []);
        setLastLoginAt(data.lastLoginAt || "");
        setCreatedAt(data.createdAt || "");
        setUpdatedAt(data.updatedAt || "");
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load administrator");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Decide which email is locked for auth (cannot change)
  const authEmail = (admin?.email || '').toLowerCase();
  const lockEmail     = !!authEmail && authEmail === (email || '').toLowerCase();
  const lockJoviEmail = !!authEmail && authEmail === (joviEmail || '').toLowerCase();
  const emailHelp = "This email is used for authentication. If you want to change it, please contact an administrator.";

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        fullName,
        knownAs,
        licensedAs,
        licensedFor,
        personalRealEstateCorporationName,
        phoneNumber,
        aboutUs,
      };
      if (!lockEmail) payload.email = email;
      if (!lockJoviEmail) payload.joviEmail = joviEmail;

      await updateAgentAndStaffProfile(id, payload, photoFile || undefined);
      // Redirect to SHOW (route expects agentListId)
      navigate(`/admin/administrators/${agentListId}/show?page=${page}`);
    } catch (e2) {
      alert(e2?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const readOnlyFields = useMemo(
    () => [
      { label: "_id (staff account)", value: id },
      { label: "agentListId", value: agentListId },
      { label: "roles", value: roles.join(", ") || "—" },
      { label: "lastLoginAt", value: fmt(lastLoginAt) },
      { label: "createdAt", value: fmt(createdAt) },
      { label: "updatedAt", value: fmt(updatedAt) },
    ],
    [id, agentListId, roles, lastLoginAt, createdAt, updatedAt]
  );

  if (loading) return <div className="p-8 text-sm text-gray-600">Loading…</div>;
  if (err) return <div className="p-8 text-sm text-red-600">{err}</div>;

  return (
    <>
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <nav className="text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span className="mx-1">/</span>
            <Link to={`/admin/administrators?page=${page}`} className="hover:underline">Administrators</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-700">Edit</span>
          </nav>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:p-8">
          <h1 className="mb-6 text-xl font-semibold text-gray-900">Edit administrator</h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Avatar card */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-gray-200" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 ring-1 ring-gray-200">Avatar</div>
                  )}
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Change avatar
                    </button>
                    <p className="mt-2 text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
                <label className="mt-4 block text-sm font-medium text-gray-700">photoUrl</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Main form */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">fullName</label>
                  <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    disabled={lockEmail}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {lockEmail && <p className="mt-1 text-xs text-red-600">{emailHelp}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">joviEmail</label>
                  <input
                    type="email"
                    value={joviEmail}
                    onChange={(e)=>setJoviEmail(e.target.value)}
                    disabled={lockJoviEmail}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {lockJoviEmail && <p className="mt-1 text-xs text-red-600">{emailHelp}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">mlsId</label>
                  <input value={mlsId} readOnly className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">licenseNumber</label>
                  <input value={licenseNumber} readOnly className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">licensedAs</label>
                  <input value={licensedAs} onChange={(e)=>setLicensedAs(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">licensedFor</label>
                  <input value={licensedFor} onChange={(e)=>setLicensedFor(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">personalRealEstateCorporationName</label>
                  <input value={personalRealEstateCorporationName} onChange={(e)=>setPrecName(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">knownAs</label>
                  <input value={knownAs} onChange={(e)=>setKnownAs(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">phoneNumber</label>
                  <input value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">teamName</label>
                  <input value={teamName} onChange={(e)=>setTeamName(e.target.value)} className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">aboutUs</label>
                  <textarea value={aboutUs} onChange={(e)=>setAboutUs(e.target.value)} className="block min-h-[110px] w-full rounded-2xl border border-gray-300 p-3 text-sm" />
                </div>
              </div>

              {/* Readonly group */}
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {readOnlyFields.map((f) => (
                  <div key={f.label}>
                    <label className="mb-1 block text-sm font-medium text-gray-700">{f.label}</label>
                    <input value={f.value} readOnly className="block w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700" />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button onClick={() => setConfirmOpen(true)} className="rounded-lg cursor-pointer border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  Delete Account
                </button>
                <Link to={`/admin/administrators/${id}/show`} className="rounded-xl cursor-pointer border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">Show</Link>
                <button type="button" onClick={() => navigate(`/admin/administrators?page=${page}`)} className="rounded-xl cursor-pointer bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm ring-1 ring-blue-600/20 transition hover:bg-blue-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                  </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModel
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert("Deleted (demo). Hook API call here.");
          navigate(`/admin/administrators?page=${page}`);
        }}
      />
    </>
  );
}
