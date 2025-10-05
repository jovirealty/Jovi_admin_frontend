import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStaffAccount } from "../../hooks/useStaffAccounts";
import { Avatar } from "../../components/avatar/Avatar";

const Pill = ({ value }) => (
  <span className="inline-flex h-7 min-w-14 items-center justify-center rounded-full bg-gray-100 px-3 text-xs font-medium text-gray-600">
    {value ? "Yes" : "No"}
  </span>
);

function DeleteConfirm({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
      <div className="w-[520px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
        <div className="mb-4 text-sm font-semibold text-gray-700">Confirm</div>
        <div className="mb-6 text-sm text-gray-700">Do you really want to remove this item?</div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdministratorShowDrawer() {
  const { id } = useParams();
  console.log("agent value of the ID: ", id)
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  console.log("admin values", admin)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await getStaffAccount(id);
        if (!cancelled) setAdmin(data);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!loading && err) {
    navigate(`/admin/administrators?page=${page}`, { replace: true });
    return null;
  }

  const close = () => navigate(`/admin/administrators?page=${page}`);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={close} />
      <aside className="fixed right-0 top-0 z-50 h-full w-[440px] overflow-y-auto border-l border-gray-200 bg-white p-6">
        {/* Header */}
        
        

        {loading || !admin ? (
          <div className="text-gray-500">Loading…</div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <button
                aria-label="Close"
                onClick={close}
                className="inline-flex size-9 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                title="Close"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <Link
                  to={`/admin/administrators/${admin._id}/edit`}
                  className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </Link>
                <button onClick={() => setConfirmOpen(true)} className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>

            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Show</h2>

            <div className="space-y-6 text-sm">
              {/* Top card with avatar + name/email */}
              <div className="flex items-center gap-3">
                <Avatar src={admin.photoUrl} alt={admin.fullName || admin.email} size={56} className="rounded-xl" />
                <div>
                  <div className="text-base font-semibold text-gray-900">
                    {admin.fullName || admin.email}
                  </div>
                  <div className="text-gray-500">{admin.email}</div>
                </div>
              </div>

              {/* Core fields */}
              <div>
                <div className="mb-1 text-gray-500">Agent ID</div>
                <div className="font-medium text-gray-900">{String(admin.agentListId)}</div>
              </div>

              <div>
                <div className="mb-1 text-gray-500">Is Agent?</div>
                <Pill value={Array.isArray(admin.roles) && admin.roles.includes("agent")} />
              </div>

              {/* Agent-only details (if backend returned them) */}
              {Array.isArray(admin.roles) && admin.roles.includes("agent") && (
                <>
                  <div>
                    <div className="mb-1 text-gray-500">MLS ID</div>
                    <div className="text-gray-900">{admin.mlsId || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">License Number</div>
                    <div className="text-gray-900">{admin.licenseNumber || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Licensed As</div>
                    <div className="text-gray-900">{admin.licensedAs || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Personal Real Estate Corporation Name</div>
                    <div className="text-gray-900">{admin.personalRealEstateCorporationName || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Licensed For</div>
                    <div className="text-gray-900">{admin.licensedFor || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Phone Number</div>
                    <div className="text-gray-900">{admin.phoneNumber || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">Team Name</div>
                    <div className="text-gray-900">{admin.teamName || ""}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-500">About</div>
                    <div className="whitespace-pre-wrap text-gray-900">{admin.aboutUs || ""}</div>
                  </div>
                </>
              )}

              {/* Timestamps (render if present) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-1 text-gray-500">Created</div>
                  <div className="text-gray-900">
                    {admin.createdAt ? new Date(admin.createdAt).toISOString().replace("T", " ").slice(0, 16) : ""}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-gray-500">Updated</div>
                  <div className="text-gray-900">
                    {admin.updatedAt ? new Date(admin.updatedAt).toISOString().replace("T", " ").slice(0, 16) : ""}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      <DeleteConfirm
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
