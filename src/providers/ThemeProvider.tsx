'use client'

import React, { createContext, useContext, useEffect } from 'react'
import type { SiteTheme } from '@/payload-types'

interface ThemeContextType {
  siteTheme: SiteTheme | null
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// =============================================================================
// 10 VARIANTE UNIVERSALE DE DESIGN
// =============================================================================

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  dark: string
  light: string
  surface: string
  text: string
  textLight: string
  border: string
}

interface ThemeVariant {
  colors: ThemeColors
  fonts: { heading: string; body: string }
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
  shadows: 'none' | 'subtle' | 'moderate' | 'strong'
}

const THEME_VARIANTS: Record<string, ThemeVariant> = {
  'dark-gold': {
    colors: {
      primary: '#1a1a1a',
      secondary: '#c9a227',
      accent: '#d4af37',
      dark: '#0d0d0d',
      light: '#f5f5f5',
      surface: '#ffffff',
      text: '#1a1a1a',
      textLight: '#666666',
      border: '#e5e5e5',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    borderRadius: 'small',
    shadows: 'moderate',
  },
  'modern-red': {
    colors: {
      primary: '#dc2626',
      secondary: '#1e3a5f',
      accent: '#ef4444',
      dark: '#1e293b',
      light: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textLight: '#64748b',
      border: '#e2e8f0',
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    borderRadius: 'medium',
    shadows: 'subtle',
  },
  'classic-blue': {
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      dark: '#1e3a8a',
      light: '#eff6ff',
      surface: '#ffffff',
      text: '#1e3a8a',
      textLight: '#64748b',
      border: '#bfdbfe',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    borderRadius: 'medium',
    shadows: 'subtle',
  },
  'fresh-green': {
    colors: {
      primary: '#16a34a',
      secondary: '#15803d',
      accent: '#22c55e',
      dark: '#14532d',
      light: '#f0fdf4',
      surface: '#ffffff',
      text: '#14532d',
      textLight: '#166534',
      border: '#bbf7d0',
    },
    fonts: { heading: 'Poppins', body: 'Open Sans' },
    borderRadius: 'large',
    shadows: 'subtle',
  },
  'minimal-black': {
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#171717',
      dark: '#000000',
      light: '#fafafa',
      surface: '#ffffff',
      text: '#171717',
      textLight: '#737373',
      border: '#e5e5e5',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    borderRadius: 'none',
    shadows: 'none',
  },
  'purple-premium': {
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a78bfa',
      dark: '#4c1d95',
      light: '#f5f3ff',
      surface: '#ffffff',
      text: '#4c1d95',
      textLight: '#7c3aed',
      border: '#ede9fe',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    borderRadius: 'medium',
    shadows: 'moderate',
  },
  'warm-orange': {
    colors: {
      primary: '#ea580c',
      secondary: '#9a3412',
      accent: '#fb923c',
      dark: '#7c2d12',
      light: '#fff7ed',
      surface: '#ffffff',
      text: '#7c2d12',
      textLight: '#c2410c',
      border: '#fed7aa',
    },
    fonts: { heading: 'Poppins', body: 'Open Sans' },
    borderRadius: 'medium',
    shadows: 'moderate',
  },
  'teal-modern': {
    colors: {
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#14b8a6',
      dark: '#134e4a',
      light: '#f0fdfa',
      surface: '#ffffff',
      text: '#134e4a',
      textLight: '#0f766e',
      border: '#ccfbf1',
    },
    fonts: { heading: 'Montserrat', body: 'Inter' },
    borderRadius: 'large',
    shadows: 'subtle',
  },
  'brown-vintage': {
    colors: {
      primary: '#8b4513',
      secondary: '#d4a574',
      accent: '#cd853f',
      dark: '#3d2914',
      light: '#faf8f5',
      surface: '#fffef9',
      text: '#3d2914',
      textLight: '#8b7355',
      border: '#e8e0d5',
    },
    fonts: { heading: 'Lora', body: 'Source Sans Pro' },
    borderRadius: 'none',
    shadows: 'none',
  },
  'pink-soft': {
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      dark: '#831843',
      light: '#fdf2f8',
      surface: '#ffffff',
      text: '#831843',
      textLight: '#be185d',
      border: '#fbcfe8',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    borderRadius: 'full',
    shadows: 'subtle',
  },
}

// Border radius presets
const radiusPresets = {
  none: { sm: '0', md: '0', lg: '0', xl: '0', button: '0', card: '0', input: '0' },
  small: { sm: '2px', md: '4px', lg: '6px', xl: '8px', button: '4px', card: '6px', input: '4px' },
  medium: { sm: '4px', md: '8px', lg: '12px', xl: '16px', button: '8px', card: '12px', input: '8px' },
  large: { sm: '8px', md: '16px', lg: '24px', xl: '32px', button: '16px', card: '20px', input: '12px' },
  full: { sm: '9999px', md: '9999px', lg: '9999px', xl: '9999px', button: '9999px', card: '24px', input: '12px' },
}

// Shadow presets
const shadowPresets = {
  none: { sm: 'none', md: 'none', lg: 'none', card: 'none', cardHover: 'none' },
  subtle: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 4px 8px rgba(0,0,0,0.08)',
    card: '0 1px 3px rgba(0,0,0,0.06)',
    cardHover: '0 4px 12px rgba(0,0,0,0.1)',
  },
  moderate: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.12)',
    card: '0 2px 6px rgba(0,0,0,0.08)',
    cardHover: '0 8px 20px rgba(0,0,0,0.14)',
  },
  strong: {
    sm: '0 2px 4px rgba(0,0,0,0.12)',
    md: '0 6px 12px rgba(0,0,0,0.15)',
    lg: '0 15px 25px rgba(0,0,0,0.18)',
    card: '0 4px 12px rgba(0,0,0,0.12)',
    cardHover: '0 12px 32px rgba(0,0,0,0.2)',
  },
}

// Section spacing presets
const spacingPresets = {
  compact: { section: '48px', sectionMobile: '32px' },
  normal: { section: '80px', sectionMobile: '48px' },
  spacious: { section: '120px', sectionMobile: '64px' },
}

export function ThemeProvider({
  children,
  siteTheme,
}: {
  children: React.ReactNode
  siteTheme: SiteTheme | null
}) {
  useEffect(() => {
    const root = document.documentElement

    // Get the selected variant or default to dark-gold
    const variantKey = siteTheme?.variant || 'dark-gold'
    const variant = THEME_VARIANTS[variantKey] || THEME_VARIANTS['dark-gold']

    // Apply colors - use custom if enabled, otherwise use variant
    const colors = siteTheme?.useCustomColors && siteTheme.colors
      ? {
          primary: siteTheme.colors.primary || variant.colors.primary,
          secondary: siteTheme.colors.secondary || variant.colors.secondary,
          accent: siteTheme.colors.accent || variant.colors.accent,
          dark: siteTheme.colors.dark || variant.colors.dark,
          light: siteTheme.colors.light || variant.colors.light,
          surface: siteTheme.colors.surface || variant.colors.surface,
          text: siteTheme.colors.text || variant.colors.text,
          textLight: siteTheme.colors.textLight || variant.colors.textLight,
          border: siteTheme.colors.border || variant.colors.border,
        }
      : variant.colors

    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-dark', colors.dark)
    root.style.setProperty('--theme-light', colors.light)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-light', colors.textLight)
    root.style.setProperty('--theme-border', colors.border)

    // Apply border radius - use override if set, otherwise use variant
    const borderRadiusKey = siteTheme?.borderRadius || variant.borderRadius
    const radius = radiusPresets[borderRadiusKey as keyof typeof radiusPresets] || radiusPresets.medium
    root.style.setProperty('--radius-sm', radius.sm)
    root.style.setProperty('--radius-md', radius.md)
    root.style.setProperty('--radius-lg', radius.lg)
    root.style.setProperty('--radius-xl', radius.xl)
    root.style.setProperty('--radius-button', radius.button)
    root.style.setProperty('--radius-card', radius.card)
    root.style.setProperty('--radius-input', radius.input)

    // Apply shadows - use override if set, otherwise use variant
    const shadowsKey = siteTheme?.shadows || variant.shadows
    const shadows = shadowPresets[shadowsKey as keyof typeof shadowPresets] || shadowPresets.subtle
    root.style.setProperty('--shadow-sm', shadows.sm)
    root.style.setProperty('--shadow-md', shadows.md)
    root.style.setProperty('--shadow-lg', shadows.lg)
    root.style.setProperty('--shadow-card', shadows.card)
    root.style.setProperty('--shadow-card-hover', shadows.cardHover)

    // Apply section spacing
    const spacingKey = siteTheme?.sectionSpacing || 'normal'
    const spacing = spacingPresets[spacingKey as keyof typeof spacingPresets] || spacingPresets.normal
    root.style.setProperty('--spacing-section', spacing.section)
    root.style.setProperty('--spacing-section-mobile', spacing.sectionMobile)

    // Apply container width
    if (siteTheme?.containerWidth) {
      root.style.setProperty('--container-max', `${siteTheme.containerWidth}px`)
    } else {
      root.style.setProperty('--container-max', '1280px')
    }

    // Apply fonts - use custom if enabled, otherwise use variant
    const headingFont = siteTheme?.useCustomFonts && siteTheme.fonts?.headingFont
      ? siteTheme.fonts.headingFont
      : variant.fonts.heading
    const bodyFont = siteTheme?.useCustomFonts && siteTheme.fonts?.bodyFont
      ? siteTheme.fonts.bodyFont
      : variant.fonts.body

    root.style.setProperty('--font-heading', headingFont)
    root.style.setProperty('--font-body', bodyFont)

  }, [siteTheme])

  return (
    <ThemeContext.Provider value={{ siteTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Export variant data for use in other components
export { THEME_VARIANTS }
export type { ThemeVariant, ThemeColors }
