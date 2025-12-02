import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import app from './app.js'

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`)
})