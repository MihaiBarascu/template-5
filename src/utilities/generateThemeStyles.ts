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

  // Apply colors - use custom if enabled, otherwise use variant
  const colors =
    siteTheme?.useCustomColors && siteTheme.colors
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
      : variant.colors

  // Apply border radius - use override if set, otherwise use variant
  const borderRadiusKey = siteTheme?.borderRadius || variant.borderRadius
  const radius = radiusPresets[borderRadiusKey as keyof typeof radiusPresets] || radiusPresets.medium

  // Apply shadows - use override if set, otherwise use variant
  const shadowsKey = siteTheme?.shadows || variant.shadows
  const shadows = shadowPresets[shadowsKey as keyof typeof shadowPresets] || shadowPresets.subtle

  // Apply section spacing
  const spacingKey = siteTheme?.sectionSpacing || 'normal'
  const spacing = spacingPresets[spacingKey as keyof typeof spacingPresets] || spacingPresets.normal

  // Apply fonts - use custom if enabled, otherwise use variant
  const headingFont =
    siteTheme?.useCustomFonts && siteTheme.fonts?.headingFont
      ? siteTheme.fonts.headingFont
      : variant.fonts.heading
  const bodyFont =
    siteTheme?.useCustomFonts && siteTheme.fonts?.bodyFont
      ? siteTheme.fonts.bodyFont
      : variant.fonts.body

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
      --font-heading: '${headingFont}', sans-serif;
      --font-body: '${bodyFont}', sans-serif;
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
