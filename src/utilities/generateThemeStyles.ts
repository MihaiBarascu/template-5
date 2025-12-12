import type { SiteTheme } from '@/payload-types'
import {
  THEME_VARIANTS,
  radiusPresets,
  shadowPresets,
  spacingPresets,
  letterSpacingPresets,
  buttonPaddingPresets,
  buttonLetterSpacingPresets,
  animationPresets,
} from '@/theme/variants'
import {
  hexToOklchCss,
  generatePalette,
  generateContrastColors,
  oklchToCss,
  oklchToHex,
} from '@/utilities/colors'

// Re-export for backward compatibility
export { THEME_VARIANTS }
export type { ThemeVariant, ThemeColors } from '@/theme/variants'

/**
 * Convert a color to OKLCH CSS format
 * Handles both HEX colors and already-converted OKLCH strings
 */
function toOklch(color: string): string {
  // If already in oklch format, return as-is
  if (color.startsWith('oklch(')) {
    return color
  }
  // Convert HEX to OKLCH
  if (color.startsWith('#')) {
    return hexToOklchCss(color)
  }
  // Fallback: return original (for rgb, hsl, etc.)
  return color
}

/**
 * Generate a complete color palette from a primary color
 * Returns colors in HEX format for compatibility with existing system
 */
function generateColorsFromPrimary(primaryHex: string): {
  primary: string
  secondary: string
  accent: string
  dark: string
  light: string
  surface: string
  text: string
  textLight: string
  border: string
  textOnPrimary: string
  textOnSecondary: string
  textOnAccent: string
  textOnDark: string
  textOnLight: string
  textOnSurface: string
} {
  const palette = generatePalette(primaryHex)
  const contrastColors = generateContrastColors(palette)

  return {
    primary: oklchToCss(palette.primary),
    secondary: oklchToCss(palette.secondary),
    accent: oklchToCss(palette.accent),
    dark: oklchToCss(palette.dark),
    light: oklchToCss(palette.light),
    surface: oklchToCss(palette.surface),
    text: oklchToCss(palette.text),
    textLight: oklchToCss(palette.textLight),
    border: oklchToCss(palette.border),
    textOnPrimary: oklchToCss(contrastColors.textOnPrimary),
    textOnSecondary: oklchToCss(contrastColors.textOnSecondary),
    textOnAccent: oklchToCss(contrastColors.textOnAccent),
    textOnDark: oklchToCss(contrastColors.textOnDark),
    textOnLight: oklchToCss(contrastColors.textOnLight),
    textOnSurface: oklchToCss(contrastColors.textOnSurface),
  }
}

/**
 * Generates inline CSS styles for the theme to prevent FOUC
 * This runs server-side and injects CSS before hydration
 */
export function generateThemeStyles(siteTheme: SiteTheme | null): string {
  // Get the selected variant or default to dark-gold
  const variantKey = siteTheme?.variant || 'dark-gold'
  const variant = THEME_VARIANTS[variantKey] || THEME_VARIANTS['dark-gold']

  // Determine colors based on settings:
  // 1. If autoGeneratePalette is enabled, generate all colors from primary
  // 2. If useCustomColors is enabled (without auto-generate), use custom colors
  // 3. Otherwise, use variant colors
  let colors: {
    primary: string
    secondary: string
    accent: string
    dark: string
    light: string
    surface: string
    text: string
    textLight: string
    border: string
    textOnPrimary: string
    textOnSecondary: string
    textOnAccent: string
    textOnDark: string
    textOnLight: string
    textOnSurface: string
  }

  // Check if we should auto-generate palette from primary color
  const shouldAutoGenerate =
    siteTheme?.useCustomColors &&
    (siteTheme as Record<string, unknown>)?.autoGeneratePalette &&
    siteTheme.colors?.primary

  if (shouldAutoGenerate) {
    // Auto-generate entire palette from primary color using OKLCH
    colors = generateColorsFromPrimary(siteTheme.colors!.primary!)
  } else if (siteTheme?.useCustomColors && siteTheme.colors) {
    // Use manually specified custom colors
    colors = {
      primary: siteTheme.colors.primary || variant.colors.primary,
      secondary: siteTheme.colors.secondary || variant.colors.secondary,
      accent: siteTheme.colors.accent || variant.colors.accent,
      dark: siteTheme.colors.dark || variant.colors.dark,
      light: siteTheme.colors.light || variant.colors.light,
      surface: siteTheme.colors.surface || variant.colors.surface,
      text: siteTheme.colors.text || variant.colors.text,
      textLight: siteTheme.colors.textLight || variant.colors.textLight,
      border: siteTheme.colors.border || variant.colors.border,
      // Contrast colors - use custom if set, otherwise use variant defaults
      textOnPrimary:
        (siteTheme.colors as Record<string, string | undefined>).textOnPrimary ||
        variant.colors.textOnPrimary,
      textOnSecondary:
        (siteTheme.colors as Record<string, string | undefined>).textOnSecondary ||
        variant.colors.textOnSecondary,
      textOnAccent:
        (siteTheme.colors as Record<string, string | undefined>).textOnAccent ||
        variant.colors.textOnAccent,
      textOnDark:
        (siteTheme.colors as Record<string, string | undefined>).textOnDark ||
        variant.colors.textOnDark,
      textOnLight:
        (siteTheme.colors as Record<string, string | undefined>).textOnLight ||
        variant.colors.textOnLight,
      textOnSurface:
        (siteTheme.colors as Record<string, string | undefined>).textOnSurface ||
        variant.colors.textOnSurface,
    }
  } else {
    // Use variant colors (convert to OKLCH on output)
    colors = {
      primary: variant.colors.primary,
      secondary: variant.colors.secondary,
      accent: variant.colors.accent,
      dark: variant.colors.dark,
      light: variant.colors.light,
      surface: variant.colors.surface,
      text: variant.colors.text,
      textLight: variant.colors.textLight,
      border: variant.colors.border,
      textOnPrimary: variant.colors.textOnPrimary,
      textOnSecondary: variant.colors.textOnSecondary,
      textOnAccent: variant.colors.textOnAccent,
      textOnDark: variant.colors.textOnDark,
      textOnLight: variant.colors.textOnLight,
      textOnSurface: variant.colors.textOnSurface,
    }
  }

  // Apply border radius - use override if set, otherwise use variant
  const borderRadiusKey = siteTheme?.borderRadius || variant.borderRadius
  const radius = radiusPresets[borderRadiusKey as keyof typeof radiusPresets] || radiusPresets.medium

  // Apply shadows - use override if set, otherwise use variant
  const shadowsKey = siteTheme?.shadows || variant.shadows
  const shadows = shadowPresets[shadowsKey as keyof typeof shadowPresets] || shadowPresets.subtle

  // Apply section spacing
  const spacingKey = siteTheme?.sectionSpacing || 'normal'
  const spacing = spacingPresets[spacingKey as keyof typeof spacingPresets] || spacingPresets.normal

  // Fonts are now configured via .env and loaded via next/font (self-hosted)
  // Map font names to their CSS variable names
  const fontToCssVar: Record<string, string> = {
    'Inter': 'var(--font-inter)',
    'Playfair Display': 'var(--font-playfair-display)',
    'Playfair_Display': 'var(--font-playfair-display)',
    'Montserrat': 'var(--font-montserrat)',
    'Open Sans': 'var(--font-open-sans)',
    'Open_Sans': 'var(--font-open-sans)',
    'Poppins': 'var(--font-poppins)',
    'Lato': 'var(--font-lato)',
    'Lora': 'var(--font-lora)',
    'Source Sans Pro': 'var(--font-source-sans)',
    'Source_Sans_3': 'var(--font-source-sans)',
    'Work Sans': 'var(--font-work-sans)',
    'Work_Sans': 'var(--font-work-sans)',
  }

  // Font fallbacks based on font type (serif vs sans-serif)
  const serifFonts = ['Playfair Display', 'Playfair_Display', 'Lora']

  // Get fonts from admin settings, fallback to variant fonts, then defaults
  const headingFontName = siteTheme?.headingFont || variant.fonts.heading || 'Playfair_Display'
  const bodyFontName = siteTheme?.bodyFont || variant.fonts.body || 'Inter'

  const headingFont = fontToCssVar[headingFontName] || 'var(--font-inter)'
  const bodyFont = fontToCssVar[bodyFontName] || 'var(--font-inter)'

  const headingFallback = serifFonts.includes(headingFontName) ? 'serif' : 'sans-serif'
  const bodyFallback = serifFonts.includes(bodyFontName) ? 'serif' : 'sans-serif'

  // Container width
  const containerWidth = siteTheme?.containerWidth ? `${siteTheme.containerWidth}px` : '1280px'

  // Extract advanced typography settings
  const letterSpacing = siteTheme?.useAdvancedTypography
    ? letterSpacingPresets[siteTheme?.letterSpacing || 'normal'] || '0'
    : '0'
  const headingLineHeight = siteTheme?.useAdvancedTypography
    ? siteTheme?.headingLineHeight || '1.2'
    : '1.2'
  const bodyLineHeight = siteTheme?.useAdvancedTypography
    ? siteTheme?.bodyLineHeight || '1.6'
    : '1.6'

  // Extract button style settings
  const buttonPadding = siteTheme?.useCustomButtons
    ? buttonPaddingPresets[siteTheme?.buttonPadding || 'normal'] || buttonPaddingPresets.normal
    : buttonPaddingPresets.normal
  const buttonTextTransform = siteTheme?.useCustomButtons
    ? siteTheme?.buttonTextTransform || 'none'
    : 'none'
  const buttonFontWeight = siteTheme?.useCustomButtons
    ? siteTheme?.buttonFontWeight || '600'
    : '600'
  const buttonLetterSpacing = siteTheme?.useCustomButtons
    ? buttonLetterSpacingPresets[siteTheme?.buttonLetterSpacing || 'normal'] || '0'
    : '0'

  // Apply animations - use override if set, otherwise use moderate as default
  const animationsKey = siteTheme?.animations || 'moderate'
  const animations =
    animationPresets[animationsKey as keyof typeof animationPresets] || animationPresets.moderate

  // Derive play state from enabled flag (for decorative infinite animations)
  const animationPlayState = animations.enabled === '1' ? 'running' : 'paused'

  // Base CSS variables - all colors converted to OKLCH for perceptual uniformity
  const baseStyles = `
    :root {
      --theme-primary: ${toOklch(colors.primary)};
      --theme-secondary: ${toOklch(colors.secondary)};
      --theme-accent: ${toOklch(colors.accent)};
      --theme-dark: ${toOklch(colors.dark)};
      --theme-light: ${toOklch(colors.light)};
      --theme-surface: ${toOklch(colors.surface)};
      --theme-text: ${toOklch(colors.text)};
      --theme-text-light: ${toOklch(colors.textLight)};
      --theme-border: ${toOklch(colors.border)};
      --theme-text-on-primary: ${toOklch(colors.textOnPrimary)};
      --theme-text-on-secondary: ${toOklch(colors.textOnSecondary)};
      --theme-text-on-accent: ${toOklch(colors.textOnAccent)};
      --theme-text-on-dark: ${toOklch(colors.textOnDark)};
      --theme-text-on-light: ${toOklch(colors.textOnLight)};
      --theme-text-on-surface: ${toOklch(colors.textOnSurface)};
      --radius-sm: ${radius.sm};
      --radius-md: ${radius.md};
      --radius-lg: ${radius.lg};
      --radius-xl: ${radius.xl};
      --radius-button: ${radius.button};
      --radius-card: ${radius.card};
      --radius-input: ${radius.input};
      --shadow-sm: ${shadows.sm};
      --shadow-md: ${shadows.md};
      --shadow-lg: ${shadows.lg};
      --shadow-card: ${shadows.card};
      --shadow-card-hover: ${shadows.cardHover};
      --spacing-section: ${spacing.section};
      --spacing-section-mobile: ${spacing.sectionMobile};
      --container-max: ${containerWidth};
      --font-heading: ${headingFont}, ${headingFallback};
      --font-body: ${bodyFont}, ${bodyFallback};
      --letter-spacing: ${letterSpacing};
      --heading-line-height: ${headingLineHeight};
      --body-line-height: ${bodyLineHeight};
      --btn-padding-y: ${buttonPadding.y};
      --btn-padding-x: ${buttonPadding.x};
      --btn-text-transform: ${buttonTextTransform};
      --btn-font-weight: ${buttonFontWeight};
      --btn-letter-spacing: ${buttonLetterSpacing};
      --animation-duration: ${animations.duration};
      --animation-duration-fast: ${animations.durationFast};
      --animation-duration-slow: ${animations.durationSlow};
      --animation-timing: ${animations.timing};
      --animation-enabled: ${animations.enabled};
      --animation-play-state: ${animationPlayState};
    }
  `

  return baseStyles.trim()
}
