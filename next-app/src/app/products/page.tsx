'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SEO from '@/components/common/SEO'
import SafeVideo from '@/components/common/SafeVideo'
import {
    ShoppingBag,
    Plus,
    Minus,
    X,
    Sparkles,
    Upload,
    Film,
    Image as ImageIcon,
    Loader2,
    SlidersHorizontal,
    Package,
    ChevronUp,
    ChevronDown,
    Check,
} from 'lucide-react'
import { useCart, type ProductItem } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { API_BASE_URL } from '@/config/api'

const CATEGORIES = ['All', 'Hampers', 'Bouquets', 'Rakhis', 'Customize Chocolates']

const loadedMediaCache = new Set<string>()

import {
    validateMediaFile,
    compressMediaFile,
    parseUploadResponse,
    MAX_IMAGE_SIZE_MB,
} from '@/lib/imageCompression'

const ProductMediaWithSkeleton: React.FC<{
    mediaType?: 'image' | 'video'
    image?: string
    video?: string
    alt: string
    className?: string
    bgColor?: string
}> = ({ mediaType, image, video, alt, className = '', bgColor = '#f8f6f0' }) => {
    const isVideo = mediaType === 'video' || Boolean(video)
    const mediaSrc = isVideo ? video || image : image

    const [isLoaded, setIsLoaded] = useState<boolean>(() => {
        if (!mediaSrc) return true
        return loadedMediaCache.has(mediaSrc)
    })
    const [hasError, setHasError] = useState<boolean>(false)
    const imgRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
        if (!mediaSrc) {
            setIsLoaded(true)
            return
        }
        if (loadedMediaCache.has(mediaSrc)) {
            setIsLoaded(true)
            return
        }

        if (imgRef.current && imgRef.current.complete) {
            loadedMediaCache.add(mediaSrc)
            setIsLoaded(true)
        }
    }, [mediaSrc])

    const handleLoad = () => {
        if (mediaSrc) loadedMediaCache.add(mediaSrc)
        setIsLoaded(true)
    }

    return (
        <div
            className="relative w-full h-full overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
        >
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 skeleton-shimmer z-10 pointer-events-none" />
            )}

            {!hasError && mediaSrc ? (
                isVideo ? (
                    <SafeVideo
                        src={mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onLoadedData={handleLoad}
                        onError={() => setHasError(true)}
                        className={className}
                    />
                ) : (
                    <img
                        ref={imgRef}
                        src={mediaSrc}
                        alt={alt}
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onLoad={handleLoad}
                        onError={() => setHasError(true)}
                        className={className}
                    />
                )
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/30 font-light text-[11px] gap-1 p-2 text-center">
                    <ImageIcon size={22} />
                    <span>No Preview</span>
                </div>
            )}
        </div>
    )
}

function ProductsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { cartItems, addToCart, updateQuantity } = useCart()
    const { toast } = useToast()
    const { user, token } = useAuth()

    const [products, setProducts] = useState<ProductItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const initialCategoryParam = searchParams.get('category')
    const [selectedCategory, setSelectedCategory] = useState<string>(
        initialCategoryParam && CATEGORIES.includes(initialCategoryParam)
            ? initialCategoryParam
            : 'All'
    )
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category')
        if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
            setSelectedCategory(categoryFromUrl)
        } else if (!categoryFromUrl) {
            setSelectedCategory('All')
        }
    }, [searchParams])

    const handleSelectCategory = (cat: string) => {
        setSelectedCategory(cat)
        if (cat === 'All') {
            router.push('/products')
        } else {
            router.push(`/products?category=${encodeURIComponent(cat)}`)
        }
    }

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [creating, setCreating] = useState<boolean>(false)

    const [name, setName] = useState('')
    const [category, setCategory] = useState<
        'Hampers' | 'Bouquets' | 'Rakhis' | 'Customize Chocolates'
    >('Hampers')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState(50)
    const [inStock] = useState(true)
    const [bgColor] = useState('#cec9be')
    const [thumbnail, setThumbnail] = useState('')
    const [image, setImage] = useState('')
    const [video, setVideo] = useState('')
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
    const [description, setDescription] = useState('')
    const [isNewProduct, setIsNewProduct] = useState(true)

    const [stagedThumbnailBase64, setStagedThumbnailBase64] = useState<string>('')
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
    const [stagedMediaBase64, setStagedMediaBase64] = useState<string>('')
    const [mediaPreview, setMediaPreview] = useState<string>('')
    const [creationStep, setCreationStep] = useState<string>('')

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/products?_t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                },
            })
            if (res.ok) {
                const data = await res.json()
                if (data.success && Array.isArray(data.products)) {
                    const mapped: ProductItem[] = data.products.map((p: any) => ({
                        id: p._id || p.id,
                        _id: p._id || p.id,
                        name: p.name,
                        category: p.category,
                        price: p.price,
                        bgColor: p.bgColor || '#cec9be',
                        image: p.image || '',
                        video: p.video || '',
                        mediaType: p.mediaType || (p.video ? 'video' : 'image'),
                        isNewProduct: p.isNewProduct ?? p.isNew ?? false,
                        stock: p.stock ?? 50,
                        description: p.description || '',
                    }))
                    setProducts(mapped)
                } else {
                    setProducts([])
                }
            } else {
                setProducts([])
            }
        } catch (err) {
            console.warn('Could not fetch products from server:', err)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
        e.stopPropagation()
        addToCart(product, 1)
        toast.success(`Added ${product.name} to your cart`)
    }

    const resetAndCloseModal = () => {
        if (creating) return
        setIsCreateModalOpen(false)
        setName('')
        setPrice('')
        setThumbnail('')
        setImage('')
        setVideo('')
        setStagedThumbnailBase64('')
        setThumbnailPreview('')
        setStagedMediaBase64('')
        setMediaPreview('')
        setDescription('')
        setCreationStep('')
    }

    const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validation = validateMediaFile(file, MAX_IMAGE_SIZE_MB)
        if (!validation.valid) {
            toast.error(validation.error || `Image size exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`)
            e.target.value = ''
            return
        }

        try {
            toast.info('Processing thumbnail...')
            const result = await compressMediaFile(file, {
                maxMB: MAX_IMAGE_SIZE_MB,
                maxDimension: 1600,
            })
            setStagedThumbnailBase64(result.base64)
            setThumbnailPreview(result.base64)
            if (result.compressed && result.originalMB > 1.0) {
                toast.success(
                    `Thumbnail optimized (${result.originalMB.toFixed(1)}MB → ${result.finalMB.toFixed(2)}MB)`
                )
            } else {
                toast.info('Thumbnail selected')
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to process thumbnail image.')
            e.target.value = ''
        }
    }

    const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validation = validateMediaFile(file, MAX_IMAGE_SIZE_MB)
        if (!validation.valid) {
            toast.error(validation.error || `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`)
            e.target.value = ''
            return
        }

        const isVideo = file.type.startsWith('video/')
        const type: 'image' | 'video' = isVideo ? 'video' : 'image'
        setMediaType(type)

        try {
            toast.info(`Processing ${isVideo ? 'video' : 'image'}...`)
            const result = await compressMediaFile(file, {
                maxMB: MAX_IMAGE_SIZE_MB,
                maxDimension: 1920,
            })
            setStagedMediaBase64(result.base64)
            setMediaPreview(result.base64)
            if (result.compressed && result.originalMB > 1.0) {
                toast.success(
                    `Image optimized (${result.originalMB.toFixed(1)}MB → ${result.finalMB.toFixed(2)}MB)`
                )
            } else {
                toast.info(`${isVideo ? 'Video' : 'Image'} selected`)
            }
        } catch (err: any) {
            toast.error(err.message || `Failed to process ${isVideo ? 'video' : 'image'} file.`)
            e.target.value = ''
        }
    }

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !price) {
            toast.error('Please enter product name and price.')
            return
        }

        setCreating(true)

        try {
            let finalThumbnailUrl = thumbnail.trim()
            let finalImageUrl = image.trim()
            let finalVideoUrl = video.trim()

            if (stagedThumbnailBase64) {
                setCreationStep('Uploading thumbnail to Cloudinary...')
                toast.info('Uploading thumbnail image to Cloudinary...')
                const res = await fetch(`${API_BASE_URL}/products/upload-media`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        media: stagedThumbnailBase64,
                        resourceType: 'image',
                    }),
                })
                const data = await parseUploadResponse(res)
                if (!data.success) {
                    throw new Error(data.message || 'Failed to upload thumbnail to Cloudinary')
                }
                finalThumbnailUrl = data.url
            }

            if (stagedMediaBase64) {
                setCreationStep(`Uploading ${mediaType} file to Cloudinary...`)
                toast.info(`Uploading ${mediaType} file to Cloudinary...`)
                const res = await fetch(`${API_BASE_URL}/products/upload-media`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        media: stagedMediaBase64,
                        resourceType: mediaType,
                    }),
                })
                const data = await parseUploadResponse(res)
                if (!data.success) {
                    throw new Error(data.message || `Failed to upload ${mediaType} to Cloudinary`)
                }

                if (mediaType === 'video' || data.resourceType === 'video') {
                    finalVideoUrl = data.url
                    finalImageUrl = ''
                } else {
                    finalImageUrl = data.url
                    finalVideoUrl = ''
                }
            }

            setCreationStep('Saving product to database...')
            toast.info('Saving product to database...')

            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    category,
                    price,
                    stock: Number(stock),
                    inStock,
                    thumbnail: finalThumbnailUrl,
                    bgColor,
                    image: finalImageUrl,
                    video: finalVideoUrl,
                    mediaType,
                    description,
                    isNewProduct,
                }),
            })

            const data = await parseUploadResponse(res)

            if (data.success) {
                toast.success('Product created successfully!')
                resetAndCloseModal()
                fetchProducts()
            } else {
                toast.error(data.message || 'Error creating product')
            }
        } catch (err: any) {
            toast.error(err.message || 'Error creating product')
        } finally {
            setCreating(false)
            setCreationStep('')
        }
    }

    const filteredProducts =
        selectedCategory === 'All'
            ? products
            : products.filter((p) => p.category === selectedCategory)

    return (
        <main
            className="w-full select-none min-h-screen bg-[#e8e3da]"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <SEO
                title="Curated Collection | Gift Hampers, Chocolates, Bouquets & Rakhis"
                description="Browse our collection of customized gift hampers, handcrafted chocolates, fresh bouquets, designer rakhis, and celebration decor from Trendy Decor Gidderbaha."
                keywords="gift hampers, customized chocolates, bouquets, designer rakhis, event decor, trendy decor gidderbaha"
            />
            <div className="flex flex-col bg-[#e8e3da]">
                <section className="w-full bg-[#f4f1ea] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 text-center border-b border-[#b6ac9f]/30">
                    <div className="max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e8e3da]/80 border border-[#b6ac9f]/40 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1c1c1c]/80 rounded-full">
                            <Sparkles size={13} className="text-[#1c1c1c]/70" /> Artisanal & Handcrafted
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-normal text-[#1c1c1c] tracking-tight">
                            Curated Collections
                        </h1>
                        <p className="text-xs md:text-sm font-light text-[#1c1c1c]/60 max-w-lg mx-auto tracking-wide leading-relaxed">
                            Bespoke gift hampers, handcrafted bouquets, and custom decor designed to
                            make every moment memorable.
                        </p>
                    </div>
                </section>

                {/* ══════════ REFINED STICKY FILTER BAR (DESKTOP & MOBILE ENHANCED) ══════════ */}
                <div className="sticky top-16 sm:top-20 z-40 w-full bg-[#f4f1ea]/95 backdrop-blur-md border-y border-[#d8d2c6] shadow-xs select-none">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
                        {/* Category Dropdown Selector */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2.5 px-4 py-2 bg-white text-[#1c1c1c] border border-[#d8d2c6] rounded-full text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#e8e3da] transition-all cursor-pointer shadow-xs shrink-0"
                                >
                                    <SlidersHorizontal size={14} className="text-[#1c1c1c]/70" />
                                    <span>
                                        Filter: <span className="text-[#1c1c1c] font-bold">{selectedCategory}</span>
                                    </span>
                                    <span className="text-[10px] font-mono bg-[#1c1c1c] text-[#f4f1ea] px-2 py-0.5 rounded-full font-bold">
                                        {filteredProducts.length}
                                    </span>
                                    <ChevronDown size={14} className={`text-[#1c1c1c]/70 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Refined Dropdown Menu */}
                                {isFilterOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsFilterOpen(false)}
                                        />
                                        <div className="absolute left-0 top-full mt-2 w-64 sm:w-72 bg-white border border-[#d8d2c6] rounded-2xl p-3 shadow-2xl z-50 space-y-2 animate-fadeIn">
                                            <div className="flex items-center justify-between pb-2 border-b border-[#e8e3da]">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c1c1c]/60 flex items-center gap-1.5">
                                                    <SlidersHorizontal size={13} /> Select Category
                                                </span>
                                                <button
                                                    onClick={() => setIsFilterOpen(false)}
                                                    className="p-1 text-[#1c1c1c]/50 hover:text-[#1c1c1c] cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <nav className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                                                {CATEGORIES.map((cat) => {
                                                    const count =
                                                        cat === 'All'
                                                            ? products.length
                                                            : products.filter((p) => p.category === cat).length
                                                    const isSelected = selectedCategory === cat

                                                    return (
                                                        <button
                                                            key={cat}
                                                            onClick={() => {
                                                                handleSelectCategory(cat)
                                                                setIsFilterOpen(false)
                                                            }}
                                                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all flex items-center justify-between cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-[#1c1c1c] text-[#f4f1ea] font-medium shadow-xs'
                                                                    : 'text-[#1c1c1c]/80 hover:bg-[#f4f1ea] hover:text-[#1c1c1c]'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-2 truncate">
                                                                {isSelected && <Check size={14} className="text-[#f4f1ea]" />}
                                                                {cat}
                                                            </span>
                                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                                                isSelected ? 'bg-white/20 text-[#f4f1ea]' : 'bg-[#e8e3da] text-[#1c1c1c]/70'
                                                            }`}>
                                                                {count} items
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </nav>
                                            {user?.isOwner && (
                                                <div className="pt-2 border-t border-[#e8e3da]">
                                                    <button
                                                        onClick={() => {
                                                            setIsFilterOpen(false)
                                                            setIsCreateModalOpen(true)
                                                        }}
                                                        className="w-full py-2.5 px-3 bg-[#1c1c1c] text-[#f4f1ea] text-[11px] font-medium uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-black transition-colors cursor-pointer"
                                                    >
                                                        <Plus size={13} /> Add Product
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Large Screen Quick Category Pills */}
                            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                                {CATEGORIES.map((cat) => {
                                    const isSelected = selectedCategory === cat
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => handleSelectCategory(cat)}
                                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                                                isSelected
                                                    ? 'bg-[#1c1c1c] text-[#f4f1ea] border-[#1c1c1c] shadow-2xs font-semibold'
                                                    : 'bg-white text-[#1c1c1c]/80 border-[#d8d2c6] hover:bg-[#e8e3da] hover:text-[#1c1c1c]'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right Info Label */}
                        <span className="text-xs text-[#1c1c1c]/60 font-light shrink-0">
                            Showing <strong className="text-[#1c1c1c] font-semibold">{filteredProducts.length}</strong> items
                        </span>
                    </div>
                </div>

                {/* Product Grid Section */}
                <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-10">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-7 w-full">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="flex flex-col bg-white overflow-hidden rounded-none border border-[#e5e0d8] p-2.5 sm:p-3"
                                >
                                    <div className="relative w-full aspect-square rounded-none overflow-hidden skeleton-shimmer bg-[#f8f6f0]" />
                                    <div className="p-2 sm:p-3 pt-3 flex flex-col gap-2">
                                        <div className="h-3 w-16 sm:w-24 rounded-none bg-[#e8e3da] animate-pulse" />
                                        <div className="h-4 sm:h-5 w-4/5 rounded-none bg-[#e8e3da] animate-pulse" />
                                        <div className="h-4 sm:h-5 w-1/2 rounded-none bg-[#e8e3da] animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-24 bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-none flex flex-col items-center justify-center text-center p-8 space-y-3">
                            <Package size={36} className="text-[#1c1c1c]/30" />
                            <p className="text-[16px] font-medium text-[#1c1c1c]">
                                No products found
                            </p>
                            <p className="text-[13px] font-light text-[#1c1c1c]/60 max-w-sm">
                                There are currently no items available under "{selectedCategory}". Please select another category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-7 pb-12">
                            {filteredProducts.map((product) => {
                                const productId = (
                                    product._id ||
                                    product.id ||
                                    ''
                                ).toString()
                                const cartItem = cartItems.find((item) => {
                                    const id = (
                                        item.product._id ||
                                        item.product.id ||
                                        ''
                                    ).toString()
                                    return id === productId
                                })
                                const quantityInCart = cartItem ? cartItem.quantity : 0

                                const rawPrice = typeof product.price === 'number'
                                    ? product.price
                                    : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0
                                const mrpVal = rawPrice ? Math.round(rawPrice * 1.35) : 0

                                return (
                                    <Link
                                        key={productId}
                                        href={`/product/${productId}`}
                                        prefetch={true}
                                        className="group relative flex flex-col bg-white rounded-none overflow-hidden border border-[#e2dcd2] cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 justify-between block"
                                    >
                                        {/* Image Box - Square aspect ratio with sharp corners */}
                                        <div className="relative w-full aspect-square shrink-0 bg-[#f8f6f0] overflow-hidden flex items-center justify-center p-2.5 sm:p-4 rounded-none">
                                            <ProductMediaWithSkeleton
                                                mediaType={product.mediaType}
                                                image={product.image}
                                                video={product.video}
                                                alt={product.name}
                                                bgColor="#f8f6f0"
                                                className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Badges */}
                                            {product.isNewProduct && (
                                                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-white bg-[#1c1c1c] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-none shadow-sm">
                                                    NEW
                                                </span>
                                            )}
                                        </div>

                                        {/* Card Info */}
                                        <div className="p-2.5 sm:p-4 md:p-5 flex flex-col justify-between flex-1 gap-1.5 sm:gap-2">
                                            <div>
                                                <h4 className="text-[10px] sm:text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#1c1c1c] truncate">
                                                    {product.category || 'Trendy Decor'}
                                                </h4>
                                                <p className="text-[12px] sm:text-[15px] md:text-[16px] font-normal text-gray-700 line-clamp-1 leading-tight mt-0.5 sm:mt-1">
                                                    {product.name}
                                                </p>
                                            </div>

                                            <div className="mt-0.5 sm:mt-1">
                                                <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                                                    <span className="text-[13px] sm:text-[17px] md:text-[18px] font-bold text-[#1c1c1c]">
                                                        Rs. {product.price}
                                                    </span>
                                                    {mrpVal > 0 && (
                                                        <span className="text-[10px] sm:text-[12px] text-gray-400 line-through">
                                                            Rs. {mrpVal}
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] sm:text-[11px] md:text-[12px] font-bold text-orange-600">
                                                        (26% OFF)
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Cart Button */}
                                            <div className="pt-1.5 sm:pt-2 mt-auto">
                                                {quantityInCart > 0 ? (
                                                    <div className="flex items-center justify-between bg-[#1c1c1c] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-none w-full">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                updateQuantity(productId, quantityInCart - 1)
                                                            }}
                                                            className="p-0.5 sm:p-1 text-white hover:opacity-80 cursor-pointer"
                                                        >
                                                            <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                                                        </button>
                                                        <span className="text-[10px] sm:text-[12px] font-semibold font-mono text-white">
                                                            {quantityInCart} in Cart
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                updateQuantity(productId, quantityInCart + 1)
                                                            }}
                                                            className="p-0.5 sm:p-1 text-white hover:opacity-80 cursor-pointer"
                                                        >
                                                            <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            handleAddToCart(product, e)
                                                        }}
                                                        className="w-full py-1.5 sm:py-2.5 bg-[#1c1c1c] text-white text-[10px] sm:text-[12px] font-medium uppercase tracking-wider rounded-none flex items-center justify-center gap-1 sm:gap-2 hover:bg-black transition-colors cursor-pointer"
                                                    >
                                                        <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" /> Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-[#b6ac9f]/30 pb-4">
                            <h2 className="text-xl font-normal text-[#1c1c1c]">
                                Create New Product
                            </h2>
                            <button
                                onClick={resetAndCloseModal}
                                disabled={creating}
                                className="p-1.5 rounded-full text-[#1c1c1c]/60 hover:text-[#1c1c1c] hover:bg-[#e8e3da] transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProduct} className="space-y-4 text-[13px]">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Elegant Floral Hamper"
                                    className="w-full px-3.5 py-2.5 bg-[#e8e3da]/60 border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as any)}
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/60 border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                    >
                                        <option value="Hampers">Hampers</option>
                                        <option value="Bouquets">Bouquets</option>
                                        <option value="Rakhis">Rakhis</option>
                                        <option value="Customize Chocolates">
                                            Customize Chocolates
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        Price *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="e.g. ₹500"
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/60 border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(Number(e.target.value))}
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/60 border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors"
                                    />
                                </div>
                                <div className="pt-5 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isNewProduct"
                                        checked={isNewProduct}
                                        onChange={(e) => setIsNewProduct(e.target.checked)}
                                        className="w-4 h-4 accent-[#1c1c1c] rounded cursor-pointer"
                                    />
                                    <label
                                        htmlFor="isNewProduct"
                                        className="text-[12px] font-medium text-[#1c1c1c] cursor-pointer"
                                    >
                                        Mark as "New"
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief product description..."
                                    className="w-full px-3.5 py-2.5 bg-[#e8e3da]/60 border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                    Thumbnail Image
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="px-3.5 py-2 bg-[#e8e3da] hover:bg-[#ded8cd] border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] text-[12px] font-medium flex items-center gap-2 cursor-pointer transition-colors">
                                        <Upload size={14} /> Select File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailSelect}
                                            className="hidden"
                                        />
                                    </label>
                                    {thumbnailPreview && (
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-10 h-10 object-cover rounded-lg border border-[#b6ac9f]/40"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                    Product Media (Image or Video)
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="px-3.5 py-2 bg-[#e8e3da] hover:bg-[#ded8cd] border border-[#b6ac9f]/40 rounded-xl text-[#1c1c1c] text-[12px] font-medium flex items-center gap-2 cursor-pointer transition-colors">
                                        {mediaType === 'video' ? (
                                            <Film size={14} />
                                        ) : (
                                            <ImageIcon size={14} />
                                        )}{' '}
                                        Select File
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleMediaSelect}
                                            className="hidden"
                                        />
                                    </label>
                                    {mediaPreview &&
                                        (mediaType === 'video' ? (
                                            <SafeVideo
                                                src={mediaPreview}
                                                className="w-10 h-10 object-cover rounded-lg border border-[#b6ac9f]/40"
                                            />
                                        ) : (
                                            <img
                                                src={mediaPreview}
                                                alt="Media preview"
                                                className="w-10 h-10 object-cover rounded-lg border border-[#b6ac9f]/40"
                                            />
                                        ))}
                                </div>
                            </div>
                            {creationStep && (
                                <div className="p-3 bg-[#e8e3da] border border-[#b6ac9f]/30 rounded-xl flex items-center gap-2 text-[#1c1c1c] text-[12px]">
                                    <Loader2 size={15} className="animate-spin text-[#1c1c1c]" />
                                    <span>{creationStep}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#b6ac9f]/30">
                                <button
                                    type="button"
                                    onClick={resetAndCloseModal}
                                    disabled={creating}
                                    className="px-4 py-2.5 rounded-xl border border-[#b6ac9f]/40 text-[#1c1c1c] font-medium hover:bg-[#e8e3da] transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-5 py-2.5 rounded-xl bg-[#1c1c1c] text-[#f4f1ea] font-medium hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                                >
                                    {creating && <Loader2 size={14} className="animate-spin" />}
                                    {creating ? 'Creating...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default function Products() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#e8e3da] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1c1c1c] border-t-transparent" /></div>}>
            <ProductsContent />
        </Suspense>
    )
}
