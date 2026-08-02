'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import IntroAnimation from '@/components/common/IntroAnimation'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [showIntro, setShowIntro] = useState<boolean>(true)

    const isAuthPage =
        pathname === '/auth' ||
        pathname?.startsWith('/auth/') ||
        pathname === '/login' ||
        pathname?.startsWith('/login/') ||
        pathname === '/signup' ||
        pathname?.startsWith('/signup/')

    return (
        <>
            {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
            {!isAuthPage && <Navbar />}
            <div className="flex-1">{children}</div>
            {!isAuthPage && <Footer />}
        </>
    )
}
