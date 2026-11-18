import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'book-bazar-api',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  })
})
