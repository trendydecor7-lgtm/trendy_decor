import express from 'express'
import cors from 'cors'
import passport from './config/passport.js'
import oauthRoutes from './routes/oauth.routes.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import { globalLimiter } from './middleware/rate-limiter.middleware.js'

const app = express()

app.set('trust proxy', 1)

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(passport.initialize())

app.use(globalLimiter)

app.use('/auth', oauthRoutes)
app.use('/auth', authRoutes)
app.use('/products', productRoutes)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Api working' })
})

export default app
