import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { findAgent } from "../../data/agents";
import { useState } from "react";

function DeleteConfirm({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-[520px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
        <div className="mb-4 text-sm font-semibold text-gray-700">Confirm</div>
        <div className="mb-6 text-sm text-gray-700">
          Do you really want to remove this item?
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditAdministrator() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();

  const record = findAgent(id);
  const [email, setEmail] = useState(record?.email || "");
  const [name, setName] = useState(record?.name || "");
  const [password, setPassword] = useState("");
  const [superAdmin, setSuperAdmin] = useState(!!record?.superAdmin);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!record) {
    navigate(`/administrators?page=${page}`, { replace: true });
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Saved (demo).");
      navigate(`/administrators?page=${page}`);
    }, 600);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:underline">Dashboard</Link> /{" "}
          <Link to={`/administrators?page=${page}`} className="hover:underline">Administrators</Link>{" "}
          / <span className="text-gray-700">Edit</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/administrators/${id}/show?page=${page}`}
            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            Show
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit</h1>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5">
          {/* Email */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* New Password */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg viewBox="0 0 24 24" className="size-5">
                  <path
                    d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Super Admin */}
          <label className="mt-1 flex items-center gap-3">
            <input
              type="checkbox"
              checked={superAdmin}
              onChange={(e) => setSuperAdmin(e.target.checked)}
              className="size-4 rounded border-gray-300 accent-indigo-600"
            />
            <span className="text-sm text-gray-700">Super Admin?</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/administrators?page=${page}`)}
              className="rounded-lg bg-blue-50 px-5 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>

      <div className="mx-auto mt-6 max-w-4xl text-center text-xs text-gray-400">
        © Jovi Realty {new Date().getFullYear()}.
      </div>

      <DeleteConfirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert("Deleted (demo). Hook API call here.");
          navigate(`/administrators?page=${page}`);
        }}
      />
    </div>
  );
}
