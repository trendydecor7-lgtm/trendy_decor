import React, { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import {
    Package,
    Plus,
    Minus,
    Edit3,
    Trash2,
    Search,
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Loader2,
    SlidersHorizontal,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { type ProductItem } from '../context/CartContext'
import { API_BASE_URL } from '../config/api'

const CATEGORIES = ['All', 'Hampers', 'Bouquets', 'Rakhis', 'Customize Chocolates']

const Inventory: React.FC = () => {
    const navigate = useNavigate()
    const { user, token, isLoading: authLoading } = useAuth()
    const { toast } = useToast()

    const [products, setProducts] = useState<ProductItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('All')

    // Fetch Inventory Products from API
    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}/products`)
            const data = await res.json()
            if (data.success && Array.isArray(data.products)) {
                setProducts(data.products)
            }
        } catch (err) {
            toast.error('Failed to load inventory products.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Filter products by search & category
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Quick Update Stock Count
    const handleQuickStockChange = async (p: ProductItem, newStock: number) => {
        const targetStock = Math.max(0, newStock)
        const productId = p._id || p.id
        const activeToken = token || localStorage.getItem('trendy_auth_token')

        // Optimistic local update
        setProducts((prev) =>
            prev.map((prod) => {
                if ((prod._id || prod.id) === productId) {
                    return { ...prod, stock: targetStock, inStock: targetStock > 0 }
                }
                return prod
            })
        )

        try {
            await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify({
                    stock: targetStock,
                    inStock: targetStock > 0,
                }),
            })
        } catch (err) {
            toast.error('Failed to sync stock count with server.')
            fetchProducts()
        }
    }

    // Quick Toggle In Stock Status
    const handleToggleInStock = async (p: ProductItem) => {
        const newInStock = !p.inStock
        const productId = p._id || p.id
        const activeToken = token || localStorage.getItem('trendy_auth_token')

        setProducts((prev) =>
            prev.map((prod) => {
                if ((prod._id || prod.id) === productId) {
                    return { ...prod, inStock: newInStock }
                }
                return prod
            })
        )

        try {
            await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${activeToken}`,
                },
                body: JSON.stringify({ inStock: newInStock }),
            })
            toast.info(`Updated stock status for ${p.name}`)
        } catch (err) {
            toast.error('Failed to update stock status.')
            fetchProducts()
        }
    }

    // Delete Product
    const handleDeleteProduct = async (p: ProductItem) => {
        if (!window.confirm(`Are you sure you want to delete "${p.name}"?`)) return

        const productId = p._id || p.id
        const activeToken = token || localStorage.getItem('trendy_auth_token')

        try {
            const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${activeToken}`,
                },
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toast.info(`Deleted "${p.name}" from catalog.`)
                fetchProducts()
            } else {
                toast.error(data.message || 'Failed to delete product.')
            }
        } catch (err) {
            toast.error('Error deleting product.')
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#e8e3da] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#1c1c1c]/60" size={32} />
            </div>
        )
    }

    if (!user || !user.isOwner) {
        return <Navigate to={user ? '/profile' : '/auth'} replace />
    }

    return (
        <main
            className="w-full min-h-screen bg-[#e8e3da] py-10 md:py-16 select-none animate-smooth-appear"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            {/* Exactly aligned with Navbar (max-w-[1600px] px-8 md:px-12) */}
            <div className="max-w-[1600px] mx-auto px-8 md:px-12 space-y-8">
                {/* ── HEADER & BREADCRUMB ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#b6ac9f]/40 pb-8">
                    <div>
                        <Link
                            to="/profile"
                            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors mb-3"
                        >
                            <ArrowLeft size={16} /> Back to Profile
                        </Link>
                        <div className="flex items-center gap-4 flex-wrap">
                            <h1 className="text-3xl md:text-4xl font-normal text-[#1c1c1c] tracking-tight uppercase">
                                Inventory & Stock Control
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/add-product"
                            className="px-6 py-3.5 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-semibold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2.5 cursor-pointer rounded-none border border-[#1c1c1c] shadow-none"
                        >
                            <Plus size={16} /> Add New Product
                        </Link>
                    </div>
                </div>

                {/* ── SEARCH & CATEGORY FILTER BAR ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#f4f1ea] p-5 border border-[#b6ac9f]/40 rounded-none shadow-xs">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1c1c1c]/50"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY PRODUCT NAME OR CATEGORY..."
                            className="w-full pl-10 pr-4 py-3 bg-[#e8e3da]/80 border border-[#b6ac9f]/50 rounded-none text-[12px] uppercase tracking-wider text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] transition-colors placeholder:text-[#1c1c1c]/40 font-mono"
                        />
                    </div>

                    {/* Category Filter Pills (Sharp Rectangles) */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                        <SlidersHorizontal size={14} className="text-[#1c1c1c]/60 shrink-0 mr-1" />
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest rounded-none transition-all cursor-pointer shrink-0 border ${
                                    selectedCategory === cat
                                        ? 'bg-[#1c1c1c] text-[#f4f1ea] border-[#1c1c1c]'
                                        : 'bg-[#e8e3da]/70 text-[#1c1c1c]/70 hover:text-[#1c1c1c] hover:bg-[#e8e3da] border-[#b6ac9f]/40'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── PRODUCTS INVENTORY TABLE ── */}
                {loading ? (
                    <div className="py-28 text-center space-y-4 bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-none">
                        <Loader2 className="animate-spin mx-auto text-[#1c1c1c]/60" size={32} />
                        <p className="text-[12px] font-semibold uppercase tracking-widest text-[#1c1c1c]/70">
                            Loading inventory catalog...
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-24 bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-none text-center space-y-4">
                        <Package
                            size={40}
                            className="mx-auto text-[#1c1c1c]/30"
                            strokeWidth={1.5}
                        />
                        <div className="space-y-1">
                            <p className="text-xl font-normal uppercase tracking-widest text-[#1c1c1c]">
                                No matching inventory items
                            </p>
                            <p className="text-[13px] font-light text-[#1c1c1c]/60">
                                Try adjusting your search query or category selection.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-none overflow-hidden shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-[13px]">
                                <thead>
                                    <tr className="border-b border-[#b6ac9f]/40 bg-[#e8e3da]/80 text-[11px] font-semibold uppercase tracking-widest text-[#1c1c1c] font-mono">
                                        <th className="py-4.5 px-6">Product</th>
                                        <th className="py-4.5 px-6">Category</th>
                                        <th className="py-4.5 px-6">Price</th>
                                        <th className="py-4.5 px-6 text-center">Stock Count</th>
                                        <th className="py-4.5 px-6 text-center">Status</th>
                                        <th className="py-4.5 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#b6ac9f]/30 bg-[#f4f1ea]">
                                    {filteredProducts.map((p) => {
                                        const prodId = p._id || p.id
                                        const currentStock = p.stock !== undefined ? p.stock : 10
                                        const isAvailable = p.inStock !== false && currentStock > 0

                                        return (
                                            <tr
                                                key={prodId}
                                                className="hover:bg-[#e8e3da]/50 transition-colors group"
                                            >
                                                {/* Product Info & Sharp Square Thumbnail */}
                                                <td className="py-4.5 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-14 bg-[#e8e3da] rounded-none overflow-hidden shrink-0 border border-[#b6ac9f]/40">
                                                            {p.image ? (
                                                                <img
                                                                    src={p.image}
                                                                    alt={p.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[#1c1c1c]/30">
                                                                    <ImageIcon size={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-normal text-[#1c1c1c] text-[14px] leading-tight">
                                                                {p.name}
                                                            </p>
                                                            <p className="text-[11px] font-light text-[#1c1c1c]/60 truncate max-w-xs mt-0.5">
                                                                {p.description ||
                                                                    'No description provided.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Sharp Theme Category Tag */}
                                                <td className="py-4.5 px-6">
                                                    <span className="px-3 py-1 bg-[#e8e3da]/80 border border-[#b6ac9f]/40 rounded-none text-[10px] font-semibold uppercase tracking-widest text-[#1c1c1c] font-mono">
                                                        {p.category}
                                                    </span>
                                                </td>

                                                {/* Price */}
                                                <td className="py-4.5 px-6 font-bold font-mono text-[#1c1c1c] text-[14px]">
                                                    {p.price.startsWith('₹')
                                                        ? p.price
                                                        : `₹${p.price}`}
                                                </td>

                                                {/* Sharp Stock Stepper */}
                                                <td className="py-4.5 px-6 text-center">
                                                    <div className="inline-flex items-center border border-[#b6ac9f]/50 rounded-none bg-[#e8e3da]/80 overflow-hidden">
                                                        <button
                                                            onClick={() =>
                                                                handleQuickStockChange(
                                                                    p,
                                                                    currentStock - 1
                                                                )
                                                            }
                                                            className="p-2 text-[#1c1c1c]/80 hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-colors cursor-pointer"
                                                            title="Decrease stock"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-10 text-center font-bold font-mono text-[#1c1c1c] text-[13px]">
                                                            {currentStock}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleQuickStockChange(
                                                                    p,
                                                                    currentStock + 1
                                                                )
                                                            }
                                                            className="p-2 text-[#1c1c1c]/80 hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-colors cursor-pointer"
                                                            title="Increase stock"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Sharp Status Badge */}
                                                <td className="py-4.5 px-6 text-center">
                                                    <button
                                                        onClick={() => handleToggleInStock(p)}
                                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-none text-[10px] font-semibold uppercase tracking-widest cursor-pointer transition-all border ${
                                                            isAvailable
                                                                ? 'bg-[#1c1c1c] text-[#f4f1ea] border-[#1c1c1c]'
                                                                : 'bg-[#e8e3da] text-[#1c1c1c]/60 border-[#b6ac9f]/50'
                                                        }`}
                                                    >
                                                        <Check size={12} />
                                                        {isAvailable ? 'In Stock' : 'Out of Stock'}
                                                    </button>
                                                </td>

                                                {/* Sharp Action Buttons */}
                                                <td className="py-4.5 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/edit-product/${prodId}`)
                                                            }
                                                            className="p-2.5 bg-[#e8e3da]/80 hover:bg-[#1c1c1c] hover:text-[#f4f1ea] border border-[#b6ac9f]/40 rounded-none transition-all cursor-pointer text-[#1c1c1c]"
                                                            title="Edit Product Page"
                                                        >
                                                            <Edit3 size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p)}
                                                            className="p-2.5 bg-[#e8e3da]/80 hover:bg-[#1c1c1c] hover:text-[#f4f1ea] border border-[#b6ac9f]/40 rounded-none transition-all cursor-pointer text-[#1c1c1c]"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Inventory
