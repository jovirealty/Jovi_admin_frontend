import { useRef, useState } from 'react'
import useOutsideClick from '../../hooks/useOutsideClick'

export default function UserMenu({ email }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOutsideClick(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-full ring-1 ring-black/10 px-2 py-1 bg-white/80 dark:bg-neutral-900"
      >
        <span className="text-sm text-neutral-700 dark:text-neutral-200">{email}</span>
        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white grid place-items-center">A</div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10 dark:bg-neutral-900">
          <a className="block px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800" href="#" target="_blank" rel="noreferrer">
            Contribute to Jovi Admin
          </a>
          <button className="block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
