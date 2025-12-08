// =============================================================================
// SINGLE SOURCE OF TRUTH - Theme Variants
// =============================================================================
// This file contains all theme variant definitions.
// It is imported by both generateThemeStyles.ts (server) and ThemeProvider.tsx (client)
// to ensure consistency and prevent hydration mismatches.

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  dark: string
  light: string
  surface: string
  text: string
  textLight: string
  border: string
  // Contrast text colors - for text on colored backgrounds
  textOnPrimary: string
  textOnSecondary: string
  textOnAccent: string
  textOnDark: string
  textOnLight: string
  textOnSurface: string
}

export interface ThemeVariant {
  colors: ThemeColors
  fonts: { heading: string; body: string }
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
  shadows: 'none' | 'subtle' | 'moderate' | 'strong'
}

export const THEME_VARIANTS: Record<string, ThemeVariant> = {
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
      // Contrast colors
      textOnPrimary: '#c9a227', // Gold on black - elegant
      textOnSecondary: '#ffffff', // White on gold - more elegant
      textOnAccent: '#0d0d0d', // Black on gold
      textOnDark: '#f5f5f5', // Light on dark
      textOnLight: '#1a1a1a', // Dark on light
      textOnSurface: '#1a1a1a', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on red
      textOnSecondary: '#ffffff', // White on navy
      textOnAccent: '#ffffff', // White on red
      textOnDark: '#f8fafc', // Light on dark
      textOnLight: '#0f172a', // Dark on light
      textOnSurface: '#0f172a', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on blue
      textOnSecondary: '#ffffff', // White on dark blue
      textOnAccent: '#ffffff', // White on blue
      textOnDark: '#eff6ff', // Light blue on dark
      textOnLight: '#1e3a8a', // Dark blue on light
      textOnSurface: '#1e3a8a', // Dark blue on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on green
      textOnSecondary: '#ffffff', // White on dark green
      textOnAccent: '#14532d', // Dark on light green
      textOnDark: '#f0fdf4', // Light on dark
      textOnLight: '#14532d', // Dark on light
      textOnSurface: '#14532d', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on black
      textOnSecondary: '#ffffff', // White on gray
      textOnAccent: '#ffffff', // White on dark
      textOnDark: '#fafafa', // Light on dark
      textOnLight: '#171717', // Dark on light
      textOnSurface: '#171717', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on purple
      textOnSecondary: '#ffffff', // White on dark purple
      textOnAccent: '#4c1d95', // Dark purple on light purple
      textOnDark: '#f5f3ff', // Light on dark
      textOnLight: '#4c1d95', // Dark on light
      textOnSurface: '#4c1d95', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on orange
      textOnSecondary: '#ffffff', // White on dark brown
      textOnAccent: '#7c2d12', // Dark on light orange
      textOnDark: '#fff7ed', // Light on dark
      textOnLight: '#7c2d12', // Dark on light
      textOnSurface: '#7c2d12', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on teal
      textOnSecondary: '#ffffff', // White on dark teal
      textOnAccent: '#134e4a', // Dark on light teal
      textOnDark: '#f0fdfa', // Light on dark
      textOnLight: '#134e4a', // Dark on light
      textOnSurface: '#134e4a', // Dark on white
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
      // Contrast colors
      textOnPrimary: '#faf8f5', // Cream on brown
      textOnSecondary: '#3d2914', // Dark on tan
      textOnAccent: '#3d2914', // Dark on gold
      textOnDark: '#faf8f5', // Light on dark
      textOnLight: '#3d2914', // Dark on light
      textOnSurface: '#3d2914', // Dark on cream
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
      // Contrast colors
      textOnPrimary: '#ffffff', // White on pink
      textOnSecondary: '#ffffff', // White on dark pink
      textOnAccent: '#831843', // Dark on light pink
      textOnDark: '#fdf2f8', // Light on dark
      textOnLight: '#831843', // Dark on light
      textOnSurface: '#831843', // Dark on white
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    borderRadius: 'full',
    shadows: 'subtle',
  },
  // Fitness / Gym variant - based on Template-2
  'fitness-orange': {
    colors: {
      primary: '#f13a11',
      secondary: '#171819',
      accent: '#f97316',
      dark: '#171819',
      light: '#ffffff',
      surface: '#f9f9f9',
      text: '#171819',
      textLight: '#666262',
      border: '#e5e5e5',
      // Contrast colors
      textOnPrimary: '#ffffff', // White on orange
      textOnSecondary: '#ffffff', // White on black
      textOnAccent: '#ffffff', // White on orange
      textOnDark: '#ffffff', // White on dark
      textOnLight: '#171819', // Dark on white
      textOnSurface: '#171819', // Dark on light gray
    },
    fonts: { heading: 'Work Sans', body: 'Work Sans' },
    borderRadius: 'small',
    shadows: 'subtle',
  },
  // Fitness Dark - Dark theme with red accent
  'fitness-dark': {
    colors: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      dark: '#0f0f0f',
      light: '#1a1a1a',
      surface: '#141414',
      text: '#ffffff',
      textLight: '#a1a1aa',
      border: '#2d2d2d',
      // Contrast colors
      textOnPrimary: '#ffffff', // White on red
      textOnSecondary: '#ffffff', // White on dark red
      textOnAccent: '#0f0f0f', // Dark on light red
      textOnDark: '#ffffff', // White on dark
      textOnLight: '#ffffff', // White on dark (light is dark in this theme)
      textOnSurface: '#ffffff', // White on dark surface
    },
    fonts: { heading: 'Montserrat', body: 'Inter' },
    borderRadius: 'small',
    shadows: 'none',
  },
}

// Border radius presets
export const radiusPresets = {
  none: { sm: '0', md: '0', lg: '0', xl: '0', button: '0', card: '0', input: '0' },
  small: { sm: '2px', md: '4px', lg: '6px', xl: '8px', button: '4px', card: '6px', input: '4px' },
  medium: { sm: '4px', md: '8px', lg: '12px', xl: '16px', button: '8px', card: '12px', input: '8px' },
  large: { sm: '8px', md: '16px', lg: '24px', xl: '32px', button: '16px', card: '20px', input: '12px' },
  full: {
    sm: '9999px',
    md: '9999px',
    lg: '9999px',
    xl: '9999px',
    button: '9999px',
    card: '24px',
    input: '12px',
  },
}

// Shadow presets
export const shadowPresets = {
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
export const spacingPresets = {
  compact: { section: '48px', sectionMobile: '32px' },
  normal: { section: '80px', sectionMobile: '48px' },
  spacious: { section: '120px', sectionMobile: '64px' },
}

// Typography presets
export const letterSpacingPresets: Record<string, string> = {
  tight: '-0.5px',
  normal: '0',
  wide: '0.5px',
  wider: '1px',
}

// Button presets
export const buttonPaddingPresets: Record<string, { y: string; x: string }> = {
  compact: { y: '8px', x: '16px' },
  normal: { y: '12px', x: '24px' },
  large: { y: '16px', x: '32px' },
  xl: { y: '24px', x: '40px' },
}

export const buttonLetterSpacingPresets: Record<string, string> = {
  normal: '0',
  wide: '0.5px',
  wider: '1px',
  'extra-wide': '2px',
}
