import rateLimit from 'express-rate-limit'

// 1. Strict Limiter for Sending OTP (prevents email spam / API quota drain)
export const otpSendLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 OTP send requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many OTP requests from this IP. Please wait 15 minutes before trying again.',
    },
})

// 2. Strict Limiter for Verifying OTP / Password Reset (prevents brute-force guessing of 6-digit codes)
export const otpVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 verification attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many verification attempts. Please wait 15 minutes before trying again.',
    },
})

// 3. Auth Limiter for Login and Registration (prevents credential stuffing & spam account creation)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit each IP to 15 login/register attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
})

// 4. Form Limiter for Newsletter Subscription & Contact Us Form (prevents form spam)
export const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 form submissions per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please wait a few minutes before trying again.',
    },
})

// 5. Global API Limiter (protects server from general denial of service / web scraping)
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP address. Please slow down.',
    },
})
