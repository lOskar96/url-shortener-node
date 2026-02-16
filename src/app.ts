import express, { Express } from 'express'
import urlRoutes from './routes/urlRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { redirectUrl } from './controllers/urlController'

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

app.param('code', (req, res, next, code) => {
  if (/^[a-zA-Z0-9]{6}$/.test(code)) {
    next()
  } else {
    res.status(404).send('Not found')
  }
})

app.use('/api', urlRoutes)
app.use('/api/auth', authRoutes)
app.get('/:code', redirectUrl)

export default app
