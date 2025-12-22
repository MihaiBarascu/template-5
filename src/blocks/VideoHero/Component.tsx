'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { ChevronDown, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

interface CTAButton {
  label: string
  link: string
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | null
  pillShape?: boolean | null
}

interface TrustBadge {
  image: MediaType | string
  alt?: string | null
  link?: string | null
}

interface SplitColumn {
  id?: string | null
  headline: string
  subheadline?: string | null
  ctaButton?: {
    label: string
    link: string
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | null
    pillShape?: boolean | null
  }
}

interface CarouselSlide {
  id?: string | null
  headline: string
  subheadline?: string | null
  ctaButtons?: CTAButton[] | null
}

interface VideoHeroBlockProps {
  variant?: 'default' | 'split' | 'centered' | 'carousel'
  videoSource?: 'url' | 'upload'
  videoUrl?: string | null
  videoFile?: MediaType | string | null
  videoPoster?: MediaType | string | null
  overlayColor?: string
  overlayOpacity?: number
  // Default/Centered variant fields
  headline?: string
  subheadline?: string | null
  ctaButtons?: CTAButton[]
  // Split variant fields
  splitTagline?: string | null
  splitColumns?: SplitColumn[]
  splitDivider?: boolean
  // Carousel variant fields
  carouselSlides?: CarouselSlide[]
  carouselAutoplay?: boolean
  carouselSpeed?: number
  carouselShowNavigation?: boolean
  carouselShowDots?: boolean
  // Common fields
  trustBadges?: TrustBadge[]
  trustBadgesPosition?: 'above' | 'below'
  showSocialLinks?: boolean
  textAlignment?: 'center' | 'left' | 'right'
  height?: 'fullscreen' | 'large' | 'medium' | 'small'
  showScrollIndicator?: boolean
}

// Extract video ID from YouTube/Vimeo URLs
function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${youtubeMatch[1]}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`
  }

  // Direct MP4 URL
  if (url.endsWith('.mp4') || url.includes('.mp4?')) {
    return url
  }

  return null
}

export function VideoHeroBlock({
  variant = 'default',
  videoSource = 'url',
  videoUrl,
  videoFile,
  videoPoster,
  overlayColor = 'rgba(2, 40, 61, 0.5)',
  overlayOpacity = 50,
  headline,
  subheadline,
  ctaButtons = [],
  splitTagline,
  splitColumns = [],
  splitDivider = true,
  carouselSlides = [],
  carouselAutoplay = true,
  carouselSpeed = 6000,
  carouselShowNavigation = true,
  carouselShowDots = true,
  trustBadges = [],
  trustBadgesPosition = 'below',
  showSocialLinks = false,
  textAlignment = 'center',
  height = 'fullscreen',
  showScrollIndicator = true,
}: VideoHeroBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Height classes
  const heightClasses = {
    fullscreen: 'min-h-screen',
    large: 'min-h-[90vh]',
    medium: 'min-h-[70vh]',
    small: 'min-h-[50vh]',
  }

  // Text alignment classes
  const alignmentClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  }

  // Get video source URL
  const getVideoSrc = (): string | null => {
    if (videoSource === 'upload' && videoFile) {
      const file = typeof videoFile === 'object' ? videoFile : null
      return file?.url || null
    }
    if (videoSource === 'url' && videoUrl) {
      return getVideoEmbedUrl(videoUrl)
    }
    return null
  }

  const videoSrc = getVideoSrc()
  const isDirectVideo = videoSrc && (videoSrc.endsWith('.mp4') || videoSrc.includes('.mp4?') || (videoSource === 'upload'))
  const isIframeVideo = videoSrc && !isDirectVideo

  // Poster image
  const posterUrl = videoPoster && typeof videoPoster === 'object' ? videoPoster.url : null

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => setIsVideoLoaded(true))
    }
  }, [])

  // Carousel navigation functions
  const nextSlide = useCallback(() => {
    if (isTransitioning || carouselSlides.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [carouselSlides.length, isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning || carouselSlides.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [carouselSlides.length, isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [currentSlide, isTransitioning])

  // Carousel auto-advance
  useEffect(() => {
    if (variant !== 'carousel' || !carouselAutoplay || carouselSlides.length <= 1) return
    const timer = setInterval(nextSlide, carouselSpeed)
    return () => clearInterval(timer)
  }, [variant, carouselAutoplay, carouselSpeed, nextSlide, carouselSlides.length])

  // Button variant styles
  const getButtonStyles = (buttonVariant: string, pillShape?: boolean | null) => {
    const base = cn(
      'inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-300',
      pillShape ? 'rounded-full' : 'rounded-[var(--radius-button)]'
    )

    switch (buttonVariant) {
      case 'primary':
        return cn(base, 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary-dark shadow-lg hover:shadow-xl')
      case 'secondary':
        return cn(base, 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-theme-dark')
      case 'accent':
        return cn(base, 'bg-theme-accent text-theme-text-on-accent hover:opacity-90 shadow-glow-accent animate-pulse-glow')
      case 'ghost':
        return cn(base, 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20')
      default:
        return cn(base, 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary-dark')
    }
  }

  // Render Trust Badges
  const renderTrustBadges = () => {
    if (!trustBadges || trustBadges.length === 0) return null

    return (
      <div className={cn(
        'flex flex-wrap gap-4',
        textAlignment === 'center' && 'justify-center'
      )}>
        {trustBadges.map((badge, index) => {
          const BadgeContent = (
            <div className="relative h-12 w-auto opacity-90 hover:opacity-100 transition-opacity">
              {typeof badge.image === 'object' && (
                <Media
                  resource={badge.image}
                  imgClassName="h-12 w-auto object-contain"
                />
              )}
            </div>
          )

          return badge.link ? (
            <Link key={index} href={badge.link} target="_blank" rel="noopener noreferrer">
              {BadgeContent}
            </Link>
          ) : (
            <div key={index}>{BadgeContent}</div>
          )
        })}
      </div>
    )
  }

  // Render Social Links
  const renderSocialLinks = () => {
    if (!showSocialLinks) return null

    return (
      <div className={cn(
        'flex gap-4 mt-6',
        textAlignment === 'center' && 'justify-center'
      )}>
        <a href="#" className="text-white/80 hover:text-white transition-colors">
          <Facebook className="w-6 h-6" />
        </a>
        <a href="#" className="text-white/80 hover:text-white transition-colors">
          <Instagram className="w-6 h-6" />
        </a>
        <a href="#" className="text-white/80 hover:text-white transition-colors">
          <Youtube className="w-6 h-6" />
        </a>
        <a href="#" className="text-white/80 hover:text-white transition-colors">
          <Twitter className="w-6 h-6" />
        </a>
      </div>
    )
  }

  // ===== SPLIT VARIANT CONTENT =====
  const renderSplitContent = () => (
    <div className={cn(
      'relative z-10 flex flex-col justify-center items-center w-full',
      heightClasses[height]
    )}>
      {/* Split Columns - Balanced spread */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16 gap-16 md:gap-0">
        {splitColumns.map((column, index) => (
          <div
            key={column.id || index}
            className="flex flex-col items-center text-center md:max-w-md lg:max-w-lg"
          >
            {/* Headline - Clean text only */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              {column.headline}
            </h2>

            {/* Subheadline */}
            {column.subheadline && (
              <p className="text-base md:text-lg text-white/70 mb-8 md:mb-10 max-w-sm leading-relaxed">
                {column.subheadline}
              </p>
            )}

            {/* CTA Button - Theme-aware */}
            {column.ctaButton && (
              <Link
                href={column.ctaButton.link}
                className={getButtonStyles(column.ctaButton.variant || 'secondary', column.ctaButton.pillShape ?? true)}
              >
                {column.ctaButton.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Trust Badges (below split columns) */}
      {trustBadges && trustBadges.length > 0 && (
        <div className="mt-16 md:mt-24 flex justify-center">
          {renderTrustBadges()}
        </div>
      )}

      {/* Social Links */}
      {renderSocialLinks()}
    </div>
  )

  // ===== CENTERED VARIANT CONTENT =====
  const renderCenteredContent = () => (
    <div className={cn(
      'relative z-10 flex flex-col justify-center h-full container mx-auto px-4',
      heightClasses[height],
      'text-center items-center'
    )}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Trust Badges - Above */}
        {trustBadgesPosition === 'above' && renderTrustBadges()}

        {/* Headline - Extra large for centered */}
        {headline && (
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight">
            {headline}
          </h1>
        )}

        {/* Subheadline */}
        {subheadline && (
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}

        {/* Trust Badges - Below */}
        {trustBadgesPosition === 'below' && renderTrustBadges()}

        {/* CTA Buttons */}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {ctaButtons.map((button, index) => (
              <Link
                key={index}
                href={button.link}
                className={getButtonStyles(button.variant || 'primary', button.pillShape)}
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}

        {/* Social Links */}
        {renderSocialLinks()}
      </div>
    </div>
  )

  // ===== DEFAULT VARIANT CONTENT =====
  const renderDefaultContent = () => (
    <div className={cn(
      'relative z-10 flex flex-col justify-center h-full container mx-auto px-4',
      heightClasses[height],
      alignmentClasses[textAlignment]
    )}>
      <div className={cn(
        'flex flex-col gap-6 max-w-4xl',
        textAlignment === 'center' && 'mx-auto'
      )}>
        {/* Trust Badges - Above */}
        {trustBadgesPosition === 'above' && trustBadges && trustBadges.length > 0 && (
          <div className={cn(
            'flex flex-wrap gap-4 mb-4',
            textAlignment === 'center' && 'justify-center'
          )}>
            {trustBadges.map((badge, index) => {
              const BadgeContent = (
                <div className="relative h-12 w-auto opacity-90 hover:opacity-100 transition-opacity">
                  {typeof badge.image === 'object' && (
                    <Media
                      resource={badge.image}
                      imgClassName="h-12 w-auto object-contain"
                    />
                  )}
                </div>
              )

              return badge.link ? (
                <Link key={index} href={badge.link} target="_blank" rel="noopener noreferrer">
                  {BadgeContent}
                </Link>
              ) : (
                <div key={index}>{BadgeContent}</div>
              )
            })}
          </div>
        )}

        {/* Headline */}
        {headline && (
          <h1 className="heading-h1 text-white text-balance font-bold leading-tight">
            {headline}
          </h1>
        )}

        {/* Subheadline */}
        {subheadline && (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            {subheadline}
          </p>
        )}

        {/* Trust Badges - Below */}
        {trustBadgesPosition === 'below' && trustBadges && trustBadges.length > 0 && (
          <div className={cn(
            'flex flex-wrap gap-4 mt-2',
            textAlignment === 'center' && 'justify-center'
          )}>
            {trustBadges.map((badge, index) => {
              const BadgeContent = (
                <div className="relative h-14 w-auto opacity-90 hover:opacity-100 transition-opacity">
                  {typeof badge.image === 'object' && (
                    <Media
                      resource={badge.image}
                      imgClassName="h-14 w-auto object-contain"
                    />
                  )}
                </div>
              )

              return badge.link ? (
                <Link key={index} href={badge.link} target="_blank" rel="noopener noreferrer">
                  {BadgeContent}
                </Link>
              ) : (
                <div key={index}>{BadgeContent}</div>
              )
            })}
          </div>
        )}

        {/* CTA Buttons */}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className={cn(
            'flex flex-wrap gap-4 mt-4',
            textAlignment === 'center' && 'justify-center'
          )}>
            {ctaButtons.map((button, index) => (
              <Link
                key={index}
                href={button.link}
                className={getButtonStyles(button.variant || 'primary', button.pillShape)}
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}

        {/* Social Links */}
        {renderSocialLinks()}
      </div>
    </div>
  )

  // ===== CAROUSEL VARIANT CONTENT =====
  const renderCarouselContent = () => {
    if (!carouselSlides || carouselSlides.length === 0) return null

    return (
      <div className={cn(
        'relative z-10 flex flex-col justify-center w-full',
        heightClasses[height],
        textAlignment === 'center' ? 'items-center' : textAlignment === 'right' ? 'items-end' : 'items-start'
      )}>
        {/* Content slides with fade animation */}
        {carouselSlides.map((slide, index) => {
          const isActive = index === currentSlide
          return (
            <div
              key={slide.id || index}
              className={cn(
                'absolute inset-0 flex items-center transition-all',
                textAlignment === 'center' ? 'justify-center' : textAlignment === 'right' ? 'justify-end' : 'justify-start',
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              )}
              style={{
                transitionDuration: 'var(--animation-duration-slow, 500ms)',
                transitionTimingFunction: 'var(--animation-timing, ease-in-out)',
              }}
            >
              <div className={cn(
                'container mx-auto px-4 md:px-8 lg:px-16',
                alignmentClasses[textAlignment]
              )}>
                {/* Headline */}
                {slide.headline && (
                  <h1
                    className={cn(
                      'heading-h1 font-bold mb-6 leading-tight text-white drop-shadow-lg transition-all max-w-4xl',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    )}
                    style={{
                      transitionDuration: 'var(--animation-duration-slow, 500ms)',
                      transitionTimingFunction: 'var(--animation-timing, ease-out)',
                      transitionDelay: isActive ? 'calc(var(--animation-duration-fast, 150ms) * 1.33)' : '0ms',
                    }}
                  >
                    {slide.headline}
                  </h1>
                )}

                {/* Subheadline */}
                {slide.subheadline && (
                  <p
                    className={cn(
                      'text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl text-white/90 drop-shadow-md transition-all',
                      textAlignment === 'center' && 'mx-auto',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    )}
                    style={{
                      transitionDuration: 'var(--animation-duration-slow, 500ms)',
                      transitionTimingFunction: 'var(--animation-timing, ease-out)',
                      transitionDelay: isActive ? 'calc(var(--animation-duration, 300ms) * 1.33)' : '0ms',
                    }}
                  >
                    {slide.subheadline}
                  </p>
                )}

                {/* CTA Buttons */}
                {slide.ctaButtons && slide.ctaButtons.length > 0 && (
                  <div
                    className={cn(
                      'flex flex-col sm:flex-row gap-4 transition-all',
                      textAlignment === 'center' ? 'justify-center' : textAlignment === 'right' ? 'justify-end' : 'justify-start',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                    style={{
                      transitionDuration: 'var(--animation-duration-slow, 500ms)',
                      transitionTimingFunction: 'var(--animation-timing, ease-out)',
                      transitionDelay: isActive ? 'calc(var(--animation-duration-slow, 500ms) * 1.2)' : '0ms',
                    }}
                  >
                    {slide.ctaButtons.map((button, btnIndex) => (
                      <Link
                        key={btnIndex}
                        href={button.link || '#'}
                        className={getButtonStyles(button.variant || 'primary', button.pillShape)}
                      >
                        {button.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Navigation arrows - hidden on mobile to avoid overlap with text */}
        {carouselShowNavigation && carouselSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slide indicators (dots) */}
        {carouselShowDots && carouselSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'transition-all duration-300',
                  index === currentSlide
                    ? 'w-8 h-2 bg-white rounded-full'
                    : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Trust Badges */}
        {trustBadges && trustBadges.length > 0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
            {renderTrustBadges()}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className={cn('relative overflow-hidden', heightClasses[height])}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Poster Image (fallback) */}
        {posterUrl && !isVideoLoaded && (
          <div className="absolute inset-0 w-full h-full">
            <Media
              resource={videoPoster as MediaType}
              fill
              imgClassName="object-cover"
            />
          </div>
        )}

        {/* Direct Video (MP4) */}
        {isDirectVideo && videoSrc && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl || undefined}
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Iframe Video (YouTube/Vimeo) */}
        {isIframeVideo && videoSrc && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <iframe
              src={videoSrc}
              className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 border-0"
              allow="autoplay; fullscreen"
              title="Background video"
            />
          </div>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      </div>

      {/* Content - Based on variant */}
      {variant === 'split' && renderSplitContent()}
      {variant === 'centered' && renderCenteredContent()}
      {variant === 'carousel' && renderCarouselContent()}
      {variant === 'default' && renderDefaultContent()}

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
          <ChevronDown className="w-8 h-8 text-white/80" />
        </div>
      )}
    </section>
  )
}
