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
  headingScalePresets,
  bodyTextSizePresets,
  cardGapPresets,
} from '@/theme/variants'
import {
  generatePalette,
  generateContrastColors,
  hexToOklchCss,
  oklchToHex,
} from '@/utilities/colors'

// Re-export for backward compatibility
export { THEME_VARIANTS }
export type { ThemeVariant, ThemeColors } from '@/theme/variants'

/**
 * Generates inline CSS styles for the theme to prevent FOUC
 * This runs server-side and injects CSS before hydration
 */
export function generateThemeStyles(siteTheme: SiteTheme | null): string {
  // Get the selected variant or default to dark-gold
  const variantKey = siteTheme?.variant || 'dark-gold'
  const variant = THEME_VARIANTS[variantKey] || THEME_VARIANTS['dark-gold']

  // Apply colors - auto-generate from primary, use custom if enabled, otherwise use variant
  let colors = variant.colors

  if (siteTheme?.useCustomColors && siteTheme.colors) {
    const primaryColor = siteTheme.colors.primary || variant.colors.primary

    // If auto-generate palette is enabled, generate all colors from primary
    if (siteTheme.autoGeneratePalette && primaryColor) {
      const generatedPalette = generatePalette(primaryColor)
      // generateContrastColors expects OklchColor objects, returns OklchColor objects
      const contrastColorsOklch = generateContrastColors({
        primary: generatedPalette.primary,
        secondary: generatedPalette.secondary,
        accent: generatedPalette.accent,
        dark: generatedPalette.dark,
        light: generatedPalette.light,
        surface: generatedPalette.surface,
      })

      colors = {
        primary: primaryColor, // Keep the original primary as HEX
        secondary: oklchToHex(generatedPalette.secondary),
        accent: oklchToHex(generatedPalette.accent),
        dark: oklchToHex(generatedPalette.dark),
        light: oklchToHex(generatedPalette.light),
        surface: oklchToHex(generatedPalette.surface),
        text: oklchToHex(generatedPalette.text),
        textLight: oklchToHex(generatedPalette.textLight),
        border: oklchToHex(generatedPalette.border),
        textOnPrimary: oklchToHex(contrastColorsOklch.textOnPrimary),
        textOnSecondary: oklchToHex(contrastColorsOklch.textOnSecondary),
        textOnAccent: oklchToHex(contrastColorsOklch.textOnAccent),
        textOnDark: oklchToHex(contrastColorsOklch.textOnDark),
        textOnLight: oklchToHex(contrastColorsOklch.textOnLight),
        textOnSurface: oklchToHex(contrastColorsOklch.textOnSurface),
      }
    } else {
      // Use manual custom colors
      colors = {
        primary: primaryColor,
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

  // Apply heading scale - affects H1-H6 sizes
  const headingScaleKey = siteTheme?.headingScale || 'normal'
  const headingScale = headingScalePresets[headingScaleKey as keyof typeof headingScalePresets] || headingScalePresets.normal

  // Apply body text size - affects paragraph and body text
  const bodyTextSizeKey = siteTheme?.bodyTextSize || 'normal'
  const bodyTextSize = bodyTextSizePresets[bodyTextSizeKey as keyof typeof bodyTextSizePresets] || bodyTextSizePresets.normal

  // Apply card gap - spacing between cards in grids
  const cardGapKey = siteTheme?.cardGap || 'normal'
  const cardGap = cardGapPresets[cardGapKey as keyof typeof cardGapPresets] || cardGapPresets.normal

  // Generate OKLCH values for colors (for advanced color manipulation in CSS)
  const toOklch = (hex: string): string => {
    try {
      return hexToOklchCss(hex)
    } catch {
      return hex // Fallback to hex if conversion fails
    }
  }

  // Base CSS variables
  const baseStyles = `
    :root {
      --theme-primary: ${colors.primary};
      --theme-secondary: ${colors.secondary};
      --theme-accent: ${colors.accent};
      --theme-dark: ${colors.dark};
      --theme-light: ${colors.light};
      --theme-surface: ${colors.surface};
      --theme-text: ${colors.text};
      --theme-text-light: ${colors.textLight};
      --theme-border: ${colors.border};
      --theme-text-on-primary: ${colors.textOnPrimary};
      --theme-text-on-secondary: ${colors.textOnSecondary};
      --theme-text-on-accent: ${colors.textOnAccent};
      --theme-text-on-dark: ${colors.textOnDark};
      --theme-text-on-light: ${colors.textOnLight};
      --theme-text-on-surface: ${colors.textOnSurface};
      --theme-primary-oklch: ${toOklch(colors.primary)};
      --theme-secondary-oklch: ${toOklch(colors.secondary)};
      --theme-accent-oklch: ${toOklch(colors.accent)};
      --radius-sm: ${radius.sm};
      --radius-md: ${radius.md};
      --radius-lg: ${radius.lg};
      --radius-xl: ${radius.xl};
      --radius-button: ${radius.button};
      --radius-card: ${radius.card};
      --radius-input: ${radius.input};
      --radius-container: ${radius.container};
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
      --font-size-h1: ${headingScale.h1};
      --font-size-h2: ${headingScale.h2};
      --font-size-h3: ${headingScale.h3};
      --font-size-h4: ${headingScale.h4};
      --font-size-h5: ${headingScale.h5};
      --font-size-h6: ${headingScale.h6};
      --font-size-body: ${bodyTextSize.body};
      --font-size-small: ${bodyTextSize.small};
      --font-size-h1-mobile: ${headingScale.h1Mobile};
      --font-size-h2-mobile: ${headingScale.h2Mobile};
      --font-size-h3-mobile: ${headingScale.h3Mobile};
      --font-size-h4-mobile: ${headingScale.h4Mobile};
      --spacing-card-gap: ${cardGap};
    }
    @media (max-width: 768px) {
      :root {
        --font-size-h1: ${headingScale.h1Mobile};
        --font-size-h2: ${headingScale.h2Mobile};
        --font-size-h3: ${headingScale.h3Mobile};
        --font-size-h4: ${headingScale.h4Mobile};
      }
    }
  `

  return baseStyles.trim()
}
