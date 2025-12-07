'use client'

/**
 * Ecommerce Provider Wrapper
 *
 * Wraps the application with the official @payloadcms/plugin-ecommerce provider.
 * This enables:
 * - useCart() hook for cart management (stored in database)
 * - usePayments() hook for payment flow
 * - useAddresses() hook for customer addresses
 *
 * Configuration:
 * - enableVariants: Set to true when you want product variants (size, color, etc.)
 * - paymentMethods: Array of payment adapters (manual, stripe, etc.)
 */

import React from 'react'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import { manualAdapterClient } from '@/payments'

// Optional: Import Stripe adapter when needed
// import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'

interface EcommerceProviderWrapperProps {
  children: React.ReactNode
}

export function EcommerceProviderWrapper({ children }: EcommerceProviderWrapperProps) {
  // Build payment methods array dynamically
  // Always include manual payment (cash on delivery)
  // Add Stripe only when API key is configured
  const paymentMethods = [
    manualAdapterClient({ label: 'Plată la livrare' }),
    // Uncomment when Stripe is configured:
    // ...(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    //   ? [stripeAdapterClient({ publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY })]
    //   : []),
  ]

  // Currency configuration - must match payload.config.ts
  const currenciesConfig = {
    defaultCurrency: 'RON',
    supportedCurrencies: [
      { code: 'RON', symbol: 'lei', decimals: 2, label: 'Leu Romanesc' },
    ],
  }

  return (
    <EcommerceProvider
      // Variants: set to true when you want size/color variants
      enableVariants={false}
      // Currency configuration
      currenciesConfig={currenciesConfig}
      // Payment methods configuration
      paymentMethods={paymentMethods}
      // API configuration for cart fetching
      api={{
        cartsFetchQuery: {
          depth: 2,
          populate: {
            products: {
              slug: true,
              title: true,
              images: true,
              inventory: true,
              priceInRON: true,
              category: true,
            },
            // Uncomment when variants are enabled:
            // variants: {
            //   title: true,
            //   inventory: true,
            // },
          },
        },
      }}
    >
      {children}
    </EcommerceProvider>
  )
}
