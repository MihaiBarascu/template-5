'use client'

import React, { createContext, useContext } from 'react'
import type { SiteTheme } from '@/payload-types'

interface ThemeContextType {
  siteTheme: SiteTheme | null
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * ThemeProvider - Provides theme context to child components
 *
 * Note: CSS variables are set server-side via generateThemeStyles() in layout.tsx
 * This provider only exposes theme data to components that need it via useTheme() hook.
 * No client-side CSS manipulation needed - server CSS handles everything.
 */
export function ThemeProvider({
  children,
  siteTheme,
}: {
  children: React.ReactNode
  siteTheme: SiteTheme | null
}) {
  return <ThemeContext.Provider value={{ siteTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Re-export for backward compatibility (import from @/theme/variants directly when possible)
export { THEME_VARIANTS, type ThemeVariant, type ThemeColors } from '@/theme/variants'
