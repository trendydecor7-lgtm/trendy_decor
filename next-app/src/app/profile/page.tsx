'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import SEO from '@/components/common/SEO'
import {
    LogOut,
    MapPin,
    Plus,
    Trash2,
    User as UserIcon,
    Boxes,
    Phone,
    Pencil,
    Check,
    X,
} from 'lucide-react'
import { AddressModal } from '@/components/common/AddressModal'

function ProfileSkeleton() {
    return (
        <main
            className="w-full min-h-screen bg-[#e8e3da] py-10 md:py-16 px-4 sm:px-6 md:px-12 select-none"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                {/* Profile Header Card Skeleton */}
                <div className="relative bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full">
                            {/* Avatar Circle */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#e8e3da] skeleton-shimmer shrink-0 border-2 border-[#b6ac9f]/40" />
                            <div className="space-y-2.5 w-full max-w-sm">
                                <div className="h-6 sm:h-7 bg-[#e8e3da] skeleton-shimmer rounded-md w-3/4 mx-auto sm:mx-0" />
                                <div className="h-4 bg-[#e8e3da] skeleton-shimmer rounded-md w-full mx-auto sm:mx-0" />
                                <div className="h-4 bg-[#e8e3da] skeleton-shimmer rounded-md w-1/2 mx-auto sm:mx-0" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="h-10 w-28 bg-[#e8e3da] skeleton-shimmer rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Grid Skeletons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Account Details Card Skeleton */}
                    <div className="lg:col-span-1 bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="h-5 w-40 bg-[#e8e3da] skeleton-shimmer rounded-md pb-2 border-b border-[#b6ac9f]/20" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="h-3 w-20 bg-[#e8e3da] skeleton-shimmer rounded-sm" />
                                    <div className="h-5 w-3/4 bg-[#e8e3da] skeleton-shimmer rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Addresses Skeleton */}
                    <div className="lg:col-span-2 bg-[#f4f1ea] border border-[#b6ac9f]/40 rounded-2xl p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between pb-2 border-b border-[#b6ac9f]/20">
                            <div className="h-5 w-44 bg-[#e8e3da] skeleton-shimmer rounded-md" />
                            <div className="h-9 w-32 bg-[#e8e3da] skeleton-shimmer rounded-xl" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 bg-[#e8e3da]/60 border border-[#b6ac9f]/30 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 w-16 bg-[#e8e3da] skeleton-shimmer rounded-full" />
                                        <div className="h-4 w-4 bg-[#e8e3da] skeleton-shimmer rounded-full" />
                                    </div>
                                    <div className="h-4 w-full bg-[#e8e3da] skeleton-shimmer rounded-md" />
                                    <div className="h-4 w-4/5 bg-[#e8e3da] skeleton-shimmer rounded-md" />
                                    <div className="h-3 w-24 bg-[#e8e3da] skeleton-shimmer rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function Profile() {
    const { user, isLoading, logout, addAddress, deleteAddress, updateUsername, syncUser } =
        useAuth()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        syncUser()
    }, [])

    const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false)

    const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false)
    const [usernameInput, setUsernameInput] = useState<string>('')
    const [isUpdatingUsername, setIsUpdatingUsername] = useState<boolean>(false)
    const [imgError, setImgError] = useState<boolean>(false)

    useEffect(() => {
        setImgError(false)
    }, [user?.avatar])

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/auth')
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return <ProfileSkeleton />
    }

    const isLocalUser = !user.authProvider || user.authProvider === 'local'

    const getFormattedMemberSince = () => {
        if (user.createdAt) {
            try {
                const date = new Date(user.createdAt)
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }
            } catch (e) {

            }
        }
        return user.memberSince || 'March 2025'
    }

    const handleSaveUsername = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!usernameInput.trim()) {
            toast.error('Username cannot be empty.')
            return
        }
        if (usernameInput.trim() === user.name) {
            setIsEditingUsername(false)
            return
        }
        setIsUpdatingUsername(true)
        const success = await updateUsername(usernameInput.trim())
        setIsUpdatingUsername(false)
        if (success) {
            toast.success('Username updated successfully!')
            setIsEditingUsername(false)
        } else {
            toast.error('Failed to update username.')
        }
    }

    const handleDeleteAddress = async (addressId: string) => {
        const success = await deleteAddress(addressId)
        if (success) {
            toast.info('Address deleted.')
        } else {
            toast.error('Failed to delete address.')
        }
    }

    return (
        <main
            className="w-full min-h-screen bg-[#e8e3da] py-12 md:py-16 px-6 md:px-12 select-none"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <SEO
                title="My Profile & Order History"
                description="Manage your Trendy Decor account, saved delivery addresses, and view order history."
            />
            <div className="max-w-[1200px] mx-auto space-y-6">
                <div className="bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-md p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden max-w-full">
                    <div className="flex items-center gap-4 sm:gap-5 min-w-0 max-w-full">
                        <div className="relative shrink-0">
                            {user.avatar && user.avatar.trim() !== '' && !imgError ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name || 'User Profile'}
                                    referrerPolicy="no-referrer"
                                    onError={() => setImgError(true)}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-[#b6ac9f]/40 shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1c1c1c] text-[#f4f1ea] flex items-center justify-center font-normal text-xl sm:text-2xl border border-[#b6ac9f]/40 uppercase shrink-0">
                                    {user.name && user.name.trim() ? user.name.trim().charAt(0) : 'U'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 min-w-0 max-w-full overflow-hidden">
                            <div className="flex flex-wrap items-center gap-2.5">
                                {isEditingUsername ? (
                                    <form
                                        onSubmit={handleSaveUsername}
                                        className="flex items-center gap-2 max-w-full"
                                    >
                                        <input
                                            type="text"
                                            value={usernameInput}
                                            onChange={(e) => setUsernameInput(e.target.value)}
                                            className="px-3 py-1 bg-white border border-[#b6ac9f] rounded-md text-base sm:text-lg font-normal text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] max-w-[180px] sm:max-w-none"
                                            autoFocus
                                            disabled={isUpdatingUsername}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isUpdatingUsername}
                                            className="p-1.5 bg-[#1c1c1c] text-[#f4f1ea] rounded-md hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                                            title="Save username"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingUsername(false)
                                                setUsernameInput(user.name)
                                            }}
                                            className="p-1.5 border border-[#b6ac9f] text-[#1c1c1c] rounded-md hover:bg-[#e8e3da] transition-colors cursor-pointer"
                                            title="Cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex items-center gap-2 min-w-0 max-w-full">
                                        <h1 className="text-xl sm:text-2xl font-normal text-[#1c1c1c] truncate">
                                            Hello, {user.name}
                                        </h1>
                                        {isLocalUser && (
                                            <button
                                                onClick={() => {
                                                    setUsernameInput(user.name)
                                                    setIsEditingUsername(true)
                                                }}
                                                className="p-1 text-[#1c1c1c]/60 hover:text-[#1c1c1c] hover:bg-[#e8e3da] rounded-md transition-colors cursor-pointer shrink-0"
                                                title="Edit Username"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {user.isOwner && (
                                    <span className="px-2.5 py-0.5 bg-[#e8e3da] border border-[#b6ac9f]/40 text-[#1c1c1c] font-light text-[10px] uppercase tracking-wider rounded-full shrink-0">
                                        STORE OWNER
                                    </span>
                                )}
                            </div>
                            <p className="text-[12px] sm:text-[13px] text-[#1c1c1c]/70 font-light truncate max-w-full" title={`${user.email} • Member since ${getFormattedMemberSince()}`}>
                                <span className="break-all">{user.email}</span>
                                <span className="inline-block ml-1 opacity-75">• Member since {getFormattedMemberSince()}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 px-5 py-2.5 border border-[#1c1c1c] text-[#1c1c1c] text-[12px] font-light tracking-widest uppercase hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-colors rounded-md cursor-pointer"
                        >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
                {user.isOwner && (
                    <div className="bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <span className="inline-block text-[10px] font-light uppercase tracking-[0.2em] text-[#1c1c1c]/60 bg-[#e8e3da] px-3 py-1 rounded-full border border-[#b6ac9f]/40">
                                STORE OWNER DASHBOARD
                            </span>
                            <h2 className="text-xl md:text-2xl font-normal text-[#1c1c1c]">
                                Inventory & Product Control
                            </h2>
                            <p className="text-[13px] font-light text-[#1c1c1c]/70 max-w-xl leading-relaxed">
                                Edit live stock quantities, update product descriptions, change
                                media images/videos, and manage catalog items.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Link
                                href="/admin/inventory"
                                prefetch={true}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1c] text-[#f4f1ea] rounded-md text-[12px] font-light tracking-widest uppercase hover:bg-black/85 transition-colors"
                            >
                                <Boxes size={15} />
                                <span>MANAGE INVENTORY</span>
                            </Link>
                            <Link
                                href="/admin/add-product"
                                prefetch={true}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[#1c1c1c] text-[#1c1c1c] rounded-md text-[12px] font-light tracking-widest uppercase hover:bg-[#1c1c1c] hover:text-[#f4f1ea] transition-colors"
                            >
                                <Plus size={15} />
                                <span>ADD PRODUCT</span>
                            </Link>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-md p-6 space-y-4">
                        <div className="flex items-center gap-3 border-b border-[#b6ac9f]/30 pb-3">
                            <UserIcon className="text-[#1c1c1c]/70" size={18} />
                            <h3 className="text-lg font-normal text-[#1c1c1c]">Account Details</h3>
                        </div>
                        <div className="space-y-3 text-[13px]">
                            <div>
                                <span className="text-[#1c1c1c]/50 block text-[10px] uppercase tracking-wider">
                                    Full Name
                                </span>
                                <div className="flex items-center justify-between">
                                    <p className="font-normal text-[#1c1c1c]">{user.name}</p>
                                    {isLocalUser && !isEditingUsername && (
                                        <button
                                            onClick={() => {
                                                setUsernameInput(user.name)
                                                setIsEditingUsername(true)
                                            }}
                                            className="text-[11px] text-[#1c1c1c]/60 hover:text-[#1c1c1c] underline cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-[#1c1c1c]/50 block text-[10px] uppercase tracking-wider">
                                    Email Address
                                </span>
                                <p className="font-normal text-[#1c1c1c] break-all text-[12px] sm:text-[13px]">{user.email}</p>
                            </div>
                            <div>
                                <span className="text-[#1c1c1c]/50 block text-[10px] uppercase tracking-wider">
                                    Role Status
                                </span>
                                <p className="font-normal text-[#1c1c1c]">
                                    {user.isOwner ? 'Store Administrator' : 'Customer'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-[#f4f1ea] border border-[#b6ac9f]/30 rounded-md p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-[#b6ac9f]/30 pb-3">
                            <div className="flex items-center gap-2 text-[#1c1c1c]">
                                <MapPin size={18} className="text-[#1c1c1c]/70" />
                                <h3 className="text-lg font-normal">Saved Delivery Locations</h3>
                            </div>
                            {(!user.addresses || user.addresses.length < 3) && (
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-[11px] font-light uppercase tracking-widest rounded-md hover:bg-black/85 transition-colors cursor-pointer"
                                >
                                    <Plus size={13} />
                                    <span>Add Location</span>
                                </button>
                            )}
                        </div>

                        {user.addresses && user.addresses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {user.addresses.map((addr, idx) => {
                                    const id = addr._id || addr.id || String(idx)
                                    return (
                                        <div
                                            key={id}
                                            className="bg-white border border-[#b6ac9f]/30 rounded-md p-4 relative space-y-1.5"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="px-2.5 py-0.5 bg-[#1c1c1c] text-[#f4f1ea] text-[10px] font-light rounded-sm uppercase tracking-wider">
                                                    {addr.label}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteAddress(id)}
                                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="font-normal text-[13px] text-[#1c1c1c] pt-1">
                                                {addr.street}
                                            </p>
                                            <p className="text-[12px] font-light text-[#1c1c1c]/70">
                                                {addr.city}, {addr.state} - {addr.zip}
                                            </p>
                                            <p className="text-[11px] font-light text-[#1c1c1c]/50 flex items-center gap-1 pt-1">
                                                <Phone size={11} />
                                                {addr.phone}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-6 border border-dashed border-[#b6ac9f]/40 rounded-md text-center space-y-2">
                                <MapPin size={24} className="mx-auto text-[#1c1c1c]/30" />
                                <p className="text-[13px] font-light text-[#1c1c1c]/70">
                                    No saved addresses yet.
                                </p>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="px-4 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-[11px] font-light uppercase tracking-widest rounded-md cursor-pointer"
                                >
                                    + Add Address
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSave={addAddress}
            />
        </main>
    )
}
