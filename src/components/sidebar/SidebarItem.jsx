import { NavLink } from 'react-router-dom'

export default function SidebarItem({ to, label, depth = 0 }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline transition',
          depth ? 'ml-6' : '',
          isActive
            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
        ].join(' ')
      }
    >
      <span>{label}</span>
    </NavLink>
  )
}
