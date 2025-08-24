import { useState } from 'react'
import SidebarGroup from './SidebarGroup'
import SidebarItem from './SidebarItem'
import { NAV } from '../../data/nav'
import logo from '../../assets/images/jovi-reality-logo-foo.png'

export default function Sidebar({ open = false, onClose }) {
  const [openGroup, setOpenGroup] = useState({ Matrix: true })

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
        <div className="h-16 flex items-center gap-2 px-4">
          <img src={logo} alt="Jovi" />
          <button
            onClick={onClose}
            className="ml-auto md:hidden rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close sidebar"
          >✕</button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {NAV.map((item) =>
            item.children ? (
              <SidebarGroup
                key={item.label}
                label={item.label}
                open={!!openGroup[item.label]}
                onToggle={() => setOpenGroup(o => ({ ...o, [item.label]: !o[item.label] }))}
              >
                {item.children.map((c) => (
                  <SidebarItem key={c.to} to={c.to} label={c.label} depth={1} />
                ))}
              </SidebarGroup>
            ) : (
              <SidebarItem key={item.to} to={item.to} label={item.label} />
            )
          )}
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {open && <div onClick={onClose} className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden" />}
    </>
  )
}
