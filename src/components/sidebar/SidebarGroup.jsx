export default function SidebarGroup({ label, open, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <span>{label}</span>
        <svg width="16" height="16" viewBox="0 0 20 20"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" fill="currentColor" />
        </svg>
      </button>
      <div className={`${open ? 'block' : 'hidden'} mt-1`}>{children}</div>
    </div>
  )
}
