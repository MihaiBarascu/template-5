import type { TenantSiteTheme as SiteTheme } from '@/payload-types'
import { getCachedTenantGlobal } from './getTenantGlobal'

// Theme variant type with all the properties
export interface ThemeVariant {
  colors: {
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
  fonts: {
    heading: string
    body: string
  }
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
  shadows: 'none' | 'subtle' | 'moderate' | 'strong'
}

// 10 Universal Theme Variants
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
  // Fitness-specific themes (matching template-2 Transilvania Gym)
  'fitness-orange': {
    colors: {
      primary: '#E31937', // Red accent from template-2
      secondary: '#1a1a1a', // Dark background
      accent: '#E31937',
      dark: '#0d0d0d', // Very dark (almost black)
      light: '#f5f5f5',
      surface: '#ffffff',
      text: '#1a1a1a',
      textLight: '#666666',
      border: '#e5e5e5',
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    borderRadius: 'small',
    shadows: 'subtle',
  },
  'fitness-dark': {
    colors: {
      primary: '#E31937', // Red accent
      secondary: '#ffffff', // White for contrast on dark
      accent: '#ff3b3b', // Lighter red for hover
      dark: '#0d0d0d', // Main dark background
      light: '#1a1a1a', // Slightly lighter dark
      surface: '#242424', // Card backgrounds on dark
      text: '#ffffff', // White text on dark
      textLight: '#b3b3b3', // Gray text on dark
      border: '#333333', // Dark border
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    borderRadius: 'small',
    shadows: 'moderate',
  },
}

/**
 * Get site theme for the current tenant with caching and revalidation
 *
 * Usage in Server Components:
 * ```ts
 * const theme = await getSiteTheme()
 * // Use theme.variant, theme.colors, etc.
 * ```
 */
export async function getSiteTheme(): Promise<SiteTheme | null> {
  return getCachedTenantGlobal<SiteTheme>('site-theme')
}

/**
 * Get resolved theme variant (with all computed values)
 *
 * This returns the full theme variant with colors, fonts, etc.
 * based on the selected variant and any custom overrides.
 */
export async function getResolvedTheme(): Promise<ThemeVariant> {
  const siteTheme = await getSiteTheme()

  const variantKey = siteTheme?.variant || 'dark-gold'
  const baseVariant = THEME_VARIANTS[variantKey] || THEME_VARIANTS['dark-gold']

  // Apply custom colors if enabled
  const colors = siteTheme?.useCustomColors && siteTheme.colors
    ? {
        primary: siteTheme.colors.primary || baseVariant.colors.primary,
        secondary: siteTheme.colors.secondary || baseVariant.colors.secondary,
        accent: siteTheme.colors.accent || baseVariant.colors.accent,
        dark: siteTheme.colors.dark || baseVariant.colors.dark,
        light: siteTheme.colors.light || baseVariant.colors.light,
        surface: siteTheme.colors.surface || baseVariant.colors.surface,
        text: siteTheme.colors.text || baseVariant.colors.text,
        textLight: siteTheme.colors.textLight || baseVariant.colors.textLight,
        border: siteTheme.colors.border || baseVariant.colors.border,
      }
    : baseVariant.colors

  // Fonts are now configured via .env (NEXT_PUBLIC_HEADING_FONT, NEXT_PUBLIC_BODY_FONT)
  // and loaded via next/font at build time (self-hosted)
  const fonts = {
    heading: process.env.NEXT_PUBLIC_HEADING_FONT || baseVariant.fonts.heading,
    body: process.env.NEXT_PUBLIC_BODY_FONT || baseVariant.fonts.body,
  }

  // Apply style overrides
  const borderRadius = (siteTheme?.borderRadius || baseVariant.borderRadius) as ThemeVariant['borderRadius']
  const shadows = (siteTheme?.shadows || baseVariant.shadows) as ThemeVariant['shadows']

  return {
    colors,
    fonts,
    borderRadius,
    shadows,
  }
}

/**
 * Get theme variant info for display
 */
export function getThemeVariantInfo(variantKey: string): { name: string; description: string } {
  const variantNames: Record<string, { name: string; description: string }> = {
    'dark-gold': { name: 'Dark & Gold', description: 'Elegant, premium, sofisticat' },
    'modern-red': { name: 'Modern Red', description: 'Bold, energic, puternic' },
    'classic-blue': { name: 'Classic Blue', description: 'Profesional, de încredere' },
    'fresh-green': { name: 'Fresh Green', description: 'Natural, eco, sănătos' },
    'minimal-black': { name: 'Minimal Black', description: 'Clean, modern, minimalist' },
    'purple-premium': { name: 'Purple Premium', description: 'Luxos, sofisticat, premium' },
    'warm-orange': { name: 'Warm Orange', description: 'Prietenos, cald, primitor' },
    'teal-modern': { name: 'Teal Modern', description: 'Fresh, cool, inovator' },
    'brown-vintage': { name: 'Brown Vintage', description: 'Clasic, tradițional, autentic' },
    'pink-soft': { name: 'Pink Soft', description: 'Feminin, delicat, romantic' },
    'fitness-orange': { name: 'Fitness Orange', description: 'Energic, sport, dinamic' },
    'fitness-dark': { name: 'Fitness Dark', description: 'Dark cu accent roșu, stil gym modern' },
  }

  return variantNames[variantKey] || { name: 'Unknown', description: '' }
}

// Export the variants for use in other components
export { THEME_VARIANTS }

// Legacy export for backwards compatibility
export const getDesignVariant = getResolvedTheme
