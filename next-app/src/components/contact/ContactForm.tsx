'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { API_BASE_URL } from '@/config/api'

export default function ContactForm() {
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

    if (submitted) {
        return (
            <div className="p-8 bg-[#e8e3da]/60 border border-[#b6ac9f]/60 rounded-md text-[#1c1c1c] text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#1c1c1c] text-[#f4f1ea] flex items-center justify-center">
                    <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-normal">Message Received</h3>
                <p className="text-[14px] font-light text-[#1c1c1c]/70">
                    Thank you! Your inquiry has been sent to our concierge team at Trendy Decor. Check your email for confirmation.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-5 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-xs font-light tracking-wider uppercase rounded-md cursor-pointer hover:bg-black transition-colors"
                >
                    Send Another Message
                </button>
            </div>
        )
    }

    return (
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
    )
}
