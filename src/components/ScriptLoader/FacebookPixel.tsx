'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsentStore } from '@/stores/cookieConsentStore'

interface FacebookPixelProps {
  pixelId: string
}

// TypeScript declaration for Facebook Pixel
type FbqMethod = 'init' | 'track' | 'trackCustom' | 'trackSingle' | 'trackSingleCustom'
type FbqFunction = {
  (method: FbqMethod, ...args: string[]): void
  callMethod?: (method: FbqMethod, ...args: string[]) => void
  queue: unknown[]
  loaded: boolean
  version: string
  push: FbqFunction
}

declare global {
  interface Window {
    fbq?: FbqFunction
    _fbq?: FbqFunction
  }
}

/**
 * Facebook Pixel with Consent-Based Loading
 * Only loads when marketing consent is granted
 */
export function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const marketing = useCookieConsentStore((state) => state.marketing)

  // Initialize Facebook Pixel when consent is granted
  useEffect(() => {
    if (!marketing || typeof window === 'undefined') return

    // Track route changes
    const handleRouteChange = () => {
      if (window.fbq) {
        window.fbq('track', 'PageView')
      }
    }

    // Listen to Next.js route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [marketing, pixelId])

  // Don't render script if marketing consent not granted
  if (!marketing) {
    return null
  }

  return (
    <>
      {/* Facebook Pixel Script */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Facebook Pixel NoScript Fallback */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
