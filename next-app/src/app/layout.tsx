import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/context/ToastContext'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import LayoutShell from '@/components/LayoutShell'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
    title: {
        default: 'Trendy Decor | Event Decor, Gift Hampers & Customized Chocolates | Gidderbaha',
        template: '%s | Trendy Decor — Gidderbaha',
    },
    description:
        'Trendy Decor in Gidderbaha, Punjab — managed by Harish Ahuja & Hitin Ahuja. Specializing in customized gift hampers, handcrafted chocolates, bouquets, designer rakhis, baby welcome decor, and milestone event styling across Gidderbaha, Bathinda & Malout.',
    keywords: [
        'trendy decor',
        'trendy decors',
        'trendydecor',
        'trendy decor store',
        'trendy decor gidderbaha',
        'trendy decors gidderbaha',
        'trendydecor24.shop',
        'trendydecors.shop',
        'trendydecor.store',
        'gidderbaha',
        'harish ahuja',
        'hitin ahuja',
        'gift hampers',
        'customized chocolates',
        'bouquets',
        'designer rakhis',
        'event decor',
        'baby welcome setups',
        'bathinda',
        'malout',
        'punjab',
    ],
    authors: [{ name: 'Harish Ahuja & Hitin Ahuja — Trendy Decor Gidderbaha' }],
    metadataBase: new URL('https://trendydecor24.shop'),
    alternates: {
        canonical: 'https://trendydecor24.shop/',
    },
    icons: {
        icon: [
            { url: '/logo.png', sizes: '32x32', type: 'image/png' },
            { url: '/logo.png', sizes: '192x192', type: 'image/png' },
            { url: '/logo.png', sizes: '512x512', type: 'image/png' },
            { url: '/favicon.ico' },
        ],
        shortcut: '/logo.png',
        apple: [
            { url: '/logo.png', sizes: '180x180', type: 'image/png' },
            { url: '/logo.png', sizes: '192x192', type: 'image/png' },
        ],
    },
    openGraph: {
        type: 'website',
        url: 'https://trendydecor24.shop/',
        title: 'Trendy Decor Gidderbaha | Event Decor, Gift Hampers & Customized Chocolates',
        description:
            'Trendy Decor in Gidderbaha, Punjab — managed by Harish Ahuja & Hitin Ahuja. Specializing in customized gift hampers, handcrafted chocolates, bouquets, designer rakhis, and milestone event styling.',
        siteName: 'Trendy Decor Gidderbaha',
        locale: 'en_IN',
        images: [
            {
                url: 'https://trendydecor24.shop/hero-assets/hero1.png',
                width: 1200,
                height: 630,
                type: 'image/png',
                alt: 'Trendy Decor Gidderbaha Luxury Hampers & Event Decor',
            },
            {
                url: 'https://trendydecor24.shop/logo.png',
                width: 1200,
                height: 630,
                type: 'image/png',
                alt: 'Trendy Decor Gidderbaha Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Trendy Decor Gidderbaha | Event Decor, Gift Hampers & Customized Chocolates',
        description:
            'Trendy Decor in Gidderbaha, Punjab — managed by Harish Ahuja & Hitin Ahuja. Specializing in customized gift hampers, chocolates, bouquets, and designer rakhis.',
        images: ['https://trendydecor24.shop/hero-assets/hero1.png'],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="h-full antialiased scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
                <link rel="shortcut icon" href="/logo.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
                <meta property="og:image" content="https://trendydecor24.shop/hero-assets/hero1.png" />
                <meta property="og:image:secure_url" content="https://trendydecor24.shop/hero-assets/hero1.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100..800&family=Oswald:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([
                            {
                                '@context': 'https://schema.org',
                                '@type': 'Organization',
                                name: 'Trendy Decor',
                                alternateName: [
                                    'Trendy Decors',
                                    'Trendy Decor Store',
                                    'Trendy Decor 24',
                                    'Trendy Decor Gidderbaha',
                                    'TrendyDecor',
                                    'Trendy Decors Shop',
                                ],
                                url: 'https://trendydecor24.shop',
                                logo: 'https://trendydecor24.shop/logo.png',
                                image: 'https://trendydecor24.shop/hero-assets/hero1.png',
                                sameAs: [
                                    'https://trendydecor24.shop',
                                    'https://trendydecors.shop',
                                    'https://trendydecor.store',
                                    'https://www.instagram.com/trendy_decor_gdb',
                                ],
                            },
                            {
                                '@context': 'https://schema.org',
                                '@type': 'LocalBusiness',
                                name: 'Trendy Decor',
                                alternateName: [
                                    'Trendy Decors',
                                    'Trendy Decor Store',
                                    'Trendy Decor 24',
                                    'Trendy Decor Gidderbaha',
                                    'TrendyDecor',
                                    'Trendy Decors Shop',
                                ],
                                url: 'https://trendydecor24.shop',
                                logo: 'https://trendydecor24.shop/logo.png',
                                image: 'https://trendydecor24.shop/hero-assets/hero1.png',
                                sameAs: [
                                    'https://trendydecor24.shop',
                                    'https://trendydecors.shop',
                                    'https://trendydecor.store',
                                    'https://www.instagram.com/trendy_decor_gdb',
                                ],
                                description:
                                    'Premier event decoration service, bespoke gift hampers, customized chocolates, bouquets, and designer rakhis operated by Harish Ahuja & Hitin Ahuja.',
                                telephone: '+919417718844',
                                address: {
                                    '@type': 'PostalAddress',
                                    streetAddress: 'Burf Wali Gali',
                                    addressLocality: 'Gidderbaha',
                                    addressRegion: 'Punjab',
                                    postalCode: '152101',
                                    addressCountry: 'IN',
                                },
                                openingHoursSpecification: [
                                    {
                                        '@type': 'OpeningHoursSpecification',
                                        dayOfWeek: [
                                            'Monday',
                                            'Tuesday',
                                            'Wednesday',
                                            'Thursday',
                                            'Friday',
                                            'Saturday',
                                            'Sunday',
                                        ],
                                        opens: '08:00',
                                        closes: '20:00',
                                    },
                                ],
                                areaServed: ['Gidderbaha', 'Bathinda', 'Malout', 'Punjab'],
                                founder: [
                                    { '@type': 'Person', name: 'Harish Ahuja' },
                                    { '@type': 'Person', name: 'Hitin Ahuja' },
                                ],
                            },
                        ]),
                    }}
                />
            </head>
            <body
                className="min-h-full flex flex-col bg-[#e8e3da] text-[#1c1c1c] selection:bg-[#1c1c1c] selection:text-[#f4f1ea]"
                suppressHydrationWarning
            >
                <ToastProvider>
                    <AuthProvider>
                        <CartProvider>
                            <LayoutShell>{children}</LayoutShell>
                        </CartProvider>
                    </AuthProvider>
                </ToastProvider>
                <WhatsAppButton />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
