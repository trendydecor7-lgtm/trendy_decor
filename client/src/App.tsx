import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LocomotiveScroll from 'locomotive-scroll'

import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import About from './pages/About'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import ProductDetail from './pages/ProductDetail'
import AddProduct from './pages/AddProduct'
import Inventory from './pages/Inventory'
import { useState } from 'react'
import EditProduct from './pages/EditProduct'
import NotFound from './pages/NotFound'
import OwnerRoute from './components/common/OwnerRoute'
import IntroAnimation from './components/common/IntroAnimation'

const App = () => {
    const location = useLocation()
    const isAuthPage = location.pathname === '/auth'

    const [showIntro, setShowIntro] = useState(true)

    const handleIntroComplete = () => {
        setShowIntro(false)
    }

    useEffect(() => {
        const scroll = new LocomotiveScroll({
            lenisOptions: {
                wrapper: window,
                content: document.documentElement,
                lerp: 0.07, // Ultra smooth inertia momentum
                duration: 1.2,
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
            },
        })

        return () => {
            scroll.destroy()
        }
    }, [])

    // Scroll to top on page navigation
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <ToastProvider>
            <AuthProvider>
                <CartProvider>
                    {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
                    <div className="min-h-screen bg-[#e8e3da] flex flex-col justify-between">
                        <div>
                            {!isAuthPage && <Navbar />}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/product/:id" element={<ProductDetail />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route
                                    path="/add-product"
                                    element={
                                        <OwnerRoute>
                                            <AddProduct />
                                        </OwnerRoute>
                                    }
                                />
                                <Route
                                    path="/admin/add-product"
                                    element={
                                        <OwnerRoute>
                                            <AddProduct />
                                        </OwnerRoute>
                                    }
                                />
                                <Route
                                    path="/edit-product/:id"
                                    element={
                                        <OwnerRoute>
                                            <EditProduct />
                                        </OwnerRoute>
                                    }
                                />
                                <Route
                                    path="/admin/edit-product/:id"
                                    element={
                                        <OwnerRoute>
                                            <EditProduct />
                                        </OwnerRoute>
                                    }
                                />
                                <Route
                                    path="/inventory"
                                    element={
                                        <OwnerRoute>
                                            <Inventory />
                                        </OwnerRoute>
                                    }
                                />
                                <Route
                                    path="/admin/inventory"
                                    element={
                                        <OwnerRoute>
                                            <Inventory />
                                        </OwnerRoute>
                                    }
                                />
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/404" element={<NotFound />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                        {!isAuthPage && <Footer />}
                    </div>
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
