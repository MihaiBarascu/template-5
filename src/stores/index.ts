/**
 * Cookie Consent Store exports
 * GDPR & Legea 506/2004 compliant pentru România
 */

export {
  useCookieConsent,
  useCookieConsentStore,
  type CookieConsentState,
  type CookieCategory,
  type ConsentValue,
  type GoogleConsentMode,
} from './cookieConsentStore'

export {
  COOKIE_CONSENT_EXPIRY_DAYS,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  COOKIE_CATEGORIES,
  LEGAL_TEXTS,
  CONSENT_MODE_MAPPING,
  COOKIE_NAMES,
  ALLOWED_COOKIE_DOMAINS,
  isConsentExpired,
  generateConsentId,
  formatConsentDate,
  getDaysUntilExpiry,
  isValidConsentId,
  cleanupCookiesByCategory,
  isCookieCategory,
} from './cookieConstants'
