import React, { createContext, useContext, useState, useEffect } from 'react'

export interface ProductItem {
    _id?: string
    id?: string
    name: string
    category: 'Hampers' | 'Bouquets' | 'Rakhis' | 'Customize Chocolates'
    price: string
    bgColor?: string
    image?: string
    video?: string
    mediaType?: 'image' | 'video'
    isNewProduct?: boolean
    stock?: number
    inStock?: boolean
    description?: string
}

export interface CartItem {
    product: ProductItem
    quantity: number
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (product: ProductItem, qty?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, qty: number) => void
    clearCart: () => void
    totalCount: number
    subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'trendy_decor_cart'

export const parseNumericPrice = (priceStr: string): number => {
    if (!priceStr) return 0
    const cleanStr = priceStr.replace(/[^0-9.]/g, '')
    return parseFloat(cleanStr) || 0
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY)
            return saved ? JSON.parse(saved) : []
        } catch (e) {
            console.error('Failed to parse cart items from localStorage', e)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
        } catch (e) {
            console.error('Failed to save cart items to localStorage', e)
        }
    }, [cartItems])

    const getProductId = (product: ProductItem): string => {
        return (product._id || product.id || product.name).toString()
    }

    const addToCart = (product: ProductItem, qty = 1) => {
        setCartItems((prev) => {
            const targetId = getProductId(product)
            const existingIndex = prev.findIndex((item) => getProductId(item.product) === targetId)

            if (existingIndex > -1) {
                const updated = [...prev]
                const newQty = updated[existingIndex].quantity + qty
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQty,
                }
                return updated
            } else {
                return [...prev, { product, quantity: qty }]
            }
        })
    }

    const removeFromCart = (productId: string) => {
        setCartItems((prev) => prev.filter((item) => getProductId(item.product) !== productId))
    }

    const updateQuantity = (productId: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(productId)
            return
        }
        setCartItems((prev) =>
            prev.map((item) => {
                if (getProductId(item.product) === productId) {
                    return { ...item, quantity: qty }
                }
                return item
            })
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = cartItems.reduce((acc, item) => {
        const itemPrice = parseNumericPrice(item.product.price)
        return acc + itemPrice * item.quantity
    }, 0)

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
