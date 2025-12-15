'use client'

/**
 * OrderSummary Component - Based on official Payload template
 * Displays cart items in a summary format
 * Adapted for theme system
 */

import React from 'react'
import Image from 'next/image'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import type { Product } from '@/payload-types'
import { useShopSettings, getDisplayPrice, type TaxCategory } from '@/providers/ShopSettings'
import type { CartItem } from '@/components/cart'

// Price formatter - currency passed from shopSettings
function formatPriceWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

interface OrderSummaryProps {
  shippingCost?: number
  showShipping?: boolean
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  shippingCost = 0,
  showShipping = true,
}) => {
  const { cart } = useCart()
  const shopSettings = useShopSettings()

  // Price formatter using currency from settings
  const formatPrice = (amount: number) => formatPriceWithCurrency(amount, shopSettings.currency)

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-6 text-center text-theme-text-muted">
        Coșul este gol
      </div>
    )
  }

  // Calculate subtotal with TVA respecting each item's taxCategory
  const subtotal = React.useMemo(() => {
    if (!cart.items) return 0
    return cart.items.reduce((sum, item: CartItem) => {
      const product = item.product as Product
      if (!product || typeof product !== 'object') return sum
      const rawPrice = product.priceInRON || 0
      const taxCategory = product.taxCategory
      const displayPrice = getDisplayPrice(rawPrice, shopSettings, taxCategory ?? undefined)
      return sum + displayPrice * (item.quantity || 1)
    }, 0)
  }, [cart.items, shopSettings])
  const total = subtotal + shippingCost

  return (
    <div className="space-y-4">
      {/* Products */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {cart.items.map((item, index) => {
          const product = item.product as Product
          if (!product || typeof product !== 'object') return null

          const firstImage = product.images?.[0]?.image
          const image = typeof firstImage === 'object' ? firstImage : undefined
          const price = product.priceInRON || 0
          // Apply correct taxCategory for this product
          const displayPrice = getDisplayPrice(price, shopSettings, product.taxCategory ?? undefined)

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0 border border-theme-border">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt || product.title || ''}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-theme-surface flex items-center justify-center text-theme-text-muted">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate text-theme-text">
                  {product.title}
                </p>
                <p className="text-xs text-theme-text-muted">
                  {item.quantity} x {formatPrice(displayPrice)}
                </p>
              </div>
              <span className="text-sm font-medium text-theme-text">
                {formatPrice(displayPrice * (item.quantity || 1))}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-theme-border pt-4 space-y-2">
        <div className="flex justify-between text-theme-text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {showShipping && (
          <div className="flex justify-between text-theme-text-muted">
            <span>Transport</span>
            <span>{shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-theme-border text-theme-text">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
