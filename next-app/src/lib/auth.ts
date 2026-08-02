import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import User from '@/lib/models/User'
import { dbConnect } from '@/lib/dbConnect'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'

export const hashPassword = (password: string): string => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

export const verifyPassword = (password: string, storedPassword: string): boolean => {
    if (!storedPassword || !storedPassword.includes(':')) return false
    const [salt, originalHash] = storedPassword.split(':')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return hash === originalHash
}

export const generateToken = (userId: string | object): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '7d',
    })
}

export const verifyTokenAndGetUser = async (req: NextRequest) => {
    await dbConnect()
    let token: string | null = null

    const authHeader = req.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    } else {
        const cookieToken = req.cookies.get('token')?.value
        if (cookieToken) token = cookieToken
    }

    if (!token) return null

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
        const user = await User.findById(decoded.id).select('-password')
        return user || null
    } catch (error) {
        console.error('verifyTokenAndGetUser error:', error)
        return null
    }
}
