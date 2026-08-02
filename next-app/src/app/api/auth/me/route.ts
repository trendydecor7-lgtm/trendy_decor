import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const user = await verifyTokenAndGetUser(req)
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Access denied: Unauthorized' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isOwner: user.isOwner || false,
                    addresses: user.addresses || [],
                    authProvider: user.authProvider || 'local',
                    createdAt: user.createdAt,
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('getMe API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch user data' },
            { status: 500 }
        )
    }
}
