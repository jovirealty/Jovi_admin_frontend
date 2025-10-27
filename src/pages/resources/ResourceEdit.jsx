import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* UI bits already used elsewhere in your app */
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import Loader from "../../components/loaders/Loader";
import ContentEditor from "../../components/contentEditor/ContentEditor";
import { mockResources } from "../../data/resources";

/* ---- Constants ---- */
const CATEGORIES = ["news", "blog", "podcast", "e-book"];
const MAX_COVER_MB = 1.5;
const MAX_COVER_BYTES = MAX_COVER_MB * 1024 * 1024;

/* Little input shell (keeps styles consistent with the Add page) */
const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={
      "w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-sm " +
      "shadow-sm outline-none transition focus:border-neutral-400 dark:border-neutral-800 " +
      "dark:bg-neutral-900 dark:text-neutral-100 " +
      className
    }
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={
      "w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-sm " +
      "shadow-sm outline-none transition focus:border-neutral-400 dark:border-neutral-800 " +
      "dark:bg-neutral-900 dark:text-neutral-100 " +
      className
    }
  />
);

/* ---- Fake API (now uses mock data) ---- */
async function fetchResourceById(id) {
  // Simulate delay
  await new Promise((r) => setTimeout(r, 400));
  const data = mockResources.find(r => r.id === id) || {};
  return {
    id,
    category: data.category || "blog",
    title: data.title || "",
    subTitle: data.subTitle || "",
    content: data.content || "<p></p>",
    coverUrl: data.coverPhoto || "",
    tags: data.properties?.tags || [],
    metaTitle: data.properties?.metaTitle || "",
    metaDescription: data.properties?.metaDescription || "",
    metaKeywords: data.properties?.metaKeywords || "",
    resourceMedia: data.resourceMedia?.join(', ') || "",
    published: !!data.publish,
  };
}

async function updateResource(id, payload) {
  // Simulate delay; in real app, PUT /api/resources/:id
  await new Promise((r) => setTimeout(r, 600));
  // Mock: "update" by finding and patching (for demo)
  const index = mockResources.findIndex(r => r.id === id);
  if (index !== -1) {
    mockResources[index] = { ...mockResources[index], ...payload };
  }
  return { ok: true };
}

/* ---- Component ---- */
export default function ResourceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form state
  const [category, setCategory] = useState("blog");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [resourceMedia, setResourceMedia] = useState("");
  const [published, setPublished] = useState(true);
  const [content, setContent] = useState("<p></p>"); // For ContentEditor

  const coverInputRef = useRef(null);

  /* Load resource on mount */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchResourceById(id);
        if (!alive) return;
        setCategory(data.category);
        setTitle(data.title);
        setSubTitle(data.subTitle);
        setCoverUrl(data.coverUrl || "");
        setTags(Array.isArray(data.tags) ? data.tags : []);
        setMetaTitle(data.metaTitle || "");
        setMetaDescription(data.metaDescription || "");
        setMetaKeywords(data.metaKeywords || "");
        setResourceMedia(data.resourceMedia || "");
        setPublished(!!data.published);
        setContent(data.content || "<p></p>"); // Populates editor with HTML (tags/images)
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  /* Cover handlers */
  function onPickCover() {
    coverInputRef.current?.click();
  }

  function onCoverFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed for Cover.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      alert(`Cover must be ≤ ${MAX_COVER_MB}MB`);
      e.target.value = "";
      return;
    }

    setCoverFile(file);

    // Preview immediately
    const reader = new FileReader();
    reader.onload = () => setCoverUrl(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  }

  function removeCover() {
    setCoverFile(null);
    setCoverUrl("");
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function addTagFromInput(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = e.currentTarget.value.trim();
    if (!value) return;
    setTags((prev) =>
      prev.includes(value) ? prev : [...prev, value].slice(0, 12)
    );
    e.currentTarget.value = "";
  }
  function removeTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    try {
      // In real app: Upload coverFile, update coverUrl; PUT payload with content (HTML)
      const payload = {
        category,
        title: title.trim(),
        subTitle: subTitle.trim(),
        content, // Full HTML – tags/images preserved
        coverPhoto: coverUrl,
        properties: {
          tags,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          metaKeywords: metaKeywords.trim(),
        },
        resourceMedia: resourceMedia.split(',').map(m => m.trim()).filter(Boolean),
        publish: published,
      };
      const res = await updateResource(id, payload);
      if (res?.ok) {
        navigate("/admin/resources");
      } else {
        alert("Saving failed. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  const crumbs = useMemo(
    () => [
      { label: "Dashboard", to: "/admin" },
      { label: "Resources", to: "/admin/resources" },
      { label: "Edit resource" },
    ],
    []
  );

  if (loading) {
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumbs items={crumbs} />
      <div className="mt-4">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Edit Resource
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT – main content */}
        <div className="space-y-6">
          {/* Category selector */}
          <section>
            <div className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              CATEGORY
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={
                    "rounded-md border px-3 py-1.5 text-sm capitalize transition " +
                    (category === cat
                      ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200")
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Title */}
          <section>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Title
            </label>
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </section>

          {/* Subtitle */}
          <section>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Subtitle
            </label>
            <Input
              placeholder="Post subtitle"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </section>

          {/* Cover */}
          <section>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Cover
            </label>
            <div
              className={
                "relative overflow-hidden rounded-md border border-dashed border-neutral-300 " +
                "dark:border-neutral-800"
              }
            >
              <div className="h-[320px] w-full bg-neutral-50 dark:bg-neutral-900">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                    Drop or select a file
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/25 to-transparent p-2">
                <button
                  type="button"
                  onClick={onPickCover}
                  className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow hover:bg-white"
                >
                  Choose image
                </button>
                {coverUrl && (
                  <button
                    type="button"
                    onClick={removeCover}
                    className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-red-600 shadow hover:bg-white"
                    title="Remove cover"
                  >
                    Delete
                  </button>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onCoverFile}
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              JPG/PNG ≤ {MAX_COVER_MB}MB. Shown at ~320px height.
            </p>
          </section>

          {/* Content */}
          <ContentEditor content={content} onUpdate={setContent} />
        </div>

        {/* RIGHT – properties & actions */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="mb-4 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Properties
            </h3>

            {/* Tags */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      aria-label={`Remove ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  onKeyDown={addTagFromInput}
                  placeholder="Type and press Enter"
                  className="min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Resource Media */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Resource Media (comma-separated URLs)
              </label>
              <Textarea
                rows={2}
                value={resourceMedia}
                onChange={(e) => setResourceMedia(e.target.value)}
                placeholder="https://example.com/media1.jpg, https://example.com/video1.mp4"
              />
            </div>

            {/* Meta fields */}
            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Meta title
              </label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Meta title for SEO"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Meta description
              </label>
              <Textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for SEO"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Meta keywords
              </label>
              <Input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="keyword, another, more"
              />
            </div>

            {/* Publish */}
            <div className="mb-2 flex items-center gap-2">
              <input
                id="publish"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              <label
                htmlFor="publish"
                className="text-sm text-neutral-700 dark:text-neutral-300"
              >
                Publish
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin/resources")}
                className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}