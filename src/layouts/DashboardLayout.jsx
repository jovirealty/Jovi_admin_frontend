import { useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import TopNav from '../components/topnav/TopNav'
import { Outlet } from 'react-router-dom'
import Copyright from '../components/copyright/Copyright'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-full bg-gray-50 dark:bg-neutral-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <main className="p-4 md:p-6 md:pl-64 pt-20 mt-16">
        <div className="mx-auto max-w-[1400px] space-y-6">
          <Outlet />
        </div>
      </main>
      <Copyright />
    </div>
  )
}
