import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const user = await verifyTokenAndGetUser(req)
        if (!user || !user.isOwner) {
            return NextResponse.json(
                { success: false, message: 'Forbidden: Store owner privileges required' },
                { status: 403 }
            )
        }

        return NextResponse.json(
            {
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
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('getInventory API error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch inventory' },
            { status: 500 }
        )
    }
}
