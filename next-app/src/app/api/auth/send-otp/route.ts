import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import OTP from '@/lib/models/OTP'
import { sendOtpEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await OTP.deleteMany({ email: normalizedEmail })
        await OTP.create({ email: normalizedEmail, otp })

        await sendOtpEmail(normalizedEmail, otp)

        return NextResponse.json(
            {
                success: true,
                message: `Verification OTP sent to ${normalizedEmail}`,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('sendOtp API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to send verification OTP code' },
            { status: 500 }
        )
    }
}
