import React, { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

interface OwnerRouteProps {
    children: React.ReactNode
}

export const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth()
    const { toast } = useToast()
    const toastFiredRef = useRef<boolean>(false)

    useEffect(() => {
        if (!isLoading && !toastFiredRef.current) {
            if (!user) {
                toastFiredRef.current = true
                toast.error('Please sign in to access this page.')
            } else if (!user.isOwner) {
                toastFiredRef.current = true
                toast.error('Access restricted. Only store owners can access this page.')
            }
        }
    }, [user, isLoading, toast])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#e8e3da] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1c1c1c] border-t-transparent" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    if (!user.isOwner) {
        return <Navigate to="/profile" replace />
    }

    return <>{children}</>
}

export default OwnerRoute
