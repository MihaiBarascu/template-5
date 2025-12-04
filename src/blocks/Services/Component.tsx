'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface Service {
  id: string
  title: string
  slug: string
  shortDescription?: string | null
  price?: number | null
  priceFrom?: boolean | null
  duration?: string | null
  icon?: string | null
  featured?: boolean | null
}

interface ServicesBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  onlyFeatured?: boolean
  showPrices?: boolean
  showIcons?: boolean
  showDuration?: boolean
  showBookButton?: boolean
  bookButtonText?: string
  bookButtonLink?: string
  backgroundColor?: string
  services?: Service[]
}

// Comprehensive icon map with professional SVG icons
const iconMap: Record<string, React.ReactNode> = {
  scissors: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  crown: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4l3 8 6-3-3 11H6L3 9l6 3 3-8z" />
    </svg>
  ),
  heart: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  star: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  clock: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  brush: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  spa: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  color: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  face: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  hand: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  ),
  gift: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  fire: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  default: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
}

// Arrow icon for links
const ArrowIcon = () => (
  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export function ServicesBlock({
  variant = 'grid-3',
  heading,
  subheading,
  showPrices = true,
  showIcons = true,
  showDuration = true,
  showBookButton = false,
  bookButtonText = 'Programeaza-te',
  bookButtonLink = '/contact',
  backgroundColor = 'default',
  services = [],
}: ServicesBlockProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Background classes
  const bgClasses: Record<string, string> = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark',
    primary: 'bg-theme-primary',
  }

  // Text color based on background
  const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

  const getColumns = () => {
    switch (variant) {
      case 'grid-2': return 'md:grid-cols-2'
      case 'grid-4': return 'md:grid-cols-2 lg:grid-cols-4'
      case 'list':
      case 'list-alternating':
      case 'price-list': return 'grid-cols-1'
      default: return 'md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (services.length === 0) {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.default)}>
        <div className="container mx-auto px-4">
          <div className={cn(
            'text-center py-16 border-2 border-dashed rounded-xl',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            <svg className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-white/40' : 'text-theme-text-muted')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>Nu sunt servicii disponibile.</p>
          </div>
        </div>
      </section>
    )
  }

  // Price List Variant - Dotted line style
  if (variant === 'price-list') {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.default)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                  {subheading}
                </p>
              )}
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-1">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={cn(
                  'group flex items-center gap-2 py-4',
                  'transform transition-all duration-500',
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
                  index !== services.length - 1 && (isDark ? 'border-b border-white/10' : 'border-b border-theme-border')
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                {showIcons && (
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    'transition-colors duration-300',
                    isDark
                      ? 'bg-white/10 text-theme-accent group-hover:bg-theme-accent group-hover:text-white'
                      : 'bg-theme-primary/10 text-theme-primary group-hover:bg-theme-primary group-hover:text-white'
                  )}>
                    {iconMap[service.icon || 'default'] || iconMap.default}
                  </div>
                )}

                {/* Title */}
                <span className={cn(
                  'font-semibold transition-colors',
                  isDark ? 'text-white group-hover:text-theme-accent' : 'text-theme-text group-hover:text-theme-primary'
                )}>
                  {service.title}
                </span>

                {/* Dotted line */}
                <span className={cn(
                  'flex-grow border-b-2 border-dotted mx-2',
                  isDark ? 'border-white/20' : 'border-theme-border'
                )} />

                {/* Duration */}
                {showDuration && service.duration && (
                  <span className={cn('text-sm flex-shrink-0', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                    {service.duration}
                  </span>
                )}

                {/* Price */}
                {showPrices && service.price && (
                  <span className={cn(
                    'font-bold text-lg flex-shrink-0 ml-2',
                    isDark ? 'text-theme-accent' : 'text-theme-primary'
                  )}>
                    {service.priceFrom && <span className="text-sm font-normal mr-1">de la</span>}
                    {service.price} <span className="text-sm">RON</span>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Book Button */}
          {showBookButton && (
            <div className="text-center mt-10">
              <Link
                href={bookButtonLink}
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-4',
                  'font-semibold rounded-[var(--radius-button)]',
                  'transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white text-theme-dark hover:bg-theme-accent hover:text-white'
                    : 'bg-theme-primary text-white hover:bg-theme-secondary'
                )}
              >
                {bookButtonText}
                <ArrowIcon />
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  // List Variants
  if (variant === 'list' || variant === 'list-alternating') {
    return (
      <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.default)}>
        <div className="container mx-auto px-4">
          {/* Header */}
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                  {subheading}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={cn(
                  'group flex items-center gap-6 p-6 rounded-[var(--radius-card)]',
                  'transform transition-all duration-500',
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                    : 'bg-white hover:shadow-lg border border-theme-border hover:border-theme-primary/30',
                  variant === 'list-alternating' && index % 2 === 1 && 'md:flex-row-reverse'
                )}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {/* Icon */}
                {showIcons && (
                  <div className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center',
                    'transition-all duration-300 group-hover:scale-110',
                    isDark
                      ? 'bg-theme-accent/20 text-theme-accent'
                      : 'bg-theme-primary/10 text-theme-primary group-hover:bg-theme-primary group-hover:text-white'
                  )}>
                    {iconMap[service.icon || 'default'] || iconMap.default}
                  </div>
                )}

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn(
                        'text-xl font-bold mb-1',
                        isDark ? 'text-white' : 'text-theme-text'
                      )}>
                        {service.title}
                        {service.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-theme-accent text-white rounded-full">
                            Popular
                          </span>
                        )}
                      </h3>
                      {service.shortDescription && (
                        <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-theme-text-light')}>
                          {service.shortDescription}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {showPrices && service.price && (
                        <div className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-theme-primary')}>
                          {service.priceFrom && <span className="text-sm font-normal">de la </span>}
                          {service.price} <span className="text-sm">RON</span>
                        </div>
                      )}
                      {showDuration && service.duration && (
                        <span className={cn('text-sm', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                          {service.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book Button */}
          {showBookButton && (
            <div className="text-center mt-10">
              <Link
                href={bookButtonLink}
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-4',
                  'font-semibold rounded-[var(--radius-button)]',
                  'transition-all duration-300 hover:scale-105',
                  isDark
                    ? 'bg-white text-theme-dark hover:bg-theme-accent hover:text-white'
                    : 'bg-theme-primary text-white hover:bg-theme-secondary'
                )}
              >
                {bookButtonText}
                <ArrowIcon />
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Grid Variants (default)
  return (
    <section className={cn('py-section', bgClasses[backgroundColor] || bgClasses.default)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className={cn('grid gap-6', getColumns())}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={cn(
                'group relative p-6 rounded-[var(--radius-card)] overflow-hidden',
                'transform transition-all duration-500',
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-white hover:shadow-xl border border-theme-border hover:border-theme-primary/30',
                service.featured && 'ring-2 ring-theme-accent'
              )}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              {/* Featured Badge */}
              {service.featured && (
                <div className="absolute -top-px -right-px">
                  <div className="bg-theme-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              {showIcons && (
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-5',
                  'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                  isDark
                    ? 'bg-theme-accent/20 text-theme-accent group-hover:bg-theme-accent group-hover:text-white'
                    : 'bg-theme-primary/10 text-theme-primary group-hover:bg-theme-primary group-hover:text-white'
                )}>
                  {iconMap[service.icon || 'default'] || iconMap.default}
                </div>
              )}

              {/* Title */}
              <h3 className={cn(
                'text-xl font-bold mb-2 transition-colors',
                isDark ? 'text-white group-hover:text-theme-accent' : 'text-theme-text group-hover:text-theme-primary'
              )}>
                {service.title}
              </h3>

              {/* Description */}
              {service.shortDescription && (
                <p className={cn(
                  'text-sm mb-4 line-clamp-2',
                  isDark ? 'text-white/60' : 'text-theme-text-light'
                )}>
                  {service.shortDescription}
                </p>
              )}

              {/* Footer */}
              <div className={cn(
                'flex items-center justify-between pt-4 mt-auto',
                'border-t',
                isDark ? 'border-white/10' : 'border-theme-border'
              )}>
                {/* Duration */}
                {showDuration && service.duration && (
                  <div className="flex items-center gap-1.5">
                    <svg className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-theme-text-muted')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={cn('text-sm', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                      {service.duration}
                    </span>
                  </div>
                )}

                {/* Price */}
                {showPrices && service.price && (
                  <span className={cn(
                    'text-xl font-bold',
                    isDark ? 'text-white' : 'text-theme-primary'
                  )}>
                    {service.priceFrom && <span className="text-xs font-normal mr-0.5">de la</span>}
                    {service.price} <span className="text-sm font-medium">RON</span>
                  </span>
                )}
              </div>

              {/* Hover gradient overlay */}
              <div className={cn(
                'absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                'bg-gradient-to-t from-theme-primary/5 to-transparent'
              )} />
            </div>
          ))}
        </div>

        {/* Book Button */}
        {showBookButton && (
          <div className="text-center mt-12">
            <Link
              href={bookButtonLink}
              className={cn(
                'group inline-flex items-center gap-2 px-8 py-4',
                'font-semibold rounded-[var(--radius-button)]',
                'transition-all duration-300 hover:scale-105 hover:shadow-xl',
                isDark
                  ? 'bg-white text-theme-dark hover:bg-theme-accent hover:text-white'
                  : 'bg-theme-primary text-white hover:bg-theme-secondary'
              )}
            >
              {bookButtonText}
              <ArrowIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesBlock
