import { generateToken } from '../utils/helper.js'
import passport from '../config/passport.js'

export const googleOauthController = (req, res, next) => {
    try {
        passport.authenticate('google', { session: false }, (err, user) => {
            if (err) {
                console.error('Google OAuth error', err)
                return res.redirect(
                    `${process.env.CLIENT_URL}/login?error=oauth_failed&message="Authentication failed"`
                )
            }

            if (!user) {
                return res.redirect(
                    `${process.env.CLIENT_URL}/login?error=oauth_failed&message="No user found"`
                )
            }

            const token = generateToken(user._id)

            res.redirect(
                `${process.env.CLIENT_URL}/?oauth=success&token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify({ userId: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl }))}`
            )
        })(req, res, next)
    } catch (err) {
        console.error('OAuth Controller error', err)
        return res.redirect(
            `${process.env.CLIENT_URL}/login?error=oauth_failed&message="Internal server error"`
        )
    }
}
