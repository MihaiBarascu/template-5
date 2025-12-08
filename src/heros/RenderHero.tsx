'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Page } from '@/payload-types'
import { SocialFloat } from '@/components/SocialFloat'

interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  linkedin?: string | null
  twitter?: string | null
}

type HeroData = NonNullable<Page['hero']> & {
  height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
  overlayEnabled?: boolean | null
  overlayOpacity?: string | null
  overlayStyle?: 'gradient' | 'dark' | 'primary' | 'secondary' | 'radial' | null
  videoUrl?: string | null
  parallax?: boolean | null
  showScrollIndicator?: boolean | null
  showSocialIcons?: boolean | null
  socialIconsPosition?: 'left' | 'right' | null
  badge?: string | null
  slides?: Array<{
    image?: { url?: string; alt?: string } | string | null
    headline?: string
    subheadline?: string
  }> | null
  statsBadge?: {
    enabled?: boolean | null
    value?: string | null
    label?: string | null
  } | null
}
type CTAButton = NonNullable<NonNullable<Page['hero']>['ctaButtons']>[number]

interface RenderHeroProps {
  type: string
  data: HeroData | null
  social?: SocialLinks | null
}

// Helper to get image URL
function getImageData(image: unknown): { url: string; alt: string } | null {
  if (!image || typeof image === 'string') return null
  const imgData = image as { url?: string; alt?: string }
  if (!imgData.url) return null
  return { url: imgData.url, alt: imgData.alt || '' }
}

// Helper to generate overlay styles based on settings
function getOverlayStyles(
  enabled: boolean | null | undefined,
  opacity: string | null | undefined,
  style: string | null | undefined
): { className: string; style: React.CSSProperties } | null {
  if (enabled === false) return null

  const opacityValue = parseInt(opacity || '60') / 100
  const overlayStyle = style || 'gradient'

  // Generate CSS class and inline styles based on overlay style
  switch (overlayStyle) {
    case 'dark':
      return {
        className: 'absolute inset-0 bg-black',
        style: { opacity: opacityValue }
      }
    case 'primary':
      return {
        className: 'absolute inset-0 bg-theme-primary',
        style: { opacity: opacityValue }
      }
    case 'secondary':
      return {
        className: 'absolute inset-0 bg-theme-secondary',
        style: { opacity: opacityValue }
      }
    case 'radial':
      return {
        className: 'absolute inset-0',
        style: {
          background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${opacityValue}) 100%)`
        }
      }
    case 'gradient':
    default:
      return {
        className: 'absolute inset-0',
        style: {
          background: `linear-gradient(to top, rgba(0,0,0,${opacityValue * 1.2}) 0%, rgba(0,0,0,${opacityValue * 0.6}) 50%, rgba(0,0,0,${opacityValue * 0.3}) 100%)`
        }
      }
  }
}

// CSS-only scroll indicator
function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
      <div className="w-7 h-12 border-2 border-white/60 rounded-full flex justify-center pt-2">
        <div className="w-1.5 h-3 bg-white/80 rounded-full animate-scroll-indicator" />
      </div>
    </div>
  )
}

// Feature badge
function FeatureBadge({ text, variant = 'light' }: { text: string; variant?: 'light' | 'dark' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold animate-fade-in-down',
      variant === 'light'
        ? 'bg-white/20 text-white backdrop-blur-sm border border-white/30'
        : 'bg-theme-primary/10 text-theme-primary border border-theme-primary/20'
    )}>
      <span className="w-2 h-2 bg-current rounded-full animate-pulse-soft" />
      {text}
    </span>
  )
}

// Hero Carousel/Slider component - CSS animations with minimal JS for state
function HeroCarousel({ slides, ctaButtons, height, overlayConfig }: {
  slides: NonNullable<HeroData['slides']>
  ctaButtons?: CTAButton[] | null
  height: string
  overlayConfig: { className: string; style: React.CSSProperties } | null
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [slides.length, isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [slides.length, isTransitioning])

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className={cn('relative overflow-hidden', height)}>
      {/* Slides */}
      {slides.map((slide, index) => {
        const slideImage = getImageData(slide.image)
        const isActive = index === currentSlide

        return (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-all duration-700 ease-in-out',
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {/* Background Image */}
            {slideImage && (
              <>
                <Image
                  src={slideImage.url}
                  alt={slideImage.alt || slide.headline || ''}
                  fill
                  sizes="100vw"
                  className={cn(
                    'object-cover transition-transform duration-[8000ms] ease-out',
                    isActive ? 'scale-105' : 'scale-100'
                  )}
                  priority={index === 0}
                />
                {/* Overlay */}
                {overlayConfig && (
                  <div className={overlayConfig.className} style={overlayConfig.style} />
                )}
              </>
            )}

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center">
                {slide.headline && (
                  <h1
                    className={cn(
                      'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg transition-all duration-700',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    )}
                    style={{ transitionDelay: isActive ? '200ms' : '0ms' }}
                  >
                    {slide.headline}
                  </h1>
                )}
                {slide.subheadline && (
                  <p
                    className={cn(
                      'text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white/90 drop-shadow-md transition-all duration-700',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    )}
                    style={{ transitionDelay: isActive ? '400ms' : '0ms' }}
                  >
                    {slide.subheadline}
                  </p>
                )}
                {ctaButtons && ctaButtons.length > 0 && (
                  <div
                    className={cn(
                      'flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                    style={{ transitionDelay: isActive ? '600ms' : '0ms' }}
                  >
                    {ctaButtons.map((button, btnIndex) => (
                      <Link
                        key={btnIndex}
                        href={button.link || '#'}
                        className={cn(
                          'group inline-flex items-center justify-center px-8 py-4 rounded-[var(--radius-button)] font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl',
                          button.variant === 'outline'
                            ? 'border-2 border-white text-white hover:bg-white hover:text-theme-text'
                            : 'bg-theme-secondary text-theme-text-on-secondary hover:bg-theme-accent hover:text-theme-text-on-accent'
                        )}
                      >
                        {button.label}
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setCurrentSlide(index)
                setTimeout(() => setIsTransitioning(false), 700)
              }
            }}
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

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          key={currentSlide}
          className="h-full bg-theme-secondary animate-progress-bar"
        />
      </div>
    </section>
  )
}

export function RenderHero({ type, data, social }: RenderHeroProps) {
  if (!data) return null

  const {
    headline,
    subheadline,
    image,
    ctaButtons,
    videoUrl,
    showScrollIndicator,
    showSocialIcons = true,
    socialIconsPosition = 'left',
    badge,
    slides,
    overlayEnabled = true,
    overlayOpacity,
    overlayStyle,
  } = data
  const imageData = getImageData(image)

  // Get overlay configuration
  const overlayConfig = getOverlayStyles(overlayEnabled, overlayOpacity, overlayStyle)

  // Height classes
  const heightClasses = {
    small: 'min-h-[400px] md:min-h-[500px]',
    medium: 'min-h-[500px] md:min-h-[600px]',
    large: 'min-h-[600px] md:min-h-[750px]',
    fullscreen: 'min-h-screen',
  }

  const heightClass = heightClasses[data.height as keyof typeof heightClasses] || heightClasses.large

  // CAROUSEL HERO - for multiple slides
  if (type === 'carousel' && slides && slides.length > 0) {
    return (
      <HeroCarousel
        slides={slides}
        ctaButtons={ctaButtons}
        height={heightClass}
        overlayConfig={overlayConfig}
      />
    )
  }

  // FULLSCREEN / WITH IMAGE HERO
  if (type === 'fullscreen' || type === 'withImage') {
    return (
      <section className={cn('relative flex items-center justify-center overflow-hidden', heightClass)}>
        {/* Video Background */}
        {videoUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
              <source src={videoUrl} type="video/mp4" />
            </video>
            {overlayConfig && (
              <div className={overlayConfig.className} style={overlayConfig.style} />
            )}
          </div>
        )}

        {/* Image Background */}
        {!videoUrl && imageData && (
          <div className="absolute inset-0">
            <Image
              src={imageData.url}
              alt={imageData.alt || headline || ''}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            {overlayConfig && (
              <div className={overlayConfig.className} style={overlayConfig.style} />
            )}
          </div>
        )}

        {/* Gradient fallback */}
        {!videoUrl && !imageData && (
          <div className="absolute inset-0 bg-gradient-to-br from-theme-dark via-theme-primary to-theme-secondary" />
        )}

        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-theme-secondary/20 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-theme-accent/20 rounded-full blur-[100px] animate-float-slow-reverse" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          {badge && (
            <div className="mb-8">
              <FeatureBadge text={badge} />
            </div>
          )}

          {headline && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in-up text-white/80 [text-shadow:_0_1px_0_rgba(255,255,255,0.4),_0_-1px_0_rgba(0,0,0,0.2),_0_4px_8px_rgba(0,0,0,0.3)] backdrop-blur-[1px]">
              {headline}
            </h1>
          )}

          {subheadline && (
            <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed drop-shadow-md animate-fade-in-up animation-delay-200">
              {subheadline}
            </p>
          )}

          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              {ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  href={button.link || '#'}
                  className={cn(
                    'group inline-flex items-center justify-center px-8 py-4 rounded-[var(--radius-button)] font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl',
                    button.variant === 'outline'
                      ? 'border-2 border-white text-white hover:bg-white hover:text-black backdrop-blur-sm'
                      : button.variant === 'ghost'
                        ? 'text-white hover:bg-white/20 backdrop-blur-sm'
                        : 'bg-theme-secondary text-theme-text-on-secondary hover:bg-theme-accent shadow-xl'
                  )}
                >
                  {button.label}
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Social Float Icons */}
        {showSocialIcons && social && (
          <SocialFloat
            social={social}
            position={socialIconsPosition || 'left'}
            variant="glass"
          />
        )}

        {showScrollIndicator && <ScrollIndicator />}
      </section>
    )
  }

  // SPLIT HERO
  if (type === 'split') {
    return (
      <section className={cn('relative bg-theme-surface overflow-hidden', heightClass)}>
        <div className="absolute inset-0 pattern-dots opacity-30" />

        <div className="container mx-auto h-full relative">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center h-full py-16 md:py-24 px-4">
            {/* Text Content */}
            <div className="order-2 md:order-1 space-y-6">
              {badge && (
                <div className="animate-fade-in-up">
                  <FeatureBadge text={badge} variant="dark" />
                </div>
              )}

              {headline && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-theme-text leading-tight animate-fade-in-up animation-delay-100">
                  {headline}
                </h1>
              )}

              {subheadline && (
                <p className="text-lg md:text-xl text-theme-text-light leading-relaxed animate-fade-in-up animation-delay-200">
                  {subheadline}
                </p>
              )}

              {ctaButtons && ctaButtons.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animation-delay-300">
                  {ctaButtons.map((button, index) => (
                    <Link
                      key={index}
                      href={button.link || '#'}
                      className={cn(
                        'group inline-flex items-center justify-center px-8 py-4 rounded-[var(--radius-button)] font-semibold transition-all duration-300 hover:scale-105',
                        button.variant === 'outline'
                          ? 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-text-on-primary'
                          : 'bg-theme-primary text-theme-text-on-primary hover:opacity-90 shadow-lg hover:shadow-xl'
                      )}
                    >
                      {button.label}
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 relative animate-fade-in-up animation-delay-200">
              {imageData && (
                <div className="relative">
                  <div className="absolute -inset-4 bg-theme-primary/10 rounded-3xl transform rotate-3 animate-pulse-soft" />
                  <div className="absolute -inset-4 bg-theme-secondary/10 rounded-3xl transform -rotate-3" />

                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={imageData.url}
                      alt={imageData.alt || headline || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  </div>

                  {/* Stats badge */}
                  {(data?.statsBadge?.enabled !== false) && (
                    <div className="absolute -bottom-6 -right-6 bg-theme-secondary text-white px-6 py-4 rounded-2xl shadow-2xl">
                      <div className="text-3xl font-bold">{data?.statsBadge?.value || '10+'}</div>
                      <div className="text-sm opacity-90">{data?.statsBadge?.label || 'ani experienta'}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // MINIMAL HERO - compact page header for inner pages
  if (type === 'minimal') {
    return (
      <section className="relative bg-gradient-to-r from-theme-primary to-theme-primary-dark py-12 md:py-16 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {headline && (
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 animate-fade-in-up">
              {headline}
            </h1>
          )}

          {subheadline && (
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              {subheadline}
            </p>
          )}
        </div>
      </section>
    )
  }

  // DEFAULT CENTERED HERO
  return (
    <section className={cn(
      'relative flex items-center justify-center overflow-hidden',
      imageData ? 'text-white' : 'bg-gradient-to-br from-theme-light via-theme-surface to-theme-light',
      heightClass
    )}>
      {imageData && (
        <div className="absolute inset-0">
          <Image src={imageData.url} alt={imageData.alt || headline || ''} fill sizes="100vw" className="object-cover" priority />
          {overlayConfig && (
            <div className={overlayConfig.className} style={overlayConfig.style} />
          )}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-theme-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-theme-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        {badge && (
          <div className="mb-6">
            <FeatureBadge text={badge} variant={imageData ? 'light' : 'dark'} />
          </div>
        )}

        {headline && (
          <h1
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight animate-fade-in-up',
              imageData ? 'text-white drop-shadow-lg' : 'text-theme-text'
            )}
          >
            {headline}
          </h1>
        )}

        {subheadline && (
          <p
            className={cn(
              'text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200',
              imageData ? 'text-white/90 drop-shadow-md' : 'text-theme-text-light'
            )}
          >
            {subheadline}
          </p>
        )}

        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            {ctaButtons.map((button, index) => (
              <Link
                key={index}
                href={button.link || '#'}
                className={cn(
                  'group inline-flex items-center justify-center px-8 py-4 rounded-[var(--radius-button)] font-semibold transition-all duration-300 hover:scale-105',
                  imageData
                    ? button.variant === 'outline'
                      ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                      : 'bg-theme-secondary text-theme-text-on-secondary hover:bg-theme-accent shadow-xl'
                    : button.variant === 'outline'
                      ? 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-text-on-primary'
                      : 'bg-theme-primary text-theme-text-on-primary hover:opacity-90 shadow-lg'
                )}
              >
                {button.label}
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Social Float Icons */}
      {showSocialIcons && social && imageData && (
        <SocialFloat
          social={social}
          position={socialIconsPosition || 'left'}
          variant="glass"
        />
      )}
    </section>
  )
}

export default RenderHero
