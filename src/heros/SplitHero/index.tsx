import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { HeroData, CTAButton } from '../types'
import type { Media as MediaType } from '@/payload-types'
import { getHeightClass } from '../utils'

// Helper to check if image is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

interface SplitHeroProps {
  data: HeroData
}

function FeatureBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold animate-fade-in-down bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
      <span className="w-2 h-2 bg-current rounded-full animate-pulse-soft" />
      {text}
    </span>
  )
}

export function SplitHero({ data }: SplitHeroProps) {
  const {
    headline,
    subheadline,
    image,
    ctaButtons,
    badge,
  } = data

  const hasImage = isValidMedia(image)
  const heightClass = getHeightClass(data.height)

  return (
    <section className={cn('relative bg-theme-surface overflow-hidden', heightClass)}>
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="container mx-auto h-full relative">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center h-full py-16 md:py-24 px-4">
          {/* Text Content */}
          <div className="order-2 md:order-1 space-y-6">
            {badge && (
              <div className="animate-fade-in-up">
                <FeatureBadge text={badge} />
              </div>
            )}

            {headline && (
              <h1 className="heading-h1 font-bold text-theme-text leading-tight animate-fade-in-up animation-delay-100">
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
                {ctaButtons.map((button: CTAButton, index: number) => (
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

          {/* Image - SERVER RENDERED for LCP */}
          <div className="order-1 md:order-2 relative animate-fade-in-up animation-delay-200">
            {hasImage && (
              <div className="relative">
                <div className="absolute -inset-4 bg-theme-primary/10 rounded-3xl transform rotate-3 animate-pulse-soft" />
                <div className="absolute -inset-4 bg-theme-secondary/10 rounded-3xl transform -rotate-3" />

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Media
                    resource={image as MediaType}
                    fill
                    priority
                    size="(max-width: 768px) 100vw, 50vw"
                    imgClassName="object-cover hover:scale-105 transition-transform duration-700"
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

export default SplitHero
