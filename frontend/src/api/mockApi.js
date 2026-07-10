// Mock backend. Every function returns a Promise and simulates network
// latency + the occasional failure, so UI code has to handle both paths
// the same way it would against a real API.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let idCounter = 1000

/**
 * Simulates sending a caregiver's new reminder to the backend.
 */
export async function createReminder(reminder) {
  await wait(500 + Math.random() * 400)
  if (Math.random() < 0.05) {
    throw new Error('Could not reach the server. The reminder was not saved.')
  }
  return {
    ...reminder,
    id: `rem-${idCounter++}`,
    createdAt: new Date().toISOString()
  }
}

/**
 * Simulates fetching the activity feed / event log for the dashboard.
 */
export async function fetchActivityLog() {
  await wait(400)
  return [
    { id: 'evt-1', time: '8:00 AM', label: 'Medication prompt sent', kind: 'prompt' },
    { id: 'evt-2', time: '8:05 AM', label: 'Elder confirmed: "Yes, just took it"', kind: 'confirmed' },
    { id: 'evt-3', time: '12:30 PM', label: 'Lunch check-in prompt sent', kind: 'prompt' },
    { id: 'evt-4', time: '12:41 PM', label: 'No response after 10 minutes', kind: 'alert' },
    { id: 'evt-5', time: '12:52 PM', label: 'Elder confirmed: "Yes, all good"', kind: 'confirmed' },
    { id: 'evt-6', time: '6:00 PM', label: 'Evening medication prompt sent', kind: 'prompt' }
  ]
}

/**
 * Simulates sending a transcribed voice response from the elder interface
 * to a backend AI for intent processing (e.g. "yes I took it" -> confirmed).
 */
export async function processVoiceResponse(transcript) {
  await wait(700 + Math.random() * 500)

  const text = transcript.toLowerCase()
  let intent = 'unclear'
  if (/\b(yes|yeah|yep|did|took|done)\b/.test(text)) intent = 'confirmed'
  else if (/\b(no|not yet|haven't|didn't)\b/.test(text)) intent = 'declined'
  else if (/\b(help|hurt|pain|dizzy|fell)\b/.test(text)) intent = 'concern'

  return {
    transcript,
    intent,
    respondedAt: new Date().toISOString()
  }
}

/**
 * Simulates fetching today's pending reminder for the elder check-in screen.
 */
export async function fetchPendingReminder() {
  await wait(300)
  return {
    id: 'rem-1',
    task: 'blood pressure pill',
    prompt: 'Good morning. Did you take your blood pressure pill?'
  }
}
