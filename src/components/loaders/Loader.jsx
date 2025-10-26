export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center py-14">
      <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600 dark:border-neutral-700 dark:border-t-blue-500" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}