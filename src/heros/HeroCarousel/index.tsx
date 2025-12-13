'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { HeroData, CTAButton } from '../types'
import type { Media as MediaType } from '@/payload-types'
import { getOverlayStyles, getHeightClass } from '../utils'

// Helper to check if image is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

interface HeroCarouselProps {
  data: HeroData
}

export function HeroCarousel({ data }: HeroCarouselProps) {
  const { slides, ctaButtons, overlayEnabled, overlayOpacity, overlayStyle } = data

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const overlayConfig = getOverlayStyles(overlayEnabled, overlayOpacity, overlayStyle)
  const heightClass = getHeightClass(data.height)

  const validSlides = slides || []

  const nextSlide = useCallback(() => {
    if (isTransitioning || validSlides.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % validSlides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [validSlides.length, isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning || validSlides.length === 0) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + validSlides.length) % validSlides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [validSlides.length, isTransitioning])

  // Auto-advance slides
  useEffect(() => {
    if (validSlides.length <= 1) return
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide, validSlides.length])

  if (validSlides.length === 0) return null

  return (
    <section className={cn('relative overflow-hidden', heightClass)}>
      {/* Slides */}
      {validSlides.map((slide, index) => {
        const hasSlideImage = isValidMedia(slide.image)
        const isActive = index === currentSlide

        return (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-all',
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
            style={{
              transitionDuration: 'var(--animation-duration-slow, 500ms)',
              transitionTimingFunction: 'var(--animation-timing, ease-in-out)',
            }}
          >
            {/* Background Image */}
            {hasSlideImage && (
              <>
                <Media
                  resource={slide.image as MediaType}
                  fill
                  priority={index === 0}
                  size="100vw"
                  imgClassName={cn(
                    'object-cover transition-transform',
                    isActive ? 'scale-105' : 'scale-100'
                  )}
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
                      'heading-h1 font-bold mb-6 leading-tight text-white drop-shadow-lg transition-all',
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
                {slide.subheadline && (
                  <p
                    className={cn(
                      'text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white/90 drop-shadow-md transition-all',
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
                {ctaButtons && ctaButtons.length > 0 && (
                  <div
                    className={cn(
                      'flex flex-col sm:flex-row gap-4 justify-center transition-all',
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                    style={{
                      transitionDuration: 'var(--animation-duration-slow, 500ms)',
                      transitionTimingFunction: 'var(--animation-timing, ease-out)',
                      transitionDelay: isActive ? 'calc(var(--animation-duration-slow, 500ms) * 1.2)' : '0ms',
                    }}
                  >
                    {ctaButtons.map((button: CTAButton, btnIndex: number) => (
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
      {validSlides.length > 1 && (
        <>
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
        </>
      )}

      {/* Slide indicators */}
      {validSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {validSlides.map((_, index) => (
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
      )}

      {/* Progress bar */}
      {validSlides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            key={currentSlide}
            className="h-full bg-theme-secondary animate-progress-bar"
          />
        </div>
      )}
    </section>
  )
}

export default HeroCarousel
