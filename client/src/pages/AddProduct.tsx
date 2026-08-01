import React, { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { API_BASE_URL } from '../config/api'
import {
    ArrowLeft,
    Upload,
    Film,
    Image as ImageIcon,
    Plus,
    X,
    Loader2,
    PackagePlus,
    ShieldAlert,
} from 'lucide-react'

const AddProduct: React.FC = () => {
    const { user, token, isLoading } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()

    // Form state
    const [prodName, setProdName] = useState('')
    const [prodCategory, setProdCategory] = useState('Hampers')
    const [prodPrice, setProdPrice] = useState('')
    const [prodStock, setProdStock] = useState(50)
    const [prodInStock, setProdInStock] = useState(true)
    const [prodBgColor] = useState('#cec9be')
    const [prodDescription, setProdDescription] = useState('')

    // Media & Thumbnail state
    const [prodThumbnail, setProdThumbnail] = useState('')
    const [prodImage, setProdImage] = useState('')
    const [prodVideo, setProdVideo] = useState('')
    const [prodMediaType, setProdMediaType] = useState<'image' | 'video'>('image')

    // Staged files for Cloudinary upload
    const [stagedThumbnailBase64, setStagedThumbnailBase64] = useState<string>('')
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
    const [stagedMediaBase64, setStagedMediaBase64] = useState<string>('')
    const [mediaPreview, setMediaPreview] = useState<string>('')
    const [stagedImagesBase64, setStagedImagesBase64] = useState<string[]>([])
    const [extraImageUrl, setExtraImageUrl] = useState<string>('')
    const [extraImageUrls, setExtraImageUrls] = useState<string[]>([])

    // Progress state
    const [savingProduct, setSavingProduct] = useState<boolean>(false)
    const [creationStep, setCreationStep] = useState<string>('')

    // Handle thumbnail selection
    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Data = reader.result as string
            setStagedThumbnailBase64(base64Data)
            setThumbnailPreview(base64Data)
            toast.info('Thumbnail file selected (will upload on submit)')
        }
        reader.readAsDataURL(file)
    }

    // Handle main media selection
    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isVideo = file.type.startsWith('video/')
        const type: 'image' | 'video' = isVideo ? 'video' : 'image'
        setProdMediaType(type)

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64Data = reader.result as string
            setStagedMediaBase64(base64Data)
            setMediaPreview(base64Data)
            toast.info(`${isVideo ? 'Video' : 'Image'} file selected (will upload on submit)`)
        }
        reader.readAsDataURL(file)
    }

    // Handle multiple gallery images
    const handleMultipleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        files.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64Data = reader.result as string
                setStagedImagesBase64((prev) => [...prev, base64Data])
            }
            reader.readAsDataURL(file)
        })
        toast.info(`${files.length} gallery image(s) selected`)
    }

    const handleAddExtraImageUrl = () => {
        const url = extraImageUrl.trim()
        if (!url) return
        setExtraImageUrls((prev) => [...prev, url])
        setExtraImageUrl('')
        toast.info('Image URL added to gallery')
    }

    const removeStagedImage = (index: number) => {
        setStagedImagesBase64((prev) => prev.filter((_, i) => i !== index))
    }

    const removeExtraImageUrl = (index: number) => {
        setExtraImageUrls((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prodName || !prodPrice) {
            toast.error('Please enter product name and price.')
            return
        }

        setSavingProduct(true)

        try {
            let finalThumbnailUrl = prodThumbnail.trim()
            let finalImageUrl = prodImage.trim()
            let finalVideoUrl = prodVideo.trim()
            const uploadedImageUrls: string[] = [...extraImageUrls.filter((u) => u.trim() !== '')]

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
                setCreationStep(`Uploading ${prodMediaType} file to Cloudinary...`)
                toast.info(`Uploading ${prodMediaType} file to Cloudinary...`)
                const res = await fetch(`${API_BASE_URL}/products/upload-media`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        media: stagedMediaBase64,
                        resourceType: prodMediaType,
                    }),
                })
                const data = await res.json()
                if (!res.ok || !data.success) {
                    throw new Error(
                        data.message || `Failed to upload ${prodMediaType} to Cloudinary`
                    )
                }

                if (prodMediaType === 'video' || data.resourceType === 'video') {
                    finalVideoUrl = data.url
                    finalImageUrl = ''
                } else {
                    finalImageUrl = data.url
                    finalVideoUrl = ''
                    if (!uploadedImageUrls.includes(data.url)) {
                        uploadedImageUrls.unshift(data.url)
                    }
                }
            } else if (finalImageUrl && !uploadedImageUrls.includes(finalImageUrl)) {
                uploadedImageUrls.unshift(finalImageUrl)
            }

            // 3. Upload Staged Gallery Images to Cloudinary
            if (stagedImagesBase64.length > 0) {
                for (let i = 0; i < stagedImagesBase64.length; i++) {
                    setCreationStep(
                        `Uploading gallery image ${i + 1} of ${stagedImagesBase64.length} to Cloudinary...`
                    )
                    const res = await fetch(`${API_BASE_URL}/products/upload-media`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            media: stagedImagesBase64[i],
                            resourceType: 'image',
                        }),
                    })
                    const data = await res.json()
                    if (res.ok && data.success && data.url) {
                        uploadedImageUrls.push(data.url)
                    }
                }
            }

            // 4. Save Product to Backend Database
            setCreationStep('Saving product to database...')
            toast.info('Saving product to database...')

            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: prodName,
                    category: prodCategory,
                    price: prodPrice,
                    stock: prodStock,
                    inStock: prodInStock,
                    thumbnail: finalThumbnailUrl || uploadedImageUrls[0] || '',
                    bgColor: prodBgColor,
                    image: finalImageUrl || finalThumbnailUrl || uploadedImageUrls[0] || '',
                    images: uploadedImageUrls,
                    video: finalVideoUrl,
                    mediaType: prodMediaType,
                    description: prodDescription,
                }),
            })

            const data = await res.json()

            if (res.ok && data.success) {
                toast.success(`Product "${prodName}" created successfully!`)
                navigate('/profile')
            } else {
                toast.error(data.message || 'Failed to create product.')
            }
        } catch (err: any) {
            console.error('Error creating product:', err)
            toast.error(err.message || 'Error connecting to server.')
        } finally {
            setSavingProduct(false)
            setCreationStep('')
        }
    }

    // Access Control Check: Admin / Owner only
    if (isLoading) {
        return (
            <div
                className="min-h-[70vh] flex items-center justify-center bg-[#f7f5f0]"
                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
            >
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#1c1c1c] animate-spin" />
                    <p className="text-[14px] text-[#1c1c1c]/70 font-light">
                        Verifying admin credentials...
                    </p>
                </div>
            </div>
        )
    }

    if (!user || !user.isOwner) {
        return <Navigate to={user ? '/profile' : '/auth'} replace />
    }

    return (
        <main
            className="w-full min-h-screen bg-[#f7f5f0] text-[#1c1c1c] pb-24 select-none font-sans"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <div className="max-w-4xl mx-auto pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Back to profile link */}
                <div>
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 text-[13px] font-medium text-[#1c1c1c]/70 hover:text-[#1c1c1c] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Profile</span>
                    </Link>
                </div>

                {/* Main Card Container */}
                <div className="bg-white border border-[#e2dbce] rounded-lg shadow-xs overflow-hidden">
                    {/* Header Bar */}
                    <div className="p-6 sm:p-8 border-b border-[#e2dbce] bg-[#faf8f5] flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-2xl font-semibold text-[#1c1c1c]">
                                    Add New Product
                                </h1>
                                <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-amber-100 text-amber-900 border border-amber-300 rounded-xs flex items-center gap-1">
                                    <PackagePlus size={12} />
                                    Admin Only
                                </span>
                            </div>
                            <p className="text-[13px] text-[#1c1c1c]/60">
                                Add a new luxury item to your Trendy Decor store inventory catalog
                            </p>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Product Name */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                Product Name <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={savingProduct}
                                value={prodName}
                                onChange={(e) => setProdName(e.target.value)}
                                placeholder="e.g. Celestial Silk Gift Basket"
                                className="w-full px-4 py-2.5 bg-[#f7f5f0] border border-[#e2dbce] rounded-md text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60 transition-colors"
                            />
                        </div>

                        {/* Product Description */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                Product Description <span className="text-rose-600">*</span>
                            </label>
                            <textarea
                                rows={4}
                                required
                                disabled={savingProduct}
                                value={prodDescription}
                                onChange={(e) => setProdDescription(e.target.value)}
                                placeholder="Handcrafted luxury description detailing materials, items included, and gifting occasions..."
                                className="w-full px-4 py-2.5 bg-[#f7f5f0] border border-[#e2dbce] rounded-md text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60 transition-colors resize-none"
                            />
                        </div>

                        {/* Category & Price (INR) Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                    Category <span className="text-rose-600">*</span>
                                </label>
                                <select
                                    disabled={savingProduct}
                                    value={prodCategory}
                                    onChange={(e) => setProdCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#f7f5f0] border border-[#e2dbce] rounded-md text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60 transition-colors cursor-pointer"
                                >
                                    <option value="Hampers">Hampers</option>
                                    <option value="Bouquets">Bouquets</option>
                                    <option value="Rakhis">Rakhis</option>
                                    <option value="Customize Chocolates">
                                        Customize Chocolates
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                    Price in INR (₹) <span className="text-rose-600">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 text-[14px] font-medium text-[#1c1c1c]/70">
                                        ₹
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        disabled={savingProduct}
                                        value={prodPrice}
                                        onChange={(e) => setProdPrice(e.target.value)}
                                        placeholder="4,999"
                                        className="w-full pl-9 pr-4 py-2.5 bg-[#f7f5f0] border border-[#e2dbce] rounded-md text-[14px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock & Availability Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                    Available Stock Units <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    disabled={savingProduct}
                                    value={prodStock}
                                    onChange={(e) => setProdStock(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-[#f7f5f0] border border-[#e2dbce] rounded-md text-[14px] text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60 transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-[#f7f5f0] border border-[#e2dbce] rounded-md h-[46px]">
                                <input
                                    type="checkbox"
                                    id="addProductInStockCheck"
                                    disabled={savingProduct}
                                    checked={prodInStock}
                                    onChange={(e) => setProdInStock(e.target.checked)}
                                    className="w-4 h-4 accent-[#1c1c1c] cursor-pointer disabled:opacity-60 rounded"
                                />
                                <label
                                    htmlFor="addProductInStockCheck"
                                    className="text-[13px] font-medium text-[#1c1c1c] cursor-pointer select-none"
                                >
                                    Available for Immediate Purchase (In Stock)
                                </label>
                            </div>
                        </div>

                        {/* Thumbnail Image Upload Card */}
                        <div className="pt-4 border-t border-[#e2dbce]">
                            <div className="space-y-3 bg-[#faf8f5] p-4 rounded-md border border-[#e2dbce]">
                                <div>
                                    <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                        Thumbnail Image
                                    </label>
                                    <p className="text-[12px] text-[#1c1c1c]/60">
                                        Small preview card image showcase
                                    </p>
                                </div>

                                <div className="border border-dashed border-[#e2dbce] bg-white p-4 rounded-md text-center space-y-3">
                                    <input
                                        type="file"
                                        id="addProdThumbnailInput"
                                        accept="image/*"
                                        onChange={handleThumbnailSelect}
                                        className="hidden"
                                        disabled={savingProduct}
                                    />
                                    <label
                                        htmlFor="addProdThumbnailInput"
                                        className={`inline-flex items-center justify-center gap-2 w-full px-3 py-2 text-[12px] font-medium rounded transition-colors cursor-pointer disabled:opacity-50 ${
                                            stagedThumbnailBase64
                                                ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                                                : 'bg-[#1c1c1c] text-[#f4f1ea] hover:bg-black'
                                        }`}
                                    >
                                        <Upload size={14} />
                                        {stagedThumbnailBase64
                                            ? 'Thumbnail Selected'
                                            : 'Upload Thumbnail'}
                                    </label>

                                    {thumbnailPreview || prodThumbnail ? (
                                        <div className="relative mt-2 max-h-32 overflow-hidden rounded border border-[#e2dbce] mx-auto max-w-[180px]">
                                            <img
                                                src={thumbnailPreview || prodThumbnail}
                                                alt="Thumbnail preview"
                                                className="w-full h-28 object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-[12px] text-[#1c1c1c]/50">
                                            No thumbnail selected
                                        </p>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={prodThumbnail}
                                    disabled={savingProduct}
                                    onChange={(e) => {
                                        setProdThumbnail(e.target.value)
                                        if (e.target.value) {
                                            setStagedThumbnailBase64('')
                                            setThumbnailPreview('')
                                        }
                                    }}
                                    placeholder="Or paste direct image URL..."
                                    className="w-full px-3 py-2 bg-white border border-[#e2dbce] rounded-md text-[13px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Multiple Gallery Images */}
                        <div className="space-y-3 bg-[#faf8f5] p-4 rounded-md border border-[#e2dbce]">
                            <div>
                                <label className="text-[13px] font-medium text-[#1c1c1c] block">
                                    Additional Gallery Images (Multiple Images)
                                </label>
                                <p className="text-[12px] text-[#1c1c1c]/60">
                                    Upload multiple extra product images to showcase different
                                    angles or details.
                                </p>
                            </div>

                            <div className="border border-dashed border-[#e2dbce] bg-white p-4 rounded-md space-y-3">
                                <input
                                    type="file"
                                    id="addProdMultipleImagesInput"
                                    accept="image/*"
                                    multiple
                                    onChange={handleMultipleImagesSelect}
                                    className="hidden"
                                    disabled={savingProduct}
                                />
                                <label
                                    htmlFor="addProdMultipleImagesInput"
                                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-medium rounded hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <Plus size={14} />
                                    Upload Multiple Gallery Images
                                </label>

                                {(stagedImagesBase64.length > 0 || extraImageUrls.length > 0) && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                                        {stagedImagesBase64.map((src, idx) => (
                                            <div
                                                key={`staged-${idx}`}
                                                className="relative group max-h-24 overflow-hidden rounded border border-[#e2dbce] bg-black/5"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Staged ${idx + 1}`}
                                                    className="w-full h-20 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeStagedImage(idx)}
                                                    disabled={savingProduct}
                                                    className="absolute top-1 right-1 p-1 bg-rose-700/80 text-white rounded-full hover:bg-rose-800 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {extraImageUrls.map((url, idx) => (
                                            <div
                                                key={`url-${idx}`}
                                                className="relative group max-h-24 overflow-hidden rounded border border-[#e2dbce] bg-black/5"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`URL ${idx + 1}`}
                                                    className="w-full h-20 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExtraImageUrl(idx)}
                                                    disabled={savingProduct}
                                                    className="absolute top-1 right-1 p-1 bg-rose-700/80 text-white rounded-full hover:bg-rose-800 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={extraImageUrl}
                                    disabled={savingProduct}
                                    onChange={(e) => setExtraImageUrl(e.target.value)}
                                    placeholder="Or paste additional image URL..."
                                    className="flex-1 px-3 py-2 bg-white border border-[#e2dbce] rounded-md text-[13px] text-[#1c1c1c] placeholder:text-[#1c1c1c]/40 focus:outline-none focus:border-[#1c1c1c] disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddExtraImageUrl}
                                    disabled={savingProduct || !extraImageUrl.trim()}
                                    className="px-4 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-medium rounded hover:bg-black transition-colors cursor-pointer disabled:opacity-40"
                                >
                                    Add URL
                                </button>
                            </div>
                        </div>

                        {/* Submit Action Bar */}
                        <div className="pt-6 border-t border-[#e2dbce] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-[13px] text-[#1c1c1c]/70">
                                {creationStep && (
                                    <span className="flex items-center gap-2 text-amber-900 font-medium">
                                        <Loader2 size={15} className="animate-spin" />
                                        {creationStep}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <Link
                                    to="/profile"
                                    className="px-5 py-2.5 border border-[#e2dbce] rounded-md text-[#1c1c1c] text-[13px] font-medium hover:bg-[#faf8f5] transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={savingProduct}
                                    className="px-6 py-2.5 bg-[#1c1c1c] text-[#f4f1ea] rounded-md text-[13px] font-medium hover:bg-black transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 min-w-[170px] justify-center shadow-xs"
                                >
                                    {savingProduct ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Creating Item...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            <span>Add to Catalog</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default AddProduct
