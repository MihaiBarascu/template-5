/**
 * Google Consent Mode v2 Utility Functions
 * Implements Google's consent mode for GDPR compliance
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */

export type ConsentStatus = 'granted' | 'denied'

export interface ConsentParams {
  ad_storage?: ConsentStatus
  ad_user_data?: ConsentStatus
  ad_personalization?: ConsentStatus
  analytics_storage?: ConsentStatus
  functionality_storage?: ConsentStatus
  personalization_storage?: ConsentStatus
  security_storage?: ConsentStatus
  wait_for_update?: number
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: ConsentParams[]
    gtag?: (...args: [string, string, ConsentParams]) => void
  }
}

/**
 * Initialize dataLayer and gtag function if not already present
 */
export function initializeDataLayer(): void {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []

  if (!window.gtag) {
    window.gtag = function gtag(...args: [string, string, ConsentParams]) {
      window.dataLayer.push(args as unknown as ConsentParams)
    }
  }
}

/**
 * Set default consent state (called BEFORE GTM/GA loads)
 * This ensures consent mode is active from the very first page load
 */
export function setDefaultConsent(): void {
  if (typeof window === 'undefined') return

  initializeDataLayer()

  window.gtag?.('consent', 'default', {
    // Advertising and marketing
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',

    // Analytics
    analytics_storage: 'denied',

    // Functionality and preferences
    functionality_storage: 'denied',
    personalization_storage: 'denied',

    // Security (always granted)
    security_storage: 'granted',

    // Wait up to 500ms for user consent before firing tags
    wait_for_update: 500,
  })
}

/**
 * Update consent based on user preferences
 * Maps our cookie consent categories to Google Consent Mode v2 parameters
 */
export function updateConsent(preferences: {
  analytics: boolean
  marketing: boolean
  preferences: boolean
}): void {
  if (typeof window === 'undefined') return

  initializeDataLayer()

  const consentParams: ConsentParams = {
    // Analytics consent
    analytics_storage: preferences.analytics ? 'granted' : 'denied',

    // Marketing/advertising consent
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.marketing ? 'granted' : 'denied',

    // Functionality and personalization consent
    functionality_storage: preferences.preferences ? 'granted' : 'denied',
    personalization_storage: preferences.preferences ? 'granted' : 'denied',

    // Security always granted
    security_storage: 'granted',
  }

  window.gtag?.('consent', 'update', consentParams)
}

/**
 * Helper to check if we should load analytics scripts
 */
export function shouldLoadAnalytics(preferences: { analytics: boolean }): boolean {
  return preferences.analytics === true
}

/**
 * Helper to check if we should load marketing scripts
 */
export function shouldLoadMarketing(preferences: { marketing: boolean }): boolean {
  return preferences.marketing === true
}

/**
 * Get current consent state as a formatted object
 */
export function getCurrentConsentState(preferences: {
  analytics: boolean
  marketing: boolean
  preferences: boolean
}): ConsentParams {
  return {
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.marketing ? 'granted' : 'denied',
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    functionality_storage: preferences.preferences ? 'granted' : 'denied',
    personalization_storage: preferences.preferences ? 'granted' : 'denied',
    security_storage: 'granted',
  }
}
