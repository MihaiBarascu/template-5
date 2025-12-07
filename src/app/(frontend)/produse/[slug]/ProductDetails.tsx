'use client'

/**
 * ProductDetails Component
 * Updated to use the official Payload ecommerce plugin AddToCart component
 * Uses useCart() from plugin (database cart, not localStorage)
 */

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCart } from '@/components/cart'
import { Breadcrumbs } from '@/components/ecommerce/Breadcrumbs'
import type { Product } from '@/payload-types'

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  listType?: string
  url?: string
  target?: string
}

function RichTextContent({ nodes }: { nodes: LexicalNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === 'text') {
          let content: React.ReactNode = node.text || ''
          if (node.format) {
            if (node.format & 1) content = <strong key={`bold-${index}`}>{content}</strong>
            if (node.format & 2) content = <em key={`italic-${index}`}>{content}</em>
            if (node.format & 8) content = <u key={`underline-${index}`}>{content}</u>
            if (node.format & 16) content = <code key={`code-${index}`}>{content}</code>
          }
          return <React.Fragment key={index}>{content}</React.Fragment>
        }
        if (node.type === 'paragraph') {
          return (
            <p key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </p>
          )
        }
        if (node.type === 'heading') {
          const tag = node.tag || 'h2'
          const HeadingTag = tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
          return (
            <HeadingTag key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </HeadingTag>
          )
        }
        if (node.type === 'list') {
          const Tag = node.listType === 'number' ? 'ol' : 'ul'
          return (
            <Tag key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </Tag>
          )
        }
        if (node.type === 'listitem') {
          return (
            <li key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </li>
          )
        }
        if (node.type === 'link') {
          return (
            <a
              key={index}
              href={node.url || '#'}
              target={node.target || undefined}
              rel={node.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </a>
          )
        }
        if (node.type === 'quote') {
          return (
            <blockquote key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </blockquote>
          )
        }
        if (node.type === 'linebreak') {
          return <br key={index} />
        }
        if (node.children) {
          return <RichTextContent key={index} nodes={node.children} />
        }
        return null
      })}
    </>
  )
}

// Price formatter
function formatPrice(amount: number, currency = 'RON') {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

interface ProductDetailsProps {
  product: Product
  category: { title: string; slug: string } | null
  relatedProducts: Array<{
    id: string
    slug: string
    title: string
    priceInRON: number
    imageUrl: string | null
  }>
}

export function ProductDetails({ product, category, relatedProducts }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Extract image URLs from Product
  const images = (product.images || [])
    .map((img) => {
      const imgData = img.image && typeof img.image !== 'string' ? img.image : null
      return imgData?.url || null
    })
    .filter((url): url is string => url !== null)

  // Get price from plugin's priceInRON field
  const price = product.priceInRON ?? 0

  const mainImageUrl = images[selectedImageIndex] || null
  const inventory = product.inventory ?? 0

  const openLightbox = () => {
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <main className="py-8 bg-theme-surface">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <Breadcrumbs
          items={[
            { label: 'Produse', href: '/produse' },
            ...(category ? [{ label: category.title, href: `/produse?categorie=${category.slug}` }] : []),
            { label: product.title },
          ]}
        />
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden bg-theme-surface-secondary cursor-zoom-in border border-theme-border"
              onClick={openLightbox}
            >
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-theme-text-muted">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Badge for discounts can be managed via product.badge field */}
              {/* Zoom icon overlay */}
              {mainImageUrl && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <svg className="w-10 h-10 text-white opacity-0 hover:opacity-70 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-theme-surface-secondary cursor-pointer transition-all border ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-theme-primary border-theme-primary'
                        : 'border-theme-border hover:border-theme-primary'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {category && (
              <Link
                href={`/produse?categorie=${category.slug}`}
                className="inline-block text-sm text-theme-primary hover:underline"
              >
                {category.title}
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-theme-text">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-theme-text">
                {formatPrice(price)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {inventory > 0 ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">În stoc ({inventory} buc.)</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Stoc epuizat</span>
                </>
              )}
            </div>

            {/* Add to Cart - Using new plugin-based component */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCart
                product={product}
                className="flex-1 py-4 text-lg"
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <p className="text-sm text-theme-text-muted">
                <span className="font-medium">{product.badge}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description ? (
          <div className="mt-12 border-t border-theme-border pt-8">
            <h2 className="text-2xl font-bold mb-6 text-theme-text">Descriere</h2>
            <div className="prose max-w-none text-theme-text">
              {typeof product.description === 'object' &&
               product.description !== null &&
               'root' in product.description &&
               (product.description as { root?: { children?: LexicalNode[] } }).root?.children ? (
                <RichTextContent nodes={(product.description as { root: { children: LexicalNode[] } }).root.children} />
              ) : (
                <p>{String(product.description)}</p>
              )}
            </div>
          </div>
        ) : null}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-theme-border pt-12">
            <h2 className="text-2xl font-bold mb-8 text-theme-text">Produse similare</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/produse/${related.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden bg-theme-surface-secondary mb-3 border border-theme-border">
                    {related.imageUrl ? (
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-theme-text-muted">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-theme-text group-hover:text-theme-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="mt-1">
                    <span className="font-bold text-theme-text">{formatPrice(related.priceInRON)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && mainImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 z-10 p-2"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-10 p-2"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`${product.title} - ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
