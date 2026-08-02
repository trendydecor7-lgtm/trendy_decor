import type { MetadataRoute } from 'next'
import { getProductsFast } from '@/lib/productsCache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://trendydecor24.shop'

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    try {
        const products = await getProductsFast()
        if (Array.isArray(products)) {
            const productRoutes: MetadataRoute.Sitemap = products.map((prod: any) => {
                const id = prod._id?.toString() || prod.id
                return {
                    url: `${baseUrl}/product/${id}`,
                    lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                }
            })
            return [...staticRoutes, ...productRoutes]
        }
    } catch (err) {
        console.warn('Could not generate sitemap product entries:', err)
    }

    return staticRoutes
}
