'use client'

import React from 'react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

export interface SectionWrapperProps {
  children: React.ReactNode
  className?: string

  // Layout
  fullWidth?: boolean
  containerSize?: 'default' | 'narrow' | 'wide' | 'full'

  // Spacing
  paddingTop?: 'none' | 'small' | 'medium' | 'large' | 'xl'
  paddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'xl'

  // Background
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary' | 'accent' | 'transparent'
  backgroundImage?: MediaType | string | null
  backgroundVideo?: {
    url?: string | null
    poster?: MediaType | string | null
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    playbackSpeed?: number
  } | null

  // Overlay
  overlay?: {
    enabled?: boolean
    type?: 'solid' | 'gradient-to-t' | 'gradient-to-b' | 'gradient-radial'
    opacity?: number // 0-100
    color?: string
  } | null

  // Effects
  parallax?: boolean
  parallaxSpeed?: number

  // HTML attributes
  id?: string
  'aria-label'?: string
}

// Padding classes map
const paddingTopClasses: Record<string, string> = {
  none: 'pt-0',
  small: 'pt-8 md:pt-12',
  medium: 'pt-12 md:pt-16',
  large: 'pt-16 md:pt-24',
  xl: 'pt-24 md:pt-32',
}

const paddingBottomClasses: Record<string, string> = {
  none: 'pb-0',
  small: 'pb-8 md:pb-12',
  medium: 'pb-12 md:pb-16',
  large: 'pb-16 md:pb-24',
  xl: 'pb-24 md:pb-32',
}

// Background color classes
const bgColorClasses: Record<string, string> = {
  default: 'bg-theme-surface',
  light: 'bg-theme-light',
  dark: 'bg-theme-dark',
  primary: 'bg-theme-primary',
  accent: 'bg-theme-accent',
  transparent: 'bg-transparent',
}

// Container size classes
const containerSizeClasses: Record<string, string> = {
  default: 'container mx-auto px-4',
  narrow: 'max-w-4xl mx-auto px-4',
  wide: 'max-w-7xl mx-auto px-4',
  full: 'w-full px-0',
}

// Overlay gradient classes
const overlayGradientClasses: Record<string, string> = {
  solid: '',
  'gradient-to-t': 'bg-gradient-to-t',
  'gradient-to-b': 'bg-gradient-to-b',
  'gradient-radial': 'bg-radial',
}

export function SectionWrapper({
  children,
  className,
  fullWidth = false,
  containerSize = 'default',
  paddingTop = 'large',
  paddingBottom = 'large',
  backgroundColor = 'default',
  backgroundImage,
  backgroundVideo,
  overlay,
  parallax = false,
  parallaxSpeed = 0.5,
  id,
  'aria-label': ariaLabel,
}: SectionWrapperProps) {
  const hasBackgroundMedia = backgroundImage || backgroundVideo?.url

  // Determine if the section has a dark background
  const isDarkBackground =
    backgroundColor === 'dark' ||
    backgroundColor === 'primary' ||
    hasBackgroundMedia

  // Get image URL from media object or string
  const getImageUrl = (media: MediaType | string | null | undefined): string | null => {
    if (!media) return null
    if (typeof media === 'string') return media
    return media.url || null
  }

  const bgImageUrl = getImageUrl(backgroundImage)
  const posterUrl = backgroundVideo?.poster ? getImageUrl(backgroundVideo.poster) : null

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        'relative overflow-hidden',
        paddingTopClasses[paddingTop],
        paddingBottomClasses[paddingBottom],
        !hasBackgroundMedia && bgColorClasses[backgroundColor],
        className
      )}
    >
      {/* Background Image */}
      {bgImageUrl && !backgroundVideo?.url && (
        <div
          className={cn(
            'absolute inset-0 z-0',
            parallax && 'will-change-transform'
          )}
          style={parallax ? {
            transform: `translateY(calc(var(--scroll-y, 0) * ${parallaxSpeed}))`,
          } : undefined}
        >
          {typeof backgroundImage === 'object' && backgroundImage ? (
            <Media
              resource={backgroundImage}
              fill
              imgClassName="object-cover"
              priority={false}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bgImageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* Background Video */}
      {backgroundVideo?.url && (
        <div
          className={cn(
            'absolute inset-0 z-0',
            parallax && 'will-change-transform'
          )}
          style={parallax ? {
            transform: `translateY(calc(var(--scroll-y, 0) * ${parallaxSpeed}))`,
          } : undefined}
        >
          <video
            autoPlay={backgroundVideo.autoplay !== false}
            loop={backgroundVideo.loop !== false}
            muted={backgroundVideo.muted !== false}
            playsInline
            poster={posterUrl || undefined}
            className="absolute inset-0 w-full h-full object-cover"
            style={backgroundVideo.playbackSpeed ? {
              // @ts-expect-error playbackRate not in CSSProperties
              '--playback-rate': backgroundVideo.playbackSpeed,
            } : undefined}
          >
            <source src={backgroundVideo.url} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Overlay */}
      {hasBackgroundMedia && overlay?.enabled !== false && (
        <div
          className={cn(
            'absolute inset-0 z-[1]',
            overlay?.type && overlayGradientClasses[overlay.type]
          )}
          style={{
            backgroundColor: overlay?.type === 'solid' || !overlay?.type
              ? overlay?.color || 'rgba(0, 0, 0, 0.5)'
              : undefined,
            opacity: overlay?.opacity !== undefined ? overlay.opacity / 100 : 0.5,
            '--tw-gradient-from': overlay?.color || 'rgba(0, 0, 0, 0.8)',
            '--tw-gradient-to': 'transparent',
          } as React.CSSProperties}
        />
      )}

      {/* Content */}
      <div className={cn(
        'relative z-10',
        !fullWidth && containerSizeClasses[containerSize]
      )}>
        {children}
      </div>

      {/* Pass isDark context via data attribute for child components */}
      {isDarkBackground && (
        <style>{`
          [data-section-dark="true"] {
            --section-text-color: white;
            --section-text-muted: rgba(255, 255, 255, 0.7);
          }
        `}</style>
      )}
    </section>
  )
}

// Helper hook for blocks to determine if they're in a dark section
export function useIsDarkSection(backgroundColor?: string, hasBackgroundMedia?: boolean): boolean {
  return (
    backgroundColor === 'dark' ||
    backgroundColor === 'primary' ||
    !!hasBackgroundMedia
  )
}

export default SectionWrapper
