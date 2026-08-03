import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache'
import { dbConnect } from '@/lib/dbConnect'
import Product from '@/lib/models/Product'

// In-Memory Warm Lambda Cache (zero dependencies, works on Vercel Serverless)
interface CacheEntry<T> {
    data: T
    expiry: number
}

const memoryCache = new Map<string, CacheEntry<any>>()
const inFlightRequests = new Map<string, Promise<any>>()
const MEMORY_TTL_MS = 15 * 1000 // 15 seconds in-memory TTL

function getMemoryCache<T>(key: string): T | null {
    const entry = memoryCache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiry) {
        memoryCache.delete(key)
        return null
    }
    return entry.data as T
}

function setMemoryCache<T>(key: string, data: T, ttlMs = MEMORY_TTL_MS) {
    memoryCache.set(key, {
        data,
        expiry: Date.now() + ttlMs,
    })
}

/**
 * Purge both In-Memory Cache and Next.js Data Cache tags across Vercel Edge CDN
 */
export function clearProductsCache(productId?: string) {
    memoryCache.clear()
    inFlightRequests.clear()
    try {
        revalidateTag('products', 'max')
        if (productId) {
            revalidateTag(`product-${productId}`, 'max')
        }
        revalidatePath('/api/products')
        revalidatePath('/products')
        revalidatePath('/inventory')
        revalidatePath('/admin/inventory')
        revalidatePath('/')
        if (productId) {
            revalidatePath(`/product/${productId}`)
            revalidatePath(`/api/products/${productId}`)
        }
    } catch (err) {
        console.warn('Cache revalidation notice:', err)
    }
}

// 1. Fetch raw products array from MongoDB Atlas
const fetchAllProductsFromDB = async () => {
    await dbConnect()
    const products = await Product.find().sort({ createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(products))
}

// Next.js Data Cache for all products
export const getCachedProducts = unstable_cache(
    async () => fetchAllProductsFromDB(),
    ['all-products-cache'],
    { revalidate: 30, tags: ['products'] }
)

// 2. Fetch single product by ID from MongoDB Atlas
const fetchProductByIdFromDB = async (id: string) => {
    await dbConnect()
    const product = await Product.findById(id).lean()
    if (!product) return null
    return JSON.parse(JSON.stringify(product))
}

// Next.js Data Cache for single product
export const getCachedProductById = (id: string) =>
    unstable_cache(
        async () => fetchProductByIdFromDB(id),
        [`product-${id}-cache`],
        { revalidate: 30, tags: ['products', `product-${id}`] }
    )()

/**
 * Fast Multi-Layer Fetcher for All Products
 * 1. Warm Lambda Memory Cache (<1ms)
 * 2. Next.js Vercel Data Cache (~5ms)
 * 3. MongoDB Atlas (<150ms)
 */
export async function getProductsFast() {
    const mem = getMemoryCache<any[]>('all_products')
    if (mem) return mem

    let inFlight = inFlightRequests.get('all_products')
    if (!inFlight) {
        inFlight = getCachedProducts()
            .then((products) => {
                setMemoryCache('all_products', products)
                inFlightRequests.delete('all_products')
                return products
            })
            .catch((err) => {
                inFlightRequests.delete('all_products')
                throw err
            })
        inFlightRequests.set('all_products', inFlight)
    }
    return inFlight
}

/**
 * Fast Multi-Layer Fetcher for Single Product with Promise Coalescing
 */
export async function getProductByIdFast(id: string) {
    const memKey = `product_${id}`
    const mem = getMemoryCache<any>(memKey)
    if (mem) return mem

    let inFlight = inFlightRequests.get(memKey)
    if (!inFlight) {
        inFlight = getCachedProductById(id)
            .then((product) => {
                if (product) {
                    setMemoryCache(memKey, product)
                }
                inFlightRequests.delete(memKey)
                return product
            })
            .catch((err) => {
                inFlightRequests.delete(memKey)
                throw err
            })
        inFlightRequests.set(memKey, inFlight)
    }
    return inFlight
}
