'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { useToast } from '@/components/Toast'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'

interface Product {
  id: string
  title: string
  slug: string
  priceInRON?: number | null
  badge?: string | null
  featured?: boolean | null
  images?: Array<{ image: MediaType | string }> | null
  category?: { title: string; slug: string } | string | null
  inventory?: number | null
}

interface ProductsBlockProps {
  variant?: 'grid-4' | 'grid-3' | 'carousel' | 'list' | 'featured'
  heading?: string
  subheading?: string
  showPrice?: boolean
  showAddToCart?: boolean
  ctaButton?: {
    enabled?: boolean | null
    label?: string | null
    link?: string | null
  } | null
  backgroundColor?: 'default' | 'light' | 'dark'
  products: Product[]
}

export function ProductsBlock({
  variant = 'grid-4',
  heading,
  subheading,
  showPrice = true,
  showAddToCart = false,
  ctaButton,
  backgroundColor = 'default',
  products,
}: ProductsBlockProps) {
  const { showToast } = useToast()
  const { addItem } = useCart()
  const [addingProductId, setAddingProductId] = useState<string | null>(null)

  const bgClasses = {
    default: 'bg-white',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }

  const gridClasses = {
    'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    carousel: 'flex overflow-x-auto gap-6 snap-x snap-mandatory',
    list: 'grid-cols-1',
    featured: 'grid-cols-1 lg:grid-cols-2',
  }

  const getFirstImage = (product: Product): MediaType | null => {
    if (!product.images || product.images.length === 0) return null
    const firstImage = product.images[0]?.image
    if (typeof firstImage === 'string') return null
    return firstImage || null
  }

  const handleAddToCart = useCallback(async (product: Product) => {
    setAddingProductId(product.id)
    try {
      await addItem({
        product: product.id,
      })
      showToast(`${product.title} a fost adaugat in cos!`, 'success')
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('A aparut o eroare. Incercati din nou.', 'error')
    } finally {
      setAddingProductId(null)
    }
  }, [addItem, showToast])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className={`py-16 ${bgClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 ${backgroundColor === 'dark' ? 'text-white' : 'text-theme-text'}`}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className={`text-lg max-w-2xl mx-auto ${backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'}`}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid gap-6 ${variant === 'carousel' ? '' : gridClasses[variant]}`}>
          {products.map((product, index) => {
            const productImage = getFirstImage(product)
            const isOutOfStock = (product.inventory ?? 0) <= 0
            const isAddingThis = addingProductId === product.id

            return (
              <div
                key={product.id || index}
                className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                  variant === 'carousel' ? 'min-w-[280px] snap-start' : ''
                }`}
              >
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}

                {/* Image */}
                <Link href={`/produse/${product.slug}`} className="block aspect-square relative overflow-hidden">
                  {productImage ? (
                    <Media
                      resource={productImage}
                      fill
                      size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                      imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-theme-light flex items-center justify-center">
                      <span className="text-theme-text-muted text-4xl">📦</span>
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-theme-text px-4 py-2 rounded-md font-medium text-sm">
                        Stoc epuizat
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  {product.category && typeof product.category === 'object' && (
                    <span className="text-xs text-theme-text-muted uppercase tracking-wide">
                      {product.category.title}
                    </span>
                  )}

                  {/* Title */}
                  <Link href={`/produse/${product.slug}`}>
                    <h3 className="font-semibold text-theme-text mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  {showPrice && product.priceInRON && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-theme-text">
                        {formatPrice(product.priceInRON)}
                      </span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {showAddToCart && (
                    <button
                      onClick={() => !isOutOfStock && !isAddingThis && handleAddToCart(product)}
                      disabled={isOutOfStock || isAddingThis}
                      className={`mt-3 w-full py-2 px-4 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                        isOutOfStock || isAddingThis
                          ? 'bg-theme-border text-theme-text-muted cursor-not-allowed'
                          : 'bg-theme-primary text-white hover:bg-theme-primary/90'
                      }`}
                    >
                      {isAddingThis ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Se adauga...
                        </>
                      ) : isOutOfStock ? 'Indisponibil' : 'Adauga in cos'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.link && (
          <div className="text-center mt-10">
            <Link
              href={ctaButton.link}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                backgroundColor === 'dark'
                  ? 'bg-white text-theme-text hover:bg-theme-light'
                  : 'bg-theme-primary text-white hover:bg-theme-primary/90'
              }`}
            >
              {ctaButton.label || 'Vezi toate produsele'}
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsBlock
