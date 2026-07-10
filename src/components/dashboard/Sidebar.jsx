import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/schedule', label: 'Schedule' },
  { to: '/dashboard/activity', label: 'Activity log' }
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-rule md:bg-paper md:px-4 md:py-6">
      <div className="mb-8 px-2">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">Care Log</p>
        <p className="text-xs text-ink/50">for Mom's household</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ink text-paper'
                  : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-md border border-rule bg-elder-card px-3 py-3 text-xs text-ink/60">
        <p className="font-semibold text-ink">Voice check-ins</p>
        <p className="mt-1">The elder screen lives at <code className="text-signal-deep">/check-in</code> — open it on their device.</p>
      </div>
    </aside>
  )
}
