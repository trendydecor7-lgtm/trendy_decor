import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Trendy Decor | Products & Luxury Gifts Catalog | Gidderbaha',
    description:
        'Browse customized gift hampers, artisanal chocolates, floral bouquets, designer rakhis, and luxury celebration decor at Trendy Decor Gidderbaha by Harish Ahuja & Hitin Ahuja across Gidderbaha, Bathinda & Malout.',
    keywords: [
        'trendy decor',
        'trendy decors',
        'trendy decor gidderbaha',
        'trendydecor24.shop',
        'trendydecors.shop',
        'trendydecor.store',
        'hampers gidderbaha',
        'custom chocolates punjab',
        'designer rakhis',
        'bouquets bathinda',
        'gift catalog gidderbaha',
        'event decor',
    ],
    openGraph: {
        title: 'Trendy Decor | Products & Luxury Gifts Catalog | Gidderbaha',
        description:
            'Browse customized gift hampers, artisanal chocolates, floral bouquets, designer rakhis, and luxury celebration decor at Trendy Decor Gidderbaha.',
        url: 'https://trendydecor24.shop/products',
        type: 'website',
        images: ['https://trendydecor24.shop/hero-assets/hero1.png'],
    },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
