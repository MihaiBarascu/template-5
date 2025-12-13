'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface AnnouncementBarProps {
  enabled?: boolean
  message: string
  linkText?: string
  linkUrl?: string
  backgroundColor?: 'primary' | 'secondary' | 'accent' | 'dark' | 'gradient'
  dismissible?: boolean
  icon?: 'megaphone' | 'gift' | 'star' | 'fire' | 'sparkles' | 'none'
  animated?: boolean
}

const ANNOUNCEMENT_DISMISSED_KEY = 'announcement-dismissed'

const icons = {
  megaphone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  gift: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  star: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  fire: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  none: null,
}

export function AnnouncementBar({
  enabled = true,
  message,
  linkText,
  linkUrl,
  backgroundColor = 'primary',
  dismissible = true,
  icon = 'megaphone',
  animated = true,
}: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY) === 'true'
    }
    return false
  })

  const handleDismiss = () => {
    sessionStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, 'true')
    setIsDismissed(true)
  }

  if (!enabled || isDismissed || !message) return null

  const bgClasses = {
    primary: 'bg-theme-primary text-white',
    secondary: 'bg-theme-secondary text-white',
    accent: 'bg-theme-accent text-white',
    dark: 'bg-theme-dark text-white',
    gradient: 'bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-accent text-white',
  }

  return (
    <div
      className={cn(
        'relative py-2.5 px-4 text-center text-sm font-medium',
        bgClasses[backgroundColor],
        animated && 'animate-fade-in'
      )}
      role="banner"
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        {icon !== 'none' && icons[icon] && (
          <span className={cn(animated && 'animate-bounce-subtle')}>
            {icons[icon]}
          </span>
        )}

        <span>{message}</span>

        {linkText && linkUrl && (
          <Link
            href={linkUrl}
            className="underline hover:no-underline font-semibold ml-1 text-theme-accent hover:opacity-80"
          >
            {linkText}
          </Link>
        )}

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            aria-label="Inchide anuntul"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default AnnouncementBar
