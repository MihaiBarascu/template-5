'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import type { BeforeAfterBlock as BeforeAfterBlockType, Media } from '@/payload-types'

// Helper to get image URL
function getImageUrl(image: Media | string | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

function getImageAlt(image: Media | string | null | undefined): string {
  if (!image || typeof image === 'string') return ''
  return image.alt || ''
}

// Single Before/After Slider Component
function SliderComparison({
  beforeImage,
  afterImage,
  title,
  description,
  initialPosition = 50,
  isDark = false,
}: {
  beforeImage: Media | string
  afterImage: Media | string
  title?: string | null
  description?: string | null
  initialPosition?: number
  isDark?: boolean
}) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const beforeUrl = getImageUrl(beforeImage)
  const afterUrl = getImageUrl(afterImage)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const position = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.min(Math.max(position, 0), 100))
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    },
    [isDragging, handleMove],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX)
    },
    [handleMove],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX)
    },
    [handleMove],
  )

  if (!beforeUrl || !afterUrl) return null

  return (
    <div className="space-y-4">
      {/* Title and description */}
      {(title || description) && (
        <div className="text-center mb-4">
          {title && (
            <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-theme-text')}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn('text-sm mt-1', isDark ? 'text-white/70' : 'text-theme-text-muted')}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Slider container */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-col-resize select-none shadow-xl group"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        {/* After Image (background) */}
        <div className="absolute inset-0">
          <Image
            src={afterUrl}
            alt={getImageAlt(afterImage) || 'Dupa'}
            fill
            className="object-cover"
            draggable={false}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Before Image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <Image
            src={beforeUrl}
            alt={getImageAlt(beforeImage) || 'Inainte'}
            fill
            className="object-cover"
            draggable={false}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Slider Handle */}
          <div
            className={cn(
              'absolute bg-white rounded-full shadow-xl flex items-center justify-center',
              'w-10 h-10 -translate-x-1/2 -translate-y-1/2',
              'border-4 border-white',
              'group-hover:scale-110 transition-transform',
            )}
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            {/* Arrows icon */}
            <svg
              className="w-5 h-5 text-theme-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm top-4 left-4">
          Inainte
        </div>
        <div className="absolute px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-theme-primary text-white backdrop-blur-sm top-4 right-4">
          Dupa
        </div>

        {/* Instruction overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            Trage pentru a compara
          </div>
        </div>
      </div>
    </div>
  )
}

// Grid Side-by-Side Component
function GridComparison({
  beforeImage,
  afterImage,
  title,
  description,
  isDark = false,
}: {
  beforeImage: Media | string
  afterImage: Media | string
  title?: string | null
  description?: string | null
  isDark?: boolean
}) {
  const beforeUrl = getImageUrl(beforeImage)
  const afterUrl = getImageUrl(afterImage)

  if (!beforeUrl || !afterUrl) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
          <Image
            src={beforeUrl}
            alt={getImageAlt(beforeImage) || 'Inainte'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full">
            Inainte
          </div>
        </div>

        {/* After */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
          <Image
            src={afterUrl}
            alt={getImageAlt(afterImage) || 'Dupa'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 bg-theme-primary text-white text-sm font-medium px-3 py-1 rounded-full">
            Dupa
          </div>
        </div>
      </div>

      {(title || description) && (
        <div className="text-center">
          {title && (
            <h4 className={cn('font-semibold', isDark ? 'text-white' : 'text-theme-text')}>
              {title}
            </h4>
          )}
          {description && (
            <p className={cn('text-sm mt-1', isDark ? 'text-white/70' : 'text-theme-text-muted')}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Props interface (subset of BeforeAfterBlockType without blockType)
interface BeforeAfterBlockProps {
  variant?: BeforeAfterBlockType['variant']
  backgroundColor?: BeforeAfterBlockType['backgroundColor']
  heading?: string | null
  subheading?: string | null
  items?: BeforeAfterBlockType['items']
  sliderPosition?: number | null
}

// Main Block Component
export function BeforeAfterBlock({
  variant = 'slider',
  backgroundColor = 'default',
  heading,
  subheading,
  items,
  sliderPosition = 50,
}: BeforeAfterBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Background classes
  const bgClasses = {
    default: 'bg-theme-bg',
    light: 'bg-theme-bg-subtle',
    dark: 'bg-theme-bg-inverted',
  }

  const isDark = backgroundColor === 'dark'
  const textClass = isDark ? 'text-white' : 'text-theme-text'
  const mutedClass = isDark ? 'text-white/70' : 'text-theme-text-muted'

  if (!items || items.length === 0) return null

  return (
    <section className={cn('py-16 md:py-24', bgClasses[backgroundColor || 'default'])}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn('heading-h2 font-bold mb-4', textClass)}>{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', mutedClass)}>{subheading}</p>
            )}
          </div>
        )}

        {/* Content based on variant */}
        {variant === 'slider' && (
          <div className="max-w-4xl mx-auto">
            {/* Main slider */}
            <SliderComparison
              beforeImage={items[activeIndex].beforeImage}
              afterImage={items[activeIndex].afterImage}
              title={items[activeIndex].title}
              description={items[activeIndex].description}
              initialPosition={sliderPosition || 50}
              isDark={isDark}
            />

            {/* Thumbnails for multiple items */}
            {items.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {items.map((item, index) => {
                  const thumbUrl = getImageUrl(item.afterImage)
                  if (!thumbUrl) return null
                  return (
                    <button
                      key={item.id || index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        'relative w-20 h-20 rounded-lg overflow-hidden transition-all',
                        activeIndex === index
                          ? 'ring-2 ring-theme-primary ring-offset-2'
                          : 'opacity-60 hover:opacity-100',
                      )}
                    >
                      <Image
                        src={thumbUrl}
                        alt={item.title || `Item ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {variant === 'grid' && (
          <div className="grid md:grid-cols-2 gap-8">
            {items.map((item, index) => (
              <GridComparison
                key={item.id || index}
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                title={item.title}
                description={item.description}
                isDark={isDark}
              />
            ))}
          </div>
        )}

        {variant === 'carousel' && (
          <div className="relative">
            {/* Carousel wrapper */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {items.map((item, index) => (
                  <div key={item.id || index} className="w-full flex-shrink-0 px-4">
                    <div className="max-w-3xl mx-auto">
                      <SliderComparison
                        beforeImage={item.beforeImage}
                        afterImage={item.afterImage}
                        title={item.title}
                        description={item.description}
                        initialPosition={sliderPosition || 50}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel navigation */}
            {items.length > 1 && (
              <>
                {/* Arrows */}
                <button
                  onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))}
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-black/10 hover:bg-black/20 text-theme-text',
                  )}
                  aria-label="Anterior"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))}
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-black/10 hover:bg-black/20 text-theme-text',
                  )}
                  aria-label="Urmator"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        activeIndex === index
                          ? 'w-8 bg-theme-primary'
                          : isDark
                            ? 'bg-white/30 hover:bg-white/50'
                            : 'bg-black/30 hover:bg-black/50',
                      )}
                      aria-label={`Mergi la slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default BeforeAfterBlock
