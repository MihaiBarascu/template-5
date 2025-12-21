'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'
import { getLucideIconComponent } from '@/blocks/_shared/iconComponents'

interface Step {
  title: string
  description?: string | null
  image?: MediaType | string | null
  icon?: string | null
  badge?: string | null
}

interface CTAButton {
  enabled?: boolean | null
  label?: string | null
  link?: string | null
}

interface ProcessStepsBlockProps {
  variant?: 'zigzag' | 'timeline' | 'horizontal' | 'grid' | 'carousel'
  heading?: string | null
  subheading?: string | null
  steps?: Step[]
  showNumbers?: boolean
  showConnectors?: boolean
  imagePosition?: 'right' | 'left'
  ctaButton?: CTAButton
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function ProcessStepsBlock({
  variant = 'zigzag',
  heading,
  subheading,
  steps = [],
  showNumbers = true,
  showConnectors = true,
  imagePosition = 'right',
  ctaButton,
  backgroundColor = 'default',
}: ProcessStepsBlockProps) {
  if (steps.length === 0) return null

  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  // Render zigzag variant (premium plasturi style)
  const renderZigzag = () => (
    <div className="space-y-16 md:space-y-24">
      {steps.map((step, index) => {
        const isImageRight = imagePosition === 'right' ? index % 2 === 0 : index % 2 !== 0
        const hasImage = typeof step.image === 'object' && step.image !== null
        const IconComponent = step.icon ? getLucideIconComponent(step.icon) : null

        return (
          <div
            key={index}
            className={cn(
              'flex flex-col gap-8 items-center',
              'lg:flex-row lg:gap-16',
              isImageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
            )}
          >
            {/* Content */}
            <div className={cn('flex-1', isImageRight ? 'lg:text-left' : 'lg:text-right')}>
              <div className={cn(
                'flex items-center gap-4 mb-4',
                isImageRight ? 'lg:justify-start' : 'lg:justify-end',
                'justify-center'
              )}>
                {showNumbers && (
                  <div className="step-number">
                    {index + 1}
                  </div>
                )}
                {step.badge && (
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    isDark ? 'bg-theme-primary/20 text-theme-primary-light' : 'bg-theme-primary/10 text-theme-primary'
                  )}>
                    {step.badge}
                  </span>
                )}
              </div>

              <h3 className={cn(
                'text-2xl md:text-3xl font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {step.title}
              </h3>

              {step.description && (
                <p className={cn(
                  'text-lg leading-relaxed',
                  isDark ? 'text-white/70' : 'text-theme-text-light'
                )}>
                  {step.description}
                </p>
              )}
            </div>

            {/* Image or Icon */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              {hasImage ? (
                <div className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden shadow-lg hover-lift">
                  <Media
                    resource={step.image as MediaType}
                    fill
                    size="(max-width: 768px) 100vw, 50vw"
                    imgClassName="object-cover"
                  />
                </div>
              ) : IconComponent ? (
                <div className={cn(
                  'aspect-[4/3] rounded-[var(--radius-card)] flex items-center justify-center',
                  isDark ? 'bg-white/5' : 'bg-theme-light'
                )}>
                  <IconComponent className={cn(
                    'w-24 h-24',
                    isDark ? 'text-theme-primary-light' : 'text-theme-primary'
                  )} />
                </div>
              ) : (
                <div className={cn(
                  'aspect-[4/3] rounded-[var(--radius-card)] flex items-center justify-center',
                  isDark ? 'bg-white/5' : 'bg-theme-light'
                )}>
                  <span className="text-6xl font-bold text-theme-primary/20">{index + 1}</span>
                </div>
              )}
            </div>

            {/* Connector (optional) */}
            {showConnectors && index < steps.length - 1 && (
              <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 mt-8">
                <div className={cn(
                  'w-0.5 h-16',
                  isDark ? 'bg-white/20' : 'bg-theme-primary/20'
                )} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // Render timeline variant
  const renderTimeline = () => (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical line */}
      {showConnectors && (
        <div className={cn(
          'absolute left-8 top-0 bottom-0 w-0.5',
          isDark ? 'bg-white/20' : 'bg-theme-primary/20'
        )} />
      )}

      <div className="space-y-12">
        {steps.map((step, index) => {
          const hasImage = typeof step.image === 'object' && step.image !== null

          return (
            <div key={index} className="relative flex gap-6 lg:gap-10">
              {/* Number */}
              <div className="relative z-10 shrink-0">
                {showNumbers && (
                  <div className="step-number">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                {step.badge && (
                  <span className={cn(
                    'inline-block px-3 py-1 rounded-full text-sm font-medium mb-2',
                    isDark ? 'bg-theme-primary/20 text-theme-primary-light' : 'bg-theme-primary/10 text-theme-primary'
                  )}>
                    {step.badge}
                  </span>
                )}

                <h3 className={cn(
                  'text-xl md:text-2xl font-bold mb-2',
                  isDark ? 'text-white' : 'text-theme-text'
                )}>
                  {step.title}
                </h3>

                {step.description && (
                  <p className={cn(
                    'mb-4',
                    isDark ? 'text-white/70' : 'text-theme-text-light'
                  )}>
                    {step.description}
                  </p>
                )}

                {hasImage && (
                  <div className="relative aspect-video max-w-md rounded-[var(--radius-card)] overflow-hidden mt-4">
                    <Media
                      resource={step.image as MediaType}
                      fill
                      size="(max-width: 768px) 100vw, 448px"
                      imgClassName="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Render horizontal cards variant
  const renderHorizontal = () => (
    <div className={cn(
      'grid gap-6',
      steps.length <= 3 ? `grid-cols-1 md:grid-cols-${steps.length}` : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    )}>
      {steps.map((step, index) => {
        const hasImage = typeof step.image === 'object' && step.image !== null
        const IconComponent = step.icon ? getLucideIconComponent(step.icon) : null

        return (
          <div
            key={index}
            className={cn(
              'relative p-6 rounded-[var(--radius-card)] hover-lift',
              isDark ? 'bg-white/5 border border-white/10' : 'bg-theme-surface border border-theme-border shadow-sm'
            )}
          >
            {showNumbers && (
              <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-theme-primary text-white">
                {index + 1}
              </span>
            )}

            {hasImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Media
                  resource={step.image as MediaType}
                  fill
                  size="300px"
                  imgClassName="object-cover"
                />
              </div>
            )}

            {!hasImage && IconComponent && (
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                isDark ? 'bg-theme-primary/20' : 'bg-theme-primary/10'
              )}>
                <IconComponent className={cn(
                  'w-6 h-6',
                  isDark ? 'text-theme-primary-light' : 'text-theme-primary'
                )} />
              </div>
            )}

            <h3 className={cn(
              'text-lg font-semibold mb-2',
              isDark ? 'text-white' : 'text-theme-text'
            )}>
              {step.title}
            </h3>

            {step.description && (
              <p className={cn(
                'text-sm',
                isDark ? 'text-white/70' : 'text-theme-text-light'
              )}>
                {step.description}
              </p>
            )}

            {/* Connector arrow */}
            {showConnectors && index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <div className={cn(
                  'w-6 h-0.5',
                  isDark ? 'bg-white/20' : 'bg-theme-primary/30'
                )} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  // Render grid variant
  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {steps.map((step, index) => {
        const hasImage = typeof step.image === 'object' && step.image !== null
        const IconComponent = step.icon ? getLucideIconComponent(step.icon) : null

        return (
          <div key={index} className="flex gap-4">
            {showNumbers && (
              <div className="shrink-0">
                <div className="step-number">
                  {index + 1}
                </div>
              </div>
            )}

            <div className="flex-1">
              <h3 className={cn(
                'text-xl font-bold mb-2',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {step.title}
              </h3>

              {step.description && (
                <p className={cn(
                  'mb-4',
                  isDark ? 'text-white/70' : 'text-theme-text-light'
                )}>
                  {step.description}
                </p>
              )}

              {hasImage && (
                <div className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden">
                  <Media
                    resource={step.image as MediaType}
                    fill
                    size="(max-width: 768px) 100vw, 50vw"
                    imgClassName="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  // Render carousel variant (plasturi style benefits)
  const renderCarousel = () => (
    <div className="relative -mx-4 px-4">
      {/* Horizontal scrollable container */}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-theme-primary/30 scrollbar-track-transparent">
        {steps.map((step, index) => {
          const hasImage = typeof step.image === 'object' && step.image !== null
          const IconComponent = step.icon ? getLucideIconComponent(step.icon) : null

          return (
            <div
              key={index}
              className={cn(
                'flex-shrink-0 w-[280px] md:w-[320px] snap-center',
                'p-6 rounded-[var(--radius-card)]',
                isDark ? 'bg-white/5 border border-white/10' : 'bg-theme-surface border border-theme-border shadow-sm'
              )}
            >
              {/* Image */}
              {hasImage && (
                <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                  <Media
                    resource={step.image as MediaType}
                    fill
                    size="320px"
                    imgClassName="object-cover"
                  />
                </div>
              )}

              {/* Icon fallback */}
              {!hasImage && IconComponent && (
                <div className={cn(
                  'aspect-square rounded-lg flex items-center justify-center mb-4',
                  isDark ? 'bg-theme-primary/20' : 'bg-theme-primary/10'
                )}>
                  <IconComponent className={cn(
                    'w-16 h-16',
                    isDark ? 'text-theme-primary-light' : 'text-theme-primary'
                  )} />
                </div>
              )}

              {/* Badge/Number */}
              {(showNumbers || step.badge) && (
                <div className="mb-2">
                  {step.badge ? (
                    <span className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-medium',
                      isDark ? 'bg-theme-primary/20 text-theme-primary-light' : 'bg-theme-primary/10 text-theme-primary'
                    )}>
                      {step.badge}
                    </span>
                  ) : showNumbers && (
                    <span className={cn(
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-bold',
                      'bg-theme-primary text-white'
                    )}>
                      {index + 1}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className={cn(
                'text-lg font-semibold mb-2',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {step.title}
              </h3>

              {/* Description */}
              {step.description && (
                <p className={cn(
                  'text-sm line-clamp-4',
                  isDark ? 'text-white/70' : 'text-theme-text-light'
                )}>
                  {step.description}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Scroll hint gradient */}
      <div className={cn(
        'absolute top-0 right-0 bottom-4 w-12 pointer-events-none',
        'bg-gradient-to-l',
        isDark ? 'from-theme-dark' : 'from-theme-surface'
      )} />
    </div>
  )

  // Choose render function based on variant
  const renderContent = () => {
    switch (variant) {
      case 'timeline':
        return renderTimeline()
      case 'horizontal':
        return renderHorizontal()
      case 'grid':
        return renderGrid()
      case 'carousel':
        return renderCarousel()
      default:
        return renderZigzag()
    }
  }

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

        {/* Steps */}
        {renderContent()}

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.link && (
          <div className="mt-12 md:mt-16 text-center">
            <Link
              href={ctaButton.link}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full font-medium transition-all bg-theme-primary text-white hover:bg-theme-primary-dark shadow-lg hover:shadow-xl"
            >
              {ctaButton.label || 'Incepe acum'}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
