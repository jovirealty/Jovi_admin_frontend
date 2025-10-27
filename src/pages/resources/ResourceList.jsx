import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// If you already have these, great. Otherwise the fallbacks below still render fine.
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import Loader from "../../components/loaders/Loader";
import { mockResources, categoryColors } from "../../data/resources";

const CATEGORIES = ["all", "news", "blog", "podcast", "e-book"];

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 text-sm font-medium transition " +
        (active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800")
      }
    >
      {children}
    </button>
  );
}

function Badge({ children, tone = "default" }) {
  const cls =
    tone === "published"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
      : "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}>
      {children}
    </span>
  );
}

function CategoryBadge({ category }) {
  const catName = category.charAt(0).toUpperCase() + category.slice(1);
  const cls = categoryColors[catName.replace('-', ' ')] || "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}>
      {catName.replace('-', ' ')}
    </span>
  );
}

function ResourceCard({ item, onEdit }) {
  const badgeTone = item.status === "Published" ? "published" : "default";
  const excerpt = item.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'; // Strip HTML, truncate

  return (
    <div className="group flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md dark:bg-neutral-950 dark:ring-white/10">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Badge tone={badgeTone}>{item.status}</Badge>
          <CategoryBadge category={item.category} />
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.date}</span>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {item.subTitle}
          </p>
          <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-300">
            {excerpt}
          </p>
        </div>
        <div className="col-span-2 relative">
          <img
            src={item.coverPhoto}
            alt=""
            className="h-40 w-full rounded-xl object-cover"
          />
          <img
            src={item.userDetail.photoUrl}
            alt=""
            className="absolute right-2 top-2 h-8 w-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
          />
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-5 text-xs text-neutral-500 dark:text-neutral-400">
          {/* Mock metrics; replace with real */}
          <span className="inline-flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70"><path fill="currentColor" d="M12 20q-3.775 0-6.388-2.137T2 12q1.225-3.725 3.838-5.863T12 4q3.775 0 6.388 2.137T22 12q-1.225 3.725-3.838 5.863T12 20Zm0-2q2.95 0 5.2-1.675T20.6 12q-1.05-2.65-3.3-4.325T12 6q-2.95 0-5.2 1.675T3.4 12q1.05 2.65 3.3 4.325T12 18Zm0-2.5q1.875 0 3.188-1.312T16.5 11q0-1.875-1.312-3.188T12 6.5q-1.875 0-3.188 1.312T7.5 11q0 1.875 1.312 3.188T12 15.5Z"/></svg>
            1.95k
          </span>
          <span>9.91k views</span>
          <span>9.12k shares</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item.id)}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          {item.publish ? (
            <a
              href="https://jovirealty.com/news-and-resources"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 transition-colors"
            >
              View
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1 rounded-md bg-neutral-300 px-3 py-1 text-xs font-medium text-neutral-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourceList() {
  const navigate = useNavigate();
  const [searchParams, setParams] = useSearchParams();
  const [loading, setLoading] = useState(false); // Mock loading

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCat, setActiveCat] = useState(searchParams.get("cat") || "all");
  const [sortBy, setSortBy] = useState("latest"); // New: sort state

  const filtered = useMemo(() => {
    let rows = mockResources.filter((r) => {
      if (activeCat !== "all" && r.category !== activeCat) return false;
      const q = query.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.subTitle.toLowerCase().includes(q) ||
        r.content.replace(/<[^>]*>/g, '').toLowerCase().includes(q) // Strip HTML for search
      );
    });

    // Apply sorting/filtering
    if (sortBy === "published") {
      rows = rows.filter(r => r.publish === true);
    } else if (sortBy === "draft") {
      rows = rows.filter(r => r.publish === false);
    }
    // Sort by date
    rows.sort((a, b) => {
      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });

    return rows;
  }, [activeCat, query, sortBy]);

  // keep URL in sync
  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (activeCat !== "all") next.set("cat", activeCat);
    setParams(next, { replace: true });
  }, [query, activeCat, setParams]);

  const handleEdit = (id) => {
    navigate(`/admin/resources/edit/${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Header / Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Resources
          </h1>
          <Breadcrumbs
            items={[
              { label: "Dashboard", to: "/admin/dashboard" },
              { label: "Resources" },
            ]}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800"
          >
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 7h18V5H3zm4 6h10v-2H7zm-4 6h18v-2H3z"/></svg>
            Filter
          </button>
          <button
            onClick={() => navigate("/admin/resources/new")}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
            Create new resource
          </button>
        </div>
      </div>

      {/* Search / Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
          >
            <path
              fill="currentColor"
              d="m21 20.3l-5.1-5.1q-.8.7-1.837 1.05T12 16.6q-2.75 0-4.675-1.925T5.4 10q0-2.75 1.925-4.675T12 3.4t4.675 1.925T18.6 10q0 1.175-.35 2.213T17.2 14.05L22.3 19.2zM12 14.6q1.925 0 3.263-1.337T16.6 10q0-1.925-1.337-3.263T12 5.4q-1.925 0-3.263 1.337T7.4 10q0 1.925 1.337 3.263T12 14.6z"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border-0 bg-white pl-9 pr-3 py-2 text-sm text-neutral-900 ring-1 ring-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800"
          />
        </div>

        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          <span className="mr-2 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg px-2 py-1 ring-1 ring-neutral-300 bg-white hover:bg-neutral-50 dark:ring-neutral-700 dark:hover:bg-neutral-800 dark:bg-neutral-900"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-3 pt-1">
        {CATEGORIES.map((c) => (
          <Pill
            key={c}
            active={activeCat === c}
            onClick={() => setActiveCat(c)}
          >
            {c === "all" ? "All" : c.replace("-", " ")}
          </Pill>
        ))}
      </div>

      {/* List / Loader */}
      {loading ? (
        <div className="mt-8">
          {Loader ? (
            <Loader />
          ) : (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Loading…
            </div>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          No resources found.
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((item) => (
            <ResourceCard key={item.id} item={item} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ========= OPTIONAL FALLBACKS (remove if you already have these) ========== */
export function FallbackBreadcrumbs({ items = [] }) {
  return (
    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <span className="opacity-60">•</span>}
          {it.to ? <Link to={it.to} className="hover:underline">{it.label}</Link> : it.label}
        </span>
      ))}
    </div>
  );
}