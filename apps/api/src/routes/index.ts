import { Router } from 'express'
import { healthRouter } from '../modules/health/health.routes.js'
import booksRoutes from "../modules/books/books.routes.js";

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use("/books", booksRoutes);
