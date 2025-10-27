import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// UI components
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ContentEditor from "../../components/contentEditor/ContentEditor";
import useResourceCreation from "../../hooks/resourceshooks/useResourceCreation";

// Tiptap (imported in ContentEditor)

// Styles shared across app (tailwind)
const pillBase =
  "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors cursor-pointer";
const pillActive =
  "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";
const pillInactive =
  "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800";

const inputBase =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-100";

const cardBase =
  "rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white dark:bg-neutral-900";

const btnBlue =
  "inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors";

const CATEGORIES = ["news", "blog", "podcast", "e-book"];

/* Little input shell (consistent with Edit) */
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

export default function ResourceAdd() {
  const navigate = useNavigate();
  const { createResource, loading, error } = useResourceCreation();

  // form state
  const [category, setCategory] = useState("blog");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [publish, setPublish] = useState(true);

  // cover
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const coverInputRef = useRef(null);

  // properties
  const [tags, setTags] = useState(["design", "ux"]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");  // Renamed for schema consistency
  const [metaKeywords, setMetaKeywords] = useState("");
  const [resourceMedia, setResourceMedia] = useState("");

  // editor state (passed to ContentEditor)
  const [content, setContent] = useState("<p></p>");

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed for Cover.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Cover must be ≤ 1.5MB");
      return;
    }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverUrl("");
    coverInputRef.current.value = "";
  };

  const handleTagsChange = (e) => {
    setTags(
      e.target.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      alert(error);
      return;
    }

    try {
      await createResource({
        category,
        title,
        subTitle,
        content,
        properties: {
          tags,
          metaTitle,
          metaDescription: "this is static from code",
          metaKeywords,
        },
        resourceMedia: resourceMedia.split(',').map(m => m.trim()).filter(Boolean),
        publish,
        coverFile,
      });
      alert("Resource created successfully!");
      navigate("/admin/resources");
    } catch (err) {
      alert(error || "Failed to create resource.");
    }
  };

  const crumbs = useMemo(
    () => [
      { label: "Dashboard", to: "/admin" },
      { label: "Resources", to: "/admin/resources" },
      { label: "Create resource" },
    ],
    []
  );

  return (
    <div className="p-6">
      <Breadcrumbs items={crumbs} />
      <div className="mt-4">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Create Resource
        </h1>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
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
                  onClick={() => coverInputRef.current?.click()}
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
                  onChange={handleCoverSelect}
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              JPG/PNG ≤ 1.5MB. Shown at ~320px height.
            </p>
          </section>

          {/* Content */}
          <ContentEditor content={content} onUpdate={setContent} />
        </div>

        {/* RIGHT – properties */}
        <aside className="space-y-6">
          <div className={`${cardBase} p-4`}>
            <h3 className="text-sm font-semibold mb-3 text-neutral-800 dark:text-neutral-100">
              Properties
            </h3>

            {/* Resource Media */}
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                Resource Media (comma-separated URLs)
              </label>
              <Textarea
                value={resourceMedia}
                onChange={(e) => setResourceMedia(e.target.value)}
                placeholder="https://example.com/media1.jpg, https://example.com/video1.mp4"
                rows={2}
              />
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                Tags (add ≥ 2)
              </label>
              <input
                value={tags.join(", ")}
                onChange={handleTagsChange}
                placeholder="Type and press Enter"
                className={inputBase}
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                Meta title
              </label>
              <input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Meta title for SEO"
                className={inputBase}
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                Meta description
              </label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for SEO"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">
                Meta keywords
              </label>
              <input
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="keyword, another, more"
                className={inputBase}
              />
            </div>

            {/* Publish */}
            <div className="mb-4 flex items-center gap-2">
              <input
                id="publish"
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="publish" className="text-sm text-neutral-700 dark:text-neutral-200">
                Publish
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button type="button" className={btnGhost} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className={btnBlue} disabled={loading}>
                {loading ? "Creating..." : "Create post"}
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}