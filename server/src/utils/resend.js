import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'Trendy Decor <noreply@ikeshav.in>'


export const sendOtpEmail = async (to, otp) => {
    try {
        const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f1ea; padding: 40px 20px; color: #1c1c1c;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2dbce; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background-color: #1c1c1c; padding: 24px; text-align: center; color: #f4f1ea;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">Trendy Decor</h1>
                </div>
                <div style="padding: 32px 28px; text-align: center;">
                    <h2 style="font-size: 20px; font-weight: 400; margin-top: 0; color: #1c1c1c;">Email Verification Code</h2>
                    <p style="font-size: 14px; color: #555555; line-height: 1.6;">
                        Please use the 6-digit verification code below to complete your authentication with Trendy Decor.
                    </p>
                    <div style="margin: 28px 0; background-color: #f4f1ea; padding: 18px 24px; border-radius: 8px; display: inline-block; border: 1px border-[#b6ac9f]/30;">
                        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1c1c1c; font-family: monospace;">${otp}</span>
                    </div>
                    <p style="font-size: 12px; color: #888888; margin-bottom: 0;">
                        This code will expire in 10 minutes. If you did not request this, please ignore this email.
                    </p>
                </div>
                <div style="background-color: #f4f1ea; padding: 16px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #e2dbce;">
                    © ${new Date().getFullYear()} Trendy Decor · Burf Wali Gali, Gidderbaha, Punjab
                </div>
            </div>
        </div>
        `

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${otp} is your verification code for Trendy Decor`,
            html,
        })
        return data
    } catch (err) {
        console.error('Error sending OTP email via Resend:', err)
        throw err
    }
}


export const sendWelcomeEmail = async (to, username) => {
    try {
        const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f1ea; padding: 40px 20px; color: #1c1c1c;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2dbce; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                <div style="background-color: #1c1c1c; padding: 30px; text-align: center; color: #f4f1ea;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #c4b59d;">Luxury Gifting &amp; Event Decor</span>
                    <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">Welcome to Trendy Decor</h1>
                </div>
                <div style="padding: 36px 30px;">
                    <h2 style="font-size: 20px; font-weight: 400; margin-top: 0; color: #1c1c1c;">Hello, ${username}!</h2>
                    <p style="font-size: 14px; color: #444444; line-height: 1.7;">
                        Thank you for joining <strong>Trendy Decor</strong>. We are thrilled to have you with us!
                    </p>
                    <p style="font-size: 14px; color: #444444; line-height: 1.7;">
                        Whether you are looking for handcrafted gift hampers, bespoke floral backdrops, or celebratory room setups, our family-led atelier is dedicated to turning every moment into an unforgettable memory.
                    </p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="http://ikeshav.in" style="background-color: #1c1c1c; color: #f4f1ea; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; display: inline-block;">
                            Explore Catalog
                        </a>
                    </div>
                    <p style="font-size: 13px; color: #666666; line-height: 1.5; border-top: 1px solid #eeeeee; pt: 20px;">
                        Warm regards,<br />
                        <strong>Harish Ahuja &amp; Hitin Ahuja</strong><br />
                        <span style="font-size: 12px; color: #888888;">Trendy Decor Gidderbaha</span>
                    </p>
                </div>
                <div style="background-color: #f4f1ea; padding: 18px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #e2dbce;">
                    Burf Wali Gali, Gidderbaha, Punjab · +91 9417718844
                </div>
            </div>
        </div>
        `

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Welcome to Trendy Decor, ${username}! ✨`,
            html,
        })
        return data
    } catch (err) {
        console.error('Error sending Welcome email via Resend:', err)
    }
}


export const sendNewsletterConfirmationEmail = async (to) => {
    try {
        const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f1ea; padding: 40px 20px; color: #1c1c1c;">
            <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2dbce; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #1c1c1c; padding: 24px; text-align: center; color: #f4f1ea;">
                    <h1 style="margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 2px;">TRENDY DECOR</h1>
                </div>
                <div style="padding: 32px 28px; text-align: center;">
                    <h2 style="font-size: 18px; font-weight: 400; margin-top: 0; color: #1c1c1c;">You're Subscribed! 🎉</h2>
                    <p style="font-size: 14px; color: #555555; line-height: 1.6;">
                        Thank you for subscribing to the Trendy Decor newsletter. You will be the first to receive updates about our newest handcrafted luxury hampers, seasonal releases, and special event setups.
                    </p>
                </div>
                <div style="background-color: #f4f1ea; padding: 16px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #e2dbce;">
                    Trendy Decor Gidderbaha · Burf Wali Gali, Gidderbaha, Punjab
                </div>
            </div>
        </div>
        `

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Subscribed to Trendy Decor Updates ✨',
            html,
        })
        return data
    } catch (err) {
        console.error('Error sending Newsletter Confirmation email:', err)
    }
}


export const sendNewProductNotificationEmail = async (recipients, product) => {
    if (!recipients || recipients.length === 0) return

    try {
        const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f1ea; padding: 40px 20px; color: #1c1c1c;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2dbce; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                <div style="background-color: #1c1c1c; padding: 24px; text-align: center; color: #f4f1ea;">
                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c4b59d;">NEW ARRIVAL ANNOUNCEMENT</span>
                    <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 300; letter-spacing: 2px;">Trendy Decor</h1>
                </div>
                <div style="padding: 30px;">
                    ${product.image || product.thumbnail
                ? `
                        <div style="width: 100%; height: 260px; overflow: hidden; border-radius: 8px; margin-bottom: 20px; background-color: #e8e3da;">
                            <img src="${product.image || product.thumbnail}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                    `
                : ''
            }
                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #964B00;">${product.category || 'Collection Item'}</span>
                    <h2 style="font-size: 22px; font-weight: 400; margin: 6px 0 10px 0; color: #1c1c1c;">${product.name}</h2>
                    <p style="font-size: 20px; font-weight: 700; color: #1c1c1c; margin-bottom: 16px;">${product.price}</p>
                    <p style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px;">
                        ${product.description || 'Discover our newest addition handcrafted with premium quality materials.'}
                    </p>
                    <div style="text-align: center;">
                        <a href="http://ikeshav.in" style="background-color: #1c1c1c; color: #f4f1ea; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; display: inline-block;">
                            View Item Details
                        </a>
                    </div>
                </div>
                <div style="background-color: #f4f1ea; padding: 16px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #e2dbce;">
                    You are receiving this because you subscribed to Trendy Decor notifications.
                </div>
            </div>
        </div>
        `


        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: recipients,
            subject: `✨ New Arrival: ${product.name} at Trendy Decor`,
            html,
        })
        return data
    } catch (err) {
        console.error('Error broadcasting New Product notification email:', err)
    }
}

/**
 * 5. Send Contact Form Submission Email
 */
export const sendContactUsEmail = async ({ name, email, phone, message }) => {
    try {
        const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

        // A. Admin Email Notification to trendydecor7@gmail.com
        const adminHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px 20px; color: #1c1c1c; background-color: #f4f1ea;">
            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2dbce; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05);">
                <div style="background-color: #1c1c1c; padding: 18px 24px; text-align: center; color: #f4f1ea; border-radius: 8px 8px 0 0; margin: -30px -30px 24px -30px;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;">New Contact Form Inquiry</h2>
                </div>

                <p style="font-size: 14px; color: #333333; margin-bottom: 20px;">
                    Someone has submitted a new inquiry through the Trendy Decor contact form. Here are the details:
                </p>

                <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                    <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1c1c1c; width: 130px;">Sender Name:</td>
                        <td style="padding: 10px 0; color: #444444;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1c1c1c;">Sender Email:</td>
                        <td style="padding: 10px 0; color: #444444;"><a href="mailto:${email}" style="color: #1c1c1c;">${email}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1c1c1c;">Phone Number:</td>
                        <td style="padding: 10px 0; color: #444444;">${phone || 'Not provided'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 10px 0; font-weight: 600; color: #1c1c1c;">Inquiry Time:</td>
                        <td style="padding: 10px 0; color: #444444;">${formattedDate}</td>
                    </tr>
                </table>

                <div style="margin-top: 16px;">
                    <strong style="font-size: 14px; color: #1c1c1c; display: block; margin-bottom: 8px;">Message Details:</strong>
                    <div style="background-color: #f4f1ea; padding: 18px; border-radius: 8px; font-size: 14px; color: #1c1c1c; line-height: 1.6; border: 1px solid #e2dbce;">
                        ${message.replace(/\n/g, '<br />')}
                    </div>
                </div>
            </div>
        </div>
        `

        await resend.emails.send({
            from: FROM_EMAIL,
            to: ['trendydecor7@gmail.com'],
            subject: `📩 New Contact Inquiry from ${name} (${email})`,
            html: adminHtml,
        })

        // B. Thank You Confirmation Email to Sender
        const customerHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px 20px; color: #1c1c1c; background-color: #f4f1ea;">
            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2dbce; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05);">
                <div style="background-color: #1c1c1c; padding: 22px; text-align: center; color: #f4f1ea; margin: -32px -32px 28px -32px; border-radius: 12px 12px 0 0;">
                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #c4b59d;">LUXURY GIFTING & EVENT DECOR</span>
                    <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 300; letter-spacing: 2px;">Trendy Decor</h1>
                </div>

                <h2 style="font-size: 20px; font-weight: 400; margin-top: 0; color: #1c1c1c;">Thank You for Contacting Us, ${name}!</h2>

                <p style="font-size: 14px; color: #444444; line-height: 1.7; margin-bottom: 20px;">
                    Thank you for reaching out to <strong>Trendy Decor</strong>. We have received your inquiry message and our team will contact you shortly.
                </p>

                <div style="background-color: #f4f1ea; padding: 18px; border-radius: 8px; border: 1px solid #e2dbce; margin-bottom: 24px;">
                    <strong style="font-size: 11px; font-weight: 600; uppercase; letter-spacing: 1px; color: #666666; display: block; margin-bottom: 8px;">Your Submitted Message:</strong>
                    <p style="font-size: 13px; color: #333333; margin: 0; line-height: 1.5; font-style: italic;">
                        "${message}"
                    </p>
                </div>

                <p style="font-size: 13px; color: #666666; line-height: 1.6; border-top: 1px solid #eeeeee; padding-top: 20px; margin-bottom: 0;">
                    Warm regards,<br />
                    <strong>Trendy Decor Team</strong><br />
                    <span style="font-size: 12px; color: #888888;">Burf Wali Gali, Gidderbaha, Punjab · +91 9417718844</span>
                </p>
            </div>
        </div>
        `

        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Thank You for Contacting Trendy Decor ✨',
            html: customerHtml,
        })
    } catch (err) {
        console.error('Error sending Contact Us email:', err)
    }
}

export const sendMessage = async (to, subject, email) => {
    try {
        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html: email,
        })
        return data
    } catch (err) {
        console.error('sendMessage error:', err)
    }
}
