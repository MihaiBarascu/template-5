'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utilities/cn'

interface Message {
  text: string
  link?: string | null
  linkText?: string | null
  id?: string | null
}

interface AnnouncementBarBlockProps {
  variant?: string
  messages?: Message[] | null
  ctaButton?: {
    label?: string | null
    link?: string | null
  } | null
  countdown?: {
    endDate?: string | null
    expiredText?: string | null
  } | null
  icon?: string | null
  backgroundColor?: string
  position?: string
  sticky?: boolean
}

// Iconițe SVG pentru blocul AnnouncementBar
const icons: Record<string, React.ReactNode> = {
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
  bell: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  fire: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  megaphone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  percent: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  scale: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  tag: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  bullhorn: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  gem: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3L2 9l10 13 10-13-10-6zM2 9h20" />
    </svg>
  ),
  party: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  rocket: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
}

function CountdownTimer({ endDate, expiredText }: { endDate: string; expiredText?: string | null }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setIsExpired(true)
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (isExpired) {
    return <span>{expiredText || 'Oferta a expirat'}</span>
  }

  return (
    <div className="flex items-center gap-2 font-mono">
      {timeLeft.days > 0 && (
        <span className="bg-white/20 px-2 py-1 rounded">{timeLeft.days}z</span>
      )}
      <span className="bg-white/20 px-2 py-1 rounded">
        {timeLeft.hours.toString().padStart(2, '0')}
      </span>
      :
      <span className="bg-white/20 px-2 py-1 rounded">
        {timeLeft.minutes.toString().padStart(2, '0')}
      </span>
      :
      <span className="bg-white/20 px-2 py-1 rounded">
        {timeLeft.seconds.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

export function AnnouncementBarBlock({
  variant = 'simple',
  messages = [],
  ctaButton,
  countdown,
  icon,
  backgroundColor = 'primary',
  position = 'top',
  sticky = false,
}: AnnouncementBarBlockProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const messageList = messages || []

  useEffect(() => {
    if (variant === 'slider' && messageList.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % messageList.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [variant, messageList.length])

  if (isDismissed || messageList.length === 0) return null

  const bgClass =
    {
      primary: 'bg-theme-primary text-theme-text-on-primary',
      secondary: 'bg-theme-secondary text-theme-text-on-secondary',
      accent: 'bg-theme-accent text-theme-text-on-accent',
      dark: 'bg-theme-dark text-theme-text-on-dark',
      gradient: 'bg-gradient-to-r from-theme-primary to-theme-accent text-theme-text-on-primary',
      urgent: 'bg-error text-white',
      success: 'bg-success text-white',
    }[backgroundColor] || 'bg-theme-primary text-theme-text-on-primary'

  const currentMessage = messageList[currentIndex] || messageList[0]

  return (
    <div
      className={cn(
        'py-2 px-4 text-sm',
        bgClass,
        sticky && position === 'top' && 'sticky top-0 z-50',
        sticky && position === 'bottom' && 'sticky bottom-0 z-50'
      )}
    >
      <div className="container mx-auto flex items-center justify-center gap-4">
        {/* Iconiță - ascunsă pe mobil */}
        {icon && icon !== 'none' && icons[icon] && (
          <span className="shrink-0 hidden sm:block">{icons[icon]}</span>
        )}

        {variant === 'slider' && messageList.length > 1 ? (
          <div className="flex-1 text-center overflow-hidden h-6">
            <div
              className="transition-transform duration-500"
              style={{ transform: `translateY(-${currentIndex * 24}px)` }}
            >
              {messageList.map((msg, idx) => (
                <div key={msg.id || idx} className="h-6 flex items-center justify-center gap-2">
                  {msg.link ? (
                    <a
                      href={msg.link}
                      className="inline-flex items-center gap-1 hover:underline transition-all text-inherit"
                    >
                      <span className="truncate">{msg.text}</span>
                      <span className="hidden sm:inline font-semibold underline decoration-2 underline-offset-2 hover:decoration-4 whitespace-nowrap">
                        {msg.linkText || 'Afla mai mult'}
                      </span>
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <span className="truncate">{msg.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <span className="text-center flex-1 inline-flex items-center justify-center gap-2 flex-wrap">
              {currentMessage?.text}
              {currentMessage?.link && (
                <a
                  href={currentMessage.link}
                  className="inline-flex items-center gap-1 underline decoration-2 underline-offset-2 font-semibold hover:decoration-4 transition-all text-inherit"
                >
                  {currentMessage.linkText || 'Afla mai mult'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </span>

            {variant === 'with-button' && ctaButton?.link && (
              <a
                href={ctaButton.link}
                className="inline-flex items-center justify-center px-4 py-1.5 bg-theme-surface text-theme-primary rounded text-xs font-medium hover:bg-theme-light hover:text-theme-primary transition-colors whitespace-nowrap shadow-sm"
              >
                {ctaButton.label || 'Vezi oferta'}
              </a>
            )}

            {variant === 'countdown' && countdown?.endDate && (
              <CountdownTimer endDate={countdown.endDate} expiredText={countdown.expiredText} />
            )}
          </>
        )}

        {variant === 'dismissable' && (
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Inchide"
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

export default AnnouncementBarBlock
