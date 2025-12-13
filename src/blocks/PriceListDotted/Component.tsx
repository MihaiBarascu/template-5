'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType, Service } from '@/payload-types'

interface PriceItem {
  id?: string | null
  name: string
  price: string
  duration?: string | null
  description?: string | null
  image?: MediaType | string | null
  featured?: boolean | null
}

interface Category {
  id?: string | null
  name: string
  items?: PriceItem[] | null
}

interface PriceListDottedBlockProps {
  variant?: 'single-column' | 'two-columns' | 'categorized' | 'with-images' | null
  heading?: string | null
  subheading?: string | null
  items?: PriceItem[] | null
  categories?: Category[] | null
  services?: Service[] | null
  currency?: string | null
  showDuration?: boolean | null
  dotStyle?: 'dotted' | 'solid' | 'dashed' | 'none' | null
  backgroundColor?: 'default' | 'light' | 'dark' | null
  ctaButton?: {
    show?: boolean | null
    label?: string | null
    link?: string | null
  } | null
}

// Single price item with dotted line
function PriceItem({
  name,
  price,
  duration,
  description,
  image,
  featured,
  currency,
  showDuration,
  dotStyle,
  isDark,
  withImage,
}: PriceItem & {
  currency: string
  showDuration: boolean
  dotStyle: string
  isDark: boolean
  withImage?: boolean
}) {
  const dotStyleClass = {
    dotted: 'border-dotted',
    solid: 'border-solid',
    dashed: 'border-dashed',
    none: 'border-transparent',
  }[dotStyle] || 'border-dotted'

  return (
    <div
      className={cn(
        'group py-3 px-4 -mx-4 rounded-lg transition-colors',
        featured && 'bg-theme-accent/5 border border-theme-accent/20',
        withImage && 'flex gap-4'
      )}
    >

      {/* Image (if with-images variant) */}
      {withImage && image && typeof image !== 'string' && 'url' in image && (
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Media
            resource={image as MediaType}
            fill
            size="64px"
            imgClassName="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        {/* Service name and price line */}
        <div className="flex items-baseline">
          <span className={cn(
            'font-medium flex items-center gap-2',
            featured && 'text-theme-accent font-semibold'
          )}>
            {name}
            {featured && (
              <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-theme-accent text-white rounded">
                Popular
              </span>
            )}
          </span>
          <span
            className={cn(
              'flex-1 mx-2 border-b-2',
              dotStyleClass,
              isDark ? 'border-white/20' : 'border-theme-border'
            )}
          />
          <span className={cn(
            'font-bold whitespace-nowrap',
            isDark ? 'text-white' : 'text-theme-text'
          )}>
            {price} {currency}
          </span>
        </div>

        {/* Duration and description */}
        {(showDuration && duration) || description ? (
          <div className="mt-1 flex items-center gap-3">
            {showDuration && duration && (
              <span className={cn(
                'text-sm flex items-center gap-1',
                isDark ? 'text-white/50' : 'text-theme-text-muted'
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {duration}
              </span>
            )}
            {description && (
              <span className={cn(
                'text-sm',
                isDark ? 'text-white/50' : 'text-theme-text-muted'
              )}>
                {description}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PriceListDottedBlock({
  variant = 'single-column',
  heading,
  subheading,
  items = [],
  categories = [],
  services = [],
  currency = 'RON',
  showDuration = true,
  dotStyle = 'dotted',
  backgroundColor = 'default',
  ctaButton,
}: PriceListDottedBlockProps) {
  const bgClass = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }[backgroundColor || 'default']

  const isDark = backgroundColor === 'dark'

  // Convert services to items if using services source
  // Use direct price and duration fields from the Service collection
  const displayItems: PriceItem[] = services && services.length > 0
    ? services.map((service) => ({
        id: service.id,
        name: service.title,
        price: service.price || '',
        duration: service.duration || null,
        description: service.shortDescription || null,
        featured: service.featured || false,
      }))
    : items || []

  const displayCategories = categories || []

  // Split items into two columns if needed
  const halfIndex = Math.ceil(displayItems.length / 2)
  const leftItems = displayItems.slice(0, halfIndex)
  const rightItems = displayItems.slice(halfIndex)

  return (
    <section className={cn('py-12 md:py-16', bgClass)}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section heading */}
        {(heading || subheading) && (
          <div className="text-center mb-10 md:mb-14">
            {heading && (
              <h2 className="heading-h2 font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn(
                'text-base md:text-lg max-w-2xl mx-auto',
                isDark ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Price list content based on variant */}
        {variant === 'categorized' ? (
          <div className="space-y-10">
            {displayCategories.map((category, catIndex) => (
              <div key={category.id || catIndex}>
                <h3 className={cn(
                  'text-xl font-semibold mb-6 pb-2 border-b-2',
                  isDark ? 'border-white/20' : 'border-theme-border'
                )}>
                  {category.name}
                </h3>
                <div className="space-y-4">
                  {category.items?.map((item, itemIndex) => (
                    <PriceItem
                      key={item.id || itemIndex}
                      {...item}
                      currency={currency || 'RON'}
                      showDuration={showDuration || false}
                      dotStyle={dotStyle || 'dotted'}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : variant === 'two-columns' ? (
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              {leftItems.map((item, index) => (
                <PriceItem
                  key={item.id || index}
                  {...item}
                  currency={currency || 'RON'}
                  showDuration={showDuration || false}
                  dotStyle={dotStyle || 'dotted'}
                  isDark={isDark}
                />
              ))}
            </div>
            <div className="space-y-4">
              {rightItems.map((item, index) => (
                <PriceItem
                  key={item.id || `right-${index}`}
                  {...item}
                  currency={currency || 'RON'}
                  showDuration={showDuration || false}
                  dotStyle={dotStyle || 'dotted'}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayItems.map((item, index) => (
              <PriceItem
                key={item.id || index}
                {...item}
                currency={currency || 'RON'}
                showDuration={showDuration || false}
                dotStyle={dotStyle || 'dotted'}
                isDark={isDark}
                withImage={variant === 'with-images'}
              />
            ))}
          </div>
        )}

        {/* CTA Button */}
        {ctaButton?.show && ctaButton?.label && ctaButton?.link && (
          <div className="text-center mt-10">
            <Link
              href={ctaButton.link}
              className={cn(
                'inline-flex items-center px-8 py-3 rounded-[var(--radius-button)] font-semibold transition-all duration-200',
                isDark
                  ? 'bg-white text-theme-dark hover:bg-theme-accent hover:text-white'
                  : 'bg-theme-primary text-white hover:bg-theme-secondary hover:scale-105'
              )}
            >
              {ctaButton.label}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default PriceListDottedBlock
