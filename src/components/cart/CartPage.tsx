'use client'

/**
 * CartPage Component - Based on official Payload template
 * Uses useCart() from plugin (database cart, not localStorage)
 * Adapted for theme system
 */

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { useShopSettings, getDisplayPrice, type TaxCategory } from '@/providers/ShopSettings'
import type { Product } from '@/payload-types'
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

export function CartPage() {
  const { cart, isLoading } = useCart()
  const shopSettings = useShopSettings()

  // Price formatter using currency from settings
  const formatPrice = (amount: number) => formatPriceWithCurrency(amount, shopSettings.currency)

  const cartIsEmpty = !cart || !cart.items || cart.items.length === 0

  // Calculate subtotal with TVA respecting each item's taxCategory
  const subtotal = React.useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce((sum, item: CartItem) => {
      const product = item.product as Product
      if (!product || typeof product !== 'object') return sum
      const rawPrice = product.priceInRON || 0
      const taxCategory = product.taxCategory
      const displayPrice = getDisplayPrice(rawPrice, shopSettings, taxCategory ?? undefined)
      return sum + displayPrice * (item.quantity || 1)
    }, 0)
  }, [cart?.items, shopSettings])

  // Get shipping settings from admin
  const shippingCost = shopSettings.shippingCost
  const freeShippingThreshold = shopSettings.freeShippingThreshold
  const shipping = freeShippingThreshold && subtotal >= freeShippingThreshold ? 0 : shippingCost
  const total = subtotal + shipping

  if (isLoading) {
    return (
      <section className="py-8 md:py-16 bg-theme-surface min-h-screen">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-theme-surface-secondary rounded w-48 mb-4"></div>
            <div className="h-4 bg-theme-surface-secondary rounded w-64 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-theme-surface-secondary rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 bg-theme-surface-secondary rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (cartIsEmpty) {
    return (
      <section className="py-8 md:py-16 bg-theme-surface min-h-screen">
        {/* Header */}
        <div className="bg-theme-surface-secondary py-12 mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-theme-text mb-2">
              Coșul tău
            </h1>
            <p className="text-theme-text-muted">
              Verifică produsele și finalizează comanda
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto mb-6 text-theme-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-theme-text mb-2">
              Coșul tău este gol
            </h2>
            <p className="text-theme-text-muted mb-6">
              Adaugă produse în coș pentru a continua cumpărăturile
            </p>
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 bg-theme-primary text-white py-3 px-6 rounded-[var(--radius-button)] font-medium hover:bg-theme-primary-dark transition-colors"
            >
              Vezi produsele
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-16 bg-theme-surface min-h-screen">
      {/* Header */}
      <div className="bg-theme-surface-secondary py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-text mb-2">
            Coșul tău
          </h1>
          <p className="text-theme-text-muted">
            {cart.items?.length} {cart.items?.length === 1 ? 'produs' : 'produse'} în coș
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items?.map((item, index) => {
              const product = item.product as Product
              if (!product || typeof product !== 'object') return null

              const firstImage = product.images?.[0]?.image
              const image = typeof firstImage === 'object' ? firstImage : undefined
              // Get display price with TVA respecting product's taxCategory
              const rawPrice = product.priceInRON || 0
              const price = getDisplayPrice(rawPrice, shopSettings, product.taxCategory ?? undefined)

              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-theme-surface-secondary border border-theme-border rounded-[var(--radius-card)]"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 z-10">
                      <DeleteItemButton item={item} />
                    </div>
                    <Link
                      href={`/produse/${product.slug}`}
                      className="block w-24 h-24 relative bg-theme-surface rounded-lg overflow-hidden border border-theme-border"
                    >
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt || product.title || ''}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-theme-text-muted">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produse/${product.slug}`}
                      className="font-medium text-theme-text hover:text-theme-primary transition-colors line-clamp-2"
                    >
                      {product.title}
                    </Link>
                    <p className="text-theme-primary font-bold mt-1">
                      {formatPrice(price)} / buc
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center border border-theme-border rounded-lg">
                        <EditItemQuantityButton item={item} type="minus" />
                        <span className="w-10 text-center font-medium text-theme-text">
                          {item.quantity}
                        </span>
                        <EditItemQuantityButton item={item} type="plus" />
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex flex-col items-end justify-center">
                    <span className="font-bold text-theme-text text-lg">
                      {formatPrice(price * (item.quantity || 1))}
                    </span>
                  </div>
                </div>
              )
            })}

            <Link
              href="/produse"
              className="inline-flex items-center gap-2 mt-4 text-sm text-theme-text-muted hover:text-theme-primary transition-colors"
            >
              ← Continuă cumpărăturile
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-theme-surface-secondary border border-theme-border rounded-[var(--radius-card)] sticky top-24">
              <h2 className="text-xl font-bold text-theme-text mb-4">
                Sumar comandă
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-theme-text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-theme-text-muted">
                  <span>Livrare</span>
                  <span>{shipping === 0 ? 'Gratuită' : formatPrice(shipping)}</span>
                </div>
                {freeShippingThreshold && subtotal < freeShippingThreshold && subtotal > 0 && (
                  <p className="text-xs text-theme-text-muted">
                    Mai adaugă {formatPrice(freeShippingThreshold - subtotal)} pentru livrare gratuită
                  </p>
                )}
                <hr className="border-theme-border" />
                <div className="flex justify-between text-lg font-bold text-theme-text">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-theme-primary text-white py-3 px-6 rounded-[var(--radius-button)] font-medium hover:bg-theme-primary-dark transition-colors text-center block"
              >
                Finalizează comanda
              </Link>

              <Link
                href="/produse"
                className="block text-center mt-4 text-theme-primary hover:underline"
              >
                Continuă cumpărăturile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
