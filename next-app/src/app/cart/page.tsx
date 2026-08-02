'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SEO from '@/components/common/SEO'
import {
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ShoppingBag,
    ShieldCheck,
    Truck,
    MapPin,
    X,
} from 'lucide-react'
import { useCart, parseNumericPrice } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalCount } = useCart()
    const { toast } = useToast()
    const { user, addAddress } = useAuth()
    const router = useRouter()

    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false)
    const [isSavingAddress, setIsSavingAddress] = useState<boolean>(false)

    const [newAddrLabel, setNewAddrLabel] = useState('Home')
    const [newAddrStreet, setNewAddrStreet] = useState('')
    const [newAddrCity, setNewAddrCity] = useState('')
    const [newAddrState, setNewAddrState] = useState('')
    const [newAddrZip, setNewAddrZip] = useState('')
    const [newAddrPhone, setNewAddrPhone] = useState('')

    useEffect(() => {
        if (user?.addresses && user.addresses.length > 0) {
            const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0]
            const addrId = defaultAddr._id || defaultAddr.id || defaultAddr.street
            setSelectedAddressId(addrId)
        }
    }, [user])

    const shippingFee = subtotal >= 1500 || cartItems.length === 0 ? 0 : 150
    const finalTotal = Math.max(0, subtotal + shippingFee)

    const getProductId = (product: any): string => {
        return (product._id || product.id || product.name).toString()
    }

    const handleOpenAddAddress = () => {
        if (user?.addresses && user.addresses.length >= 3) {
            toast.error('Maximum limit reached. You can only save up to 3 addresses.')
            return
        }
        setIsAddAddressOpen(true)
    }

    const handleAddAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (user?.addresses && user.addresses.length >= 3) {
            toast.error('Maximum limit reached. You can only save up to 3 addresses.')
            setIsAddAddressOpen(false)
            return
        }
        if (!newAddrStreet || !newAddrCity || !newAddrState || !newAddrZip || !newAddrPhone) {
            toast.error('Please fill in all required address fields.')
            return
        }

        setIsSavingAddress(true)
        try {
            const success = await addAddress({
                label: newAddrLabel || 'Home',
                street: newAddrStreet,
                city: newAddrCity,
                state: newAddrState,
                zip: newAddrZip,
                country: 'India',
                phone: newAddrPhone,
                isDefault: !user?.addresses || user.addresses.length === 0,
            })

            if (success) {
                toast.success('New delivery address saved!')
                setIsAddAddressOpen(false)
                setNewAddrStreet('')
                setNewAddrCity('')
                setNewAddrState('')
                setNewAddrZip('')
                setNewAddrPhone('')
            } else {
                toast.error('Failed to save address. Please try again.')
            }
        } catch (err) {
            toast.error('Error saving address.')
        } finally {
            setIsSavingAddress(false)
        }
    }

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty.')
            return
        }
        if (!user) {
            toast.info('Please sign in to complete your checkout.')
            router.push('/auth')
            return
        }

        const selectedAddress =
            user.addresses?.find((a) => (a._id || a.id || a.street) === selectedAddressId) ||
            user.addresses?.[0]

        if (!selectedAddress && !user.address?.street) {
            toast.error('Please select or add a delivery address to proceed.')
            setIsAddAddressOpen(true)
            return
        }

        let message = `*NEW ORDER - TRENDY DECOR*\n\n`

        message += `*Customer Details:*\n`
        message += `• Name: ${user.name || user.email || 'Customer'}\n`
        message += `• Email: ${user.email || 'N/A'}\n`
        if (selectedAddress?.phone || user.phone) {
            message += `• Contact Phone: ${selectedAddress?.phone || user.phone}\n`
        }
        message += `\n`

        if (selectedAddress) {
            message += `*Delivery Address (${selectedAddress.label || 'Home'}):*\n`
            message += `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zip}\n`
            message += `Phone: ${selectedAddress.phone}\n\n`
        } else if (user.address?.street) {
            message += `*Delivery Address:*\n`
            message += `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.zip}\n\n`
        }

        message += `*Order Items (${totalCount} ${totalCount === 1 ? 'item' : 'items'}):*\n`
        cartItems.forEach((item, index) => {
            const numericPrice = parseNumericPrice(item.product.price)
            const itemTotal = numericPrice * item.quantity
            const prodId = item.product._id || item.product.id
            const prodUrl = prodId ? `${window.location.origin}/product/${prodId}` : ''

            message += `${index + 1}. *${item.product.name}*\n`
            message += `   Qty: ${item.quantity} × ${item.product.price} = ₹${itemTotal.toLocaleString('en-IN')}\n`
            if (prodUrl) {
                message += `   Link: ${prodUrl}\n`
            }
        })

        message += `\n*Total Amount:* ₹${finalTotal.toLocaleString('en-IN')}\n`
        message += `*Shipping Fee:* ${shippingFee === 0 ? 'FREE (Above ₹1,500)' : `₹${shippingFee}`}\n\n`
        message += `Please confirm my order. Thank you!`

        const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.VITE_WHATSAPP_NUMBER || '919463694623'
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`

        toast.success('Redirecting to WhatsApp to place your order...')
        window.open(whatsappUrl, '_blank')
        clearCart()
    }

    return (
        <main
            className="w-full min-h-screen bg-[#e8e3da] py-12 md:py-16 px-6 md:px-12 select-none"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <SEO
                title="Your Shopping Bag | Secure Checkout"
                description="Review your curated home decor items in your shopping bag and proceed to order."
            />
            <div className="max-w-[1600px] mx-auto px-2 md:px-6 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b6ac9f]/40 pb-6">
                    <div>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-wider text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors mb-2"
                        >
                            <ArrowLeft size={16} /> Continue Shopping
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-normal text-[#1c1c1c] tracking-tight">
                            Your Shopping Bag ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                        </h1>
                    </div>

                    {cartItems.length > 0 && (
                        <button
                            onClick={() => {
                                clearCart()
                                toast.info('Cart cleared')
                            }}
                            className="text-[13px] font-medium text-[#1c1c1c]/60 hover:text-rose-700 underline underline-offset-4 transition-colors cursor-pointer self-start md:self-auto"
                        >
                            Clear Shopping Bag
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="py-20 bg-[#f4f1ea] border border-[#b6ac9f]/40 text-center space-y-6 max-w-xl mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-[#e8e3da] text-[#1c1c1c]/60 flex items-center justify-center mx-auto">
                            <ShoppingBag size={28} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-normal text-[#1c1c1c]">
                                Your cart is empty
                            </h2>
                            <p className="text-[14px] font-light text-[#1c1c1c]/60 max-w-sm mx-auto">
                                Explore our artisanal hampers, bouquets, and bespoke decor to fill
                                your bag.
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-3 bg-[#1c1c1c] text-[#f4f1ea] text-[13px] font-medium uppercase tracking-wider hover:bg-black transition-colors"
                        >
                            Explore Collections
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 space-y-4">
                            {cartItems.map((item) => {
                                const prodId = getProductId(item.product)
                                const numericPrice = parseNumericPrice(item.product.price)
                                const itemTotal = numericPrice * item.quantity

                                return (
                                    <div
                                        key={prodId}
                                        className="p-4 md:p-6 bg-[#f4f1ea] border border-[#b6ac9f]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <Link
                                                href={`/product/${prodId}`}
                                                prefetch={true}
                                                className="w-20 h-24 md:w-24 md:h-28 shrink-0 overflow-hidden relative border border-[#b6ac9f]/30 block hover:opacity-90 transition-opacity"
                                                style={{
                                                    backgroundColor:
                                                        item.product.bgColor || '#cec9be',
                                                }}
                                            >
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#1c1c1c]/40 text-xs">
                                                        Trendy
                                                    </div>
                                                )}
                                            </Link>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#1c1c1c]/50">
                                                    {item.product.category}
                                                </p>
                                                <Link
                                                    href={`/product/${prodId}`}
                                                    prefetch={true}
                                                    className="text-[16px] font-normal text-[#1c1c1c] hover:underline block"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-[14px] font-medium text-[#1c1c1c]/70">
                                                    {item.product.price} each
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#b6ac9f]/30 pt-4 sm:pt-0">
                                            <div className="flex items-center border border-[#b6ac9f]/40 bg-[#e8e3da]/70 overflow-hidden">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(prodId, item.quantity - 1)
                                                    }
                                                    className="p-2 text-[#1c1c1c]/70 hover:text-[#1c1c1c] transition-colors cursor-pointer"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-[14px] font-semibold font-mono text-[#1c1c1c]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(prodId, item.quantity + 1)
                                                    }
                                                    className="p-2 text-[#1c1c1c]/70 hover:text-[#1c1c1c] transition-colors cursor-pointer"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <div className="text-right space-y-1">
                                                <p className="text-[16px] font-bold text-[#1c1c1c] font-mono">
                                                    ₹{itemTotal.toLocaleString('en-IN')}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        removeFromCart(prodId)
                                                        toast.info(`Removed ${item.product.name}`)
                                                    }}
                                                    className="text-[12px] font-medium text-[#1c1c1c]/50 hover:text-rose-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Trash2 size={13} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-[#f4f1ea] border border-[#b6ac9f]/30 flex items-center gap-3">
                                    <Truck size={20} className="text-[#1c1c1c]/70" />
                                    <div>
                                        <p className="text-[13px] font-medium text-[#1c1c1c]">
                                            Free Express Shipping
                                        </p>
                                        <p className="text-[11px] font-light text-[#1c1c1c]/60">
                                            On all orders above ₹1,500 across India
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-[#f4f1ea] border border-[#b6ac9f]/30 flex items-center gap-3">
                                    <ShieldCheck size={20} className="text-[#1c1c1c]/70" />
                                    <div>
                                        <p className="text-[13px] font-medium text-[#1c1c1c]">
                                            Handcrafted Guarantee
                                        </p>
                                        <p className="text-[11px] font-light text-[#1c1c1c]/60">
                                            100% authentic artisan quality & safe delivery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                            <div className="p-6 md:p-8 bg-[#f4f1ea] border border-[#b6ac9f]/30 shadow-sm space-y-6 sticky top-24">
                                <h2 className="text-xl font-normal text-[#1c1c1c] border-b border-[#b6ac9f]/30 pb-3">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 text-[14px] font-light text-[#1c1c1c]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#1c1c1c]/70">Bag Subtotal</span>
                                        <span className="font-mono font-medium">
                                            ₹{subtotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[#1c1c1c]/70">
                                            Estimated Delivery Fee
                                        </span>
                                        <span className="font-mono font-medium text-emerald-800">
                                            {shippingFee === 0
                                                ? 'FREE (Above ₹1,500)'
                                                : `₹${shippingFee}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-[#b6ac9f]/30">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1c1c]/70 flex items-center gap-1.5">
                                            <MapPin size={14} /> Delivery Address
                                        </span>
                                        {user?.addresses && user.addresses.length >= 3 ? (
                                            <span className="text-[10px] font-mono text-[#1c1c1c]/50 bg-[#e8e3da] px-2 py-0.5">
                                                (Max 3 saved)
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleOpenAddAddress}
                                                className="text-[11px] font-medium uppercase tracking-wider text-[#1c1c1c] hover:opacity-75 flex items-center gap-1 cursor-pointer"
                                            >
                                                <Plus size={12} /> Add Address
                                            </button>
                                        )}
                                    </div>

                                    {user?.addresses && user.addresses.length > 0 ? (
                                        <div className="space-y-2">
                                            {user.addresses.map((addr) => {
                                                const addrId = addr._id || addr.id || addr.street
                                                const isSelected =
                                                    selectedAddressId === addrId ||
                                                    (selectedAddressId === '' && addr.isDefault)

                                                return (
                                                    <label
                                                        key={addrId}
                                                        onClick={() => setSelectedAddressId(addrId)}
                                                        className={`flex items-start gap-3 p-3 border transition-all cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-[#1c1c1c] text-[#f4f1ea] border-[#1c1c1c]'
                                                                : 'bg-[#e8e3da]/60 text-[#1c1c1c] border-[#b6ac9f]/40 hover:border-[#1c1c1c]/50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="deliveryAddress"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                setSelectedAddressId(addrId)
                                                            }
                                                            className="mt-1 accent-[#1c1c1c]"
                                                        />
                                                        <div className="text-[12px] leading-tight flex-1">
                                                            <p className="font-semibold uppercase tracking-wider">
                                                                {addr.label || 'Home'}
                                                            </p>
                                                            <p className="font-light opacity-90 mt-0.5">
                                                                {addr.street}, {addr.city},{' '}
                                                                {addr.state} {addr.zip}
                                                            </p>
                                                            <p className="font-mono text-[11px] opacity-75 mt-0.5">
                                                                Phone: {addr.phone}
                                                            </p>
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-[#e8e3da]/60 border border-[#b6ac9f]/30 text-center space-y-2">
                                            <p className="text-[12px] font-light text-[#1c1c1c]/70">
                                                No saved delivery address found.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddAddressOpen(true)}
                                                className="py-2 px-4 bg-[#1c1c1c] text-[#f4f1ea] text-[11px] font-medium uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                                            >
                                                + Add Address
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-[#b6ac9f]/30 pt-4 space-y-4">
                                    <div className="flex items-center justify-between text-lg font-normal text-[#1c1c1c]">
                                        <span>Total Amount</span>
                                        <span className="font-bold font-mono text-xl">
                                            ₹{finalTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-3.5 bg-[#1c1c1c] text-[#f4f1ea] text-[12px] font-medium uppercase tracking-widest hover:bg-black transition-colors shadow-md cursor-pointer text-center"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isAddAddressOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#f4f1ea] border border-[#b6ac9f]/40 max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-[#b6ac9f]/30 pb-3">
                            <h3 className="text-lg font-normal text-[#1c1c1c]">
                                Add Delivery Address
                            </h3>
                            <button
                                onClick={() => setIsAddAddressOpen(false)}
                                className="p-1 text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-[12px]">
                            <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                    Address Label (e.g. Home, Office)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newAddrLabel}
                                    onChange={(e) => setNewAddrLabel(e.target.value)}
                                    placeholder="Home"
                                    className="w-full px-3.5 py-2.5 bg-[#e8e3da]/70 border border-[#b6ac9f]/40 text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newAddrStreet}
                                    onChange={(e) => setNewAddrStreet(e.target.value)}
                                    placeholder="123 Luxury Lane"
                                    className="w-full px-3.5 py-2.5 bg-[#e8e3da]/70 border border-[#b6ac9f]/40 text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newAddrCity}
                                        onChange={(e) => setNewAddrCity(e.target.value)}
                                        placeholder="New Delhi"
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/70 border border-[#b6ac9f]/40 text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newAddrState}
                                        onChange={(e) => setNewAddrState(e.target.value)}
                                        placeholder="Delhi"
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/70 border border-[#b6ac9f]/40 text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        Pincode / ZIP *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newAddrZip}
                                        onChange={(e) => setNewAddrZip(e.target.value)}
                                        placeholder="110001"
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/70 border border-[#b6ac9f]/40 text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold uppercase tracking-wider text-[#1c1c1c]/70 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={newAddrPhone}
                                        onChange={(e) => setNewAddrPhone(e.target.value)}
                                        placeholder="9876543210"
                                        className="w-full px-3.5 py-2.5 bg-[#e8e3da]/70 border border-[#b6ac9f]/40 text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddAddressOpen(false)}
                                    className="px-4 py-2 border border-[#b6ac9f]/60 text-[#1c1c1c] hover:bg-[#e8e3da] transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingAddress}
                                    className="px-5 py-2 bg-[#1c1c1c] text-[#f4f1ea] hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingAddress ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}
