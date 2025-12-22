'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { X, ArrowRight, Phone, MessageCircle, Calendar } from 'lucide-react'

export interface FloatingCTAProps {
  text: string
  href: string
  variant?: 'primary' | 'accent' | 'secondary' | 'dark' | 'gradient'
  icon?: 'arrow' | 'phone' | 'message' | 'calendar' | 'none'
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'right-center' | 'left-center'
  shape?: 'pill' | 'rectangle' // pill = rounded-full, rectangle = rounded corners
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
  shape = 'pill',
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

  // Variant styles - all use theme tokens, no hardcoded colors
  const variantStyles = {
    primary: 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary-dark shadow-glow-primary',
    accent: 'bg-theme-accent text-theme-text-on-accent hover:opacity-90 shadow-glow-accent',
    secondary: 'bg-theme-secondary text-theme-text-on-secondary hover:opacity-90 shadow-glow-primary',
    dark: 'bg-theme-dark text-theme-text-on-dark hover:opacity-90 shadow-lg',
    gradient:
      'bg-gradient-to-r from-theme-primary to-theme-accent text-theme-text-on-primary hover:opacity-90 shadow-glow-primary',
  }

  // Check if vertical position
  const isVertical = position === 'right-center' || position === 'left-center'

  // Position styles
  const positionStyles = {
    'bottom-right': 'bottom-4 md:bottom-6 right-4 md:right-6',
    'bottom-left': 'bottom-4 md:bottom-6 left-4 md:left-6',
    'bottom-center': 'bottom-4 md:bottom-6 left-1/2 -translate-x-1/2',
    'right-center': 'right-0 top-1/2 -translate-y-1/2',
    'left-center': 'left-0 top-1/2 -translate-y-1/2',
  }

  // Rotation for vertical positions (text rotated 90 degrees)
  const rotationClass = position === 'right-center'
    ? 'rotate-90 origin-right translate-x-full -mr-2'
    : position === 'left-center'
      ? '-rotate-90 origin-left -translate-x-full ml-2'
      : ''

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
        'fixed z-50 transition-all duration-500',
        positionStyles[position],
        isVisible ? 'opacity-100' : 'opacity-0',
        // Animation based on position
        !isVertical && (isVisible ? 'translate-y-0' : 'translate-y-20'),
        isVertical && position === 'right-center' && (isVisible ? 'translate-x-0' : 'translate-x-20'),
        isVertical && position === 'left-center' && (isVisible ? 'translate-x-0' : '-translate-x-20'),
        !showOnMobile && 'hidden md:block',
      )}
    >
      <div className="relative flex items-center">
        <Link
          href={href}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 whitespace-nowrap',
            // Shape: vertical positions always use rounded-t-lg, others use pill/rectangle
            isVertical
              ? 'rounded-t-lg'
              : shape === 'pill'
                ? 'rounded-full'
                : 'rounded-[var(--radius-button)]',
            variantStyles[variant],
            rotationClass,
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
              'absolute w-6 h-6 rounded-full flex items-center justify-center',
              'bg-theme-dark text-theme-text-on-dark hover:opacity-80 transition-colors',
              'shadow-lg',
              // Position dismiss button based on orientation
              isVertical ? '-top-3 right-1/2 translate-x-1/2' : '-top-2 -right-2',
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
