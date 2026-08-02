import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { API_BASE_URL } from '../config/api'
import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    X,
    Trash2,
    Loader2,
    Star,
    Sparkles,
} from 'lucide-react'

const CATEGORIES = ['Hampers', 'Bouquets', 'Rakhis', 'Customize Chocolates']

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user, token, isLoading: authLoading } = useAuth()
    const { toast } = useToast()

    const [loadingProduct, setLoadingProduct] = useState<boolean>(true)
    const [savingProduct, setSavingProduct] = useState<boolean>(false)

    const [name, setName] = useState<string>('')
    const [category, setCategory] = useState<string>('Hampers')
    const [price, setPrice] = useState<string>('')
    const [stock, setStock] = useState<number>(10)
    const [inStock, setInStock] = useState<boolean>(true)
    const [description, setDescription] = useState<string>('')

    const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
    const [stagedThumbnailBase64, setStagedThumbnailBase64] = useState<string>('')
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

    const [existingImages, setExistingImages] = useState<string[]>([])
    const [videoUrl, setVideoUrl] = useState<string>('')
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image')

    const [stagedNewImages, setStagedNewImages] = useState<
        Array<{ base64: string; preview: string; name: string }>
    >([])

    useEffect(() => {
        if (!id) return
        setLoadingProduct(true)

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/${id}`)
                const data = await res.json()
                if (res.ok && data.success && data.product) {
                    const p = data.product
                    setName(p.name || '')
                    setCategory(p.category || 'Hampers')
                    setPrice((p.price || '').replace('₹', ''))
                    setStock(p.stock !== undefined ? p.stock : 10)
                    setInStock(p.inStock !== false)
                    setDescription(p.description || '')
                    setVideoUrl(p.video || '')
                    setMediaType(p.mediaType || 'image')
                    setThumbnailUrl(p.thumbnail || '')

                    const imgList: string[] = []
                    if (p.image && !imgList.includes(p.image)) {
                        imgList.push(p.image)
                    }
                    if (Array.isArray(p.images)) {
                        p.images.forEach((img: string) => {
                            if (img && !imgList.includes(img)) {
                                imgList.push(img)
                            }
                        })
                    }
                    setExistingImages(imgList)
                } else {
                    toast.error('Product not found.')
                }
            } catch (err) {
                toast.error('Failed to fetch product details.')
            } finally {
                setLoadingProduct(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Data = reader.result as string
            setStagedThumbnailBase64(base64Data)
            setThumbnailPreview(base64Data)
            toast.info('New thumbnail image staged. Save changes to update.')
        }
        reader.readAsDataURL(file)
    }


    const handleRemoveThumbnail = () => {
        setStagedThumbnailBase64('')
        setThumbnailPreview('')
        setThumbnailUrl('')
        toast.info('Thumbnail reset to default showcase image.')
    }

    const handleRemoveExistingImage = (indexToRemove: number) => {
        setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
        toast.info('Image removed from product gallery.')
    }

    const handleSetPrimaryImage = (indexToPrimary: number) => {
        setExistingImages((prev) => {
            const selected = prev[indexToPrimary]
            const remaining = prev.filter((_, idx) => idx !== indexToPrimary)
            return [selected, ...remaining]
        })
        toast.success('Set as primary showcase image!')
    }

    const handleSelectNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64Data = reader.result as string
                setStagedNewImages((prev) => [
                    ...prev,
                    { base64: base64Data, preview: base64Data, name: file.name },
                ])
            }
            reader.readAsDataURL(file)
        })
        toast.info(`${files.length} new media file(s) staged for gallery`)
    }

    const handleRemoveStagedImage = (indexToRemove: number) => {
        setStagedNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return
        if (!name.trim() || !price.trim()) {
            toast.error('Please fill in product name and price.')
            return
        }

        setSavingProduct(true)
        const activeToken = token || localStorage.getItem('trendy_auth_token')

        try {
            let finalThumbnailUrl = thumbnailUrl

            if (stagedThumbnailBase64) {
                toast.info('Uploading new thumbnail image...')
                const uploadRes = await fetch(`${API_BASE_URL}/products/upload-media`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${activeToken}`,
                    },
                    body: JSON.stringify({
                        file: stagedThumbnailBase64,
                        media: stagedThumbnailBase64,
                        resourceType: 'image',
                    }),
                })
                const uploadData = await uploadRes.json()
                if (uploadRes.ok && uploadData.success && (uploadData.mediaUrl || uploadData.url)) {
                    finalThumbnailUrl = uploadData.mediaUrl || uploadData.url
                }
            }

            const newlyUploadedUrls: string[] = []
            for (let i = 0; i < stagedNewImages.length; i++) {
                const item = stagedNewImages[i]
                toast.info(`Uploading gallery image ${i + 1} of ${stagedNewImages.length}...`)
                const uploadRes = await fetch(`${API_BASE_URL}/products/upload-media`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${activeToken}`,
                    },
                    body: JSON.stringify({
                        file: item.base64,
                        media: item.base64,
                        resourceType: 'image',
                    }),
                })
                const uploadData = await uploadRes.json()
                if (uploadRes.ok && uploadData.success && (uploadData.mediaUrl || uploadData.url)) {
                    newlyUploadedUrls.push(uploadData.mediaUrl || uploadData.url)
                }
            }

            const finalImagesList = [...existingImages, ...newlyUploadedUrls]
            const primaryImage = finalImagesList.length > 0 ? finalImagesList[0] : ''

            if (!finalThumbnailUrl) {
                finalThumbnailUrl = primaryImage
            }

            const updatePayload = {
                name: name.trim(),
                category,
                price: price.startsWith('₹') ? price.trim() : `₹${price.trim()}`,
                stock: Number(stock),
                inStock: Boolean(inStock) && Number(stock) > 0,
                description: description.trim(),
                image: primaryImage,
                images: finalImagesList,
                thumbnail: finalThumbnailUrl,
                video: videoUrl.trim(),
                mediaType,
            }

            const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify(updatePayload),
            })

            const data = await res.json()
            if (res.ok && data.success) {
                toast.success(`Updated "${name}" successfully!`)
                navigate('/inventory')
            } else {
                toast.error(data.message || 'Failed to update product.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Error saving product updates.')
        } finally {
            setSavingProduct(false)
        }
    }

    if (authLoading || loadingProduct) {
        return (
            <div className="min-h-screen bg-[#e8e3da] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="animate-spin text-[#1c1c1c] mx-auto" size={36} />
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#1c1c1c]/70">
                        Loading Product Editor...
                    </p>
                </div>
            </div>
        )
    }

    if (!user || !user.isOwner) {
        return <Navigate to={user ? '/profile' : '/auth'} replace />
    }

    const activeDisplayThumbnail =
        thumbnailPreview || thumbnailUrl || (existingImages.length > 0 ? existingImages[0] : '')

    return (
        <main
            className="w-full min-h-screen bg-[#e8e3da] py-10 md:py-16 select-none animate-smooth-appear"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <div className="max-w-[1600px] mx-auto px-8 md:px-12 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#b6ac9f]/40 pb-6">
                    <div>
                        <Link
                            to="/inventory"
                            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors mb-2"
                        >
                            <ArrowLeft size={16} /> Back to Inventory Catalog
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-normal text-[#1c1c1c] tracking-tight uppercase">
                            Edit Product: <span className="font-semibold">{name || 'Item'}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/inventory')}
                            className="px-6 py-3 border border-[#b6ac9f]/60 rounded-none text-[12px] font-semibold uppercase tracking-widest text-[#1c1c1c] hover:bg-[#f4f1ea] transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={savingProduct}
                            className="px-8 py-3.5 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-semibold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer rounded-none border border-[#1c1c1c] disabled:opacity-50"
                        >
                            {savingProduct ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Saving Changes...
                                </>
                            ) : (
                                'Save Product Changes'
                            )}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 space-y-6 bg-[#f4f1ea] border border-[#b6ac9f]/40 p-6 md:p-8 rounded-none">
                            <div className="space-y-4 pb-6 border-b border-[#b6ac9f]/40">
                                <div>
                                    <h2 className="text-lg font-normal text-[#1c1c1c] uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles size={18} className="text-[#1c1c1c]" /> Catalog
                                        Card Thumbnail Image
                                    </h2>
                                    <p className="text-[12px] text-[#1c1c1c]/60 font-light mt-1">
                                        This image is displayed on the product catalog grid and
                                        quick-view cards.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <div className="w-32 h-40 bg-[#e8e3da] border-2 border-[#1c1c1c] rounded-none overflow-hidden relative shadow-sm shrink-0">
                                        {activeDisplayThumbnail ? (
                                            <img
                                                src={activeDisplayThumbnail}
                                                alt="Catalog Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#1c1c1c]/40 gap-1">
                                                <ImageIcon size={24} />
                                                <span className="text-[10px] uppercase font-mono">
                                                    No Image
                                                </span>
                                            </div>
                                        )}
                                        <span className="absolute top-2 left-2 bg-[#1c1c1c] text-[#f4f1ea] text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-none font-mono">
                                            Thumbnail
                                        </span>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <label className="px-5 py-3 bg-[#1c1c1c] text-[#f4f1ea] hover:bg-black text-[12px] font-semibold uppercase tracking-widest rounded-none border border-[#1c1c1c] transition-all inline-flex items-center gap-2 cursor-pointer">
                                            <Upload size={14} /> Update Thumbnail Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailSelect}
                                                className="hidden"
                                            />
                                        </label>

                                        {(thumbnailPreview || thumbnailUrl) && (
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveThumbnail}
                                                    className="px-4 py-2 border border-rose-800 text-rose-900 hover:bg-rose-900 hover:text-white text-[11px] font-semibold uppercase tracking-wider rounded-none transition-colors cursor-pointer"
                                                >
                                                    Remove Custom Thumbnail
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-[11px] font-light text-[#1c1c1c]/60">
                                            Recommended: Square or 4:5 ratio image (JPG, PNG, WEBP)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 font-mono">
                                    Active Gallery Showcase Photos ({existingImages.length})
                                </label>

                                {existingImages.length === 0 ? (
                                    <div className="p-8 border border-dashed border-[#b6ac9f]/60 rounded-none text-center bg-[#e8e3da]/40 text-[#1c1c1c]/50 text-xs uppercase tracking-wider">
                                        No active showcase images in gallery. Upload new photos
                                        below.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {existingImages.map((imgUrl, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative w-full h-36 bg-[#e8e3da] border-2 rounded-none overflow-hidden group shadow-sm transition-all ${idx === 0
                                                    ? 'border-[#1c1c1c]'
                                                    : 'border-[#b6ac9f]/40 hover:border-[#1c1c1c]/60'
                                                    }`}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`Product gallery ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Badges */}
                                                {idx === 0 && (
                                                    <span className="absolute top-2 left-2 bg-[#1c1c1c] text-[#f4f1ea] text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-none font-mono">
                                                        Main Image
                                                    </span>
                                                )}

                                                {/* Action Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                                    {idx !== 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSetPrimaryImage(idx)
                                                            }
                                                            className="p-2 bg-white/90 hover:bg-white text-[#1c1c1c] rounded-none text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                                                            title="Set as Main Image"
                                                        >
                                                            <Star
                                                                size={14}
                                                                className="fill-amber-400 text-amber-500"
                                                            />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveExistingImage(idx)
                                                        }
                                                        className="p-2 bg-rose-700 hover:bg-rose-900 text-white rounded-none transition-colors cursor-pointer"
                                                        title="Delete image"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Staged New Images Preview Cards */}
                            {stagedNewImages.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-[#b6ac9f]/30">
                                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 font-mono">
                                        Newly Staged Gallery Photos ({stagedNewImages.length})
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {stagedNewImages.map((staged, idx) => (
                                            <div
                                                key={idx}
                                                className="relative w-full h-36 bg-[#e8e3da] border-2 border-emerald-600 rounded-none overflow-hidden group shadow-sm"
                                            >
                                                <img
                                                    src={staged.preview}
                                                    alt={`Staged ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute top-2 left-2 bg-emerald-800 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-none font-mono">
                                                    Staged
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStagedImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-black text-white rounded-none transition-colors cursor-pointer"
                                                    title="Remove staged image"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload New Gallery Media Card Area */}
                            <div className="pt-4 border-t border-[#b6ac9f]/30">
                                <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-2 font-mono">
                                    Add More Gallery Photos / Video
                                </label>
                                <label className="w-full border-2 border-dashed border-[#b6ac9f]/60 hover:border-[#1c1c1c] bg-[#e8e3da]/40 hover:bg-[#e8e3da]/80 p-8 rounded-none flex flex-col items-center justify-center gap-3 transition-all cursor-pointer">
                                    <Upload size={28} className="text-[#1c1c1c]/60" />
                                    <div className="text-center">
                                        <p className="text-[13px] font-semibold uppercase tracking-wider text-[#1c1c1c]">
                                            Click to Upload Additional Photos or Video
                                        </p>
                                        <p className="text-[11px] font-light text-[#1c1c1c]/60 mt-1">
                                            Select one or multiple image/video files from your
                                            device
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleSelectNewFiles}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: PRODUCT FORM DETAILS (5 COLS) ── */}
                        <div className="lg:col-span-5 space-y-6 bg-[#f4f1ea] border border-[#b6ac9f]/40 p-6 md:p-8 rounded-none">
                            <h2 className="text-lg font-normal text-[#1c1c1c] uppercase tracking-wider border-b border-[#b6ac9f]/30 pb-3">
                                Product Specifications
                            </h2>

                            {/* Product Name */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-1.5 font-mono">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#e8e3da]/80 border border-[#b6ac9f]/50 rounded-none text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors text-[13px]"
                                />
                            </div>

                            {/* Category & Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-1.5 font-mono">
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#e8e3da]/80 border border-[#b6ac9f]/50 rounded-none text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors text-[13px]"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-1.5 font-mono">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="1499"
                                        className="w-full px-4 py-3 bg-[#e8e3da]/80 border border-[#b6ac9f]/50 rounded-none text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors font-mono text-[13px]"
                                    />
                                </div>
                            </div>

                            {/* Stock Quantity & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-1.5 font-mono">
                                        Stock Count *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-[#e8e3da]/80 border border-[#b6ac9f]/50 rounded-none text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors font-mono text-[13px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-1.5 font-mono">
                                        Availability
                                    </label>
                                    <label className="flex items-center gap-3 pt-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={inStock}
                                            onChange={(e) => setInStock(e.target.checked)}
                                            className="w-4 h-4 accent-[#1c1c1c] rounded-none"
                                        />
                                        <span className="text-[13px] font-medium text-[#1c1c1c]">
                                            Available in Stock
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/80 mb-1.5 font-mono">
                                    Description & Details
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter artisanal details, care instructions, and product highlight features..."
                                    className="w-full px-4 py-3 bg-[#e8e3da]/80 border border-[#b6ac9f]/50 rounded-none text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors text-[13px] leading-relaxed"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-[#b6ac9f]/40 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/inventory')}
                                    className="px-6 py-3 border border-[#b6ac9f]/60 rounded-none text-[12px] font-semibold uppercase tracking-widest text-[#1c1c1c] hover:bg-[#e8e3da] transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingProduct}
                                    className="px-8 py-3 bg-[#1c1c1c] text-[#f4f1ea] rounded-none text-[12px] font-semibold uppercase tracking-widest hover:bg-black transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 border border-[#1c1c1c]"
                                >
                                    {savingProduct ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default EditProduct
