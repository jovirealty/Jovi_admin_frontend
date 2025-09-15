import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { findAgent } from "../../data/agents";
import { useState } from "react";

function Pill({ value }) {
  return (
    <span
      className={[
        "inline-flex h-7 min-w-14 items-center justify-center rounded-full px-3 text-xs font-medium",
        value ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function DeleteConfirm({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
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

export default function AdministratorShowDrawer() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();
  const admin = findAgent(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!admin) {
    // If no record, just close
    navigate(`/administrators?page=${page}`, { replace: true });
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={() => navigate(`/administrators?page=${page}`)}
      />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 h-full w-[420px] overflow-y-auto border-l border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            aria-label="Close"
            onClick={() => navigate(`/administrators?page=${page}`)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
            title="Close"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to={`/administrators/${id}/edit?page=${page}`}
              className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Edit
            </Link>
            <button
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Show</h2>

        {/* Image placeholder */}
        <div className="mb-8 flex items-center justify-center">
          <div className="h-44 w-44 rounded-md bg-gray-100" />
        </div>

        {/* Details */}
        <div className="space-y-6 text-sm">
          <div>
            <div className="mb-1 text-gray-500">ID</div>
            <div className="font-medium text-gray-900">{admin.id}</div>
          </div>
          <div>
            <div className="mb-1 text-gray-500">Name</div>
            <div className="font-medium text-gray-900">{admin.name}</div>
          </div>
          <div>
            <div className="mb-1 text-gray-500">Super Admin?</div>
            <Pill value={admin.superAdmin} />
          </div>
          <div>
            <div className="mb-1 text-gray-500">Email</div>
            <div className="break-all text-gray-900">{admin.email}</div>
          </div>
          <div>
            <div className="mb-1 text-gray-500">Created</div>
            <div className="text-gray-900">{admin.createdAt}</div>
          </div>
          <div>
            <div className="mb-1 text-gray-500">Updated</div>
            <div className="text-gray-900">{admin.updatedAt}</div>
          </div>
        </div>
      </aside>

      {/* Delete Confirm modal (center) */}
      <DeleteConfirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert("Deleted (demo). Hook API call here.");
          navigate(`/administrators?page=${page}`);
        }}
      />
    </>
  );
}
