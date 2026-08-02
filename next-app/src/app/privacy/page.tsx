import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
    ShieldCheck,
    Truck,
    Lock,
    EyeOff,
    FileText,
    CheckCircle2,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    HeartHandshake,
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Privacy Policy & Customer Pledge | Trendy Decor Gidderbaha',
    description:
        'Read the official Privacy Policy of Trendy Decor Gidderbaha. Learn about our fast & secure delivery guarantee, 100% data protection, and our strict pledge that your personal details and gifts are NEVER used for publicity.',
    keywords: [
        'trendy decor gidderbaha privacy policy',
        'ecommerce privacy policy',
        'data protection trendy decor',
        'secure gifting gidderbaha',
        'fast delivery gidderbaha',
        'harish ahuja',
        'hitin ahuja',
    ],
    openGraph: {
        title: 'Privacy Policy & Customer Pledge | Trendy Decor Gidderbaha',
        description:
            'We keep your data 100% safe. Fast delivery, total confidentiality, and zero publicity of your personal moments.',
        url: 'https://trendydecor24.shop/privacy',
        type: 'website',
    },
}

export default function PrivacyPolicy() {
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy & Customer Pledge | Trendy Decor Gidderbaha',
        description:
            'Official Privacy Policy of Trendy Decor Gidderbaha guaranteeing fast delivery, 100% data security, and zero unauthorized publicity.',
        publisher: {
            '@type': 'LocalBusiness',
            name: 'Trendy Decor Gidderbaha',
            telephone: '+919417718844',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Burf Wali Gali',
                addressLocality: 'Gidderbaha',
                addressRegion: 'Punjab',
                postalCode: '152101',
                addressCountry: 'IN',
            },
        },
    }

    const corePledges = [
        {
            icon: Truck,
            title: 'Fast & Secure Delivery',
            description:
                'We pride ourselves on rapid, dependable delivery across Gidderbaha, Bathinda, Malout, and nationwide. Your shipping details are used exclusively to ensure your hampers and decor arrive on time and in immaculate condition.',
        },
        {
            icon: EyeOff,
            title: 'Never Used for Publicity',
            description:
                'We respect the intimacy of your gifting and celebrations. Your name, photos, custom messages, and personal order details are NEVER used for publicity, marketing campaigns, or social media promotions without your explicit consent.',
        },
        {
            icon: Lock,
            title: '100% Data Safety & Encryption',
            description:
                'All personal information collected during registration, checkout, and contact inquiries is encrypted and stored safely. We never sell, rent, or trade your data to advertisers or third-party brokers.',
        },
    ]

    const policySections = [
        {
            number: '01',
            title: 'Information We Collect',
            content: (
                <>
                    <p className="mb-3">
                        When you browse our catalog, register an account, place an order, or contact us through our website, we collect only the essential information needed to provide a seamless e-commerce experience:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[#1c1c1c]/80">
                        <li>
                            <strong>Personal Identification:</strong> Your full name, email address, and phone number (+91 contact number for delivery coordination).
                        </li>
                        <li>
                            <strong>Shipping & Delivery Address:</strong> Full postal address, landmark, and recipient details required for fast and accurate order fulfillment.
                        </li>
                        <li>
                            <strong>Order & Customization Details:</strong> Gift hamper preferences, custom notes, bouquet specifications, and event dates.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            number: '02',
            title: 'How We Use Your Information',
            content: (
                <>
                    <p className="mb-3">
                        Your information is used strictly for operational and customer service purposes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[#1c1c1c]/80">
                        <li>
                            <strong>Fast Delivery & Order Tracking:</strong> Coordinating dispatch, sharing tracking updates, and contacting you if our courier partner requires directions.
                        </li>
                        <li>
                            <strong>Account Security & Notifications:</strong> Sending secure OTP verification codes, order confirmation emails, and important status alerts.
                        </li>
                        <li>
                            <strong>Customer Support:</strong> Responding promptly to your contact inquiries, custom decor requests, or return/exchange questions.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            number: '03',
            title: 'Strict No-Publicity & Confidentiality Pledge',
            content: (
                <>
                    <p className="mb-3">
                        At Trendy Decor, we understand that gifts, bouquets, and bespoke hampers often mark deeply personal moments and surprises:
                    </p>
                    <p className="mb-2 font-medium text-[#1c1c1c]">
                        We guarantee that your personal identity, gift messages, recipient names, and celebration photos will NEVER be published on Instagram, Facebook, promotional brochures, or any public advertising materials without your prior written permission.
                    </p>
                    <p className="text-[13px] text-[#1c1c1c]/75">
                        Even when showcasing our portfolio, we ensure complete anonymity of our clients unless you specifically request to be featured.
                    </p>
                </>
            ),
        },
        {
            number: '04',
            title: 'Data Security & Retention',
            content: (
                <>
                    <p className="mb-3">
                        We implement rigorous administrative, technical, and physical security measures to safeguard your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[#1c1c1c]/80">
                        <li>
                            <strong>Encrypted Transport:</strong> All website interactions and authentication requests are transmitted via SSL/TLS encryption.
                        </li>
                        <li>
                            <strong>Restricted Access:</strong> Only authorized store owners (Harish Ahuja & Hitin Ahuja) and essential fulfillment personnel have access to order and delivery records.
                        </li>
                        <li>
                            <strong>Data Retention:</strong> We retain your order history only as long as necessary to provide warranty support, handle future order references, and comply with accounting and tax regulations.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            number: '05',
            title: 'Third-Party Services & Delivery Partners',
            content: (
                <>
                    <p className="mb-3">
                        We do not monetize or share your information with third-party marketing firms. We share limited data only with essential service partners:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[#1c1c1c]/80">
                        <li>
                            <strong>Logistics & Couriers:</strong> Trusted local delivery personnel and courier partners receive only your name, phone number, and delivery address to execute fast delivery.
                        </li>
                        <li>
                            <strong>Payment & Communication Providers:</strong> Secure payment gateways and email notification infrastructure (such as Resend for OTP and invoice delivery) process messages strictly under data protection agreements.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            number: '06',
            title: 'Cookies & Essential Website Analytics',
            content: (
                <>
                    <p>
                        Our web application uses essential cookies and session tokens solely to maintain your login authentication, secure shopping cart contents, and remember your site preferences. We do not use invasive third-party tracking or cross-site advertising cookies.
                    </p>
                </>
            ),
        },
        {
            number: '07',
            title: 'Your Rights & Control Over Your Data',
            content: (
                <>
                    <p className="mb-3">
                        You remain in complete control of your personal data at all times. You have the right to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-[#1c1c1c]/80">
                        <li>Request an exported copy of your personal data stored in our e-commerce system.</li>
                        <li>Update or correct any inaccuracies in your shipping addresses or contact information.</li>
                        <li>Request the permanent deletion of your account and personal records from our servers.</li>
                        <li>Opt out of newsletter communications at any time with a single click.</li>
                    </ul>
                </>
            ),
        },
    ]

    return (
        <main
            className="w-full select-none bg-[#f4f1ea] text-[#1c1c1c]"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Header / Hero */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-10 border-b border-[#b6ac9f]/30">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e3da] border border-[#b6ac9f]/50 text-xs font-normal text-[#1c1c1c]/80 mb-4">
                        <ShieldCheck size={14} className="text-[#1c1c1c]" />
                        <span>Customer Privacy & Trust Pledge</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-[#1c1c1c] leading-tight mb-4">
                        Privacy Policy & Data Protection
                    </h1>
                    <p className="text-base md:text-lg font-light text-[#1c1c1c]/75 leading-relaxed">
                        At <strong className="font-normal text-[#1c1c1c]">Trendy Decor Gidderbaha</strong>, we believe that luxury gifting must come with complete peace of mind. Here is our unwavering pledge regarding your data, delivery speed, and personal confidentiality.
                    </p>
                    <div className="mt-4 text-xs font-light text-[#1c1c1c]/60">
                        Effective & Last Updated: August 2026 · Applicable to all online orders, custom inquiries, and in-store purchases.
                    </div>
                </div>
            </div>

            {/* Core Pledges Banner (Three Guarantee Cards) */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 border-b border-[#b6ac9f]/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {corePledges.map((pledge, index) => {
                        const IconComponent = pledge.icon
                        return (
                            <div
                                key={index}
                                className="bg-[#ffffff] border border-[#e2dbce] rounded-xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-[#f4f1ea] border border-[#b6ac9f]/40 flex items-center justify-center text-[#1c1c1c] mb-5">
                                        <IconComponent size={22} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-normal text-[#1c1c1c] mb-2.5">
                                        {pledge.title}
                                    </h3>
                                    <p className="text-[13px] md:text-[14px] font-light text-[#1c1c1c]/75 leading-relaxed">
                                        {pledge.description}
                                    </p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-[#f4f1ea] flex items-center gap-1.5 text-xs font-normal text-[#1c1c1c]/80">
                                    <CheckCircle2 size={14} className="text-emerald-700" />
                                    <span>Guaranteed by Trendy Decor</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Detailed Policy Sections */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-normal text-[#1c1c1c] mb-3">
                            Comprehensive Privacy Terms
                        </h2>
                        <p className="text-sm font-light text-[#1c1c1c]/70 max-w-xl mx-auto">
                            Full transparency on how we handle, secure, and protect your information at every stage of your shopping journey.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {policySections.map((section) => (
                            <div
                                key={section.number}
                                className="bg-[#ffffff] border border-[#e2dbce] rounded-xl p-6 md:p-8 shadow-sm hover:border-[#b6ac9f] transition-colors"
                            >
                                <div className="flex items-start gap-4 md:gap-6">
                                    <span className="text-xs md:text-sm font-mono font-bold tracking-widest text-[#1c1c1c]/40 pt-1">
                                        {section.number}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="text-lg md:text-xl font-normal text-[#1c1c1c] mb-3">
                                            {section.title}
                                        </h3>
                                        <div className="text-[13px] md:text-[14px] font-light text-[#1c1c1c]/75 leading-relaxed">
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Card for Privacy Inquiries */}
                    <div className="mt-12 bg-[#e8e3da]/70 border border-[#b6ac9f]/60 rounded-xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-normal text-[#1c1c1c]/80 uppercase tracking-wider mb-2">
                                    <HeartHandshake size={14} />
                                    <span>We Are Always Here to Assist</span>
                                </div>
                                <h3 className="text-xl font-normal text-[#1c1c1c] mb-1">
                                    Have Questions About Your Privacy or Order Security?
                                </h3>
                                <p className="text-sm font-light text-[#1c1c1c]/75">
                                    Reach out directly to store founders Harish Ahuja & Hitin Ahuja.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1c1c1c] text-[#f4f1ea] rounded-md text-sm font-light hover:bg-black/85 transition-colors"
                                >
                                    <span>Contact Us</span>
                                    <ArrowRight size={15} />
                                </Link>
                                <a
                                    href="tel:+919417718844"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#ffffff] border border-[#b6ac9f]/60 text-[#1c1c1c] rounded-md text-sm font-light hover:bg-[#f4f1ea] transition-colors"
                                >
                                    <Phone size={14} />
                                    <span>+91 9417718844</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-[#b6ac9f]/40 flex flex-wrap items-center justify-between gap-4 text-xs font-light text-[#1c1c1c]/70">
                            <div className="flex items-center gap-2">
                                <MapPin size={13} />
                                <span>Burf Wali Gali, Gidderbaha, Punjab · 152101</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={13} />
                                <span>trendydecor7@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
