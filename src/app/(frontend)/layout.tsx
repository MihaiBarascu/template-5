import type { Metadata } from 'next'
import React from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { unstable_cache } from 'next/cache'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/components/Toast'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AdminBar } from '@/components/AdminBar'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { BackToTop } from '@/components/BackToTop'
import { CookieConsent } from '@/components/CookieConsent'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { generateThemeStyles } from '@/utilities/generateThemeStyles'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Business Website',
    template: '%s | Business Website',
  },
  description: 'Site-ul tau de business profesional',
}

// Cached global fetchers with revalidation tags
const getSiteTheme = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'site-theme' })
  },
  ['site-theme'],
  { tags: ['site-theme'] }
)

const getHeader = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'header' })
  },
  ['header'],
  { tags: ['header'] }
)

const getFooter = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'footer' })
  },
  ['footer'],
  { tags: ['footer'] }
)

const getBusinessInfo = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'business-info' })
  },
  ['business-info'],
  { tags: ['business-info'] }
)

const getLogo = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({ slug: 'logo' })
  },
  ['logo'],
  { tags: ['logo'] }
)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [siteThemeData, headerData, footerData, businessInfoData, logoData] = await Promise.all([
    getSiteTheme(),
    getHeader(),
    getFooter(),
    getBusinessInfo(),
    getLogo(),
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
        {/* Google Fonts for theme typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Lato:wght@400;700&family=Lora:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider siteTheme={siteThemeData}>
          <ToastProvider>
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
            <main className="min-h-screen">{children}</main>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
