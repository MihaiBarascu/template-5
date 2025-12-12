import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Cookie Consent Store - GDPR & Legea 506/2004 compliant pentru România
 *
 * Gestionează preferințele utilizatorilor pentru cookies conform:
 * - GDPR (Regulamentul UE 2016/679)
 * - Legea 506/2004 privind prelucrarea datelor cu caracter personal
 * - Google Consent Mode v2
 */

// Tipuri pentru categorii de cookies
export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences'

// Tipuri pentru Google Consent Mode v2
export type ConsentValue = 'granted' | 'denied'

export interface GoogleConsentMode {
  ad_storage: ConsentValue
  ad_user_data: ConsentValue
  ad_personalization: ConsentValue
  analytics_storage: ConsentValue
  functionality_storage: ConsentValue
  personalization_storage: ConsentValue
  security_storage: ConsentValue
}

// State interface
export interface CookieConsentState {
  // Categorii de cookies
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean

  // Metadata pentru audit trail
  hasInteracted: boolean
  consentDate: string | null
  consentId: string | null

  // Actions
  acceptAll: () => void
  rejectAll: () => void
  updateCategory: (category: CookieCategory, value: boolean) => void
  resetConsent: () => void
  loadFromStorage: () => void
  getConsentForGTM: () => GoogleConsentMode
}

// Constante
const STORAGE_KEY = 'cookie-consent'
const CONSENT_EXPIRY_DAYS = 365

// Helper pentru generare UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Helper pentru verificare expirare consent
const isConsentExpired = (consentDate: string | null): boolean => {
  if (!consentDate) return true

  const consentTimestamp = new Date(consentDate).getTime()
  const now = Date.now()
  const expiryTime = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000 // 365 zile în milisecunde

  return now - consentTimestamp > expiryTime
}

// State inițial
const initialState = {
  necessary: true, // Întotdeauna true, nu poate fi modificat
  analytics: false,
  marketing: false,
  preferences: false,
  hasInteracted: false,
  consentDate: null,
  consentId: null,
}

// Zustand store
export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Acceptă toate categoriile de cookies
       * Setează hasInteracted = true, generează consentId și consentDate
       */
      acceptAll: () => {
        const consentId = generateUUID()
        const consentDate = new Date().toISOString()

        set({
          necessary: true,
          analytics: true,
          marketing: true,
          preferences: true,
          hasInteracted: true,
          consentDate,
          consentId,
        })

        // Trigger Google Consent Mode update
        if (typeof window !== 'undefined' && window.gtag) {
          const consent = get().getConsentForGTM()
          window.gtag('consent', 'update', consent)
        }
      },

      /**
       * Respinge toate categoriile de cookies (cu excepția celor necesare)
       * Setează hasInteracted = true, generează consentId și consentDate
       */
      rejectAll: () => {
        const consentId = generateUUID()
        const consentDate = new Date().toISOString()

        set({
          necessary: true, // Întotdeauna true
          analytics: false,
          marketing: false,
          preferences: false,
          hasInteracted: true,
          consentDate,
          consentId,
        })

        // Trigger Google Consent Mode update
        if (typeof window !== 'undefined' && window.gtag) {
          const consent = get().getConsentForGTM()
          window.gtag('consent', 'update', consent)
        }
      },

      /**
       * Actualizează o categorie specifică de cookies
       * Necessary nu poate fi modificat (rămâne întotdeauna true)
       */
      updateCategory: (category: CookieCategory, value: boolean) => {
        // Necessary nu poate fi modificat
        if (category === 'necessary') return

        const currentState = get()
        const consentId = currentState.consentId || generateUUID()
        const consentDate = new Date().toISOString()

        set({
          [category]: value,
          hasInteracted: true,
          consentDate,
          consentId,
        })

        // Trigger Google Consent Mode update
        if (typeof window !== 'undefined' && window.gtag) {
          const consent = get().getConsentForGTM()
          window.gtag('consent', 'update', consent)
        }
      },

      /**
       * Resetează consent-ul la valorile inițiale
       * Șterge hasInteracted, consentDate și consentId
       */
      resetConsent: () => {
        set(initialState)

        // Reset Google Consent Mode
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            security_storage: 'granted',
          })
        }
      },

      /**
       * Încarcă consent din localStorage și verifică expirarea
       * Dacă a expirat, resetează la valorile inițiale
       */
      loadFromStorage: () => {
        if (typeof window === 'undefined') return

        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (!stored) return

          const parsed = JSON.parse(stored)
          const state = parsed.state

          // Verifică dacă consent-ul a expirat
          if (isConsentExpired(state.consentDate)) {
            get().resetConsent()
            return
          }

          // Încarcă state-ul dacă nu a expirat
          set(state)
        } catch (error) {
          console.error('Error loading cookie consent from storage:', error)
          get().resetConsent()
        }
      },

      /**
       * Returnează obiectul pentru Google Consent Mode v2
       * Mapează categoriile de cookies la parametrii GTM
       */
      getConsentForGTM: (): GoogleConsentMode => {
        const state = get()

        return {
          // Marketing -> ad_storage, ad_user_data, ad_personalization
          ad_storage: state.marketing ? 'granted' : 'denied',
          ad_user_data: state.marketing ? 'granted' : 'denied',
          ad_personalization: state.marketing ? 'granted' : 'denied',

          // Analytics -> analytics_storage
          analytics_storage: state.analytics ? 'granted' : 'denied',

          // Preferences -> functionality_storage, personalization_storage
          functionality_storage: state.preferences ? 'granted' : 'denied',
          personalization_storage: state.preferences ? 'granted' : 'denied',

          // Security -> întotdeauna granted (cookies necesare)
          security_storage: 'granted',
        }
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,

      // Opțiuni pentru persistență
      partialize: (state) => ({
        necessary: state.necessary,
        analytics: state.analytics,
        marketing: state.marketing,
        preferences: state.preferences,
        hasInteracted: state.hasInteracted,
        consentDate: state.consentDate,
        consentId: state.consentId,
      }),

      // Verifică expirarea la rehydrate
      onRehydrateStorage: () => (state) => {
        if (state && isConsentExpired(state.consentDate)) {
          state.resetConsent()
        }
      },
    },
  ),
)

// Alias pentru compatibilitate cu ScriptLoader
export const useCookieConsentStore = useCookieConsent
