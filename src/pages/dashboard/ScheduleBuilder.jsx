import ScheduleForm from '../../components/dashboard/ScheduleForm'

export default function ScheduleBuilder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Schedule builder</h1>
        <p className="mt-1 text-sm text-ink/60">Add a task, pick a time, and choose how often it repeats.</p>
      </div>
      <ScheduleForm />
    </div>
  )
}
