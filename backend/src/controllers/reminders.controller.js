import { prisma } from '../lib/prisma.js'
import { ApiError } from '../middleware/errorHandler.js'
import { getDemoHouseholdId } from '../lib/demoHousehold.js'

const VALID_FREQUENCIES = ['Daily', 'Weekly']
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export async function listReminders(req, res) {
  const householdId = await getDemoHouseholdId()
  const reminders = await prisma.reminder.findMany({
    where: { householdId },
    orderBy: { time: 'asc' }
  })
  res.json(reminders)
}

export async function createReminder(req, res) {
  const { task, time, frequency } = req.body ?? {}
  const errors = {}

  if (!task || typeof task !== 'string' || task.trim().length < 3) {
    errors.task = 'Task must be at least 3 characters.'
  }
  if (!time || !TIME_PATTERN.test(time)) {
    errors.time = 'Time must be in HH:MM 24-hour format.'
  }
  if (!VALID_FREQUENCIES.includes(frequency)) {
    errors.frequency = `Frequency must be one of: ${VALID_FREQUENCIES.join(', ')}.`
  }

  if (Object.keys(errors).length > 0) {
    throw new ApiError(422, 'Reminder could not be saved.', errors)
  }

  const householdId = await getDemoHouseholdId()
  const reminder = await prisma.reminder.create({
    data: { task: task.trim(), time, frequency, householdId }
  })

  res.status(201).json(reminder)
}
