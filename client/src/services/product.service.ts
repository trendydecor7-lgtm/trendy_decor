import { getCookie } from '../context/AuthContext'
import { API_BASE_URL } from '../config/api'

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
    video?: string
    mediaType?: 'image' | 'video'
    images?: string[]
    inStock?: boolean
    stock?: number
    bgColor?: string
    tags?: string[]
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
    formData: FormData
): Promise<{ success: boolean; url?: string; message?: string }> => {
    const token = getCookie('token')
    const res = await fetch(`${API_BASE}/products/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
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
