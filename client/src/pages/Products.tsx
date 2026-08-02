import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SEO from '../components/common/SEO'
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
import { useCart, type ProductItem } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config/api'

const CATEGORIES = ['All', 'Hampers', 'Bouquets', 'Rakhis', 'Customize Chocolates']

const ProductMediaWithSkeleton: React.FC<{
    mediaType?: 'image' | 'video'
    image?: string
    video?: string
    alt: string
    className?: string
    bgColor?: string
}> = ({ mediaType, image, video, alt, className = '', bgColor = '#cec9be' }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)

    const isVideo = mediaType === 'video' || Boolean(video)
    const mediaSrc = isVideo ? video || image : image

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            {!isLoaded && !hasError && <div className="absolute inset-0 skeleton-shimmer z-10" />}

            {!hasError && mediaSrc ? (
                isVideo ? (
                    <video
                        src={mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onLoadedData={() => setIsLoaded(true)}
                        onError={() => setHasError(true)}
                        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'
                            } transition-opacity duration-500`}
                    />
                ) : (
                    <img
                        src={mediaSrc}
                        alt={alt}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setHasError(true)}
                        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'
                            } transition-opacity duration-500`}
                    />
                )
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/30 font-light text-[12px] gap-2">
                    <ImageIcon size={24} />
                    <span>No Preview Available</span>
                </div>
            )}
        </div>
    )
}

const Products: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
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
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Keep category state in sync with URL search parameter
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
            searchParams.delete('category')
            setSearchParams(searchParams, { replace: true })
        } else {
            setSearchParams({ category: cat }, { replace: true })
        }
    }

    // Create Product Modal State for Owner
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [creating, setCreating] = useState<boolean>(false)

    // Form fields for new product
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

    // Staged files for deferred upload on product creation
    const [stagedThumbnailBase64, setStagedThumbnailBase64] = useState<string>('')
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
    const [stagedMediaBase64, setStagedMediaBase64] = useState<string>('')
    const [mediaPreview, setMediaPreview] = useState<string>('')
    const [creationStep, setCreationStep] = useState<string>('')

    // Fetch dynamic products from backend API
    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/products`)
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

    // IntersectionObserver for scroll-triggered card reveal
    const attachObserver = useCallback(() => {
        if (observerRef.current) observerRef.current.disconnect()
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible')
                        observerRef.current?.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.08 }
        )
        document.querySelectorAll('.card-reveal').forEach((el) => {
            observerRef.current?.observe(el)
        })
    }, [])

    useEffect(() => {
        if (!loading) {
            // Short timeout to let DOM paint first
            const t = setTimeout(attachObserver, 60)
            return () => clearTimeout(t)
        }
    }, [loading, attachObserver])

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

    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Data = reader.result as string
            setStagedThumbnailBase64(base64Data)
            setThumbnailPreview(base64Data)
            toast.info('Thumbnail selected')
        }
        reader.readAsDataURL(file)
    }

    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isVideo = file.type.startsWith('video/')
        const type: 'image' | 'video' = isVideo ? 'video' : 'image'
        setMediaType(type)

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Data = reader.result as string
            setStagedMediaBase64(base64Data)
            setMediaPreview(base64Data)
            toast.info(`${isVideo ? 'Video' : 'Image'} selected`)
        }
        reader.readAsDataURL(file)
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

            // 1. Upload Thumbnail to Cloudinary if staged
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
                const data = await res.json()
                if (!res.ok || !data.success) {
                    throw new Error(data.message || 'Failed to upload thumbnail to Cloudinary')
                }
                finalThumbnailUrl = data.url
            }

            // 2. Upload Product Media to Cloudinary if staged
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
                const data = await res.json()
                if (!res.ok || !data.success) {
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

            // 3. Create Product in Backend
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

            const data = await res.json()

            if (res.ok) {
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

    type LayoutType =
        'MONO_HERO' | 'DUO_HERO' | 'TRIO_BALANCED' | 'ASYMMETRIC_LEFT' | 'ASYMMETRIC_RIGHT'
    interface EditorialRow<T> {
        items: T[]
        type: LayoutType
    }
    const LAYOUT_PATTERN_SEQUENCE: { type: LayoutType; count: number }[] = [
        { type: 'DUO_HERO', count: 2 },
        { type: 'TRIO_BALANCED', count: 3 },
        { type: 'ASYMMETRIC_LEFT', count: 2 },
        { type: 'TRIO_BALANCED', count: 3 },
        { type: 'ASYMMETRIC_RIGHT', count: 2 },
    ]

    const chunkArrayEditorial = <T,>(arr: T[]): EditorialRow<T>[] => {
        const rows: EditorialRow<T>[] = []
        let currentIndex = 0
        let patternIndex = 0

        while (currentIndex < arr.length) {
            const remaining = arr.length - currentIndex
            let countToTake = 2
            let rowType: LayoutType = 'DUO_HERO'

            if (remaining === 1) {
                countToTake = 1
                rowType = 'MONO_HERO'
            } else if (remaining === 2) {
                countToTake = 2
                rowType = 'DUO_HERO'
            } else if (remaining === 3) {
                countToTake = 3
                rowType = 'TRIO_BALANCED'
            } else if (remaining === 4) {
                countToTake = 2
                rowType = 'DUO_HERO'
            } else {
                const pattern =
                    LAYOUT_PATTERN_SEQUENCE[patternIndex % LAYOUT_PATTERN_SEQUENCE.length]
                countToTake = pattern.count
                rowType = pattern.type
                patternIndex++
            }

            const items = arr.slice(currentIndex, currentIndex + countToTake)

            if (items.length === 1) {
                rowType = 'MONO_HERO'
            } else if (items.length === 2 && rowType === 'TRIO_BALANCED') {
                rowType = 'DUO_HERO'
            }

            rows.push({ items, type: rowType })
            currentIndex += countToTake
        }
        return rows
    }

    const productRows = chunkArrayEditorial(filteredProducts)

    const getRowGridContainerClass = (type: LayoutType) => {
        if (type === 'MONO_HERO') return 'grid grid-cols-1'
        if (type === 'DUO_HERO') return 'grid grid-cols-1 sm:grid-cols-2'
        if (type === 'TRIO_BALANCED') return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        // ASYMMETRIC types: collapse to 2-col on sm, grid-cols-3 on md
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    }
    const getItemColSpanClass = (type: LayoutType, itemIndex: number) => {
        // On md+ apply asymmetric spans; on mobile always full-width
        if (type === 'ASYMMETRIC_LEFT')
            return itemIndex === 0 ? 'col-span-1 md:col-span-2' : 'col-span-1'
        if (type === 'ASYMMETRIC_RIGHT')
            return itemIndex === 0 ? 'col-span-1' : 'col-span-1 md:col-span-2'
        return 'col-span-1'
    }
    const getItemImageHeightClass = (type: LayoutType) => {
        // Shorter on mobile, grow on tablet/desktop
        if (type === 'MONO_HERO' || type === 'DUO_HERO')
            return 'h-[240px] xs:h-[300px] sm:h-[380px] md:h-[460px] lg:h-[540px]'
        return 'h-[200px] xs:h-[260px] sm:h-[320px] md:h-[380px] lg:h-[440px]'
    }

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
                {/* ── HEADER BANNER ── */}
                <section className="w-full bg-[#f4f1ea] py-16 md:py-20 px-6 md:px-12 text-center border-b border-[#b6ac9f]/30">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e8e3da]/80 border border-[#b6ac9f]/40 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1c1c1c]/80 ">
                            <Sparkles size={13} className="text-[#1c1c1c]/70" /> Artisanal &
                            Handcrafted
                        </div>
                        <h1 className="text-3xl md:text-5xl font-normal text-[#1c1c1c] tracking-tight">
                            Curated Collections
                        </h1>
                        <p className="text-xs md:text-sm font-light text-[#1c1c1c]/60 max-w-lg mx-auto tracking-wide leading-relaxed">
                            Bespoke gift hampers, handcrafted bouquets, and custom decor designed to
                            make every moment memorable.
                        </p>
                    </div>
                </section>

                {/* ── MAIN CONTENT CONTAINER (ALIGNED WITH NAVBAR) ── */}
                <div className="w-full max-w-[1600px] mx-auto px-2.5 sm:px-6 md:px-12 py-5 md:py-10">
                    {/* ── MAIN PRODUCT CATALOG GRID ── */}
                    <div className="w-full flex flex-col min-w-0" style={{ gap: '4px' }}>
                        {loading ? (
                            <div className="w-full flex flex-col gap-[4px] py-2">
                                {/* Skeleton Row 1: 3-column product cards */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-[4px] w-full">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col bg-[#f4f1ea] overflow-hidden rounded-xl md:rounded-none"
                                        >
                                            <div className="relative w-full h-[220px] md:h-[450px] overflow-hidden skeleton-shimmer">
                                                <div className="absolute top-4 left-4 h-5 w-20 rounded-full bg-[#1c1c1c]/10 animate-pulse" />
                                            </div>
                                            <div className="p-3 md:p-5 bg-[#f4f1ea] border-t border-[#b6ac9f]/25 flex flex-col justify-between gap-3">
                                                <div className="h-2.5 w-24 rounded-full bg-[#dcd6ca] animate-pulse" />
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="h-4 w-3/5 rounded bg-[#d2cbc0] animate-pulse" />
                                                    <div className="h-4 w-14 rounded bg-[#d2cbc0] animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="py-32 bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-3">
                                <Package size={32} className="text-[#1c1c1c]/30" />
                                <p className="text-[15px] font-medium text-[#1c1c1c]">
                                    No products found
                                </p>
                                <p className="text-[13px] font-light text-[#1c1c1c]/60 max-w-sm">
                                    There are currently no items available under "{selectedCategory}
                                    ". Please select another category.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* ── MOBILE-ONLY E-COMMERCE CARD GRID (< md) ── */}
                                <div className="md:hidden grid grid-cols-2 gap-2.5 sm:gap-3.5 pb-6">
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

                                        return (
                                            <div
                                                key={productId}
                                                onClick={() => navigate(`/product/${productId}`)}
                                                className="group relative flex flex-col bg-[#f4f1ea] rounded-xl overflow-hidden border border-[#b6ac9f]/30 p-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-transform justify-between"
                                            >
                                                {/* Image Box */}
                                                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#cec9be]">
                                                    <ProductMediaWithSkeleton
                                                        mediaType={product.mediaType}
                                                        image={product.image}
                                                        video={product.video}
                                                        alt={product.name}
                                                        bgColor={product.bgColor || '#cec9be'}
                                                        className="w-full h-full object-cover"
                                                    />

                                                    {/* Top Left Badge: NEW */}
                                                    {product.isNewProduct && (
                                                        <span className="absolute top-2 left-2 z-10 text-[9px] font-bold uppercase tracking-wider text-white bg-[#1c1c1c] px-2 py-0.5 rounded-md shadow-sm">
                                                            NEW
                                                        </span>
                                                    )}

                                                </div>

                                                {/* Product Info */}
                                                <div className="p-1.5 pt-2.5 flex flex-col justify-between flex-1 gap-1">
                                                    {/* Category / Brand */}
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c]/50 truncate">
                                                        {product.category}
                                                    </p>

                                                    {/* Product Name */}
                                                    <h4 className="text-[12px] font-normal text-[#1c1c1c]/90 line-clamp-2 leading-tight min-h-[2.1rem]">
                                                        {product.name}
                                                    </h4>

                                                    {/* Price */}
                                                    <p className="text-[14px] font-bold text-[#1c1c1c] font-mono tracking-tight mt-0.5">
                                                        {product.price}
                                                    </p>

                                                    {/* Mobile Add to Cart / Quantity Stepper Button */}
                                                    <div className="pt-1.5 mt-auto">
                                                        {quantityInCart > 0 ? (
                                                            <div className="flex items-center justify-between bg-[#1c1c1c] text-[#f4f1ea] px-2.5 py-1.5 rounded-xl w-full">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        updateQuantity(
                                                                            productId,
                                                                            quantityInCart - 1
                                                                        )
                                                                    }}
                                                                    className="p-0.5 text-[#f4f1ea] hover:opacity-80 cursor-pointer"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="text-[10px] font-semibold font-mono text-[#f4f1ea]">
                                                                    {quantityInCart} in Cart
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        updateQuantity(
                                                                            productId,
                                                                            quantityInCart + 1
                                                                        )
                                                                    }}
                                                                    className="p-0.5 text-[#f4f1ea] hover:opacity-80 cursor-pointer"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={(e) =>
                                                                    handleAddToCart(product, e)
                                                                }
                                                                className="w-full py-1.5 bg-[#1c1c1c] text-[#f4f1ea] text-[10px] font-medium uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-black transition-colors cursor-pointer"
                                                            >
                                                                <ShoppingBag size={12} /> Add to Cart
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* ── DESKTOP-ONLY EDITORIAL PRODUCT GRID (>= md) ── */}
                                <div className="hidden md:flex md:flex-col gap-[4px]">
                                    {productRows.map((row, rowIndex) => {
                                        const { items, type } = row
                                        // Sticky stacking only on md+ to avoid mobile overlap
                                        const topStickyOffset = 64 + rowIndex * 6
                                        const gridContainerClass = getRowGridContainerClass(type)
                                        const imageHeightClass = getItemImageHeightClass(type)

                                        return (
                                            <div
                                                key={rowIndex}
                                                className="sticky bg-[#e8e3da] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] card-reveal"
                                                style={{
                                                    top: `${topStickyOffset}px`,
                                                    zIndex: 10 + rowIndex * 10,
                                                    animationDelay: `${rowIndex * 60}ms`,
                                                }}
                                            >
                                                <div className={gridContainerClass} style={{ gap: '4px' }}>
                                                    {items.map((product, itemIndex) => {
                                                        const colSpanClass = getItemColSpanClass(
                                                            type,
                                                            itemIndex
                                                        )

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
                                                        const quantityInCart = cartItem
                                                            ? cartItem.quantity
                                                            : 0

                                                        return (
                                                            <div
                                                                key={
                                                                    product._id ||
                                                                    product.id ||
                                                                    product.name
                                                                }
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/product/${product._id || product.id}`
                                                                    )
                                                                }
                                                                className={`group relative flex flex-col bg-[#f4f1ea] overflow-hidden cursor-pointer ${colSpanClass}`}
                                                            >
                                                                {/* Product Image Box */}
                                                                <div
                                                                    className={`relative w-full ${imageHeightClass} overflow-hidden transition-colors`}
                                                                    style={{
                                                                        backgroundColor:
                                                                            product.bgColor || '#cec9be',
                                                                    }}
                                                                >
                                                                    <ProductMediaWithSkeleton
                                                                        mediaType={product.mediaType}
                                                                        image={product.image}
                                                                        video={product.video}
                                                                        alt={product.name}
                                                                        bgColor={
                                                                            product.bgColor || '#cec9be'
                                                                        }
                                                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                                    />

                                                                    {/* Subtle Hover Gradient Overlay */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                                    {/* In-Cart Badge / New Tag */}
                                                                    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                                                                        {quantityInCart > 0 ? (
                                                                            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#f4f1ea] bg-[#1c1c1c]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                                                                                <ShoppingBag size={11} />{' '}
                                                                                {quantityInCart} in Cart
                                                                            </span>
                                                                        ) : (
                                                                            <div />
                                                                        )}

                                                                        {product.isNewProduct && (
                                                                            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1c1c1c] bg-[#f4f1ea]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#b6ac9f]/30 shadow-sm">
                                                                                New
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Quick Add to Cart or Stepper Controls on Hover — always visible on touch */}
                                                                    <div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 touch-cart-visible">
                                                                        {quantityInCart > 0 ? (
                                                                            <div className="flex items-center justify-between w-full bg-[#1c1c1c] text-[#f4f1ea] rounded-xl px-3 py-2 shadow-xl border border-white/10">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        updateQuantity(
                                                                                            productId,
                                                                                            quantityInCart -
                                                                                            1
                                                                                        )
                                                                                    }}
                                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 text-[#f4f1ea] transition-colors cursor-pointer active:scale-95"
                                                                                    title="Decrease quantity"
                                                                                >
                                                                                    <Minus size={14} />
                                                                                </button>
                                                                                <span className="text-[12px] font-semibold uppercase tracking-wider text-[#f4f1ea]">
                                                                                    {quantityInCart} in Cart
                                                                                </span>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        updateQuantity(
                                                                                            productId,
                                                                                            quantityInCart +
                                                                                            1
                                                                                        )
                                                                                    }}
                                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 text-[#f4f1ea] transition-colors cursor-pointer active:scale-95"
                                                                                    title="Increase quantity"
                                                                                >
                                                                                    <Plus size={14} />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                onClick={(e) =>
                                                                                    handleAddToCart(
                                                                                        product,
                                                                                        e
                                                                                    )
                                                                                }
                                                                                className="w-full py-3 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-medium uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer rounded-xl"
                                                                            >
                                                                                <ShoppingBag size={15} />{' '}
                                                                                Add to Cart
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Product Info below image box */}
                                                                <div className="p-4 md:p-5 bg-[#f4f1ea] border-t border-[#b6ac9f]/25 flex flex-col justify-between flex-1 gap-2">
                                                                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#1c1c1c]/50">
                                                                        {product.category}
                                                                    </p>

                                                                    {/* Product Name & Price in Same Row */}
                                                                    <div className="flex items-baseline justify-between gap-3">
                                                                        <h3 className="text-[15px] font-normal text-[#1c1c1c] group-hover:text-[#1c1c1c]/80 transition-colors truncate">
                                                                            {product.name}
                                                                        </h3>
                                                                        <p className="text-[17px] md:text-[18px] font-bold text-[#1c1c1c] shrink-0 font-mono tracking-tight">
                                                                            {product.price}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── STICKY FLOATING BOTTOM FILTER BAR ── */}
            <div className="fixed bottom-6 left-4 md:left-12 z-40 flex flex-col items-start">
                {/* Expandable Category Menu */}
                {isFilterOpen && (
                    <div className="mb-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between pb-2 border-b border-[#b6ac9f]/20">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c1c]/60">
                                <SlidersHorizontal size={14} /> Filter Categories
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-1 text-[#1c1c1c]/50 hover:text-[#1c1c1c] transition-colors cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
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
                                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] tracking-wide transition-all flex items-center justify-between cursor-pointer ${isSelected
                                            ? 'bg-[#1c1c1c] text-[#f4f1ea] font-medium shadow-sm'
                                            : 'text-[#1c1c1c]/70 hover:bg-[#e8e3da] hover:text-[#1c1c1c]'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isSelected && (
                                                <Check size={14} className="text-[#f4f1ea]" />
                                            )}
                                            {cat}
                                        </span>
                                        <span
                                            className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${isSelected
                                                ? 'bg-white/20 text-[#f4f1ea]'
                                                : 'bg-[#e8e3da] text-[#1c1c1c]/60'
                                                }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                )
                            })}
                        </nav>

                        {/* Store Owner Add Product Action inside Filter */}
                        {user?.isOwner && (
                            <div className="pt-2 border-t border-[#b6ac9f]/20">
                                <button
                                    onClick={() => {
                                        setIsFilterOpen(false)
                                        setIsCreateModalOpen(true)
                                    }}
                                    className="w-full py-2.5 px-3 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-medium uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors cursor-pointer"
                                >
                                    <Plus size={14} /> Add Product
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Floating Bottom Pill Button */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="px-6 py-3 bg-[#1c1c1c]/95 text-[#f4f1ea] backdrop-blur-md border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.3)] rounded-full flex items-center gap-3 hover:bg-black transition-all cursor-pointer group active:scale-95"
                >
                    <SlidersHorizontal
                        size={15}
                        className="text-[#f4f1ea]/80 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[12px] font-medium uppercase tracking-wider">
                        Filter:{' '}
                        <span className="text-[#f4f1ea] font-semibold">{selectedCategory}</span>
                    </span>
                    <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-full font-medium ml-1">
                        {filteredProducts.length}
                    </span>
                    {isFilterOpen ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                </button>
            </div>

            {/* ── CREATE PRODUCT MODAL FOR OWNER ── */}
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
                            {/* Product Name */}
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

                            {/* Category & Price */}
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

                            {/* Stock & New Flag */}
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

                            {/* Description */}
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

                            {/* Thumbnail Upload */}
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

                            {/* Main Media Upload (Image or Video) */}
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
                                            <video
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

                            {/* Status Indicator during creation */}
                            {creationStep && (
                                <div className="p-3 bg-[#e8e3da] border border-[#b6ac9f]/30 rounded-xl flex items-center gap-2 text-[#1c1c1c] text-[12px]">
                                    <Loader2 size={15} className="animate-spin text-[#1c1c1c]" />
                                    <span>{creationStep}</span>
                                </div>
                            )}

                            {/* Actions */}
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

export default Products
