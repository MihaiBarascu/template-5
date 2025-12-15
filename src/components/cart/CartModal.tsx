'use client'

/**
 * Cart Modal - Based on official Payload ecommerce template
 * Styling adapted to use theme system
 */

import type { CartItem } from '@/components/cart'
import type { Product } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { cn } from '@/utilities/cn'
import { useShopSettings, getDisplayPrice, type TaxCategory } from '@/providers/ShopSettings'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState, useCallback } from 'react'

import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import { CloseCart } from './CloseCart'

// Price formatter - currency is passed from shopSettings
function formatPriceWithCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const shopSettings = useShopSettings()

  // Track hydration state to prevent mismatch in dev mode
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Price formatter using currency from settings
  const formatPrice = (amount: number) => formatPriceWithCurrency(amount, shopSettings.currency)

  // Calculate display price with VAT transformation
  // Accepts optional taxCategory to respect product-level VAT exemptions
  const calculateDisplayPrice = useCallback((price: number, quantity: number = 1, taxCategory?: TaxCategory | null) => {
    return Math.round(getDisplayPrice(price, shopSettings, taxCategory ?? undefined) * quantity)
  }, [shopSettings])

  // Calculate cart subtotal respecting each item's taxCategory
  const calculatedSubtotal = useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce((sum, item: CartItem) => {
      const product = item.product
      if (typeof product !== 'object' || !product) return sum
      const price = product.priceInRON || 0
      const taxCategory = (product as Product).taxCategory
      const displayPrice = getDisplayPrice(price, shopSettings, taxCategory ?? undefined)
      return sum + displayPrice * (item.quantity || 1)
    }, 0)
  }, [cart?.items, shopSettings])

  // Close the cart modal when the pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  return (
    <>
      {/* Open Cart Button */}
      <OpenCartButton quantity={totalQuantity} onClick={() => setIsOpen(true)} />

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-theme-surface z-50 shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-theme-border">
            <span className="text-xl font-semibold text-theme-text">Cosul meu</span>
            <button onClick={() => setIsOpen(false)} aria-label="Inchide cosul">
              <CloseCart />
            </button>
          </div>

          {/* Content - Only render cart items after hydration to prevent price mismatch */}
          {!isHydrated || !cart || cart?.items?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <svg className="h-16 w-16 text-theme-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-xl font-medium text-theme-text">Cosul tau este gol</p>
              <p className="text-theme-text-muted text-center">
                Adauga produse in cos pentru a continua cumparaturile
              </p>
              <Link
                href="/produse"
                onClick={() => setIsOpen(false)}
                className="mt-4 px-6 py-3 bg-theme-primary text-white rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors"
              >
                Vezi produsele
              </Link>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Cart Items */}
              <ul className="flex-1 overflow-auto p-4 space-y-4">
                {cart?.items?.map((item: CartItem, i) => {
                  const product = item.product
                  const variant = item.variant

                  if (typeof product !== 'object' || !item || !product || !product.slug)
                    return <React.Fragment key={i} />

                  // Get image
                  const firstImage = product.images?.[0]?.image
                  const image = typeof firstImage === 'object' ? firstImage : undefined

                  // Get price - use plugin's priceInRON field
                  let price = product.priceInRON || 0
                  // Get product's tax category for correct TVA calculation
                  const productTaxCategory = (product as Product).taxCategory

                  const isVariant = Boolean(variant) && typeof variant === 'object'

                  if (isVariant && variant && typeof variant === 'object') {
                    // If variant has its own price, use it
                    if ('priceInRON' in variant && typeof variant.priceInRON === 'number' && variant.priceInRON > 0) {
                      price = variant.priceInRON
                    }
                  }

                  return (
                    <li key={i} className="flex gap-4 py-4 border-b border-theme-border last:border-0">
                      {/* Delete button positioned over image */}
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 z-10">
                          <DeleteItemButton item={item} />
                        </div>
                        <Link
                          href={`/produse/${(item.product as Product)?.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block relative h-20 w-20 rounded-lg overflow-hidden bg-theme-surface-secondary border border-theme-border"
                        >
                          {image?.url && (
                            <Image
                              alt={image?.alt || product?.title || ''}
                              className="h-full w-full object-cover"
                              height={80}
                              width={80}
                              src={image.url}
                            />
                          )}
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/produse/${(item.product as Product)?.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-medium text-theme-text hover:text-theme-primary transition-colors line-clamp-2"
                          >
                            {product?.title}
                          </Link>
                          {isVariant && variant && typeof variant === 'object' && 'options' in variant && (
                            <p className="text-sm text-theme-text-muted mt-1">
                              {(variant.options as Array<{ label?: string }>)
                                ?.map((option) => option?.label)
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-theme-border rounded-lg">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span className="w-8 text-center text-sm font-medium text-theme-text">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>

                          {/* Price with TVA */}
                          <span className="font-semibold text-theme-text">
                            {formatPrice(calculateDisplayPrice(price, item.quantity || 1, productTaxCategory))}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Footer */}
              <div className="p-4 border-t border-theme-border bg-theme-surface-secondary">
                {/* Subtotal with TVA - calculated per-item respecting each product's taxCategory */}
                {calculatedSubtotal > 0 && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-theme-border">
                    <span className="text-theme-text-muted">Subtotal</span>
                    <span className="text-xl font-bold text-theme-text">
                      {formatPrice(Math.round(calculatedSubtotal))}
                    </span>
                  </div>
                )}

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 text-center bg-theme-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors"
                >
                  Finalizeaza comanda
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="block w-full mt-3 py-3 text-center text-theme-text-muted hover:text-theme-primary transition-colors"
                >
                  Continua cumparaturile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
