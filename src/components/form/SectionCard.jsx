export default function SectionCard({ title, subtitle, children }) {
  return (
    <section className="mb-6">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-4">{children}</div>
      </div>
    </section>
  );
}
