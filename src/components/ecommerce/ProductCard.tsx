'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Eye, Heart } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { AddToCart } from '@/components/cart/AddToCart'
import { useShopSettings, getDisplayPrice, type TaxCategory } from '@/providers/ShopSettings'
import type { Product } from '@/payload-types'
import { useState, useEffect } from 'react'

interface ProductTag {
  id: string
  name: string
  color?: string | null
}

interface ProductCardProps {
  product: {
    id: string
    slug: string
    title: string
    priceInRON: number
    displayPrice?: number  // Pre-calculated display price (with VAT if needed)
    imageUrl: string | null
    secondaryImageUrl?: string | null
    badge?: string | null
    tags?: ProductTag[]
    stock?: number
    brand?: string | null
    taxCategory?: TaxCategory | null  // Product-level VAT category
  }
  variant?: 'default' | 'compact' | 'horizontal'
  className?: string
  showQuickView?: boolean
  showWishlist?: boolean
}

/**
 * ProductCard Component
 *
 * Card produs îmbunătățit cu:
 * - Badge-uri pentru tag-uri (Nou, Reducere, etc.)
 * - Imagine secundară la hover
 * - Buton quick view și wishlist
 * - Procent reducere calculat
 * - Design consistent cu tema
 *
 * Respectă best practices:
 * - Folosește variabile CSS ale temei
 * - Touch targets de minim 44x44px
 * - Tranziții smooth
 */
export function ProductCard({
  product,
  variant = 'default',
  className,
  showQuickView = false,
  showWishlist = false,
}: ProductCardProps) {
  const shopSettings = useShopSettings()

  // Track hydration state to prevent mismatch in dev mode (Turbopack/HMR issue)
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const {
    id,
    slug,
    title,
    priceInRON,
    displayPrice: preCalculatedPrice,
    imageUrl,
    secondaryImageUrl,
    badge,
    tags = [],
    stock = 0,
    brand,
    taxCategory,
  } = product

  // Use pre-calculated display price if available (from server component)
  // Otherwise calculate it (for client-side renders or when not provided)
  const displayPrice = preCalculatedPrice ?? getDisplayPrice(priceInRON, shopSettings, taxCategory ?? undefined)

  // Format price with currency from settings
  const formattedPrice = `${Math.round(displayPrice)} ${shopSettings.currencySymbol.toUpperCase()}`
  const isOutOfStock = stock <= 0

  if (variant === 'horizontal') {
    return (
      <div
        className={cn(
          'flex gap-4 p-4 bg-theme-surface rounded-[var(--radius-card)] shadow-theme-card hover:shadow-theme-card-hover transition-shadow',
          className
        )}
      >
        {/* Image */}
        <Link href={`/produse/${slug}`} className="relative w-32 h-32 flex-shrink-0">
          <div className="relative w-full h-full rounded-[var(--radius-sm)] overflow-hidden bg-theme-light">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-theme-text-muted text-sm">
                Fără imagine
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {brand && (
              <p className="text-xs text-theme-text-muted uppercase tracking-wide mb-1">
                {brand}
              </p>
            )}
            <Link href={`/produse/${slug}`}>
              <h3 className="product-card-title font-medium text-theme-text hover:text-theme-primary transition-colors line-clamp-2 mb-2">
                {title}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-theme-text" suppressHydrationWarning>{formattedPrice}</span>
            </div>

            <AddToCart
              product={{ id, title, slug, priceInRON, inventory: stock } as Product}
              className="py-2 px-4 text-sm"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative bg-theme-surface rounded-[var(--radius-card)] shadow-theme-card hover:shadow-theme-card-hover transition-all duration-300',
        variant === 'compact' ? 'p-2' : 'p-3',
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/produse/${slug}`} className="block">
        <div
          className={cn(
            'relative overflow-hidden bg-theme-light rounded-[var(--radius-sm)] mb-3',
            variant === 'compact' ? 'aspect-square' : 'aspect-[4/5]'
          )}
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className={cn(
                  'object-cover transition-all duration-500',
                  secondaryImageUrl
                    ? 'group-hover:opacity-0'
                    : 'group-hover:scale-105'
                )}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {secondaryImageUrl && (
                <Image
                  src={secondaryImageUrl}
                  alt={`${title} - vedere alternativă`}
                  fill
                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-theme-text-muted">
              Fără imagine
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {/* Badge from product (e.g., "-20%", "Nou", etc.) */}
            {badge && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-theme-primary text-white rounded">
                {badge}
              </span>
            )}
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white rounded"
                style={{ backgroundColor: tag.color || 'var(--theme-secondary)' }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-theme-text px-4 py-2 rounded-[var(--radius-button)] font-medium text-sm">
                Stoc epuizat
              </span>
            </div>
          )}

          {/* Quick Actions - Show on Hover */}
          {(showQuickView || showWishlist) && !isOutOfStock && (
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {showWishlist && (
                <button
                  type="button"
                  className="p-2 bg-white rounded-full shadow-md hover:bg-theme-primary hover:text-white transition-colors"
                  aria-label="Adaugă la favorite"
                >
                  <Heart className="w-4 h-4" />
                </button>
              )}
              {showQuickView && (
                <button
                  type="button"
                  className="p-2 bg-white rounded-full shadow-md hover:bg-theme-primary hover:text-white transition-colors"
                  aria-label="Vizualizare rapidă"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        {brand && (
          <p className="text-xs text-theme-text-muted uppercase tracking-wide">
            {brand}
          </p>
        )}

        <Link href={`/produse/${slug}`}>
          <h3
            className={cn(
              'product-card-title font-medium text-theme-text hover:text-theme-primary transition-colors line-clamp-2',
              variant === 'compact' ? 'text-sm' : ''
            )}
          >
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-theme-text" suppressHydrationWarning>{formattedPrice}</span>
        </div>

        {/* Add to Cart */}
        {variant !== 'compact' && (
          <AddToCart
            product={{ id, title, slug, priceInRON, inventory: stock } as Product}
            className="w-full py-2.5 text-sm mt-2"
          />
        )}
      </div>
    </div>
  )
}
