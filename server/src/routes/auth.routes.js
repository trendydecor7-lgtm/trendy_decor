import express from 'express'
import {
    registerUser,
    loginUser,
    getMe,
    addAddressController,
    deleteAddressController,
    getOwnerInventory,
    sendOtpController,
    verifyOtpController,
    resetPasswordWithOtpController,
    subscribeNewsletterController,
    submitContactUsController,
    updateProfileController,
} from '../controller/auth-controller.js'
import { verifyToken, isOwnerMiddleware } from '../middleware/auth.middleware.js'
import {
    authLimiter,
    otpSendLimiter,
    otpVerifyLimiter,
    formLimiter,
} from '../middleware/rate-limiter.middleware.js'

const router = express.Router()

router.post('/register', authLimiter, registerUser)
router.post('/login', authLimiter, loginUser)

router.post('/send-otp', otpSendLimiter, sendOtpController)
router.post('/verify-otp', otpVerifyLimiter, verifyOtpController)
router.post('/reset-password', otpVerifyLimiter, resetPasswordWithOtpController)
router.post('/newsletter', formLimiter, subscribeNewsletterController)
router.post('/contact', formLimiter, submitContactUsController)

router.get('/me', verifyToken, getMe)
router.put('/profile', verifyToken, updateProfileController)
router.post('/address', verifyToken, addAddressController)
router.delete('/address/:addressId', verifyToken, deleteAddressController)
router.get('/inventory', verifyToken, isOwnerMiddleware, getOwnerInventory)

export default router
