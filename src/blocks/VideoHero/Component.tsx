'use client'

import React, { useRef, useEffect, useState } from 'react'
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

interface VideoHeroBlockProps {
  videoSource?: 'url' | 'upload'
  videoUrl?: string | null
  videoFile?: MediaType | string | null
  videoPoster?: MediaType | string | null
  overlayColor?: string
  overlayOpacity?: number
  headline: string
  subheadline?: string | null
  ctaButtons?: CTAButton[]
  trustBadges?: TrustBadge[]
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
  videoSource = 'url',
  videoUrl,
  videoFile,
  videoPoster,
  overlayColor = 'rgba(2, 40, 61, 0.5)',
  overlayOpacity = 50,
  headline,
  subheadline,
  ctaButtons = [],
  trustBadges = [],
  showSocialLinks = false,
  textAlignment = 'center',
  height = 'fullscreen',
  showScrollIndicator = true,
}: VideoHeroBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

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

  // Button variant styles
  const getButtonStyles = (variant: string, pillShape?: boolean | null) => {
    const base = cn(
      'inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-300',
      pillShape ? 'rounded-full' : 'rounded-[var(--radius-button)]'
    )

    switch (variant) {
      case 'primary':
        return cn(base, 'bg-theme-primary text-white hover:bg-theme-primary-dark shadow-lg hover:shadow-xl')
      case 'secondary':
        return cn(base, 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-theme-dark')
      case 'accent':
        return cn(base, 'bg-theme-accent text-white hover:opacity-90 shadow-glow-accent animate-pulse-glow')
      case 'ghost':
        return cn(base, 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20')
      default:
        return cn(base, 'bg-theme-primary text-white hover:bg-theme-primary-dark')
    }
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
              className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; fullscreen"
              frameBorder="0"
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

      {/* Content */}
      <div className={cn(
        'relative z-10 flex flex-col justify-center h-full container mx-auto px-4',
        heightClasses[height],
        alignmentClasses[textAlignment]
      )}>
        <div className={cn(
          'flex flex-col gap-6 max-w-4xl',
          textAlignment === 'center' && 'mx-auto'
        )}>
          {/* Trust Badges - Top */}
          {trustBadges && trustBadges.length > 0 && (
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
          <h1 className="heading-h1 text-white text-balance font-bold leading-tight">
            {headline}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              {subheadline}
            </p>
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
          {showSocialLinks && (
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
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
          <ChevronDown className="w-8 h-8 text-white/80" />
        </div>
      )}
    </section>
  )
}
