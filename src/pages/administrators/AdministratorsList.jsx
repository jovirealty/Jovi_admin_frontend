// src/pages/administrators/AdministratorsList.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, Outlet, useSearchParams } from "react-router-dom";
import { useStaffAccounts } from "../../hooks/useStaffAccounts";
import { Avatar } from "../../components/avatar/Avatar";

const Pill = ({ value }) => (
  <span
    className={[
      "inline-flex h-7 min-w-14 items-center justify-center rounded-full px-3 text-xs font-medium",
      value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
    ].join(" ")}
  >
    {value ? "Yes" : "No"}
  </span>
);

function RowMenu({ onShow, onEdit, onDelete, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-3 top-8 z-20 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      <button onClick={onShow} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h10M7 13h6" />
        </svg>
        Show
      </button>
      <button onClick={onEdit} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5l4 4L7 21l-4 1 1-4 12.5-14.5z" />
        </svg>
        Edit
      </button>
      <button onClick={onDelete} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
        </svg>
        Delete
      </button>
    </div>
  );
}

export default function AdministratorsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(initialPage);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { accounts, loading, error, pages, total } = useStaffAccounts({
    q: query,
    page,
    limit: 25,
  });

  useEffect(() => {
    const s = new URLSearchParams(searchParams);
    s.set("page", String(page));
    setSearchParams(s, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const [selected, setSelected] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [omit, setOmit] = useState(new Set());

  const toNiceDate = (d) => {
    if (!d) return "";
    try { return new Date(d).toISOString().replace("T", " ").slice(0, 16); }
    catch { return ""; }
  };

  const rows = useMemo(() => {
    return (accounts || [])
      .filter((a) => !omit.has(String(a._id || a.id)))
      .map((a) => {
        const id = String(a._id || a.id);
        const isAgent = !!a.isSuperAdmin || (Array.isArray(a.roles) && a.roles.includes("agent"));
        return {
          id,
          photoUrl: a.photoUrl || null,
          fullName: a.fullName || a.email || "(no name)",
          licenseNumber: a.licenseNumber || "",
          superAdmin: isAgent,
          email: a.email || "",
          lastLoginAt: toNiceDate(a.lastLoginAt),
          personalRealEstateCorporationName: a.personalRealEstateCorporationName || "",
        };
      });
  }, [accounts, omit]);

  const toggleAll = () => {
    const ids = rows.map((r) => r.id);
    const allSelected = ids.every((id) => selected.has(id));
    setSelected((s) => {
      const copy = new Set(s);
      ids.forEach((id) => (allSelected ? copy.delete(id) : copy.add(id)));
      return copy;
    });
  };

  const toggleRow = (id) =>
    setSelected((s) => {
      const copy = new Set(s);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

  const goShow = (id) => navigate(`/admin/administrators/${id}/show`);
  const goEdit = (id) => navigate(`/admin/administrators/${id}/edit`);

  const handleDelete = (id) => {
    if (confirm("Do you really want to remove this item?")) {
      setOmit((set) => new Set(set).add(id));
      setOpenMenuId(null);
      setSelected((s) => {
        const copy = new Set(s);
        copy.delete(id);
        return copy;
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-gray-500">
        <button onClick={() => navigate("/admin/dashboard")} className="hover:underline focus:outline-none">
          Dashboard
        </button>{" "}
        / <span className="text-gray-700">Administrators</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Administrators</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={() => alert("Filters coming soon")}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            Filter
          </button>

          <Link
            to="/admin/administrators/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
              <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
            </svg>
            Create new
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 font-medium text-gray-700">
            {total}
          </span>{" "}
          total
        </div>
        <div className="flex w-full gap-2 sm:w-96">
          <input
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full whitespace-nowrap text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">FullName</th>
                <th className="px-4 py-3 font-medium">licenseNumber</th>
                <th className="px-4 py-3 font-medium">Is Agent?</th>
                <th className="px-4 py-3 font-medium">email</th>
                <th className="px-4 py-3 font-medium">lastLoginAt</th>
                <th className="px-4 py-3 font-medium">personalRealEstateCorporationName</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-red-600">
                    Error: {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={row.photoUrl} alt={row.fullName} size={20} />
                        <div className="font-medium text-gray-900">{row.fullName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.licenseNumber}</td>
                    <td className="px-4 py-3">
                      <Pill value={row.superAdmin} />
                    </td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.lastLoginAt}</td>
                    <td className="px-4 py-3">{row.personalRealEstateCorporationName}</td>
                    <td className="relative px-4 py-3">
                      <button
                        className="rounded p-1 hover:bg-gray-100"
                        aria-label="Row actions"
                        onClick={() => setOpenMenuId((s) => (s === row.id ? null : row.id))}
                      >
                        <svg viewBox="0 0 20 20" className="size-5 text-gray-500">
                          <circle cx="3" cy="10" r="2" />
                          <circle cx="10" cy="10" r="2" />
                          <circle cx="17" cy="10" r="2" />
                        </svg>
                      </button>
                      {openMenuId === row.id && (
                        <RowMenu
                          onShow={() => {
                            setOpenMenuId(null);
                            goShow(row.id);
                          }}
                          onEdit={() => {
                            setOpenMenuId(null);
                            goEdit(row.id);
                          }}
                          onDelete={() => handleDelete(row.id)}
                          onClose={() => setOpenMenuId(null)}
                        />
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-gray-500" colSpan={8}>
                    No administrators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm">
          <div className="text-gray-600">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{pages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <button
              className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(pages || 1, p + 1))}
              disabled={page >= (pages || 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
