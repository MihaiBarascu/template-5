'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { useCookieConsent } from '@/stores/cookieConsentStore'

interface CookieBannerProps {
  title?: string
  description?: string
  privacyPolicyUrl?: string
  acceptButtonText?: string
  rejectButtonText?: string
  customizeButtonText?: string
  onOpenModal?: () => void
}

export function CookieBanner({
  title = 'Acest site folosește cookie-uri',
  description = 'Folosim cookie-uri pentru a-ți oferi cea mai bună experiență. Poți accepta toate cookie-urile, le poți refuza pe cele neesențiale sau le poți personaliza.',
  privacyPolicyUrl = '/politica-cookies',
  acceptButtonText = 'Acceptă toate',
  rejectButtonText = 'Refuză toate',
  customizeButtonText = 'Personalizează',
  onOpenModal,
}: CookieBannerProps) {
  const hasInteracted = useCookieConsent((state) => state.hasInteracted)
  const acceptAll = useCookieConsent((state) => state.acceptAll)
  const rejectAll = useCookieConsent((state) => state.rejectAll)

  // Don't show banner if user has already interacted
  if (hasInteracted) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[100]',
        'bg-white border-t-2 border-theme-border',
        'shadow-xl',
        'animate-slide-up'
      )}
      role="dialog"
      aria-label="Consimțământ cookie-uri"
      aria-describedby="cookie-banner-description"
    >
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Content */}
          <div className="flex-1 max-w-3xl">
            <h2 className="text-lg md:text-xl font-bold text-theme-text mb-2">
              {title}
            </h2>
            <p
              id="cookie-banner-description"
              className="text-sm md:text-base text-theme-text-light leading-relaxed"
            >
              {description}{' '}
              <Link
                href={privacyPolicyUrl}
                className="text-theme-primary underline hover:no-underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Politica de cookies
              </Link>
            </p>
          </div>

          {/* Buttons - All equal visual weight for GDPR compliance */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 min-w-fit">
            {/* Reject All - Secondary style but EQUAL prominence */}
            <button
              onClick={rejectAll}
              className={cn(
                'px-6 py-3 text-sm md:text-base font-semibold',
                'bg-white text-theme-text border-2 border-theme-border',
                'rounded-[var(--radius-button)]',
                'hover:bg-theme-surface-secondary hover:border-theme-text-light',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md',
                'active:scale-95',
                'min-h-[44px] whitespace-nowrap'
              )}
              aria-label="Refuză toate cookie-urile neesențiale"
            >
              {rejectButtonText}
            </button>

            {/* Customize - Outline style */}
            <button
              onClick={onOpenModal}
              className={cn(
                'px-6 py-3 text-sm md:text-base font-semibold',
                'bg-transparent text-theme-primary border-2 border-theme-primary',
                'rounded-[var(--radius-button)]',
                'hover:bg-theme-primary hover:text-white',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md',
                'active:scale-95',
                'min-h-[44px] whitespace-nowrap'
              )}
              aria-label="Personalizează preferințele de cookie-uri"
            >
              {customizeButtonText}
            </button>

            {/* Accept All - Primary style */}
            <button
              onClick={acceptAll}
              className={cn(
                'px-6 py-3 text-sm md:text-base font-semibold',
                'bg-theme-primary text-white',
                'rounded-[var(--radius-button)]',
                'hover:bg-theme-secondary',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md',
                'active:scale-95',
                'min-h-[44px] whitespace-nowrap'
              )}
              aria-label="Acceptă toate cookie-urile"
            >
              {acceptButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
