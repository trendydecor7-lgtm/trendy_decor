'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { API_BASE_URL } from '@/config/api'
import SEO from '@/components/common/SEO'

export default function Contact() {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.message) return

        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/auth/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setSubmitted(true)
                toast.success(data.message || 'Message sent! Check your email for confirmation.')
                setFormData({ name: '', email: '', phone: '', message: '' })
            } else {
                toast.error(data.message || 'Failed to send message.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Error sending message.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="w-full select-none" style={{ fontFamily: "'Playpen Sans', sans-serif" }}>
            <SEO
                title="Contact Us | Inquiry & Consultation"
                description="Get in touch with Trendy Decor for custom home decor consultation, orders, and inquiries."
            />
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
                                {submitted ? (
                                    <div className="p-8 bg-[#e8e3da]/60 border border-[#b6ac9f]/60 rounded-md text-[#1c1c1c] text-center space-y-3">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-[#1c1c1c] text-[#f4f1ea] flex items-center justify-center">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h3 className="text-lg font-normal">Message Received</h3>
                                        <p className="text-[14px] font-light text-[#1c1c1c]/70">
                                            Thank you! Your inquiry has been sent to our concierge
                                            team at Trendy Decor. Check your email for confirmation.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="mt-3 px-5 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-xs font-light tracking-wider uppercase rounded-md"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="text-[12px] font-light uppercase tracking-wider text-[#1c1c1c]/70 block mb-1.5">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Your name"
                                                className="w-full px-4 py-3 bg-[#e8e3da]/40 border border-[#b6ac9f]/50 rounded-md text-[14px] font-light text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[12px] font-light uppercase tracking-wider text-[#1c1c1c]/70 block mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                placeholder="Your email address"
                                                className="w-full px-4 py-3 bg-[#e8e3da]/40 border border-[#b6ac9f]/50 rounded-md text-[14px] font-light text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[12px] font-light uppercase tracking-wider text-[#1c1c1c]/70 block mb-1.5">
                                                Phone (Optional)
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                placeholder="+91 9417718844"
                                                className="w-full px-4 py-3 bg-[#e8e3da]/40 border border-[#b6ac9f]/50 rounded-md text-[14px] font-light text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[12px] font-light uppercase tracking-wider text-[#1c1c1c]/70 block mb-1.5">
                                                Message
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        message: e.target.value,
                                                    })
                                                }
                                                placeholder="How can we assist you with luxury decor or bespoke hampers?"
                                                className="w-full px-4 py-3 bg-[#e8e3da]/40 border border-[#b6ac9f]/50 rounded-md text-[14px] font-light text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-[#1c1c1c] text-[#f4f1ea] rounded-md text-[13px] font-light tracking-widest uppercase hover:bg-black/85 transition-colors flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <>
                                                    <span>Send Message</span>
                                                    <Send
                                                        size={14}
                                                        className="group-hover:translate-x-0.5 transition-transform"
                                                    />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
