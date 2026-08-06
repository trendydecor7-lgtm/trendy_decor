'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SafeVideo from '@/components/common/SafeVideo'
import FormattedProductDescription from '@/components/product/FormattedProductDescription'
import {
    ShoppingBag,
    Share2,
    Check,
    ChevronRight,
    Truck,
    Plus,
    Minus,
    X,
    Image as ImageIcon,
    ArrowLeft,
    Gift,
    ShieldCheck,
} from 'lucide-react'
import { useCart, type ProductItem } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

/* ─────────────────────── Image-with-Skeleton ─────────────────────── */
const loadedMediaCache = new Set<string>()

const ImageWithSkeleton: React.FC<{
    src: string
    alt: string
    className?: string
    onClick?: () => void
}> = ({ src, alt, className = '', onClick }) => {
    const [isLoaded, setIsLoaded] = useState(() => loadedMediaCache.has(src))
    const imgRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        if (loadedMediaCache.has(src)) { setIsLoaded(true); return }
        if (imgRef.current?.complete) { loadedMediaCache.add(src); setIsLoaded(true) }
    }, [src])

    return (
        <div className="relative w-full h-full overflow-hidden" onClick={onClick}>
            {!isLoaded && <div className="absolute inset-0 z-10 skeleton-shimmer" />}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                decoding="async"
                onLoad={() => { loadedMediaCache.add(src); setIsLoaded(true) }}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            />
        </div>
    )
}

/* ─────────────────────── Types ─────────────────────── */
export interface ProductDetailData {
    _id: string
    id?: string
    name: string
    category: string
    price: string
    stock: number
    inStock: boolean
    thumbnail?: string
    bgColor?: string
    image?: string
    images?: string[]
    video?: string
    mediaType?: 'image' | 'video'
    isNewProduct?: boolean
    description?: string
    createdAt?: string
}

/* ─────────────────────── Component ─────────────────────── */
export default function ProductDetailClient({
    product,
    relatedProducts = [],
}: {
    product: ProductDetailData
    relatedProducts?: ProductDetailData[]
}) {
    const router = useRouter()
    const { cartItems, addToCart, updateQuantity } = useCart()
    const { toast } = useToast()

    const primaryMedia = product.image || (product.images?.[0]) || product.video || ''
    const isVid = (product.mediaType === 'video' || Boolean(product.video)) && !product.image && !(product.images?.length)

    const [activeMediaUrl, setActiveMediaUrl] = useState(primaryMedia)
    const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>(isVid ? 'video' : 'image')
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [openAccordion, setOpenAccordion] = useState<string>('details')

    const productId = (product._id || product.id || '').toString()
    const cartItem = cartItems.find(
        (item) => (item.product._id || item.product.id || '').toString() === productId
    )
    const quantityInCart = cartItem ? cartItem.quantity : 0
    const inStock = product.inStock !== false && product.stock > 0

    const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
    const freeShippingLeft = 0 // Rakhi Offer: Free shipping on all orders

    /* Gallery */
    const galleryItems: { url: string; type: 'image' | 'video' }[] = []
    if (product.image) galleryItems.push({ url: product.image, type: 'image' })
    product.images?.forEach((u) => { if (u !== product.image) galleryItems.push({ url: u, type: 'image' }) })
    if (product.video) galleryItems.push({ url: product.video, type: 'video' })
    if (galleryItems.length === 0 && product.thumbnail) galleryItems.push({ url: product.thumbnail, type: 'image' })

    /* Cart */
    const handleAddToCart = () => {
        addToCart({
            id: product._id || product.id || '',
            _id: product._id || product.id || '',
            name: product.name,
            category: product.category as ProductItem['category'],
            price: product.price,
            bgColor: product.bgColor || '#cec9be',
            image: product.image || (product.images?.[0]) || '',
            video: product.video || '',
            mediaType: product.mediaType || 'image',
            stock: product.stock ?? 50,
            description: product.description || '',
        }, 1)
        toast.success(`Added "${product.name}" to your bag`)
    }

    const handleBuyNow = () => { handleAddToCart(); router.push('/cart') }

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied!')
        }
    }

    const accordions = [
        {
            id: 'details',
            title: 'Product Details & Care',
            body: ['Premium handcrafted products crafted with care.', 'Designed to make your festivals and special occasions memorable.', 'Made with love by skilled local artisans.'],
        },
        {
            id: 'shipping',
            title: 'Shipping & Pan-India Delivery (Rakhi Special)',
            body: ['Orders dispatched within 6-7 days.', 'FREE shipping on ALL orders above ₹1000 — Rakhi Special Offer (₹0 Shipping Fee)!', 'Delivery across India via our trusted courier partners.'],
        },
    ]

    return (
        <div
            className="w-full bg-[#e8e3da] text-[#1c1c1c] min-h-screen"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >

            {/* ══════════ MOBILE ══════════ */}
            <div className="md:hidden w-full min-h-screen bg-[#e8e3da] pb-28 overflow-x-hidden">

                {/* Sticky topbar */}
                <div className="sticky top-0 z-30 w-full bg-[#e8e3da]/95 backdrop-blur-md border-b border-[#b6ac9f]/20 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#b6ac9f]/40 bg-[#f4f1ea] cursor-pointer"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-[12px] font-semibold uppercase tracking-widest text-[#1c1c1c] truncate px-2 flex-1 text-center">
                        {product.category}
                    </span>
                    <button
                        onClick={handleShare}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#b6ac9f]/40 bg-[#f4f1ea] cursor-pointer"
                        aria-label="Share"
                    >
                        <Share2 size={15} />
                    </button>
                </div>

                {/* Hero image */}
                <div
                    className="relative w-full overflow-hidden"
                    style={{ backgroundColor: product.bgColor || '#f4f1ea', aspectRatio: '4/5', maxHeight: '62vh' }}
                >
                    {activeMediaType === 'video' ? (
                        <SafeVideo src={activeMediaUrl} controls autoPlay loop muted className="w-full h-full object-contain" />
                    ) : activeMediaUrl ? (
                        <ImageWithSkeleton
                            src={activeMediaUrl}
                            alt={product.name}
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={() => setLightboxOpen(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/30 gap-2">
                            <ImageIcon size={28} />
                            <span className="text-xs">No image</span>
                        </div>
                    )}
                    {product.isNewProduct && (
                        <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider text-white bg-[#1c1c1c] px-2.5 py-1 z-10">
                            NEW
                        </span>
                    )}
                </div>

                {/* Thumbnail strip */}
                {galleryItems.length > 1 && (
                    <div className="flex gap-2 px-4 pt-3 overflow-x-auto no-scrollbar">
                        {galleryItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setActiveMediaUrl(item.url); setActiveMediaType(item.type) }}
                                className={`shrink-0 w-12 h-14 overflow-hidden border-2 transition-all cursor-pointer ${activeMediaUrl === item.url ? 'border-[#1c1c1c]' : 'border-[#b6ac9f]/30 opacity-55'}`}
                                style={{ backgroundColor: product.bgColor || '#f4f1ea' }}
                            >
                                {item.type === 'video'
                                    ? <div className="w-full h-full flex items-center justify-center text-[7px] font-bold uppercase bg-[#e8e3da] text-[#1c1c1c]/50">Vid</div>
                                    : <img src={item.url} alt="" className="w-full h-full object-cover" />}
                            </button>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="px-4 pt-5 pb-4 space-y-5">

                    {/* Name + price */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/40">
                                {product.category}
                            </p>
                            <h1 className="text-[22px] font-normal leading-snug tracking-tight text-[#1c1c1c]">
                                {product.name}
                            </h1>
                        </div>
                        <div className="text-right shrink-0 pt-4">
                            <div className="text-[24px] font-bold font-mono tracking-tight">
                                {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                            </div>
                            <div className="text-[9px] font-light text-[#1c1c1c]/40 uppercase tracking-wider">incl. taxes</div>
                        </div>
                    </div>

                    {/* Stock + shipping */}
                    <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border ${inStock ? 'bg-[#f4f1ea] text-[#1c1c1c] border-[#b6ac9f]/60' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                            <Check size={9} strokeWidth={3} />
                            {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="space-y-1.5 border-t border-[#b6ac9f]/20 pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1c1c]/40">Description</p>
                            <FormattedProductDescription description={product.description} />
                        </div>
                    )}

                    {/* Accordions */}
                    <div className="space-y-0 border-t border-[#b6ac9f]/20">
                        {accordions.map(({ id, title, body }) => (
                            <div key={id} className="border-b border-[#b6ac9f]/20">
                                <button
                                    onClick={() => setOpenAccordion(openAccordion === id ? '' : id)}
                                    className="w-full flex items-center justify-between py-3.5 cursor-pointer"
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1c1c1c]">{title}</span>
                                    <span className="text-[#1c1c1c]/40">{openAccordion === id ? <X size={13} /> : <Plus size={13} />}</span>
                                </button>
                                {openAccordion === id && (
                                    <div className="pb-4 space-y-1.5">
                                        {body.map((line, i) => (
                                            <p key={i} className="text-[12px] font-light text-[#1c1c1c]/65 flex items-start gap-1.5">
                                                <span className="text-[#1c1c1c]/30 mt-0.5">•</span>{line}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Related */}
                    {relatedProducts.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/40">You May Also Like</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {relatedProducts.slice(0, 4).map((rel) => {
                                    const relId = rel._id || rel.id || ''
                                    return (
                                        <Link key={relId} href={`/product/${relId}`} prefetch={true} className="block active:scale-[0.97] transition-transform">
                                            <div className="w-full aspect-[4/5] overflow-hidden" style={{ backgroundColor: rel.bgColor || '#cec9be' }}>
                                                {rel.image
                                                    ? <img src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-[#1c1c1c]/30 text-xs">No image</div>}
                                            </div>
                                            <div className="pt-2 space-y-0.5">
                                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#1c1c1c]/40">{rel.category}</p>
                                                <p className="text-[12px] font-normal text-[#1c1c1c] line-clamp-2 leading-snug">{rel.name}</p>
                                                <p className="text-[13px] font-bold font-mono">{rel.price.startsWith('₹') ? rel.price : `₹${rel.price}`}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile sticky CTA */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#e8e3da]/95 backdrop-blur-md border-t border-[#b6ac9f]/20 px-4 py-3 flex items-center gap-2.5">
                    {quantityInCart > 0 ? (
                        <div className="flex-1 flex items-center justify-between bg-[#1c1c1c] text-[#f4f1ea] px-4 py-3">
                            <button type="button" onClick={() => updateQuantity(productId, quantityInCart - 1)} className="w-7 h-7 flex items-center justify-center bg-white/10 active:bg-white/25 cursor-pointer"><Minus size={13} /></button>
                            <span className="text-[12px] font-semibold font-mono">{quantityInCart} in Bag</span>
                            <button type="button" onClick={() => updateQuantity(productId, quantityInCart + 1)} className="w-7 h-7 flex items-center justify-center bg-white/10 active:bg-white/25 cursor-pointer"><Plus size={13} /></button>
                        </div>
                    ) : (
                        <button onClick={handleAddToCart} disabled={!inStock} className="flex-1 py-3.5 bg-[#1c1c1c] text-[#f4f1ea] text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer">
                            <ShoppingBag size={14} /> Add To Bag
                        </button>
                    )}
                    <button onClick={handleBuyNow} disabled={!inStock} className="flex-1 py-3.5 border border-[#1c1c1c] text-[#1c1c1c] text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:bg-[#1c1c1c] active:text-[#f4f1ea] transition-colors disabled:opacity-40 cursor-pointer">
                        Buy Now
                    </button>
                </div>
            </div>

            {/* ══════════ DESKTOP ══════════ */}
            <div className="hidden md:block">

                {/* Breadcrumb */}
                <div className="w-full border-b border-[#b6ac9f]/20 bg-[#e8e3da]">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-16 py-3.5 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#1c1c1c]/50">
                        <div className="flex items-center gap-2">
                            <button onClick={() => router.back()} className="w-7 h-7 flex items-center justify-center border border-[#b6ac9f]/40 text-[#1c1c1c] hover:bg-[#b6ac9f]/20 cursor-pointer mr-1" aria-label="Back">
                                <ArrowLeft size={13} />
                            </button>
                            <Link href="/" prefetch={true} className="hover:text-[#1c1c1c] transition-colors">Home</Link>
                            <ChevronRight size={10} />
                            <Link href="/products" prefetch={true} className="hover:text-[#1c1c1c] transition-colors">Products</Link>
                            <ChevronRight size={10} />
                            <span className="text-[#1c1c1c]/35">{product.category}</span>
                            <ChevronRight size={10} />
                            <span className="text-[#1c1c1c]/70 font-medium truncate max-w-[200px]">{product.name}</span>
                        </div>
                        <Link href="/products" prefetch={true} className="inline-flex items-center gap-1.5 hover:text-[#1c1c1c] transition-colors">
                            <ArrowLeft size={12} /> Back to Catalog
                        </Link>
                    </div>
                </div>

                {/* Product area */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-16 py-8 md:py-10 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20 items-start">

                        {/* Left: Media */}
                        <div className="space-y-3 md:sticky md:top-24 lg:top-6">
                            <div
                                className="relative w-full overflow-hidden"
                                style={{ backgroundColor: product.bgColor || '#f4f1ea', aspectRatio: '4/5', maxHeight: '68vh' }}
                            >
                                {activeMediaType === 'video' ? (
                                    <SafeVideo src={activeMediaUrl} controls autoPlay loop muted className="w-full h-full object-contain" />
                                ) : activeMediaUrl ? (
                                    <ImageWithSkeleton src={activeMediaUrl} alt={product.name} className="w-full h-full object-contain cursor-zoom-in" onClick={() => setLightboxOpen(true)} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/25 gap-2">
                                        <ImageIcon size={36} strokeWidth={1.5} />
                                        <span className="text-sm">No media</span>
                                    </div>
                                )}
                                {product.isNewProduct && (
                                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-white bg-[#1c1c1c] px-3 py-1 z-10">NEW</span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {galleryItems.length > 1 && (
                                <div className="flex gap-2 flex-wrap pt-1">
                                    {galleryItems.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { setActiveMediaUrl(item.url); setActiveMediaType(item.type) }}
                                            className={`w-16 h-20 overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${activeMediaUrl === item.url ? 'border-[#1c1c1c]' : 'border-[#b6ac9f]/30 opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: product.bgColor || '#f4f1ea' }}
                                        >
                                            {item.type === 'video'
                                                ? <div className="w-full h-full flex items-center justify-center text-[8px] font-bold uppercase bg-[#e8e3da] text-[#1c1c1c]/50">Video</div>
                                                : <img src={item.url} alt="" className="w-full h-full object-cover" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info — flat, no card border */}
                        <div className="space-y-8">

                            {/* Category + stock */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">
                                    {product.category}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${inStock ? 'border-[#b6ac9f]/60 text-[#1c1c1c]' : 'border-rose-300 text-rose-800 bg-rose-50'}`}>
                                    <Check size={10} strokeWidth={3} />
                                    {inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Name + price */}
                            <div className="space-y-2">
                                <h1 className="text-3xl lg:text-4xl font-normal text-[#1c1c1c] tracking-tight leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-2.5">
                                    <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-[#1c1c1c]">
                                        {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                                    </span>
                                    <span className="text-[11px] font-light text-[#1c1c1c]/40 uppercase tracking-wider">incl. all taxes</span>
                                </div>
                            </div>



                            {/* Description */}
                            {product.description && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1c1c]/40">Description</p>
                                    <FormattedProductDescription description={product.description} />
                                </div>
                            )}

                            {/* CTA buttons */}
                            <div className="space-y-2.5">
                                {quantityInCart > 0 ? (
                                    <div className="flex items-center justify-between bg-[#1c1c1c] text-[#f4f1ea] px-6 py-4">
                                        <button type="button" onClick={() => updateQuantity(productId, quantityInCart - 1)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 cursor-pointer"><Minus size={15} /></button>
                                        <span className="text-[13px] font-semibold font-mono tracking-wider">{quantityInCart} in Shopping Bag</span>
                                        <button type="button" onClick={() => updateQuantity(productId, quantityInCart + 1)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 cursor-pointer"><Plus size={15} /></button>
                                    </div>
                                ) : (
                                    <button onClick={handleAddToCart} disabled={!inStock} className="w-full py-4 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-black transition-colors disabled:opacity-40 cursor-pointer">
                                        <ShoppingBag size={17} /> Add To Shopping Bag
                                    </button>
                                )}
                                <button onClick={handleBuyNow} disabled={!inStock} className="w-full py-4 border border-[#1c1c1c] text-[#1c1c1c] text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-colors disabled:opacity-40 cursor-pointer">
                                    Buy Now
                                </button>
                                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#1c1c1c]/40 hover:text-[#1c1c1c] transition-colors cursor-pointer py-1">
                                    <Share2 size={12} /> Share Product
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-3 border-t border-[#b6ac9f]/20 pt-6">
                                {[
                                    { icon: <Truck size={17} />, label: 'Express Delivery' },
                                    { icon: <ShieldCheck size={17} />, label: '100% Authentic' },
                                    { icon: <Gift size={17} />, label: 'Gift Wrap Ready' },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-2 py-4 border border-[#b6ac9f]/25 text-center">
                                        <span className="text-[#1c1c1c]/50">{icon}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#1c1c1c]/50">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Accordions */}
                            <div className="border-t border-[#b6ac9f]/20">
                                {accordions.map(({ id, title, body }) => (
                                    <div key={id} className="border-b border-[#b6ac9f]/20">
                                        <button
                                            onClick={() => setOpenAccordion(openAccordion === id ? '' : id)}
                                            className="w-full flex items-center justify-between py-4 cursor-pointer text-left"
                                        >
                                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c1c1c]">{title}</span>
                                            <span className="text-[#1c1c1c]/40 shrink-0">{openAccordion === id ? <X size={14} /> : <Plus size={14} />}</span>
                                        </button>
                                        {openAccordion === id && (
                                            <div className="pb-5 space-y-2">
                                                {body.map((line, i) => (
                                                    <p key={i} className="text-[13px] font-light text-[#1c1c1c]/60 flex items-start gap-2">
                                                        <span className="text-[#1c1c1c]/25 mt-0.5">•</span>{line}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-20 space-y-8 border-t border-[#b6ac9f]/20 pt-14">
                            <h2 className="text-2xl font-normal text-[#1c1c1c] tracking-tight">You May Also Like</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                {relatedProducts.slice(0, 4).map((rel) => {
                                    const relId = rel._id || rel.id || ''
                                    return (
                                        <Link key={relId} href={`/product/${relId}`} prefetch={true} className="block group cursor-pointer">
                                            <div className="w-full overflow-hidden" style={{ backgroundColor: rel.bgColor || '#cec9be', aspectRatio: '4/5' }}>
                                                {rel.image
                                                    ? <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    : <div className="w-full h-full flex items-center justify-center text-[#1c1c1c]/25 text-xs">No Image</div>}
                                            </div>
                                            <div className="pt-3 space-y-0.5">
                                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#1c1c1c]/40">{rel.category}</p>
                                                <p className="text-[13px] font-normal text-[#1c1c1c] line-clamp-2 leading-snug">{rel.name}</p>
                                                <p className="text-[14px] font-bold font-mono">{rel.price.startsWith('₹') ? rel.price : `₹${rel.price}`}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && activeMediaType === 'image' && activeMediaUrl && (
                <div className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
                    <button onClick={() => setLightboxOpen(false)} className="absolute top-5 right-5 text-white/60 hover:text-white p-2 cursor-pointer">
                        <X size={22} />
                    </button>
                    <img src={activeMediaUrl} alt={product.name} className="max-w-full max-h-[92vh] object-contain" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    )
}
