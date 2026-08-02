import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/auth'
import User from '@/lib/models/User'

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ addressId: string }> }
) {
    try {
        const { addressId } = await context.params
        const authUser = await verifyTokenAndGetUser(req)
        if (!authUser) {
            return NextResponse.json(
                { success: false, message: 'Access denied: Unauthorized' },
                { status: 401 }
            )
        }

        const user = await User.findById(authUser._id)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        user.addresses = user.addresses.filter(
            (addr: any) => addr._id.toString() !== addressId
        )

        await user.save()

        return NextResponse.json(
            {
                success: true,
                message: 'Address deleted successfully',
                addresses: user.addresses,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('deleteAddress API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to delete address' },
            { status: 500 }
        )
    }
}
