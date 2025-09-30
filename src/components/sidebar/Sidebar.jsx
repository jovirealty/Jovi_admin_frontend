import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAV } from '../../data/nav';
import logo from '../../assets/images/jovi-reality-logo-foo.png'

export default function Sidebar({ open = false, onClose }) {
  const { user } = useAuth();
  const role = user?.roles?.includes('superadmin') ? 'superadmin' : 'agent';
  const items = NAV[role] ?? [];

  return (
    <>
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-64',
          'bg-white dark:bg-neutral-950',
          'shadow-lg md:shadow-none md:ring-1 md:ring-black/5',
          'transform transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        ].join(' ')}
      >
        <div className="h-16 mt-2 flex items-center gap-2 px-4">
          <img src={logo} alt="Jovi" />
        </div>

        <nav className="p-3 mt-2 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
        {items.map(it => (
          it.children ? (
            <div key={it.label} className="space-y-1">
              <div className="px-2 pt-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{it.label}</div>
              {it.children.map(c => (
                <NavLink
                  key={c.to}
                  to={c.to}
                  className={({ isActive }) =>
                    'block rounded-lg px-3 py-2 text-sm ' +
                    (isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800')
                  }
                  onClick={onClose}
                >
                  {c.label}
                </NavLink>
              ))}
            </div>
          ) : (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                'block rounded-lg px-3 py-2 text-sm ' +
                (isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800')
              }
              onClick={onClose}
            >
              {it.label}
            </NavLink>
          )
        ))}
      </nav>
      </aside>

      {/* Backdrop for mobile */}
      {open && <div onClick={onClose} className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden" />}
    </>
  )
}
