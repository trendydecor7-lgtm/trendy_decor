'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SEO from '@/components/common/SEO'

const loadedMediaCache = new Set<string>()

const ImageWithSkeleton: React.FC<{
    src: string
    alt: string
    className?: string
    fetchPriority?: 'high' | 'low' | 'auto'
    sizes?: string
    quality?: number
    unoptimized?: boolean
}> = ({ src, alt, className = '', fetchPriority, sizes = '100vw', quality = 100, unoptimized = true }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(() => loadedMediaCache.has(src))

    useEffect(() => {
        if (loadedMediaCache.has(src)) {
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
            <Image
                src={src}
                alt={alt}
                fill
                priority={fetchPriority === 'high'}
                quality={quality}
                sizes={sizes}
                unoptimized={unoptimized}
                onLoad={handleLoad}
                className={`${className} ${isLoaded || fetchPriority === 'high' ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-300`}
            />
        </div>
    )
}

export default function Home() {
    const router = useRouter()

    return (
        <main className="w-full select-none bg-[#e8e3da]" style={{ fontFamily: "'Playpen Sans', sans-serif" }}>
            <SEO
                title="Trendy Decor | Event Decor, Gift Hampers & Customized Chocolates | Gidderbaha"
                description="Explore Trendy Decor Gidderbaha by Harish Ahuja & Hitin Ahuja. Premier event decoration, customized gift hampers, artisanal chocolates, bouquets, designer rakhis across Gidderbaha, Bathinda & Malout."
                keywords="trendy decor, trendy decors, trendydecor, trendy decor store, trendy decor gidderbaha, trendy decors gidderbaha, trendydecor24.shop, trendydecors.shop, trendydecor.store, gidderbaha, gift hampers, customized chocolates, bouquets, designer rakhis, event decor, harish ahuja, hitin ahuja"
            />
            <div className="flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
                {/* ══════════ FIRST SECTION (FULL SCREEN HERO BANNER) ══════════ */}
                <section className="relative w-full flex bg-[#e8e3da] z-0 overflow-hidden h-[540px] xs:h-[600px] sm:h-[680px] md:h-[calc(100vh-40px)]">
                    <div className="relative overflow-hidden cursor-pointer w-full h-full">
                        {/* Mobile Full Screen Hero Banner (mb-hero.png) */}
                        <Link
                            href="/products"
                            prefetch={true}
                            className="md:hidden relative overflow-hidden cursor-pointer w-full h-full block"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/mb-hero.png"
                                alt="Trendy Decor Mobile Hero Banner"
                                fetchPriority="high"
                                className="absolute inset-0 w-full h-full object-cover object-[25%_center]"
                            />
                        </Link>

                        {/* Desktop Full Screen Hero Banner (hero.png) */}
                        <Link
                            href="/products"
                            prefetch={true}
                            className="hidden md:block relative overflow-hidden cursor-pointer w-full h-full"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero.png"
                                alt="Trendy Decor Desktop Hero Banner"
                                fetchPriority="high"
                                className="absolute inset-0 w-full h-full object-cover object-center"
                            />
                        </Link>
                    </div>
                </section>

                <div className="relative z-10 flex flex-col bg-[#e8e3da]" style={{ gap: '3px' }}>
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
                            <Link
                                href="/products?category=Hampers"
                                prefetch={true}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[680px] overflow-hidden cursor-pointer group bg-[#d4cec5] block"
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
                            </Link>
                            <Link
                                href="/products?category=Rakhis"
                                prefetch={true}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[680px] overflow-hidden cursor-pointer group bg-[#c9c3b8] block"
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
                            </Link>
                            <Link
                                href="/products?category=Customized"
                                prefetch={true}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[680px] overflow-hidden cursor-pointer group bg-[#bdb7ac] block"
                            >
                                <ImageWithSkeleton
                                    src="/category/choco.png"
                                    alt="Customizable Chocolates"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 "
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 space-y-0.5 sm:space-y-1">
                                    <p className="text-sm sm:text-lg md:text-xl font-normal text-white tracking-wide drop-shadow-md leading-tight">
                                        Customizations
                                    </p>
                                    <p className="text-[9px] sm:text-[11px] font-light text-white/80 tracking-wider uppercase flex items-center gap-1">
                                        Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                    </p>
                                </div>
                            </Link>
                            <Link
                                href="/products?category=Bouquets"
                                prefetch={true}
                                className="relative w-full h-[220px] xs:h-[270px] sm:h-[350px] md:h-[480px] lg:h-[680px] overflow-hidden cursor-pointer group bg-[#b0aaa0] block"
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
                            </Link>
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
                        <Link
                            href="/products"
                            prefetch={true}
                            className="md:hidden relative w-full h-[240px] xs:h-[280px] sm:h-[360px] overflow-hidden cursor-pointer group bg-[#d4cec5] border-t border-[#b6ac9f]/30 block"
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
                        </Link>
                    </section>
                </div>

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
                        <Link
                            href="/products"
                            prefetch={true}
                            className="flex-1 relative h-[220px] xs:h-[260px] sm:h-[340px] md:h-[450px] overflow-hidden cursor-pointer group bg-[#d4cec5] block"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero3.jpeg"
                                alt="Signature Collection"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                            </div>
                        </Link>
                        <Link
                            href="/products"
                            prefetch={true}
                            className="flex-1 relative h-[220px] xs:h-[260px] sm:h-[340px] md:h-[450px] overflow-hidden cursor-pointer group bg-[#c9c3b8] block"
                        >
                            <ImageWithSkeleton
                                src="/hero-assets/hero4.jpeg"
                                alt="Artisanal Decor"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out "
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                            </div>
                        </Link>
                    </section>
                </div>
            </div>
        </main>
    )
}
