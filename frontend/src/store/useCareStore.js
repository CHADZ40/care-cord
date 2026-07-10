import { create } from 'zustand'
import { createReminder, fetchActivityLog, processVoiceResponse, fetchPendingReminder } from '../api/mockApi'

export const useCareStore = create((set, get) => ({
  // --- Reminders (caregiver-authored schedule) ---
  reminders: [
    { id: 'rem-1', task: 'Take blood pressure pill', time: '08:00', frequency: 'Daily' },
    { id: 'rem-2', task: 'Afternoon walk', time: '15:00', frequency: 'Weekly' }
  ],
  reminderStatus: 'idle', // idle | saving | error
  reminderError: null,

  addReminder: async (reminder) => {
    set({ reminderStatus: 'saving', reminderError: null })
    try {
      const saved = await createReminder(reminder)
      set((state) => ({
        reminders: [saved, ...state.reminders],
        reminderStatus: 'idle'
      }))
      return saved
    } catch (err) {
      set({ reminderStatus: 'error', reminderError: err.message })
      throw err
    }
  },

  // --- Activity feed ---
  activityLog: [],
  activityStatus: 'idle', // idle | loading | error

  loadActivityLog: async () => {
    set({ activityStatus: 'loading' })
    try {
      const log = await fetchActivityLog()
      set({ activityLog: log, activityStatus: 'idle' })
    } catch (err) {
      set({ activityStatus: 'error' })
    }
  },

  logEvent: (entry) => {
    set((state) => ({
      activityLog: [
        { id: `evt-${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), ...entry },
        ...state.activityLog
      ]
    }))
  },

  // --- Elder check-in state ---
  pendingReminder: null,
  loadPendingReminder: async () => {
    const reminder = await fetchPendingReminder()
    set({ pendingReminder: reminder })
    return reminder
  },

  submitVoiceResponse: async (transcript) => {
    const result = await processVoiceResponse(transcript)
    const labelByIntent = {
      confirmed: `Elder confirmed: "${transcript}"`,
      declined: `Elder said not yet: "${transcript}"`,
      concern: `Elder may need help: "${transcript}"`,
      unclear: `Elder response unclear: "${transcript}"`
    }
    const kindByIntent = {
      confirmed: 'confirmed',
      declined: 'alert',
      concern: 'alert',
      unclear: 'prompt'
    }
    get().logEvent({ label: labelByIntent[result.intent], kind: kindByIntent[result.intent] })
    return result
  }
}))
