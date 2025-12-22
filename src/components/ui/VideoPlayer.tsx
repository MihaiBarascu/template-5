'use client'

import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/utilities/cn'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

export interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  className?: string
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16' | 'auto'
  showCustomControls?: boolean
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  className,
  aspectRatio = '16/9',
  showCustomControls = true,
  overlay = false,
  overlayColor = 'rgba(0,0,0,0.3)',
  overlayOpacity = 30,
  onPlay,
  onPause,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }
    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }
    const handleLoaded = () => setIsLoaded(true)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadeddata', handleLoaded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadeddata', handleLoaded)
    }
  }, [onPlay, onPause, onEnded])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '9/16': 'aspect-[9/16]',
    auto: '',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-card)] bg-black',
        aspectRatioClasses[aspectRatio],
        className,
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls && !showCustomControls}
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && poster && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Custom Controls */}
      {showCustomControls && (
        <>
          {/* Center Play Button - shown when paused or hovering */}
          <button
            onClick={togglePlay}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
              'w-16 h-16 md:w-20 md:h-20 rounded-full',
              'bg-white/20 backdrop-blur-sm hover:bg-white/30',
              'flex items-center justify-center transition-all duration-300',
              'text-white',
              isPlaying && !showControls ? 'opacity-0' : 'opacity-100',
            )}
            aria-label={isPlaying ? 'Pauza' : 'Reda'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 md:w-10 md:h-10" />
            ) : (
              <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />
            )}
          </button>

          {/* Bottom Controls Bar */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3 md:p-4',
              'bg-gradient-to-t from-black/60 to-transparent',
              'flex items-center justify-between gap-4',
              'transition-opacity duration-300',
              showControls ? 'opacity-100' : 'opacity-0',
            )}
          >
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                aria-label={isPlaying ? 'Pauza' : 'Reda'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                aria-label={isMuted ? 'Activeaza sunet' : 'Dezactiveaza sunet'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                aria-label="Ecran complet"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoPlayer
