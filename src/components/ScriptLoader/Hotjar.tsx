'use client'

import Script from 'next/script'
import { useCookieConsentStore } from '@/stores/cookieConsentStore'

interface HotjarProps {
  siteId: string
  version?: number
}

// TypeScript declaration for Hotjar
interface HotjarFunction {
  (...args: unknown[]): void
  q?: unknown[]
}

declare global {
  interface Window {
    hj?: HotjarFunction
    _hjSettings?: {
      hjid: number
      hjsv: number
    }
  }
}

/**
 * Hotjar Analytics with Consent-Based Loading
 * Only loads when analytics consent is granted
 */
export function Hotjar({ siteId, version = 6 }: HotjarProps) {
  const analytics = useCookieConsentStore((state) => state.analytics)

  // Don't render script if analytics consent not granted
  if (!analytics) {
    return null
  }

  return (
    <Script
      id="hotjar"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${siteId},hjsv:${version}};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      }}
    />
  )
}
