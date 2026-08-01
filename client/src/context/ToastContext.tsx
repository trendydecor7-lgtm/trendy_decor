import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void
    toast: {
        success: (message: string, duration?: number) => void
        error: (message: string, duration?: number) => void
        info: (message: string, duration?: number) => void
        warning: (message: string, duration?: number) => void
    }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const showToast = useCallback(
        (message: string, type: ToastType = 'info', duration = 3500) => {
            const id = 'toast_' + Math.random().toString(36).substring(2, 9)
            const newToast: ToastItem = { id, message, type }

            setToasts((prev) => [...prev, newToast])

            setTimeout(() => {
                removeToast(id)
            }, duration)
        },
        [removeToast]
    )

    const toast = useMemo(
        () => ({
            success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
            error: (msg: string, duration?: number) => showToast(msg, 'error', duration),
            info: (msg: string, duration?: number) => showToast(msg, 'info', duration),
            warning: (msg: string, duration?: number) => showToast(msg, 'warning', duration),
        }),
        [showToast]
    )

    return (
        <ToastContext.Provider value={{ showToast, toast }}>
            {children}

            {/* ── TOAST CONTAINER (BOTTOM RIGHT POSITIONED) ── */}
            <div
                className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 max-w-sm sm:max-w-md w-full px-4 pointer-events-none"
                style={{ fontFamily: "'Playpen Sans', sans-serif" }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-2xl border bg-[#f4f1ea] text-[#1c1c1c] backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4 ${
                            t.type === 'success'
                                ? 'border-[#b6ac9f]/70 border-l-4 border-l-emerald-700'
                                : t.type === 'error'
                                  ? 'border-[#b6ac9f]/70 border-l-4 border-l-rose-700'
                                  : t.type === 'warning'
                                    ? 'border-[#b6ac9f]/70 border-l-4 border-l-amber-700'
                                    : 'border-[#b6ac9f]/70 border-l-4 border-l-[#1c1c1c]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {t.type === 'success' && (
                                <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
                            )}
                            {t.type === 'error' && (
                                <AlertCircle size={20} className="text-rose-700 shrink-0" />
                            )}
                            {t.type === 'warning' && (
                                <AlertTriangle size={20} className="text-amber-700 shrink-0" />
                            )}
                            {t.type === 'info' && (
                                <Info size={20} className="text-[#1c1c1c] shrink-0" />
                            )}

                            <p className="text-[14px] font-light text-[#1c1c1c] tracking-wide leading-snug">
                                {t.message}
                            </p>
                        </div>

                        <button
                            onClick={() => removeToast(t.id)}
                            className="p-1.5 rounded-lg text-[#1c1c1c]/50 hover:text-[#1c1c1c] hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
                            aria-label="Dismiss toast"
                        >
                            <X size={15} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
