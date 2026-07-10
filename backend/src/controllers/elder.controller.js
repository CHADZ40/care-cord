import { prisma } from '../lib/prisma.js'
import { ApiError } from '../middleware/errorHandler.js'
import { classifyIntent } from '../services/intent.service.js'
import { getDemoHouseholdId } from '../lib/demoHousehold.js'

/**
 * Returns the next reminder that hasn't been confirmed yet today.
 * Simple version for a class project: "next reminder by time-of-day that
 * doesn't already have a 'confirmed' event logged against it today."
 */
export async function getPendingReminder(req, res) {
  const householdId = await getDemoHouseholdId()

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const reminders = await prisma.reminder.findMany({
    where: { householdId },
    orderBy: { time: 'asc' },
    include: {
      events: {
        where: { kind: 'confirmed', occurredAt: { gte: startOfDay } }
      }
    }
  })

  const pending = reminders.find((r) => r.events.length === 0)

  if (!pending) {
    return res.json(null)
  }

  res.json({
    id: pending.id,
    task: pending.task,
    prompt: buildPrompt(pending.task)
  })
}

function buildPrompt(task) {
  const lower = task.toLowerCase()
  return `Good morning. Did you get a chance to ${lower.startsWith('take') ? lower : `do this: ${lower}`}?`
}

export async function postVoiceResponse(req, res) {
  const { transcript, reminderId } = req.body ?? {}

  if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
    throw new ApiError(422, 'A transcript is required.')
  }

  const householdId = await getDemoHouseholdId()

  const reminder = reminderId
    ? await prisma.reminder.findUnique({ where: { id: reminderId } })
    : null

  const intent = await classifyIntent(transcript, { reminderTask: reminder?.task })

  const labelByIntent = {
    confirmed: `Elder confirmed: "${transcript}"`,
    declined: `Elder said not yet: "${transcript}"`,
    concern: `Elder may need help: "${transcript}"`,
    unclear: `Elder response unclear: "${transcript}"`
  }

  const event = await prisma.activityEvent.create({
    data: {
      householdId,
      reminderId: reminder?.id,
      kind: intent,
      label: labelByIntent[intent]
    }
  })

  res.status(201).json({
    transcript,
    intent,
    respondedAt: event.occurredAt
  })
}
