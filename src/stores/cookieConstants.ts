/**
 * Constante și helpers pentru Cookie Consent
 * GDPR & Legea 506/2004 compliant pentru România
 */

/**
 * Durata de expirare a consimțământului în zile
 * Conform GDPR: minim 6 luni, maxim 2 ani
 * Recomandat: 1 an (365 zile)
 */
export const COOKIE_CONSENT_EXPIRY_DAYS = 365

/**
 * Key pentru localStorage
 */
export const COOKIE_CONSENT_STORAGE_KEY = 'cookie-consent'

/**
 * Versiune cookie consent
 * Incrementează când modifici structura cookies
 */
export const COOKIE_CONSENT_VERSION = 1

/**
 * Cookie categories cu descrieri pentru UI
 */
export const COOKIE_CATEGORIES = {
  necessary: {
    id: 'necessary',
    label: 'Cookies necesare',
    description:
      'Aceste cookies sunt esențiale pentru funcționarea corectă a site-ului. Ele permit navigarea de bază și accesul la zone securizate. Site-ul nu poate funcționa corect fără acestea.',
    examples: [
      'Session ID pentru autentificare',
      'Preferințe de securitate',
      'Cookie consent status',
    ],
    required: true,
  },
  analytics: {
    id: 'analytics',
    label: 'Cookies de analiză',
    description:
      'Ne ajută să înțelegem cum interactionezi cu site-ul nostru, colectând și raportând informații în mod anonim. Datele sunt folosite pentru a îmbunătăți experiența utilizatorilor.',
    examples: [
      'Google Analytics',
      'Timp petrecut pe pagină',
      'Pagini vizitate',
      'Sursă trafic',
    ],
    required: false,
  },
  marketing: {
    id: 'marketing',
    label: 'Cookies de marketing',
    description:
      'Folosite pentru a îți afișa reclame relevante pe baza intereselor tale. Aceste cookies pot urmări activitatea ta pe diferite site-uri web și pot construi un profil al intereselor tale.',
    examples: [
      'Google Ads',
      'Facebook Pixel',
      'Retargeting ads',
      'Conversion tracking',
    ],
    required: false,
  },
  preferences: {
    id: 'preferences',
    label: 'Cookies de preferințe',
    description:
      'Memorează preferințele tale (limba, regiunea, mărimea fontului) pentru a îți oferi o experiență personalizată la următoarea vizită pe site.',
    examples: ['Limbă preferată', 'Regiune', 'Temă (light/dark)', 'Setări UI'],
    required: false,
  },
} as const

/**
 * Texte legale pentru România
 */
export const LEGAL_TEXTS = {
  banner: {
    title: 'Folosim cookies',
    description:
      'Folosim cookies pentru a îmbunătăți experiența ta pe site-ul nostru, pentru a analiza traficul și pentru a personaliza conținutul. Prin acceptarea cookies, ne ajuți să îmbunătățim serviciile noastre.',
    policyLink: 'Citește Politica de Cookies',
    acceptAll: 'Acceptă toate',
    rejectOptional: 'Doar necesare',
    customize: 'Personalizează',
  },
  modal: {
    title: 'Setări Cookies',
    description:
      'Gestionează preferințele tale de cookies. Poți alege ce tipuri de cookies dorești să permiți pe site-ul nostru.',
    save: 'Salvează preferințe',
    acceptAll: 'Acceptă toate',
    rejectAll: 'Doar necesare',
  },
  footer: {
    gdpr: 'Conform GDPR (Regulamentul UE 2016/679) și Legea 506/2004 privind prelucrarea datelor cu caracter personal.',
    rights:
      'Ai dreptul să îți retragi consimțământul în orice moment și să îți accesezi, rectifici sau ștergi datele personale.',
  },
} as const

/**
 * Mapare categorii cookies → Google Consent Mode v2 parametri
 */
export const CONSENT_MODE_MAPPING = {
  necessary: ['security_storage'],
  analytics: ['analytics_storage'],
  marketing: ['ad_storage', 'ad_user_data', 'ad_personalization'],
  preferences: ['functionality_storage', 'personalization_storage'],
} as const

/**
 * Helper pentru verificare expirare consent
 */
export function isConsentExpired(consentDate: string | null): boolean {
  if (!consentDate) return true

  const consentTimestamp = new Date(consentDate).getTime()
  const now = Date.now()
  const expiryTime = COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000

  return now - consentTimestamp > expiryTime
}

/**
 * Helper pentru generare UUID v4 (RFC 4122 compliant)
 */
export function generateConsentId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback pentru browsere mai vechi
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Helper pentru formatare dată consent în format citibil
 */
export function formatConsentDate(consentDate: string | null): string {
  if (!consentDate) return 'N/A'

  const date = new Date(consentDate)
  return date.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Helper pentru calculare zile rămase până la expirare
 */
export function getDaysUntilExpiry(consentDate: string | null): number | null {
  if (!consentDate) return null

  const consentTimestamp = new Date(consentDate).getTime()
  const now = Date.now()
  const expiryTimestamp =
    consentTimestamp + COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000

  const daysRemaining = Math.ceil((expiryTimestamp - now) / (24 * 60 * 60 * 1000))

  return daysRemaining > 0 ? daysRemaining : 0
}

/**
 * Helper pentru validare UUID
 */
export function isValidConsentId(consentId: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(consentId)
}

/**
 * Cookie names folosite în aplicație
 */
export const COOKIE_NAMES = {
  SESSION: '__session',
  CSRF: '__csrf',
  ANALYTICS: '_ga',
  MARKETING: '_fbp',
  PREFERENCES: '__prefs',
} as const

/**
 * Domenii pentru care sunt permise cookies third-party
 */
export const ALLOWED_COOKIE_DOMAINS = [
  'google-analytics.com',
  'googletagmanager.com',
  'facebook.com',
  'doubleclick.net',
] as const

/**
 * Helper pentru cleanup cookies based pe categorii
 */
export function cleanupCookiesByCategory(category: keyof typeof COOKIE_CATEGORIES): void {
  if (typeof document === 'undefined') return

  const cookiesToDelete: string[] = []

  switch (category) {
    case 'analytics':
      cookiesToDelete.push('_ga', '_gid', '_gat', '_ga_*')
      break
    case 'marketing':
      cookiesToDelete.push('_fbp', '_fbc', 'fr', 'tr', '_gcl_*')
      break
    case 'preferences':
      cookiesToDelete.push('__prefs', '__lang', '__theme')
      break
  }

  cookiesToDelete.forEach((cookieName) => {
    // Delete cookie pentru toate path-urile și domeniile
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
  })
}

/**
 * Type guards
 */
export function isCookieCategory(value: string): value is keyof typeof COOKIE_CATEGORIES {
  return value in COOKIE_CATEGORIES
}
