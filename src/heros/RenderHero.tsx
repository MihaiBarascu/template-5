import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { Page } from '@/payload-types'

type HeroData = NonNullable<Page['hero']> & {
  height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
  overlayOpacity?: string | null
}
type CTAButton = NonNullable<NonNullable<Page['hero']>['ctaButtons']>[number]

interface RenderHeroProps {
  type: string
  data: HeroData | null
}

// Helper to get image URL from string | Media | null
function getImageData(image: HeroData['image']): { url: string; alt: string } | null {
  if (!image || typeof image === 'string') return null
  if (!image.url) return null
  return { url: image.url, alt: image.alt || '' }
}

export function RenderHero({ type, data }: RenderHeroProps) {
  if (!data) return null

  const { headline, subheadline, image, ctaButtons } = data
  const imageData = getImageData(image)

  // Height classes
  const heightClasses = {
    small: 'min-h-[300px] md:min-h-[400px]',
    medium: 'min-h-[400px] md:min-h-[500px]',
    large: 'min-h-[500px] md:min-h-[600px]',
    fullscreen: 'min-h-screen',
  }

  // Base hero component for fullscreen/image backgrounds
  if (type === 'fullscreen' || type === 'withImage') {
    return (
      <section
        className={cn(
          'relative flex items-center justify-center',
          heightClasses[data.height as keyof typeof heightClasses] || heightClasses.large
        )}
      >
        {/* Background Image */}
        {imageData && (
          <div className="absolute inset-0">
            <Image
              src={imageData.url}
              alt={imageData.alt || headline || ''}
              fill
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: parseInt(data.overlayOpacity || '50') / 100 }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {headline && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto opacity-90">
              {subheadline}
            </p>
          )}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaButtons.map((button: CTAButton, index: number) => (
                <Link
                  key={index}
                  href={button.link || '#'}
                  className={cn(
                    'inline-flex items-center justify-center px-6 py-3 rounded-theme-button font-medium transition-all',
                    button.variant === 'outline'
                      ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                      : button.variant === 'ghost'
                        ? 'text-white hover:bg-white/20'
                        : 'bg-white text-black hover:bg-gray-100'
                  )}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  // Split hero (image on one side, text on the other)
  if (type === 'split') {
    return (
      <section className={cn(
        'relative',
        heightClasses[data.height as keyof typeof heightClasses] || heightClasses.large
      )}>
        <div className="container mx-auto h-full">
          <div className="grid md:grid-cols-2 gap-8 items-center h-full py-12 md:py-20">
            {/* Text Content */}
            <div className="order-2 md:order-1">
              {headline && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-theme-text">
                  {headline}
                </h1>
              )}
              {subheadline && (
                <p className="text-lg md:text-xl text-theme-text-light mb-6">
                  {subheadline}
                </p>
              )}
              {ctaButtons && ctaButtons.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {ctaButtons.map((button: CTAButton, index: number) => (
                    <Link
                      key={index}
                      href={button.link || '#'}
                      className={cn(
                        'inline-flex items-center justify-center px-6 py-3 rounded-theme-button font-medium transition-all',
                        button.variant === 'outline'
                          ? 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white'
                          : button.variant === 'ghost'
                            ? 'text-theme-primary hover:bg-theme-primary/10'
                            : 'bg-theme-primary text-white hover:opacity-90'
                      )}
                    >
                      {button.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 relative aspect-square md:aspect-auto md:h-full">
              {imageData && (
                <Image
                  src={imageData.url}
                  alt={imageData.alt || headline || ''}
                  fill
                  className="object-cover rounded-theme-lg"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Centered hero (default)
  return (
    <section
      className={cn(
        'relative flex items-center justify-center bg-theme-light',
        heightClasses[data.height as keyof typeof heightClasses] || heightClasses.medium
      )}
    >
      <div className="container mx-auto px-4 text-center">
        {headline && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-theme-text">
            {headline}
          </h1>
        )}
        {subheadline && (
          <p className="text-lg md:text-xl text-theme-text-light mb-6 max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaButtons.map((button: CTAButton, index: number) => (
              <Link
                key={index}
                href={button.link || '#'}
                className={cn(
                  'inline-flex items-center justify-center px-6 py-3 rounded-theme-button font-medium transition-all',
                  button.variant === 'outline'
                    ? 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white'
                    : button.variant === 'ghost'
                      ? 'text-theme-primary hover:bg-theme-primary/10'
                      : 'bg-theme-primary text-white hover:opacity-90'
                )}
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default RenderHero
