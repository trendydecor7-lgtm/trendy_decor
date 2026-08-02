import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/common/SEO'

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
            // Only apply parallax calculations on desktop screens (>= 768px) to prevent mobile jank & image cutoff
            if (window.innerWidth < 768) {
                setParallaxY1(0)
                setParallaxY2(0)
                return
            }

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
        <main className="w-full select-none" style={{ fontFamily: "'Playpen Sans', sans-serif" }}>
            <SEO
                title="Event Decor, Gift Hampers & Customized Chocolates | Gidderbaha"
                description="Explore Trendy Decor Gidderbaha by Harish Ahuja & Hitin Ahuja. Premium event decoration, customized gift hampers, artisanal chocolates, bouquets, and designer rakhis."
                keywords="trendy decor, gidderbaha, gift hampers, customized chocolates, bouquets, designer rakhis, event decor, harish ahuja, hitin ahuja"
            />
            <div className="flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                {/* ── 1ST SECTION: HERO TOP IMAGES ── */}
                <section
                    ref={heroSectionRef}
                    className="relative md:sticky top-0 w-full flex bg-[#e8e3da] z-0 overflow-hidden h-[220px] xs:h-[270px] sm:h-[360px] md:h-[calc(85vh-64px)]"
                >
                    <div
                        className="relative overflow-hidden cursor-pointer w-full h-full grid grid-cols-2 will-change-transform"
                        style={{
                            gap: '3px',
                            transform: `translate3d(0, ${parallaxY1}px, 0)`,
                            transition: 'transform 0.1s ease-out',
                        }}
                    >
                        <div
                            onClick={() => navigate('/products')}
                            className="relative overflow-hidden cursor-pointer w-full h-full group"
                        >
                            {/* Hero 1 image */}
                            <img
                                src="/hero-assets/hero1.png"
                                alt="Luxury Hampers & Decor"
                                fetchPriority="high"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Gradient overlay for label readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-500" />
                        </div>

                        <div
                            onClick={() => navigate('/products')}
                            className="relative overflow-hidden cursor-pointer w-full h-full group"
                        >
                            {/* Hero 2 image */}
                            <img
                                src="/hero-assets/hero2.png"
                                alt="Festive Celebrations"
                                fetchPriority="high"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-500" />
                        </div>
                    </div>
                </section>

                {/* ── OVERLAYING CONTENT ── */}
                <div className="relative z-10 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                    {/* 1st Video Section */}
                    <section
                        className="relative w-full overflow-hidden h-[50vh] sm:h-[65vh] md:h-screen"
                    >
                        <video
                            ref={video1Ref}
                            src="/hero-assets/slower.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 pr-6">
                            <p
                                className="text-xs sm:text-sm md:text-[15px] font-light text-white/90 tracking-widest uppercase drop-shadow-md border-l-2 border-[#b6ac9f] pl-3"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Trendy Decor — Luxury Gifting Universe
                            </p>
                        </div>
                    </section>

                    {/* Shop by category section */}
                    <section className="w-full bg-[#f4f1ea]">
                        <div className="w-full flex items-center justify-center py-5 sm:py-8 border-b border-black/8 px-4 text-center">
                            <h2
                                className="text-base sm:text-lg md:text-[20px] font-light tracking-[0.14em] text-[#1c1c1c] uppercase"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Shop by category
                            </h2>
                        </div>

                        {/* 2-column grid on mobile/tablet, 4-column on desktop for perfectly proportioned cards */}
                        <div
                            className="w-full grid grid-cols-2 lg:grid-cols-4"
                            style={{ gap: '3px', background: '#e8e3da' }}
                        >
                            {/* 1. Hampers */}
                            <div
                                onClick={() => navigate('/products?category=Hampers')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#d4cec5]"
                            >
                                <img
                                    src="/category/hamper.png"
                                    alt="Hampers"
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 space-y-0.5 sm:space-y-1">
                                    <p className="text-sm sm:text-lg md:text-xl font-normal text-white tracking-wide drop-shadow-md">
                                        Hampers
                                    </p>
                                    <p className="text-[9px] sm:text-[11px] font-light text-white/80 tracking-wider uppercase flex items-center gap-1">
                                        Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                    </p>
                                </div>
                            </div>

                            {/* 2. Rakhis */}
                            <div
                                onClick={() => navigate('/products?category=Rakhis')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#c9c3b8]"
                            >
                                <img
                                    src="/category/rakhi.png"
                                    alt="Rakhis"
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 space-y-0.5 sm:space-y-1">
                                    <p className="text-sm sm:text-lg md:text-xl font-normal text-white tracking-wide drop-shadow-md">
                                        Rakhis
                                    </p>
                                    <p className="text-[9px] sm:text-[11px] font-light text-white/80 tracking-wider uppercase flex items-center gap-1">
                                        Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                    </p>
                                </div>
                            </div>

                            {/* 3. Customizable Chocolates */}
                            <div
                                onClick={() => navigate('/products?category=Customize Chocolates')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#bdb7ac]"
                            >
                                <img
                                    src="/category/choco.png"
                                    alt="Customizable Chocolates"
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 space-y-0.5 sm:space-y-1">
                                    <p className="text-sm sm:text-lg md:text-xl font-normal text-white tracking-wide drop-shadow-md leading-tight">
                                        Chocolates
                                    </p>
                                    <p className="text-[9px] sm:text-[11px] font-light text-white/80 tracking-wider uppercase flex items-center gap-1">
                                        Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                    </p>
                                </div>
                            </div>

                            {/* 4. Bouquets */}
                            <div
                                onClick={() => navigate('/products?category=Bouquets')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#b0aaa0]"
                            >
                                <img
                                    src="/category/bouque.png"
                                    alt="Bouquets"
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 space-y-0.5 sm:space-y-1">
                                    <p className="text-sm sm:text-lg md:text-xl font-normal text-white tracking-wide drop-shadow-md">
                                        Bouquets
                                    </p>
                                    <p className="text-[9px] sm:text-[11px] font-light text-white/80 tracking-wider uppercase flex items-center gap-1">
                                        Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* ── MOBILE-ONLY TEXT BLOCK (RIGHT BELOW CATEGORY SECTION) ── */}
                        <div className="md:hidden w-full bg-[#f4f1ea] flex flex-col items-center justify-center text-center px-6 py-10 border-t border-[#b6ac9f]/30">
                            <div className="max-w-sm space-y-2.5">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1c1c1c]/50">
                                    Bespoke Gifting
                                </span>
                                <h2
                                    className="text-2xl font-normal text-[#1c1c1c] tracking-tight"
                                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                                >
                                    Trendy Decor
                                </h2>
                                <p
                                    className="text-xs font-light text-[#1c1c1c]/75 leading-relaxed tracking-wide"
                                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                                >
                                    A luxury gifting universe crafting bespoke hampers designed with
                                    intention, turning every celebration into a timeless memory.
                                </p>
                            </div>
                        </div>

                        {/* ── MOBILE-ONLY HERO3 IMAGE BELOW TEXT BLOCK ── */}
                        <div
                            onClick={() => navigate('/products')}
                            className="md:hidden relative w-full h-[240px] xs:h-[280px] sm:h-[360px] overflow-hidden cursor-pointer group bg-[#d4cec5] border-t border-[#b6ac9f]/30"
                        >
                            <img
                                src="/hero-assets/hero3.jpeg"
                                alt="Signature Collection"
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-500" />
                            <div className="absolute bottom-4 left-4 xs:bottom-6 xs:left-6 z-10 space-y-0.5">
                                <p className="text-[9px] xs:text-[11px] font-light uppercase tracking-[0.22em] text-white/80">
                                    Artisanal Elegance
                                </p>
                                <p className="text-base xs:text-xl font-normal text-white tracking-wide drop-shadow-md">
                                    Signature Collection
                                </p>
                                <p className="text-[9px] xs:text-[11px] font-light text-white/85 tracking-wider uppercase flex items-center gap-1 pt-0.5">
                                    Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── 2ND STICKY SECTION (VIDEO) — DESKTOP ONLY ── */}
                <section
                    ref={secondSectionRef}
                    className="hidden md:block sticky top-0 w-full overflow-hidden z-10 h-screen"
                >
                    <div
                        className="absolute inset-0 bg-[#bfb9ae] will-change-transform"
                        style={{
                            transform: parallaxY2 ? `translate3d(0, ${parallaxY2}px, 0)` : 'none',
                            transition: parallaxY2 ? 'transform 0.1s ease-out' : 'none',
                        }}
                    >
                        <video
                            src="/hero-assets/video.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                        <div className="absolute bottom-10 left-10 z-10 pr-6">
                            <span className="text-xs font-light text-white/90 uppercase tracking-[0.25em] bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                                Crafted With Passion
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── OVERLAYING FINAL FEATURE / PHOTOS SECTION ── */}
                <div className="relative z-20 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                    <section
                        className="w-full flex flex-col md:flex-row"
                        style={{ gap: '3px' }}
                    >
                        {/* Text box — Desktop only (since mobile renders it right below categories) */}
                        <div className="hidden md:flex flex-1 bg-[#f4f1ea] flex-col items-center justify-center text-center px-8 md:px-12 py-16">
                            <div className="max-w-sm space-y-4">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1c1c1c]/50">
                                    Bespoke Gifting
                                </span>
                                <h2
                                    className="text-3xl font-normal text-[#1c1c1c] tracking-tight"
                                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                                >
                                    Trendy Decor
                                </h2>
                                <p
                                    className="text-[14px] font-light text-[#1c1c1c]/75 leading-relaxed tracking-wide"
                                    style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                                >
                                    A luxury gifting universe crafting bespoke hampers designed with
                                    intention, turning every celebration into a timeless memory.
                                </p>
                            </div>
                        </div>

                        {/* Photo 1 at end for mobile & desktop */}
                        <div
                            onClick={() => navigate('/products')}
                            className="flex-1 relative h-[220px] xs:h-[260px] sm:h-[340px] md:h-[450px] overflow-hidden cursor-pointer group bg-[#d4cec5]"
                        >
                            <img
                                src="/hero-assets/hero3.jpeg"
                                alt="Signature Collection"
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                                <span className="text-[10px] sm:text-xs font-light text-white uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    Signature Hampers
                                </span>
                            </div>
                        </div>

                        {/* Photo 2 at end for mobile & desktop */}
                        <div
                            onClick={() => navigate('/products')}
                            className="flex-1 relative h-[220px] xs:h-[260px] sm:h-[340px] md:h-[450px] overflow-hidden cursor-pointer group bg-[#c9c3b8]"
                        >
                            <img
                                src="/hero-assets/hero4.jpeg"
                                alt="Artisanal Decor"
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                                <span className="text-[10px] sm:text-xs font-light text-white uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    Custom Styling
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Home

