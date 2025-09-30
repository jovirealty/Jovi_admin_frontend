// src/components/avatar/Avatar.jsx
export function Avatar({ src, alt = "", size = 20, className = "" }) {
  const px = typeof size === "number" ? `${size}px` : size;
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
         <circle cx="32" cy="24" r="14" fill="#e5e7eb"/>
         <path d="M8 56c0-10.5 10.7-16 24-16s24 5.5 24 16" fill="#e5e7eb"/>
       </svg>`
    );

  return (
    <img
      src={src || fallback}
      alt={alt}
      style={{ width: px, height: px }}
      className={`rounded bg-gray-100 object-cover ${className}`}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
    />
  );
}
