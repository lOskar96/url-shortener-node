import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string)
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`)
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('❌ Error conectando a MongoDB', e.message)
    } else {
      console.error('❌ Error conectando a MongoDB', e)
    }
  }
}
