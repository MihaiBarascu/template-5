'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Star, X, Quote } from 'lucide-react'
import type { Testimonial, Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'

// Parse video URL to get embed URL and thumbnail
function parseVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct'; embedUrl: string; thumbnailUrl?: string; videoId?: string } | null {
  if (!url) return null

  // YouTube (standard, embed, shorts, and youtu.be)
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
    }
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      videoId: vimeoMatch[1],
    }
  }

  // Direct video URLs
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return { type: 'direct', embedUrl: url }
  }

  return null
}

// Helper to check if media is valid
function isValidMedia(media: unknown): media is MediaType {
  return !!media && typeof media === 'object' && 'url' in media && !!(media as MediaType).url
}

// Source icon helper
function getSourceIcon(source: string) {
  switch (source) {
    case 'google':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    default:
      return null
  }
}

// Star Rating Component
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  )
}

export interface TestimonialCardProps {
  testimonial: Testimonial
  variant?: 'default' | 'featured' | 'compact'
  isDark?: boolean
  showRating?: boolean
  showAvatar?: boolean
  showSource?: boolean
  showDate?: boolean
  className?: string
  index?: number
}

export function TestimonialCard({
  testimonial,
  variant = 'default',
  isDark = false,
  showRating = true,
  showAvatar = true,
  showSource = false,
  showDate = false,
  className,
  index = 0,
}: TestimonialCardProps) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showTextModal, setShowTextModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isModalOpen = showVideoModal || showTextModal

  // For SSR safety - only render portal after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle Escape key to close modals (accessibility best practice)
  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVideoModal(false)
        setShowTextModal(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  // Prevent body scroll when modal is open (UX best practice)
  useEffect(() => {
    if (!mounted) return

    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen, mounted])

  const hasVideo = !!testimonial.videoUrl
  const videoInfo = hasVideo ? parseVideoUrl(testimonial.videoUrl || '') : null
  const isLongText = (testimonial.content?.length || 0) > 150
  const isFeatured = variant === 'featured'

  const handleClick = () => {
    if (hasVideo) {
      setShowVideoModal(true)
    } else {
      setShowTextModal(true)
    }
  }

  // Get avatar from testimonial (handle both image relation and inline object)
  const avatarMedia = testimonial.image && typeof testimonial.image === 'object' ? testimonial.image as MediaType : null

  return (
    <>
      {/* Card */}
      <div
        className={cn(
          'relative p-6 md:p-8 rounded-[var(--radius-card)]',
          'animate-fade-in-up card-hover cursor-pointer',
          isFeatured ? 'text-center' : '',
          isDark
            ? 'bg-white/5 border border-white/10'
            : 'bg-white shadow-lg hover:shadow-xl border border-theme-border/50',
          index < 8 && `animation-delay-${(index % 4) * 100 + 100}`,
          className
        )}
        onClick={handleClick}
      >
        {/* Quote Icon - decorative, only for non-featured cards without video */}
        {!isFeatured && !hasVideo && (
          <Quote className={cn(
            'absolute w-12 h-12 top-4 right-4',
            isDark ? 'text-white/10' : 'text-theme-primary/10'
          )} />
        )}

        {/* Video Thumbnail Preview */}
        {hasVideo && videoInfo?.thumbnailUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden group/thumb">
            <div className="aspect-video relative">
              <img
                src={videoInfo.thumbnailUrl}
                alt={`Video testimonial de la ${testimonial.name}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/40 transition-colors flex items-center justify-center">
                <div className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center',
                  'bg-white/90 text-theme-primary shadow-lg',
                  'transition-all duration-300 group-hover/thumb:scale-110'
                )}>
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating */}
        {showRating && testimonial.rating && (
          <div className={cn('mb-4 relative z-10', isFeatured ? 'flex justify-center' : '')}>
            <StarRating rating={parseInt(testimonial.rating) || 5} size={isFeatured ? 'lg' : 'md'} />
          </div>
        )}

        {/* Content */}
        <blockquote className={cn(
          'relative z-10 mb-2 leading-relaxed',
          isFeatured ? 'text-xl md:text-2xl font-medium' : 'text-base md:text-lg',
          isDark ? 'text-white/90' : 'text-theme-text',
          !isFeatured && 'line-clamp-4'
        )}>
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>

        {/* Read more for long text */}
        {isLongText && !hasVideo && !isFeatured && (
          <span className={cn(
            'text-sm font-medium mb-4 inline-block transition-colors',
            isDark ? 'text-theme-accent hover:text-white' : 'text-theme-primary hover:text-theme-primary-dark'
          )}>
            Citește mai mult →
          </span>
        )}

        {/* Author */}
        <div className={cn(
          'flex items-center gap-4 mt-4',
          isFeatured ? 'justify-center' : ''
        )}>
          {/* Avatar */}
          {showAvatar && (
            <div className={cn(
              'relative flex-shrink-0 rounded-full overflow-hidden',
              'ring-2 transition-all duration-300',
              isDark ? 'ring-white/20' : 'ring-theme-primary/20',
              isFeatured ? 'w-16 h-16' : 'w-12 h-12'
            )}>
              {isValidMedia(avatarMedia) ? (
                <Media
                  resource={avatarMedia}
                  fill
                  size="64px"
                  imgClassName="object-cover"
                />
              ) : (
                <div className={cn(
                  'w-full h-full flex items-center justify-center font-bold',
                  'bg-gradient-to-br from-theme-primary to-theme-secondary text-white',
                  isFeatured ? 'text-2xl' : 'text-lg'
                )}>
                  {testimonial.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className={isFeatured ? 'text-center' : ''}>
            <div className={cn(
              'font-semibold',
              isDark ? 'text-white' : 'text-theme-text',
              isFeatured ? 'text-lg' : 'text-base'
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
          </div>

          {/* Source */}
          {showSource && testimonial.source && (
            <div className={cn('ml-auto', isFeatured && 'hidden')}>
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

      {/* Video Modal - rendered via Portal to escape parent overflow constraints */}
      {mounted && showVideoModal && videoInfo && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Video testimonial de la ${testimonial.name}`}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-theme-primary transition-colors"
              aria-label="Închide video"
            >
              <X className="w-8 h-8" />
            </button>
            {videoInfo.type === 'direct' ? (
              <video
                src={videoInfo.embedUrl}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              />
            ) : (
              <iframe
                src={videoInfo.embedUrl}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Text Modal - rendered via Portal to escape parent overflow constraints */}
      {mounted && showTextModal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowTextModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTextModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              aria-label="Închide testimonial"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="p-8 md:p-10">
              <Quote className="w-12 h-12 text-theme-primary/20 mb-6" />

              <p className="text-lg md:text-xl text-theme-text leading-relaxed mb-8">
                {testimonial.content}
              </p>

              {testimonial.rating && (
                <div className="flex gap-1 mb-6">
                  <StarRating rating={parseInt(testimonial.rating)} size="lg" />
                </div>
              )}

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  {isValidMedia(avatarMedia) ? (
                    <Media
                      resource={avatarMedia}
                      fill
                      size="56px"
                      imgClassName="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-theme-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-theme-primary">
                        {testimonial.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p id="testimonial-modal-title" className="text-lg font-semibold text-theme-text">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-gray-500">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

// Grid component for displaying multiple testimonials
export interface TestimonialGridProps {
  testimonials: Testimonial[]
  columns?: 2 | 3 | 4
  className?: string
  title?: string
  isDark?: boolean
  showRating?: boolean
  showAvatar?: boolean
  showSource?: boolean
}

export function TestimonialGrid({
  testimonials,
  columns = 3,
  title,
  className,
  isDark = false,
  showRating = true,
  showAvatar = true,
  showSource = false,
}: TestimonialGridProps) {
  if (!testimonials.length) return null

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={className}>
      {title && (
        <h2 className={cn(
          'text-2xl md:text-3xl font-bold text-center mb-8',
          isDark ? 'text-white' : 'text-theme-text'
        )}>
          {title}
        </h2>
      )}
      <div className={cn('grid grid-cols-1 gap-6', gridCols[columns])}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            isDark={isDark}
            showRating={showRating}
            showAvatar={showAvatar}
            showSource={showSource}
          />
        ))}
      </div>
    </div>
  )
}

export default TestimonialCard
