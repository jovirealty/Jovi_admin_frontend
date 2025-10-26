// src/pages/admin/PropertyList.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { rows as seed } from "../../data/propertylist";
import Loader from "../../components/loaders/Loader";
import useStaffProperty from "../../hooks/addproperty/admin/useStaffProperty";

function money(n, curr = "CAD") {
  try {
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: curr, maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `${curr} ${Number(n || 0).toLocaleString()}`;
  }
}
const shortAddr = (a = "") => (a.length > 18 ? a.slice(0, 18) + "…" : a);

function RowMenu({ onShow, onEdit, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose?.(); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-3 top-8 z-20 w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      <button onClick={onShow} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10M7 13h6" /></svg>
        Show
      </button>
      <button onClick={onEdit} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5l4 4L7 21l-4 1 1-4 12.5-14.5z" /></svg>
        Edit
      </button>
    </div>
  );
}

export default function PropertyList() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const initialPage = Number(sp.get("page") || 1);
  const [page, setPage] = useState(initialPage);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const { loading, error, data, fetchList } = useStaffProperty();

  useEffect(() => { fetchList(); }, [fetchList]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) =>
      (r.propertyAddress || "").toLowerCase().includes(q) ||
      (r.agentName || "").toLowerCase().includes(q) ||
      (r.propertyType || "").toLowerCase().includes(q)
    );
  }, [data, query]);

  const pageSize = 6;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice  = useMemo(() => filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [filtered, page]);

  useMemo(() => {
    const s = new URLSearchParams(sp);
    s.set("page", String(page));
    setSp(s, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const goShow = (id) => navigate(`/admin/property/${id}/show`);
  const goEdit = (id) => navigate(`/admin/property/${id}/edit`);

  return (
    <div className="p-6">
      <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        <button onClick={() => navigate("/admin/dashboard")} className="hover:underline">Dashboard</button> /
        <span className="ml-1 text-neutral-700 dark:text-neutral-200">Property</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Properties</h1>
        <div className="flex items-center gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800/60" onClick={() => alert("Filters coming soon")}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h18M6 12h12M10 19h4" /></svg>
            Filter
          </button>
          <Link to="/admin/property/add-property" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" /></svg>
            Add Property
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-100 px-2 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{filtered.length}</span> total
        </div>
        <div className="flex w-full gap-2 sm:w-96">
          <input
            placeholder="Search by address, MLS®, agent…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {loading ? (
          <Loader label="Loading properties…" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full whitespace-nowrap text-left">
                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 dark:bg-neutral-900/60 dark:text-neutral-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Property Address</th>
                    <th className="px-4 py-3 font-medium">Agent</th>
                    <th className="px-4 py-3 font-medium">Province</th>
                    <th className="px-4 py-3 font-medium">Listing Price</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Bedrooms</th>
                    <th className="px-4 py-3 font-medium">Square Footage</th>
                    {/* <th className="px-4 py-3 font-medium">MLS®</th> */}
                    <th className="px-4 py-3 font-medium">License</th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm dark:divide-neutral-800">
                  {slice.map((r) => (
                    <tr key={r._id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {r.propertyMedia?.mediaURL ? (
                            <img src={r.propertyMedia.mediaURL} alt="" className="size-10 rounded-lg object-cover" />
                          ) : (
                            <div className="size-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
                          )}
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">{shortAddr(r.propertyAddress || "")}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {r.agentImage ? (
                            <img src={r.agentImage} alt={r.agentName} className="size-6 rounded-full object-cover" />
                          ) : (
                            <div className="size-6 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                          )}
                          <span className="text-neutral-800 dark:text-neutral-200">{r.agentName || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{r.stateProvince || "—"}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{money(r.listPrice, r.currency)}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{r.propertyType || "—"}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{r.bedrooms ?? "—"}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">—</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{r.licenseNumber || "—"}</td>
                      <td className="relative px-4 py-3">
                        <button className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800/60" onClick={() => setOpenMenuId((s) => (s === r._id ? null : r._id))} aria-label="Row actions">
                          <svg viewBox="0 0 20 20" className="size-5 text-neutral-500"><circle cx="3" cy="10" r="2" /><circle cx="10" cy="10" r="2" /><circle cx="17" cy="10" r="2" /></svg>
                        </button>
                        {openMenuId === r._id && (
                          <RowMenu
                            onShow={() => { setOpenMenuId(null); goShow(r._id); }}
                            onEdit={() => { setOpenMenuId(null); goEdit(r._id); }}
                            onClose={() => setOpenMenuId(null)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                  {slice.length === 0 && !loading && (
                    <tr><td colSpan={10} className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400">No properties found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-sm dark:border-neutral-800">
              <div className="text-neutral-600 dark:text-neutral-300">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-neutral-300 px-3 py-1.5 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-200" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</button>
                <button className="rounded-lg border border-neutral-300 px-3 py-1.5 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-200" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}