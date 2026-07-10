import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { getPendingReminder, postVoiceResponse } from '../controllers/elder.controller.js'

export const elderRouter = Router()

elderRouter.get('/pending-reminder', asyncHandler(getPendingReminder))
elderRouter.post('/voice-response', asyncHandler(postVoiceResponse))
