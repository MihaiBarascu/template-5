'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Media } from '@/payload-types'

interface VideoEmbedBlockProps {
  variant?: 'centered' | 'full-width' | 'with-text' | 'custom-thumbnail' | 'lightbox' | null
  heading?: string | null
  subheading?: string | null
  videoUrl: string
  thumbnail?: Media | string | null
  sideContent?: {
    title?: string | null
    description?: string | null
    ctaButton?: {
      label?: string | null
      link?: string | null
    } | null
    position?: 'left' | 'right' | null
  } | null
  aspectRatio?: '16-9' | '4-3' | '1-1' | '21-9' | null
  autoplay?: boolean | null
  loop?: boolean | null
  showControls?: boolean | null
  backgroundColor?: 'default' | 'light' | 'dark' | null
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | null
}

// Parse video URL to get embed URL and platform
function parseVideoUrl(url: string): { embedUrl: string; platform: 'youtube' | 'vimeo' | 'unknown'; videoId: string } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)

  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      platform: 'youtube',
      videoId: youtubeMatch[1],
    }
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)

  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      platform: 'vimeo',
      videoId: vimeoMatch[1],
    }
  }

  return { embedUrl: url, platform: 'unknown', videoId: '' }
}

// Get default YouTube thumbnail
function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export function VideoEmbedBlock({
  variant = 'centered',
  heading,
  subheading,
  videoUrl,
  thumbnail,
  sideContent,
  aspectRatio = '16-9',
  autoplay = false,
  loop = false,
  showControls = true,
  backgroundColor = 'default',
  maxWidth = 'lg',
}: VideoEmbedBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  // PERFORMANCE: Track client-side mount to ensure iframe never renders in SSR
  // This prevents 300KB+ YouTube JS from being loaded before user interaction
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { embedUrl, platform, videoId } = useMemo(() => parseVideoUrl(videoUrl), [videoUrl])

  // Build embed URL with parameters
  const fullEmbedUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (autoplay || isPlaying) params.append('autoplay', '1')
    if (autoplay) params.append('mute', '1')
    if (loop) params.append('loop', '1')
    if (!showControls) params.append('controls', '0')

    if (platform === 'youtube') {
      params.append('rel', '0') // Don't show related videos
      if (loop) params.append('playlist', videoId) // Required for YouTube loop
    }

    const separator = embedUrl.includes('?') ? '&' : '?'
    return `${embedUrl}${separator}${params.toString()}`
  }, [embedUrl, autoplay, isPlaying, loop, showControls, platform, videoId])

  const bgClass = {
    default: 'bg-white',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }[backgroundColor || 'default']

  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
  }[maxWidth || 'lg']

  const aspectClass = {
    '16-9': 'aspect-video',
    '4-3': 'aspect-[4/3]',
    '1-1': 'aspect-square',
    '21-9': 'aspect-[21/9]',
  }[aspectRatio || '16-9']

  // Get thumbnail URL - prefer custom thumbnail, fallback to YouTube auto-thumbnail
  const thumbnailUrl = useMemo(() => {
    if (thumbnail && typeof thumbnail !== 'string' && thumbnail.url) {
      return thumbnail.url
    }
    if (platform === 'youtube' && videoId) {
      return getYoutubeThumbnail(videoId)
    }
    return null
  }, [thumbnail, platform, videoId])

  // Check if thumbnail is from YouTube (external)
  const isYoutubeThumbnail = thumbnailUrl?.includes('img.youtube.com') || thumbnailUrl?.includes('ytimg.com')

  // Render video player
  const renderPlayer = (inLightbox = false) => (
    <div className={cn('relative w-full overflow-hidden rounded-lg', !inLightbox && aspectClass)}>
      <iframe
        src={fullEmbedUrl}
        className={cn('w-full h-full', inLightbox ? 'absolute inset-0' : '')}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={heading || 'Video embed'}
      />
    </div>
  )

  // Render thumbnail with play button
  const renderThumbnail = (onClick: () => void) => (
    <div
      className={cn('relative w-full overflow-hidden rounded-lg cursor-pointer group', aspectClass)}
      onClick={onClick}
    >
      {thumbnailUrl && (
        isYoutubeThumbnail ? (
          // Use native img for YouTube thumbnails to avoid next/image config issues
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={heading || 'Video thumbnail'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Image
            src={thumbnailUrl}
            alt={heading || 'Video thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )
      )}
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/90 rounded-full shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-theme-text ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  )

  // Lightbox modal
  const renderLightbox = () => (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={() => setLightboxOpen(false)}
    >
      <button
        onClick={() => setLightboxOpen(false)}
        className="absolute top-4 right-4 text-white hover:text-white/70 z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
        {renderPlayer(true)}
      </div>
    </div>
  )

  return (
    <section className={cn('py-12 md:py-16', bgClass)}>
      <div className={cn('container mx-auto px-4', variant !== 'full-width' && maxWidthClass)}>
        {/* Section heading */}
        {(heading || subheading) && (
          <div className="text-center mb-8 md:mb-12">
            {heading && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn(
                'text-base md:text-lg max-w-2xl mx-auto',
                backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Video content based on variant */}
        {/* PERFORMANCE: Always use lazy loading (thumbnail click) to avoid loading 300KB+ YouTube JS */}
        {variant === 'with-text' && sideContent ? (
          <div className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
            sideContent.position === 'left' && 'lg:flex-row-reverse'
          )}>
            {/* Text content */}
            <div className={cn(
              'space-y-4 md:space-y-6',
              sideContent.position === 'left' ? 'lg:order-1' : 'lg:order-2'
            )}>
              {sideContent.title && (
                <h3 className="text-xl md:text-2xl font-bold">{sideContent.title}</h3>
              )}
              {sideContent.description && (
                <p className={cn(
                  'text-base md:text-lg',
                  backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
                )}>
                  {sideContent.description}
                </p>
              )}
              {sideContent.ctaButton?.label && sideContent.ctaButton?.link && (
                <Link
                  href={sideContent.ctaButton.link}
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {sideContent.ctaButton.label}
                </Link>
              )}
            </div>

            {/* Video */}
            <div className={sideContent.position === 'left' ? 'lg:order-2' : 'lg:order-1'}>
              {isMounted && isPlaying ? renderPlayer() : renderThumbnail(() => setIsPlaying(true))}
            </div>
          </div>
        ) : variant === 'lightbox' ? (
          <>
            {renderThumbnail(() => setLightboxOpen(true))}
            {isMounted && lightboxOpen && renderLightbox()}
          </>
        ) : (
          // Default: Always use lazy loading (thumbnail click) for all variants
          // This saves ~300KB of YouTube JS and dramatically improves LCP
          // CRITICAL: isMounted ensures iframe NEVER renders during SSR
          isMounted && isPlaying ? renderPlayer() : renderThumbnail(() => setIsPlaying(true))
        )}
      </div>
    </section>
  )
}

export default VideoEmbedBlock
