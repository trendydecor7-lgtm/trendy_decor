import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
    {
        label: { type: String, default: 'Home' },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, default: 'India' },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
)

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            default: null,
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        providerId: {
            type: String,
            default: null,
        },
        avatarUrl: {
            type: String,
            default: null,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        isOwner: {
            type: Boolean,
            default: false,
        },
        addresses: [addressSchema],
    },
    { timestamps: true }
)

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
