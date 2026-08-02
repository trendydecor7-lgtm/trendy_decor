import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { API_BASE_URL } from '../config/api'

const Instagram: React.FC<{ size?: number; strokeWidth?: number; className?: string }> = ({
    size = 24,
    strokeWidth = 2,
    className = '',
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
)

const Footer: React.FC = () => {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        try {
            const res = await fetch(`${API_BASE_URL}/auth/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setSubscribed(true)
                setEmail('')
                setTimeout(() => setSubscribed(false), 4000)
            }
        } catch (err) {
            console.error('Newsletter subscription error:', err)
        }
    }

    return (
        <footer
            className="w-full bg-[#c8bfb6] border-t border-[#b6ac9f]/70 select-none text-[#1c1c1c] mt-[4px]"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
                    <div className="md:col-span-5 space-y-4">
                        <Link
                            to="/"
                            className="text-3xl md:text-4xl font-normal tracking-tight text-[#1c1c1c] inline-block hover:opacity-70 transition-opacity"
                            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                        >
                            Trendy Decor
                        </Link>
                        <p className="text-[14px] md:text-[15px] font-light text-[#1c1c1c]/75 leading-relaxed max-w-sm">
                            Trendy Decor is a premier luxury gifting brand offering bespoke hampers
                            and curated decor designed to turn every celebration into a timeless
                            memory.
                        </p>
                        <a
                            href="https://www.instagram.com/trendy_decor_gdb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[14px] font-light text-[#1c1c1c]/80 hover:text-black transition-colors pt-1"
                        >
                            <Instagram size={16} strokeWidth={1.5} />
                            <span>@trendydecor</span>
                        </a>
                    </div>

                    <div className="hidden md:block md:col-span-3 space-y-4">
                        <h3 className="text-[16px] font-medium tracking-wide text-[#1c1c1c]">
                            Company
                        </h3>
                        <ul className="space-y-2.5 text-[14px] font-light text-[#1c1c1c]/75">
                            <li>
                                <Link to="/about" className="hover:opacity-60 transition-opacity">
                                    About us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="hover:opacity-60 transition-opacity"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:opacity-60 transition-opacity">
                                    Contact us
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:opacity-60 transition-opacity">
                                    Privacy policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 space-y-4">
                        <h3 className="text-[16px] font-medium tracking-wide text-[#1c1c1c]">
                            Subscribe to our newsletter
                        </h3>
                        <p className="text-[14px] font-light text-[#1c1c1c]/75 leading-relaxed">
                            The latest news, luxury collections, and special offers sent to your
                            inbox weekly.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-2.5 pt-1"
                        >
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 bg-[#f4f1ea] border border-[#b6ac9f]/60 rounded-md text-[14px] font-light text-[#1c1c1c] placeholder:text-[#1c1c1c]/50 focus:outline-none focus:border-[#1c1c1c] transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-[#1c1c1c] text-[#c8bfb6] rounded-md text-[14px] font-light tracking-wide hover:bg-black/85 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                Subscribe
                            </button>
                        </form>
                        {subscribed && (
                            <p className="text-[12px] font-light text-emerald-800 pt-1">
                                Thank you for subscribing to Trendy Decor!
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-12 md:mt-16 pt-6 border-t border-[#b6ac9f]/70 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-[13px] font-light text-[#1c1c1c]/65">
                        Copyright {new Date().getFullYear()} © Trendy Decor. All Rights Reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[13px] font-light text-[#1c1c1c]/80">
                        <span className="text-[#1c1c1c]/40">•</span>
                        <span>
                            Built by{' '}
                            <span className="font-normal text-[#1c1c1c]">Keshav Gilhotra</span>
                        </span>
                        <a
                            href="https://instagram.com/keshav_gilhotra_"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-black transition-colors"
                            aria-label="Keshav Instagram"
                        >
                            <Instagram size={15} strokeWidth={1.5} />
                        </a>
                        <a
                            href="https://trendydecor24.shop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-black transition-colors"
                            aria-label="Portfolio"
                        >
                            <Globe size={15} strokeWidth={1.5} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
