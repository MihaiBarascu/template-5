'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { X, ArrowRight, Phone, MessageCircle, Calendar } from 'lucide-react'

export interface FloatingCTAProps {
  text: string
  href: string
  variant?: 'primary' | 'accent' | 'purple' | 'teal' | 'gradient'
  icon?: 'arrow' | 'phone' | 'message' | 'calendar' | 'none'
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  showOnMobile?: boolean
  pulseAnimation?: boolean
  dismissible?: boolean
  showAfterScroll?: number // pixels to scroll before showing
  hideOnPaths?: string[]
}

export function FloatingCTA({
  text,
  href,
  variant = 'primary',
  icon = 'arrow',
  position = 'bottom-right',
  showOnMobile = true,
  pulseAnimation = true,
  dismissible = true,
  showAfterScroll = 300,
  hideOnPaths = [],
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('floatingCTADismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Check if current path should hide the CTA
    const currentPath = window.location.pathname
    if (hideOnPaths.some((path) => currentPath.startsWith(path))) {
      return
    }

    const handleScroll = () => {
      if (window.scrollY > showAfterScroll) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, hideOnPaths])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDismissed(true)
    sessionStorage.setItem('floatingCTADismissed', 'true')
  }

  if (isDismissed || !isVisible) return null

  // Variant styles
  const variantStyles = {
    primary: 'bg-theme-primary text-white hover:bg-theme-primary-dark shadow-glow-primary',
    accent: 'bg-theme-accent text-white hover:opacity-90 shadow-glow-accent',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 shadow-[0_4px_20px_rgba(139,92,246,0.4)]',
    teal: 'bg-teal-600 text-white hover:bg-teal-700 shadow-[0_4px_20px_rgba(13,148,136,0.4)]',
    gradient:
      'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow-[0_4px_20px_rgba(139,92,246,0.4)]',
  }

  // Position styles
  const positionStyles = {
    'bottom-right': 'right-4 md:right-6',
    'bottom-left': 'left-4 md:left-6',
    'bottom-center': 'left-1/2 -translate-x-1/2',
  }

  // Icon components
  const IconComponent = {
    arrow: ArrowRight,
    phone: Phone,
    message: MessageCircle,
    calendar: Calendar,
    none: null,
  }[icon]

  return (
    <div
      className={cn(
        'fixed bottom-4 md:bottom-6 z-50 transition-all duration-500',
        positionStyles[position],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
        !showOnMobile && 'hidden md:block',
      )}
    >
      <div className="relative">
        <Link
          href={href}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300',
            variantStyles[variant],
            pulseAnimation && 'animate-pulse-glow',
          )}
        >
          <span>{text}</span>
          {IconComponent && <IconComponent className="w-5 h-5" />}
        </Link>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center',
              'bg-gray-800 text-white hover:bg-gray-700 transition-colors',
              'shadow-lg',
            )}
            aria-label="Inchide"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

export default FloatingCTA
