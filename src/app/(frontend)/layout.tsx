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
        {/* Google Fonts for theme typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Google Fonts - All available fonts for theme customization
          Heading fonts: Inter, Montserrat, Poppins, Roboto, Oswald, Raleway, Nunito, Work Sans,
                        Playfair Display, Lora, Merriweather, Cormorant Garamond, Libre Baskerville,
                        DM Serif Display, Abril Fatface
          Body fonts: Inter, Open Sans, Roboto, Lato, Source Sans 3, Poppins, Nunito Sans,
                     Work Sans, DM Sans, Outfit, Lora, Merriweather, Source Serif 4, Crimson Text
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
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
