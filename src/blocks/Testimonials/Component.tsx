'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import { Play, X } from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'

// Shared utilities
import { getBgClasses, isDarkBackground, getCardClasses, getEmptyStateClasses } from '../_shared/themeHelpers'
import { isValidMedia } from '../_shared/mediaHelpers'
import { StarRating, QuoteIcon, getSourceIcon, ChevronIcon, PlayButton, EmptyStateIcon } from '../_shared/iconComponents'

// Helper to parse video URLs
function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct'; embedUrl: string } | null {
  if (!url) return null

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1` }
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` }
  }

  // Direct video URL
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'direct', embedUrl: url }
  }

  return null
}

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
  videoUrl?: string | null
  videoPoster?: {
    url?: string | null
    alt?: string | null
  } | string | null
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
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  // Use shared theme helpers
  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

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
      <section className={cn('py-section', bgClass)}>
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
            {getSourceIcon(testimonial.source) || (
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
      <section className={cn('py-section overflow-hidden', bgClass)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
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
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
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
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
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

  // Video Grid Variant
  if (variant === 'video-grid') {
    const videoTestimonials = testimonials.filter(t => t.videoUrl)

    if (videoTestimonials.length === 0) {
      return (
        <section className={cn('py-section', bgClass)}>
          <div className="container mx-auto px-4">
            <div className={cn(
              'text-center py-16 border-2 border-dashed rounded-xl',
              isDark ? 'border-white/20' : 'border-theme-border'
            )}>
              <Play className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-white/40' : 'text-theme-text-muted')} />
              <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>Nu sunt video testimoniale disponibile.</p>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
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

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTestimonials.map((testimonial, index) => {
              const videoInfo = parseVideoUrl(testimonial.videoUrl || '')
              const posterImage = isValidMedia(testimonial.videoPoster) ? testimonial.videoPoster as MediaType : null

              return (
                <div
                  key={testimonial.id || index}
                  className={cn(
                    'group relative rounded-[var(--radius-card)] overflow-hidden',
                    'animate-fade-in-up card-hover cursor-pointer',
                    isDark
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-white shadow-lg hover:shadow-xl border border-theme-border/50',
                    index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
                  )}
                  onClick={() => videoInfo && setActiveVideo(testimonial.id)}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {posterImage?.url ? (
                      <Media
                        resource={posterImage}
                        fill
                        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : isValidMedia(testimonial.avatar) ? (
                      <Media
                        resource={testimonial.avatar as MediaType}
                        fill
                        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={cn(
                        'w-full h-full flex items-center justify-center',
                        'bg-gradient-to-br from-theme-primary to-theme-secondary'
                      )}>
                        <span className="text-4xl font-bold text-white">{testimonial.name.charAt(0)}</span>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className={cn(
                        'w-16 h-16 rounded-full flex items-center justify-center',
                        'bg-white/90 text-theme-primary transition-all duration-300',
                        'group-hover:scale-110 group-hover:bg-white shadow-lg'
                      )}>
                        <Play className="w-7 h-7 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5">
                    {/* Rating */}
                    {showRating && testimonial.rating && (
                      <div className="mb-3">
                        <StarRating rating={parseInt(testimonial.rating) || 5} size="sm" />
                      </div>
                    )}

                    {/* Quote Preview */}
                    <p className={cn(
                      'text-sm line-clamp-2 mb-3',
                      isDark ? 'text-white/70' : 'text-theme-text-light'
                    )}>
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      {showAvatar && (
                        <div className={cn(
                          'w-10 h-10 rounded-full overflow-hidden flex-shrink-0',
                          'ring-2',
                          isDark ? 'ring-white/20' : 'ring-theme-primary/20'
                        )}>
                          {isValidMedia(testimonial.avatar) ? (
                            <Media
                              resource={testimonial.avatar as MediaType}
                              fill
                              size="40px"
                              imgClassName="object-cover"
                            />
                          ) : (
                            <div className={cn(
                              'w-full h-full flex items-center justify-center text-sm font-bold',
                              'bg-gradient-to-br from-theme-primary to-theme-secondary text-white'
                            )}>
                              {testimonial.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <div className={cn(
                          'font-semibold text-sm',
                          isDark ? 'text-white' : 'text-theme-text'
                        )}>
                          {testimonial.name}
                        </div>
                        {testimonial.role && (
                          <div className={cn(
                            'text-xs',
                            isDark ? 'text-white/50' : 'text-theme-text-muted'
                          )}>
                            {testimonial.role}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Video Modal */}
          {activeVideo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveVideo(null)}
            >
              <div className="relative w-full max-w-4xl mx-4 aspect-video">
                {/* Close Button */}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute -top-12 right-0 p-2 text-white hover:text-theme-accent transition-colors"
                  aria-label="Inchide"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Video Player */}
                {(() => {
                  const currentTestimonial = videoTestimonials.find(t => t.id === activeVideo)
                  if (!currentTestimonial?.videoUrl) return null

                  const videoInfo = parseVideoUrl(currentTestimonial.videoUrl)
                  if (!videoInfo) return null

                  if (videoInfo.type === 'direct') {
                    return (
                      <video
                        src={videoInfo.embedUrl}
                        controls
                        autoPlay
                        className="w-full h-full rounded-lg"
                      />
                    )
                  }

                  return (
                    <iframe
                      src={videoInfo.embedUrl}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Grid Variant (default)
  return (
    <section className={cn('py-section', bgClass)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'heading-h2 font-bold mb-4',
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-cards">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsBlock
