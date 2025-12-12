# ScriptLoader - Quick Start Guide

## Setup in 5 Minutes ⚡

### Step 1: Add Environment Variables

Create `.env.local`:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Facebook Pixel (optional)
NEXT_PUBLIC_FB_PIXEL_ID=123456789

# TikTok Pixel (optional)
NEXT_PUBLIC_TIKTOK_PIXEL_ID=ABCDEFG

# Hotjar (optional)
NEXT_PUBLIC_HOTJAR_ID=1234567
```

### Step 2: Add to Layout

Edit `/src/app/(frontend)/layout.tsx`:

```tsx
import { ScriptLoader } from '@/components/ScriptLoader'

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        {children}

        {/* Cookie Consent is already integrated */}

        {/* Add ScriptLoader before closing body tag */}
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

### Step 3: Test

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Open browser (Incognito):**
   ```
   http://localhost:3000
   ```

3. **Check Cookie Banner appears:**
   - Should see banner at bottom
   - Has "Accept All", "Reject All", "Customize" buttons

4. **Click "Accept All":**
   - Banner disappears
   - Open DevTools → Network tab
   - Should see requests to GA, FB Pixel, etc.

5. **Check Console (Development mode):**
   ```javascript
   [ScriptLoader] Consent updated: {
     analytics: true,
     marketing: true,
     preferences: true
   }
   ```

### Step 4: Verify Google Tag Manager (if using GTM)

1. **Open GTM Container**

2. **Add Consent Mode Settings:**
   - Go to Admin → Container Settings
   - Enable "Enable consent overview"

3. **Configure Tags:**
   - All tags should have "Consent Settings" configured
   - Example: GA4 tag requires "analytics_storage"

4. **Test in Preview Mode:**
   - Enter Preview mode
   - Visit your site
   - Verify consent state is tracked

## That's It! ✅

Your site now has:
- ✅ GDPR-compliant cookie consent
- ✅ Google Consent Mode v2
- ✅ Conditional script loading
- ✅ Persistent user preferences

## Quick Commands

### Development

```bash
# Start dev server
pnpm dev

# Check for TypeScript errors
pnpm tsc --noEmit

# Run linter
pnpm lint
```

### Testing Consent

```javascript
// In browser console

// Check current state
useCookieConsent.getState()

// Accept all
useCookieConsent.getState().acceptAll()

// Reject all
useCookieConsent.getState().rejectAll()

// Reset (for testing)
useCookieConsent.getState().resetConsent()

// Check GTM dataLayer
console.log(window.dataLayer)
```

### Debugging

```javascript
// Check if scripts loaded
console.log({
  gtag: typeof window.gtag,
  fbq: typeof window.fbq,
  ttq: typeof window.ttq,
  hj: typeof window.hj
})

// Check localStorage
console.log(localStorage.getItem('cookie-consent'))
```

## Common Scenarios

### Scenario 1: Only Google Analytics

```tsx
<ScriptLoader
  googleAnalyticsId="G-XXXXXXXXXX"
/>
```

### Scenario 2: GA + Facebook Pixel

```tsx
<ScriptLoader
  googleAnalyticsId="G-XXXXXXXXXX"
  facebookPixelId="123456789"
/>
```

### Scenario 3: Full Stack (GA + GTM + All Pixels)

```tsx
<ScriptLoader
  googleAnalyticsId="G-XXXXXXXXXX"
  googleTagManagerId="GTM-XXXXXXX"
  facebookPixelId="123456789"
  tiktokPixelId="ABCDEFG"
  hotjarId="1234567"
/>
```

### Scenario 4: From Payload CMS

```tsx
const siteSettings = await getCachedGlobal('site-settings')

<ScriptLoader
  googleAnalyticsId={siteSettings?.tracking?.googleAnalyticsId}
  googleTagManagerId={siteSettings?.tracking?.googleTagManagerId}
  // ... etc
/>
```

## Track Custom Events

### In Any Component

```tsx
'use client'

import { useCookieConsent } from '@/stores/cookieConsentStore'

export function MyButton() {
  const { analytics } = useCookieConsent()

  const handleClick = () => {
    // Your logic here
    doSomething()

    // Track in GA (if consent given)
    if (analytics && window.gtag) {
      window.gtag('event', 'button_click', {
        event_category: 'engagement',
        event_label: 'my_button',
      })
    }
  }

  return <button onClick={handleClick}>Click Me</button>
}
```

## Troubleshooting

### Scripts Not Loading?

1. **Check consent was given:**
   ```javascript
   useCookieConsent.getState().hasInteracted // should be true
   useCookieConsent.getState().analytics // should be true (for GA)
   ```

2. **Check environment variables:**
   ```bash
   echo $NEXT_PUBLIC_GA_ID
   ```

3. **Clear localStorage and retry:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

### GTM Not Working?

1. **Verify GTM ID format:** `GTM-XXXXXXX` (not G-XXXXXXX)

2. **Check dataLayer exists:**
   ```javascript
   console.log(window.dataLayer)
   ```

3. **Verify consent mode initialized:**
   ```javascript
   window.dataLayer.filter(item => item[0] === 'consent')
   ```

### Consent Not Persisting?

1. **Check localStorage is enabled:**
   ```javascript
   try {
     localStorage.setItem('test', 'test')
     localStorage.removeItem('test')
     console.log('localStorage works')
   } catch (e) {
     console.error('localStorage blocked')
   }
   ```

2. **Verify Zustand persist middleware:**
   ```javascript
   console.log(localStorage.getItem('cookie-consent'))
   ```

## Next Steps

### Read Full Documentation
- `/src/components/ScriptLoader/README.md` - Complete guide
- `/src/components/ScriptLoader/INTEGRATION_EXAMPLE.md` - Code examples
- `/src/components/ScriptLoader/ARCHITECTURE.md` - System design

### Add to Payload CMS
See `/src/components/ScriptLoader/INTEGRATION_EXAMPLE.md` section 2 for adding tracking IDs to Payload admin.

### Advanced Tracking
See `/src/components/ScriptLoader/INTEGRATION_EXAMPLE.md` section 3 for custom event tracking.

## Need Help?

1. Check browser Console for errors
2. Check Network tab for script requests
3. Verify consent state in localStorage
4. Test in Incognito for fresh state
5. Read full documentation

---

**You're all set!** 🎉

The system is production-ready and GDPR compliant.
