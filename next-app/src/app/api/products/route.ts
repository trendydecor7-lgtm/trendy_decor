import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/dbConnect'
import Product from '@/lib/models/Product'
import Newsletter from '@/lib/models/Newsletter'
import { verifyTokenAndGetUser } from '@/lib/auth'
import { sendNewProductNotificationEmail } from '@/lib/resend'
import { getProductsFast, clearProductsCache } from '@/lib/productsCache'

export async function GET() {
    try {
        const products = await getProductsFast()
        return NextResponse.json(
            { success: true, products },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                },
            }
        )
    } catch (error: any) {
        console.error('Get all products API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error while fetching products' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const user = await verifyTokenAndGetUser(req)
        if (!user || !user.isOwner) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Store owner privileges required' },
                { status: 403 }
            )
        }

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
        } = await req.json()

        if (!name || !category || !price) {
            return NextResponse.json(
                { success: false, message: 'Name, category, and price are required fields' },
                { status: 400 }
            )
        }

        const finalImages =
            Array.isArray(images) && images.length > 0 ? images : image ? [image] : []

        const newProduct = new Product({
            name,
            category,
            price: String(price).startsWith('₹') ? price : `₹${price}`,
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
            createdBy: user._id,
        })

        await newProduct.save()
        clearProductsCache(newProduct._id?.toString())

        Newsletter.find({ isSubscribed: true })
            .then((subscribers) => {
                if (subscribers && subscribers.length > 0) {
                    const emails = subscribers.map((sub: any) => sub.email)
                    sendNewProductNotificationEmail(emails, newProduct).catch((err) => {
                        console.error('Failed sending new product broadcast email:', err)
                    })
                }
            })
            .catch(console.error)

        return NextResponse.json(
            {
                success: true,
                message: 'Product created successfully',
                product: newProduct,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Create product API error:', error)
        return NextResponse.json(
            { success: false, message: 'Server error while creating product' },
            { status: 500 }
        )
    }
}
