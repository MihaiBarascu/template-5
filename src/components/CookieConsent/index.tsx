'use client'

import React, { useState, useEffect } from 'react'
import { CookieBanner } from './CookieBanner'
import { CookieModal } from './CookieModal'
import { CookieButton } from './CookieButton'
import { useCookieConsent } from '@/stores/cookieConsentStore'

/**
 * GDPR-compliant Cookie Consent Component for Romania
 *
 * Implements:
 * - GDPR (Regulamentul UE 2016/679)
 * - Legea 506/2004 privind prelucrarea datelor cu caracter personal
 * - Google Consent Mode v2
 *
 * Features:
 * - Layer 1: Banner with equal-weight buttons (Accept All, Reject All, Customize)
 * - Layer 2: Modal with granular category controls
 * - Floating button for re-accessing preferences (GDPR requirement)
 * - Persistent storage with expiration (365 days)
 * - Automatic Google Tag Manager consent updates
 */

export interface CookieConsentProps {
  // General settings
  enabled?: boolean

  // Banner texts
  title?: string
  description?: string
  privacyPolicyUrl?: string
  acceptButtonText?: string
  rejectButtonText?: string
  customizeButtonText?: string

  // Modal texts
  saveButtonText?: string

  // Category texts
  necessaryTitle?: string
  necessaryDescription?: string
  analyticsTitle?: string
  analyticsDescription?: string
  marketingTitle?: string
  marketingDescription?: string
  preferencesTitle?: string
  preferencesDescription?: string
}

export function CookieConsent({
  enabled = true,

  // Banner props
  title = 'Acest site folosește cookie-uri',
  description = 'Folosim cookie-uri pentru a-ți oferi cea mai bună experiență. Poți accepta toate cookie-urile, le poți refuza pe cele neesențiale sau le poți personaliza.',
  privacyPolicyUrl = '/politica-cookies',
  acceptButtonText = 'Acceptă toate',
  rejectButtonText = 'Refuză toate',
  customizeButtonText = 'Personalizează',

  // Modal props
  saveButtonText = 'Salvează preferințele',

  // Category props
  necessaryTitle = 'Cookie-uri necesare',
  necessaryDescription = 'Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate. Ele includ funcționalități de bază precum navigarea și autentificarea.',
  analyticsTitle = 'Cookie-uri de analiză',
  analyticsDescription = 'Ne ajută să înțelegem cum folosești site-ul, ce pagini vizitezi și cum îmbunătățim experiența ta. Datele sunt anonimizate.',
  marketingTitle = 'Cookie-uri de marketing',
  marketingDescription = 'Folosite pentru a-ți afișa reclame relevante și pentru a măsura eficiența campaniilor noastre publicitare.',
  preferencesTitle = 'Cookie-uri de preferințe',
  preferencesDescription = 'Stochează preferințele tale (limba, tema, setări personalizate) pentru o experiență personalizată.',
}: CookieConsentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const loadFromStorage = useCookieConsent((state) => state.loadFromStorage)

  // Load consent from storage on mount
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      loadFromStorage()
    }
  }, [enabled, loadFromStorage])

  // Initialize Google Consent Mode v2 (default state)
  useEffect(() => {
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
  }, [])

  if (!enabled) return null

  return (
    <>
      {/* Layer 1: Banner */}
      <CookieBanner
        title={title}
        description={description}
        privacyPolicyUrl={privacyPolicyUrl}
        acceptButtonText={acceptButtonText}
        rejectButtonText={rejectButtonText}
        customizeButtonText={customizeButtonText}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* Layer 2: Modal */}
      <CookieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        privacyPolicyUrl={privacyPolicyUrl}
        saveButtonText={saveButtonText}
        necessaryTitle={necessaryTitle}
        necessaryDescription={necessaryDescription}
        analyticsTitle={analyticsTitle}
        analyticsDescription={analyticsDescription}
        marketingTitle={marketingTitle}
        marketingDescription={marketingDescription}
        preferencesTitle={preferencesTitle}
        preferencesDescription={preferencesDescription}
      />

      {/* Floating Button (shown after interaction) */}
      <CookieButton />
    </>
  )
}

export default CookieConsent

// Export hooks for use in other components
export { useCookieConsent } from '@/stores/cookieConsentStore'
