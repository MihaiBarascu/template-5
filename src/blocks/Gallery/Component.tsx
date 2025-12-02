'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'

interface GalleryImage {
  id: string
  url: string
  alt?: string
  filename?: string
}

interface GalleryBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  columns?: string
  gap?: string
  aspectRatio?: string
  lightbox?: boolean
  backgroundColor?: string
  images?: GalleryImage[]
}

export function GalleryBlock({
  variant = 'grid',
  heading,
  subheading,
  columns = '3',
  gap = 'medium',
  aspectRatio = 'square',
  lightbox = true,
  backgroundColor = 'default',
  images = [],
}: GalleryBlockProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }[backgroundColor] || 'bg-white'

  const gapClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }[gap] || 'gap-4'

  const getColumns = () => {
    switch (columns) {
      case '2':
        return 'md:grid-cols-2'
      case '4':
        return 'md:grid-cols-2 lg:grid-cols-4'
      case '5':
        return 'md:grid-cols-3 lg:grid-cols-5'
      default:
        return 'md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const getAspectRatio = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4]'
      case 'landscape':
        return 'aspect-video'
      case 'wide':
        return 'aspect-[2/1]'
      default:
        return 'aspect-square'
    }
  }

  if (images.length === 0) {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Nu sunt imagini in galerie.</p>
        </div>
      </section>
    )
  }

  const openLightbox = (index: number) => {
    if (lightbox) {
      setLightboxIndex(index)
      document.body.style.overflow = 'hidden'
    }
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
    }
  }

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {variant === 'masonry' ? (
          <div className={cn('columns-1 md:columns-2 lg:columns-3', gapClass)}>
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={cn('break-inside-avoid mb-4 overflow-hidden rounded-lg cursor-pointer group')}
                onClick={() => openLightbox(index)}
              >
                <div className="relative">
                  <Image
                    src={image.url}
                    alt={image.alt || image.filename || `Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  {lightbox && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('grid', getColumns(), gapClass)}>
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={cn(
                  'relative overflow-hidden rounded-lg cursor-pointer group',
                  getAspectRatio()
                )}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || image.filename || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {lightbox && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || `Gallery image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  )
}

export default GalleryBlock
