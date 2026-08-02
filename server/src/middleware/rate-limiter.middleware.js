import rateLimit from 'express-rate-limit'

export const otpSendLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many OTP requests from this IP. Please wait 15 minutes before trying again.',
    },
})

export const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many verification attempts. Please wait 15 minutes before trying again.',
    },
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 15, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
})

export const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please wait a few minutes before trying again.',
    },
})

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP address. Please slow down.',
    },
})
