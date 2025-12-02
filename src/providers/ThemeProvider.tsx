'use client'

import React, { createContext, useContext, useEffect } from 'react'
import type { Theme } from '@/payload-types'

interface ThemeContextType {
  theme: Theme | null
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Color presets
const colorPresets = {
  modern: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#c9a962',
    dark: '#1a1a1a',
    light: '#f5f5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    textLight: '#666666',
    border: '#e5e5e5',
  },
  classic: {
    primary: '#1e3a5f',
    secondary: '#2563eb',
    accent: '#b8860b',
    dark: '#0f172a',
    light: '#f1f5f9',
    surface: '#ffffff',
    text: '#1a1a1a',
    textLight: '#64748b',
    border: '#e2e8f0',
  },
  bold: {
    primary: '#dc2626',
    secondary: '#ef4444',
    accent: '#f59e0b',
    dark: '#18181b',
    light: '#fafafa',
    surface: '#ffffff',
    text: '#18181b',
    textLight: '#71717a',
    border: '#e4e4e7',
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
  theme,
}: {
  children: React.ReactNode
  theme: Theme | null
}) {
  useEffect(() => {
    if (!theme) return

    const root = document.documentElement

    // Apply color preset or custom colors
    const defaultColors = colorPresets.modern
    const presetColors = colorPresets[theme.preset as keyof typeof colorPresets]
    const colors = theme.preset === 'custom' && theme.colors
      ? {
          primary: theme.colors.primary || defaultColors.primary,
          secondary: theme.colors.secondary || defaultColors.secondary,
          accent: theme.colors.accent || defaultColors.accent,
          dark: theme.colors.dark || defaultColors.dark,
          light: theme.colors.light || defaultColors.light,
          surface: theme.colors.surface || defaultColors.surface,
          text: theme.colors.text || defaultColors.text,
          textLight: theme.colors.textLight || defaultColors.textLight,
          border: theme.colors.border || defaultColors.border,
        }
      : presetColors || defaultColors

    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-secondary', colors.secondary || colors.primary)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-dark', colors.dark)
    root.style.setProperty('--theme-light', colors.light)
    root.style.setProperty('--theme-surface', colors.surface)
    root.style.setProperty('--theme-text', colors.text)
    root.style.setProperty('--theme-text-light', colors.textLight || colors.text)
    root.style.setProperty('--theme-border', colors.border)

    // Apply border radius
    const radius = radiusPresets[theme.borderRadius as keyof typeof radiusPresets] || radiusPresets.medium
    root.style.setProperty('--radius-sm', radius.sm)
    root.style.setProperty('--radius-md', radius.md)
    root.style.setProperty('--radius-lg', radius.lg)
    root.style.setProperty('--radius-xl', radius.xl)
    root.style.setProperty('--radius-button', radius.button)
    root.style.setProperty('--radius-card', radius.card)
    root.style.setProperty('--radius-input', radius.input)

    // Apply shadows
    const shadows = shadowPresets[theme.shadows as keyof typeof shadowPresets] || shadowPresets.subtle
    root.style.setProperty('--shadow-sm', shadows.sm)
    root.style.setProperty('--shadow-md', shadows.md)
    root.style.setProperty('--shadow-lg', shadows.lg)
    root.style.setProperty('--shadow-card', shadows.card)
    root.style.setProperty('--shadow-card-hover', shadows.cardHover)

    // Apply section spacing
    const spacing = spacingPresets[theme.sectionSpacing as keyof typeof spacingPresets] || spacingPresets.normal
    root.style.setProperty('--spacing-section', spacing.section)
    root.style.setProperty('--spacing-section-mobile', spacing.sectionMobile)

    // Apply container width
    if (theme.containerWidth) {
      root.style.setProperty('--container-max', `${theme.containerWidth}px`)
    }

  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme }}>
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
