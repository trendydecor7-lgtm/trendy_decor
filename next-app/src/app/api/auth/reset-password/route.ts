import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/lib/models/User'
import OTP from '@/lib/models/OTP'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { email, otp, newPassword } = await req.json()

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Email, OTP, and new password are required' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: 'New password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        const otpRecord = await OTP.findOne({ email: normalizedEmail, otp: otp.trim() })
        if (!otpRecord) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired OTP verification code' },
                { status: 400 }
            )
        }

        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'No account found registered with this email address' },
                { status: 404 }
            )
        }

        user.password = hashPassword(newPassword)
        await user.save()

        await OTP.deleteMany({ email: normalizedEmail })

        return NextResponse.json(
            {
                success: true,
                message: 'Password reset successfully! You can now sign in with your new password.',
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('resetPassword API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to reset password. Please try again.' },
            { status: 500 }
        )
    }
}
