import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin
    const redirectUri = `${baseUrl}/api/auth/google/callback`

    if (!clientId) {
        return NextResponse.json(
            { success: false, message: 'GOOGLE_CLIENT_ID is not configured' },
            { status: 500 }
        )
    }

    const state = req.nextUrl.searchParams.get('state') || '/'

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code&scope=${encodeURIComponent('email profile')}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`

    return NextResponse.redirect(googleAuthUrl)
}
