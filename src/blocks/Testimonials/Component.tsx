'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface Testimonial {
  id: string
  name: string
  role?: string | null
  content: string
  rating?: string | null
  avatar?: {
    url?: string | null
    alt?: string | null
  } | string | null
  source?: string | null
  featured?: boolean | null
  date?: string | null
}

interface TestimonialsBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  onlyFeatured?: boolean
  showRating?: boolean
  showAvatar?: boolean
  showSource?: boolean
  showDate?: boolean
  autoplay?: boolean
  autoplaySpeed?: number
  backgroundColor?: string
  testimonials?: Testimonial[]
}

// Helper to check if avatar is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

// Star Rating Component
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-theme-border fill-theme-light'
          )}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Quote Icon
const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 32 32">
    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
  </svg>
)

// Source Icons
const SourceIcons: Record<string, React.ReactNode> = {
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
}

export function TestimonialsBlock({
  variant = 'carousel',
  heading,
  subheading,
  showRating = true,
  showAvatar = true,
  showSource = true,
  showDate = false,
  autoplay = true,
  autoplaySpeed = 6000,
  backgroundColor = 'light',
  testimonials = [],
}: TestimonialsBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Background classes
  const bgClasses: Record<string, string> = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark',
    primary: 'bg-theme-primary',
  }

  const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [testimonials.length, isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [testimonials.length, isTransitioning])

  useEffect(() => {
    if (variant === 'carousel' && autoplay && testimonials.length > 1) {
      const interval = setInterval(nextSlide, autoplaySpeed)
      return () => clearInterval(interval)
    }
  }, [variant, autoplay, autoplaySpeed, testimonials.length, nextSlide])

  if (testimonials.length === 0) {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.light)}>
        <div className="container mx-auto px-4">
          <div className={cn(
            'text-center py-16 border-2 border-dashed rounded-xl',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            <svg className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-white/40' : 'text-theme-text-muted')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>Nu sunt testimoniale disponibile.</p>
          </div>
        </div>
      </section>
    )
  }

  // Testimonial Card Component
  const TestimonialCard = ({ testimonial, index, featured = false }: { testimonial: Testimonial; index: number; featured?: boolean }) => (
    <div
      className={cn(
        'relative p-6 md:p-8 rounded-[var(--radius-card)]',
        'animate-fade-in-up card-hover',
        featured ? 'text-center' : '',
        isDark
          ? 'bg-white/5 border border-white/10'
          : 'bg-white shadow-lg hover:shadow-xl border border-theme-border/50',
        index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
      )}
    >
      {/* Quote Icon - decorative, only for non-featured cards */}
      {!featured && (
        <QuoteIcon className={cn(
          'absolute w-12 h-12 top-4 right-4',
          isDark ? 'text-white/10' : 'text-theme-primary/10'
        )} />
      )}

      {/* Rating */}
      {showRating && testimonial.rating && (
        <div className={cn('mb-4 relative z-10', featured ? 'flex justify-center' : '')}>
          <StarRating rating={parseInt(testimonial.rating) || 5} size={featured ? 'lg' : 'md'} />
        </div>
      )}

      {/* Content */}
      <blockquote className={cn(
        'relative z-10 mb-6 leading-relaxed',
        featured ? 'text-xl md:text-2xl font-medium' : 'text-base md:text-lg',
        isDark ? 'text-white/90' : 'text-theme-text'
      )}>
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Author */}
      <div className={cn(
        'flex items-center gap-4',
        featured ? 'justify-center' : ''
      )}>
        {/* Avatar */}
        {showAvatar && (
          <div className={cn(
            'relative flex-shrink-0 rounded-full overflow-hidden',
            'ring-2 transition-all duration-300',
            isDark ? 'ring-white/20' : 'ring-theme-primary/20',
            featured ? 'w-16 h-16' : 'w-12 h-12'
          )}>
            {isValidMedia(testimonial.avatar) ? (
              <Media
                resource={testimonial.avatar as MediaType}
                fill
                size="64px"
                imgClassName="object-cover"
              />
            ) : (
              <div className={cn(
                'w-full h-full flex items-center justify-center font-bold',
                'bg-gradient-to-br from-theme-primary to-theme-secondary text-white',
                featured ? 'text-2xl' : 'text-lg'
              )}>
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className={featured ? 'text-center' : ''}>
          <div className={cn(
            'font-semibold',
            isDark ? 'text-white' : 'text-theme-text',
            featured ? 'text-lg' : 'text-base'
          )}>
            {testimonial.name}
          </div>
          {testimonial.role && (
            <div className={cn(
              'text-sm',
              isDark ? 'text-white/60' : 'text-theme-text-light'
            )}>
              {testimonial.role}
            </div>
          )}
          {showDate && testimonial.date && (
            <div className={cn(
              'text-xs mt-1',
              isDark ? 'text-white/40' : 'text-theme-text-muted'
            )}>
              {testimonial.date}
            </div>
          )}
        </div>

        {/* Source */}
        {showSource && testimonial.source && (
          <div className={cn('ml-auto', featured && 'hidden')}>
            {SourceIcons[testimonial.source.toLowerCase()] || (
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                isDark ? 'bg-white/10 text-white/70' : 'bg-theme-light text-theme-text-light'
              )}>
                {testimonial.source}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Carousel Variant
  if (variant === 'carousel') {
    return (
      <section className={cn('py-section overflow-hidden', bgClasses[backgroundColor] || bgClasses.light)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                  {subheading}
                </p>
              )}
            </div>
          )}

          {/* Carousel */}
          <div className="relative max-w-4xl mx-auto">
            {/* Cards */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-600 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id || index} className="w-full flex-shrink-0 px-4">
                    <TestimonialCard testimonial={testimonial} index={0} featured />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12',
                    'p-3 rounded-full transition-all duration-300 hover:scale-110',
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white shadow-lg text-theme-text hover:bg-theme-primary hover:text-white'
                  )}
                  aria-label="Previous testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12',
                    'p-3 rounded-full transition-all duration-300 hover:scale-110',
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white shadow-lg text-theme-text hover:bg-theme-primary hover:text-white'
                  )}
                  aria-label="Next testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true)
                        setCurrentIndex(index)
                        setTimeout(() => setIsTransitioning(false), 600)
                      }
                    }}
                    className={cn(
                      'transition-all duration-300 rounded-full',
                      index === currentIndex
                        ? cn('w-8 h-2', isDark ? 'bg-white' : 'bg-theme-primary')
                        : cn('w-2 h-2', isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-theme-border hover:bg-theme-text-muted')
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Single Featured Variant
  if (variant === 'single-featured') {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.light)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                  {subheading}
                </p>
              )}
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <TestimonialCard testimonial={testimonials[0]} index={0} featured />
          </div>
        </div>
      </section>
    )
  }

  // Masonry Variant
  if (variant === 'masonry') {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.light)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                  {subheading}
                </p>
              )}
            </div>
          )}

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id || index} className="break-inside-avoid mb-6">
                <TestimonialCard testimonial={testimonial} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Grid Variant (default)
  return (
    <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.light)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsBlock
