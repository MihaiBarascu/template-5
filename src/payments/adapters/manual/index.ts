/**
 * Manual Payment Adapter
 *
 * A payment adapter for scenarios without online payment processing:
 * - Cash on Delivery (Plată la livrare)
 * - Pay at Pickup (Plată la ridicare)
 * - Bank Transfer (Plată prin transfer bancar)
 *
 * This adapter follows the official @payloadcms/plugin-ecommerce pattern
 * (same structure as stripeAdapter).
 *
 * Usage in payload.config.ts:
 * ```ts
 * import { manualAdapter } from '@/payments'
 *
 * ecommercePlugin({
 *   payments: {
 *     paymentMethods: [
 *       manualAdapter({ label: 'Plată la livrare' }),
 *     ],
 *   },
 * })
 * ```
 *
 * Usage in frontend provider:
 * ```tsx
 * import { manualAdapterClient } from '@/payments'
 *
 * <EcommerceProvider
 *   paymentMethods={[
 *     manualAdapterClient({ label: 'Plată la livrare' }),
 *   ]}
 * >
 * ```
 */

import type { GroupField } from 'payload'
import { confirmOrder } from './confirmOrder'
import { initiatePayment } from './initiatePayment'

export interface ManualAdapterArgs {
  /**
   * The visually readable label for the payment method.
   * @default 'Plată la livrare'
   */
  label?: string
  /**
   * Override the default group field configuration
   */
  groupOverrides?: {
    fields?: (args: { defaultFields: GroupField['fields'] }) => GroupField['fields']
  } & Partial<Omit<GroupField, 'fields'>>
}

export interface ManualAdapterClientArgs {
  /**
   * The visually readable label for the payment method.
   * @default 'Plată la livrare'
   */
  label?: string
}

/**
 * Server-side adapter for manual/cash payments
 * Follows exact pattern from @payloadcms/plugin-ecommerce stripeAdapter
 */
export const manualAdapter = (props?: ManualAdapterArgs) => {
  const label = props?.label || 'Plată la livrare'
  const groupOverrides = props?.groupOverrides

  // Fields that will be stored on transactions for this payment method
  const baseFields: GroupField['fields'] = [
    {
      name: 'paymentType',
      type: 'select',
      label: 'Tip Plată',
      options: [
        { label: 'Plată la livrare', value: 'cash_on_delivery' },
        { label: 'Plată la ridicare', value: 'pay_at_pickup' },
        { label: 'Transfer bancar', value: 'bank_transfer' },
      ],
      defaultValue: 'cash_on_delivery',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Note plată',
      admin: {
        description: 'Note interne despre această plată',
      },
    },
  ]

  // Group field configuration (shown in admin when paymentMethod = 'manual')
  const groupField: GroupField = {
    name: 'manual',
    type: 'group',
    ...groupOverrides,
    admin: {
      condition: (data) => {
        const path = 'paymentMethod'
        return data?.[path] === 'manual'
      },
      ...groupOverrides?.admin,
    },
    fields:
      groupOverrides?.fields && typeof groupOverrides?.fields === 'function'
        ? groupOverrides.fields({ defaultFields: baseFields })
        : baseFields,
  }

  return {
    name: 'manual',
    confirmOrder: confirmOrder(),
    endpoints: [], // No webhooks needed for manual payments
    group: groupField,
    initiatePayment: initiatePayment(),
    label,
  }
}

/**
 * Client-side adapter configuration for manual/cash payments
 * Used in EcommerceProvider on the frontend
 */
export const manualAdapterClient = (props?: ManualAdapterClientArgs) => {
  return {
    name: 'manual',
    confirmOrder: true,
    initiatePayment: true,
    label: props?.label || 'Plată la livrare',
  }
}
