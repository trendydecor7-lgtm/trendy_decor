import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByIdFast, getProductsFast } from '@/lib/productsCache'
import { cleanProductDescription } from '@/lib/formatDescription'
import ProductDetailClient, { type ProductDetailData } from '@/components/product/ProductDetailClient'
import { ArrowLeft } from 'lucide-react'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const product = await getProductByIdFast(id)

    if (!product) {
        return {
            title: 'Product Not Found | Trendy Decor Gidderbaha',
            description: 'The requested luxury product could not be found in our catalog.',
        }
    }

    const title = `${product.name} | Trendy Decor Gidderbaha`
    const description =
        cleanProductDescription(product.description) ||
        `Buy ${product.name} - ${product.category} at Trendy Decor Gidderbaha by Harish Ahuja & Hitin Ahuja. Premium handcrafted gift hampers, chocolates, and decor.`
    const imageUrl = product.image || product.thumbnail || (product.images && product.images[0]) || 'https://trendydecor24.shop/logo.png'

    return {
        title,
        description,
        keywords: [
            product.name,
            product.category,
            'trendy decor',
            'trendy decors',
            'trendy decor gidderbaha',
            'trendydecor24.shop',
            'trendydecors.shop',
            'trendydecor.store',
            'harish ahuja',
            'hitin ahuja',
            'gift hampers',
            'customized chocolates',
            'gidderbaha decor',
        ],
        openGraph: {
            title,
            description,
            url: `https://trendydecor24.shop/product/${id}`,
            siteName: 'Trendy Decor Gidderbaha',
            type: 'website',
            images: [
                {
                    url: imageUrl,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `https://trendydecor24.shop/product/${id}`,
        },
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params
    const rawProduct = await getProductByIdFast(id)

    if (!rawProduct) {
        return (
            <main className="w-full min-h-screen bg-[#e8e3da] py-24 px-6">
                <div className="max-w-md mx-auto bg-[#f4f1ea] border border-[#b6ac9f]/60 p-8 rounded-2xl text-center space-y-6 shadow-xl">
                    <h2 className="text-2xl font-normal text-[#1c1c1c]">Product Not Found</h2>
                    <p className="text-[14px] font-light text-[#1c1c1c]/70">
                        The luxury item you are looking for is unavailable or has been removed.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1c] text-[#f4f1ea] text-[13px] font-light uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                </div>
            </main>
        )
    }

    const allProducts = await getProductsFast()
    const relatedProducts = Array.isArray(allProducts)
        ? allProducts.filter((p: any) => (p._id || p.id) !== id).slice(0, 4)
        : []

    const product: ProductDetailData = {
        _id: rawProduct._id?.toString() || id,
        id: rawProduct._id?.toString() || id,
        name: rawProduct.name,
        category: rawProduct.category,
        price: rawProduct.price,
        stock: rawProduct.stock ?? 50,
        inStock: rawProduct.inStock !== false,
        thumbnail: rawProduct.thumbnail,
        bgColor: rawProduct.bgColor,
        image: rawProduct.image,
        images: rawProduct.images,
        video: rawProduct.video,
        mediaType: rawProduct.mediaType,
        isNewProduct: rawProduct.isNewProduct,
        description: rawProduct.description,
    }

    const schemaData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.image || product.thumbnail || (product.images && product.images[0]),
        description: product.description || `Handcrafted ${product.name} from Trendy Decor Gidderbaha.`,
        category: product.category,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.price.toString().replace(/[^0-9.]/g, ''),
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://trendydecor24.shop/product/${id}`,
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </>
    )
}
