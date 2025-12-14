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
  // =============================================================================
  // 1. DARK & GOLD - Barbershop, Salon premium, Bijuterii, Avocatura
  // Elegant, luxos, masculin
  // =============================================================================
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
      textOnPrimary: '#c9a227',
      textOnSecondary: '#ffffff',
      textOnAccent: '#0d0d0d',
      textOnDark: '#f5f5f5',
      textOnLight: '#1a1a1a',
      textOnSurface: '#1a1a1a',
    },
    fonts: { heading: 'Playfair_Display', body: 'Inter' },
    borderRadius: 'small',
    shadows: 'moderate',
  },
  // =============================================================================
  // 2. MODERN RED - Restaurant, Fast-food, Auto service, Sport
  // Bold, energic, puternic
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#f8fafc',
      textOnLight: '#0f172a',
      textOnSurface: '#0f172a',
    },
    fonts: { heading: 'Montserrat', body: 'Open_Sans' },
    borderRadius: 'medium',
    shadows: 'subtle',
  },
  // =============================================================================
  // 3. CLASSIC BLUE - Corporate, Consulting, IT, Finante, Medical
  // Profesional, de incredere, serios
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#eff6ff',
      textOnLight: '#1e3a8a',
      textOnSurface: '#1e3a8a',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    borderRadius: 'medium',
    shadows: 'subtle',
  },
  // =============================================================================
  // 4. FRESH GREEN - Eco, Bio, Nutritie, Farmacie, Wellness
  // Natural, sanatos, fresh
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#14532d',
      textOnDark: '#f0fdf4',
      textOnLight: '#14532d',
      textOnSurface: '#14532d',
    },
    fonts: { heading: 'Poppins', body: 'Open_Sans' },
    borderRadius: 'large',
    shadows: 'subtle',
  },
  // =============================================================================
  // 5. MINIMAL BLACK - Arhitectura, Design, Fotografie, Agentie creativa
  // Clean, modern, minimalist
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#fafafa',
      textOnLight: '#171717',
      textOnSurface: '#171717',
    },
    fonts: { heading: 'Work_Sans', body: 'Inter' },
    borderRadius: 'none',
    shadows: 'none',
  },
  // =============================================================================
  // 6. PURPLE PREMIUM - Spa, Salon beauty, Coaching, Evenimente
  // Luxos, sofisticat, premium
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#4c1d95',
      textOnDark: '#f5f3ff',
      textOnLight: '#4c1d95',
      textOnSurface: '#4c1d95',
    },
    fonts: { heading: 'Playfair_Display', body: 'Lato' },
    borderRadius: 'medium',
    shadows: 'moderate',
  },
  // =============================================================================
  // 7. WARM ORANGE - Cafenea, Brutarie, Restaurant casual, HoReCa
  // Prietenos, cald, primitor
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#7c2d12',
      textOnDark: '#fff7ed',
      textOnLight: '#7c2d12',
      textOnSurface: '#7c2d12',
    },
    fonts: { heading: 'Poppins', body: 'Open_Sans' },
    borderRadius: 'medium',
    shadows: 'moderate',
  },
  // =============================================================================
  // 8. TEAL MODERN - Tech startup, SaaS, App, Clinica moderna
  // Fresh, cool, inovator
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#134e4a',
      textOnDark: '#f0fdfa',
      textOnLight: '#134e4a',
      textOnSurface: '#134e4a',
    },
    fonts: { heading: 'Montserrat', body: 'Inter' },
    borderRadius: 'large',
    shadows: 'subtle',
  },
  // =============================================================================
  // 9. BROWN VINTAGE - Anticariat, Vinarie, Cafenea traditionala, Pub
  // Clasic, traditional, autentic
  // =============================================================================
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
      textOnPrimary: '#faf8f5',
      textOnSecondary: '#3d2914',
      textOnAccent: '#3d2914',
      textOnDark: '#faf8f5',
      textOnLight: '#3d2914',
      textOnSurface: '#3d2914',
    },
    fonts: { heading: 'Lora', body: 'Source_Sans_3' },
    borderRadius: 'none',
    shadows: 'none',
  },
  // =============================================================================
  // 10. PINK SOFT - Salon infrumusetare, Florarie, Patiserie, Copii
  // Feminin, delicat, romantic
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#831843',
      textOnDark: '#fdf2f8',
      textOnLight: '#831843',
      textOnSurface: '#831843',
    },
    fonts: { heading: 'Playfair_Display', body: 'Lato' },
    borderRadius: 'full',
    shadows: 'subtle',
  },
  // =============================================================================
  // 11. FITNESS ORANGE - Sala fitness, CrossFit, Sport, Personal trainer
  // Energic, sport, dinamic
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#ffffff',
      textOnLight: '#171819',
      textOnSurface: '#171819',
    },
    fonts: { heading: 'Montserrat', body: 'Work_Sans' },
    borderRadius: 'small',
    shadows: 'subtle',
  },
  // =============================================================================
  // 12. FITNESS DARK - Gym hardcore, MMA, Bodybuilding
  // Dark cu accent rosu, stil gym modern
  // =============================================================================
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#0f0f0f',
      textOnDark: '#ffffff',
      textOnLight: '#ffffff',
      textOnSurface: '#ffffff',
    },
    fonts: { heading: 'Montserrat', body: 'Inter' },
    borderRadius: 'small',
    shadows: 'none',
  },
}

// Border radius presets
// container = pentru containere mari (formulare, hărți, secțiuni) - limitat pentru a evita ovaluri
export const radiusPresets = {
  none: { sm: '0', md: '0', lg: '0', xl: '0', button: '0', card: '0', input: '0', container: '0' },
  small: { sm: '2px', md: '4px', lg: '6px', xl: '8px', button: '4px', card: '6px', input: '4px', container: '8px' },
  medium: { sm: '4px', md: '8px', lg: '12px', xl: '16px', button: '8px', card: '12px', input: '8px', container: '16px' },
  large: { sm: '8px', md: '16px', lg: '24px', xl: '32px', button: '16px', card: '20px', input: '12px', container: '24px' },
  full: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    button: '9999px',  // Pill buttons
    card: '24px',
    input: '12px',
    container: '24px',
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

// Heading scale presets (separate from body text)
// Reference: Tailwind text-4xl=2.25rem, text-5xl=3rem, text-6xl=3.75rem, text-7xl=4.5rem
export const headingScalePresets = {
  small: {
    h1: '2.5rem',     // 40px - minimal, pentru site-uri text-heavy
    h2: '2rem',       // 32px
    h3: '1.5rem',     // 24px
    h4: '1.25rem',    // 20px
    h5: '1.125rem',   // 18px
    h6: '1rem',       // 16px
    // Mobile sizes
    h1Mobile: '1.875rem',  // 30px
    h2Mobile: '1.5rem',    // 24px
    h3Mobile: '1.25rem',   // 20px
    h4Mobile: '1.125rem',  // 18px
  },
  compact: {
    h1: '3rem',       // 48px (text-5xl)
    h2: '2.25rem',    // 36px (text-4xl)
    h3: '1.875rem',   // 30px (text-3xl)
    h4: '1.5rem',     // 24px
    h5: '1.25rem',    // 20px
    h6: '1rem',       // 16px
    // Mobile sizes
    h1Mobile: '2.25rem',   // 36px
    h2Mobile: '1.875rem',  // 30px
    h3Mobile: '1.5rem',    // 24px
    h4Mobile: '1.25rem',   // 20px
  },
  normal: {
    h1: '3.75rem',    // 60px (text-6xl) - echilibrat
    h2: '2.5rem',     // 40px
    h3: '2rem',       // 32px
    h4: '1.625rem',   // 26px
    h5: '1.375rem',   // 22px
    h6: '1.125rem',   // 18px
    // Mobile sizes
    h1Mobile: '2.25rem',   // 36px
    h2Mobile: '1.875rem',  // 30px
    h3Mobile: '1.5rem',    // 24px
    h4Mobile: '1.25rem',   // 20px
  },
  large: {
    h1: '4.5rem',     // 72px (text-7xl) - ce era înainte default
    h2: '3rem',       // 48px (text-5xl)
    h3: '2.25rem',    // 36px (text-4xl)
    h4: '1.875rem',   // 30px
    h5: '1.5rem',     // 24px
    h6: '1.25rem',    // 20px
    // Mobile sizes
    h1Mobile: '2.5rem',    // 40px
    h2Mobile: '2rem',      // 32px
    h3Mobile: '1.75rem',   // 28px
    h4Mobile: '1.375rem',  // 22px
  },
  xlarge: {
    h1: '5.5rem',     // 88px - pentru hero-uri impactante
    h2: '3.5rem',     // 56px
    h3: '2.75rem',    // 44px
    h4: '2rem',       // 32px
    h5: '1.625rem',   // 26px
    h6: '1.375rem',   // 22px
    // Mobile sizes
    h1Mobile: '3rem',      // 48px
    h2Mobile: '2.25rem',   // 36px
    h3Mobile: '1.875rem',  // 30px
    h4Mobile: '1.5rem',    // 24px
  },
}

// Body text size presets (separate from headings)
export const bodyTextSizePresets = {
  small: {
    body: '0.875rem',   // 14px
    small: '0.75rem',   // 12px
  },
  normal: {
    body: '1rem',       // 16px
    small: '0.875rem',  // 14px
  },
  large: {
    body: '1.125rem',   // 18px
    small: '1rem',      // 16px
  },
}

// Card gap presets
export const cardGapPresets = {
  compact: '16px',
  normal: '24px',
  spacious: '32px',
}

// Animation presets
export interface AnimationPreset {
  duration: string
  durationFast: string
  durationSlow: string
  timing: string
  enabled: '1' | '0' // CSS doesn't support booleans, use string for calc()
}

export const animationPresets: Record<string, AnimationPreset> = {
  none: {
    duration: '0ms',
    durationFast: '0ms',
    durationSlow: '0ms',
    timing: 'linear',
    enabled: '0',
  },
  subtle: {
    duration: '200ms',
    durationFast: '100ms',
    durationSlow: '300ms',
    timing: 'ease-out',
    enabled: '1',
  },
  moderate: {
    duration: '300ms',
    durationFast: '150ms',
    durationSlow: '500ms',
    timing: 'ease-in-out',
    enabled: '1',
  },
  dynamic: {
    duration: '400ms',
    durationFast: '200ms',
    durationSlow: '700ms',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: '1',
  },
}
