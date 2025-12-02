'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/utilities/cn'

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
  const bgClass = {
    default: 'bg-white text-gray-900',
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-theme-primary text-white',
  }[backgroundColor] || 'bg-theme-primary text-white'

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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{heading}</h2>
        )}

        {variant === 'inline' ? (
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {animated ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : stat.value}
                </div>
                <div className={cn('text-sm uppercase tracking-wide', backgroundColor === 'primary' || backgroundColor === 'dark' ? 'text-white/80' : 'text-gray-600')}>
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
                  'text-center p-6 rounded-lg',
                  variant === 'with-icons' && 'flex flex-col items-center',
                  backgroundColor === 'primary' && 'bg-white/10',
                  backgroundColor === 'dark' && 'bg-white/5',
                  backgroundColor === 'light' && 'bg-white shadow-sm',
                  backgroundColor === 'default' && 'bg-gray-50'
                )}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {animated ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : stat.value}
                </div>
                <div className={cn('text-sm uppercase tracking-wide', backgroundColor === 'primary' || backgroundColor === 'dark' ? 'text-white/80' : 'text-gray-600')}>
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
