'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import type { Media } from '@/payload-types'

interface ScheduleItem {
  days?: string | null
  hours?: string | null
  isClosed?: boolean | null
  id?: string | null
}

interface OpeningHoursBlockProps {
  variant?: string | null
  heading?: string | null
  subheading?: string | null
  schedule?: ScheduleItem[] | null
  image?: string | Media | null
  showCurrentStatus?: boolean | null
  ctaButton?: {
    label?: string | null
    link?: string | null
  } | null
  backgroundColor?: string | null
}

function isCurrentlyOpen(schedule: ScheduleItem[]): { isOpen: boolean; message: string } {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  const dayNames: Record<number, string[]> = {
    0: ['duminica', 'dum', 'du'],
    1: ['luni', 'lu'],
    2: ['marti', 'ma'],
    3: ['miercuri', 'mi'],
    4: ['joi', 'jo'],
    5: ['vineri', 'vi'],
    6: ['sambata', 'sam', 'sa'],
  }

  for (const item of schedule) {
    if (!item.days || !item.hours) continue
    if (item.isClosed) continue

    const daysLower = item.days.toLowerCase()
    const dayVariants = dayNames[currentDay] || []

    let matchesDay = false

    if (daysLower.includes('-')) {
      const parts = daysLower.split('-').map((s) => s.trim())
      if (parts.length === 2) {
        const startDay = Object.entries(dayNames).find(([, names]) =>
          names.some((n) => parts[0].includes(n))
        )
        const endDay = Object.entries(dayNames).find(([, names]) =>
          names.some((n) => parts[1].includes(n))
        )

        if (startDay && endDay) {
          const startDayNum = parseInt(startDay[0])
          const endDayNum = parseInt(endDay[0])

          if (startDayNum <= endDayNum) {
            matchesDay = currentDay >= startDayNum && currentDay <= endDayNum
          } else {
            matchesDay = currentDay >= startDayNum || currentDay <= endDayNum
          }
        }
      }
    } else {
      matchesDay = dayVariants.some((variant) => daysLower.includes(variant))
    }

    if (matchesDay) {
      const timeMatch = item.hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
      if (timeMatch) {
        const openTime = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2])
        const closeTime = parseInt(timeMatch[3]) * 60 + parseInt(timeMatch[4])

        if (currentTime >= openTime && currentTime < closeTime) {
          const closeHour = Math.floor(closeTime / 60)
          const closeMin = closeTime % 60
          return {
            isOpen: true,
            message: `Deschis pana la ${closeHour.toString().padStart(2, '0')}:${closeMin.toString().padStart(2, '0')}`,
          }
        }
      }
    }
  }

  return { isOpen: false, message: 'Inchis acum' }
}

// Helper to extract image URL from Payload Media
function getImageUrl(image: string | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

export function OpeningHoursBlock({
  variant = 'simple',
  heading = 'Program',
  subheading,
  schedule: scheduleData,
  image,
  showCurrentStatus = true,
  ctaButton,
  backgroundColor = 'default',
}: OpeningHoursBlockProps) {
  const schedule = scheduleData || []
  const imageUrl = getImageUrl(image)

  const bgClass =
    {
      default: 'bg-white',
      light: 'bg-theme-light',
      dark: 'bg-theme-dark text-white',
      primary: 'bg-theme-primary text-white',
    }[backgroundColor || 'default'] || 'bg-white'

  const status = showCurrentStatus && schedule.length > 0 ? isCurrentlyOpen(schedule) : null

  const ScheduleList = () => (
    <div className="space-y-3">
      {schedule
        .filter((item) => item.days)
        .map((item, index) => (
          <div
            key={item.id || index}
            className={cn(
              'flex justify-between items-center py-2',
              index !== schedule.length - 1 && 'border-b',
              backgroundColor === 'dark' ? 'border-white/10' : 'border-theme-border'
            )}
          >
            <span className="font-medium">{item.days}</span>
            <span
              className={cn(
                item.isClosed && 'text-red-500',
                !item.isClosed && backgroundColor !== 'dark' && 'text-theme-text-light',
                !item.isClosed && backgroundColor === 'dark' && 'text-white/70'
              )}
            >
              {item.isClosed ? 'Inchis' : item.hours || '-'}
            </span>
          </div>
        ))}
    </div>
  )

  const StatusBadge = () =>
    status && (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
          status.isOpen
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        )}
      >
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            status.isOpen ? 'bg-green-500' : 'bg-red-500'
          )}
        />
        {status.message}
      </div>
    )

  if (variant === 'inline') {
    return (
      <div className={cn('py-4', bgClass)}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {status && <StatusBadge />}
            {schedule.slice(0, 3).map((item, index) => (
              <span key={item.id || index} className="flex items-center gap-2">
                <span className="font-medium">{item.days}:</span>
                <span
                  className={cn(
                    item.isClosed && 'text-red-500',
                    backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
                  )}
                >
                  {item.isClosed ? 'Inchis' : item.hours}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('py-8', bgClass)}>
        <div className="container mx-auto px-4">
          <div
            className={cn(
              'max-w-md mx-auto p-6 rounded-xl shadow-lg',
              backgroundColor === 'dark' ? 'bg-white/5' : 'bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-theme-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {heading}
              </h3>
              {status && <StatusBadge />}
            </div>
            <ScheduleList />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'with-image') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {imageUrl && (
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={heading || 'Program'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              {heading && (
                <h2 className="text-3xl font-bold mb-4">{heading}</h2>
              )}
              {subheading && (
                <p
                  className={cn(
                    'text-lg mb-6',
                    backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
                  )}
                >
                  {subheading}
                </p>
              )}
              {status && (
                <div className="mb-6">
                  <StatusBadge />
                </div>
              )}
              <ScheduleList />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'with-cta') {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {heading && (
              <h2 className="text-3xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p
                className={cn(
                  'text-lg mb-6',
                  backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
                )}
              >
                {subheading}
              </p>
            )}
            {status && (
              <div className="mb-8">
                <StatusBadge />
              </div>
            )}
            <div
              className={cn(
                'p-6 rounded-xl mb-8',
                backgroundColor === 'dark' ? 'bg-white/5' : 'bg-theme-light'
              )}
            >
              <ScheduleList />
            </div>
            {ctaButton?.label && ctaButton?.link && (
              <a
                href={ctaButton.link}
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors',
                  backgroundColor === 'primary'
                    ? 'bg-white text-theme-primary hover:bg-theme-light'
                    : 'bg-theme-primary text-white hover:bg-theme-primary-dark'
                )}
              >
                {ctaButton.label}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default: simple variant
  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {(heading || status) && (
            <div className="flex items-center justify-between mb-8">
              {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
              {status && <StatusBadge />}
            </div>
          )}
          {subheading && (
            <p
              className={cn(
                'text-lg mb-6',
                backgroundColor === 'dark' ? 'text-white/70' : 'text-theme-text-light'
              )}
            >
              {subheading}
            </p>
          )}
          <ScheduleList />
        </div>
      </div>
    </section>
  )
}

export default OpeningHoursBlock
