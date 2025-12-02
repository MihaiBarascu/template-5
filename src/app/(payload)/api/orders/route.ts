import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

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
 */
export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()

    // Validate required fields
    const { customerName, customerEmail, customerPhone, shippingAddress, items, total } = body

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, items' },
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

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Prepare order data for eCommerce plugin orders collection
    const orderData: Record<string, unknown> = {
      orderNumber,
      // Store customer info in a way compatible with the plugin
      // The plugin may have different field names, so we store extra data
      notes: `
Client: ${customerName}
Email: ${customerEmail}
Telefon: ${customerPhone || 'N/A'}
Adresa: ${shippingAddress}
Metoda plata: ${body.paymentMethod || 'card'}
Metoda livrare: ${body.shippingMethod || 'standard'}
Note client: ${body.notes || 'N/A'}
      `.trim(),
      // Store items - the plugin expects a specific format
      items: items.map((item: { product: string; quantity: number; price: number; title: string }) => ({
        product: item.product,
        quantity: item.quantity || 1,
        // Store price at time of purchase
        priceAtPurchase: item.price,
      })),
      // Totals
      totals: {
        subtotal: body.subtotal || total,
        shipping: body.shipping || 0,
        total: total,
      },
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
      orderNumber: orderNumber,
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
    required: ['customerName', 'customerEmail', 'items'],
    optional: ['customerPhone', 'shippingAddress', 'paymentMethod', 'shippingMethod', 'notes'],
  })
}
