import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import OTP from '@/lib/models/OTP'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { email, otp } = await req.json()

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Email and OTP are required' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()
        const record = await OTP.findOne({ email: normalizedEmail, otp: otp.trim() })

        if (!record) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired OTP code' },
                { status: 400 }
            )
        }

        await OTP.deleteOne({ _id: record._id })

        return NextResponse.json(
            {
                success: true,
                message: 'OTP verified successfully',
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('verifyOtp API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to verify OTP' },
            { status: 500 }
        )
    }
}
