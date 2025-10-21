export default function ListingTypeTabs({ mode, setMode }) {
  const base =
    "w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium border transition";
  const on = "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500";
  const off =
    "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800/60";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`${base} ${mode === "sale" ? on : off}`}
        onClick={() => setMode("sale")}
      >
        For Sale
      </button>
      <button
        type="button"
        className={`${base} ${mode === "rent" ? on : off}`}
        onClick={() => setMode("rent")}
      >
        For Rent
      </button>
    </div>
  );
}
