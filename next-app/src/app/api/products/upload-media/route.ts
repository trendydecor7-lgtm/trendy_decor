import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
    try {
        const user = await verifyTokenAndGetUser(req)
        if (!user || !user.isOwner) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Store owner privileges required' },
                { status: 403 }
            )
        }

        const { media, resourceType } = await req.json()

        if (!media) {
            return NextResponse.json(
                { success: false, message: 'Media data (base64) is required' },
                { status: 400 }
            )
        }

        const uploadResponse = await cloudinary.uploader.upload(media, {
            folder: 'trendy_products',
            resource_type: resourceType || 'auto',
        })

        return NextResponse.json(
            {
                success: true,
                url: uploadResponse.secure_url,
                resourceType: uploadResponse.resource_type,
                publicId: uploadResponse.public_id,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Cloudinary upload API error:', error)
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to upload media to Cloudinary' },
            { status: 500 }
        )
    }
}
