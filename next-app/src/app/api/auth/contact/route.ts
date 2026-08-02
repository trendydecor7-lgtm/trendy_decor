import { NextRequest, NextResponse } from 'next/server'
import { sendContactUsEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and message are required fields' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        const emailResult = await sendContactUsEmail({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone ? phone.trim() : '',
            message: message.trim(),
        })

        if (emailResult && !emailResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResult.error || 'Failed to deliver message to owner',
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Your message has been sent successfully. We will get back to you soon!',
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('submitContact API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to send message' },
            { status: 500 }
        )
    }
}
