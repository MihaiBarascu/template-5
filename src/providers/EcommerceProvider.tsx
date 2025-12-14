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
 *
 * Cart Isolation:
 * - Uses a key based on user ID to force re-mount when user changes
 * - This ensures fresh cart fetch on login/logout (community recommended approach)
 */

import React from 'react'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import { manualAdapterClient } from '@/payments'
import { useAuth } from '@/providers/Auth'

// Optional: Import Stripe adapter when needed
// import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'

interface EcommerceProviderWrapperProps {
  children: React.ReactNode
}

export function EcommerceProviderWrapper({ children }: EcommerceProviderWrapperProps) {
  const { user } = useAuth()

  // Build payment methods array dynamically
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
      // decimals: 0 because we store prices in lei (whole numbers), not bani
      { code: 'RON', symbol: 'lei', decimals: 0, label: 'Leu Romanesc' },
    ],
  }

  // Key based on user ID for cart isolation
  // router.refresh() after login/logout will re-mount with fresh cart
  const cartIsolationKey = user?.id || 'guest'

  return (
    <EcommerceProvider
      // Force re-mount when user changes to get fresh cart
      key={cartIsolationKey}
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
