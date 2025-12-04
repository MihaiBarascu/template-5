import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP } from '@/utilities/rateLimit'

/**
 * Custom Orders API Endpoint
 *
 * This endpoint allows unauthenticated customers to place orders.
 * The eCommerce plugin's default orders collection has restrictive access control,
 * so we create a custom endpoint that uses overrideAccess: true for system operations.
 *
 * Following Payload best practices:
 * - Using getPayload() to get the Payload instance
 * - Using overrideAccess: true for trusted server-side operations
 * - Validating input data before creating the order
 * - The afterChange hook on orders collection will handle email notifications
 *
 * Expected request body (matching eCommerce plugin schema):
 * {
 *   shippingAddress: {
 *     firstName, lastName, addressLine1, city, state, postalCode, country, phone
 *   },
 *   customerEmail: string,
 *   items: [{ product: string, quantity: number }],
 *   amount: number,
 *   notes?: string
 * }
 */
export async function POST(request: Request) {
  // Rate limiting: 10 orders per minute per IP
  const clientIP = getClientIP(request)
  const rateLimit = checkRateLimit(`orders:${clientIP}`, 10, 60000)

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.reset),
        },
      }
    )
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    // Extract fields from request body
    const { shippingAddress, customerEmail, items, amount } = body

    // Validate required fields
    if (!shippingAddress?.firstName || !shippingAddress?.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: shippingAddress.firstName, shippingAddress.lastName' },
        { status: 400 }
      )
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Missing required field: customerEmail' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: items (must have at least one item)' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare order data for eCommerce plugin orders collection
    // Using the exact field names from the plugin schema
    const orderData: Record<string, unknown> = {
      // Shipping address - pass through directly (already in correct format)
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        addressLine1: shippingAddress.addressLine1 || '',
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'Romania',
        phone: shippingAddress.phone || '',
      },
      // Customer email - plugin field
      customerEmail,
      // Amount - plugin expects this
      amount: amount || 0,
      currency: 'RON',
      // Store items - the plugin expects a specific format
      items: items.map((item: { product: string; quantity: number }) => ({
        product: item.product,
        quantity: item.quantity || 1,
      })),
      // Status options for orders: 'processing', 'completed', 'cancelled', 'refunded'
      status: 'processing',
    }

    // Create order using Local API with overrideAccess: true
    // This is a trusted server-side operation, so we bypass access control
    const order = await payload.create({
      collection: 'orders',
      data: orderData,
      overrideAccess: true, // Required for unauthenticated order creation
    })

    // The afterChange hook in payload.config.ts will handle sending email notifications

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Comanda a fost plasata cu succes!',
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint - returns info about the orders API
 */
export async function GET() {
  return NextResponse.json({
    message: 'Orders API - POST to create a new order',
    required: {
      shippingAddress: {
        firstName: 'string',
        lastName: 'string',
        addressLine1: 'string (optional)',
        city: 'string (optional)',
        state: 'string (optional)',
        postalCode: 'string (optional)',
        country: 'string (default: Romania)',
        phone: 'string (optional)',
      },
      customerEmail: 'string',
      items: '[{ product: string (id), quantity: number }]',
      amount: 'number',
    },
    optional: ['notes', 'paymentMethod', 'shippingMethod'],
  })
}
