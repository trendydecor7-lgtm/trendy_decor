import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        category: {
            type: String,
            enum: ['Hampers', 'Bouquets', 'Rakhis', 'Customize Chocolates'],
            required: true,
        },
        price: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 50,
            min: 0,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        thumbnail: {
            type: String,
            default: '',
        },
        bgColor: {
            type: String,
            default: '#cec9be',
        },
        image: {
            type: String,
            default: '',
        },
        images: {
            type: [String],
            default: [],
        },
        video: {
            type: String,
            default: '',
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        isNewProduct: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
)

// MongoDB compound and single-field indexes for ultra-fast query execution
productSchema.index({ createdAt: -1 })
productSchema.index({ category: 1, createdAt: -1 })
productSchema.index({ inStock: 1, category: 1 })
productSchema.index({ isNewProduct: 1, createdAt: -1 })
productSchema.index({ name: 'text', description: 'text', category: 'text' })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
