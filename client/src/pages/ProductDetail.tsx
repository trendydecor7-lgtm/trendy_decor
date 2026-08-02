import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SEO from '../components/common/SEO'
import {
    ShoppingBag,
    Share2,
    Check,
    ChevronRight,
    Truck,
    ShieldCheck,
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
import { useCart, type ProductItem } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { API_BASE_URL } from '../config/api'

interface ProductDetailData {
    _id: string
    id?: string
    name: string
    category: ProductItem['category'] | string
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

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { cartItems, addToCart, updateQuantity } = useCart()
    const { toast } = useToast()

    const [product, setProduct] = useState<ProductDetailData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    // Gallery State
    const [activeMediaUrl, setActiveMediaUrl] = useState<string>('')
    const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image')
    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)

    // Accordion State
    const [activeAccordion, setActiveAccordion] = useState<string>('details')

    // Related Products
    const [relatedProducts, setRelatedProducts] = useState<ProductDetailData[]>([])

    // Fetch Product Details by ID
    useEffect(() => {
        if (!id) return
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setLoading(true)
        setError('')

        const fetchProductDetail = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    if (data.success && data.product) {
                        const prod = data.product
                        setProduct(prod)

                        // Set initial main media
                        const primaryMedia =
                            prod.image || prod.video || (prod.images && prod.images[0]) || ''
                        const isVid =
                            (prod.mediaType === 'video' || Boolean(prod.video)) && !prod.image
                        setActiveMediaUrl(primaryMedia)
                        setActiveMediaType(isVid ? 'video' : 'image')
                    } else {
                        setError('Product details not found.')
                    }
                } else {
                    setError('Failed to load product details.')
                }
            } catch (err: any) {
                console.error('Error fetching product details:', err)
                setError('Error connecting to product server.')
            } finally {
                setLoading(false)
            }
        }

        fetchProductDetail()
    }, [id])

    // Fetch Related Products
    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products`)
                if (res.ok) {
                    const data = await res.json()
                    if (data.success && Array.isArray(data.products)) {
                        const filtered = data.products.filter((p: any) => (p._id || p.id) !== id)
                        setRelatedProducts(filtered.slice(0, 4))
                    }
                }
            } catch (err) {
                console.warn('Could not fetch related products:', err)
            }
        }
        fetchRelated()
    }, [id])

    // Quantity in cart check
    const productId = (product?._id || product?.id || '').toString()
    const cartItem = cartItems.find((item) => {
        const itemProdId = (item.product._id || item.product.id || '').toString()
        return itemProdId === productId
    })
    const quantityInCart = cartItem ? cartItem.quantity : 0

    // Combine all gallery items (image, video, images array)
    const galleryItems: Array<{ url: string; type: 'image' | 'video'; label?: string }> = []
    if (product) {
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
    }

    const handleAddToCart = () => {
        if (!product) return
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
        navigate('/cart')
    }

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Product link copied to clipboard!')
        } else {
            toast.info('Copy URL: ' + window.location.href)
        }
    }

    if (loading) {
        return (
            <main className="w-full min-h-screen bg-[#e8e3da] flex items-center justify-center py-24">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-[#1c1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[14px] font-light uppercase tracking-widest text-[#1c1c1c]/70">
                        Loading Luxury Product Details...
                    </p>
                </div>
            </main>
        )
    }

    if (error || !product) {
        return (
            <main className="w-full min-h-screen bg-[#e8e3da] py-24 px-6">
                <SEO
                    title="Product Not Found | 404 - Trendy Decor"
                    description="The requested decor piece could not be found in our catalog."
                />
                <div className="max-w-md mx-auto bg-[#f4f1ea] border border-[#b6ac9f]/60 p-8 rounded-2xl text-center space-y-6 shadow-xl">
                    <h2 className="text-2xl font-normal text-[#1c1c1c]">Product Not Found</h2>
                    <p className="text-[14px] font-light text-[#1c1c1c]/70">
                        {error ||
                            'The luxury item you are looking for is unavailable or has been removed.'}
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1c] text-[#f4f1ea] text-[13px] font-light uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main
            className="w-full bg-[#e8e3da] text-[#1c1c1c] min-h-screen select-none animate-smooth-appear"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <SEO
                title={product?.name || 'Product Details'}
                description={
                    product?.description ||
                    'Explore custom gift hampers, artisanal chocolates, floral bouquets, designer rakhis, and celebration decor.'
                }
                image={product?.images?.[0] || product?.image || undefined}
                type="product"
                schema={
                    product
                        ? {
                            '@context': 'https://schema.org/',
                            '@type': 'Product',
                            name: product.name,
                            image: product?.images?.[0] || product?.image,
                            description: product.description,
                            offers: {
                                '@type': 'Offer',
                                priceCurrency: 'USD',
                                price: product.price,
                                availability: 'https://schema.org/InStock',
                            },
                        }
                        : undefined
                }
            />

            {/* ── MOBILE-ONLY UNIFIED SINGLE PAGE LAYOUT (< md) ── */}
            <div className="md:hidden w-full max-w-full overflow-x-hidden bg-[#f4f1ea] min-h-screen pt-[56px] pb-24">
                {/* ── MOBILE FIXED TOP ACTION BAR (Always visible at top of screen) ── */}
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
                    className="bg-[#f4f1ea]/95 backdrop-blur-md border-b border-[#b6ac9f]/30 px-3.5 py-2 shadow-sm flex items-center justify-between gap-2.5 h-[56px]"
                >
                    <button
                        onClick={() => navigate(-1)}
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

                {/* Mobile Full-Width Media Header */}
                <div
                    className="relative w-full h-[380px] xs:h-[440px] bg-[#cec9be] overflow-hidden"
                    style={{ backgroundColor: product.bgColor || '#cec9be' }}
                >
                    {activeMediaType === 'video' ? (
                        <video
                            src={activeMediaUrl}
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : activeMediaUrl ? (
                        <img
                            src={activeMediaUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onClick={() => setLightboxOpen(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/40 font-light text-xs gap-2">
                            <ImageIcon size={24} />
                            <span>No Media Preview Available</span>
                        </div>
                    )}

                    {/* Top Badges */}
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

                    {/* Thumbnail Dot Indicators */}
                    {galleryItems.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                            {galleryItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setActiveMediaUrl(item.url)
                                        setActiveMediaType(item.type)
                                    }}
                                    className={`rounded-full transition-all duration-300 ${activeMediaUrl === item.url
                                        ? 'w-5 h-1.5 bg-[#f4f1ea]'
                                        : 'w-1.5 h-1.5 bg-[#f4f1ea]/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Horizontal Gallery Strip */}
                {galleryItems.length > 1 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto bg-[#e8e3da]/50 border-b border-[#b6ac9f]/20 scrollbar-none w-full max-w-full">
                        {galleryItems.map((item, idx) => {
                            const isActive = activeMediaUrl === item.url
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setActiveMediaUrl(item.url)
                                        setActiveMediaType(item.type)
                                    }}
                                    className={`relative w-12 h-12 shrink-0 rounded-lg border-2 overflow-hidden transition-all ${isActive ? 'border-[#1c1c1c] scale-105 shadow-md' : 'border-transparent opacity-55'
                                        }`}
                                >
                                    {item.type === 'video' ? (
                                        <div className="relative w-full h-full bg-black/30 flex items-center justify-center">
                                            <Film size={12} className="text-white" />
                                        </div>
                                    ) : (
                                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* ── MOBILE MAIN CONTENT SHEET ── */}
                <div className="px-4 sm:px-5 pt-5 pb-6 space-y-0 text-[#1c1c1c] w-full max-w-full overflow-hidden">

                    {/* ── HERO INFO BLOCK ── */}
                    <div className="pb-5 space-y-3 w-full max-w-full">
                        {/* Category + Stock row */}
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">
                                {product.category}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${product.inStock !== false && product.stock > 0
                                    ? 'bg-[#e8e3da] text-[#1c1c1c] border-[#b6ac9f]/60'
                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                    }`}
                            >
                                <Check size={10} strokeWidth={3} />
                                {product.inStock !== false && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-[22px] font-normal leading-snug tracking-tight text-[#1c1c1c] break-words [word-break:break-word]">
                            {product.name}
                        </h1>

                        {/* Price + Tax row */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-[26px] font-bold font-mono text-[#1c1c1c] tracking-tight">
                                {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                            </span>
                            <span className="text-[10px] font-light text-[#1c1c1c]/45 uppercase tracking-wider">
                                incl. all taxes
                            </span>
                        </div>

                        {/* Low Stock Warning */}
                        {product.inStock !== false && product.stock > 0 && product.stock < 5 && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#e8e3da] border border-[#b6ac9f]/60 rounded-xl">
                                <Flame size={13} className="text-[#1c1c1c] shrink-0" />
                                <span className="text-[11px] font-medium text-[#1c1c1c]">
                                    Only <strong>{product.stock}</strong> left — order soon!
                                </span>
                            </div>
                        )}

                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="h-px bg-[#b6ac9f]/20 mb-5" />

                    {/* ── DELIVERY & TRUST CHIPS ── */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                        <div className="flex items-start gap-2 p-3 bg-[#e8e3da]/60 border border-[#b6ac9f]/25 rounded-2xl">
                            <div className="w-7 h-7 rounded-lg bg-[#f4f1ea] border border-[#b6ac9f]/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Truck size={13} className="text-[#1c1c1c]/70" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1c1c] leading-tight">Free Delivery</p>
                                <p className="text-[10px] font-light text-[#1c1c1c]/55 leading-snug mt-0.5">On orders above ₹1,500</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-[#e8e3da]/60 border border-[#b6ac9f]/25 rounded-2xl">
                            <div className="w-7 h-7 rounded-lg bg-[#f4f1ea] border border-[#b6ac9f]/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Sparkles size={13} className="text-[#1c1c1c]/70" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1c1c] leading-tight">Handcrafted</p>
                                <p className="text-[10px] font-light text-[#1c1c1c]/55 leading-snug mt-0.5">100% artisanal quality</p>
                            </div>
                        </div>
                    </div>

                    {/* ── DESCRIPTION ── */}
                    <div className="mb-5 space-y-2 w-full max-w-full overflow-hidden">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">About This Product</h3>
                        <p className="text-[13px] font-light text-[#1c1c1c]/80 leading-[1.7] whitespace-pre-line break-words [word-break:break-word] w-full max-w-full">
                            {product.description ||
                                'Handcrafted with supreme care and perfection. Designed to bring elegance, luxury, and warmth to every moment.'}
                        </p>
                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="h-px bg-[#b6ac9f]/20 mb-5" />

                    {/* ── ACCORDION: PRODUCT DETAILS ── */}
                    <div className="mb-2">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveAccordion(activeAccordion === 'details' ? '' : 'details')
                            }
                            className="w-full flex items-center justify-between py-3.5 text-left"
                        >
                            <span className="text-[12px] font-semibold text-[#1c1c1c] tracking-wide">Product Details & Care</span>
                            <span className={`text-[#1c1c1c]/50 text-lg font-light transition-transform duration-200 ${activeAccordion === 'details' ? 'rotate-45' : ''}`}>
                                +
                            </span>
                        </button>
                        {activeAccordion === 'details' && (
                            <div className="pb-3 text-[12px] font-light text-[#1c1c1c]/65 space-y-1.5">
                                <p>• Premium handcrafted products crafted with care.</p>
                                <p>• Designed for special celebrations and gifting.</p>
                                <p>• Made with love by skilled local artisans.</p>
                            </div>
                        )}
                        <div className="h-px bg-[#b6ac9f]/20" />
                    </div>

                    {/* ── ACCORDION: SHIPPING ── */}
                    <div className="mb-5">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')
                            }
                            className="w-full flex items-center justify-between py-3.5 text-left"
                        >
                            <span className="text-[12px] font-semibold text-[#1c1c1c] tracking-wide">Shipping & Delivery</span>
                            <span className={`text-[#1c1c1c]/50 text-lg font-light transition-transform duration-200 ${activeAccordion === 'shipping' ? 'rotate-45' : ''}`}>
                                +
                            </span>
                        </button>
                        {activeAccordion === 'shipping' && (
                            <div className="pb-3 text-[12px] font-light text-[#1c1c1c]/65 space-y-1.5">
                                <p>• <strong>Free Delivery</strong> on all orders above ₹1,500.</p>
                                <p>• Dispatched within 24 hours of ordering.</p>
                                <p>• Pan-India delivery in 3–5 business days.</p>
                            </div>
                        )}
                        <div className="h-px bg-[#b6ac9f]/20" />
                    </div>

                    {/* ── YOU MAY ALSO LIKE ── */}
                    {relatedProducts.length > 0 && (
                        <div className="pt-2 space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1c1c1c]/45">
                                You May Also Like
                            </h3>
                            <div className="grid grid-cols-2 gap-2.5">
                                {relatedProducts.map((rel) => {
                                    const relId = rel._id || rel.id || ''
                                    return (
                                        <div
                                            key={relId}
                                            onClick={() => navigate(`/product/${relId}`)}
                                            className="rounded-2xl overflow-hidden cursor-pointer border border-[#b6ac9f]/25 bg-[#f4f1ea] active:scale-[0.97] transition-transform shadow-sm"
                                        >
                                            <div className="relative w-full aspect-[4/5] bg-[#cec9be] overflow-hidden">
                                                {rel.image ? (
                                                    <img
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
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── MOBILE FIXED BOTTOM ACTION BAR (Always visible at bottom of screen) ── */}
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

            {/* ── DESKTOP-ONLY SHOWCASE CONTAINER (>= md) ── */}
            <div className="hidden md:block">
                {/* ── BREADCRUMB & TOP NAV BAR ── */}
                <div className="w-full border-b border-[#b6ac9f]/30 bg-[#f4f1ea]/60 backdrop-blur-sm">
                    <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-4 flex items-center justify-between text-[12px] uppercase tracking-wider text-[#1c1c1c]/60 overflow-x-auto">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Link to="/" className="hover:text-[#1c1c1c] transition-colors">
                                Home
                            </Link>
                            <ChevronRight size={12} />
                            <Link to="/products" className="hover:text-[#1c1c1c] transition-colors">
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
                            to="/products"
                            className="inline-flex items-center gap-2 text-[#1c1c1c] font-medium hover:opacity-75 transition-opacity ml-4 whitespace-nowrap"
                        >
                            <ArrowLeft size={14} /> Back to Catalog
                        </Link>
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                        {/* ── LEFT COLUMN: MEDIA GALLERY (7 COLS) ── */}
                        <div className="lg:col-span-7 space-y-4 min-w-0">
                            {/* Main Media Showcase Box */}
                            <div
                                className="relative w-full h-[450px] sm:h-[550px] md:h-[620px] bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl overflow-hidden shadow-sm group"
                                style={{ backgroundColor: product.bgColor || '#f4f1ea' }}
                            >
                                {activeMediaType === 'video' ? (
                                    <video
                                        src={activeMediaUrl}
                                        controls
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : activeMediaUrl ? (
                                    <img
                                        src={activeMediaUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 cursor-zoom-in"
                                        onClick={() => setLightboxOpen(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/40 font-light text-[13px] gap-2">
                                        <ImageIcon size={28} />
                                        <span>No Media Preview Available</span>
                                    </div>
                                )}

                                {/* Badges on top left */}
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                                    {product.isNewProduct && (
                                        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1c1c1c] bg-[#f4f1ea]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#b6ac9f]/30 shadow-sm">
                                            New
                                        </span>
                                    )}
                                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#f4f1ea] bg-[#1c1c1c]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Lightbox Trigger Button */}
                                {activeMediaType === 'image' && activeMediaUrl && (
                                    <button
                                        onClick={() => setLightboxOpen(true)}
                                        className="absolute bottom-4 right-4 p-3 bg-[#1c1c1c]/80 hover:bg-[#1c1c1c] text-[#f4f1ea] rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                                        title="View Fullscreen"
                                    >
                                        <Maximize2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Thumbnail Carousel Strip */}
                            {galleryItems.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-none">
                                    {galleryItems.map((item, idx) => {
                                        const isActive = activeMediaUrl === item.url
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setActiveMediaUrl(item.url)
                                                    setActiveMediaType(item.type)
                                                }}
                                                className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${isActive
                                                    ? 'border-[#1c1c1c] scale-105 shadow-md'
                                                    : 'border-[#b6ac9f]/30 opacity-70 hover:opacity-100 hover:border-[#1c1c1c]/50'
                                                    }`}
                                            >
                                                {item.type === 'video' ? (
                                                    <div className="relative w-full h-full bg-black/20 flex items-center justify-center">
                                                        <video
                                                            src={item.url}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                                            <Film size={20} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={item.url}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT COLUMN: DETAILS & ACTIONS (5 COLS) ── */}
                        <div className="lg:col-span-5 space-y-6 bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden">
                            {/* Header: Category & Availability */}
                            <div className="space-y-3 pb-5 border-b border-[#b6ac9f]/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c1c]/50">
                                        Artisanal Luxury
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider border ${product.inStock !== false && product.stock > 0
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

                                {/* Product Name & Price in Same Row */}
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

                                {/* Free Delivery Indicator Banner */}
                                {(() => {
                                    const rawPrice =
                                        Number(product.price.toString().replace(/[^0-9.]/g, '')) || 0
                                    return rawPrice >= 1500 ? (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e8e3da]/80 border border-[#b6ac9f]/40 rounded-lg text-[#1c1c1c] text-[12px] font-medium mt-2">
                                            <Truck size={15} className="text-[#1c1c1c]/80 shrink-0" />
                                            <span>
                                                🎉 Eligible for <strong>Free Express Delivery</strong>{' '}
                                                (Orders above ₹1,500)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e8e3da]/80 border border-[#b6ac9f]/40 rounded-lg text-[#1c1c1c]/80 text-[12px] font-medium mt-2">
                                            <Truck size={15} className="text-[#1c1c1c]/70 shrink-0" />
                                            <span>
                                                Free delivery on orders above <strong>₹1,500</strong>{' '}
                                                (Add ₹{(1500 - rawPrice).toLocaleString()} more)
                                            </span>
                                        </div>
                                    )
                                })()}
                            </div>

                            {/* Low Stock Warning Banner */}
                            {product.inStock !== false && product.stock > 0 && product.stock < 5 && (
                                <div className="flex items-center gap-2.5 p-3.5 bg-[#e8e3da] border border-[#b6ac9f]/60 rounded-xl text-[#1c1c1c] text-[13px] font-medium">
                                    <Flame size={18} className="text-[#1c1c1c] shrink-0" />
                                    <span>
                                        Hurry! Only{' '}
                                        <strong className="font-bold underline">{product.stock}</strong>{' '}
                                        left in stock — buy fast!
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <div className="space-y-2 min-w-0 max-w-full">
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c1c]/60">
                                    Description
                                </h3>
                                <p className="text-[14px] font-light text-[#1c1c1c]/80 leading-relaxed break-words whitespace-pre-wrap max-w-full overflow-hidden">
                                    {product.description ||
                                        'Handcrafted with supreme care and perfection. Designed to bring elegance, luxury, and warmth to every moment.'}
                                </p>
                            </div>

                            {/* Cart Action Controls */}
                            <div className="space-y-4 pt-4 border-t border-[#b6ac9f]/20">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {quantityInCart > 0 ? (
                                        <div className="flex-1 flex items-center justify-between bg-[#1c1c1c] text-[#f4f1ea] rounded-xl px-4 py-3 shadow-md">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(productId, quantityInCart - 1)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 text-[#f4f1ea] transition-colors cursor-pointer active:scale-95"
                                                title="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-[13px] font-medium uppercase tracking-wider text-[#f4f1ea]">
                                                {quantityInCart} in Cart
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(productId, quantityInCart + 1)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/30 text-[#f4f1ea] transition-colors cursor-pointer active:scale-95"
                                                title="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.inStock === false || product.stock <= 0}
                                            className="flex-1 py-3.5 px-6 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-medium uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer rounded-xl disabled:opacity-40"
                                        >
                                            <ShoppingBag size={16} /> Add to Cart
                                        </button>
                                    )}
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={product.inStock === false || product.stock <= 0}
                                        className="flex-1 py-3.5 px-6 bg-[#e8e3da] border border-[#1c1c1c] text-[#1c1c1c] text-[12px] font-medium uppercase tracking-widest hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl disabled:opacity-40"
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                {/* Share Button */}
                                <div className="flex items-center justify-end pt-1">
                                    <button
                                        onClick={handleShare}
                                        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors cursor-pointer"
                                    >
                                        <Share2 size={15} /> Share Product
                                    </button>
                                </div>
                            </div>

                            {/* Value Proposition Badges */}
                            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#b6ac9f]/20 text-center">
                                <div className="p-3 bg-[#e8e3da]/60 border border-[#b6ac9f]/30 rounded-xl space-y-1">
                                    <Truck size={18} className="mx-auto text-[#1c1c1c]/80" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                        Express Delivery
                                    </p>
                                </div>
                                <div className="p-3 bg-[#e8e3da]/60 border border-[#b6ac9f]/30 rounded-xl space-y-1">
                                    <ShieldCheck size={18} className="mx-auto text-[#1c1c1c]/80" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                        100% Authentic
                                    </p>
                                </div>
                                <div className="p-3 bg-[#e8e3da]/60 border border-[#b6ac9f]/30 rounded-xl space-y-1">
                                    <Sparkles size={18} className="mx-auto text-[#1c1c1c]/80" />
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                        Gift Wrap Ready
                                    </p>
                                </div>
                            </div>

                            {/* Accordion Info */}
                            <div className="space-y-2 pt-2 border-t border-[#b6ac9f]/20">
                                {/* Product Details & Care Accordion */}
                                <div className="border border-[#b6ac9f]/30 rounded-xl overflow-hidden bg-[#e8e3da]/40 transition-colors">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveAccordion(
                                                activeAccordion === 'details' ? '' : 'details'
                                            )
                                        }
                                        className="w-full p-3.5 text-left text-[12px] font-semibold uppercase tracking-wider text-[#1c1c1c] flex items-center justify-between cursor-pointer hover:bg-[#b6ac9f]/10 transition-colors"
                                    >
                                        <span>Product Details & Care</span>
                                        <span
                                            className={`inline-block transition-transform duration-300 text-sm font-bold ${activeAccordion === 'details' ? 'rotate-45 text-[#1c1c1c]' : 'rotate-0'}`}
                                        >
                                            +
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${activeAccordion === 'details'
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="p-3.5 pt-1 text-[12px] font-light text-[#1c1c1c]/70 space-y-1.5 border-t border-[#b6ac9f]/20">
                                                <p>• Premium handcrafted products crafted with care.</p>
                                                <p>
                                                    • Designed to make your festivals and special
                                                    occasions memorable.
                                                </p>
                                                <p>• Made with love by skilled local artisans.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping & Pan-India Delivery Accordion */}
                                <div className="border border-[#b6ac9f]/30 rounded-xl overflow-hidden bg-[#e8e3da]/40 transition-colors">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveAccordion(
                                                activeAccordion === 'shipping' ? '' : 'shipping'
                                            )
                                        }
                                        className="w-full p-3.5 text-left text-[12px] font-semibold uppercase tracking-wider text-[#1c1c1c] flex items-center justify-between cursor-pointer hover:bg-[#b6ac9f]/10 transition-colors"
                                    >
                                        <span>Shipping & Pan-India Delivery</span>
                                        <span
                                            className={`inline-block transition-transform duration-300 text-sm font-bold ${activeAccordion === 'shipping' ? 'rotate-45 text-[#1c1c1c]' : 'rotate-0'}`}
                                        >
                                            +
                                        </span>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${activeAccordion === 'shipping'
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="p-3.5 pt-1 text-[12px] font-light text-[#1c1c1c]/70 space-y-1.5 border-t border-[#b6ac9f]/20">
                                                <p>
                                                    • <strong>Free Delivery</strong> automatically
                                                    applied on all orders above ₹1,500.
                                                </p>
                                                <p>
                                                    • Dispatched within 24 hours with priority
                                                    processing.
                                                </p>
                                                <p>
                                                    • Fast & reliable delivery across India (3–5
                                                    business days).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RELATED PRODUCTS SECTION ── */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-20 pt-12 border-t border-[#b6ac9f]/30 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c1c]/50">
                                        Curated Atelier
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-normal text-[#1c1c1c] tracking-tight">
                                        You May Also Like
                                    </h2>
                                </div>
                                <Link
                                    to="/products"
                                    className="text-[12px] font-semibold uppercase tracking-wider text-[#1c1c1c] hover:underline"
                                >
                                    View All →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((rel) => {
                                    const relId = rel._id || rel.id || ''
                                    return (
                                        <div
                                            key={relId}
                                            onClick={() => navigate(`/product/${relId}`)}
                                            className="group bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between hover:border-[#1c1c1c]/50 transition-all shadow-xs"
                                        >
                                            <div
                                                className="relative w-full h-[260px] overflow-hidden"
                                                style={{ backgroundColor: rel.bgColor || '#cec9be' }}
                                            >
                                                {rel.image ? (
                                                    <img
                                                        src={rel.image}
                                                        alt={rel.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#1c1c1c]/40 text-xs">
                                                        No Preview
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col justify-between flex-1 gap-1">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c]/50">
                                                    {rel.category}
                                                </p>
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <h3 className="text-[14px] font-normal text-[#1c1c1c] truncate">
                                                        {rel.name}
                                                    </h3>
                                                    <span className="text-[14px] font-bold text-[#1c1c1c] font-mono shrink-0">
                                                        {rel.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── LIGHTBOX MODAL ── */}
            {lightboxOpen && activeMediaUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-modal-appear"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 transition-colors cursor-pointer z-50"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={activeMediaUrl}
                        alt={product.name}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    )
}

export default ProductDetail
