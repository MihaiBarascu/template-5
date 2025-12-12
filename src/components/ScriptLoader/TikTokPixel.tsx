'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsentStore } from '@/stores/cookieConsentStore'

interface TikTokPixelProps {
  pixelId: string
}

// TypeScript declaration for TikTok Pixel
interface TikTokQueue {
  (...args: unknown[]): void
  methods: string[]
  setAndDefer: (t: TikTokQueue, e: string) => void
  instance: (t: string) => unknown[]
  load: (e: string, n?: Record<string, unknown>) => void
  page: () => void
  _i: Record<string, unknown[]>
  _t: Record<string, number>
  _o: Record<string, Record<string, unknown>>
  push: (...args: unknown[]) => void
}

declare global {
  interface Window {
    ttq?: TikTokQueue
    TiktokAnalyticsObject?: string
  }
}

/**
 * TikTok Pixel with Consent-Based Loading
 * Only loads when marketing consent is granted
 */
export function TikTokPixel({ pixelId }: TikTokPixelProps) {
  const marketing = useCookieConsentStore((state) => state.marketing)

  // Initialize TikTok Pixel when consent is granted
  useEffect(() => {
    if (!marketing || typeof window === 'undefined') return

    // Track page views on route changes
    const handleRouteChange = () => {
      if (window.ttq) {
        window.ttq.page()
      }
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [marketing])

  // Don't render script if marketing consent not granted
  if (!marketing) {
    return null
  }

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${pixelId}');
            ttq.page();
          }(window, document, 'ttq');
        `,
      }}
    />
  )
}
