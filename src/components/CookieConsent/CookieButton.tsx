'use client'

import React from 'react'
import { Cookie } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { useCookieConsent } from '@/stores/cookieConsentStore'

/**
 * Floating Cookie Button - appears after user has interacted with consent
 * Allows users to change their cookie preferences at any time (GDPR requirement)
 */
export function CookieButton() {
  const hasInteracted = useCookieConsent((state) => state.hasInteracted)

  // Only show if user has already interacted with consent
  if (!hasInteracted) return null

  // For now, when clicked, resets consent to show banner again
  // In production, this should open the modal directly
  const handleClick = () => {
    useCookieConsent.getState().resetConsent()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 left-6 z-[90]',
        'p-4 rounded-full',
        'bg-theme-primary text-theme-text-on-primary',
        'shadow-lg hover:shadow-xl',
        'hover:scale-110 active:scale-95',
        'transition-all duration-200',
        'animate-slide-in-right',
        'focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2',
        'group'
      )}
      aria-label="Gestionează preferințele de cookie-uri"
      title="Setări cookie-uri"
    >
      <Cookie className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />

      {/* Tooltip on hover */}
      <span
        className={cn(
          'absolute left-full ml-3 top-1/2 -translate-y-1/2',
          'px-3 py-2 rounded-md',
          'bg-theme-dark text-white text-sm font-medium whitespace-nowrap',
          'opacity-0 group-hover:opacity-100',
          'pointer-events-none',
          'transition-opacity duration-200',
          'shadow-lg'
        )}
      >
        Setări cookie-uri
        {/* Arrow */}
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-theme-dark"
          aria-hidden="true"
        />
      </span>
    </button>
  )
}
