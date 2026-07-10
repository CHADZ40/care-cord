import { Link } from 'react-router-dom'
import { useCareStore } from '../../store/useCareStore'

export default function DashboardHome() {
  const reminders = useCareStore((s) => s.reminders)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-ink/60">Today's reminders and how things are going.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active reminders" value={reminders.length} accent="signal" />
        <StatCard label="Confirmed today" value="2" accent="confirmed" />
        <StatCard label="Needs attention" value="1" accent="alert" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Upcoming reminders</h2>
          <Link to="/dashboard/schedule" className="text-sm font-medium text-signal-deep hover:underline">
            Add reminder
          </Link>
        </div>
        <ul className="divide-y divide-rule rounded-lg border border-rule bg-white">
          {reminders.map((r) => (
            <li key={r.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{r.task}</p>
                <p className="text-xs text-ink/50">{r.frequency}</p>
              </div>
              <span className="rounded-full bg-signal-soft px-3 py-1 text-xs font-semibold text-signal-deep">
                {r.time}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  const accents = {
    signal: 'text-signal-deep',
    confirmed: 'text-confirmed',
    alert: 'text-alert'
  }
  return (
    <div className="rounded-lg border border-rule bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold ${accents[accent]}`}>{value}</p>
    </div>
  )
}
