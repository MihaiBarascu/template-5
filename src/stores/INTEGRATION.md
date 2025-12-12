# Ghid de integrare Cookie Consent

Pași pentru integrarea completă a cookie consent în aplicația Next.js + Payload CMS.

## Pasul 1: Instalare dependențe

Zustand este deja instalat în proiect:

```bash
pnpm add zustand
```

## Pasul 2: Structura fișierelor

```
src/
├── stores/
│   ├── cookieConsentStore.ts     # Store principal
│   ├── cookieConstants.ts        # Constante și helpers
│   ├── index.ts                  # Exports centrale
│   ├── README.md                 # Documentație
│   ├── EXAMPLES.md               # Exemple de utilizare
│   └── INTEGRATION.md            # Acest fișier
├── components/
│   ├── CookieBanner.tsx          # Banner principal
│   ├── CookieSettingsModal.tsx   # Modal setări
│   ├── CookieFloatingButton.tsx  # Buton flotant
│   └── GoogleConsentMode.tsx     # GTM integration
└── app/
    ├── layout.tsx                # Layout principal
    └── api/
        └── cookie-consent/
            └── route.ts          # API pentru audit trail
```

## Pasul 3: Creează componentele

### 3.1 Banner de cookies (obligatoriu)

Creează `/src/components/CookieBanner.tsx`:

```tsx
'use client'

import { useCookieConsent, LEGAL_TEXTS } from '@/stores'

export function CookieBanner() {
  const { hasInteracted, acceptAll, rejectAll } = useCookieConsent()

  if (hasInteracted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {LEGAL_TEXTS.banner.title}
            </h3>
            <p className="text-sm text-gray-300">
              {LEGAL_TEXTS.banner.description}
            </p>
            <a
              href="/politica-cookies"
              className="text-sm text-blue-400 hover:underline mt-1 inline-block"
            >
              {LEGAL_TEXTS.banner.policyLink}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={rejectAll}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              {LEGAL_TEXTS.banner.rejectOptional}
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              {LEGAL_TEXTS.banner.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 3.2 Google Consent Mode Provider (pentru GTM)

Creează `/src/components/GoogleConsentMode.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { useCookieConsent } from '@/stores'

export function GoogleConsentModeProvider() {
  const { getConsentForGTM, hasInteracted } = useCookieConsent()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const consent = getConsentForGTM()

      if (!hasInteracted) {
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
        window.gtag('consent', 'update', consent)
      }
    }
  }, [hasInteracted, getConsentForGTM])

  return null
}
```

## Pasul 4: Integrare în Layout

Modifică `/src/app/layout.tsx`:

```tsx
import { CookieBanner } from '@/components/CookieBanner'
import { GoogleConsentModeProvider } from '@/components/GoogleConsentMode'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        {/* Google Tag Manager - IMPORTANT: Adaugă ÎNAINTE de gtag init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            `,
          }}
        />

        {/* Google Analytics - Adaugă GTM ID-ul tău */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body>
        <GoogleConsentModeProvider />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
```

## Pasul 5: Adaugă Google Tag Manager (opțional)

### 5.1 Creează variabile de environment

În `.env.local`:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 5.2 Creează componenta GTM

Creează `/src/components/GoogleTagManager.tsx`:

```tsx
'use client'

import Script from 'next/script'

export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  if (!gtmId) return null

  return (
    <>
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
    </>
  )
}
```

Adaugă în layout:

```tsx
import { GoogleTagManager } from '@/components/GoogleTagManager'

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <GoogleTagManager />
      </head>
      <body>
        {/* Noscript pentru GTM */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  )
}
```

## Pasul 6: Creează pagina Politica de Cookies (obligatoriu GDPR)

Creează `/src/app/politica-cookies/page.tsx`:

```tsx
import { COOKIE_CATEGORIES, LEGAL_TEXTS } from '@/stores'

export default function PoliticaCookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Politica de Cookies</h1>

      <p className="text-gray-600 mb-8">
        Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ce sunt cookies?</h2>
        <p className="mb-4">
          Cookies sunt fișiere text mici care sunt plasate pe computerul sau
          dispozitivul mobil atunci când vizitezi un site web. Acestea sunt
          utilizate pe scară largă pentru a face site-urile web să funcționeze
          sau să funcționeze mai eficient.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ce cookies folosim?</h2>

        {Object.values(COOKIE_CATEGORIES).map((category) => (
          <div key={category.id} className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">{category.label}</h3>
            <p className="text-gray-700 mb-2">{category.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Exemple:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {category.examples.map((example, idx) => (
                  <li key={idx}>{example}</li>
                ))}
              </ul>
            </div>
            {category.required && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Obligatoriu
              </span>
            )}
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Bază legală</h2>
        <p className="mb-4">{LEGAL_TEXTS.footer.gdpr}</p>
        <p>{LEGAL_TEXTS.footer.rights}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Gestionare cookies</h2>
        <p className="mb-4">
          Poți gestiona preferințele tale de cookies în orice moment folosind
          butonul flotant din colțul din stânga jos al paginii.
        </p>
        <p>
          De asemenea, poți bloca cookies direct din browserul tău, dar acest
          lucru poate afecta funcționarea corectă a site-ului.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p>
          Pentru întrebări legate de politica noastră de cookies, te rugăm să ne
          contactezi la:{' '}
          <a href="mailto:contact@example.com" className="text-blue-600 hover:underline">
            contact@example.com
          </a>
        </p>
      </section>
    </div>
  )
}
```

## Pasul 7: Testing

### 7.1 Test manual

1. Deschide aplicația în browser
2. Verifică că banner-ul apare la prima vizită
3. Testează butoanele "Acceptă toate" și "Doar necesare"
4. Verifică că preferințele sunt salvate în localStorage
5. Reîncarcă pagina - banner-ul NU ar trebui să mai apară
6. Verifică în DevTools → Application → Local Storage → `cookie-consent`

### 7.2 Test Google Consent Mode

Deschide Console → Network tab:

```javascript
// Verifică că consent-ul este setat corect
console.log(window.dataLayer)

// Ar trebui să vezi evenimente de tipul:
// ['consent', 'default', { ad_storage: 'denied', ... }]
// ['consent', 'update', { ad_storage: 'granted', ... }]
```

### 7.3 Test expirare (365 zile)

```javascript
// În Console
const store = JSON.parse(localStorage.getItem('cookie-consent'))
console.log('Consent date:', store.state.consentDate)
console.log('Consent ID:', store.state.consentId)

// Forțează expirare
const oldDate = new Date()
oldDate.setDate(oldDate.getDate() - 366)
store.state.consentDate = oldDate.toISOString()
localStorage.setItem('cookie-consent', JSON.stringify(store))

// Reîncarcă pagina - banner-ul ar trebui să apară din nou
```

## Pasul 8: Conformitate GDPR - Checklist

- [ ] Banner de cookies apare la prima vizită
- [ ] Utilizatorul poate accepta/respinge cookies înainte de tracking
- [ ] Cookies necesare funcționează fără consimțământ
- [ ] Existe pagina "Politica de Cookies" cu informații detaliate
- [ ] Utilizatorul poate schimba preferințele oricând
- [ ] Consimțământul expiră după maxim 365 zile
- [ ] Audit trail cu `consentId` și `consentDate`
- [ ] Google Consent Mode v2 implementat corect
- [ ] Link către politica de cookies în banner
- [ ] Informații clare despre fiecare categorie de cookies

## Pasul 9: Monitorizare și Analytics

### 9.1 Track cookie consent events

Adaugă în componenta `CookieBanner.tsx`:

```tsx
const handleAcceptAll = () => {
  acceptAll()

  // Track event
  if (window.gtag) {
    window.gtag('event', 'cookie_consent', {
      event_category: 'engagement',
      event_label: 'accept_all',
    })
  }
}

const handleRejectAll = () => {
  rejectAll()

  // Track event
  if (window.gtag) {
    window.gtag('event', 'cookie_consent', {
      event_category: 'engagement',
      event_label: 'reject_optional',
    })
  }
}
```

### 9.2 Salvează în database pentru audit (opțional)

Creează `/src/app/api/cookie-consent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { consentId, consentDate, preferences } = body

    // TODO: Salvează în Payload CMS
    // await payload.create({
    //   collection: 'cookie-consents',
    //   data: {
    //     consentId,
    //     consentDate,
    //     preferences,
    //     userAgent: request.headers.get('user-agent'),
    //     ip: request.headers.get('x-forwarded-for'),
    //   }
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save consent' },
      { status: 500 }
    )
  }
}
```

## Pasul 10: Deployment

### Verificări înainte de deployment:

1. Testează pe toate device-urile (mobile, tablet, desktop)
2. Verifică că banner-ul este responsive
3. Testează pe toate browserele majore
4. Verifică că Google Consent Mode funcționează
5. Testează expirarea după 365 zile
6. Asigură-te că pagina "Politica de Cookies" este accesibilă
7. Verifică că toate link-urile funcționează

### Variabile de environment pentru producție:

```env
# .env.production
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://your-domain.ro
```

## Suport și debugging

### Debugging în development:

Adaugă componenta de debug (vezi EXAMPLES.md):

```tsx
import { CookieDebugger } from '@/components/CookieDebugger'

// În layout
<CookieDebugger />
```

### Log-uri utile:

```javascript
// Verifică state-ul curent
console.log(useCookieConsent.getState())

// Verifică Google Consent Mode
console.log(window.dataLayer)

// Verifică localStorage
console.log(localStorage.getItem('cookie-consent'))
```

## Resurse suplimentare

- [GDPR Official Website](https://gdpr.eu/)
- [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent)
- [Legea 506/2004 România](https://www.dataprotection.ro/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

## Actualizări viitoare

Pentru a actualiza versiunea cookie consent:

1. Modifică `COOKIE_CONSENT_VERSION` în `cookieConstants.ts`
2. Store-ul Zustand va reseta automat preferințele utilizatorilor
3. Utilizatorii vor vedea din nou banner-ul de cookies
4. Notifică utilizatorii prin email (opțional)

---

**IMPORTANT**: Acest ghid este un punct de plecare. Consultă un expert legal pentru conformitate completă GDPR în România.
