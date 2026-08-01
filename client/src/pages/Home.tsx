import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const heroSectionRef = useRef<HTMLDivElement>(null)
    const video1Ref = useRef<HTMLVideoElement>(null)
    const secondSectionRef = useRef<HTMLDivElement>(null)
    const [parallaxY1, setParallaxY1] = useState(0)
    const [parallaxY2, setParallaxY2] = useState(0)

    useEffect(() => {
        if (video1Ref.current) {
            video1Ref.current.playbackRate = 0.2 // Ultra slow-mo video playback rate
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            // Parallax offset for 1st Section (Hero Images)
            if (heroSectionRef.current) {
                const rect1 = heroSectionRef.current.getBoundingClientRect()
                const topOffset1 = -rect1.top
                if (topOffset1 > 0) {
                    setParallaxY1(topOffset1 * 0.35)
                } else {
                    setParallaxY1(0)
                }
            }

            // Parallax offset for 2nd Section
            if (secondSectionRef.current) {
                const rect2 = secondSectionRef.current.getBoundingClientRect()
                const topOffset2 = -rect2.top
                if (topOffset2 > 0) {
                    setParallaxY2(topOffset2 * 0.35)
                } else {
                    setParallaxY2(0)
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="w-full" style={{ fontFamily: "'Playpen Sans', sans-serif" }}>
            <div className="flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                {/* ── 1ST SECTION: HERO TOP IMAGES (STICKY SLOW SCROLL PARALLAX) ── */}
                <section
                    ref={heroSectionRef}
                    className="sticky top-0 w-full flex bg-[#e8e3da] z-0 overflow-hidden"
                    style={{ height: 'calc(85vh - 64px)' }}
                >
                    <div
                        className="relative overflow-hidden cursor-pointer w-full h-full flex will-change-transform"
                        style={{
                            gap: '3px',
                            transform: `translate3d(0, ${parallaxY1}px, 0) scale(1.03)`,
                            transition: 'transform 0.1s ease-out',
                        }}
                    >
                        <div
                            onClick={() => navigate('/products')}
                            className="relative overflow-hidden cursor-pointer"
                            style={{ flex: '0 0 50%' }}
                        >
                            {/* Hero 1 image */}
                            <img
                                src="/hero-assets/hero1.png"
                                alt="Rakhi Hamper"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Gradient overlay for label readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        </div>

                        <div
                            onClick={() => navigate('/products')}
                            className="relative overflow-hidden cursor-pointer"
                            style={{ flex: '0 0 calc(50% - 3px)' }}
                        >
                            {/* Hero 2 image */}
                            <img
                                src="/hero-assets/hero2.png"
                                alt="Rakhi Hamper"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        </div>
                    </div>
                </section>

                {/* ── OVERLAYING CONTENT (SLIDES UP OVER HERO TOP IMAGES) ── */}
                <div className="relative z-10 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                    {/* 1st Video Section (Normal Flow Overlay) */}
                    <section
                        className="relative w-full overflow-hidden"
                        style={{ height: '100vh' }}
                    >
                        <video
                            ref={video1Ref}
                            src="/hero-assets/slower.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                        <div className="absolute bottom-8 left-8 z-10">
                            <p
                                className="text-[15px] font-light text-white/80 tracking-wide drop-shadow-md"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Trendy Decor — Luxury Gifting Universe
                            </p>
                        </div>
                    </section>

                    {/* Shop by category section */}
                    <section className="w-full bg-[#f4f1ea]">
                        <div className="w-full flex items-center justify-center py-6 border-b border-black/8">
                            <h2
                                className="text-[18px] font-light tracking-[0.12em] text-[#1c1c1c]"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Shop by category
                            </h2>
                        </div>

                        <div
                            className="w-full flex flex-col md:flex-row"
                            style={{ minHeight: '450px', gap: '4px', background: '#e8e3da' }}
                        >
                            {/* 1. Hampers (Image: /category/hamper.png) */}
                            <div
                                onClick={() => navigate('/products?category=Hampers')}
                                className="relative flex-1 h-[380px] md:h-[675px] overflow-hidden cursor-pointer group bg-[#d4cec5]"
                            >
                                <img
                                    src="/category/hamper.png"
                                    alt="Hampers"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-500" />
                                <div className="absolute bottom-6 left-6 z-10 space-y-1">
                                    <p className="text-[18px] font-normal text-white tracking-wide drop-shadow-md">
                                        Hampers
                                    </p>
                                    <p className="text-[11px] font-light text-white/80 tracking-wider uppercase">
                                        Explore Collection →
                                    </p>
                                </div>
                            </div>

                            {/* 2. Rakhis (Image: /category/rakhi.png) */}
                            <div
                                onClick={() => navigate('/products?category=Rakhis')}
                                className="relative flex-1 h-[380px] md:h-[675px] overflow-hidden cursor-pointer group bg-[#c9c3b8]"
                            >
                                <img
                                    src="/category/rakhi.png"
                                    alt="Rakhis"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform "
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-500" />
                                <div className="absolute bottom-6 left-6 z-10 space-y-1">
                                    <p className="text-[18px] font-normal text-white tracking-wide drop-shadow-md">
                                        Rakhis
                                    </p>
                                    <p className="text-[11px] font-light text-white/80 tracking-wider uppercase">
                                        Explore Collection →
                                    </p>
                                </div>
                            </div>

                            {/* 3. Customizable Chocolates (Image: /category/choco.png) */}
                            <div
                                onClick={() => navigate('/products?category=Customize Chocolates')}
                                className="relative flex-1 h-[380px] md:h-[675px] overflow-hidden cursor-pointer group bg-[#bdb7ac]"
                            >
                                <img
                                    src="/category/choco.png"
                                    alt="Customizable Chocolates"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-500" />
                                <div className="absolute bottom-6 left-6 z-10 space-y-1">
                                    <p className="text-[18px] font-normal text-white tracking-wide drop-shadow-md">
                                        Customizable Chocolates
                                    </p>
                                    <p className="text-[11px] font-light text-white/80 tracking-wider uppercase">
                                        Explore Collection →
                                    </p>
                                </div>
                            </div>

                            {/* 4. Bouquets (Image: /category/bouque.png) */}
                            <div
                                onClick={() => navigate('/products?category=Bouquets')}
                                className="relative flex-1 h-[380px] md:h-[675px] overflow-hidden cursor-pointer group bg-[#b0aaa0]"
                            >
                                <img
                                    src="/category/bouque.png"
                                    alt="Bouquets"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-500" />
                                <div className="absolute bottom-6 left-6 z-10 space-y-1">
                                    <p className="text-[18px] font-normal text-white tracking-wide drop-shadow-md">
                                        Bouquets
                                    </p>
                                    <p className="text-[11px] font-light text-white/80 tracking-wider uppercase">
                                        Explore Collection →
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── 2ND STICKY PARALLAX SECTION ── */}
                <section
                    ref={secondSectionRef}
                    className="sticky top-0 w-full overflow-hidden z-10"
                    style={{ height: '100vh' }}
                >
                    <div
                        className="absolute inset-0 bg-[#bfb9ae] will-change-transform"
                        style={{
                            transform: `translate3d(0, ${parallaxY2}px, 0) scale(1.05)`,
                            transition: 'transform 0.1s ease-out',
                        }}
                    >
                        <video
                            src="/hero-assets/video.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>

                {/* ── OVERLAYING FINAL FEATURE SECTION (SLIDES UP OVER 2ND VIDEO) ── */}
                <div className="relative z-20 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                    <section
                        className="w-full flex flex-col lg:flex-row"
                        style={{ height: '580px', gap: '3px' }}
                    >
                        <div className="flex-1 bg-[#f4f1ea] flex flex-col items-center justify-center text-center px-8 md:px-12 py-12">
                            <div className="max-w-sm space-y-4">
                                <h2
                                    className="text-2xl md:text-3xl font-normal text-[#1c1c1c] tracking-tight"
                                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                                >
                                    Trendy Decor
                                </h2>
                                <p
                                    className="text-[13px] md:text-[14px] font-light text-[#1c1c1c]/70 leading-relaxed tracking-wide"
                                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                                >
                                    A luxury gifting universe crafting bespoke hampers designed with
                                    intention, turning every celebration into a timeless memory.
                                </p>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/products')}
                            className="flex-1 relative overflow-hidden cursor-pointer group bg-[#d4cec5]"
                        >
                            <img
                                src="/hero-assets/hero3.jpeg"
                                alt="Signature Collection"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                        </div>

                        <div
                            onClick={() => navigate('/products')}
                            className="flex-1 relative overflow-hidden cursor-pointer group bg-[#c9c3b8]"
                        >
                            <img
                                src="/hero-assets/hero4.jpeg"
                                alt="Artisanal Decor"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Home
