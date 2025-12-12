# ScriptLoader - Cookie Consent Based Script Loading

Sistema completa de incarcare conditionata a scripturilor bazata pe consimtamant cookies conform GDPR si Google Consent Mode v2.

## Cuprins

- [Caracteristici](#caracteristici)
- [Componente](#componente)
- [Instalare si Configurare](#instalare-si-configurare)
- [Utilizare](#utilizare)
- [Google Consent Mode v2](#google-consent-mode-v2)
- [API Reference](#api-reference)

## Caracteristici

- **GDPR Compliant** - Respecta Regulamentul UE 2016/679 si Legea 506/2004
- **Google Consent Mode v2** - Implementare completa pentru GTM/GA4
- **Conditional Loading** - Scripturile se incarca DOAR dupa consimtamant
- **Zustand State Management** - Store centralizat pentru preferinte
- **TypeScript Support** - Type-safe cu autocompletion
- **Next.js 15 Optimized** - Foloseste next/script pentru performance

## Componente

### 1. ScriptLoader (Main Component)

Componenta principala care orchestreaza toate scripturile de tracking.

```tsx
import { ScriptLoader } from '@/components/ScriptLoader'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}

        <ScriptLoader
          googleAnalyticsId="G-XXXXXXXXXX"
          googleTagManagerId="GTM-XXXXXXX"
          facebookPixelId="123456789"
          tiktokPixelId="ABCDEFG"
          hotjarId="1234567"
        />
      </body>
    </html>
  )
}
```

### 2. GoogleTagManager

GTM cu Consent Mode v2 - se incarca intotdeauna, dar tagurile interne respecta consent-ul.

```tsx
import { GoogleTagManager } from '@/components/ScriptLoader'

// Utilizare standalone
<GoogleTagManager containerId="GTM-XXXXXXX" />
```

**Important:** GTM se incarca intotdeauna, dar:
- Default consent = DENIED pentru toate categoriile
- Se actualizeaza automat cand user-ul accepta/refuza
- Tagurile din GTM respecta consent state-ul

### 3. GoogleAnalytics

GA4 cu Consent Mode - se incarca DOAR daca analytics consent = true.

```tsx
import { GoogleAnalytics } from '@/components/ScriptLoader'

<GoogleAnalytics measurementId="G-XXXXXXXXXX" />
```

**Caracteristici:**
- Anonymize IP activat automat
- Cookie flags: SameSite=None;Secure
- Strategy: afterInteractive pentru performance

### 4. FacebookPixel

Facebook Pixel - se incarca DOAR daca marketing consent = true.

```tsx
import { FacebookPixel } from '@/components/ScriptLoader'

<FacebookPixel pixelId="123456789" />
```

### 5. TikTokPixel

TikTok Pixel - se incarca DOAR daca marketing consent = true.

```tsx
import { TikTokPixel } from '@/components/ScriptLoader'

<TikTokPixel pixelId="ABCDEFG" />
```

### 6. Hotjar

Hotjar Analytics - se incarca DOAR daca analytics consent = true.

```tsx
import { Hotjar } from '@/components/ScriptLoader'

<Hotjar siteId="1234567" version={6} />
```

## Instalare si Configurare

### 1. Zustand Store

Store-ul este deja creat in `/src/stores/cookieConsentStore.ts`.

Categorii de cookies:
- **necessary** (obligatoriu, intotdeauna true)
- **analytics** (Google Analytics, Hotjar)
- **marketing** (Facebook Pixel, TikTok Pixel)
- **preferences** (Preferinte utilizator)

### 2. Adaugare in Layout

Editeaza `/src/app/(frontend)/layout.tsx`:

```tsx
import { ScriptLoader } from '@/components/ScriptLoader'

export default async function RootLayout({ children }) {
  // ... existing code

  return (
    <html lang="ro">
      <body>
        {children}

        {/* Cookie Consent Banner */}
        <CookieConsent enabled={true} />

        {/* Script Loader - add your tracking IDs */}
        <ScriptLoader
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
          googleTagManagerId={process.env.NEXT_PUBLIC_GTM_ID}
          facebookPixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
          tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}
          hotjarId={process.env.NEXT_PUBLIC_HOTJAR_ID}
        />
      </body>
    </html>
  )
}
```

### 3. Environment Variables

Creeaza `.env.local`:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=123456789

# TikTok Pixel
NEXT_PUBLIC_TIKTOK_PIXEL_ID=ABCDEFG

# Hotjar
NEXT_PUBLIC_HOTJAR_ID=1234567
```

## Utilizare

### Flow-ul Complet

1. **User viziteaza site-ul**
   - Apare cookie banner (CookieBanner)
   - GTM se incarca cu default consent = DENIED
   - Celelalte scripturi NU se incarca

2. **User accepta toate**
   - `acceptAll()` in Zustand store
   - GTM consent se updateaza: `gtag('consent', 'update', {...})`
   - Toate scripturile se incarca (GA, FB Pixel, etc.)

3. **User refuza toate**
   - `rejectAll()` in Zustand store
   - GTM consent ramane DENIED
   - Doar GTM este incarcat (pentru basic tracking)

4. **User personalizeaza**
   - Modal se deschide (CookieModal)
   - User alege categorii specifice
   - GTM consent se updateaza partial
   - Doar scripturile aprobate se incarca

### Programmatic Usage

```tsx
import { useCookieConsent } from '@/stores/cookieConsentStore'

function MyComponent() {
  const { analytics, marketing, acceptAll, rejectAll } = useCookieConsent()

  // Check if analytics is enabled
  if (analytics) {
    // Track custom event in GA
    window.gtag('event', 'custom_event', {
      category: 'engagement',
      label: 'button_click'
    })
  }

  // Check if marketing is enabled
  if (marketing) {
    // Track Facebook event
    window.fbq('track', 'Purchase', { value: 100, currency: 'RON' })
  }

  return (
    <div>
      <button onClick={acceptAll}>Accept toate</button>
      <button onClick={rejectAll}>Refuza toate</button>
    </div>
  )
}
```

## Google Consent Mode v2

### Implementare

Sistemul implementeaza complet Google Consent Mode v2:

**Default State (inainte de GTM):**
```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
})
```

**Update State (dupa accept):**
```javascript
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted',
  'functionality_storage': 'granted',
  'personalization_storage': 'granted',
  'security_storage': 'granted'
})
```

### Mapping Categorii -> Consent Mode

| Cookie Category | Consent Mode Parameters |
|-----------------|-------------------------|
| `necessary` | `security_storage: 'granted'` |
| `analytics` | `analytics_storage` |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| `preferences` | `functionality_storage`, `personalization_storage` |

### Utility Functions

```tsx
import {
  setDefaultConsent,
  updateConsent,
  shouldLoadAnalytics,
  shouldLoadMarketing,
  getCurrentConsentState
} from '@/components/ScriptLoader/gtmConsent'

// Setare default consent (apeleaza inainte de GTM)
setDefaultConsent()

// Update consent dupa user interaction
updateConsent({
  analytics: true,
  marketing: true,
  preferences: true
})

// Check daca sa incarcam scripturi
if (shouldLoadAnalytics({ analytics: true })) {
  // Load GA
}

if (shouldLoadMarketing({ marketing: true })) {
  // Load FB Pixel
}

// Get current state
const consentState = getCurrentConsentState({
  analytics: true,
  marketing: false,
  preferences: true
})
```

## API Reference

### ScriptLoaderProps

```typescript
interface ScriptLoaderProps {
  googleAnalyticsId?: string       // GA4 Measurement ID (G-XXXXXXXXXX)
  googleTagManagerId?: string       // GTM Container ID (GTM-XXXXXXX)
  facebookPixelId?: string          // FB Pixel ID
  tiktokPixelId?: string            // TikTok Pixel ID
  hotjarId?: string                 // Hotjar Site ID
  hotjarVersion?: number            // Hotjar version (default: 6)
}
```

### Cookie Categories

```typescript
type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences'
```

### Consent State

```typescript
interface CookieConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  hasInteracted: boolean
  consentDate: string | null
  consentId: string | null

  acceptAll: () => void
  rejectAll: () => void
  updateCategory: (category: CookieCategory, value: boolean) => void
  resetConsent: () => void
  loadFromStorage: () => void
  getConsentForGTM: () => GoogleConsentMode
}
```

### Google Consent Mode

```typescript
interface GoogleConsentMode {
  ad_storage: 'granted' | 'denied'
  ad_user_data: 'granted' | 'denied'
  ad_personalization: 'granted' | 'denied'
  analytics_storage: 'granted' | 'denied'
  functionality_storage: 'granted' | 'denied'
  personalization_storage: 'granted' | 'denied'
  security_storage: 'granted' | 'denied'
}
```

## Testare

### 1. Verificare Consent Mode in Console

```javascript
// Check dataLayer
console.log(window.dataLayer)

// Check current consent state
window.gtag('get', 'GTM-XXXXXXX', 'consent')
```

### 2. Verificare Network Tab

- **Inainte de accept:** Doar GTM request
- **Dupa accept:** GA, FB Pixel, TikTok, Hotjar requests

### 3. Development Mode

In development, store-ul logheaza automat consent changes:

```javascript
[ScriptLoader] Consent updated: {
  analytics: true,
  marketing: true,
  preferences: true
}
```

## Best Practices

1. **Nu incarca scripturi inainte de consent**
   - Foloseste ScriptLoader, nu hard-code scripturi in HTML

2. **Respecta preferintele user-ului**
   - Nu forta loading daca consent = false

3. **Testeaza in Incognito**
   - Verifica comportamentul pentru new users

4. **Monitorizeaza expirarea**
   - Store-ul expira dupa 365 zile automat

5. **Audit Trail**
   - Store-ul salveaza consentId si consentDate

## Troubleshooting

### Scripturile nu se incarca dupa accept

```typescript
// Check store state
const state = useCookieConsent.getState()
console.log(state)

// Force reload
useCookieConsent.getState().loadFromStorage()
```

### GTM nu primeste consent update

```typescript
// Check if gtag exists
console.log(typeof window.gtag)

// Manually trigger update
import { updateConsent } from '@/components/ScriptLoader/gtmConsent'
updateConsent({ analytics: true, marketing: true, preferences: true })
```

### localStorage nu se salveaza

```typescript
// Check localStorage
console.log(localStorage.getItem('cookie-consent'))

// Clear and reset
localStorage.removeItem('cookie-consent')
useCookieConsent.getState().resetConsent()
```

## Suport

Pentru probleme sau intrebari, verifica:
- [Google Consent Mode v2 Docs](https://developers.google.com/tag-platform/security/guides/consent)
- [GDPR Documentation](https://gdpr.eu/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
