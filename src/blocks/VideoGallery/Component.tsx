'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import type { Media } from '@/payload-types'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'

interface VideoItem {
  source?: 'youtube' | 'vimeo' | null
  videoUrl: string
  thumbnail?: Media | string | null
  title?: string | null
  description?: string | null
  duration?: string | null
  category?: string | null
  id?: string | null
}

interface VideoGalleryBlockProps {
  variant?: 'grid-2' | 'grid-3' | 'grid-4' | 'featured' | 'carousel' | null
  heading?: string | null
  subheading?: string | null
  videos?: VideoItem[] | null
  showTitles?: boolean | null
  showDuration?: boolean | null
  showCategories?: boolean | null
  aspectRatio?: '16-9' | '4-3' | '1-1' | null
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary' | null
}

// Parse video URL to get video ID and platform
function parseVideoUrl(url: string): { videoId: string; platform: 'youtube' | 'vimeo' | 'unknown' } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)

  if (youtubeMatch) {
    return { videoId: youtubeMatch[1], platform: 'youtube' }
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)

  if (vimeoMatch) {
    return { videoId: vimeoMatch[1], platform: 'vimeo' }
  }

  return { videoId: '', platform: 'unknown' }
}

// Get YouTube thumbnail URL
function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Get Vimeo thumbnail URL (fallback - actual API would need server-side)
function getVimeoThumbnail(videoId: string): string {
  return `https://vumbnail.com/${videoId}.jpg`
}

// Video Thumbnail Card Component
function VideoCard({
  video,
  aspectRatio,
  showTitle,
  showDuration,
  isDark,
  onClick,
}: {
  video: VideoItem
  aspectRatio: string
  showTitle: boolean
  showDuration: boolean
  isDark: boolean
  onClick: () => void
}) {
  const { videoId, platform } = parseVideoUrl(video.videoUrl)

  // Get thumbnail URL
  const thumbnailUrl = useMemo(() => {
    if (video.thumbnail && typeof video.thumbnail !== 'string' && video.thumbnail.url) {
      return video.thumbnail.url
    }
    if (platform === 'youtube' && videoId) {
      return getYoutubeThumbnail(videoId)
    }
    if (platform === 'vimeo' && videoId) {
      return getVimeoThumbnail(videoId)
    }
    return null
  }, [video.thumbnail, platform, videoId])

  const isExternalThumbnail = thumbnailUrl?.includes('youtube.com') || thumbnailUrl?.includes('ytimg.com') || thumbnailUrl?.includes('vumbnail.com')

  const aspectClass = {
    '16-9': 'aspect-video',
    '4-3': 'aspect-[4/3]',
    '1-1': 'aspect-square',
  }[aspectRatio] || 'aspect-video'

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* Thumbnail */}
      <div className={cn('relative w-full overflow-hidden rounded-[var(--radius-card)]', aspectClass)}>
        {thumbnailUrl && (
          isExternalThumbnail ? (
            // Use native img for external thumbnails
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={video.title || 'Video thumbnail'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Image
              src={thumbnailUrl}
              alt={video.title || 'Video thumbnail'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/90 rounded-full shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-theme-text ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        {showDuration && video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
            {video.duration}
          </div>
        )}
      </div>

      {/* Title and description */}
      {showTitle && video.title && (
        <div className="mt-3">
          <h3 className={cn(
            'font-semibold text-base md:text-lg line-clamp-2 group-hover:text-theme-primary transition-colors',
            isDark ? 'text-white' : 'text-theme-text'
          )}>
            {video.title}
          </h3>
          {video.description && (
            <p className={cn(
              'text-sm mt-1 line-clamp-2',
              isDark ? 'text-white/70' : 'text-theme-text-light'
            )}>
              {video.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Lightbox Modal Component
function VideoLightbox({
  video,
  onClose,
}: {
  video: VideoItem
  onClose: () => void
}) {
  const { videoId, platform } = parseVideoUrl(video.videoUrl)

  const embedUrl = useMemo(() => {
    if (platform === 'youtube') {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    }
    if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return video.videoUrl
  }, [platform, videoId, video.videoUrl])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-white/70 z-10 transition-colors"
        aria-label="Inchide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Video container */}
      <div
        className="w-full max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title || 'Video'}
        />
      </div>

      {/* Video title below */}
      {video.title && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white">
          <h3 className="text-lg md:text-xl font-semibold">{video.title}</h3>
        </div>
      )}
    </div>
  )
}

export function VideoGalleryBlock({
  variant = 'grid-3',
  heading,
  subheading,
  videos,
  showTitles = true,
  showDuration = true,
  showCategories = false,
  aspectRatio = '16-9',
  backgroundColor = 'default',
}: VideoGalleryBlockProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const isDark = isDarkBackground(backgroundColor || 'default')
  const bgClass = getBgClasses(backgroundColor || 'default')

  // Get unique categories
  const categories = useMemo(() => {
    if (!videos || !showCategories) return []
    const cats = videos
      .map((v) => v.category)
      .filter((c): c is string => !!c)
    return ['all', ...Array.from(new Set(cats))]
  }, [videos, showCategories])

  // Filter videos by category
  const filteredVideos = useMemo(() => {
    if (!videos) return []
    if (activeCategory === 'all') return videos
    return videos.filter((v) => v.category === activeCategory)
  }, [videos, activeCategory])

  // Grid classes based on variant
  const gridClass = {
    'grid-2': 'grid-cols-1 sm:grid-cols-2',
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    featured: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    carousel: 'flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory',
  }[variant || 'grid-3']

  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <section className={cn('py-12 md:py-16 lg:py-20', bgClass)}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        {(heading || subheading) && (
          <div className="text-center mb-8 md:mb-12">
            {heading && (
              <h2 className={cn(
                'heading-h2 font-heading font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn(
                'text-base md:text-lg max-w-2xl mx-auto',
                isDark ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Category filter */}
        {showCategories && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === category
                    ? 'bg-theme-primary text-theme-text-on-primary'
                    : isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-theme-light text-theme-text hover:bg-theme-border'
                )}
              >
                {category === 'all' ? 'Toate' : category}
              </button>
            ))}
          </div>
        )}

        {/* Video grid */}
        {variant === 'featured' && filteredVideos.length >= 3 ? (
          // Featured layout: 1 large + 2 small
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Large featured video */}
            <div className="lg:row-span-2">
              <VideoCard
                video={filteredVideos[0]}
                aspectRatio={aspectRatio || '16-9'}
                showTitle={showTitles ?? true}
                showDuration={showDuration ?? true}
                isDark={isDark}
                onClick={() => setSelectedVideo(filteredVideos[0])}
              />
            </div>
            {/* Two smaller videos */}
            <div className="space-y-4 md:space-y-6">
              {filteredVideos.slice(1, 3).map((video, index) => (
                <VideoCard
                  key={video.id || index}
                  video={video}
                  aspectRatio={aspectRatio || '16-9'}
                  showTitle={showTitles ?? true}
                  showDuration={showDuration ?? true}
                  isDark={isDark}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
            {/* Remaining videos in grid below */}
            {filteredVideos.length > 3 && (
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
                {filteredVideos.slice(3).map((video, index) => (
                  <VideoCard
                    key={video.id || index}
                    video={video}
                    aspectRatio={aspectRatio || '16-9'}
                    showTitle={showTitles ?? true}
                    showDuration={showDuration ?? true}
                    isDark={isDark}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : variant === 'carousel' ? (
          // Carousel layout
          <div className={gridClass}>
            {filteredVideos.map((video, index) => (
              <div
                key={video.id || index}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-start"
              >
                <VideoCard
                  video={video}
                  aspectRatio={aspectRatio || '16-9'}
                  showTitle={showTitles ?? true}
                  showDuration={showDuration ?? true}
                  isDark={isDark}
                  onClick={() => setSelectedVideo(video)}
                />
              </div>
            ))}
          </div>
        ) : (
          // Standard grid layout
          <div className={cn('grid gap-4 md:gap-6', gridClass)}>
            {filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id || index}
                video={video}
                aspectRatio={aspectRatio || '16-9'}
                showTitle={showTitles ?? true}
                showDuration={showDuration ?? true}
                isDark={isDark}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedVideo && (
        <VideoLightbox
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  )
}

export default VideoGalleryBlock
