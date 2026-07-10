import { Router } from 'express'
import { remindersRouter } from './reminders.routes.js'
import { activityRouter } from './activity.routes.js'
import { elderRouter } from './elder.routes.js'

export const apiRouter = Router()

apiRouter.get('/health', (req, res) => res.json({ ok: true }))
apiRouter.use('/reminders', remindersRouter)
apiRouter.use('/activity', activityRouter)
apiRouter.use('/elder', elderRouter)
