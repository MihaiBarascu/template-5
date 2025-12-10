import type { Metadata } from 'next'
import React from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { ThemeProvider } from '@/providers/ThemeProvider'
import { EcommerceProviderWrapper } from '@/providers/EcommerceProvider'
import { AuthProvider } from '@/providers/Auth'
import { ToastProvider } from '@/components/Toast'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AdminBar } from '@/components/AdminBar'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { BackToTop } from '@/components/BackToTop'
import { CookieConsent } from '@/components/CookieConsent'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { generateThemeStyles } from '@/utilities/generateThemeStyles'
import { getServerSideURL } from '@/utilities/getURL'
import { getFontVariables } from '@/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Business Website',
    template: '%s | Business Website',
  },
  description: 'Site-ul tau de business profesional',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })

  // Fetch globals directly - Payload handles caching via hooks
  const [siteThemeData, headerData, footerData, businessInfoData, logoData] = await Promise.all([
    payload.findGlobal({ slug: 'site-theme' }),
    payload.findGlobal({ slug: 'header' }),
    payload.findGlobal({ slug: 'footer' }),
    payload.findGlobal({ slug: 'business-info' }),
    payload.findGlobal({ slug: 'logo' }),
  ])

  // Generate inline CSS for theme to prevent FOUC
  const themeStyles = generateThemeStyles(siteThemeData)

  // Get font CSS variables from next/font (self-hosted, no external requests)
  const fontVariables = getFontVariables()

  // Extract widget settings from businessInfo
  const announcementBar = businessInfoData?.announcementBar as {
    enabled?: boolean
    message?: string
    linkText?: string
    linkUrl?: string
    backgroundColor?: 'primary' | 'secondary' | 'accent' | 'dark' | 'gradient'
    icon?: 'megaphone' | 'gift' | 'star' | 'fire' | 'sparkles' | 'none'
    dismissible?: boolean
  } | undefined

  const cookieConsent = businessInfoData?.cookieConsent as {
    enabled?: boolean
    message?: string
    position?: 'bottom' | 'bottom-left' | 'bottom-right'
    variant?: 'bar' | 'popup' | 'minimal'
    acceptButtonText?: string
    showDeclineButton?: boolean
  } | undefined

  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Inline theme styles to prevent FOUC */}
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        {/* JSON-LD Structured Data for LocalBusiness (Schema.org) */}
        {businessInfoData?.name && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: businessInfoData.name,
                description: businessInfoData.description || undefined,
                url: getServerSideURL(),
                telephone: businessInfoData.phone || undefined,
                email: businessInfoData.email || undefined,
                address: businessInfoData.address?.street ? {
                  '@type': 'PostalAddress',
                  streetAddress: businessInfoData.address.street,
                  addressLocality: businessInfoData.address.city || undefined,
                  addressRegion: businessInfoData.address.county || undefined,
                  postalCode: businessInfoData.address.postalCode || undefined,
                  addressCountry: businessInfoData.address.country || 'RO',
                } : undefined,
                geo: businessInfoData.coordinates?.lat && businessInfoData.coordinates?.lng ? {
                  '@type': 'GeoCoordinates',
                  latitude: businessInfoData.coordinates.lat,
                  longitude: businessInfoData.coordinates.lng,
                } : undefined,
                openingHours: businessInfoData.workingHours?.map((item) =>
                  `${item.days}: ${item.hours}`
                ) || undefined,
                sameAs: [
                  businessInfoData.social?.facebook,
                  businessInfoData.social?.instagram,
                  businessInfoData.social?.linkedin,
                  businessInfoData.social?.youtube,
                  businessInfoData.social?.tiktok,
                ].filter(Boolean),
              }),
            }}
          />
        )}
        {/* JSON-LD WebSite Schema for Google Sitelinks Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: businessInfoData?.name || 'Business Website',
              url: getServerSideURL(),
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${getServerSideURL()}/cautare?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Fonts are now self-hosted via next/font - no external requests needed */}
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${fontVariables} antialiased`}>
        <ThemeProvider siteTheme={siteThemeData}>
          <AuthProvider>
          <EcommerceProviderWrapper>
            <ToastProvider>
              {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-theme-primary focus:text-white focus:rounded-[var(--radius-button)] focus:outline-none focus:ring-2 focus:ring-theme-accent"
            >
              Salt la continutul principal
            </a>

            {/* Announcement Bar - appears at very top */}
            {announcementBar?.enabled && announcementBar.message && (
              <AnnouncementBar
                enabled={announcementBar.enabled}
                message={announcementBar.message}
                linkText={announcementBar.linkText}
                linkUrl={announcementBar.linkUrl}
                backgroundColor={announcementBar.backgroundColor}
                icon={announcementBar.icon}
                dismissible={announcementBar.dismissible}
              />
            )}

            <AdminBar />
            <Header data={headerData} logo={logoData} businessInfo={businessInfoData} />
            <main id="main-content" className="min-h-screen">{children}</main>
            <Footer data={footerData} businessInfo={businessInfoData} logo={logoData} />

            {/* Floating widgets */}
            <WhatsAppFloat
              phoneNumber={businessInfoData?.whatsapp}
              defaultMessage={businessInfoData?.whatsappFloat?.defaultMessage}
              position={businessInfoData?.whatsappFloat?.position as 'bottom-right' | 'bottom-left' | null}
              showOnMobile={businessInfoData?.whatsappFloat?.showOnMobile}
              tooltipText={businessInfoData?.whatsappFloat?.tooltipText}
              pulseAnimation={businessInfoData?.whatsappFloat?.pulseAnimation}
              enabled={businessInfoData?.whatsappFloat?.enabled}
            />
            <BackToTop position="bottom-left" />

            {/* Cookie Consent Banner */}
            <CookieConsent
              enabled={cookieConsent?.enabled ?? true}
              message={cookieConsent?.message}
              position={cookieConsent?.position}
              variant={cookieConsent?.variant}
              acceptButtonText={cookieConsent?.acceptButtonText}
              showDeclineButton={cookieConsent?.showDeclineButton}
            />
          </ToastProvider>
          </EcommerceProviderWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
