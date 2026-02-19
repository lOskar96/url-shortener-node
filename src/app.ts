import express, { Express } from 'express'
import urlRoutes from './routes/urlRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { redirectUrl } from './controllers/urlController'

const app: Express = express()

const whitelist = ['http://localhost:3000', 'https://shurty.vercel.app']

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: function (origin, callback) {
      // origin es undefined si la petición es local (como Postman o Server-to-Server)
      if (!origin || whitelist.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('No permitido por CORS'))
      }
    },
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
