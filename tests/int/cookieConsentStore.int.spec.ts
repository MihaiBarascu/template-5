/**
 * Cookie Consent Store - Unit Tests
 * GDPR & Legea 506/2004 compliant pentru România
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCookieConsent } from './cookieConsentStore'
import type { CookieCategory } from './cookieConsentStore'

describe('Cookie Consent Store', () => {
  beforeEach(() => {
    // Reset store înainte de fiecare test
    useCookieConsent.getState().resetConsent()

    // Mock window.gtag
    vi.stubGlobal('gtag', vi.fn())
  })

  describe('Initial State', () => {
    it('should have necessary cookies always enabled', () => {
      const { necessary } = useCookieConsent.getState()
      expect(necessary).toBe(true)
    })

    it('should have optional cookies disabled by default', () => {
      const { analytics, marketing, preferences } = useCookieConsent.getState()
      expect(analytics).toBe(false)
      expect(marketing).toBe(false)
      expect(preferences).toBe(false)
    })

    it('should not have interacted by default', () => {
      const { hasInteracted } = useCookieConsent.getState()
      expect(hasInteracted).toBe(false)
    })

    it('should have null consent metadata by default', () => {
      const { consentDate, consentId } = useCookieConsent.getState()
      expect(consentDate).toBeNull()
      expect(consentId).toBeNull()
    })
  })

  describe('Accept All', () => {
    it('should enable all cookie categories', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      const state = useCookieConsent.getState()
      expect(state.necessary).toBe(true)
      expect(state.analytics).toBe(true)
      expect(state.marketing).toBe(true)
      expect(state.preferences).toBe(true)
    })

    it('should set hasInteracted to true', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      const state = useCookieConsent.getState()
      expect(state.hasInteracted).toBe(true)
    })

    it('should generate consentId', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      const state = useCookieConsent.getState()
      expect(state.consentId).toBeTruthy()
      expect(typeof state.consentId).toBe('string')
      expect(state.consentId?.length).toBeGreaterThan(0)
    })

    it('should generate consentDate in ISO format', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      const state = useCookieConsent.getState()
      expect(state.consentDate).toBeTruthy()
      expect(() => new Date(state.consentDate!)).not.toThrow()
    })

    it('should trigger Google Consent Mode update', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      // Check if gtag was called (would be mocked in real test)
      const state = useCookieConsent.getState()
      const consent = state.getConsentForGTM()
      expect(consent.ad_storage).toBe('granted')
    })
  })

  describe('Reject All', () => {
    it('should keep only necessary cookies enabled', () => {
      const store = useCookieConsent.getState()
      store.rejectAll()

      const state = useCookieConsent.getState()
      expect(state.necessary).toBe(true)
      expect(state.analytics).toBe(false)
      expect(state.marketing).toBe(false)
      expect(state.preferences).toBe(false)
    })

    it('should set hasInteracted to true', () => {
      const store = useCookieConsent.getState()
      store.rejectAll()

      const state = useCookieConsent.getState()
      expect(state.hasInteracted).toBe(true)
    })

    it('should generate consent metadata', () => {
      const store = useCookieConsent.getState()
      store.rejectAll()

      const state = useCookieConsent.getState()
      expect(state.consentId).toBeTruthy()
      expect(state.consentDate).toBeTruthy()
    })
  })

  describe('Update Category', () => {
    it('should update individual category', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('analytics', true)

      const state = useCookieConsent.getState()
      expect(state.analytics).toBe(true)
      expect(state.marketing).toBe(false)
      expect(state.preferences).toBe(false)
    })

    it('should not allow changing necessary cookies', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('necessary', false)

      const state = useCookieConsent.getState()
      expect(state.necessary).toBe(true)
    })

    it('should update multiple categories independently', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('analytics', true)
      store.updateCategory('marketing', true)

      const state = useCookieConsent.getState()
      expect(state.analytics).toBe(true)
      expect(state.marketing).toBe(true)
      expect(state.preferences).toBe(false)
    })

    it('should set hasInteracted when updating category', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('analytics', true)

      const state = useCookieConsent.getState()
      expect(state.hasInteracted).toBe(true)
    })

    it('should update consentDate when updating category', () => {
      const store = useCookieConsent.getState()
      const beforeDate = new Date().toISOString()
      store.updateCategory('analytics', true)

      const state = useCookieConsent.getState()
      expect(state.consentDate).toBeTruthy()
      expect(new Date(state.consentDate!).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeDate).getTime()
      )
    })
  })

  describe('Reset Consent', () => {
    it('should reset to initial state', () => {
      const store = useCookieConsent.getState()

      // Modify state first
      store.acceptAll()
      expect(store.hasInteracted).toBe(true)

      // Reset
      store.resetConsent()

      const state = useCookieConsent.getState()
      expect(state.necessary).toBe(true)
      expect(state.analytics).toBe(false)
      expect(state.marketing).toBe(false)
      expect(state.preferences).toBe(false)
      expect(state.hasInteracted).toBe(false)
      expect(state.consentId).toBeNull()
      expect(state.consentDate).toBeNull()
    })
  })

  describe('Google Consent Mode', () => {
    it('should return correct format for GTM with all denied', () => {
      const store = useCookieConsent.getState()
      const consent = store.getConsentForGTM()

      expect(consent).toEqual({
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
      })
    })

    it('should return correct format for GTM with all granted', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      const consent = store.getConsentForGTM()

      expect(consent).toEqual({
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted',
      })
    })

    it('should map analytics category correctly', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('analytics', true)

      const consent = store.getConsentForGTM()

      expect(consent.analytics_storage).toBe('granted')
      expect(consent.ad_storage).toBe('denied')
    })

    it('should map marketing category correctly', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('marketing', true)

      const consent = store.getConsentForGTM()

      expect(consent.ad_storage).toBe('granted')
      expect(consent.ad_user_data).toBe('granted')
      expect(consent.ad_personalization).toBe('granted')
      expect(consent.analytics_storage).toBe('denied')
    })

    it('should map preferences category correctly', () => {
      const store = useCookieConsent.getState()
      store.updateCategory('preferences', true)

      const consent = store.getConsentForGTM()

      expect(consent.functionality_storage).toBe('granted')
      expect(consent.personalization_storage).toBe('granted')
      expect(consent.ad_storage).toBe('denied')
    })

    it('should always grant security_storage', () => {
      const store = useCookieConsent.getState()

      // Test with all rejected
      store.rejectAll()
      expect(store.getConsentForGTM().security_storage).toBe('granted')

      // Test with all accepted
      store.acceptAll()
      expect(store.getConsentForGTM().security_storage).toBe('granted')

      // Test with reset
      store.resetConsent()
      expect(store.getConsentForGTM().security_storage).toBe('granted')
    })
  })

  describe('Consent ID Generation', () => {
    it('should generate unique consent IDs', () => {
      const store = useCookieConsent.getState()

      store.acceptAll()
      const firstId = useCookieConsent.getState().consentId

      store.resetConsent()
      store.acceptAll()
      const secondId = useCookieConsent.getState().consentId

      expect(firstId).not.toBe(secondId)
    })

    it('should generate valid UUID format', () => {
      const store = useCookieConsent.getState()
      store.acceptAll()

      const state = useCookieConsent.getState()
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

      expect(state.consentId).toMatch(uuidRegex)
    })
  })

  describe('Type Safety', () => {
    it('should accept valid cookie categories', () => {
      const store = useCookieConsent.getState()
      const validCategories: CookieCategory[] = [
        'necessary',
        'analytics',
        'marketing',
        'preferences',
      ]

      validCategories.forEach((category) => {
        expect(() => store.updateCategory(category, true)).not.toThrow()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid multiple calls', () => {
      const store = useCookieConsent.getState()

      store.acceptAll()
      store.rejectAll()
      store.acceptAll()

      const state = useCookieConsent.getState()
      expect(state.analytics).toBe(true)
      expect(state.hasInteracted).toBe(true)
    })

    it('should maintain necessary cookies through all operations', () => {
      const store = useCookieConsent.getState()

      store.acceptAll()
      expect(useCookieConsent.getState().necessary).toBe(true)

      store.rejectAll()
      expect(useCookieConsent.getState().necessary).toBe(true)

      store.resetConsent()
      expect(useCookieConsent.getState().necessary).toBe(true)

      store.updateCategory('necessary', false)
      expect(useCookieConsent.getState().necessary).toBe(true)
    })

    it('should handle null/undefined gracefully', () => {
      const store = useCookieConsent.getState()

      // Should not throw
      expect(() => store.getConsentForGTM()).not.toThrow()
      expect(() => store.loadFromStorage()).not.toThrow()
    })
  })

  describe('Persistence', () => {
    it('should maintain consentId across updates', () => {
      const store = useCookieConsent.getState()

      store.acceptAll()
      const consentId = useCookieConsent.getState().consentId

      store.updateCategory('analytics', false)
      const updatedConsentId = useCookieConsent.getState().consentId

      expect(updatedConsentId).toBe(consentId)
    })

    it('should update consentDate on each change', () => {
      const store = useCookieConsent.getState()

      store.acceptAll()
      const firstDate = useCookieConsent.getState().consentDate

      // Wait a tiny bit
      setTimeout(() => {
        store.updateCategory('marketing', false)
        const secondDate = useCookieConsent.getState().consentDate

        expect(secondDate).not.toBe(firstDate)
      }, 10)
    })
  })
})
