import dotenv from 'dotenv'
import { connectDB } from './config/database'
import app from './app'

dotenv.config()
connectDB()

const PORT: number = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
