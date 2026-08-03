import React from 'react'
import type { Metadata } from 'next'
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
    title: 'Trendy Decor | Contact Us | Gidderbaha — Harish Ahuja & Hitin Ahuja',
    description:
        'Get in touch with Trendy Decor in Gidderbaha for custom gift hamper orders, floral decor consultations, customized chocolates, and event inquiries across Gidderbaha, Bathinda & Malout.',
    keywords: [
        'trendy decor',
        'trendy decors',
        'contact trendy decor',
        'trendy decor gidderbaha',
        'trendydecor24.shop',
        'trendydecors.shop',
        'trendydecor.store',
        'gidderbaha decor contact',
        'harish ahuja contact',
        'hitin ahuja',
        'event booking gidderbaha',
        'gift hamper inquiry',
    ],
    openGraph: {
        title: 'Trendy Decor | Contact Us | Gidderbaha',
        description:
            'Get in touch with Trendy Decor in Gidderbaha for custom gift hamper orders and event consultations.',
        url: 'https://trendydecor24.shop/contact',
        type: 'website',
    },
}

export default function Contact() {
    return (
        <main className="w-full select-none" style={{ fontFamily: "'Playpen Sans', sans-serif" }}>
            <div className="flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                <section className="w-full bg-[#f4f1ea] py-14 md:py-20 px-8 text-center border-b border-[#b6ac9f]/30">
                    <div className="max-w-[1600px] mx-auto px-8 md:px-12">
                        <div className="max-w-xl mx-auto space-y-3">
                            <span className="inline-block text-[11px] md:text-[12px] font-light uppercase tracking-[0.2em] text-[#1c1c1c]/60 bg-[#e8e3da]/70 px-4 py-1 rounded-full border border-[#b6ac9f]/40">
                                Atelier Concierge
                            </span>
                            <h1 className="text-3xl md:text-5xl font-normal text-[#1c1c1c] tracking-tight">
                                Contact Us
                            </h1>
                            <p className="text-[14px] md:text-[15px] font-light text-[#1c1c1c]/70 leading-relaxed max-w-md mx-auto pt-1">
                                For bespoke hamper inquiries, corporate gifting, or questions, reach
                                out to our team below.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-[#e8e3da] py-8 md:py-12">
                    <div className="max-w-[1600px] mx-auto px-8 md:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '3px' }}>
                            <div className="bg-[#f4f1ea] p-8 md:p-14 flex flex-col justify-between space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[12px] font-light uppercase tracking-widest text-[#1c1c1c]/50">
                                        Concierge
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-normal text-[#1c1c1c]">
                                        Trendy Decor
                                    </h2>
                                    <p className="text-[13px] font-light text-[#1c1c1c]/65 leading-relaxed pt-1">
                                        We are dedicated to offering exceptional service and bespoke
                                        luxury gifting solutions tailored to your unique
                                        celebrations.
                                    </p>
                                </div>

                                <div className="space-y-6 text-[14px] font-light text-[#1c1c1c]/80 border-t border-[#b6ac9f]/30 pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-full bg-[#e8e3da] flex items-center justify-center text-[#1c1c1c] shrink-0 border border-[#b6ac9f]/40">
                                            <Mail size={16} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-light uppercase tracking-wider text-[#1c1c1c]/50">
                                                Email
                                            </p>
                                            <p className="pt-0.5 text-[14px]">
                                                trendydecor7@gmail.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-full bg-[#e8e3da] flex items-center justify-center text-[#1c1c1c] shrink-0 border border-[#b6ac9f]/40">
                                            <Phone size={16} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-light uppercase tracking-wider text-[#1c1c1c]/50">
                                                Phone
                                            </p>
                                            <p className="pt-0.5 text-[14px]">+91 9417718844</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded-full bg-[#e8e3da] flex items-center justify-center text-[#1c1c1c] shrink-0 border border-[#b6ac9f]/40">
                                            <MapPin size={16} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-light uppercase tracking-wider text-[#1c1c1c]/50">
                                                Location
                                            </p>
                                            <p className="pt-0.5 text-[14px]">
                                                Burf Wali Gali, Gidderbaha, Punjab
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[12px] font-light text-[#1c1c1c]/50 border-t border-[#b6ac9f]/30 pt-4 flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-[#1c1c1c]/70" />
                                    <span>Response time: Usually within 24 hours</span>
                                </div>
                            </div>

                            <div className="bg-[#f4f1ea] p-8 md:p-14 flex flex-col justify-center">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
