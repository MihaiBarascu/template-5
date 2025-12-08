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
      primary: 'bg-theme-primary',
      red: 'bg-red-600',
      green: 'bg-green-600',
      blue: 'bg-blue-600',
      black: 'bg-theme-dark',
      gradient: 'bg-gradient-to-r from-theme-primary to-purple-600',
    }[backgroundColor] || 'bg-theme-primary'

  const currentMessage = messageList[currentIndex] || messageList[0]

  return (
    <div
      className={cn(
        'text-white py-2 px-4 text-sm',
        bgClass,
        sticky && position === 'top' && 'sticky top-0 z-50',
        sticky && position === 'bottom' && 'sticky bottom-0 z-50'
      )}
    >
      <div className="container mx-auto flex items-center justify-center gap-4">
        {variant === 'slider' && messageList.length > 1 ? (
          <div className="flex-1 text-center overflow-hidden">
            <div
              className="transition-transform duration-500"
              style={{ transform: `translateY(-${currentIndex * 100}%)` }}
            >
              {messageList.map((msg, idx) => (
                <div key={msg.id || idx} className="h-6 flex items-center justify-center">
                  <span>{msg.text}</span>
                  {msg.link && (
                    <a href={msg.link} className="ml-2 underline hover:no-underline">
                      {msg.linkText || 'Afla mai mult'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <span className="text-center flex-1">
              {currentMessage?.text}
              {currentMessage?.link && (
                <a href={currentMessage.link} className="ml-2 underline hover:no-underline">
                  {currentMessage.linkText || 'Afla mai mult'}
                </a>
              )}
            </span>

            {variant === 'with-button' && ctaButton?.link && (
              <a
                href={ctaButton.link}
                className="px-4 py-1 bg-white text-theme-text rounded text-xs font-medium hover:bg-theme-light transition-colors"
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
