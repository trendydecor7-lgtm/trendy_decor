import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/lib/models/User'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide email and password' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()
        const user = await User.findOne({ email: normalizedEmail })

        if (!user || !user.password) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const isPasswordValid = verifyPassword(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const token = generateToken(user._id)

        return NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                token,
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
        console.error('Login API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error during login' },
            { status: 500 }
        )
    }
}
