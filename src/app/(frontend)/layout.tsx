import type { Metadata } from 'next'
import React from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/components/Toast'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AdminBar } from '@/components/AdminBar'

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

  const [themeData, headerData, footerData, businessInfoData, logoData] = await Promise.all([
    payload.findGlobal({ slug: 'theme' }),
    payload.findGlobal({ slug: 'header' }),
    payload.findGlobal({ slug: 'footer' }),
    payload.findGlobal({ slug: 'business-info' }),
    payload.findGlobal({ slug: 'logo' }),
  ])

  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider theme={themeData}>
          <ToastProvider>
            <AdminBar />
            <Header data={headerData} logo={logoData} businessInfo={businessInfoData} />
            <main className="min-h-screen">{children}</main>
            <Footer data={footerData} businessInfo={businessInfoData} logo={logoData} />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
