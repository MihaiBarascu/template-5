'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface Logo {
  logo: MediaType | string
  name: string
  url?: string | null
}

interface LogoCloudBlockProps {
  variant?: 'simple' | 'carousel' | 'cards' | 'grayscale' | 'with-text' | 'marquee'
  heading?: string
  subheading?: string
  logos?: Logo[]
  logoSize?: 'small' | 'medium' | 'large'
  columns?: '3' | '4' | '5' | '6'
  grayscale?: boolean
  backgroundColor?: 'default' | 'light' | 'dark' | 'transparent'
}

export function LogoCloudBlock({
  variant = 'simple',
  heading,
  subheading,
  logos = [],
  logoSize = 'medium',
  columns = '5',
  grayscale = false,
  backgroundColor = 'default',
}: LogoCloudBlockProps) {
  if (logos.length === 0) return null

  // Background colors
  const bgColors = {
    default: 'bg-background',
    light: 'bg-muted/50',
    dark: 'bg-theme-dark text-white',
    transparent: 'bg-transparent',
  }

  // Logo sizes (max height)
  const logoSizes = {
    small: 'h-8 md:h-10',
    medium: 'h-10 md:h-14',
    large: 'h-14 md:h-20',
  }

  // Grid columns
  const gridCols = {
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-4',
    '5': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-3 md:grid-cols-6',
  }

  // Render a single logo
  const renderLogo = (item: Logo, index: number) => {
    const hasLogo = typeof item.logo === 'object' && item.logo !== null && 'url' in item.logo
    if (!hasLogo) return null

    const logoElement = (
      <div
        className={cn(
          'relative flex items-center justify-center p-4 transition-all duration-300',
          variant === 'cards' &&
            (backgroundColor === 'dark'
              ? 'bg-white/5 rounded-lg'
              : 'bg-white rounded-lg shadow-sm'),
          (grayscale || variant === 'grayscale') &&
            'grayscale opacity-60 hover:grayscale-0 hover:opacity-100',
        )}
      >
        <Media
          resource={item.logo as MediaType}
          imgClassName={cn('object-contain w-auto', logoSizes[logoSize])}
        />
      </div>
    )

    if (item.url) {
      return (
        <Link
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-105 transition-transform"
          title={item.name}
        >
          {logoElement}
        </Link>
      )
    }

    return (
      <div key={index} title={item.name}>
        {logoElement}
      </div>
    )
  }

  // Simple grid variant
  const renderSimple = () => (
    <div className={cn('grid gap-8 items-center', gridCols[columns])}>{logos.map(renderLogo)}</div>
  )

  // Cards variant
  const renderCards = () => (
    <div className={cn('grid gap-4 items-center', gridCols[columns])}>{logos.map(renderLogo)}</div>
  )

  // With text variant
  const renderWithText = () => (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="shrink-0 text-center md:text-left">
        <p
          className={cn(
            'text-sm font-medium uppercase tracking-wider',
            backgroundColor === 'dark' ? 'text-white/60' : 'text-muted-foreground',
          )}
        >
          {heading || 'Partenerii nostri'}
        </p>
      </div>
      <div className="flex-1 flex flex-wrap items-center justify-center md:justify-start gap-8">
        {logos.map(renderLogo)}
      </div>
    </div>
  )

  // Marquee variant (infinite scroll)
  const renderMarquee = () => (
    <div className="overflow-hidden relative">
      <div className="flex animate-marquee">
        {/* First set */}
        {logos.map((item, index) => (
          <div key={`first-${index}`} className="flex-shrink-0 mx-8">
            {renderLogo(item, index)}
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {logos.map((item, index) => (
          <div key={`second-${index}`} className="flex-shrink-0 mx-8">
            {renderLogo(item, index)}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )

  // Choose render function
  const renderContent = () => {
    switch (variant) {
      case 'cards':
        return renderCards()
      case 'with-text':
        return renderWithText()
      case 'marquee':
        return renderMarquee()
      case 'grayscale':
        return renderSimple()
      default:
        return renderSimple()
    }
  }

  return (
    <section className={cn('py-10 md:py-14', bgColors[backgroundColor])}>
      <div className="container mx-auto px-4">
        {/* Header (not for with-text variant which has inline header) */}
        {variant !== 'with-text' && (heading || subheading) && (
          <div className="text-center mb-8 md:mb-10">
            {heading && (
              <h2
                className={cn(
                  'text-lg md:text-xl font-semibold',
                  backgroundColor === 'dark' ? 'text-white/70' : 'text-muted-foreground',
                )}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className={cn(
                  'mt-2 text-sm',
                  backgroundColor === 'dark' ? 'text-white/60' : 'text-muted-foreground',
                )}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Logos */}
        {renderContent()}
      </div>
    </section>
  )
}
