// src/components/media_uploader/MediaUploader.jsx
import { useId, useRef, useState } from "react";

// Backend-allowed types
const IMG_MIME = ["image/jpeg", "image/jpg", "image/png"];
const VID_MIME = ["video/mp4", "video/quicktime"]; // .mov
const ACCEPT = [...IMG_MIME, ...VID_MIME].join(",");

const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB
const MAX_FILES = 40;

export default function MediaUploader({ value = [], onChange, subtypeForResource }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const addFiles = (files) => {
    const errs = [];
    const next = [];

    Array.from(files).forEach((file) => {
      const type = (file.type || "").toLowerCase();
      const isImage = IMG_MIME.includes(type);
      const isVideo = VID_MIME.includes(type);

      if (!isImage && !isVideo) {
        errs.push(`${file.name}: unsupported type`);
        return;
      }
      if (isImage && file.size > MAX_IMAGE_BYTES) {
        errs.push(`${file.name}: images must be ≤ 1MB`);
        return;
      }
      const url = URL.createObjectURL(file);

      // Shape mirrors backend PropertyMediaSchema
      next.push({
        id: crypto.randomUUID(),         // local only
        file,                            // local only (upload later)
        previewURL: url,                 // local preview
        mediaKey: crypto.randomUUID(),   // server can replace
        mediaCategory: isImage ? "Photo" : "Video",
        mediaURL: "",                    // set after upload to DO
        mediaObjectID: "",               // set after upload to DO
        mimeType: type,
        order: (value?.length || 0) + next.length - 1,
        mediaSize: file.size,
        resourceName: subtypeForResource || "", // must be one of PROPERTY_SUBTYPES
        shortDescription: "",
      });
    });

    // cap count
    const total = (value?.length || 0) + next.length;
    if (total > MAX_FILES) {
      const allowed = MAX_FILES - (value?.length || 0);
      next.splice(allowed);
      errs.push(`Max ${MAX_FILES} media files allowed.`);
    }

    setErrors(errs);
    if (next.length) onChange([...(value || []), ...next]);
  };

  const removeId = (id) => {
    const toRevoke = value?.find((m) => m.id === id)?.previewURL;
    if (toRevoke) URL.revokeObjectURL(toRevoke);
    onChange(value.filter((m) => m.id !== id).map((m, idx) => ({ ...m, order: idx })));
  };

  return (
    <div className="flex flex-col gap-3">
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          <ul className="list-disc pl-5 space-y-0.5">
            {errors.map((e, i) => (<li key={i}>{e}</li>))}
          </ul>
        </div>
      )}

      {/* Choose file + drag/drop */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Choose Files
        </button>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          JPEG/JPG/PNG ≤ 1MB, or MP4/MOV (Max {MAX_FILES})
        </p>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
        }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 17V7a2 2 0 0 1 2-2h7" />
          <path d="M7 17h10a2 2 0 0 0 2-2V7" />
          <path d="M21 15l-3-3-4 4-3-3-4 4" />
        </svg>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">Drag & drop media here</p>
      </div>

      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        {(value?.length || 0)} / {MAX_FILES} files
      </div>

      {/* Grid (image/video) */}
      {value?.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {value.map((m) => (
            <li key={m.id} className="group relative overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
              {m.mimeType.startsWith("image/") ? (
                <img src={m.previewURL} alt="" className="h-24 w-full object-cover" />
              ) : (
                <video src={m.previewURL} className="h-24 w-full object-cover" />
              )}
              <span className="absolute left-1 top-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                {m.mediaCategory}
              </span>
              <button
                type="button"
                onClick={() => removeId(m.id)}
                className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
