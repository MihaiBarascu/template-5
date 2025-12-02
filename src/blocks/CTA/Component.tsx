'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

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
  const bgClass = {
    default: 'bg-white text-gray-900',
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-theme-primary text-white',
    accent: 'bg-theme-accent text-white',
  }[backgroundColor] || 'bg-theme-primary text-white'

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
    if (backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent') {
      if (btnVariant === 'outline') {
        return cn(buttonBaseClass, 'border-2 border-white text-white hover:bg-white hover:text-gray-900')
      }
      if (btnVariant === 'ghost') {
        return cn(buttonBaseClass, 'text-white hover:bg-white/10')
      }
      return cn(buttonBaseClass, 'bg-white text-gray-900 hover:bg-gray-100')
    } else {
      if (btnVariant === 'outline') {
        return cn(buttonBaseClass, 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white')
      }
      if (btnVariant === 'ghost') {
        return cn(buttonBaseClass, 'text-theme-primary hover:bg-theme-primary/10')
      }
      return cn(buttonBaseClass, 'bg-theme-primary text-white hover:bg-theme-primary-dark')
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{headline}</h2>
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
              <h2 className={cn('text-3xl md:text-4xl font-bold mb-4', backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent' ? 'text-white' : 'text-gray-900')}>{headline}</h2>
              {subheadline && (
                <p className={cn('text-lg', backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent' ? 'text-white/80' : 'text-gray-600')}>
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className={cn('rounded-2xl p-8 md:p-12', bgClass, alignClass)}>
            <h2 className={cn('text-3xl md:text-4xl font-bold mb-4', backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent' ? 'text-white' : 'text-gray-900')}>{headline}</h2>
            {subheadline && (
              <p className={cn('text-lg max-w-2xl mx-auto mb-8', backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent' ? 'text-white/80' : 'text-gray-600')}>
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
        <h2 className={cn('text-3xl md:text-4xl lg:text-5xl font-bold mb-4', backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent' ? 'text-white' : 'text-gray-900')}>{headline}</h2>
        {subheadline && (
          <p className={cn('text-lg md:text-xl max-w-2xl mb-8', textAlignment === 'center' && 'mx-auto', backgroundColor === 'primary' || backgroundColor === 'dark' || backgroundColor === 'accent' ? 'text-white/80' : 'text-gray-600')}>
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
