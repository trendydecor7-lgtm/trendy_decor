import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Navbar = () => {
    const location = useLocation()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const { totalCount: cartCount } = useCart()

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <>
            <header
                className="w-full bg-[#f4f1ea] border-b border-black/10 select-none sticky top-0 z-50"
                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
            >
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 h-16 flex items-center">
                    <div className="flex-1 flex items-center">
                        <Link
                            to="/"
                            className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#1c1c1c] hover:opacity-75 transition-opacity shrink-0"
                            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                        >
                            Trendy Decor
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
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

                    <div className="flex-1 flex items-center justify-end gap-5">
                        <Link
                            to="/profile"
                            className="hidden md:flex p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors"
                            aria-label="Profile"
                        >
                            <User size={25} strokeWidth={1.5} />
                        </Link>

                        <Link
                            to="/cart"
                            className="relative p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag size={25} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1c1c1c] text-[#f4f1ea] text-[9px] font-semibold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className="md:hidden p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors"
                            onClick={() => setIsMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={26} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <div
                        className="relative w-72 max-w-full bg-[#f4f1ea] h-full shadow-xl flex flex-col border-r border-black/10 drawer-slide-in"
                        style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                    >
                        <div className="flex items-center justify-between px-6 h-16 border-b border-black/10">
                            <span
                                className="text-2xl font-normal text-[#1c1c1c]"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Trendy Decor
                            </span>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-1 text-[#1c1c1c] hover:text-neutral-500 transition-colors"
                            >
                                <X size={20} strokeWidth={1.6} />
                            </button>
                        </div>

                        <nav className="flex flex-col px-6 py-6 gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`py-3 text-[16px] font-light tracking-wide border-b border-black/5 transition-colors ${isActive(link.to)
                                        ? 'text-[#1c1c1c] underline underline-offset-4'
                                        : 'text-neutral-500 hover:text-[#1c1c1c]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                to="/profile"
                                onClick={() => setIsMobileOpen(false)}
                                className={`py-3 text-[16px] font-light tracking-wide border-b border-black/5 transition-colors flex items-center gap-2.5 ${isActive('/profile')
                                    ? 'text-[#1c1c1c] underline underline-offset-4'
                                    : 'text-neutral-500 hover:text-[#1c1c1c]'
                                    }`}
                            >
                                <User size={19} strokeWidth={1.5} />
                                Profile
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
