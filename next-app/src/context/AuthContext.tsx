'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '@/config/api'

export interface AddressItem {
    _id?: string
    id?: string
    label: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
    isDefault?: boolean
}

export interface User {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    isOwner?: boolean
    authProvider?: 'local' | 'google'
    createdAt?: string
    address?: {
        street?: string
        city?: string
        state?: string
        zip?: string
        country?: string
    }
    addresses?: AddressItem[]
    memberSince?: string
    ordersCount?: number
}

export type ProfileTab = 'profile' | 'address' | 'inventory'

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    activeTab: ProfileTab
    setActiveTab: (tab: ProfileTab) => void
    login: (userData: Partial<User>, token?: string) => void
    logout: () => void
    syncUser: (overrideToken?: string) => Promise<void>
    addAddress: (newAddr: AddressItem) => Promise<boolean>
    deleteAddress: (addressId: string) => Promise<boolean>
    updateUsername: (newUsername: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'trendy_decor_user'

export const setCookie = (name: string, value: string, days = 7) => {
    if (typeof window === 'undefined') return
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
}

export const deleteCookie = (name: string) => {
    if (typeof window === 'undefined') return
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export const isTokenExpired = (tokenString: string | null): boolean => {
    if (!tokenString) return true
    try {
        const parts = tokenString.split('.')
        if (parts.length !== 3) return false
        const base64Url = parts[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        const payload = JSON.parse(jsonPayload)
        if (payload && typeof payload.exp === 'number') {
            return payload.exp * 1000 <= Date.now()
        }
        return false
    } catch (e) {
        return false
    }
}

const DEFAULT_DEMO_USER: User = {
    id: 'usr_984712',
    name: 'Keshav Gilhotra',
    email: 'keshav@trendydecor.com',
    phone: '+91 98765 43210',
    addresses: [],
    memberSince: 'March 2025',
    ordersCount: 0,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<ProfileTab>('profile')

    const syncUser = async (overrideToken?: string) => {
        const activeToken = overrideToken || token || getCookie('token')
        if (!activeToken || isTokenExpired(activeToken)) return

        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${activeToken}`,
                },
            })

            if (response.status === 401 || response.status === 403) {
                console.warn('Backend rejected token (401/403). Logging out automatically.')
                deleteCookie('token')
                setToken(null)
                setUser(null)
                localStorage.removeItem(STORAGE_KEY)
            } else if (response.ok) {
                const data = await response.json()
                if (data.success && data.user) {
                    setUser((prev) => {
                        const syncedUser: User = {
                            ...DEFAULT_DEMO_USER,
                            ...prev,
                            id: data.user.id || data.user._id,
                            name: data.user.username || data.user.name || prev?.name || 'User',
                            email: data.user.email || prev?.email || '',
                            avatar: data.user.avatarUrl || prev?.avatar,
                            isOwner: data.user.isOwner ?? false,
                            authProvider: data.user.authProvider || prev?.authProvider || 'local',
                            createdAt: data.user.createdAt || prev?.createdAt,
                            addresses:
                                data.user.addresses !== undefined
                                    ? data.user.addresses
                                    : prev?.addresses || [],
                        }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser))
                        return syncedUser
                    })
                }
            }
        } catch (syncErr) {
            console.warn('Backend user sync failed, using cached session:', syncErr)
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search)
                const tokenFromUrl = searchParams.get('token')
                const userFromUrl = searchParams.get('user')

                let activeToken = getCookie('token')

                if (tokenFromUrl) {
                    setCookie('token', tokenFromUrl, 7)
                    setToken(tokenFromUrl)
                    activeToken = tokenFromUrl

                    let parsedUser: Partial<User> = {}
                    if (userFromUrl) {
                        try {
                            const raw = JSON.parse(userFromUrl)
                            parsedUser = {
                                id: raw.userId || raw.id,
                                name: raw.username || raw.name || 'User',
                                email: raw.email,
                                avatar: raw.avatarUrl,
                                isOwner: raw.isOwner || false,
                            }
                        } catch (e) {
                            console.error('Error parsing user from URL params', e)
                        }
                    }

                    const newUser: User = {
                        ...DEFAULT_DEMO_USER,
                        ...parsedUser,
                    }
                    setUser(newUser)
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))

                    window.history.replaceState({}, document.title, window.location.pathname)
                } else if (activeToken) {
                    if (isTokenExpired(activeToken)) {
                        console.warn(
                            'JWT token has expired during init. Logging out automatically.'
                        )
                        deleteCookie('token')
                        setToken(null)
                        setUser(null)
                        localStorage.removeItem(STORAGE_KEY)
                        activeToken = null
                    } else {
                        setToken(activeToken)
                        const savedUser = localStorage.getItem(STORAGE_KEY)
                        if (savedUser) {
                            try {
                                setUser(JSON.parse(savedUser))
                            } catch (e) {
                                setUser(null)
                            }
                        }
                    }
                } else {
                    setToken(null)
                    setUser(null)
                    localStorage.removeItem(STORAGE_KEY)
                }

                if (activeToken && !isTokenExpired(activeToken)) {
                    await syncUser(activeToken)
                }
            } catch (error) {
                console.error('Failed to parse saved user state or cookies', error)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    useEffect(() => {
        const checkAuthStatus = () => {
            const cookieToken = getCookie('token')
            const activeToken = cookieToken || token

            if (user && (!cookieToken || isTokenExpired(activeToken))) {
                console.warn(
                    'Token missing or expired during active session. Signing out automatically.'
                )
                logout()
            }
        }

        checkAuthStatus()
        const timer = setInterval(checkAuthStatus, 1000)
        window.addEventListener('focus', checkAuthStatus)
        window.addEventListener('storage', checkAuthStatus)

        return () => {
            clearInterval(timer)
            window.removeEventListener('focus', checkAuthStatus)
            window.removeEventListener('storage', checkAuthStatus)
        }
    }, [token, user])

    const login = (userData: Partial<User>, authToken?: string) => {
        const effectiveToken = authToken || 'mock_jwt_token_' + Date.now()

        const newUser: User = {
            ...DEFAULT_DEMO_USER,
            ...userData,
            addresses: userData.addresses || [],
        }

        setCookie('token', effectiveToken, 7)
        setToken(effectiveToken)
        setUser(newUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
        syncUser(effectiveToken)
    }

    const logout = () => {
        deleteCookie('token')
        setToken(null)
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    const addAddress = async (newAddr: AddressItem): Promise<boolean> => {
        if (user?.addresses && user.addresses.length >= 3) {
            return false
        }
        try {
            const activeToken = token || getCookie('token')
            if (activeToken) {
                if (isTokenExpired(activeToken)) {
                    logout()
                    return false
                }
                const res = await fetch(`${API_BASE_URL}/auth/address`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${activeToken}`,
                    },
                    body: JSON.stringify(newAddr),
                })
                if (res.status === 401 || res.status === 403) {
                    logout()
                    return false
                }
                const data = await res.json()
                if (res.ok && data.success) {
                    setUser((prev) => {
                        if (!prev) return prev
                        const updated: User = {
                            ...prev,
                            addresses: data.addresses || [...(prev.addresses || []), newAddr],
                        }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                        return updated
                    })
                    return true
                }
            }

            setUser((prev) => {
                if (!prev) return prev
                const localList = [
                    ...(prev.addresses || []),
                    { ...newAddr, _id: 'addr_' + Date.now() },
                ]
                const updated: User = { ...prev, addresses: localList }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
            return true
        } catch (err) {
            console.error('addAddress error:', err)
            setUser((prev) => {
                if (!prev) return prev
                const localList = [
                    ...(prev.addresses || []),
                    { ...newAddr, _id: 'addr_' + Date.now() },
                ]
                const updated: User = { ...prev, addresses: localList }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
            return true
        }
    }

    const deleteAddress = async (addressId: string): Promise<boolean> => {
        try {
            const activeToken = token || getCookie('token')
            if (activeToken) {
                if (isTokenExpired(activeToken)) {
                    logout()
                    return false
                }
                const res = await fetch(`${API_BASE_URL}/auth/address/${addressId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${activeToken}`,
                    },
                })
                if (res.status === 401 || res.status === 403) {
                    logout()
                    return false
                }
                const data = await res.json()
                if (res.ok && data.success) {
                    setUser((prev) => {
                        if (!prev) return prev
                        const updated: User = {
                            ...prev,
                            addresses:
                                data.addresses ||
                                (prev.addresses || []).filter(
                                    (a) => a._id !== addressId && a.id !== addressId
                                ),
                        }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                        return updated
                    })
                    return true
                }
            }

            setUser((prev) => {
                if (!prev) return prev
                const updated: User = {
                    ...prev,
                    addresses: (prev.addresses || []).filter(
                        (a) => a._id !== addressId && a.id !== addressId
                    ),
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
            return true
        } catch (err) {
            console.error('deleteAddress error:', err)
            setUser((prev) => {
                if (!prev) return prev
                const updated: User = {
                    ...prev,
                    addresses: (prev.addresses || []).filter(
                        (a) => a._id !== addressId && a.id !== addressId
                    ),
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
            return true
        }
    }

    const updateUsername = async (newUsername: string): Promise<boolean> => {
        try {
            const activeToken = token || getCookie('token')
            if (activeToken) {
                if (isTokenExpired(activeToken)) {
                    logout()
                    return false
                }
                const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${activeToken}`,
                    },
                    body: JSON.stringify({ username: newUsername }),
                })
                if (res.status === 401 || res.status === 403) {
                    logout()
                    return false
                }
                const data = await res.json()
                if (res.ok && data.success && data.user) {
                    setUser((prev) => {
                        if (!prev) return prev
                        const updated: User = {
                            ...prev,
                            name: data.user.username || newUsername,
                            createdAt: data.user.createdAt || prev.createdAt,
                            authProvider: data.user.authProvider || prev.authProvider,
                        }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                        return updated
                    })
                    return true
                }
            }

            setUser((prev) => {
                if (!prev) return prev
                const updated: User = { ...prev, name: newUsername }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
            return true
        } catch (err) {
            console.error('updateUsername error:', err)
            setUser((prev) => {
                if (!prev) return prev
                const updated: User = { ...prev, name: newUsername }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return updated
            })
            return true
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                activeTab,
                setActiveTab,
                login,
                logout,
                syncUser,
                addAddress,
                deleteAddress,
                updateUsername,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
