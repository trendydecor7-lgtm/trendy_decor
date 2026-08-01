import crypto from 'crypto'
import User from '../models/user.model.js'
import OTP from '../models/otp.model.js'
import Newsletter from '../models/newsletter.model.js'
import { generateToken } from '../utils/helper.js'
import {
    sendOtpEmail,
    sendWelcomeEmail,
    sendNewsletterConfirmationEmail,
    sendContactUsEmail,
} from '../utils/resend.js'

// Helper to hash password using Node crypto
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

// Helper to verify password
const verifyPassword = (password, storedPassword) => {
    if (!storedPassword || !storedPassword.includes(':')) return false
    const [salt, originalHash] = storedPassword.split(':')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return hash === originalHash
}

// Manual Register Controller
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email, and password',
            })
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            })
        }

        // Create new user
        const hashedPassword = hashPassword(password)
        const user = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            authProvider: 'local',
        })

        const token = generateToken(user._id)

        // Send Welcome Email asynchronously via Resend
        sendWelcomeEmail(user.email, user.username).catch((err) => {
            console.error('Failed sending welcome email:', err)
        })

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isOwner: user.isOwner || false,
                authProvider: user.authProvider || 'local',
                createdAt: user.createdAt,
            },
        })
    } catch (error) {
        console.error('Register controller error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error during registration',
        })
    }
}

// Manual Login Controller
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const user = await User.findOne({ email: normalizedEmail })

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const isPasswordValid = verifyPassword(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const token = generateToken(user._id)

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isOwner: user.isOwner || false,
                addresses: user.addresses || [],
                authProvider: user.authProvider || 'local',
                createdAt: user.createdAt,
            },
        })
    } catch (error) {
        console.error('Login controller error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error during login',
        })
    }
}

// Get Current Logged In User (Used for sync on site reload)
export const getMe = async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isOwner: user.isOwner || false,
                addresses: user.addresses || [],
                authProvider: user.authProvider || 'local',
                createdAt: user.createdAt,
            },
        })
    } catch (error) {
        console.error('getMe controller error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user data',
        })
    }
}

// Add New Shipping Address
export const addAddressController = async (req, res) => {
    try {
        const { label, street, city, state, zip, country, phone, isDefault } = req.body

        if (!street || !city || !state || !zip || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required address fields',
            })
        }

        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        if (user.addresses && user.addresses.length >= 3) {
            return res.status(400).json({
                success: false,
                message:
                    'Maximum limit of 3 addresses reached. You can only store up to 3 addresses.',
            })
        }

        const newAddress = {
            label: label || 'Home',
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            zip: zip.trim(),
            country: country ? country.trim() : 'India',
            phone: phone.trim(),
            isDefault: Boolean(isDefault),
        }

        user.addresses.push(newAddress)
        await user.save()

        return res.status(201).json({
            success: true,
            message: 'Address saved successfully',
            addresses: user.addresses,
        })
    } catch (error) {
        console.error('addAddressController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to save address',
        })
    }
}

// Delete Shipping Address
export const deleteAddressController = async (req, res) => {
    try {
        const { addressId } = req.params
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        user.addresses = user.addresses.filter((addr) => addr._id.toString() !== addressId)

        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            addresses: user.addresses,
        })
    } catch (error) {
        console.error('deleteAddressController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to delete address',
        })
    }
}

// Get Store Owner Inventory (Protected by isOwnerMiddleware)
export const getOwnerInventory = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Inventory data retrieved successfully',
            inventory: [
                {
                    id: 'INV-01',
                    name: 'Royal Heritage Rakhi Hamper',
                    category: 'Hampers',
                    stock: 45,
                    price: '₹3,499',
                    status: 'In Stock',
                },
                {
                    id: 'INV-02',
                    name: 'Velvet Rose & Gold Leaf Bouquet',
                    category: 'Bouquets',
                    stock: 28,
                    price: '₹2,899',
                    status: 'In Stock',
                },
                {
                    id: 'INV-03',
                    name: 'Royal Kundan & Pearl Rakhi',
                    category: 'Rakhis',
                    stock: 120,
                    price: '₹1,499',
                    status: 'In Stock',
                },
                {
                    id: 'INV-04',
                    name: 'Bespoke Monogrammed Truffle Box',
                    category: 'Customize Chocolates',
                    stock: 8,
                    price: '₹2,999',
                    status: 'Low Stock',
                },
                {
                    id: 'INV-05',
                    name: 'Gold-Foil Hazelnut Praline Box',
                    category: 'Customize Chocolates',
                    stock: 65,
                    price: '₹3,599',
                    status: 'In Stock',
                },
            ],
        })
    } catch (error) {
        console.error('getOwnerInventory error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory',
        })
    }
}

// Send OTP via Resend
export const sendOtpController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Remove old OTPs for this email
        await OTP.deleteMany({ email: normalizedEmail })

        // Save new OTP
        await OTP.create({ email: normalizedEmail, otp })

        // Send OTP email via Resend
        await sendOtpEmail(normalizedEmail, otp)

        return res.status(200).json({
            success: true,
            message: `Verification OTP sent to ${normalizedEmail}`,
        })
    } catch (error) {
        console.error('sendOtpController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to send verification OTP code',
        })
    }
}

// Verify OTP
export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const record = await OTP.findOne({ email: normalizedEmail, otp: otp.trim() })

        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP code',
            })
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: record._id })

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
        })
    } catch (error) {
        console.error('verifyOtpController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
        })
    }
}

// Reset Password with OTP Verification
export const resetPasswordWithOtpController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        if (!email || !otp || !newPassword) {
            return res
                .status(400)
                .json({ success: false, message: 'Email, OTP, and new password are required' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long',
            })
        }

        const normalizedEmail = email.toLowerCase().trim()

        // 1. Verify OTP
        const otpRecord = await OTP.findOne({ email: normalizedEmail, otp: otp.trim() })
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP verification code',
            })
        }

        // 2. Find User
        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found registered with this email address',
            })
        }

        // 3. Update Password
        user.password = hashPassword(newPassword)
        await user.save()

        // 4. Delete used OTP
        await OTP.deleteMany({ email: normalizedEmail })

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully! You can now sign in with your new password.',
        })
    } catch (error) {
        console.error('resetPasswordWithOtpController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to reset password. Please try again.',
        })
    }
}

// Subscribe to Newsletter
export const subscribeNewsletterController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const normalizedEmail = email.toLowerCase().trim()
        let subscriber = await Newsletter.findOne({ email: normalizedEmail })

        if (subscriber) {
            if (!subscriber.isSubscribed) {
                subscriber.isSubscribed = true
                await subscriber.save()
            }
        } else {
            subscriber = await Newsletter.create({ email: normalizedEmail })
        }

        // Send confirmation email asynchronously via Resend
        sendNewsletterConfirmationEmail(normalizedEmail).catch(console.error)

        return res.status(200).json({
            success: true,
            message: 'Successfully subscribed to Trendy Decor newsletter!',
        })
    } catch (error) {
        console.error('subscribeNewsletterController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Newsletter subscription failed',
        })
    }
}

// Submit Contact Form
export const submitContactUsController = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required fields',
            })
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Send emails via Resend
        sendContactUsEmail({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone ? phone.trim() : '',
            message: message.trim(),
        }).catch(console.error)

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
        })
    } catch (error) {
        console.error('submitContactUsController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to send message',
        })
    }
}

// Update User Profile (Username for local users)
export const updateProfileController = async (req, res) => {
    try {
        const { username } = req.body

        if (!username || !username.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Username cannot be empty',
            })
        }

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        if (user.authProvider && user.authProvider !== 'local') {
            return res.status(403).json({
                success: false,
                message: 'Username editing is only allowed for locally registered accounts',
            })
        }

        user.username = username.trim()
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Username updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isOwner: user.isOwner || false,
                addresses: user.addresses || [],
                authProvider: user.authProvider || 'local',
                createdAt: user.createdAt,
            },
        })
    } catch (error) {
        console.error('updateProfileController error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to update username',
        })
    }
}
