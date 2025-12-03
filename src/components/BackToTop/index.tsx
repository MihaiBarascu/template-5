'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utilities/cn'

interface BackToTopProps {
  showAfter?: number
  position?: 'bottom-right' | 'bottom-left'
  className?: string
}

export function BackToTop({
  showAfter = 300,
  position = 'bottom-left',
  className,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > showAfter) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showAfter])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const positionClasses = {
    'bottom-right': 'right-6 bottom-24', // Above WhatsApp button
    'bottom-left': 'left-6 bottom-6',
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed z-40 p-3 rounded-full shadow-lg transition-all duration-300',
        'bg-theme-dark text-white hover:bg-theme-primary',
        'hover:scale-110 active:scale-95',
        positionClasses[position],
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
    >
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
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}

export default BackToTop
