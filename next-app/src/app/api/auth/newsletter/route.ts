import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import Newsletter from '@/lib/models/Newsletter'
import { sendNewsletterConfirmationEmail } from '@/lib/resend'

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
        let subscriber = await Newsletter.findOne({ email: normalizedEmail })

        if (subscriber) {
            if (!subscriber.isSubscribed) {
                subscriber.isSubscribed = true
                await subscriber.save()
            }
        } else {
            subscriber = await Newsletter.create({ email: normalizedEmail })
        }

        sendNewsletterConfirmationEmail(normalizedEmail).catch(console.error)

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully subscribed to Trendy Decor newsletter!',
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('subscribeNewsletter API error:', error)
        return NextResponse.json(
            { success: false, message: 'Newsletter subscription failed' },
            { status: 500 }
        )
    }
}
