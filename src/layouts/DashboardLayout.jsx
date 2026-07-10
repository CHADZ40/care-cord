import { Outlet, NavLink } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'

const mobileLinks = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/schedule', label: 'Schedule' },
  { to: '/dashboard/activity', label: 'Activity' }
]

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-rule bg-paper px-4 py-4 md:px-8">
          <p className="font-display text-base font-semibold text-ink md:hidden">Care Log</p>
          <div className="ml-auto flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-confirmed" aria-hidden="true" />
            <span className="text-xs text-ink/60">Elder device online</span>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>

        {/* Mobile bottom tab bar — sidebar is desktop-only */}
        <nav className="fixed bottom-0 left-0 right-0 flex border-t border-rule bg-paper/95 backdrop-blur md:hidden">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex-1 py-3 text-center text-xs font-medium ${
                  isActive ? 'text-signal-deep' : 'text-ink/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
