'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'
import { ArrowIcon } from '@/blocks/_shared/iconComponents'

export interface PortfolioItem {
  id: string
  title: string
  shortDescription?: string | null
  client?: string | null
  externalUrl?: string | null
  featuredImage?: MediaType | null
  slug?: string | null
}

interface PortfolioBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  columns?: string
  showDescription?: boolean
  showClient?: boolean
  backgroundColor?: string
  ctaButton?: {
    enabled?: boolean | null
    label?: string | null
    link?: string | null
  } | null
  items?: PortfolioItem[]
}

// Icon for external link
const ExternalLinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

export function PortfolioBlock({
  variant = 'grid-masonry',
  heading,
  subheading,
  columns = '3',
  showDescription = true,
  showClient = false,
  backgroundColor = 'default',
  ctaButton,
  items = [],
}: PortfolioBlockProps) {
  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  // Column classes for grid
  const getColumns = (): string => {
    switch (columns) {
      case '2': return 'grid-cols-1 sm:grid-cols-2'
      case '4': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (items.length === 0) {
    return (
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          <div className="text-center py-16 border-2 border-dashed border-theme-border rounded-xl">
            <svg className="w-16 h-16 mx-auto text-theme-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-theme-text-muted">Nu sunt proiecte în portofoliu.</p>
          </div>
        </div>
      </section>
    )
  }

  // Render Portfolio Item
  const renderPortfolioItem = (item: PortfolioItem, index: number) => {
    const hasExternalUrl = item.externalUrl && item.externalUrl.trim() !== ''
    const linkUrl = hasExternalUrl ? item.externalUrl : (item.slug ? `/portofoliu/${item.slug}` : '#')
    const isExternal = hasExternalUrl

    const content = (
      <div
        className={cn(
          'group relative overflow-hidden rounded-[var(--radius-card)]',
          'animate-fade-in-up shadow-md hover:shadow-xl transition-shadow duration-300',
          variant === 'grid-masonry' ? 'break-inside-avoid mb-6' : 'aspect-[4/3]',
          index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
        )}
      >
        {/* Image */}
        <div className={cn(
          'relative w-full h-full',
          variant === 'grid-masonry' ? 'aspect-auto' : ''
        )}>
          {item.featuredImage ? (
            <Media
              resource={item.featuredImage}
              fill={variant !== 'grid-masonry'}
              size={variant === 'grid-masonry' ? undefined : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              imgClassName={cn(
                variant === 'grid-masonry' ? 'w-full h-auto' : 'object-cover',
                'transition-all duration-700 ease-out',
                'group-hover:scale-110'
              )}
            />
          ) : (
            <div className="w-full h-full min-h-[200px] bg-theme-light flex items-center justify-center">
              <svg className="w-16 h-16 text-theme-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Overlay - gradient from bottom */}
        <div className={cn(
          'absolute inset-0 transition-all duration-300',
          'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
          'opacity-60 group-hover:opacity-100'
        )} />

        {/* Content Overlay */}
        <div className={cn(
          'absolute inset-0 flex flex-col justify-end p-6',
          'transition-all duration-300'
        )}>
          {/* External Link Icon */}
          {isExternal && (
            <div className={cn(
              'absolute top-4 right-4',
              'w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm',
              'flex items-center justify-center text-white',
              'transform scale-0 group-hover:scale-100 transition-transform duration-300',
              'border border-white/30'
            )}>
              <ExternalLinkIcon />
            </div>
          )}

          {/* Title */}
          <h3 className={cn(
            'text-white text-xl font-bold mb-2',
            'transform translate-y-2 group-hover:translate-y-0',
            'transition-transform duration-300'
          )}>
            {item.title}
          </h3>

          {/* Description */}
          {showDescription && item.shortDescription && (
            <p className={cn(
              'text-white/80 text-sm line-clamp-2',
              'transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
              'transition-all duration-300 delay-75'
            )}>
              {item.shortDescription}
            </p>
          )}

          {/* Client */}
          {showClient && item.client && (
            <p className={cn(
              'text-white/60 text-xs mt-2',
              'transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
              'transition-all duration-300 delay-100'
            )}>
              Client: {item.client}
            </p>
          )}

          {/* View Project CTA */}
          <div className={cn(
            'mt-4 inline-flex items-center gap-2',
            'text-white text-sm font-medium',
            'transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
            'transition-all duration-300 delay-150'
          )}>
            <span>{isExternal ? 'Vezi site-ul' : 'Vezi proiectul'}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    )

    // Wrap in appropriate link
    if (isExternal && linkUrl) {
      return (
        <a
          key={item.id}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2 rounded-[var(--radius-card)]"
          aria-label={`Vezi proiectul ${item.title} - se deschide într-o fereastră nouă`}
        >
          {content}
        </a>
      )
    }

    // Fallback to internal link or # if no URL
    const internalUrl = linkUrl || '#'

    return (
      <Link
        key={item.id}
        href={internalUrl}
        className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2 rounded-[var(--radius-card)]"
        aria-label={`Vezi detalii pentru ${item.title}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <section
      className={cn('py-section', bgClass)}
      aria-labelledby={heading ? 'portfolio-heading' : undefined}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                id="portfolio-heading"
                className={cn(
                  'heading-h2 font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text'
                )}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn(
                'text-lg max-w-2xl mx-auto',
                isDark ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Portfolio Grid */}
        {variant === 'grid-masonry' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {items.map((item, index) => renderPortfolioItem(item, index))}
          </div>
        ) : variant === 'case-studies' ? (
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={item.id} className="grid md:grid-cols-2 gap-8 items-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="order-2 md:order-1">
                      {renderPortfolioItem(item, index)}
                    </div>
                    <div className="order-1 md:order-2 p-6">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      {item.shortDescription && (
                        <p className="text-theme-text-light mb-4">{item.shortDescription}</p>
                      )}
                      {item.externalUrl && (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-theme-primary font-medium hover:underline"
                        >
                          Vizitează site-ul
                          <ExternalLinkIcon />
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      {item.shortDescription && (
                        <p className="text-theme-text-light mb-4">{item.shortDescription}</p>
                      )}
                      {item.externalUrl && (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-theme-primary font-medium hover:underline"
                        >
                          Vizitează site-ul
                          <ExternalLinkIcon />
                        </a>
                      )}
                    </div>
                    <div>
                      {renderPortfolioItem(item, index)}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('grid', getColumns(), 'gap-6')}>
            {items.map((item, index) => renderPortfolioItem(item, index))}
          </div>
        )}

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.label && ctaButton.link && (
          <div className="text-center mt-12">
            <Link
              href={ctaButton.link}
              className={cn(
                'inline-flex items-center gap-2 px-8 py-3',
                'bg-theme-primary text-theme-text-on-primary font-semibold',
                'rounded-[var(--radius-button)] transition-all duration-300',
                'hover:bg-theme-secondary hover:scale-105'
              )}
            >
              {ctaButton.label}
              <ArrowIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default PortfolioBlock
