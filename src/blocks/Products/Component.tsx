'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/payload-types'
import { useToast } from '@/components/Toast'

interface Product {
  id: string
  title: string
  slug: string
  price?: number
  salePrice?: number
  badge?: string
  featured?: boolean
  images?: Array<{ image: Media | string }>
  category?: { title: string; slug: string } | string
}

interface ProductsBlockProps {
  variant?: 'grid-4' | 'grid-3' | 'carousel' | 'list' | 'featured'
  heading?: string
  subheading?: string
  showPrice?: boolean
  showSalePrice?: boolean
  showAddToCart?: boolean
  ctaButton?: {
    enabled?: boolean
    label?: string
    link?: string
  }
  backgroundColor?: 'default' | 'light' | 'dark'
  products: Product[]
}

export function ProductsBlock({
  variant = 'grid-4',
  heading,
  subheading,
  showPrice = true,
  showSalePrice = true,
  showAddToCart = false,
  ctaButton,
  backgroundColor = 'default',
  products,
}: ProductsBlockProps) {
  const { showToast } = useToast()

  const bgClasses = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }

  const gridClasses = {
    'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    carousel: 'flex overflow-x-auto gap-6 snap-x snap-mandatory',
    list: 'grid-cols-1',
    featured: 'grid-cols-1 lg:grid-cols-2',
  }

  const getImageUrl = (product: Product): string | null => {
    if (!product.images || product.images.length === 0) return null
    const firstImage = product.images[0]?.image
    if (typeof firstImage === 'string') return firstImage
    return firstImage?.url || null
  }

  const handleAddToCart = async (product: Product) => {
    // Simple cart implementation - stores in localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: { id: string }) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.salePrice || product.price,
        image: getImageUrl(product),
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // Dispatch event for cart update
    window.dispatchEvent(new CustomEvent('cartUpdated'))

    // Show feedback with toast
    showToast(`${product.title} a fost adaugat in cos!`, 'success')
  }

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
                className={`text-3xl md:text-4xl font-bold mb-4 ${backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className={`text-lg max-w-2xl mx-auto ${backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid gap-6 ${variant === 'carousel' ? '' : gridClasses[variant]}`}>
          {products.map((product, index) => {
            const imageUrl = getImageUrl(product)
            const hasDiscount = product.salePrice && product.price && product.salePrice < product.price

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
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📦</span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  {product.category && typeof product.category === 'object' && (
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category.title}
                    </span>
                  )}

                  {/* Title */}
                  <Link href={`/produse/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  {showPrice && product.price && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {showSalePrice && hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {showAddToCart && (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-3 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Adauga in cos
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
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-primary text-white hover:bg-primary/90'
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
