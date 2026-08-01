import Product from '../models/product.model.js'
import Newsletter from '../models/newsletter.model.js'
import cloudinary from '../config/cloudinary.js'
import { sendNewProductNotificationEmail } from '../utils/resend.js'

// POST /products/upload-media (Cloudinary Base64 upload for image & video)
export const uploadMedia = async (req, res) => {
    try {
        const { media, resourceType } = req.body

        if (!media) {
            return res.status(400).json({
                success: false,
                message: 'Media data (base64) is required',
            })
        }

        // Upload Base64 string directly to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(media, {
            folder: 'trendy_products',
            resource_type: resourceType || 'auto', // 'image', 'video', or 'auto'
        })

        return res.status(200).json({
            success: true,
            url: uploadResponse.secure_url,
            resourceType: uploadResponse.resource_type,
            publicId: uploadResponse.public_id,
        })
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload media to Cloudinary',
        })
    }
}

// GET /products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            products,
        })
    } catch (error) {
        console.error('Get all products error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
        })
    }
}

// GET /products/:id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        return res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        console.error('Get product by ID error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching product details',
        })
    }
}

// POST /products (Owner created)
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            stock,
            inStock,
            thumbnail,
            bgColor,
            image,
            images,
            video,
            mediaType,
            isNewProduct,
            description,
        } = req.body

        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and price are required fields',
            })
        }

        const finalImages =
            Array.isArray(images) && images.length > 0 ? images : image ? [image] : []

        const newProduct = new Product({
            name,
            category,
            price: price.startsWith('₹') ? price : `₹${price}`,
            stock: stock !== undefined ? Number(stock) : 50,
            inStock: inStock !== undefined ? Boolean(inStock) : true,
            thumbnail: thumbnail || finalImages[0] || '',
            bgColor: bgColor || '#cec9be',
            image: image || finalImages[0] || '',
            images: finalImages,
            video: video || '',
            mediaType: mediaType || (video ? 'video' : 'image'),
            isNewProduct: Boolean(isNewProduct),
            description: description || '',
            createdBy: req.user ? req.user._id : null,
        })

        await newProduct.save()

        // Broadcast notification email to newsletter subscribers asynchronously via Resend
        Newsletter.find({ isSubscribed: true })
            .then((subscribers) => {
                if (subscribers && subscribers.length > 0) {
                    const emails = subscribers.map((sub) => sub.email)
                    sendNewProductNotificationEmail(emails, newProduct).catch((err) => {
                        console.error('Failed sending new product broadcast email:', err)
                    })
                }
            })
            .catch(console.error)

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct,
        })
    } catch (error) {
        console.error('Create product error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error while creating product',
        })
    }
}

// PUT /products/:id
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        if (updates.price && !updates.price.startsWith('₹')) {
            updates.price = `₹${updates.price}`
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct,
        })
    } catch (error) {
        console.error('Update product error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error while updating product',
        })
    }
}

// DELETE /products/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await Product.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.error('Delete product error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting product',
        })
    }
}
