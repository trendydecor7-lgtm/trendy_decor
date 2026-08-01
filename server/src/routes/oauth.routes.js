import express from 'express'
import passport from '../config/passport.js'
import { googleOauthController } from '../controller/oauth-controller.js'

const router = express.Router()

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
)

router.get('/google/callback', googleOauthController)

export default router
