import express from 'express'
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadMedia,
} from '../controller/product-controller.js'
import { verifyToken, isOwnerMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Owner protected routes
router.post('/upload-media', verifyToken, isOwnerMiddleware, uploadMedia)
router.post('/', verifyToken, isOwnerMiddleware, createProduct)
router.put('/:id', verifyToken, isOwnerMiddleware, updateProduct)
router.delete('/:id', verifyToken, isOwnerMiddleware, deleteProduct)

export default router
