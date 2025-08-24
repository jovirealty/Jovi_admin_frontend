import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <section className="min-h-[60vh] grid place-items-center">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-10 dark:bg-neutral-950">
        {/* Eyebrow + code */}
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            404
          </span>

          {/* The path that wasn’t found (optional, helps debugging) */}
          <code className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[60%]">
            {pathname}
          </code>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Page not found
        </h1>

        {/* Copy */}
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-neutral-900 text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
          >
            ← Back to dashboard
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm ring-1 ring-black/10 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Go back
          </button>
        </div>
      </div>
    </section>
  )
}
