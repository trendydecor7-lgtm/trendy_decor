import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const verifyToken = async (req, res, next) => {
    try {
        let token = null

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied: No token provided',
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key')

        const user = await User.findById(decoded.id).select('-password')
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token: User not found',
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Verify token error:', error)
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid or expired token',
        })
    }
}

export const isOwnerMiddleware = (req, res, next) => {
    if (!req.user || !req.user.isOwner) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Store owner privileges required',
        })
    }
    next()
}
