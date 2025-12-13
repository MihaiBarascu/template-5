import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import { SocialFloat } from '@/components/SocialFloat'
import type { HeroData, SocialLinks, CTAButton } from '../types'
import type { Media as MediaType } from '@/payload-types'
import { getOverlayStyles, getHeightClass } from '../utils'

// Helper to check if image is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

interface DefaultHeroProps {
  data: HeroData
  social?: SocialLinks | null
}

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

export function DefaultHero({ data, social }: DefaultHeroProps) {
  const {
    headline,
    subheadline,
    image,
    ctaButtons,
    badge,
    showSocialIcons = true,
    socialIconsPosition = 'left',
    overlayEnabled = true,
    overlayOpacity,
    overlayStyle,
  } = data

  const hasImage = isValidMedia(image)
  const overlayConfig = getOverlayStyles(overlayEnabled, overlayOpacity, overlayStyle)
  const heightClass = getHeightClass(data.height)

  return (
    <section className={cn(
      'relative flex items-center justify-center overflow-hidden',
      hasImage ? 'text-white' : 'bg-gradient-to-br from-theme-light via-theme-surface to-theme-light',
      heightClass
    )}>
      {/* Image Background - SERVER RENDERED for LCP */}
      {hasImage && (
        <div className="absolute inset-0">
          <Media
            resource={image as MediaType}
            fill
            priority
            size="100vw"
            imgClassName="object-cover"
          />
          {overlayConfig && (
            <div className={overlayConfig.className} style={overlayConfig.style} />
          )}
        </div>
      )}

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-theme-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-theme-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        {badge && (
          <div className="mb-6">
            <FeatureBadge text={badge} variant={hasImage ? 'light' : 'dark'} />
          </div>
        )}

        {headline && (
          <h1
            className={cn(
              'heading-h1 font-bold mb-6 leading-tight animate-fade-in-up',
              hasImage ? 'text-white drop-shadow-lg' : 'text-theme-text'
            )}
          >
            {headline}
          </h1>
        )}

        {subheadline && (
          <p
            className={cn(
              'text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200',
              hasImage ? 'text-white/90 drop-shadow-md' : 'text-theme-text-light'
            )}
          >
            {subheadline}
          </p>
        )}

        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            {ctaButtons.map((button: CTAButton, index: number) => (
              <Link
                key={index}
                href={button.link || '#'}
                className={cn(
                  'group inline-flex items-center justify-center px-8 py-4 rounded-[var(--radius-button)] font-semibold transition-all duration-300 hover:scale-105',
                  hasImage
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
      {showSocialIcons && social && hasImage && (
        <SocialFloat
          social={social}
          position={socialIconsPosition || 'left'}
          variant="glass"
        />
      )}
    </section>
  )
}

export default DefaultHero
