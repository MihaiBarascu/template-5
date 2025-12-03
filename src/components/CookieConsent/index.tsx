'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface CookieConsentProps {
  enabled?: boolean
  position?: 'bottom' | 'bottom-left' | 'bottom-right'
  variant?: 'bar' | 'popup' | 'minimal'
  privacyPolicyUrl?: string
  message?: string
  acceptButtonText?: string
  declineButtonText?: string
  showDeclineButton?: boolean
}

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted'

export function CookieConsent({
  enabled = true,
  position = 'bottom',
  variant = 'bar',
  privacyPolicyUrl = '/politica-confidentialitate',
  message = 'Acest site foloseste cookie-uri pentru a-ti oferi cea mai buna experienta. Continuand navigarea, esti de acord cu utilizarea cookie-urilor.',
  acceptButtonText = 'Accept',
  declineButtonText = 'Refuz',
  showDeclineButton = false,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Check if user already consented
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [enabled])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false')
    setIsClosing(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!enabled || !isVisible) return null

  const positionClasses = {
    'bottom': 'bottom-0 left-0 right-0',
    'bottom-left': 'bottom-4 left-4 max-w-md',
    'bottom-right': 'bottom-4 right-4 max-w-md',
  }

  const variantClasses = {
    'bar': 'w-full',
    'popup': 'rounded-lg shadow-2xl mx-4 md:mx-0',
    'minimal': 'rounded-lg shadow-lg mx-4 md:mx-0',
  }

  return (
    <div
      className={cn(
        'fixed z-50 p-4 md:p-6 bg-white border-t border-theme-border',
        positionClasses[position],
        variantClasses[variant],
        isClosing ? 'animate-slide-down' : 'animate-slide-up',
        variant !== 'bar' && 'border rounded-lg'
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className={cn(
        'flex flex-col gap-4',
        variant === 'bar' && 'container mx-auto md:flex-row md:items-center md:justify-between'
      )}>
        <div className="flex-1">
          <p className="text-sm text-theme-text-light leading-relaxed">
            {message}{' '}
            <Link
              href={privacyPolicyUrl}
              className="text-theme-primary underline hover:no-underline font-medium"
            >
              Politica de confidentialitate
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {showDeclineButton && (
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-theme-text-light hover:text-theme-text transition-colors"
            >
              {declineButtonText}
            </button>
          )}
          <button
            onClick={handleAccept}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-theme-primary hover:bg-theme-secondary rounded-[var(--radius-button)] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {acceptButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
