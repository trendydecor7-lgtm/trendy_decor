'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const Navbar = () => {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const { totalCount: cartCount } = useCart()

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <>
            {/* Rakhi Special Offer Endless Marquee Top Nav (Scrolls with page, not sticky) */}
            <div
                className="w-full bg-[#c8bfb6] text-[#1c1c1c] py-2.5 border-b border-[#b6ac9f]/70 select-none text-[11px] sm:text-xs tracking-wide"
                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
            >
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12">
                    <div className="w-full overflow-hidden relative marquee-mask">
                        {/* Left Gradient Overlay Fade (Aligned with Main Nav Start) */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-r from-[#c8bfb6] via-[#c8bfb6]/85 to-transparent z-10 pointer-events-none" />
                        {/* Right Gradient Overlay Fade (Aligned with Main Nav End) */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-l from-[#c8bfb6] via-[#c8bfb6]/85 to-transparent z-10 pointer-events-none" />

                        <div className="animate-endless-marquee flex items-center">
                            {[0, 1, 2, 3].map((idx) => (
                                <div key={idx} className="flex items-center gap-6 sm:gap-10 px-3 sm:px-5 shrink-0">
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                            ★ Rakhi Special Offer
                                        </span>
                                        <span className="text-[#1c1c1c]/60">—</span>
                                        <span className="font-normal text-[#1c1c1c]">
                                            FREE Pan-India Delivery on Orders Above ₹1,000!
                                        </span>
                                    </span>
                                    <span className="text-[#1c1c1c]/35">•</span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                            Festival Ready
                                        </span>
                                        <span className="text-[#1c1c1c]/60">—</span>
                                        <span className="font-normal text-[#1c1c1c]">
                                            Handcrafted Luxury Hampers & Designer Rakhis
                                        </span>
                                    </span>
                                    <span className="text-[#1c1c1c]/35">•</span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                            Express Delivery
                                        </span>
                                        <span className="text-[#1c1c1c]/60">—</span>
                                        <span className="font-normal text-[#1c1c1c]">
                                            FREE Delivery on Orders Above ₹1,000 Across India
                                        </span>
                                    </span>
                                    <span className="text-[#1c1c1c]/35">•</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Header (Sticky Top) */}
            <header
                className="w-full bg-[#f4f1ea] border-b border-black/10 select-none sticky top-0 z-50"
                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
            >
                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 h-16 sm:h-20 flex items-center justify-between">
                    {/* Brand Logo & Title */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 sm:gap-3 hover:opacity-85 transition-opacity shrink-0"
                        >
                            <span
                                className="text-xl sm:text-2xl md:text-3xl font-normal tracking-tight text-[#1c1c1c]"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Trendy Decor
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                href={link.to}
                                className={`text-[17px] font-light tracking-[0.08em] uppercase transition-colors relative group ${isActive(link.to)
                                    ? 'text-[#1c1c1c]'
                                    : 'text-neutral-500 hover:text-[#1c1c1c]'
                                    }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-[#1c1c1c] transition-transform origin-left ${isActive(link.to)
                                        ? 'scale-x-100'
                                        : 'scale-x-0 group-hover:scale-x-100'
                                        }`}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Header Action Buttons */}
                    <div className="flex items-center justify-end gap-5">
                        {/* Profile Link (Desktop) */}
                        <Link
                            href="/profile"
                            className="hidden md:flex p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors"
                            aria-label="Profile"
                        >
                            <User size={25} strokeWidth={1.5} />
                        </Link>

                        {/* Cart Link (Desktop only) */}
                        <Link
                            href="/cart"
                            className="hidden md:flex relative p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag size={25} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1c1c1c] text-[#f4f1ea] text-[9px] font-semibold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Hamburger Button (Mobile) */}
                        <button
                            className="md:hidden p-1.5 text-[#1c1c1c] hover:text-neutral-500 transition-colors cursor-pointer"
                            onClick={() => setIsMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={26} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Smooth Mobile Drawer */}
            <div
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMobileOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Dark Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsMobileOpen(false)}
                />

                {/* Sliding Content Container */}
                <div
                    className={`relative w-80 max-w-[85vw] bg-[#f4f1ea] h-full shadow-2xl flex flex-col border-r border-black/10 transition-transform duration-300 ease-out transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                >
                    <div className="flex items-center justify-between px-6 h-16 sm:h-20 border-b border-black/10">
                        <span
                            className="text-xl font-normal text-[#1c1c1c]"
                            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                        >
                            Trendy Decor
                        </span>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors cursor-pointer"
                            aria-label="Close menu"
                        >
                            <X size={22} strokeWidth={1.6} />
                        </button>
                    </div>

                    <nav className="flex flex-col px-6 py-6 gap-1 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                href={link.to}
                                onClick={() => setIsMobileOpen(false)}
                                className={`py-3 text-[16px] font-light tracking-wide border-b border-black/5 transition-colors ${isActive(link.to)
                                    ? 'text-[#1c1c1c] font-semibold underline underline-offset-4'
                                    : 'text-neutral-500 hover:text-[#1c1c1c]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Cart inside Hamburger Drawer */}
                        <Link
                            href="/cart"
                            onClick={() => setIsMobileOpen(false)}
                            className={`py-3.5 text-[16px] font-light tracking-wide border-b border-black/5 transition-colors flex items-center justify-between ${isActive('/cart')
                                ? 'text-[#1c1c1c] font-semibold underline underline-offset-4'
                                : 'text-neutral-500 hover:text-[#1c1c1c]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                <span>Cart</span>
                            </div>
                            {cartCount > 0 && (
                                <span className="px-2 py-0.5 bg-[#1c1c1c] text-[#f4f1ea] text-[11px] font-bold rounded-full font-mono">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile Link */}
                        <Link
                            href="/profile"
                            onClick={() => setIsMobileOpen(false)}
                            className={`py-3.5 text-[16px] font-light tracking-wide border-b border-black/5 transition-colors flex items-center gap-3 ${isActive('/profile')
                                ? 'text-[#1c1c1c] font-semibold underline underline-offset-4'
                                : 'text-neutral-500 hover:text-[#1c1c1c]'
                                }`}
                        >
                            <User size={20} strokeWidth={1.5} />
                            <span>Profile</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Navbar
