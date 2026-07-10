import ActivityTimeline from '../../components/dashboard/ActivityTimeline'

export default function ActivityFeed() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Activity log</h1>
        <p className="mt-1 text-sm text-ink/60">Prompts sent and responses received, in order.</p>
      </div>
      <ActivityTimeline />
    </div>
  )
}
