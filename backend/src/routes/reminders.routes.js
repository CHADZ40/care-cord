import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listReminders, createReminder } from '../controllers/reminders.controller.js'

export const remindersRouter = Router()

remindersRouter.get('/', asyncHandler(listReminders))
remindersRouter.post('/', asyncHandler(createReminder))
