import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import { SocialFloat } from '@/components/SocialFloat'
import type { HeroData, SocialLinks, CTAButton } from '../types'
import type { Media as MediaType } from '@/payload-types'
import { getOverlayStyles, getHeightClass } from '../utils'

// Helper to check if media is valid
function isValidMedia(media: unknown): media is MediaType {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Helper to get clean URL
function getCleanUrl(media: MediaType): string {
  const url = media.url || ''
  const queryIndex = url.indexOf('?')
  return queryIndex > -1 ? url.substring(0, queryIndex) : url
}

interface VideoHeroProps {
  data: HeroData
  social?: SocialLinks | null
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
      <div className="w-7 h-12 border-2 border-white/60 rounded-full flex justify-center pt-2">
        <div className="w-1.5 h-3 bg-white/80 rounded-full animate-scroll-indicator" />
      </div>
    </div>
  )
}

export function VideoHero({ data, social }: VideoHeroProps) {
  const {
    headline,
    subheadline,
    image,
    ctaButtons,
    videoUrl,
    videoFile,
    showScrollIndicator,
    showSocialIcons = true,
    socialIconsPosition = 'left',
    overlayEnabled = true,
    overlayOpacity,
    overlayStyle,
  } = data

  const hasImage = isValidMedia(image)
  const hasVideoFile = isValidMedia(videoFile)
  const overlayConfig = getOverlayStyles(overlayEnabled, overlayOpacity, overlayStyle)
  const heightClass = getHeightClass(data.height)

  // Video local încărcat în Payload Media
  const isLocalVideo = hasVideoFile

  return (
    <section className={cn('relative flex items-center justify-center overflow-hidden', heightClass)}>
      {/* Local Video Background (MP4) - autoplay muted loop */}
      {isLocalVideo && (
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src={getCleanUrl(videoFile as MediaType)} type="video/mp4" />
          </video>
          {overlayConfig && (
            <div className={overlayConfig.className} style={overlayConfig.style} />
          )}
        </div>
      )}

      {/* Fallback Image Background (if no video uploaded) */}
      {!isLocalVideo && hasImage && (
        <div className="absolute inset-0">
          <Image
            src={getCleanUrl(image as MediaType)}
            alt={(image as MediaType).alt || ''}
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          {overlayConfig && (
            <div className={overlayConfig.className} style={overlayConfig.style} />
          )}
        </div>
      )}

      {/* Gradient fallback */}
      {!isLocalVideo && !hasImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-theme-dark via-theme-primary to-theme-secondary" />
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center py-20">
        {headline && (
          <h1 className="heading-h1 font-bold mb-6 leading-tight animate-fade-in-up text-white/80 [text-shadow:_0_1px_0_rgba(255,255,255,0.4),_0_-1px_0_rgba(0,0,0,0.2),_0_4px_8px_rgba(0,0,0,0.3)] backdrop-blur-[1px]">
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
            {ctaButtons.map((button: CTAButton, index: number) => (
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

export default VideoHero
