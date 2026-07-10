import { useState } from 'react'
import { useCareStore } from '../../store/useCareStore'

const FREQUENCIES = ['Daily', 'Weekly']

export default function ScheduleForm() {
  const addReminder = useCareStore((s) => s.addReminder)
  const status = useCareStore((s) => s.reminderStatus)

  const [task, setTask] = useState('')
  const [time, setTime] = useState('')
  const [frequency, setFrequency] = useState('Daily')
  const [errors, setErrors] = useState({})
  const [savedMessage, setSavedMessage] = useState('')

  function validate() {
    const next = {}
    if (!task.trim()) next.task = 'Enter what the reminder is for.'
    else if (task.trim().length < 3) next.task = 'Give a little more detail — at least 3 characters.'
    if (!time) next.time = 'Pick a time.'
    if (!FREQUENCIES.includes(frequency)) next.frequency = 'Choose how often this repeats.'
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSavedMessage('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await addReminder({ task: task.trim(), time, frequency })
      setSavedMessage(`Saved — "${task.trim()}" every ${frequency.toLowerCase()} at ${formatTime(time)}.`)
      setTask('')
      setTime('')
      setFrequency('Daily')
    } catch (err) {
      setErrors({ form: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-lg space-y-5 rounded-lg border border-rule bg-white p-6">
      <div>
        <label htmlFor="task" className="block text-sm font-medium text-ink">
          Task
        </label>
        <input
          id="task"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder='e.g. "Take medication"'
          className="mt-1 w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none"
          aria-invalid={Boolean(errors.task)}
          aria-describedby={errors.task ? 'task-error' : undefined}
        />
        {errors.task && (
          <p id="task-error" className="mt-1 text-xs text-alert">{errors.task}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-ink">
            Time
          </label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm text-ink focus-visible:outline-none"
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? 'time-error' : undefined}
          />
          {errors.time && <p id="time-error" className="mt-1 text-xs text-alert">{errors.time}</p>}
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-ink">
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm text-ink focus-visible:outline-none"
          >
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {errors.form && <p className="text-sm text-alert">{errors.form}</p>}
      {savedMessage && <p className="text-sm text-confirmed">{savedMessage}</p>}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === 'saving' ? 'Saving…' : 'Save reminder'}
      </button>
    </form>
  )
}

function formatTime(value) {
  if (!value) return ''
  const [h, m] = value.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
