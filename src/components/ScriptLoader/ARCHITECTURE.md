# ScriptLoader Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Visits Site                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Layout Loads                          │
│  - CookieConsent Component                                       │
│  - ScriptLoader Component                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
    ┌───────────────────┐    ┌───────────────────────┐
    │  CookieConsent    │    │  ScriptLoader         │
    │  (UI Layer)       │    │  (Loading Layer)      │
    └─────────┬─────────┘    └───────────┬───────────┘
              │                           │
              │  Reads/Writes             │  Reads
              ▼                           ▼
    ┌─────────────────────────────────────────────┐
    │     Zustand Store (cookieConsentStore)      │
    │  - necessary: boolean                       │
    │  - analytics: boolean                       │
    │  - marketing: boolean                       │
    │  - preferences: boolean                     │
    │  - hasInteracted: boolean                   │
    │  - consentDate: string | null               │
    │  - consentId: string | null                 │
    └─────────────────┬───────────────────────────┘
                      │
                      │ Persists to
                      ▼
            ┌─────────────────────┐
            │   localStorage      │
            │  'cookie-consent'   │
            └─────────────────────┘
```

## Component Hierarchy

```
RootLayout
├── ThemeProvider
├── AuthProvider
├── EcommerceProvider
├── ToastProvider
│   ├── Header
│   ├── Main Content
│   ├── Footer
│   ├── CookieConsent
│   │   ├── CookieBanner (Layer 1)
│   │   ├── CookieModal (Layer 2)
│   │   └── CookieButton (Floating)
│   └── ScriptLoader
│       ├── GoogleTagManager (always loads)
│       ├── GoogleAnalytics (if analytics consent)
│       ├── FacebookPixel (if marketing consent)
│       ├── TikTokPixel (if marketing consent)
│       └── Hotjar (if analytics consent)
```

## Data Flow

### 1. Initial Page Load (No Consent)

```
User visits page
       │
       ▼
Layout renders
       │
       ├──> CookieConsent mounts
       │         │
       │         ├──> Checks localStorage
       │         │         │
       │         │         └──> No consent found
       │         │
       │         └──> Shows CookieBanner
       │
       └──> ScriptLoader mounts
                 │
                 ├──> Reads Zustand store
                 │         │
                 │         └──> hasInteracted: false
                 │                analytics: false
                 │                marketing: false
                 │
                 ├──> GTM loads with default consent DENIED
                 │
                 └──> Other scripts DON'T load (no consent)
```

### 2. User Accepts All

```
User clicks "Accept All"
       │
       ▼
CookieBanner.acceptAll()
       │
       ├──> Updates Zustand store
       │         │
       │         └──> hasInteracted: true
       │              analytics: true
       │              marketing: true
       │              preferences: true
       │              consentDate: ISO timestamp
       │              consentId: UUID
       │
       ├──> Triggers GTM consent update
       │         │
       │         └──> gtag('consent', 'update', {
       │                  ad_storage: 'granted',
       │                  analytics_storage: 'granted',
       │                  ...
       │              })
       │
       ├──> Saves to localStorage
       │
       └──> Hides CookieBanner
                 │
                 ▼
ScriptLoader re-renders
       │
       ├──> Detects analytics: true
       │         │
       │         └──> Loads GoogleAnalytics
       │              Loads Hotjar
       │
       └──> Detects marketing: true
                 │
                 └──> Loads FacebookPixel
                      Loads TikTokPixel
```

### 3. User Rejects All

```
User clicks "Reject All"
       │
       ▼
CookieBanner.rejectAll()
       │
       ├──> Updates Zustand store
       │         │
       │         └──> hasInteracted: true
       │              analytics: false
       │              marketing: false
       │              preferences: false
       │              consentDate: ISO timestamp
       │              consentId: UUID
       │
       ├──> Triggers GTM consent update
       │         │
       │         └──> gtag('consent', 'update', {
       │                  ad_storage: 'denied',
       │                  analytics_storage: 'denied',
       │                  ...
       │              })
       │
       ├──> Saves to localStorage
       │
       └──> Hides CookieBanner
                 │
                 ▼
ScriptLoader re-renders
       │
       └──> Only GTM remains loaded
            (Other scripts don't load - no consent)
```

### 4. Subsequent Page Load (With Consent)

```
User visits page (has previous consent)
       │
       ▼
Layout renders
       │
       ├──> CookieConsent mounts
       │         │
       │         ├──> Checks localStorage
       │         │         │
       │         │         └──> Consent found & valid
       │         │
       │         ├──> Loads state to Zustand
       │         │
       │         ├──> Hides CookieBanner
       │         │
       │         └──> Shows CookieButton (floating)
       │
       └──> ScriptLoader mounts
                 │
                 ├──> Reads Zustand store
                 │         │
                 │         └──> hasInteracted: true
                 │              analytics: true (example)
                 │              marketing: true (example)
                 │
                 ├──> GTM loads
                 │
                 ├──> Updates GTM consent to 'granted'
                 │
                 └──> Loads approved scripts immediately
                           │
                           ├──> GoogleAnalytics
                           ├──> Hotjar
                           ├──> FacebookPixel
                           └──> TikTokPixel
```

## State Transitions

```
┌─────────────────┐
│  Initial State  │  hasInteracted: false
│  (No Consent)   │  All categories: false
└────────┬────────┘
         │
         │ User Action
         ▼
    ┌────────────────┐
    │ User Interacts │
    └────┬───────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
Accept All  Reject All  Customize  Do Nothing
    │          │          │          │
    ▼          ▼          ▼          │
┌─────────┐ ┌─────────┐ ┌─────────┐ │
│All:true │ │All:false│ │Mixed    │ │
│Interact │ │Interact │ │Interact │ │
└────┬────┘ └────┬────┘ └────┬────┘ │
     │           │           │      │
     └───────────┴───────────┴──────┘
                 │
                 ▼
        ┌────────────────┐
        │ Persisted      │
        │ (localStorage) │
        └────────┬───────┘
                 │
                 │ 365 days
                 ▼
        ┌────────────────┐
        │    Expires     │  → Reset to Initial State
        └────────────────┘
```

## Script Loading Logic

```
┌──────────────────────────────────────────────────────────┐
│                    ScriptLoader                          │
└──────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │   GTM    │      │Analytics │     │Marketing │
    │  (Always)│      │(Consent?)│     │(Consent?)│
    └────┬─────┘      └────┬─────┘     └────┬─────┘
         │                 │                 │
         │                 │                 │
         ▼                 ▼                 ▼
    Load GTM          Check Store      Check Store
         │                 │                 │
         ▼                 ▼                 ▼
    Set Default      analytics=true?   marketing=true?
    Consent                │                 │
    (DENIED)               │                 │
         │            Yes ─┴─ No        Yes ─┴─ No
         │             │     │           │     │
         │             ▼     ▼           ▼     ▼
         │           Load  Don't       Load  Don't
         │            │    Load         │    Load
         │            │                 │
         │            ├──GA4            ├──FB Pixel
         │            └──Hotjar         └──TikTok
         │
         │
    Update Consent
    When User Accepts
```

## Google Consent Mode Integration

```
┌─────────────────────────────────────────────────────────────┐
│                   Page Load Sequence                         │
└─────────────────────────────────────────────────────────────┘

1. HTML Loads
        │
        ▼
2. GTM Consent Mode Script (beforeInteractive)
        │
        ├──> window.dataLayer = []
        ├──> gtag('consent', 'default', { all: 'denied' })
        │
        ▼
3. GTM Container Script (afterInteractive)
        │
        ├──> GTM loads but tags wait for consent
        │
        ▼
4. User Accepts/Rejects
        │
        ├──> gtag('consent', 'update', { ... })
        │
        ▼
5. GTM Tags Fire (if consent granted)
        │
        └──> Analytics events, Ads, etc.

┌─────────────────────────────────────────────────────────────┐
│              Consent Mode Parameter Mapping                  │
└─────────────────────────────────────────────────────────────┘

Cookie Category     →  Consent Mode Parameters
───────────────────────────────────────────────────────────────
necessary           →  security_storage: 'granted'
analytics           →  analytics_storage: 'granted' / 'denied'
marketing           →  ad_storage: 'granted' / 'denied'
                       ad_user_data: 'granted' / 'denied'
                       ad_personalization: 'granted' / 'denied'
preferences         →  functionality_storage: 'granted' / 'denied'
                       personalization_storage: 'granted' / 'denied'
```

## Storage Structure

### localStorage: 'cookie-consent'

```json
{
  "state": {
    "necessary": true,
    "analytics": true,
    "marketing": false,
    "preferences": true,
    "hasInteracted": true,
    "consentDate": "2025-12-12T10:30:00.000Z",
    "consentId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "version": 1
}
```

## Network Timeline

### Without Consent

```
Time  Request
0ms   Page HTML
50ms  CSS/JS
100ms GTM Script (consent = denied)
      ↓
      [No other tracking scripts loaded]
```

### With Full Consent

```
Time  Request
0ms   Page HTML
50ms  CSS/JS
100ms GTM Script (consent = denied initially)
150ms User clicks "Accept All"
200ms GTM Consent Update (consent = granted)
250ms GA4 Script
300ms FB Pixel Script
350ms TikTok Pixel Script
400ms Hotjar Script
```

## Type System

```typescript
// Core Types
type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences'
type ConsentValue = 'granted' | 'denied'

// Store State
interface CookieConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
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

// GTM Integration
interface GoogleConsentMode {
  ad_storage: ConsentValue
  ad_user_data: ConsentValue
  ad_personalization: ConsentValue
  analytics_storage: ConsentValue
  functionality_storage: ConsentValue
  personalization_storage: ConsentValue
  security_storage: ConsentValue
}

// Component Props
interface ScriptLoaderProps {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  tiktokPixelId?: string
  hotjarId?: string
  hotjarVersion?: number
}
```

## Security Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Measures                         │
└─────────────────────────────────────────────────────────────┘

1. No scripts load before consent
   └──> Prevents tracking without permission

2. Consent expiry (365 days)
   └──> Forces re-consent after 1 year

3. localStorage validation
   └──> Checks for expiry, handles corrupt data

4. Type safety
   └──> TypeScript prevents invalid states

5. Cookie flags
   └──> SameSite=None;Secure for GA cookies

6. Audit trail
   └──> consentId + consentDate for compliance

7. No external dependencies
   └──> All code is self-contained
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                Performance Strategies                        │
└─────────────────────────────────────────────────────────────┘

1. next/script Strategy
   ├──> beforeInteractive: GTM Consent Mode
   └──> afterInteractive: All tracking scripts

2. Conditional Rendering
   └──> Scripts only render when consent given

3. Zustand Selective Subscription
   └──> Components only re-render on relevant changes

4. localStorage Cache
   └──> Avoid re-asking on every page load

5. No Render Blocking
   └──> All scripts load asynchronously

6. wait_for_update: 500ms
   └──> GTM waits for consent before firing
```

---

This architecture ensures GDPR compliance while maintaining excellent performance and user experience.
