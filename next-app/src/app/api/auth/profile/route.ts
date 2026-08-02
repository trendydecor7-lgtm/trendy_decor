import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/auth'
import User from '@/lib/models/User'

export async function PUT(req: NextRequest) {
    try {
        const authUser = await verifyTokenAndGetUser(req)
        if (!authUser) {
            return NextResponse.json(
                { success: false, message: 'Access denied: Unauthorized' },
                { status: 401 }
            )
        }

        const { username } = await req.json()
        if (!username || !username.trim()) {
            return NextResponse.json(
                { success: false, message: 'Username cannot be empty' },
                { status: 400 }
            )
        }

        const user = await User.findById(authUser._id)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        if (user.authProvider && user.authProvider !== 'local') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username editing is only allowed for locally registered accounts',
                },
                { status: 403 }
            )
        }

        user.username = username.trim()
        await user.save()

        return NextResponse.json(
            {
                success: true,
                message: 'Username updated successfully',
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
        console.error('updateProfile API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to update username' },
            { status: 500 }
        )
    }
}
