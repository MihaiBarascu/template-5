'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsentStore } from '@/stores/cookieConsentStore'
import { setDefaultConsent, updateConsent } from './gtmConsent'

interface GoogleAnalyticsProps {
  measurementId: string
}

/**
 * Google Analytics 4 with Consent Mode v2
 * Only loads when analytics consent is granted
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const hasInteracted = useCookieConsentStore((state) => state.hasInteracted)
  const analytics = useCookieConsentStore((state) => state.analytics)
  const marketing = useCookieConsentStore((state) => state.marketing)
  const preferences = useCookieConsentStore((state) => state.preferences)

  // Set default consent on mount (before scripts load)
  useEffect(() => {
    setDefaultConsent()
  }, [])

  // Update consent when user interacts
  useEffect(() => {
    if (hasInteracted) {
      updateConsent({
        analytics,
        marketing,
        preferences,
      })
    }
  }, [hasInteracted, analytics, marketing, preferences])

  // Don't render scripts if user hasn't consented to analytics
  if (!analytics) {
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      {/* Google Analytics Configuration */}
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  )
}
