import { API_BASE_URL } from '@/config/api'

const API_BASE = API_BASE_URL

export interface ProductData {
    _id?: string
    id?: string
    name: string
    price: string | number
    category?: string
    description?: string
    image?: string
    thumbnailUrl?: string
    thumbnail?: string
    video?: string
    mediaType?: 'image' | 'video'
    images?: string[]
    inStock?: boolean
    stock?: number
    bgColor?: string
    tags?: string[]
    isNewProduct?: boolean
}

export const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

const getAuthHeaders = (): HeadersInit => {
    const token = getCookie('token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

const getAllProducts = async (): Promise<{ success: boolean; products: ProductData[] }> => {
    const res = await fetch(`${API_BASE}/products`, { headers: getAuthHeaders() })
    return res.json()
}

const getProductById = async (id: string): Promise<{ success: boolean; product: ProductData }> => {
    const res = await fetch(`${API_BASE}/products/${id}`, { headers: getAuthHeaders() })
    return res.json()
}

const createProduct = async (
    productData: Partial<ProductData>
): Promise<{ success: boolean; product?: ProductData; message?: string }> => {
    const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    })
    return res.json()
}

const updateProduct = async (
    id: string,
    productData: Partial<ProductData>
): Promise<{ success: boolean; product?: ProductData; message?: string }> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    })
    return res.json()
}

const deleteProduct = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    })
    return res.json()
}

const uploadMedia = async (
    media: string,
    resourceType: 'image' | 'video' = 'image'
): Promise<{ success: boolean; url?: string; message?: string }> => {
    const token = getCookie('token')
    const res = await fetch(`${API_BASE}/products/upload-media`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ media, resourceType }),
    })
    return res.json()
}

export const productService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadMedia,
}
