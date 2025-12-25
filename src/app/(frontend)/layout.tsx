import type { Metadata } from 'next'
import React from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { getAllFontVariables } from '@/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Business Website',
    template: '%s | Business Website',
  },
  description: 'Site-ul tau de business profesional',
}

/**
 * Root Layout - HTML Shell Only
 *
 * OFFICIAL PAYLOAD MULTI-TENANT PATTERN
 *
 * This layout contains ONLY the HTML structure and global fonts.
 * All tenant-specific content (providers, theme, footer, widgets)
 * is handled by [tenantDomain]/layout.tsx which receives tenant from params.
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Load ALL font CSS variables so any can be selected via theme
  const fontVariables = getAllFontVariables()

  return (
    <html lang="ro" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} ${fontVariables}`}>
      <head>
        {/* Fonts are self-hosted via next/font - no external requests needed */}
        {/* Theme styles are now generated in [tenantDomain]/layout.tsx */}
      </head>
      <body className="antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-theme-primary focus:text-white focus:rounded-[var(--radius-button)] focus:outline-none focus:ring-2 focus:ring-theme-accent"
        >
          Salt la continutul principal
        </a>
        {/* Tenant layout handles all tenant-specific content */}
        {children}
      </body>
    </html>
  )
}
