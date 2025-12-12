# Cookie Consent Store

Zustand store pentru gestionarea consimțământului utilizatorilor pentru cookies, conform **GDPR** și **Legea 506/2004** din România.

## Caracteristici

- ✅ GDPR & Legea 506/2004 compliant
- ✅ Google Consent Mode v2 integration
- ✅ Persistență în localStorage cu expirare după 365 zile
- ✅ Audit trail cu consentId și consentDate
- ✅ TypeScript strict typing
- ✅ Categorii de cookies: necessary, analytics, marketing, preferences

## Instalare

Store-ul folosește Zustand și este deja configurat în proiect.

```bash
pnpm add zustand
```

## Utilizare de bază

### 1. Import store

```typescript
import { useCookieConsent } from '@/stores/cookieConsentStore'
```

### 2. Folosire în componente React

```tsx
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'

export function CookieBanner() {
  const {
    hasInteracted,
    acceptAll,
    rejectAll
  } = useCookieConsent()

  if (hasInteracted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
      <p>Folosim cookies pentru a îmbunătăți experiența ta.</p>
      <div className="flex gap-2 mt-2">
        <button onClick={acceptAll}>
          Acceptă toate
        </button>
        <button onClick={rejectAll}>
          Respinge opționale
        </button>
      </div>
    </div>
  )
}
```

### 3. Modal pentru setări avansate

```tsx
'use client'

import { useCookieConsent, type CookieCategory } from '@/stores/cookieConsentStore'

export function CookieSettingsModal() {
  const {
    necessary,
    analytics,
    marketing,
    preferences,
    updateCategory,
    acceptAll
  } = useCookieConsent()

  const handleToggle = (category: CookieCategory, value: boolean) => {
    updateCategory(category, value)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={necessary}
            disabled
          />
          <span>Cookies necesare (obligatorii)</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => handleToggle('analytics', e.target.checked)}
          />
          <span>Cookies analitice</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => handleToggle('marketing', e.target.checked)}
          />
          <span>Cookies marketing</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences}
            onChange={(e) => handleToggle('preferences', e.target.checked)}
          />
          <span>Cookies preferințe</span>
        </label>
      </div>

      <button onClick={acceptAll}>
        Salvează preferințe
      </button>
    </div>
  )
}
```

### 4. Integrare cu Google Tag Manager

```tsx
'use client'

import { useEffect } from 'react'
import { useCookieConsent } from '@/stores/cookieConsentStore'

export function GoogleConsentModeProvider() {
  const { getConsentForGTM, hasInteracted } = useCookieConsent()

  useEffect(() => {
    // Setează consent-ul implicit la încărcarea paginii
    if (typeof window !== 'undefined' && window.gtag) {
      const consent = getConsentForGTM()

      if (!hasInteracted) {
        // Prima vizită - setează default (denied pentru toate opționale)
        window.gtag('consent', 'default', consent)
      } else {
        // User-ul a interacționat - actualizează cu preferințele salvate
        window.gtag('consent', 'update', consent)
      }
    }
  }, [hasInteracted, getConsentForGTM])

  return null
}
```

Adaugă în layout:

```tsx
// app/layout.tsx
import { GoogleConsentModeProvider } from '@/components/GoogleConsentModeProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Google Tag Manager script */}
      </head>
      <body>
        <GoogleConsentModeProvider />
        {children}
      </body>
    </html>
  )
}
```

### 5. Verificare categorii individuale

```tsx
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'

export function AnalyticsComponent() {
  const analytics = useCookieConsent(state => state.analytics)

  if (!analytics) {
    return <p>Analytics dezactivate</p>
  }

  return (
    <div>
      {/* Cod analytics */}
    </div>
  )
}
```

## API

### State

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| `necessary` | `boolean` | Cookies necesare (întotdeauna `true`) |
| `analytics` | `boolean` | Cookies analytics (default: `false`) |
| `marketing` | `boolean` | Cookies marketing (default: `false`) |
| `preferences` | `boolean` | Cookies preferințe (default: `false`) |
| `hasInteracted` | `boolean` | Dacă user-ul a interacționat cu banner-ul |
| `consentDate` | `string \| null` | Data consent-ului în format ISO |
| `consentId` | `string \| null` | UUID unic pentru audit trail |

### Actions

#### `acceptAll()`

Acceptă toate categoriile de cookies.

```typescript
const { acceptAll } = useCookieConsent()
acceptAll()
```

#### `rejectAll()`

Respinge toate cookies opționale (păstrează doar `necessary`).

```typescript
const { rejectAll } = useCookieConsent()
rejectAll()
```

#### `updateCategory(category, value)`

Actualizează o categorie specifică. `necessary` nu poate fi modificat.

```typescript
const { updateCategory } = useCookieConsent()
updateCategory('analytics', true)
updateCategory('marketing', false)
```

#### `resetConsent()`

Resetează consent-ul la starea inițială.

```typescript
const { resetConsent } = useCookieConsent()
resetConsent()
```

#### `loadFromStorage()`

Încarcă manual consent-ul din localStorage. Se apelează automat la mount.

```typescript
const { loadFromStorage } = useCookieConsent()
loadFromStorage()
```

#### `getConsentForGTM()`

Returnează obiectul pentru Google Consent Mode v2.

```typescript
const { getConsentForGTM } = useCookieConsent()
const consent = getConsentForGTM()
// {
//   ad_storage: 'granted' | 'denied',
//   ad_user_data: 'granted' | 'denied',
//   ad_personalization: 'granted' | 'denied',
//   analytics_storage: 'granted' | 'denied',
//   functionality_storage: 'granted' | 'denied',
//   personalization_storage: 'granted' | 'denied',
//   security_storage: 'granted'
// }
```

## Mapare categorii → Google Consent Mode

| Categorie | Parametri GTM |
|-----------|---------------|
| `necessary` | `security_storage` (always `granted`) |
| `analytics` | `analytics_storage` |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| `preferences` | `functionality_storage`, `personalization_storage` |

## Persistență

- **Key localStorage**: `cookie-consent`
- **Expirare**: 365 zile
- **Auto-verificare**: La rehydrate, se verifică dacă consent-ul a expirat
- **Audit trail**: Fiecare modificare generează nou `consentId` și `consentDate`

## Exemple avansate

### Verificare expirare manuală

```typescript
import { useCookieConsent } from '@/stores/cookieConsentStore'

const { consentDate } = useCookieConsent()

if (consentDate) {
  const consentTimestamp = new Date(consentDate).getTime()
  const now = Date.now()
  const daysElapsed = (now - consentTimestamp) / (1000 * 60 * 60 * 24)

  console.log(`Consent dat acum ${Math.floor(daysElapsed)} zile`)
}
```

### Logging pentru audit

```typescript
import { useCookieConsent } from '@/stores/cookieConsentStore'

const { consentId, consentDate, analytics, marketing, preferences } = useCookieConsent()

// Trimite către backend pentru audit
fetch('/api/audit/cookie-consent', {
  method: 'POST',
  body: JSON.stringify({
    consentId,
    consentDate,
    preferences: {
      analytics,
      marketing,
      preferences,
    }
  })
})
```

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import { useCookieConsent } from '@/stores/cookieConsentStore'

describe('Cookie Consent Store', () => {
  it('should have necessary cookies always enabled', () => {
    const { necessary } = useCookieConsent.getState()
    expect(necessary).toBe(true)
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
})
```

## Conformitate legală

### GDPR (Regulamentul UE 2016/679)

- ✅ Consent explicit pentru cookies opționale
- ✅ Categorii clare de cookies
- ✅ Posibilitate de retragere a consimțământului
- ✅ Audit trail cu consentId și consentDate

### Legea 506/2004 (România)

- ✅ Informare clară despre folosirea cookies
- ✅ Consent prealabil pentru cookies opționale
- ✅ Cookies necesare funcționează fără consent
- ✅ Posibilitate de modificare a preferințelor

## Licență

MIT
