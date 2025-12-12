'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsentStore } from '@/stores/cookieConsentStore'
import { setDefaultConsent, updateConsent } from './gtmConsent'

interface GoogleTagManagerProps {
  containerId: string
}

/**
 * Google Tag Manager with Consent Mode v2
 *
 * IMPORTANT: Default consent is set to DENIED for all categories
 * and updated based on user preferences. GTM loads regardless of consent,
 * but tags inside GTM respect the consent state.
 */
export function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  const hasInteracted = useCookieConsentStore((state) => state.hasInteracted)
  const analytics = useCookieConsentStore((state) => state.analytics)
  const marketing = useCookieConsentStore((state) => state.marketing)
  const preferences = useCookieConsentStore((state) => state.preferences)

  // Set default consent BEFORE GTM loads
  useEffect(() => {
    setDefaultConsent()
  }, [])

  // Update consent when user makes a choice
  useEffect(() => {
    if (hasInteracted) {
      updateConsent({
        analytics,
        marketing,
        preferences,
      })
    }
  }, [hasInteracted, analytics, marketing, preferences])

  return (
    <>
      {/* GTM Consent Mode - Must be first, uses afterInteractive for App Router */}
      <Script
        id="gtm-consent-mode"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Set default consent to denied
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* GTM Container - Loads after consent is initialized */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${containerId}');
          `,
        }}
      />

      {/* GTM NoScript Fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}
