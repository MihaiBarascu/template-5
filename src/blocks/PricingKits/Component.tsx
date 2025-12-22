'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { Check, X } from 'lucide-react'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'

interface Feature {
  text: string
  included?: boolean | null
  id?: string | null
}

interface CTA {
  label?: string | null
  link: string
}

interface Kit {
  name: string
  price: number
  priceLabel?: string | null
  originalPrice?: number | null
  description?: string | null
  features?: Feature[] | null
  badge?: 'none' | 'popular' | 'best-value' | 'new' | 'limited' | 'recommended' | null
  cta?: CTA | null
  image?: MediaType | string | null
  highlighted?: boolean | null
  id?: string | null
}

interface PricingKitsBlockProps {
  variant?: 'cards' | 'cards-image' | 'compact' | 'highlighted'
  heading?: string | null
  subheading?: string | null
  kits?: Kit[]
  columns?: 'auto' | '2' | '3' | '4'
  showCompareFeatures?: boolean
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function PricingKitsBlock({
  variant = 'cards',
  heading,
  subheading,
  kits = [],
  columns = 'auto',
  showCompareFeatures = true,
  backgroundColor = 'light',
}: PricingKitsBlockProps) {
  if (kits.length === 0) return null

  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  // Grid columns based on kits count or explicit setting
  const getGridCols = () => {
    if (columns !== 'auto') {
      return {
        '2': 'md:grid-cols-2',
        '3': 'md:grid-cols-2 lg:grid-cols-3',
        '4': 'md:grid-cols-2 lg:grid-cols-4',
      }[columns]
    }
    // Auto based on count
    switch (kits.length) {
      case 1:
        return 'max-w-md mx-auto'
      case 2:
        return 'md:grid-cols-2 max-w-3xl mx-auto'
      case 3:
        return 'md:grid-cols-2 lg:grid-cols-3'
      case 4:
      default:
        return 'md:grid-cols-2 lg:grid-cols-4'
    }
  }

  // Badge styles
  const getBadgeStyles = (badge: Kit['badge']) => {
    switch (badge) {
      case 'popular':
        return 'pricing-badge pricing-badge-popular'
      case 'best-value':
        return 'pricing-badge pricing-badge-best-value'
      case 'new':
        return 'pricing-badge bg-green-500 text-white'
      case 'limited':
        return 'pricing-badge bg-red-500 text-white'
      case 'recommended':
        return 'pricing-badge bg-theme-secondary text-theme-text-on-secondary'
      default:
        return ''
    }
  }

  const getBadgeText = (badge: Kit['badge']) => {
    switch (badge) {
      case 'popular':
        return 'Popular'
      case 'best-value':
        return 'Best Value'
      case 'new':
        return 'Nou'
      case 'limited':
        return 'Limitat'
      case 'recommended':
        return 'Recomandat'
      default:
        return ''
    }
  }

  // Render cards variant
  const renderCards = () => (
    <div className={cn('grid gap-6 lg:gap-8', getGridCols())}>
      {kits.map((kit, index) => {
        const hasImage = variant === 'cards-image' && typeof kit.image === 'object' && kit.image !== null
        const isHighlighted = kit.highlighted || (variant === 'highlighted' && kit.badge === 'popular')

        return (
          <div
            key={index}
            className={cn(
              'relative flex flex-col rounded-[var(--radius-card)] overflow-hidden transition-all duration-300',
              isDark ? 'bg-white/5 border border-white/10' : 'bg-theme-surface border border-theme-border',
              isHighlighted && 'ring-2 ring-theme-primary scale-105 z-10 card-glow-primary',
              !isHighlighted && 'hover-lift shadow-sm hover:shadow-lg'
            )}
          >
            {/* Badge */}
            {kit.badge && kit.badge !== 'none' && (
              <span className={getBadgeStyles(kit.badge)}>
                {getBadgeText(kit.badge)}
              </span>
            )}

            {/* Image (if cards-image variant) */}
            {hasImage && (
              <div className="relative aspect-[3/2] w-full">
                <Media
                  resource={kit.image as MediaType}
                  fill
                  size="400px"
                  imgClassName="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
              {/* Name */}
              <h3 className={cn(
                'text-xl font-bold mb-2',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {kit.name}
              </h3>

              {/* Description */}
              {kit.description && (
                <p className={cn(
                  'text-sm mb-4',
                  isDark ? 'text-white/60' : 'text-theme-text-light'
                )}>
                  {kit.description}
                </p>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    'text-4xl font-bold',
                    isDark ? 'text-white' : 'text-theme-text'
                  )}>
                    {kit.price}
                  </span>
                  <span className={cn(
                    'text-lg',
                    isDark ? 'text-white/60' : 'text-theme-text-light'
                  )}>
                    {kit.priceLabel || 'lei'}
                  </span>
                </div>
                {kit.originalPrice && kit.originalPrice > kit.price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      'text-lg line-through',
                      isDark ? 'text-white/40' : 'text-theme-text-muted'
                    )}>
                      {kit.originalPrice} {kit.priceLabel || 'lei'}
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      -{Math.round((1 - kit.price / kit.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              {showCompareFeatures && kit.features && kit.features.length > 0 && (
                <ul className="space-y-3 mb-6 flex-1">
                  {kit.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className={cn(
                        'flex items-start gap-2 text-sm',
                        feature.included === false && 'opacity-50'
                      )}
                    >
                      {feature.included !== false ? (
                        <Check className={cn(
                          'w-5 h-5 shrink-0',
                          isDark ? 'text-green-400' : 'text-green-600'
                        )} />
                      ) : (
                        <X className={cn(
                          'w-5 h-5 shrink-0',
                          isDark ? 'text-red-400' : 'text-red-500'
                        )} />
                      )}
                      <span className={cn(
                        isDark ? 'text-white/80' : 'text-theme-text'
                      )}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA Button */}
              {kit.cta?.link && (
                <Link
                  href={kit.cta.link}
                  className={cn(
                    'mt-auto w-full text-center py-3 px-6 rounded-full font-medium transition-all',
                    isHighlighted
                      ? 'btn-gradient shadow-lg hover:shadow-xl'
                      : isDark
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-theme-text-on-primary'
                  )}
                >
                  {kit.cta.label || 'Comanda'}
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  // Render compact/table variant
  const renderCompact = () => (
    <div className="overflow-x-auto">
      <table className={cn(
        'w-full border-collapse',
        isDark ? 'text-white' : 'text-theme-text'
      )}>
        <thead>
          <tr className={cn(
            'border-b',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            <th className="text-left py-4 px-4 font-semibold">Pachet</th>
            <th className="text-center py-4 px-4 font-semibold">Pret</th>
            <th className="text-center py-4 px-4 font-semibold hidden md:table-cell">Caracteristici</th>
            <th className="text-right py-4 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {kits.map((kit, index) => (
            <tr
              key={index}
              className={cn(
                'border-b transition-colors',
                isDark ? 'border-white/10 hover:bg-white/5' : 'border-theme-border hover:bg-theme-light/50',
                kit.highlighted && 'bg-theme-primary/5'
              )}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{kit.name}</span>
                  {kit.badge && kit.badge !== 'none' && (
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      kit.badge === 'popular' ? 'bg-theme-primary text-theme-text-on-primary' : 'bg-theme-accent text-theme-text-on-accent'
                    )}>
                      {getBadgeText(kit.badge)}
                    </span>
                  )}
                </div>
                {kit.description && (
                  <p className={cn(
                    'text-sm mt-1',
                    isDark ? 'text-white/60' : 'text-theme-text-light'
                  )}>
                    {kit.description}
                  </p>
                )}
              </td>
              <td className="py-4 px-4 text-center">
                <div className="font-bold text-xl">{kit.price}</div>
                <div className={cn(
                  'text-sm',
                  isDark ? 'text-white/60' : 'text-theme-text-light'
                )}>
                  {kit.priceLabel || 'lei'}
                </div>
              </td>
              <td className="py-4 px-4 hidden md:table-cell">
                <div className="flex flex-wrap gap-2 justify-center">
                  {kit.features?.slice(0, 3).map((feature, fIndex) => (
                    <span
                      key={fIndex}
                      className={cn(
                        'text-xs px-2 py-1 rounded',
                        isDark ? 'bg-white/10' : 'bg-theme-light'
                      )}
                    >
                      {feature.text}
                    </span>
                  ))}
                  {kit.features && kit.features.length > 3 && (
                    <span className={cn(
                      'text-xs px-2 py-1',
                      isDark ? 'text-white/60' : 'text-theme-text-light'
                    )}>
                      +{kit.features.length - 3} mai mult
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                {kit.cta?.link && (
                  <Link
                    href={kit.cta.link}
                    className={cn(
                      'inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-all',
                      'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary-dark'
                    )}
                  >
                    {kit.cta.label || 'Comanda'}
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <section className={cn('py-16 md:py-24', bgClass)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12 md:mb-16">
            {heading && (
              <h2 className={cn(
                'heading-h2 font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn(
                'max-w-2xl mx-auto text-lg',
                isDark ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {variant === 'compact' ? renderCompact() : renderCards()}
      </div>
    </section>
  )
}
