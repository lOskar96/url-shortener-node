import express, { Express } from 'express'
import urlRoutes from './routes/urlRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app: Express = express()

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'credentials'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
)

app.use('/', urlRoutes)
app.use('/auth', authRoutes)

export default app
