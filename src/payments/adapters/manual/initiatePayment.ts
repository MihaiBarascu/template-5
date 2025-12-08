/**
 * Manual Payment Adapter - Initiate Payment
 *
 * For "Cash on Delivery" or "Pay at pickup" scenarios.
 * Creates a transaction without actual payment processing.
 *
 * Based on official Stripe adapter pattern from @payloadcms/plugin-ecommerce
 */

import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { Transaction } from '@/payload-types'

type InitiatePaymentFn = NonNullable<PaymentAdapter['initiatePayment']>

interface CartItem {
  product: string | { id: string }
  variant?: string | { id: string }
  quantity?: number
}

export const initiatePayment = (): InitiatePaymentFn => async ({
  data,
  req,
  transactionsSlug = 'transactions',
}) => {
  const payload = req.payload
  const customerEmail = data.customerEmail
  const currency = data.currency
  const cart = data.cart
  const amount = cart?.subtotal || 0
  const billingAddressFromData = data.billingAddress

  if (!currency) {
    throw new Error('Currency is required.')
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty or not provided.')
  }

  if (!customerEmail || typeof customerEmail !== 'string') {
    throw new Error('A valid customer email is required to make a purchase.')
  }

  try {
    // Flatten cart items for storage
    const flattenedCart: NonNullable<Transaction['items']> = cart.items.map((item: CartItem) => {
      const productID = typeof item.product === 'object' ? item.product.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant.id
          : item.variant
        : undefined

      return {
        product: productID,
        quantity: item.quantity ?? 1,
        variant: variantID,
      }
    })

    // Create a transaction record (pending until order is confirmed)
    // Note: Transaction schema only has billingAddress, shipping is stored on Order
    const transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
      ...(req.user
        ? { customer: req.user.id }
        : { customerEmail }),
      amount,
      billingAddress: billingAddressFromData as Transaction['billingAddress'],
      cart: cart.id,
      currency: 'RON',
      items: flattenedCart,
      paymentMethod: 'manual',
      status: 'pending',
      manual: {
        paymentType: 'cash_on_delivery',
      },
    }

    const transaction = await payload.create({
      collection: transactionsSlug as 'transactions',
      data: transactionData,
    })

    // For manual payment, return success so the client can proceed to confirm
    return {
      message: 'Payment initiated successfully',
      transactionID: transaction.id,
      // Signal to client that no payment UI is needed (unlike Stripe's clientSecret)
      skipPaymentUI: true,
    }
  } catch (error) {
    payload.logger.error(error, 'Error initiating manual payment')
    throw new Error(
      error instanceof Error ? error.message : 'Unknown error initiating payment'
    )
  }
}
