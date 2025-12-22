'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import * as LucideIcons from 'lucide-react'
import type { Service, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'
import { getLucideIcon, ArrowIcon } from '@/blocks/_shared/iconComponents'

interface ServicesBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  onlyFeatured?: boolean
  showIcons?: boolean
  showBookButton?: boolean
  bookButtonText?: string
  bookButtonLink?: string
  backgroundColor?: string
  hoverEffect?: 'default' | 'lift' | 'glow' | 'scale' | 'none'
  services?: Service[]
  detailBasePath?: string
}

// Render dynamic attributes
function AttributeList({
  attributes,
  isDark,
  layout = 'inline'
}: {
  attributes: Service['attributes']
  isDark: boolean
  layout?: 'inline' | 'stacked' | 'grid'
}) {
  if (!attributes || attributes.length === 0) return null

  if (layout === 'stacked') {
    return (
      <div className="space-y-2">
        {attributes.map((attr, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {attr.icon && (
              <span className={cn('flex-shrink-0', isDark ? 'text-theme-accent' : 'text-theme-primary')}>
                {getLucideIcon(attr.icon, 'w-4 h-4')}
              </span>
            )}
            <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-theme-text-muted')}>
              {attr.label}:
            </span>
            <span className={cn('font-medium', isDark ? 'text-white' : 'text-theme-text')}>
              {attr.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {attributes.map((attr, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {attr.icon && (
              <span className={cn('flex-shrink-0', isDark ? 'text-theme-accent' : 'text-theme-primary')}>
                {getLucideIcon(attr.icon, 'w-4 h-4')}
              </span>
            )}
            <div className="min-w-0">
              <div className={cn('text-xs truncate', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                {attr.label}
              </div>
              <div className={cn('font-semibold truncate', isDark ? 'text-white' : 'text-theme-text')}>
                {attr.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Inline layout (default)
  return (
    <div className="flex flex-wrap items-center gap-3">
      {attributes.map((attr, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {attr.icon && (
            <span className={cn('flex-shrink-0', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
              {getLucideIcon(attr.icon, 'w-4 h-4')}
            </span>
          )}
          <span className={cn('text-sm', isDark ? 'text-white/70' : 'text-theme-text-light')}>
            {attr.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// Price and Duration display component (kept for future use)
function _PriceDuration({
  price,
  duration,
  isDark,
  size = 'normal'
}: {
  price?: string | null
  duration?: string | null
  isDark: boolean
  size?: 'normal' | 'large'
}) {
  if (!price && !duration) return null

  return (
    <div className="flex items-center gap-3">
      {duration && (
        <span className={cn(
          'flex items-center gap-1',
          isDark ? 'text-white/60' : 'text-theme-text-muted'
        )}>
          <LucideIcons.Clock className="w-4 h-4" />
          <span className="text-sm">{duration}</span>
        </span>
      )}
      {price && (
        <span className={cn(
          'font-bold',
          size === 'large' ? 'text-2xl' : 'text-xl',
          isDark ? 'text-white' : 'text-theme-primary'
        )}>
          {price}
        </span>
      )}
    </div>
  )
}

export function ServicesBlock({
  variant = 'grid-3',
  heading,
  subheading,
  showIcons = true,
  showBookButton = false,
  bookButtonText = 'Programeaza-te',
  bookButtonLink = '/contact',
  backgroundColor = 'default',
  hoverEffect = 'default',
  services = [],
  detailBasePath,
}: ServicesBlockProps) {
  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  // Hover effect classes
  const getHoverClasses = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300'
      case 'glow':
        return isDark
          ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300'
          : 'hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)] transition-all duration-300'
      case 'scale':
        return 'hover:scale-[1.02] transition-all duration-300'
      case 'none':
        return ''
      default: // 'default'
        return 'card-hover'
    }
  }

  const hoverClasses = getHoverClasses()

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
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          <div className={cn(
            'text-center py-16 border-2 border-dashed rounded-xl',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            <LucideIcons.Package className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-white/40' : 'text-theme-text-muted')} />
            <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>Nu sunt servicii disponibile.</p>
          </div>
        </div>
      </section>
    )
  }

  // Price List Variant
  if (variant === 'price-list') {
    return (
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
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
                  'animate-fade-in-up',
                  index !== services.length - 1 && (isDark ? 'border-b border-white/10' : 'border-b border-theme-border'),
                  index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
                )}
              >
                {showIcons && (
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    'transition-colors duration-300',
                    isDark
                      ? 'bg-white/10 text-theme-accent group-hover:bg-theme-accent group-hover:text-white'
                      : 'bg-theme-primary/10 text-theme-primary group-hover:bg-theme-primary group-hover:text-white'
                  )}>
                    {getLucideIcon(service.icon, 'w-5 h-5')}
                  </div>
                )}

                <span className={cn(
                  'font-semibold transition-colors',
                  isDark ? 'text-white group-hover:text-theme-accent' : 'text-theme-text group-hover:text-theme-primary'
                )}>
                  {service.title}
                </span>

                <span className={cn(
                  'flex-grow border-b-2 border-dotted mx-2',
                  isDark ? 'border-white/20' : 'border-theme-border'
                )} />

                {/* Duration (if exists) */}
                {service.duration && (
                  <span className={cn('text-sm flex-shrink-0 flex items-center gap-1', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                    <LucideIcons.Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </span>
                )}

                {/* Price */}
                {service.price && (
                  <span className={cn(
                    'font-bold text-lg flex-shrink-0 ml-2',
                    isDark ? 'text-theme-accent' : 'text-theme-primary'
                  )}>
                    {service.price}
                  </span>
                )}
              </div>
            ))}
          </div>

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
                    : 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-secondary'
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
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className={cn(
                  'heading-h2 font-bold mb-4',
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
            {services.map((service, index) => {
              const serviceHref = detailBasePath && service.slug ? `${detailBasePath}/${service.slug}` : null
              const imageObj = service.image && typeof service.image === 'object' ? service.image as MediaType : null
              const hasImage = imageObj?.url

              const cardClassName = cn(
                'group flex items-center gap-6 p-6 rounded-[var(--radius-card)]',
                'animate-fade-in-up',
                hoverClasses,
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-white border border-theme-border hover:border-theme-primary/30',
                variant === 'list-alternating' && index % 2 === 1 && 'md:flex-row-reverse',
                serviceHref && 'cursor-pointer',
                index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
              )

              const cardContent = (
                <>
                  {/* Image if available, otherwise icon */}
                  {hasImage ? (
                    <div className="relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
                      <Media
                        resource={imageObj}
                        fill
                        size="128px"
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : showIcons && (
                    <div className={cn(
                      'flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center',
                      'transition-all duration-300 group-hover:scale-110',
                      isDark
                        ? 'bg-theme-accent/20 text-theme-accent'
                        : 'bg-theme-primary/10 text-theme-primary group-hover:bg-theme-primary group-hover:text-white'
                    )}>
                      {getLucideIcon(service.icon, 'w-7 h-7')}
                    </div>
                  )}

                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={cn(
                          'heading-h3 font-bold mb-1 transition-colors',
                          isDark ? 'text-white group-hover:text-theme-accent' : 'text-theme-text group-hover:text-theme-primary'
                        )}>
                          {service.title}
                          {service.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-theme-accent text-theme-text-on-accent rounded-full">
                              Popular
                            </span>
                          )}
                        </h3>
                        {service.shortDescription && (
                          <p className={cn('text-sm mb-2', isDark ? 'text-white/60' : 'text-theme-text-light')}>
                            {service.shortDescription}
                          </p>
                        )}
                        {/* Duration only - attributes shown on detail page */}
                        {service.duration && (
                          <div className="flex items-center gap-3">
                            <span className={cn('flex items-center gap-1 text-sm', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                              <LucideIcons.Clock className="w-4 h-4" />
                              {service.duration}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {service.price && (
                          <div className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-theme-primary')}>
                            {service.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )

              return serviceHref ? (
                <Link
                  key={service.id}
                  href={serviceHref}
                  className={cardClassName}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={service.id}
                  className={cardClassName}
                >
                  {cardContent}
                </div>
              )
            })}
          </div>

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
                    : 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-secondary'
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
    <section className={cn('py-section', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'heading-h2 font-bold mb-4',
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

        <div className={cn('grid gap-cards', getColumns())}>
          {services.map((service, index) => {
            const serviceHref = detailBasePath && service.slug ? `${detailBasePath}/${service.slug}` : null
            const displayStyle = service.displayStyle || 'card'
            const imageObj = service.image && typeof service.image === 'object' ? service.image as MediaType : null

            const cardClassName = cn(
              'group relative rounded-[var(--radius-card)] overflow-hidden',
              'animate-fade-in-up',
              hoverClasses,
              isDark
                ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                : 'bg-white border border-theme-border hover:border-theme-primary/30',
              service.featured && 'ring-2 ring-theme-accent',
              serviceHref && 'cursor-pointer',
              displayStyle === 'card-image' ? 'flex flex-col' : 'p-6',
              index < 8 && `animation-delay-${(index % 4) * 100 + 100}`
            )

            const cardContent = (
              <>
                {/* Image for card-image style */}
                {displayStyle === 'card-image' && imageObj?.url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Media
                      resource={imageObj}
                      fill
                      size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}

                <div className={cn(displayStyle === 'card-image' && 'p-6')}>
                  {/* Featured Badge */}
                  {service.featured && (
                    <div className="absolute -top-px -right-px z-10">
                      <div className="bg-theme-accent text-theme-text-on-accent text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Popular
                      </div>
                    </div>
                  )}

                  {/* Icon (only for non-image cards) */}
                  {showIcons && displayStyle !== 'card-image' && (
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-5',
                      'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                      isDark
                        ? 'bg-theme-accent/20 text-theme-accent group-hover:bg-theme-accent group-hover:text-white'
                        : 'bg-theme-primary/10 text-theme-primary group-hover:bg-theme-primary group-hover:text-white'
                    )}>
                      {getLucideIcon(service.icon, 'w-7 h-7')}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className={cn(
                    'heading-h3 font-bold mb-2 transition-colors',
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

                  {/* Price, Duration & Attributes */}
                  {(service.price || service.duration || (service.attributes && service.attributes.length > 0)) && (
                    <div className={cn(
                      'pt-4 mt-auto border-t',
                      isDark ? 'border-white/10' : 'border-theme-border'
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {service.duration && (
                            <span className={cn('flex items-center gap-1 text-sm', isDark ? 'text-white/50' : 'text-theme-text-muted')}>
                              <LucideIcons.Clock className="w-4 h-4" />
                              {service.duration}
                            </span>
                          )}
                          <AttributeList
                            attributes={displayStyle === 'detailed' ? service.attributes : service.attributes?.slice(0, 2)}
                            isDark={isDark}
                            layout="inline"
                          />
                        </div>
                        {service.price && (
                          <span className={cn(
                            'text-(length:--font-size-h5) font-bold',
                            isDark ? 'text-white' : 'text-theme-primary'
                          )}>
                            {service.price}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover gradient overlay */}
                <div className={cn(
                  'absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  'bg-gradient-to-t from-theme-primary/5 to-transparent'
                )} />
              </>
            )

            return serviceHref ? (
              <Link
                key={service.id}
                href={serviceHref}
                className={cardClassName}
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={service.id}
                className={cardClassName}
              >
                {cardContent}
              </div>
            )
          })}
        </div>

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
                  : 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-secondary'
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
