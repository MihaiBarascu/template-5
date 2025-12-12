# Exemple de utilizare Cookie Consent Store

## 1. Banner simplu de cookies

```tsx
// components/CookieBanner.tsx
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'
import { X } from 'lucide-react'

export function CookieBanner() {
  const { hasInteracted, acceptAll, rejectAll } = useCookieConsent()

  if (hasInteracted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              Folosim cookies
            </h3>
            <p className="text-sm text-gray-300">
              Folosim cookies pentru a îmbunătăți experiența ta pe site-ul nostru,
              pentru a analiza traficul și pentru a personaliza conținutul.
              Prin acceptarea cookies, ne ajuți să îmbunătățim serviciile noastre.
            </p>
            <a
              href="/politica-cookies"
              className="text-sm text-blue-400 hover:underline mt-1 inline-block"
            >
              Citește Politica de Cookies
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={rejectAll}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Doar necesare
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Acceptă toate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 2. Modal setări avansate

```tsx
// components/CookieSettingsModal.tsx
'use client'

import { useCookieConsent, type CookieCategory } from '@/stores/cookieConsentStore'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CookieSettingsModal({ isOpen, onClose }: Props) {
  const {
    necessary,
    analytics,
    marketing,
    preferences,
    updateCategory,
    acceptAll,
    rejectAll,
  } = useCookieConsent()

  if (!isOpen) return null

  const handleToggle = (category: CookieCategory, value: boolean) => {
    updateCategory(category, value)
  }

  const handleSave = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Setări Cookies</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Gestionează preferințele tale de cookies. Poți alege ce tipuri de cookies
            dorești să permită pe site-ul nostru.
          </p>

          <div className="space-y-6">
            {/* Cookies necesare */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Cookies necesare
                  </h3>
                  <p className="text-sm text-gray-600">
                    Aceste cookies sunt esențiale pentru funcționarea corectă a site-ului.
                    Nu pot fi dezactivate.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={necessary}
                    disabled
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>

            {/* Cookies analytics */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Cookies de analiză
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ne ajută să înțelegem cum folosești site-ul nostru și să îmbunătățim
                    experiența ta. Datele sunt anonimizate.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => handleToggle('analytics', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Cookies marketing */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Cookies de marketing
                  </h3>
                  <p className="text-sm text-gray-600">
                    Folosite pentru a îți afișa reclame relevante pe baza intereselor tale.
                    Pot urmări activitatea ta pe web.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => handleToggle('marketing', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Cookies preferințe */}
            <div className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Cookies de preferințe
                  </h3>
                  <p className="text-sm text-gray-600">
                    Memorează preferințele tale (ex: limbă, regiune) pentru o experiență
                    personalizată.
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={preferences}
                    onChange={(e) => handleToggle('preferences', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={rejectAll}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Doar necesare
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
            >
              Acceptă toate
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 3. Buton flotant pentru revenire la setări

```tsx
// components/CookieFloatingButton.tsx
'use client'

import { useState } from 'react'
import { useCookieConsent } from '@/stores/cookieConsentStore'
import { Cookie } from 'lucide-react'
import { CookieSettingsModal } from './CookieSettingsModal'

export function CookieFloatingButton() {
  const { hasInteracted } = useCookieConsent()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!hasInteracted) return null

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 left-4 z-40 p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Setări cookies"
      >
        <Cookie className="w-5 h-5" />
      </button>

      <CookieSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
```

## 4. Provider pentru Google Consent Mode v2

```tsx
// components/GoogleConsentModeProvider.tsx
'use client'

import { useEffect } from 'react'
import { useCookieConsent } from '@/stores/cookieConsentStore'

export function GoogleConsentModeProvider() {
  const { getConsentForGTM, hasInteracted } = useCookieConsent()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const consent = getConsentForGTM()

      if (!hasInteracted) {
        // Prima vizită - setează default denied
        window.gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'denied',
          personalization_storage: 'denied',
          security_storage: 'granted',
        })
      } else {
        // Actualizează cu preferințele salvate
        window.gtag('consent', 'update', consent)
      }
    }
  }, [hasInteracted, getConsentForGTM])

  return null
}
```

## 5. Layout complet cu toate componentele

```tsx
// app/layout.tsx
import { CookieBanner } from '@/components/CookieBanner'
import { CookieFloatingButton } from '@/components/CookieFloatingButton'
import { GoogleConsentModeProvider } from '@/components/GoogleConsentModeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
      </head>
      <body>
        <GoogleConsentModeProvider />
        {children}
        <CookieBanner />
        <CookieFloatingButton />
      </body>
    </html>
  )
}
```

## 6. Hook custom pentru verificare categorii

```tsx
// hooks/useCookieCategory.ts
import { useCookieConsent, type CookieCategory } from '@/stores/cookieConsentStore'

export function useCookieCategory(category: CookieCategory): boolean {
  return useCookieConsent((state) => state[category])
}
```

Utilizare:

```tsx
'use client'

import { useCookieCategory } from '@/hooks/useCookieCategory'

export function AnalyticsComponent() {
  const analyticsEnabled = useCookieCategory('analytics')

  if (!analyticsEnabled) {
    return null
  }

  return (
    <div>
      {/* Cod analytics */}
    </div>
  )
}
```

## 7. Wrapper condiționat pentru componente analytics

```tsx
// components/ConditionalAnalytics.tsx
'use client'

import { ReactNode } from 'react'
import { useCookieConsent } from '@/stores/cookieConsentStore'

interface Props {
  children: ReactNode
  category: 'analytics' | 'marketing' | 'preferences'
}

export function ConditionalAnalytics({ children, category }: Props) {
  const categoryEnabled = useCookieConsent((state) => state[category])

  if (!categoryEnabled) return null

  return <>{children}</>
}
```

Utilizare:

```tsx
import { ConditionalAnalytics } from '@/components/ConditionalAnalytics'

export default function Page() {
  return (
    <div>
      <h1>Pagina principală</h1>

      <ConditionalAnalytics category="analytics">
        <GoogleAnalytics />
      </ConditionalAnalytics>

      <ConditionalAnalytics category="marketing">
        <FacebookPixel />
      </ConditionalAnalytics>
    </div>
  )
}
```

## 8. API Route pentru salvare consimțământ (audit trail)

```typescript
// app/api/cookie-consent/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { consentId, consentDate, preferences } = body

    // Salvează în database pentru audit
    // await db.cookieConsent.create({
    //   data: {
    //     consentId,
    //     consentDate,
    //     preferences,
    //     userAgent: request.headers.get('user-agent'),
    //     ip: request.headers.get('x-forwarded-for') || 'unknown',
    //   }
    // })

    console.log('Cookie consent saved:', {
      consentId,
      consentDate,
      preferences,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving cookie consent:', error)
    return NextResponse.json(
      { error: 'Failed to save consent' },
      { status: 500 }
    )
  }
}
```

Utilizare în client:

```tsx
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'
import { useEffect } from 'react'

export function CookieAuditLogger() {
  const { consentId, consentDate, analytics, marketing, preferences, hasInteracted } =
    useCookieConsent()

  useEffect(() => {
    if (hasInteracted && consentId) {
      // Trimite către backend pentru audit
      fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentId,
          consentDate,
          preferences: {
            analytics,
            marketing,
            preferences,
          },
        }),
      })
    }
  }, [consentId, consentDate, analytics, marketing, preferences, hasInteracted])

  return null
}
```

## 9. Testing cu Vitest

```typescript
// stores/cookieConsentStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCookieConsent } from './cookieConsentStore'

describe('Cookie Consent Store', () => {
  beforeEach(() => {
    // Reset store înainte de fiecare test
    useCookieConsent.getState().resetConsent()
  })

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

  it('should accept all cookies', () => {
    const store = useCookieConsent.getState()
    store.acceptAll()

    const state = useCookieConsent.getState()
    expect(state.analytics).toBe(true)
    expect(state.marketing).toBe(true)
    expect(state.preferences).toBe(true)
    expect(state.hasInteracted).toBe(true)
    expect(state.consentId).toBeTruthy()
    expect(state.consentDate).toBeTruthy()
  })

  it('should reject optional cookies', () => {
    const store = useCookieConsent.getState()
    store.rejectAll()

    const state = useCookieConsent.getState()
    expect(state.necessary).toBe(true)
    expect(state.analytics).toBe(false)
    expect(state.marketing).toBe(false)
    expect(state.preferences).toBe(false)
  })

  it('should update individual category', () => {
    const store = useCookieConsent.getState()
    store.updateCategory('analytics', true)

    const state = useCookieConsent.getState()
    expect(state.analytics).toBe(true)
    expect(state.marketing).toBe(false)
  })

  it('should not allow changing necessary cookies', () => {
    const store = useCookieConsent.getState()
    store.updateCategory('necessary', false)

    const state = useCookieConsent.getState()
    expect(state.necessary).toBe(true)
  })

  it('should generate Google Consent Mode object', () => {
    const store = useCookieConsent.getState()
    store.acceptAll()

    const consent = store.getConsentForGTM()

    expect(consent.ad_storage).toBe('granted')
    expect(consent.analytics_storage).toBe('granted')
    expect(consent.security_storage).toBe('granted')
  })

  it('should reset consent', () => {
    const store = useCookieConsent.getState()
    store.acceptAll()
    store.resetConsent()

    const state = useCookieConsent.getState()
    expect(state.hasInteracted).toBe(false)
    expect(state.consentId).toBeNull()
    expect(state.analytics).toBe(false)
  })
})
```

## 10. Debugging în development

```tsx
// components/CookieDebugger.tsx (doar pentru development)
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'

export function CookieDebugger() {
  if (process.env.NODE_ENV !== 'development') return null

  const state = useCookieConsent()

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">Cookie Consent Debug</h3>
      <pre className="overflow-auto">
        {JSON.stringify(
          {
            hasInteracted: state.hasInteracted,
            necessary: state.necessary,
            analytics: state.analytics,
            marketing: state.marketing,
            preferences: state.preferences,
            consentId: state.consentId?.substring(0, 8) + '...',
            consentDate: state.consentDate
              ? new Date(state.consentDate).toLocaleString('ro-RO')
              : null,
          },
          null,
          2
        )}
      </pre>
      <button
        onClick={state.resetConsent}
        className="mt-2 px-2 py-1 bg-red-600 rounded text-xs"
      >
        Reset
      </button>
    </div>
  )
}
```

Adaugă în layout (doar dev):

```tsx
// app/layout.tsx
import { CookieDebugger } from '@/components/CookieDebugger'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieDebugger />
      </body>
    </html>
  )
}
```
