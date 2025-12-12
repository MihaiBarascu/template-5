# Exemple de Integrare ScriptLoader

## 1. Integrare in Layout (Recomandat)

### /src/app/(frontend)/layout.tsx

```tsx
import { ScriptLoader } from '@/components/ScriptLoader'
import { CookieConsent } from '@/components/CookieConsent'

export default async function RootLayout({ children }) {
  // Fetch tracking IDs from Payload CMS (optional)
  const siteSettings = await getCachedGlobal('site-settings')

  return (
    <html lang="ro">
      <body>
        {children}

        {/* Cookie Consent UI */}
        <CookieConsent enabled={true} />

        {/* Script Loader - loads scripts based on consent */}
        <ScriptLoader
          googleAnalyticsId={
            siteSettings?.tracking?.googleAnalyticsId ||
            process.env.NEXT_PUBLIC_GA_ID
          }
          googleTagManagerId={
            siteSettings?.tracking?.googleTagManagerId ||
            process.env.NEXT_PUBLIC_GTM_ID
          }
          facebookPixelId={
            siteSettings?.tracking?.facebookPixelId ||
            process.env.NEXT_PUBLIC_FB_PIXEL_ID
          }
          tiktokPixelId={siteSettings?.tracking?.tiktokPixelId}
          hotjarId={siteSettings?.tracking?.hotjarId}
        />
      </body>
    </html>
  )
}
```

## 2. Adaugare in Payload CMS Config

### /src/globals/SiteSettings.ts (Nou sau existent)

```typescript
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Setari Site',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ... existing tabs
        {
          label: 'Tracking & Analytics',
          description: 'Configurare Google Analytics, Facebook Pixel, etc.',
          fields: [
            {
              name: 'tracking',
              type: 'group',
              label: 'Tracking IDs',
              fields: [
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  label: 'Google Analytics ID',
                  admin: {
                    placeholder: 'G-XXXXXXXXXX',
                    description: 'GA4 Measurement ID pentru analytics',
                  },
                },
                {
                  name: 'googleTagManagerId',
                  type: 'text',
                  label: 'Google Tag Manager ID',
                  admin: {
                    placeholder: 'GTM-XXXXXXX',
                    description: 'GTM Container ID pentru tag management',
                  },
                },
                {
                  name: 'facebookPixelId',
                  type: 'text',
                  label: 'Facebook Pixel ID',
                  admin: {
                    placeholder: '123456789',
                    description: 'FB Pixel pentru marketing tracking',
                  },
                },
                {
                  name: 'tiktokPixelId',
                  type: 'text',
                  label: 'TikTok Pixel ID',
                  admin: {
                    placeholder: 'ABCDEFG',
                    description: 'TikTok Pixel pentru marketing tracking',
                  },
                },
                {
                  name: 'hotjarId',
                  type: 'text',
                  label: 'Hotjar Site ID',
                  admin: {
                    placeholder: '1234567',
                    description: 'Hotjar pentru behavior analytics',
                  },
                },
              ],
            },
            {
              name: 'consentSettings',
              type: 'group',
              label: 'Cookie Consent Settings',
              fields: [
                {
                  name: 'enableCookieBanner',
                  type: 'checkbox',
                  label: 'Activeaza Cookie Banner',
                  defaultValue: true,
                },
                {
                  name: 'privacyPolicyUrl',
                  type: 'text',
                  label: 'URL Politica Cookies',
                  defaultValue: '/politica-cookies',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

### /src/payload.config.ts

```typescript
import { SiteSettings } from '@/globals/SiteSettings'

export default buildConfig({
  // ... existing config
  globals: [
    // ... existing globals
    SiteSettings,
  ],
})
```

## 3. Custom Tracking Events

### Components cu Custom Events

```tsx
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'

export function ProductCard({ product }) {
  const { analytics, marketing } = useCookieConsent()

  const handleAddToCart = () => {
    // Your add to cart logic
    addToCart(product)

    // Track event in GA (only if consent given)
    if (analytics && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'RON',
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.price,
          },
        ],
      })
    }

    // Track event in FB Pixel (only if consent given)
    if (marketing && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'RON',
      })
    }
  }

  return (
    <button onClick={handleAddToCart}>
      Adauga in cos
    </button>
  )
}
```

### Server-Side Tracking (pentru conversii critice)

```tsx
// /src/app/api/track-purchase/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { orderId, value, items } = await request.json()

  // Server-side tracking catre GA4 Measurement Protocol
  // IMPORTANT: Respecta GDPR chiar si server-side
  const response = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: 'server-side-tracking',
        events: [
          {
            name: 'purchase',
            params: {
              transaction_id: orderId,
              value: value,
              currency: 'RON',
              items: items,
            },
          },
        ],
      }),
    }
  )

  return NextResponse.json({ success: true })
}
```

## 4. Middleware pentru Consent Verification

### /src/middleware.ts (optional)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user has cookie consent
  const consentCookie = request.cookies.get('cookie-consent')

  // Log for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Cookie consent:', consentCookie?.value)
  }

  // Add consent header for server components
  const response = NextResponse.next()
  response.headers.set('x-consent-status', consentCookie?.value || 'none')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## 5. Testing Setup

### Cypress E2E Test

```typescript
// /cypress/e2e/cookie-consent.cy.ts
describe('Cookie Consent & Script Loading', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('shows cookie banner on first visit', () => {
    cy.contains('Acest site folosește cookie-uri').should('be.visible')
  })

  it('loads GTM by default', () => {
    cy.window().then((win) => {
      expect(win.dataLayer).to.exist
    })
  })

  it('loads GA after accepting analytics', () => {
    cy.contains('Acceptă toate').click()

    cy.window().then((win) => {
      expect(win.gtag).to.exist
    })
  })

  it('loads FB Pixel after accepting marketing', () => {
    cy.contains('Acceptă toate').click()

    cy.window().then((win) => {
      expect(win.fbq).to.exist
    })
  })

  it('does not load marketing scripts when rejected', () => {
    cy.contains('Refuză toate').click()

    cy.window().then((win) => {
      expect(win.fbq).to.not.exist
    })
  })

  it('persists consent across page reloads', () => {
    cy.contains('Acceptă toate').click()
    cy.reload()

    cy.contains('Acest site folosește cookie-uri').should('not.exist')
  })

  it('allows changing preferences via floating button', () => {
    cy.contains('Acceptă toate').click()

    // Click floating cookie button
    cy.get('[aria-label*="cookie"]').click()

    // Verify banner or modal appears
    cy.contains('Setări').should('be.visible')
  })
})
```

### Jest Unit Test

```typescript
// /src/components/ScriptLoader/__tests__/ScriptLoader.test.tsx
import { render, waitFor } from '@testing-library/react'
import { ScriptLoader } from '../index'
import { useCookieConsent } from '@/stores/cookieConsentStore'

jest.mock('@/stores/cookieConsentStore')

describe('ScriptLoader', () => {
  it('does not render GA script without analytics consent', () => {
    ;(useCookieConsent as any).mockReturnValue({
      preferences: { analytics: false, marketing: false },
      hasInteracted: true,
    })

    const { container } = render(
      <ScriptLoader googleAnalyticsId="G-TEST123" />
    )

    expect(container.querySelector('#google-analytics')).toBeNull()
  })

  it('renders GA script with analytics consent', async () => {
    ;(useCookieConsent as any).mockReturnValue({
      preferences: { analytics: true, marketing: false },
      hasInteracted: true,
    })

    const { container } = render(
      <ScriptLoader googleAnalyticsId="G-TEST123" />
    )

    await waitFor(() => {
      expect(container.querySelector('#google-analytics')).toBeTruthy()
    })
  })
})
```

## 6. Environment Variables Setup

### .env.local (Development)

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

# Server-side tracking (optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your_api_secret_here
```

### .env.production (Production)

```env
# Production tracking IDs
NEXT_PUBLIC_GA_ID=G-PROD123456
NEXT_PUBLIC_GTM_ID=GTM-PROD123
NEXT_PUBLIC_FB_PIXEL_ID=987654321

# Server-side
GA_MEASUREMENT_ID=G-PROD123456
GA_API_SECRET=prod_secret_here
```

## 7. Vercel/Production Deployment

### vercel.json (optional)

```json
{
  "env": {
    "NEXT_PUBLIC_GA_ID": "@ga-id",
    "NEXT_PUBLIC_GTM_ID": "@gtm-id",
    "NEXT_PUBLIC_FB_PIXEL_ID": "@fb-pixel-id"
  }
}
```

### Add Secrets in Vercel Dashboard

```bash
vercel env add NEXT_PUBLIC_GA_ID
vercel env add NEXT_PUBLIC_GTM_ID
vercel env add NEXT_PUBLIC_FB_PIXEL_ID
```

## 8. GTM Container Setup

### Tag Configuration

**GA4 Event Tag:**
```
Tag Type: Google Analytics: GA4 Event
Measurement ID: {{GA4 Measurement ID}}
Event Name: page_view

Triggering:
  - All Pages

Consent Settings:
  - Required: analytics_storage
```

**Facebook Pixel Tag:**
```
Tag Type: Custom HTML
HTML:
  fbq('track', 'PageView');

Triggering:
  - All Pages

Consent Settings:
  - Required: ad_storage
```

### Variables Setup

```
Variable Name: GA4 Measurement ID
Type: Constant
Value: G-XXXXXXXXXX

Variable Name: FB Pixel ID
Type: Constant
Value: 123456789
```

## 9. Debugging Tools

### Browser Console Commands

```javascript
// Check consent state
useCookieConsent.getState()

// Check GTM consent
window.dataLayer

// Trigger test event
window.gtag('event', 'test_event', { test: true })

// Check FB Pixel
window.fbq('track', 'Test')

// Reset consent (for testing)
useCookieConsent.getState().resetConsent()
```

### Chrome DevTools

1. **Application Tab** → Local Storage → `cookie-consent`
2. **Network Tab** → Filter `analytics|facebook|tiktok|hotjar`
3. **Console Tab** → Check for consent logs

## 10. Compliance Checklist

- [ ] Cookie banner arata la prima vizita
- [ ] Optiunea "Refuza" este la fel de vizibila ca "Accepta"
- [ ] Scripturile NU se incarca inainte de consent
- [ ] GTM Consent Mode v2 este implementat
- [ ] Consent expira dupa 365 zile
- [ ] User poate schimba preferintele oricand (floating button)
- [ ] Privacy Policy link este prezent
- [ ] Audit trail (consentId, consentDate) este salvat

## Suport

Pentru asistenta suplimentara:
- Verifica README.md principal
- Testeaza in browser Incognito
- Analizeaza Network tab pentru request-uri
- Verifica Console pentru erori
