import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/lib/models/User'
import { generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const body = await req.json().catch(() => ({}))
        const guestName = body.name?.trim() || 'Guest User'

        const guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`
        const guestEmail = `${guestId}@guest.trendydecor.com`

        let user = new User({
            username: guestName,
            email: guestEmail,
            authProvider: 'guest',
            providerId: guestId,
            emailVerified: true,
        })
        await user.save()

        const token = generateToken(user._id)

        return NextResponse.json(
            {
                success: true,
                message: 'Guest session created',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isGuest: true,
                    authProvider: 'guest',
                    addresses: [],
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Guest API error:', error)

        const mockMongoId = '00000000000000000000' + Math.floor(1000 + Math.random() * 9000)
        const token = generateToken(mockMongoId)

        return NextResponse.json(
            {
                success: true,
                message: 'Guest session created (local)',
                token,
                user: {
                    id: mockMongoId,
                    username: 'Guest User',
                    email: `guest_${Date.now()}@guest.trendydecor.com`,
                    isGuest: true,
                    authProvider: 'guest',
                    addresses: [],
                },
            },
            { status: 200 }
        )
    }
}
