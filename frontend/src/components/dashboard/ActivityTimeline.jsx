import { useEffect } from 'react'
import { useCareStore } from '../../store/useCareStore'

const DOT_STYLES = {
  prompt: 'bg-signal',
  confirmed: 'bg-confirmed',
  alert: 'bg-alert'
}

export default function ActivityTimeline() {
  const activityLog = useCareStore((s) => s.activityLog)
  const status = useCareStore((s) => s.activityStatus)
  const loadActivityLog = useCareStore((s) => s.loadActivityLog)

  useEffect(() => {
    loadActivityLog()
  }, [loadActivityLog])

  if (status === 'loading' && activityLog.length === 0) {
    return <p className="text-sm text-ink/50">Loading activity…</p>
  }

  if (activityLog.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rule px-6 py-10 text-center">
        <p className="text-sm text-ink/60">Nothing logged yet today.</p>
      </div>
    )
  }

  return (
    <ul className="ruled-page rounded-lg border border-rule bg-white px-6 py-2">
      {activityLog.map((event) => (
        <li key={event.id} className="flex h-[44px] items-center gap-3">
          <span
            className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${DOT_STYLES[event.kind] ?? 'bg-ink/30'}`}
            aria-hidden="true"
          />
          <span className="w-20 flex-shrink-0 text-xs font-medium text-ink/50">{event.time}</span>
          <span className="text-sm text-ink">{event.label}</span>
        </li>
      ))}
    </ul>
  )
}
