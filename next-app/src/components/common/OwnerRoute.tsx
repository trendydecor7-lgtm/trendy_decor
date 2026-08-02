'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

interface OwnerRouteProps {
    children: React.ReactNode
}

export const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const toastFiredRef = useRef<boolean>(false)

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                if (!toastFiredRef.current) {
                    toastFiredRef.current = true
                    toast.error('Please sign in to access this page.')
                }
                router.replace('/auth')
            } else if (!user.isOwner) {
                if (!toastFiredRef.current) {
                    toastFiredRef.current = true
                    toast.error('Access restricted. Only store owners can access this page.')
                }
                router.replace('/profile')
            }
        }
    }, [user, isLoading, toast, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#e8e3da] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1c1c1c] border-t-transparent" />
            </div>
        )
    }

    if (!user || !user.isOwner) {
        return null
    }

    return <>{children}</>
}

export default OwnerRoute
