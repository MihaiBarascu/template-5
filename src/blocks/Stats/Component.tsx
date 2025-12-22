'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/utilities/cn'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'

interface Stat {
  value: string
  label: string
  icon?: string
  suffix?: string
}

interface StatsBlockProps {
  variant?: string
  heading?: string
  source?: string
  stats?: Stat[]
  animated?: boolean
  backgroundColor?: string
}

function AnimatedNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value) // Start with actual value
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // Set initial value immediately
    setDisplayValue(value)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true

            // Extract number from value
            const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))
            const hasDecimals = value.includes('.')

            if (!isNaN(numericValue)) {
              // Reset to 0 for animation
              setDisplayValue('0')

              const duration = 2000
              const startTime = performance.now()

              const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)
                const easeOutQuart = 1 - Math.pow(1 - progress, 4)
                const current = numericValue * easeOutQuart

                if (hasDecimals) {
                  setDisplayValue(current.toFixed(1) + suffix)
                } else {
                  setDisplayValue(Math.floor(current).toString() + suffix)
                }

                if (progress < 1) {
                  requestAnimationFrame(animate)
                } else {
                  setDisplayValue(value)
                }
              }

              requestAnimationFrame(animate)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, suffix])

  return <span ref={ref}>{displayValue}</span>
}

export function StatsBlock({
  variant = 'grid-4',
  heading,
  stats = [],
  animated = true,
  backgroundColor = 'primary',
}: StatsBlockProps) {
  const bgClass = getBgClasses(backgroundColor) || 'bg-theme-primary text-theme-text-on-primary'
  const isDark = backgroundColor === 'dark'
  const isPrimary = backgroundColor === 'primary'

  if (stats.length === 0) {
    return null
  }

  const getGridCols = () => {
    switch (variant) {
      case 'inline':
        return `grid-cols-${Math.min(stats.length, 4)}`
      case 'grid-3':
        return 'md:grid-cols-3'
      case 'minimal':
        return 'md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'md:grid-cols-2 lg:grid-cols-4'
    }
  }

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="heading-h2 font-bold text-center mb-12">{heading}</h2>
        )}

        {variant === 'inline' ? (
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {animated ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : stat.value}
                </div>
                <div className={cn(
                  'text-sm uppercase tracking-wide',
                  isDark ? 'text-theme-text-on-dark/80' : isPrimary ? 'text-theme-text-on-primary/80' : 'text-theme-text-light'
                )}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('grid gap-8', getGridCols())}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  'text-center p-6 rounded-[var(--radius-card)]',
                  variant === 'with-icons' && 'flex flex-col items-center',
                  backgroundColor === 'primary' && 'bg-theme-text-on-primary/10',
                  backgroundColor === 'dark' && 'card-gradient-subtle-dark',
                  backgroundColor === 'light' && 'card-gradient-subtle shadow-sm border border-theme-border',
                  backgroundColor === 'default' && 'card-gradient-subtle'
                )}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {animated ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : stat.value}
                </div>
                <div className={cn(
                  'text-sm uppercase tracking-wide',
                  isDark ? 'text-theme-text-on-dark/80' : isPrimary ? 'text-theme-text-on-primary/80' : 'text-theme-text-light'
                )}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default StatsBlock
