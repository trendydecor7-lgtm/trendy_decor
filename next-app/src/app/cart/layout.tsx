import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Your Shopping Bag | Trendy Decor Gidderbaha',
    description: 'Review your customized luxury gift hampers, chocolates, and celebration items before checkout.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
