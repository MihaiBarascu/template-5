/**
 * Payment Adapters
 *
 * This module exports payment adapters for the @payloadcms/plugin-ecommerce.
 *
 * Available adapters:
 * - manualAdapter: For cash on delivery, pay at pickup, bank transfer
 * - stripeAdapter: For credit card payments (from @payloadcms/plugin-ecommerce/payments/stripe)
 */

export { manualAdapter, manualAdapterClient } from './adapters/manual'
export type { ManualAdapterArgs, ManualAdapterClientArgs } from './adapters/manual'
