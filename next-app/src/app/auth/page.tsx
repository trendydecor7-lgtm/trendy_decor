'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SEO from '@/components/common/SEO'
import { ArrowLeft, CheckCircle2, ShieldCheck, Loader2, KeyRound, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { API_BASE_URL } from '@/config/api'

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
        />
        <path
            fill="#FBBC05"
            d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
        />
        <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
        />
    </svg>
)

export default function Auth() {
    const { user, login } = useAuth()
    const { toast } = useToast()
    const router = useRouter()

    const [isSignUp, setIsSignUp] = useState(false)
    const [isForgotPassword, setIsForgotPassword] = useState(false)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [sendingOtp, setSendingOtp] = useState(false)
    const [verifyingOtp, setVerifyingOtp] = useState(false)
    const [resettingPassword, setResettingPassword] = useState(false)

    useEffect(() => {
        if (user) {
            router.replace('/profile')
        }
    }, [user, router])

    if (user) {
        return null
    }

    const handleSendOtp = async () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address first.')
            return
        }
        setSendingOtp(true)
        setErrorMsg('')

        try {
            const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setOtpSent(true)
                toast.success(data.message || `OTP verification code sent to ${email}`)
            } else {
                toast.error(data.message || 'Failed to send OTP')
            }
        } catch (err: any) {
            toast.error(err.message || 'Error sending OTP')
        } finally {
            setSendingOtp(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            toast.error('Please enter the 6-digit OTP code sent to your email.')
            return
        }
        setVerifyingOtp(true)
        setErrorMsg('')

        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setOtpVerified(true)
                toast.success('Email verified successfully! ✨')
            } else {
                toast.error(data.message || 'Invalid or expired OTP')
            }
        } catch (err: any) {
            toast.error(err.message || 'Error verifying OTP')
        } finally {
            setVerifyingOtp(false)
        }
    }

    const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !otp || !newPassword) {
            toast.error('Please fill in email, OTP code, and new password.')
            return
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long.')
            return
        }

        setResettingPassword(true)
        setErrorMsg('')

        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword: newPassword.trim(),
                }),
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toast.success(data.message || 'Password reset successfully! You can now sign in.')
                setIsForgotPassword(false)
                setIsSignUp(false)
                setPassword(newPassword)
                setOtp('')
                setOtpSent(false)
                setOtpVerified(false)
            } else {
                setErrorMsg(data.message || 'Failed to reset password. Please check your OTP.')
                toast.error(data.message || 'Password reset failed.')
            }
        } catch (err: any) {
            toast.error(err.message || 'Error resetting password.')
        } finally {
            setResettingPassword(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setLoading(true)

        const API_BASE = `${API_BASE_URL}/auth`

        try {
            if (isSignUp) {
                const response = await fetch(`${API_BASE}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.trim(),
                        email: email.trim(),
                        password,
                    }),
                })
                const data = await response.json()
                if (response.ok && data.success) {
                    login(
                        {
                            id: data.user?.id || data.user?._id,
                            name: data.user?.username || username,
                            email: data.user?.email || email,
                            isOwner: data.user?.isOwner || false,
                            addresses: data.user?.addresses || [],
                        },
                        data.token
                    )
                    toast.success('Account created! Check your email for a welcome message.')
                    router.push('/profile')
                } else {
                    setErrorMsg(data.message || 'Registration failed. Please try again.')
                }
            } else {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                })
                const data = await response.json()
                if (response.ok && data.success) {
                    login(
                        {
                            id: data.user?.id || data.user?._id,
                            name: data.user?.username || data.user?.name,
                            email: data.user?.email || email,
                            avatar: data.user?.avatarUrl,
                            isOwner: data.user?.isOwner || false,
                            addresses: data.user?.addresses || [],
                        },
                        data.token
                    )
                    toast.success('Welcome back!')
                    router.push('/profile')
                } else {
                    setErrorMsg(data.message || 'Invalid email or password.')
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err)
            setErrorMsg('Network error. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleAuth = () => {
        window.location.href = `${API_BASE_URL}/auth/google`
    }

    return (
        <main
            className="w-full min-h-screen flex flex-col lg:flex-row bg-[#f4f1ea] text-[#1c1c1c] select-none"
            style={{ fontFamily: "'Playpen Sans', sans-serif" }}
        >
            <SEO
                title="Sign In | Member Portal"
                description="Sign in or register an account with Trendy Decor to manage your orders, saved addresses, and profile."
            />
            <div className="hidden lg:flex lg:w-1/2 bg-[#1c1c1c] text-[#f4f1ea] flex-col justify-between p-12 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold tracking-tight uppercase">
                            Trendy Decor
                        </div>
                        <div className="text-[#f4f1ea]/50 text-sm mt-1">
                            Curated gifts & celebration decor
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-[#f4f1ea] text-xs font-light tracking-wider uppercase hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={13} />
                        <span>Home</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold leading-tight">
                            Beautiful gifts,
                            <br />
                            <span className="text-[#f4f1ea]/60">beautifully delivered.</span>
                        </h1>
                        <p className="text-[#f4f1ea]/50 mt-4 text-sm leading-relaxed max-w-xs">
                            Sign in to manage your orders, save addresses, and enjoy a personalized
                            shopping experience.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-[#f4f1ea]/30">
                    © 2026 Trendy Decor. All rights reserved.
                </div>

                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
            </div>

            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#b6ac9f]/40 text-xs font-light tracking-widest uppercase text-[#1c1c1c]/70 hover:text-[#1c1c1c] hover:border-[#1c1c1c] hover:bg-[#e8e3da]/50 transition-all group"
                        >
                            <ArrowLeft
                                size={14}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                    <div>
                        <div className="lg:hidden text-xl font-bold text-[#1c1c1c] mb-2 uppercase">
                            Trendy Decor
                        </div>
                        <h2 className="text-3xl font-bold text-[#1c1c1c]">
                            {isForgotPassword
                                ? 'Reset Password'
                                : isSignUp
                                    ? 'Create account'
                                    : 'Welcome back'}
                        </h2>
                        <p className="text-[#1c1c1c]/60 text-sm mt-2">
                            {isForgotPassword
                                ? 'Enter your registered email to receive an OTP code for password reset'
                                : isSignUp
                                    ? 'Sign up to start shopping with us'
                                    : 'Sign in to your account to continue'}
                        </p>
                    </div>

                    {isForgotPassword ? (
                        <form onSubmit={handleResetPasswordWithOtp} className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-[#1c1c1c]/70 uppercase tracking-wider">
                                        Registered Email Address *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={sendingOtp || !email}
                                        className="text-[11px] font-semibold text-[#1c1c1c] hover:underline disabled:opacity-40"
                                    >
                                        {sendingOtp
                                            ? 'Sending Code...'
                                            : otpSent
                                                ? 'Resend Code'
                                                : 'Send OTP Code'}
                                    </button>
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-[#e2dbce] bg-white px-4 py-3 text-sm text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#1c1c1c]/70 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <ShieldCheck size={14} className="text-[#1c1c1c]" />
                                        6-Digit OTP Verification Code *
                                    </span>
                                    {otpSent && (
                                        <span className="text-[10px] text-emerald-800 font-mono">
                                            OTP Sent to Email
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full rounded-2xl border border-[#e2dbce] bg-white px-4 py-3 text-center text-lg tracking-widest font-mono text-[#1c1c1c] focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#1c1c1c]/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Lock size={14} className="text-[#1c1c1c]" />
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="Enter at least 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-[#e2dbce] bg-white px-4 py-3 text-sm text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                                />
                            </div>

                            {errorMsg && (
                                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={resettingPassword}
                                className="w-full py-3.5 rounded-2xl bg-[#1c1c1c] text-[#f4f1ea] text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                            >
                                {resettingPassword ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} /> Resetting
                                        Password...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={16} /> Reset & Update Password
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-[#1c1c1c]/60 pt-2">
                                Remembered your password?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(false)
                                        setErrorMsg('')
                                    }}
                                    className="text-[#1c1c1c] font-semibold hover:underline"
                                >
                                    Back to Sign in
                                </button>
                            </p>
                        </form>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-[#e2dbce] bg-white hover:bg-[#f9f7f3] transition-colors text-sm font-medium text-[#1c1c1c] shadow-xs cursor-pointer"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#e2dbce]" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-[#f4f1ea] px-3 text-[#1c1c1c]/40">
                                        or continue with email
                                    </span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isSignUp && (
                                    <div>
                                        <label className="block text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider mb-1.5">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Keshav Gilhotra"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full rounded-2xl border border-[#e2dbce] bg-white px-4 py-3 text-sm text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                                        />
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        {isSignUp &&
                                            (otpVerified ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                                    <CheckCircle2 size={13} /> Verified
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={sendingOtp || !email}
                                                    className="text-[11px] font-medium text-[#1c1c1c] hover:underline disabled:opacity-40"
                                                >
                                                    {sendingOtp
                                                        ? 'Sending OTP...'
                                                        : otpSent
                                                            ? 'Resend OTP'
                                                            : 'Send OTP'}
                                                </button>
                                            ))}
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setOtpVerified(false)
                                        }}
                                        className="w-full rounded-2xl border border-[#e2dbce] bg-white px-4 py-3 text-sm text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                                    />
                                </div>

                                {isSignUp && otpSent && !otpVerified && (
                                    <div className="p-4 bg-[#e8e3da]/50 border border-[#b6ac9f]/40 rounded-2xl space-y-2">
                                        <label className="block text-xs font-medium text-[#1c1c1c]/70 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck
                                                    size={14}
                                                    className="text-[#1c1c1c]/60"
                                                />
                                                Enter 6-Digit Email OTP
                                            </span>
                                            <span className="text-[10px] text-[#1c1c1c]/50">
                                                Check inbox
                                            </span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="123456"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="flex-1 rounded-xl border border-[#e2dbce] bg-white px-3 py-2 text-center text-base tracking-widest font-mono text-[#1c1c1c] focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={verifyingOtp || otp.length < 4}
                                                className="px-4 py-2 bg-[#1c1c1c] text-[#f4f1ea] text-xs font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
                                            >
                                                {verifyingOtp ? (
                                                    <Loader2 className="animate-spin" size={14} />
                                                ) : (
                                                    'Verify'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-medium text-[#1c1c1c]/60 uppercase tracking-wider">
                                            Password
                                        </label>
                                        {!isSignUp && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsForgotPassword(true)
                                                    setErrorMsg('')
                                                    setOtpSent(false)
                                                    setOtp('')
                                                }}
                                                className="text-xs text-[#1c1c1c] font-medium hover:underline cursor-pointer"
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-[#e2dbce] bg-white px-4 py-3 text-sm text-[#1c1c1c] placeholder:text-[#1c1c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20"
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-2xl bg-[#1c1c1c] text-[#f4f1ea] text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                                >
                                    {loading
                                        ? 'Please wait...'
                                        : isSignUp
                                            ? 'Create Account'
                                            : 'Sign In'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-[#1c1c1c]/50">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp)
                                        setErrorMsg('')
                                    }}
                                    className="text-[#1c1c1c] font-semibold hover:underline cursor-pointer"
                                >
                                    {isSignUp ? 'Sign in' : 'Sign up'}
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}
