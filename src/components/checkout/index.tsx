/**
 * Checkout Components - Based on official Payload ecommerce template
 * Uses useCart() and usePayments() from plugin
 * Adapted for manual payment (no Stripe) and theme system
 */

export { CheckoutPage } from './CheckoutPage'
export { OrderSummary } from './OrderSummary'
export { CheckoutForm } from './CheckoutForm'

// Re-export forms for convenience
export { AddressForm } from '@/components/forms/AddressForm'
