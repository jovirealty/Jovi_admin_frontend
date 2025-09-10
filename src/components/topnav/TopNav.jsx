import { useLocation } from 'react-router-dom'
import UserMenu from './UserMenu'
import useTheme from '../../hooks/useTheme'

const titleFromPath = (pathname) => {
  if (pathname === '/') return 'Dashboard'
  return pathname.replace(/^\/|\/$/g, '').split('/').map(s => s[0]?.toUpperCase()+s.slice(1)).join(' · ')
}

export default function TopNav({ onMenuClick }) {
  const { pathname } = useLocation()
  const { dark, setDark } = useTheme()

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/80 dark:bg-neutral-950/70 backdrop-blur shadow-sm z-20">
      <div className="h-full flex items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="md:hidden rounded-md p-2 ring-1 ring-black/10 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            aria-label="Open sidebar"
          >☰</button>
          <h1 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            {titleFromPath(pathname)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(v => !v)}
            className="hidden sm:inline-flex rounded-md px-3 py-2 text-sm ring-1 ring-black/10 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            {dark ? '☾' : '☀︎'}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
