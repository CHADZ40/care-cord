import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listActivity } from '../controllers/activity.controller.js'

export const activityRouter = Router()

activityRouter.get('/', asyncHandler(listActivity))
