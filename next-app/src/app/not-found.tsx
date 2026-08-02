'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Home, Compass } from 'lucide-react'
import SEO from '@/components/common/SEO'

export default function NotFound() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const { innerWidth, innerHeight } = window
            const x = (e.clientX / innerWidth - 0.5) * 2
            const y = (e.clientY / innerHeight - 0.5) * 2
            setMousePos({ x, y })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            ref={containerRef}
            className="min-h-[88vh] bg-[#e8e3da] text-[#1c1c1a] relative overflow-hidden flex flex-col justify-between pt-24 pb-16 px-4 sm:px-8 lg:px-16 select-none"
        >
            <SEO
                title="Page Not Found | 404 Gallery Error"
                description="The requested decor piece or gallery page could not be found. Explore our modern home decor collection or return to the main showroom."
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                style={{
                    transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <span className="font-['Oswald'] font-bold text-[28vw] leading-none text-[#1c1c1a]/[0.05] tracking-tighter select-none">
                    404
                </span>
            </div>
            <div
                className="absolute -top-10 -right-10 w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden opacity-20 pointer-events-none blur-[1px] hidden sm:block"
                style={{
                    transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px) rotate(${mousePos.x * 8}deg)`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <img src="/hero-assets/hero1.png" alt="" className="w-full h-full object-cover grayscale mix-blend-multiply" />
            </div>
            <div
                className="absolute bottom-10 -left-16 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden opacity-15 pointer-events-none blur-[1px] hidden md:block"
                style={{
                    transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) rotate(${mousePos.y * -10}deg)`,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <img src="/hero-assets/hero2.png" alt="" className="w-full h-full object-cover grayscale mix-blend-multiply" />
            </div>
            <div className="relative z-10 max-w-6xl mx-auto w-full my-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                        <div className="space-y-2">
                            <h1 className="font-['Oswald'] text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight uppercase leading-[0.95] text-[#1c1c1a]">
                                Page Not <br />
                                <span className="text-[#8c8275] italic font-serif font-light lowercase">found.</span>
                            </h1>
                        </div>
                        <p className="text-[#4a4741] text-base sm:text-lg max-w-xl font-['Playpen_Sans'] leading-relaxed">
                            The architectural piece or gallery room you are searching for has been moved, curated into a new
                            exhibition, or never existed in this space.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#1c1c1a] text-[#e8e3da] text-sm font-['JetBrains_Mono'] tracking-widest uppercase hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <Home className="w-4 h-4" />
                                <span>Return to Showroom</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/80 hover:bg-white text-[#1c1c1a] text-sm font-['JetBrains_Mono'] tracking-widest uppercase border border-[#1c1c1a]/15 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                <Compass className="w-4 h-4 text-[#8c8275]" />
                                <span>Explore Catalog</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
