import { useId, useRef, useState } from "react";

const ACCEPT = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_FILES = 5;

export default function ImageUploader({ images, setImages }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const validateFiles = (files) => {
    const errs = [];
    const valid = [];
    const current = images.length;

    Array.from(files).forEach((file) => {
      if (!ACCEPT.includes(file.type)) {
        errs.push(`${file.name}: invalid file type`);
        return;
      }
      if (file.size > MAX_SIZE) {
        errs.push(`${file.name}: exceeds 1MB`);
        return;
      }
      valid.push(file);
    });

    if (current + valid.length > MAX_FILES) {
      errs.push(`You can upload up to ${MAX_FILES} images total.`);
      const allowed = Math.max(0, MAX_FILES - current);
      valid.splice(allowed);
    }
    return { valid, errs };
  };

  const handleFiles = (fileList) => {
    const { valid, errs } = validateFiles(fileList);
    setErrors(errs);
    if (!valid.length) return;

    const next = valid.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next]);
  };

  const onFileChange = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeImg = (id) => {
    setImages((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          <ul className="list-disc pl-5 space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Choose file button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Choose Files
        </button>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          JPEG, JPG, or PNG — up to 1MB each (max {MAX_FILES})
        </p>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          className="sr-only"
          onChange={onFileChange}
        />
      </div>

      {/* Drag & drop area */}
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-neutral-500 dark:text-neutral-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 17V7a2 2 0 0 1 2-2h7" />
          <path d="M7 17h10a2 2 0 0 0 2-2V7" />
          <path d="M21 15l-3-3-4 4-3-3-4 4" />
        </svg>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          Drag & drop images here
        </p>
      </div>

      {/* Count */}
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        {images.length} / {MAX_FILES} images
      </div>

      {/* Thumbnails grid */}
      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {images.map((img) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700"
            >
              <img
                src={img.url}
                alt=""
                className="h-24 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImg(img.id)}
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
