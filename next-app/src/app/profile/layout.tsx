import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Your Account & Profile | Trendy Decor Gidderbaha',
    description: 'Manage your account, view past orders, and manage preferences at Trendy Decor Gidderbaha.',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
