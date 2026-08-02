import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Explore Products Catalog | Trendy Decor Gidderbaha',
    description:
        'Browse customized gift hampers, artisanal chocolates, floral bouquets, designer rakhis, and luxury celebration decor at Trendy Decor Gidderbaha by Harish Ahuja & Hitin Ahuja.',
    keywords: [
        'hampers gidderbaha',
        'custom chocolates punjab',
        'designer rakhis',
        'bouquets bathinda',
        'gift catalog gidderbaha',
        'event decor',
    ],
    openGraph: {
        title: 'Explore Products Catalog | Trendy Decor Gidderbaha',
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
