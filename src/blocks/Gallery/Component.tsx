'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface GalleryImage {
  id: string
  url?: string
  alt?: string
  filename?: string
  caption?: string
  category?: string
  // Full Media object for high-quality rendering
  media?: MediaType | null
}

interface GalleryLabels {
  allFilter?: string
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
  showCaptions?: boolean
  images?: GalleryImage[]
  categories?: string[]
  labels?: GalleryLabels
}

// Icon components
const ZoomIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export function GalleryBlock({
  variant = 'grid',
  heading,
  subheading,
  columns = '3',
  gap = 'medium',
  aspectRatio = 'square',
  lightbox = true,
  backgroundColor = 'default',
  showCaptions = false,
  images = [],
  labels = {},
}: GalleryBlockProps) {
  // Configurable labels with defaults
  const allFilterLabel = labels.allFilter || 'Toate'

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Extract unique categories from images
  const categories = ['all', ...Array.from(new Set(images.filter(img => img.category).map(img => img.category!)))]

  // Filter images by category
  const filteredImages = activeFilter === 'all'
    ? images
    : images.filter(img => img.category === activeFilter)

  // Background classes
  const bgClasses: Record<string, string> = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }

  // Gap classes
  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6 md:gap-8',
  }

  // Column classes
  const getColumns = (): string => {
    switch (columns) {
      case '2': return 'grid-cols-1 sm:grid-cols-2'
      case '4': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      case '5': return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Aspect ratio classes
  const getAspectRatio = (): string => {
    switch (aspectRatio) {
      case 'portrait': return 'aspect-[3/4]'
      case 'landscape': return 'aspect-video'
      case 'wide': return 'aspect-[2/1]'
      case 'auto': return ''
      default: return 'aspect-square'
    }
  }

  // Lightbox handlers
  const openLightbox = useCallback((index: number) => {
    if (lightbox) {
      setLightboxIndex(index)
      document.body.style.overflow = 'hidden'
    }
  }, [lightbox])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
    }
  }, [lightboxIndex, filteredImages.length])

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
    }
  }, [lightboxIndex, filteredImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, nextImage, prevImage, closeLightbox])

  if (images.length === 0) {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.default)}>
        <div className="container mx-auto px-4">
          <div className="text-center py-16 border-2 border-dashed border-theme-border rounded-xl">
            <svg className="w-16 h-16 mx-auto text-theme-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-theme-text-muted">Nu sunt imagini în galerie.</p>
          </div>
        </div>
      </section>
    )
  }

  // Render Gallery Item
  const renderGalleryItem = (image: GalleryImage, index: number) => {
    const actualIndex = images.findIndex(img => img.id === image.id)

    return (
      <div
        key={image.id || index}
        className={cn(
          'group relative overflow-hidden rounded-[var(--radius-card)] cursor-pointer',
          'animate-fade-in-up',
          variant === 'masonry' ? 'break-inside-avoid mb-4' : getAspectRatio(),
          index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
        )}
        onClick={() => openLightbox(actualIndex)}
      >
        {/* Image */}
        <div className={cn(
          'relative w-full h-full',
          variant === 'masonry' ? 'aspect-auto' : ''
        )}>
          {image.media ? (
            <Media
              resource={image.media}
              fill={variant !== 'masonry'}
              size={variant === 'masonry' ? undefined : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              imgClassName={cn(
                variant === 'masonry' ? 'w-full h-auto' : 'object-cover',
                'transition-all duration-700 ease-out',
                'group-hover:scale-110'
              )}
            />
          ) : image.url ? (
            <Image
              src={image.url}
              alt={image.alt || image.filename || `Gallery image ${index + 1}`}
              fill={variant !== 'masonry'}
              width={variant === 'masonry' ? 800 : undefined}
              height={variant === 'masonry' ? 600 : undefined}
              sizes={variant === 'masonry' ? undefined : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              className={cn(
                variant === 'masonry' ? 'w-full h-auto' : 'object-cover',
                'transition-all duration-700 ease-out',
                'group-hover:scale-110'
              )}
            />
          ) : null}
        </div>

        {/* Overlay - gradient from bottom */}
        <div className={cn(
          'absolute inset-0 transition-all duration-300',
          'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
          'opacity-0 group-hover:opacity-100'
        )} />

        {/* Hover Content */}
        <div className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          'transition-all duration-300',
          'opacity-0 group-hover:opacity-100'
        )}>
          {/* Zoom Icon */}
          <div className={cn(
            'w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm',
            'flex items-center justify-center text-white',
            'transform scale-50 group-hover:scale-100 transition-transform duration-300',
            'border border-white/30'
          )}>
            <ZoomIcon />
          </div>

          {/* Caption */}
          {showCaptions && image.caption && (
            <p className={cn(
              'absolute bottom-4 left-4 right-4',
              'text-white text-sm font-medium',
              'transform translate-y-4 group-hover:translate-y-0',
              'transition-transform duration-300 delay-100',
              'line-clamp-2'
            )}>
              {image.caption}
            </p>
          )}
        </div>

        {/* Category Badge */}
        {image.category && (
          <span className={cn(
            'absolute top-3 left-3 px-3 py-1',
            'bg-theme-primary/90 text-white text-xs font-medium',
            'rounded-full backdrop-blur-sm',
            'transform -translate-y-2 opacity-0',
            'group-hover:translate-y-0 group-hover:opacity-100',
            'transition-all duration-300'
          )}>
            {image.category}
          </span>
        )}
      </div>
    )
  }

  return (
    <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.default)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'heading-h2 font-bold mb-4',
                backgroundColor === 'dark' ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn(
                'text-lg max-w-2xl mx-auto',
                backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium',
                  'transition-all duration-300',
                  activeFilter === category
                    ? 'bg-theme-primary text-white shadow-lg scale-105'
                    : cn(
                        'hover:scale-105',
                        backgroundColor === 'dark'
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-theme-light text-theme-text hover:bg-theme-primary/10'
                      )
                )}
              >
                {category === 'all' ? allFilterLabel : category}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {variant === 'masonry' ? (
          <div className={cn('columns-1 sm:columns-2 lg:columns-3', gapClasses[gap] || gapClasses.medium)}>
            {filteredImages.map((image, index) => renderGalleryItem(image, index))}
          </div>
        ) : variant === 'instagram' ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
            {filteredImages.slice(0, 12).map((image, index) => (
              <div
                key={image.id || index}
                className="aspect-square relative group overflow-hidden cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                {image.media ? (
                  <Media
                    resource={image.media}
                    fill
                    size="(max-width: 768px) 33vw, 16vw"
                    imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : image.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt || ''}
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIcon />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('grid', getColumns(), gapClasses[gap] || gapClasses.medium)}>
            {filteredImages.map((image, index) => renderGalleryItem(image, index))}
          </div>
        )}

        {/* View More Button - for instagram style */}
        {variant === 'instagram' && images.length > 12 && (
          <div className="text-center mt-8">
            <button className={cn(
              'inline-flex items-center gap-2 px-8 py-3',
              'bg-theme-primary text-white font-semibold',
              'rounded-[var(--radius-button)] transition-all duration-300',
              'hover:bg-theme-secondary hover:scale-105'
            )}>
              Vezi mai multe
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Professional Lightbox */}
      {lightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            className={cn(
              'absolute top-4 right-4 z-20',
              'p-2 rounded-full bg-white/10 text-white',
              'hover:bg-white/20 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Close lightbox"
          >
            <CloseIcon />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className={cn(
              'absolute left-4 z-20',
              'p-3 rounded-full bg-white/10 text-white',
              'hover:bg-white/20 transition-all hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className={cn(
              'absolute right-4 z-20',
              'p-3 rounded-full bg-white/10 text-white',
              'hover:bg-white/20 transition-all hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          {/* Main Image */}
          <div
            className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredImages[lightboxIndex].media ? (
              <Media
                resource={filteredImages[lightboxIndex].media}
                fill
                size="100vw"
                imgClassName="object-contain"
                priority
              />
            ) : filteredImages[lightboxIndex].url ? (
              <Image
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].alt || `Gallery image ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            ) : null}
          </div>

          {/* Bottom Info Bar */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 z-20',
            'bg-gradient-to-t from-black/80 to-transparent',
            'py-6 px-8'
          )}>
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              {/* Caption */}
              <div className="text-white">
                {filteredImages[lightboxIndex].caption && (
                  <p className="text-lg font-medium mb-1">
                    {filteredImages[lightboxIndex].caption}
                  </p>
                )}
                {filteredImages[lightboxIndex].category && (
                  <span className="text-sm text-white/70">
                    {filteredImages[lightboxIndex].category}
                  </span>
                )}
              </div>

              {/* Counter */}
              <div className="text-white/80 text-sm font-medium">
                <span className="text-white text-lg">{lightboxIndex + 1}</span>
                <span className="mx-2">/</span>
                <span>{filteredImages.length}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className={cn(
            'absolute bottom-24 left-1/2 -translate-x-1/2 z-20',
            'flex gap-2 max-w-[80vw] overflow-x-auto py-2 px-4',
            'scrollbar-hide'
          )}>
            {filteredImages.map((image, index) => (
              <button
                key={image.id || index}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(index)
                }}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative',
                  'transition-all duration-200',
                  'focus:outline-none',
                  index === lightboxIndex
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-50 hover:opacity-80'
                )}
              >
                {image.media ? (
                  <Media
                    resource={image.media}
                    fill
                    size="80px"
                    imgClassName="object-cover"
                  />
                ) : image.url ? (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom scrollbar hide style */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default GalleryBlock
