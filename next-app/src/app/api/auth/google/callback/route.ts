import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/lib/models/User'
import { generateToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin

    if (errorParam || !code) {
        return NextResponse.redirect(
            `${baseUrl}/auth?error=oauth_failed&message=${encodeURIComponent('Authentication failed')}`
        )
    }

    try {
        await dbConnect()
        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET
        const redirectUri = `${baseUrl}/api/auth/google/callback`

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId || '',
                client_secret: clientSecret || '',
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        })

        const tokenData = await tokenRes.json()
        if (!tokenData.access_token) {
            return NextResponse.redirect(
                `${baseUrl}/auth?error=oauth_failed&message=${encodeURIComponent('Failed to exchange code for token')}`
            )
        }

        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })

        const googleUser = await userRes.json()
        const email = googleUser.email ? googleUser.email.toLowerCase().trim() : null
        const avatarUrl = googleUser.picture || null

        if (!email) {
            return NextResponse.redirect(
                `${baseUrl}/auth?error=oauth_failed&message=${encodeURIComponent('No email provided by Google')}`
            )
        }

        let user = await User.findOne({
            providerId: googleUser.id,
            authProvider: 'google',
        })

        if (!user) {
            user = await User.findOne({ email })
            if (user) {
                if (user.authProvider === 'local' && user.password) {
                    return NextResponse.redirect(
                        `${baseUrl}/auth?error=oauth_failed&message=${encodeURIComponent(
                            'An account with this email already exists. Please sign in with your email and password.'
                        )}`
                    )
                }

                user.authProvider = 'google'
                user.providerId = googleUser.id
                if (avatarUrl) user.avatarUrl = avatarUrl
                user.emailVerified = true
                await user.save()
            } else {
                user = new User({
                    username: googleUser.name || email.split('@')[0],
                    email,
                    authProvider: 'google',
                    providerId: googleUser.id,
                    avatarUrl: avatarUrl || undefined,
                    emailVerified: true,
                })
                await user.save()
            }
        }

        const token = generateToken(user._id)
        const userObj = JSON.stringify({
            userId: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
        })

        return NextResponse.redirect(
            `${baseUrl}/?oauth=success&token=${encodeURIComponent(token)}&user=${encodeURIComponent(userObj)}`
        )
    } catch (err: any) {
        console.error('Google OAuth callback API error:', err)
        return NextResponse.redirect(
            `${baseUrl}/auth?error=oauth_failed&message=${encodeURIComponent('Internal server error during OAuth')}`
        )
    }
}
