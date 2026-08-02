import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/lib/models/User'
import { hashPassword, generateToken } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { username, email, password } = await req.json()

        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide username, email, and password' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        const existingUser = await User.findOne({ email: normalizedEmail })
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = hashPassword(password)
        const user = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            authProvider: 'local',
        })

        const token = generateToken(user._id)

        await sendWelcomeEmail(user.email, user.username)

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isOwner: user.isOwner || false,
                    authProvider: user.authProvider || 'local',
                    createdAt: user.createdAt,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Register API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error during registration' },
            { status: 500 }
        )
    }
}
