'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage =
        pathname === '/auth' ||
        pathname?.startsWith('/auth/') ||
        pathname === '/login' ||
        pathname?.startsWith('/login/') ||
        pathname === '/signup' ||
        pathname?.startsWith('/signup/')

    return (
        <>
            {!isAuthPage && <Navbar />}
            <div className="flex-1">{children}</div>
            {!isAuthPage && <Footer />}
        </>
    )
}
