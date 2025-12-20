'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'

interface CTAButton {
  label: string
  link: string
  variant?: string | null
  id?: string | null
}

interface ImageType {
  url?: string | null
  alt?: string | null
}

interface CTABlockProps {
  variant?: string
  headline: string
  subheadline?: string
  image?: ImageType | string | null
  buttons?: CTAButton[]
  showPhoneNumber?: boolean
  backgroundColor?: string
  textAlignment?: string
  size?: string
  businessPhone?: string
}

// Helper function to get image URL
function getImageUrl(image: CTABlockProps['image']): string | null {
  if (!image) return null
  if (typeof image === 'string') return null
  return image.url || null
}

export function CTABlock({
  variant = 'centered',
  headline,
  subheadline,
  image,
  buttons = [],
  showPhoneNumber = false,
  backgroundColor = 'primary',
  textAlignment = 'center',
  size = 'medium',
  businessPhone,
}: CTABlockProps) {
  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor) || backgroundColor === 'accent'

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[textAlignment] || 'text-center'

  const sizeClass = {
    small: 'py-12',
    medium: 'py-16',
    large: 'py-24',
  }[size] || 'py-16'

  const buttonBaseClass = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all'

  const getButtonClass = (btnVariant?: string | null) => {
    if (isDark) {
      if (btnVariant === 'outline') {
        return cn(buttonBaseClass, 'border-2 border-white text-white hover:bg-white hover:text-theme-dark')
      }
      if (btnVariant === 'ghost') {
        return cn(buttonBaseClass, 'text-white hover:bg-white/10')
      }
      return cn(buttonBaseClass, 'bg-white text-theme-dark hover:bg-theme-light')
    } else {
      if (btnVariant === 'outline') {
        return cn(buttonBaseClass, 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white')
      }
      if (btnVariant === 'ghost') {
        return cn(buttonBaseClass, 'text-theme-primary hover:bg-theme-primary/10')
      }
      return cn(buttonBaseClass, 'bg-theme-primary text-white hover:bg-theme-secondary')
    }
  }

  const imageUrl = getImageUrl(image)

  if (variant === 'with-image' && imageUrl) {
    return (
      <section
        className={cn('relative', sizeClass)}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className={cn('relative container mx-auto px-4', alignClass)}>
          <h2 className="heading-h2 font-bold text-white mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">{subheadline}</p>
          )}
          {buttons.length > 0 && (
            <div className={cn('flex flex-wrap gap-4', textAlignment === 'center' && 'justify-center')}>
              {buttons.map((button, index) => (
                <Link key={index} href={button.link} className={getButtonClass(button.variant)}>
                  {button.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'split') {
    return (
      <section className={cn(sizeClass, bgClass)}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className={cn('heading-h2 font-bold mb-4', isDark ? 'text-white' : 'text-theme-text')}>{headline}</h2>
              {subheadline && (
                <p className={cn('text-lg', isDark ? 'text-white/80' : 'text-theme-text-light')}>
                  {subheadline}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {buttons.map((button, index) => (
                <Link key={index} href={button.link} className={getButtonClass(button.variant)}>
                  {button.label}
                </Link>
              ))}
              {showPhoneNumber && businessPhone && (
                <a href={`tel:${businessPhone}`} className={getButtonClass('outline')}>
                  {businessPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'minimal') {
    return (
      <section className={cn('py-8', bgClass)}>
        <div className="container mx-auto px-4">
          <div className={cn('flex flex-col sm:flex-row items-center gap-4', textAlignment === 'center' ? 'justify-center' : 'justify-between')}>
            <span className="text-lg font-medium">{headline}</span>
            {buttons.length > 0 && (
              <Link href={buttons[0].link} className={getButtonClass(buttons[0].variant)}>
                {buttons[0].label}
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'floating') {
    return (
      <section className="py-section">
        <div className="container mx-auto px-4">
          <div className={cn('rounded-[var(--radius-container)] p-8 md:p-12', bgClass, alignClass)}>
            <h2 className={cn('heading-h2 font-bold mb-4', isDark ? 'text-white' : 'text-theme-text')}>{headline}</h2>
            {subheadline && (
              <p className={cn('text-lg max-w-2xl mx-auto mb-8', isDark ? 'text-white/80' : 'text-theme-text-light')}>
                {subheadline}
              </p>
            )}
            {buttons.length > 0 && (
              <div className={cn('flex flex-wrap gap-4', textAlignment === 'center' && 'justify-center')}>
                {buttons.map((button, index) => (
                  <Link key={index} href={button.link} className={getButtonClass(button.variant)}>
                    {button.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default: centered
  return (
    <section className={cn(sizeClass, bgClass)}>
      <div className={cn('container mx-auto px-4', alignClass)}>
        <h2 className={cn('heading-h2 font-bold mb-4', isDark ? 'text-white' : 'text-theme-text')}>{headline}</h2>
        {subheadline && (
          <p className={cn('text-lg md:text-xl max-w-2xl mb-8', textAlignment === 'center' && 'mx-auto', isDark ? 'text-white/80' : 'text-theme-text-light')}>
            {subheadline}
          </p>
        )}
        {buttons.length > 0 && (
          <div className={cn('flex flex-wrap gap-4', textAlignment === 'center' && 'justify-center')}>
            {buttons.map((button, index) => (
              <Link key={index} href={button.link} className={getButtonClass(button.variant)}>
                {button.label}
              </Link>
            ))}
          </div>
        )}
        {showPhoneNumber && businessPhone && (
          <div className="mt-6">
            <a href={`tel:${businessPhone}`} className="text-lg font-medium hover:underline">
              sau suna-ne: {businessPhone}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default CTABlock
