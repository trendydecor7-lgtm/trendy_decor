import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './src/app.js'
import { keepAwake } from '@ikeshav26/keep-awake'
dotenv.config()

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trendy_decor'

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.warn('MongoDB connection warning:', err.message)
    })

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    keepAwake({
        url: process.env.APP_URL,
        interval: 10,
    })
})
