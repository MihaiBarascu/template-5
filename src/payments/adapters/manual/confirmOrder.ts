/**
 * Manual Payment Adapter - Confirm Order
 *
 * For "Cash on Delivery" or "Pay at pickup" scenarios.
 * Creates the order without actual payment processing.
 *
 * Based on official Stripe adapter pattern from @payloadcms/plugin-ecommerce
 */

import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { Transaction, Order } from '@/payload-types'

type ConfirmOrderFn = NonNullable<PaymentAdapter['confirmOrder']>

export const confirmOrder = (): ConfirmOrderFn => async ({
  data,
  ordersSlug = 'orders',
  req,
  transactionsSlug = 'transactions',
}) => {
  const payload = req.payload
  const customerEmail = data.customerEmail
  const transactionID = (data as { transactionID?: string }).transactionID
  const shippingAddressFromData = data.shippingAddress as Order['shippingAddress'] | undefined

  if (!transactionID) {
    throw new Error('Transaction ID is required')
  }

  try {
    // Find the transaction by ID
    const transactionsResults = await payload.find({
      collection: transactionsSlug as 'transactions',
      where: {
        id: {
          equals: transactionID,
        },
      },
    })

    const transaction = transactionsResults.docs[0] as Transaction | undefined

    if (!transactionsResults.totalDocs || !transaction) {
      throw new Error('No transaction found for the provided Transaction ID')
    }

    const cartID =
      transaction.cart && typeof transaction.cart === 'object'
        ? transaction.cart.id
        : transaction.cart

    if (!cartID) {
      throw new Error('Cart ID not found in the transaction')
    }

    // Use items from transaction (already flattened during initiate)
    const cartItemsSnapshot = transaction.items

    if (!cartItemsSnapshot || !Array.isArray(cartItemsSnapshot)) {
      throw new Error('Cart items not found in transaction')
    }

    // Create the order
    // Note: Order schema only has shippingAddress, billing is stored on Transaction
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      amount: transaction.amount,
      currency: 'RON',
      ...(req.user ? { customer: req.user.id } : { customerEmail }),
      items: cartItemsSnapshot as Order['items'],
      shippingAddress: shippingAddressFromData || transaction.billingAddress,
      status: 'processing',
      transactions: [transaction.id],
    }

    const order = await payload.create({
      collection: ordersSlug as 'orders',
      data: orderData,
    })

    // Mark cart as purchased
    const timestamp = new Date().toISOString()
    await payload.update({
      id: cartID,
      collection: 'carts',
      data: {
        purchasedAt: timestamp,
      },
    })

    // Update transaction status and link to order
    await payload.update({
      id: transaction.id,
      collection: transactionsSlug as 'transactions',
      data: {
        order: order.id,
        status: 'succeeded',
      },
    })

    // NOTE: Inventory decrement is NOT done here - consistent with official Stripe adapter.
    // The plugin's confirmOrderHandler (endpoint) handles inventory decrement AUTOMATICALLY
    // after this adapter returns transactionID. See /endpoints/confirmOrder.js in plugin.

    return {
      message: 'Order confirmed successfully',
      orderID: order.id,
      transactionID: transaction.id,
    }
  } catch (error) {
    payload.logger.error(error, 'Error confirming manual payment order')
    throw new Error(
      error instanceof Error ? error.message : 'Unknown error confirming order'
    )
  }
}
