import express from 'express'
import passport from '../config/passport.js'
import { googleOauthController } from '../controller/oauth-controller.js'

const router = express.Router()

router.get(
    '/google',
    (req, res, next) => {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            session: false,
            state: req.query.state,
        })(req, res, next)
    }
)

router.get('/google/callback', googleOauthController)

export default router
