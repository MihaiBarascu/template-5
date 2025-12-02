'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

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

interface ProductDetailsProps {
  product: {
    id: string
    title: string
    price: number
    salePrice: number
    hasDiscount: boolean
    inventory: number
    badge?: string
    description?: unknown
    images: string[]
  }
  category: { title: string; slug: string } | null
  relatedProducts: Array<{
    id: string
    slug: string
    title: string
    price: number
    salePrice: number
    hasDiscount: boolean
    imageUrl: string | null
  }>
}

export function ProductDetails({ product, category, relatedProducts }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const discountPercent = product.hasDiscount
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  const mainImageUrl = product.images[selectedImageIndex] || null

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
    if (product.images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-theme-primary">Acasa</Link>
          <span>/</span>
          <Link href="/produse" className="hover:text-theme-primary">Produse</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/categorii/${category.slug}`} className="hover:text-theme-primary">
                {category.title}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
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
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Fara imagine
                </div>
              )}
              {product.hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{discountPercent}%
                </div>
              )}
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
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition-all ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-theme-primary'
                        : 'hover:ring-2 ring-gray-300'
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
                href={`/categorii/${category.slug}`}
                className="inline-block text-sm text-theme-primary hover:underline"
              >
                {category.title}
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {product.salePrice} RON
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {product.price} RON
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {product.price} RON
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inventory > 0 ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">In stoc</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">Disponibil</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.hasDiscount ? product.salePrice : product.price,
                  image: mainImageUrl ?? undefined,
                }}
                className="flex-1 py-4 text-lg"
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">{product.badge}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description ? (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Descriere</h2>
            <div className="prose max-w-none">
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
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">Produse similare</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/produse/${related.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    {related.imageUrl ? (
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Fara imagine
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-theme-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="mt-1">
                    {related.hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600">{related.salePrice} RON</span>
                        <span className="text-sm text-gray-400 line-through">{related.price} RON</span>
                      </div>
                    ) : (
                      <span className="font-bold">{related.price} RON</span>
                    )}
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
          {product.images.length > 1 && (
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
          {product.images.length > 1 && (
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
              src={product.images[selectedImageIndex]}
              alt={`${product.title} - ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Image counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {product.images.length}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
