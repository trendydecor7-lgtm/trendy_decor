import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/auth'
import User from '@/lib/models/User'

export async function POST(req: NextRequest) {
    try {
        const authUser = await verifyTokenAndGetUser(req)
        if (!authUser) {
            return NextResponse.json(
                { success: false, message: 'Access denied: Unauthorized' },
                { status: 401 }
            )
        }

        const { label, street, city, state, zip, country, phone, isDefault } = await req.json()

        if (!street || !city || !state || !zip || !phone) {
            return NextResponse.json(
                { success: false, message: 'Please fill in all required address fields' },
                { status: 400 }
            )
        }

        const user = await User.findById(authUser._id)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        if (user.addresses && user.addresses.length >= 3) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Maximum limit of 3 addresses reached. You can only store up to 3 addresses.',
                },
                { status: 400 }
            )
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

        return NextResponse.json(
            {
                success: true,
                message: 'Address saved successfully',
                addresses: user.addresses,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('addAddress API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to save address' },
            { status: 500 }
        )
    }
}
