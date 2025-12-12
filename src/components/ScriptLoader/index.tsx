'use client'

import { useEffect } from 'react'
import { GoogleAnalytics } from './GoogleAnalytics'
import { GoogleTagManager } from './GoogleTagManager'
import { FacebookPixel } from './FacebookPixel'
import { TikTokPixel } from './TikTokPixel'
import { Hotjar } from './Hotjar'
import { useCookieConsentStore } from '@/stores/cookieConsentStore'

export interface ScriptLoaderProps {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  tiktokPixelId?: string
  hotjarId?: string
  hotjarVersion?: number
}

/**
 * ScriptLoader - Main component that orchestrates all tracking scripts
 *
 * This component manages the conditional loading of all third-party scripts
 * based on user cookie consent preferences. Scripts are only loaded when
 * the user has given appropriate consent.
 *
 * IMPORTANT: This implements Google Consent Mode v2 for GDPR compliance
 *
 * @example
 * ```tsx
 * <ScriptLoader
 *   googleAnalyticsId="G-XXXXXXXXXX"
 *   googleTagManagerId="GTM-XXXXXXX"
 *   facebookPixelId="123456789"
 *   tiktokPixelId="ABCDEFG"
 *   hotjarId="1234567"
 * />
 * ```
 */
export function ScriptLoader({
  googleAnalyticsId,
  googleTagManagerId,
  facebookPixelId,
  tiktokPixelId,
  hotjarId,
  hotjarVersion = 6,
}: ScriptLoaderProps) {
  const hasInteracted = useCookieConsentStore((state) => state.hasInteracted)
  const analytics = useCookieConsentStore((state) => state.analytics)
  const marketing = useCookieConsentStore((state) => state.marketing)

  // Log consent changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && hasInteracted) {
      console.log('[ScriptLoader] Consent updated:', {
        analytics,
        marketing,
      })
    }
  }, [hasInteracted, analytics, marketing])

  return (
    <>
      {/* Google Tag Manager - Loads with consent mode, updates based on preferences */}
      {googleTagManagerId && <GoogleTagManager containerId={googleTagManagerId} />}

      {/* Google Analytics - Only loads when analytics consent is granted */}
      {googleAnalyticsId && analytics && (
        <GoogleAnalytics measurementId={googleAnalyticsId} />
      )}

      {/* Facebook Pixel - Only loads when marketing consent is granted */}
      {facebookPixelId && marketing && <FacebookPixel pixelId={facebookPixelId} />}

      {/* TikTok Pixel - Only loads when marketing consent is granted */}
      {tiktokPixelId && marketing && <TikTokPixel pixelId={tiktokPixelId} />}

      {/* Hotjar - Only loads when analytics consent is granted */}
      {hotjarId && analytics && (
        <Hotjar siteId={hotjarId} version={hotjarVersion} />
      )}
    </>
  )
}

// Re-export individual components for granular control
export { GoogleAnalytics } from './GoogleAnalytics'
export { GoogleTagManager } from './GoogleTagManager'
export { FacebookPixel } from './FacebookPixel'
export { TikTokPixel } from './TikTokPixel'
export { Hotjar } from './Hotjar'

// Re-export consent utilities
export {
  setDefaultConsent,
  updateConsent,
  shouldLoadAnalytics,
  shouldLoadMarketing,
  getCurrentConsentState,
} from './gtmConsent'
export type { ConsentParams, ConsentStatus } from './gtmConsent'
