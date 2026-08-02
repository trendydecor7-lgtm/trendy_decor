import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import Product from '@/lib/models/Product'
import { verifyTokenAndGetUser } from '@/lib/auth'
import { getProductByIdFast, clearProductsCache } from '@/lib/productsCache'

export const revalidate = 86400

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const product = await getProductByIdFast(id)

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { success: true, product },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
                },
            }
        )
    } catch (error: any) {
        console.error('Get product by ID API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error while fetching product details' },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await context.params
        const user = await verifyTokenAndGetUser(req)
        if (!user || !user.isOwner) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Store owner privileges required' },
                { status: 403 }
            )
        }

        const updates = await req.json()
        if (updates.price && !String(updates.price).startsWith('₹')) {
            updates.price = `₹${updates.price}`
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            )
        }

        clearProductsCache(id)

        return NextResponse.json(
            {
                success: true,
                message: 'Product updated successfully',
                product: updatedProduct,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Update product API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error while updating product' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()
        const { id } = await context.params
        const user = await verifyTokenAndGetUser(req)
        if (!user || !user.isOwner) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Store owner privileges required' },
                { status: 403 }
            )
        }

        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            )
        }

        clearProductsCache(id)

        return NextResponse.json(
            { success: true, message: 'Product deleted successfully' },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Delete product API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error while deleting product' },
            { status: 500 }
        )
    }
}
