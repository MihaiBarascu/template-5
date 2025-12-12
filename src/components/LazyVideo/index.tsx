'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/utilities/cn'

interface LazyVideoProps {
  videoUrl: string
  title?: string
  className?: string
}

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  )
  return match ? match[1] : null
}

function getVimeoVideoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export function LazyVideo({ videoUrl, title = 'Video', className }: LazyVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const videoInfo = useMemo(() => {
    const youtubeId = getYouTubeVideoId(videoUrl)
    if (youtubeId) {
      return {
        platform: 'youtube' as const,
        videoId: youtubeId,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      }
    }

    const vimeoId = getVimeoVideoId(videoUrl)
    if (vimeoId) {
      return {
        platform: 'vimeo' as const,
        videoId: vimeoId,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
        thumbnailUrl: null, // Vimeo doesn't have a simple thumbnail URL
      }
    }

    return {
      platform: 'native' as const,
      videoId: null,
      embedUrl: videoUrl,
      thumbnailUrl: null,
    }
  }, [videoUrl])

  // For native videos, just render the video element
  if (videoInfo.platform === 'native') {
    return (
      <video
        src={videoUrl}
        className={cn('absolute inset-0 w-full h-full object-cover', className)}
        controls
      />
    )
  }

  // If playing, show the iframe
  if (isPlaying) {
    return (
      <iframe
        src={videoInfo.embedUrl}
        className={cn('absolute inset-0 w-full h-full', className)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    )
  }

  // Show thumbnail with play button (lazy loading)
  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="absolute inset-0 w-full h-full cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary"
      aria-label={`Play ${title}`}
      type="button"
    >
      {/* Thumbnail - use native img for external YouTube thumbnails */}
      {videoInfo.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={videoInfo.thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/90 rounded-full shadow-lg group-hover:scale-110 transition-transform">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-gray-900 ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  )
}

export default LazyVideo
