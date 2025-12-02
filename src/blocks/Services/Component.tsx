'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface Service {
  id: string
  title: string
  slug: string
  shortDescription?: string
  price?: number
  priceFrom?: boolean
  duration?: string
  icon?: string
  featured?: boolean
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
  backgroundColor?: string
  services?: Service[]
}

const iconMap: Record<string, React.ReactNode> = {
  scissors: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  crown: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4l3 8 6-3-3 11H6L3 9l6 3 3-8z" />
    </svg>
  ),
  default: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
}

export function ServicesBlock({
  variant = 'grid-3',
  heading,
  subheading,
  showPrices = true,
  showIcons = true,
  backgroundColor = 'default',
  services = [],
}: ServicesBlockProps) {
  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-theme-primary text-white',
  }[backgroundColor] || 'bg-white'

  const getColumns = () => {
    switch (variant) {
      case 'grid-2':
        return 'md:grid-cols-2'
      case 'grid-4':
        return 'md:grid-cols-2 lg:grid-cols-4'
      case 'list':
      case 'list-alternating':
        return 'grid-cols-1'
      default:
        return 'md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (services.length === 0) {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Nu sunt servicii disponibile.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {variant === 'list' || variant === 'list-alternating' ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={cn(
                  'flex items-center justify-between p-6 rounded-lg border',
                  backgroundColor === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white',
                  variant === 'list-alternating' && index % 2 === 1 && 'flex-row-reverse'
                )}
              >
                <div className="flex items-center gap-4">
                  {showIcons && (
                    <div className={cn('p-3 rounded-full', backgroundColor === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>
                      {iconMap[service.icon || 'default'] || iconMap.default}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    {service.shortDescription && (
                      <p className={cn('text-sm mt-1', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                        {service.shortDescription}
                      </p>
                    )}
                    {service.duration && (
                      <span className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                        {service.duration}
                      </span>
                    )}
                  </div>
                </div>
                {showPrices && service.price && (
                  <div className="text-right">
                    <span className="text-2xl font-bold">
                      {service.priceFrom && 'de la '}
                      {service.price} RON
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('grid gap-6', getColumns())}>
            {services.map((service) => (
              <div
                key={service.id}
                className={cn(
                  'p-6 rounded-lg border transition-all hover:shadow-lg',
                  backgroundColor === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-750' : 'border-gray-200 bg-white hover:border-theme-primary'
                )}
              >
                {showIcons && (
                  <div className={cn('w-14 h-14 rounded-full flex items-center justify-center mb-4', backgroundColor === 'dark' ? 'bg-gray-700 text-theme-accent' : 'bg-theme-primary/10 text-theme-primary')}>
                    {iconMap[service.icon || 'default'] || iconMap.default}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                {service.shortDescription && (
                  <p className={cn('text-sm mb-4', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                    {service.shortDescription}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  {service.duration && (
                    <span className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      {service.duration}
                    </span>
                  )}
                  {showPrices && service.price && (
                    <span className="text-xl font-bold text-theme-primary">
                      {service.priceFrom && 'de la '}
                      {service.price} RON
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesBlock
