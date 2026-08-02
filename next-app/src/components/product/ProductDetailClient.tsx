'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SafeVideo from '@/components/common/SafeVideo'
import {
    ShoppingBag,
    Share2,
    Check,
    ChevronRight,
    Truck,
    Plus,
    Minus,
    Maximize2,
    X,
    Film,
    Image as ImageIcon,
    ArrowLeft,
    Sparkles,
    Flame,
} from 'lucide-react'
import { useCart, type ProductItem } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

const loadedMediaCache = new Set<string>()

const ImageWithSkeleton: React.FC<{
    src: string
    alt: string
    className?: string
    onClick?: () => void
}> = ({ src, alt, className = '', onClick }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(() => loadedMediaCache.has(src))

    const handleLoad = () => {
        loadedMediaCache.add(src)
        setIsLoaded(true)
    }

    return (
        <div className="relative w-full h-full overflow-hidden" onClick={onClick}>
            {!isLoaded && <div className="absolute inset-0 skeleton-shimmer z-10" />}
            <img
                src={src}
                alt={alt}
                decoding="async"
                onLoad={handleLoad}
                className={`${className} ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
            />
        </div>
    )
}

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

    const primaryMedia =
        product.image || product.video || (product.images && product.images[0]) || ''
    const isVid = (product.mediaType === 'video' || Boolean(product.video)) && !product.image

    const [activeMediaUrl, setActiveMediaUrl] = useState<string>(primaryMedia)
    const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>(
        isVid ? 'video' : 'image'
    )
    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
    const [activeAccordion, setActiveAccordion] = useState<string>('details')

    const productId = (product._id || product.id || '').toString()
    const cartItem = cartItems.find((item) => {
        const itemProdId = (item.product._id || item.product.id || '').toString()
        return itemProdId === productId
    })
    const quantityInCart = cartItem ? cartItem.quantity : 0

    const galleryItems: Array<{ url: string; type: 'image' | 'video'; label?: string }> = []
    if (product.image) {
        galleryItems.push({ url: product.image, type: 'image', label: 'Main Showcase' })
    }
    if (product.images && product.images.length > 0) {
        product.images.forEach((imgUrl, idx) => {
            if (imgUrl !== product.image) {
                galleryItems.push({ url: imgUrl, type: 'image', label: `Angle #${idx + 1}` })
            }
        })
    }
    if (product.video) {
        galleryItems.push({ url: product.video, type: 'video', label: 'Video Showcase' })
    }
    if (galleryItems.length === 0 && product.thumbnail) {
        galleryItems.push({ url: product.thumbnail, type: 'image', label: 'Thumbnail' })
    }

    const handleAddToCart = () => {
        const cartItemData: ProductItem = {
            id: product._id || product.id || '',
            _id: product._id || product.id || '',
            name: product.name,
            category: product.category as ProductItem['category'],
            price: product.price,
            bgColor: product.bgColor || '#cec9be',
            image: product.image || (product.images && product.images[0]) || '',
            video: product.video || '',
            mediaType: product.mediaType || 'image',
            stock: product.stock ?? 50,
            description: product.description || '',
        }
        addToCart(cartItemData, 1)
        toast.success(`Added "${product.name}" to your shopping bag`)
    }

    const handleBuyNow = () => {
        handleAddToCart()
        router.push('/cart')
    }

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Product link copied to clipboard!')
        } else {
            toast.info('Copy URL: ' + window.location.href)
        }
    }

    return (
        <main
            className="w-full bg-[#e8e3da] text-[#1c1c1c] min-h-screen select-none animate-smooth-appear"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            {/* Mobile Layout */}
            <div className="md:hidden w-full max-w-full overflow-x-hidden bg-[#f4f1ea] min-h-screen pb-24">
                <div className="w-full bg-[#f4f1ea]/95 backdrop-blur-md border-b border-[#b6ac9f]/30 px-3.5 py-2.5 shadow-xs flex items-center justify-between gap-2.5">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-[#e8e3da] border border-[#b6ac9f]/40 text-[#1c1c1c] rounded-xl active:bg-[#b6ac9f]/30 transition-colors cursor-pointer shrink-0"
                        aria-label="Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <span className="text-[13px] font-semibold uppercase tracking-wider text-[#1c1c1c] truncate px-1">
                        {product.name}
                    </span>

                    <button
                        onClick={handleShare}
                        className="w-10 h-10 flex items-center justify-center bg-[#e8e3da] border border-[#b6ac9f]/40 text-[#1c1c1c] rounded-xl active:bg-[#b6ac9f]/30 transition-colors cursor-pointer shrink-0"
                        aria-label="Share Product"
                    >
                        <Share2 size={17} />
                    </button>
                </div>

                <div
                    className="relative w-full aspect-[9/16] max-h-[70vh] mx-auto bg-[#f8f6f0] rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-[#b6ac9f]/30"
                    style={{ backgroundColor: product.bgColor || '#f8f6f0' }}
                >
                    {activeMediaType === 'video' ? (
                        <SafeVideo
                            src={activeMediaUrl}
                            controls
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-contain object-center"
                        />
                    ) : activeMediaUrl ? (
                        <ImageWithSkeleton
                            src={activeMediaUrl}
                            alt={product.name}
                            className="w-full h-full object-contain object-center cursor-pointer"
                            onClick={() => setLightboxOpen(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/40 font-light text-xs gap-2">
                            <ImageIcon size={24} />
                            <span>No Media Preview Available</span>
                        </div>
                    )}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                        {product.isNewProduct && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-[#1c1c1c] px-2.5 py-1 rounded-md shadow-sm">
                                NEW
                            </span>
                        )}
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#1c1c1c] bg-[#f4f1ea]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#b6ac9f]/30 shadow-sm">
                            {product.category}
                        </span>
                    </div>
                </div>

                <div className="px-4 sm:px-5 pt-5 pb-6 space-y-0 text-[#1c1c1c] w-full max-w-full overflow-hidden">
                    <div className="pb-5 space-y-3 w-full max-w-full">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">
                                {product.category}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                    product.inStock !== false && product.stock > 0
                                        ? 'bg-[#e8e3da] text-[#1c1c1c] border-[#b6ac9f]/60'
                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}
                            >
                                <Check size={10} strokeWidth={3} />
                                {product.inStock !== false && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <h1 className="text-[22px] font-normal leading-snug tracking-tight text-[#1c1c1c] break-words">
                            {product.name}
                        </h1>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[26px] font-bold font-mono text-[#1c1c1c] tracking-tight">
                                {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                            </span>
                            <span className="text-[10px] font-light text-[#1c1c1c]/45 uppercase tracking-wider">
                                incl. all taxes
                            </span>
                        </div>
                    </div>

                    <div className="mb-5 space-y-2 w-full max-w-full overflow-hidden">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">About This Product</h3>
                        <p className="text-[13px] font-light text-[#1c1c1c]/80 leading-[1.7] whitespace-pre-line break-words w-full max-w-full">
                            {product.description ||
                                'Handcrafted with supreme care and perfection. Designed to bring elegance, luxury, and warmth to every moment.'}
                        </p>
                    </div>

                    {relatedProducts.length > 0 && (
                        <div className="pt-2 space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">
                                You May Also Like
                            </h3>
                            <div className="grid grid-cols-2 gap-2.5">
                                {relatedProducts.map((rel) => {
                                    const relId = rel._id || rel.id || ''
                                    return (
                                        <Link
                                            key={relId}
                                            href={`/product/${relId}`}
                                            prefetch={true}
                                            className="rounded-2xl overflow-hidden cursor-pointer border border-[#b6ac9f]/25 bg-[#f4f1ea] active:scale-[0.97] transition-transform shadow-sm block"
                                        >
                                            <div className="relative w-full aspect-[4/5] bg-[#cec9be] overflow-hidden">
                                                {rel.image ? (
                                                    <ImageWithSkeleton
                                                        src={rel.image}
                                                        alt={rel.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#1c1c1c]/30 text-xs">
                                                        No Preview
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2.5 space-y-0.5">
                                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#1c1c1c]/40">
                                                    {rel.category}
                                                </p>
                                                <h4 className="text-[11px] font-normal text-[#1c1c1c] line-clamp-2 leading-snug">
                                                    {rel.name}
                                                </h4>
                                                <p className="text-[13px] font-bold text-[#1c1c1c] font-mono pt-0.5">
                                                    {rel.price}
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div
                    style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}
                    className="bg-[#f4f1ea]/95 backdrop-blur-md border-t border-[#b6ac9f]/30 px-4 py-2.5 shadow-lg flex items-center gap-2.5 md:hidden"
                >
                    {quantityInCart > 0 ? (
                        <div className="flex-1 flex items-center justify-between bg-[#1c1c1c] text-[#f4f1ea] px-3.5 py-2.5 rounded-xl">
                            <button
                                type="button"
                                onClick={() => updateQuantity(productId, quantityInCart - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 active:bg-white/25 cursor-pointer transition-colors"
                            >
                                <Minus size={13} />
                            </button>
                            <span className="text-[12px] font-semibold font-mono tracking-wider">
                                {quantityInCart} in Bag
                            </span>
                            <button
                                type="button"
                                onClick={() => updateQuantity(productId, quantityInCart + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 active:bg-white/25 cursor-pointer transition-colors"
                            >
                                <Plus size={13} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.inStock === false || product.stock <= 0}
                            className="flex-1 py-3 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-semibold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer shadow-sm"
                        >
                            <ShoppingBag size={15} /> Add To Bag
                        </button>
                    )}
                    <button
                        onClick={handleBuyNow}
                        disabled={product.inStock === false || product.stock <= 0}
                        className="flex-1 py-3 bg-[#e8e3da] border border-[#1c1c1c] text-[#1c1c1c] text-[12px] font-semibold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:bg-[#1c1c1c] active:text-[#f4f1ea] transition-all disabled:opacity-40 cursor-pointer"
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                <div className="w-full border-b border-[#b6ac9f]/30 bg-[#f4f1ea]/60 backdrop-blur-sm">
                    <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-4 flex items-center justify-between text-[12px] uppercase tracking-wider text-[#1c1c1c]/60 overflow-x-auto">
                        <div className="flex items-center gap-2.5 whitespace-nowrap">
                            <button
                                onClick={() => router.back()}
                                className="w-8 h-8 flex items-center justify-center bg-[#e8e3da] border border-[#b6ac9f]/40 text-[#1c1c1c] rounded-lg hover:bg-[#b6ac9f]/30 transition-colors cursor-pointer shrink-0 mr-1 shadow-2xs"
                                title="Go Back"
                                aria-label="Back"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <Link href="/" prefetch={true} className="hover:text-[#1c1c1c] transition-colors">
                                Home
                            </Link>
                            <ChevronRight size={12} />
                            <Link href="/products" prefetch={true} className="hover:text-[#1c1c1c] transition-colors">
                                Products
                            </Link>
                            <ChevronRight size={12} />
                            <span className="text-[#1c1c1c]/50">{product.category}</span>
                            <ChevronRight size={12} />
                            <span className="text-[#1c1c1c] font-medium truncate max-w-[200px]">
                                {product.name}
                            </span>
                        </div>

                        <Link
                            href="/products"
                            prefetch={true}
                            className="inline-flex items-center gap-2 text-[#1c1c1c] font-medium hover:opacity-75 transition-opacity ml-4 whitespace-nowrap"
                        >
                            <ArrowLeft size={14} /> Back to Catalog
                        </Link>
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                        <div className="lg:col-span-7 space-y-4 min-w-0">
                            <div
                                className="relative w-full aspect-[9/16] max-h-[78vh] mx-auto bg-[#f8f6f0] border border-[#b6ac9f]/30 rounded-2xl overflow-hidden shadow-sm group flex items-center justify-center p-3"
                                style={{ backgroundColor: product.bgColor || '#f8f6f0' }}
                            >
                                {activeMediaType === 'video' ? (
                                    <SafeVideo
                                        src={activeMediaUrl}
                                        controls
                                        autoPlay
                                        loop
                                        muted
                                        className="w-full h-full object-contain object-center"
                                    />
                                ) : activeMediaUrl ? (
                                    <ImageWithSkeleton
                                        src={activeMediaUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain object-center transition-transform duration-700 ease-in-out cursor-zoom-in"
                                        onClick={() => setLightboxOpen(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/40 font-light text-[13px] gap-2">
                                        <ImageIcon size={28} />
                                        <span>No Media Preview Available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-5 space-y-6 bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden">
                            <div className="space-y-3 pb-5 border-b border-[#b6ac9f]/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c1c]/50">
                                        Artisanal Luxury
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider border ${
                                            product.inStock !== false && product.stock > 0
                                                ? 'bg-[#e8e3da] text-[#1c1c1c] border-[#b6ac9f]/60'
                                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                                        }`}
                                    >
                                        <Check size={12} />
                                        {product.inStock !== false && product.stock > 0
                                            ? `In Stock`
                                            : 'Out of Stock'}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-4 pt-1">
                                    <h1 className="text-2xl md:text-3xl font-normal text-[#1c1c1c] tracking-tight leading-tight truncate">
                                        {product.name}
                                    </h1>
                                    <div className="text-[#1c1c1c] text-right shrink-0">
                                        <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight">
                                            {product.price.startsWith('₹')
                                                ? product.price
                                                : `₹${product.price}`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                {quantityInCart > 0 ? (
                                    <div className="flex items-center justify-between bg-[#1c1c1c] text-[#f4f1ea] px-5 py-3.5 rounded-xl shadow-md">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(productId, quantityInCart - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 cursor-pointer transition-colors"
                                        >
                                            <Minus size={15} />
                                        </button>
                                        <span className="text-[14px] font-semibold font-mono tracking-wider">
                                            {quantityInCart} in Shopping Bag
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(productId, quantityInCart + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 cursor-pointer transition-colors"
                                        >
                                            <Plus size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.inStock === false || product.stock <= 0}
                                        className="w-full py-4 bg-[#1c1c1c] text-[#f4f1ea] text-[13px] font-semibold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2.5 hover:bg-black active:scale-[0.99] transition-all disabled:opacity-40 cursor-pointer shadow-md"
                                    >
                                        <ShoppingBag size={18} /> Add To Shopping Bag
                                    </button>
                                )}
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.inStock === false || product.stock <= 0}
                                    className="w-full py-4 bg-[#e8e3da] border border-[#1c1c1c] text-[#1c1c1c] text-[13px] font-semibold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2.5 hover:bg-[#1c1c1c] hover:text-[#f4f1ea] active:scale-[0.99] transition-all disabled:opacity-40 cursor-pointer"
                                >
                                    Instant Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && activeMediaType === 'image' && activeMediaUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 select-none animate-fadeIn"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={activeMediaUrl}
                        alt={product.name}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    )
}
