'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import SEO from '@/components/common/SEO'
import SafeVideo from '@/components/common/SafeVideo'
import IntroAnimation from '@/components/common/IntroAnimation'

const loadedMediaCache = new Set<string>()

const ImageWithSkeleton: React.FC<{
    src: string
    alt: string
    className?: string
    fetchPriority?: 'high' | 'low' | 'auto'
}> = ({ src, alt, className = '', fetchPriority }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(() => loadedMediaCache.has(src))
    const imgRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        if (loadedMediaCache.has(src)) {
            setIsLoaded(true)
            return
        }
        if (imgRef.current && imgRef.current.complete) {
            loadedMediaCache.add(src)
            setIsLoaded(true)
        }
    }, [src])

    const handleLoad = () => {
        loadedMediaCache.add(src)
        setIsLoaded(true)
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && <div className="absolute inset-0 skeleton-shimmer z-10" />}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                decoding="async"
                fetchPriority={fetchPriority}
                onLoad={handleLoad}
                className={`${className} ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
            />
        </div>
    )
}

export default function Home() {
    const router = useRouter()
    const heroSectionRef = useRef<HTMLDivElement>(null)
    const video1Ref = useRef<HTMLVideoElement>(null)
    const secondVideoRef = useRef<HTMLVideoElement>(null)
    const secondSectionRef = useRef<HTMLDivElement>(null)
    const [parallaxY1, setParallaxY1] = useState(0)
    const [parallaxY2, setParallaxY2] = useState(0)
    const [showIntro, setShowIntro] = useState<boolean>(true)

    const handleIntroComplete = () => {
        setShowIntro(false)
    }

    useEffect(() => {
        if (video1Ref.current) {
            video1Ref.current.muted = true
            video1Ref.current.playbackRate = 0.2
            video1Ref.current.play().catch(() => {})
        }
        if (secondVideoRef.current) {
            secondVideoRef.current.muted = true
            secondVideoRef.current.play().catch(() => {})
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 768) {
                setParallaxY1(0)
                setParallaxY2(0)
                return
            }

            if (heroSectionRef.current) {
                const rect1 = heroSectionRef.current.getBoundingClientRect()
                const topOffset1 = -rect1.top
                if (topOffset1 > 0) {
                    setParallaxY1(topOffset1 * 0.35)
                } else {
                    setParallaxY1(0)
                }
            }

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
            {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
            <SEO
                title="Event Decor, Gift Hampers & Customized Chocolates | Gidderbaha"
                description="Explore Trendy Decor Gidderbaha by Harish Ahuja & Hitin Ahuja. Premium event decoration, customized gift hampers, artisanal chocolates, bouquets, and designer rakhis."
                keywords="trendy decor, gidderbaha, gift hampers, customized chocolates, bouquets, designer rakhis, event decor, harish ahuja, hitin ahuja"
            />
            <div className="flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                <section
                    ref={heroSectionRef}
                    className="relative md:sticky top-0 w-full flex bg-[#e8e3da] z-0 overflow-hidden h-[50vh] xs:h-[60vh] sm:h-[65vh] md:h-[calc(85vh-64px)]"
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
                            onClick={() => router.push('/products')}
                            className="relative overflow-hidden cursor-pointer w-full h-full group"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero1.png"
                                alt="Luxury Hampers & Decor"
                                fetchPriority="high"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-500" />
                        </div>

                        <div
                            onClick={() => router.push('/products')}
                            className="relative overflow-hidden cursor-pointer w-full h-full group"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero2.png"
                                alt="Festive Celebrations"
                                fetchPriority="high"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-500" />
                        </div>
                    </div>
                </section>
                <div className="relative z-10 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                    <section
                        className="relative w-full overflow-hidden h-[50vh] sm:h-[65vh] md:h-screen"
                    >
                        <SafeVideo
                            videoRef={video1Ref}
                            src="/hero-assets/slower.mp4"
                            autoPlay
                            loop
                            muted
                            playbackRate={0.2}
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
                    <section className="w-full bg-[#f4f1ea]">
                        <div className="w-full flex items-center justify-center py-5 sm:py-8 border-b border-black/8 px-4 text-center">
                            <h2
                                className="text-base sm:text-lg md:text-[20px] font-light tracking-[0.14em] text-[#1c1c1c] uppercase"
                                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
                            >
                                Shop by category
                            </h2>
                        </div>
                        <div
                            className="w-full grid grid-cols-2 lg:grid-cols-4"
                            style={{ gap: '3px', background: '#e8e3da' }}
                        >
                            <div
                                onClick={() => router.push('/products?category=Hampers')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#d4cec5]"
                            >
                                <ImageWithSkeleton
                                    src="/category/hamper.png"
                                    alt="Hampers"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 "
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
                            <div
                                onClick={() => router.push('/products?category=Rakhis')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#c9c3b8]"
                            >
                                <ImageWithSkeleton
                                    src="/category/rakhi.png"
                                    alt="Rakhis"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 "
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
                            <div
                                onClick={() => router.push('/products?category=Customize Chocolates')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#bdb7ac]"
                            >
                                <ImageWithSkeleton
                                    src="/category/choco.png"
                                    alt="Customizable Chocolates"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 "
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
                            <div
                                onClick={() => router.push('/products?category=Bouquets')}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[620px] overflow-hidden cursor-pointer group bg-[#b0aaa0]"
                            >
                                <ImageWithSkeleton
                                    src="/category/bouque.png"
                                    alt="Bouquets"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 "
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
                        <div
                            onClick={() => router.push('/products')}
                            className="md:hidden relative w-full h-[240px] xs:h-[280px] sm:h-[360px] overflow-hidden cursor-pointer group bg-[#d4cec5] border-t border-[#b6ac9f]/30"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero3.jpeg"
                                alt="Signature Collection"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
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
                <section
                    ref={secondSectionRef}
                    className="block relative md:sticky top-0 w-full overflow-hidden z-10 h-[50vh] sm:h-[65vh] md:h-screen"
                >
                    <div
                        className="absolute inset-0 bg-[#bfb9ae] will-change-transform"
                        style={{
                            transform: parallaxY2 ? `translate3d(0, ${parallaxY2}px, 0)` : 'none',
                            transition: parallaxY2 ? 'transform 0.1s ease-out' : 'none',
                        }}
                    >
                        <SafeVideo
                            videoRef={secondVideoRef}
                            src="/hero-assets/video.mp4"
                            autoPlay
                            loop
                            muted
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
                <div className="relative z-20 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                    <section
                        className="w-full flex flex-col md:flex-row"
                        style={{ gap: '3px' }}
                    >
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
                        <div
                            onClick={() => router.push('/products')}
                            className="flex-1 relative h-[220px] xs:h-[260px] sm:h-[340px] md:h-[450px] overflow-hidden cursor-pointer group bg-[#d4cec5]"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero3.jpeg"
                                alt="Signature Collection"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                                <span className="text-[10px] sm:text-xs font-light text-white uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    Signature Hampers
                                </span>
                            </div>
                        </div>
                        <div
                            onClick={() => router.push('/products')}
                            className="flex-1 relative h-[220px] xs:h-[260px] sm:h-[340px] md:h-[450px] overflow-hidden cursor-pointer group bg-[#c9c3b8]"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero4.jpeg"
                                alt="Artisanal Decor"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
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
