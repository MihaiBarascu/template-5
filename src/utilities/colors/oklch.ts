// =============================================================================
// OKLCH Color Utilities
// =============================================================================
// OKLCH = Oklab Lightness, Chroma, Hue
// - L (Lightness): 0-1 (0 = black, 1 = white)
// - C (Chroma): 0-0.4+ (saturation, 0 = gray)
// - H (Hue): 0-360 (color wheel angle)
//
// Why OKLCH?
// - Perceptually uniform: 10% lightness change looks like 10% to human eye
// - Better for generating harmonious palettes
// - CSS native support: oklch(L C H)

export interface OklchColor {
  l: number // 0-1
  c: number // 0-0.4+
  h: number // 0-360
}

export interface RgbColor {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

// =============================================================================
// HEX ↔ RGB Conversion
// =============================================================================

export function hexToRgb(hex: string): RgbColor {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

export function rgbToHex(rgb: RgbColor): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

// =============================================================================
// RGB ↔ Linear RGB (gamma correction)
// =============================================================================

function srgbToLinear(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(1, v)) * 255)
}

// =============================================================================
// Linear RGB ↔ OKLab
// =============================================================================

function linearRgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ]
}

function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

// =============================================================================
// OKLab ↔ OKLCH
// =============================================================================

function oklabToOklch(L: number, a: number, b: number): OklchColor {
  const c = Math.sqrt(a * a + b * b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

function oklchToOklab(oklch: OklchColor): [number, number, number] {
  const hRad = (oklch.h * Math.PI) / 180
  return [oklch.l, oklch.c * Math.cos(hRad), oklch.c * Math.sin(hRad)]
}

// =============================================================================
// Main Conversion Functions
// =============================================================================

export function hexToOklch(hex: string): OklchColor {
  const rgb = hexToRgb(hex)
  const lr = srgbToLinear(rgb.r)
  const lg = srgbToLinear(rgb.g)
  const lb = srgbToLinear(rgb.b)
  const [L, a, b] = linearRgbToOklab(lr, lg, lb)
  return oklabToOklch(L, a, b)
}

export function oklchToHex(oklch: OklchColor): string {
  const [L, a, b] = oklchToOklab(oklch)
  const [lr, lg, lb] = oklabToLinearRgb(L, a, b)
  return rgbToHex({
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb),
  })
}

// =============================================================================
// CSS Output
// =============================================================================

export function oklchToCss(oklch: OklchColor): string {
  // Format: oklch(L% C H)
  // L is percentage (0-100%), C is absolute, H is degrees
  const l = (oklch.l * 100).toFixed(1)
  const c = oklch.c.toFixed(3)
  const h = oklch.h.toFixed(1)
  return `oklch(${l}% ${c} ${h})`
}

export function hexToOklchCss(hex: string): string {
  return oklchToCss(hexToOklch(hex))
}

// =============================================================================
// Color Manipulation Functions
// =============================================================================

/**
 * Adjust lightness of a color
 * @param oklch - Input color
 * @param amount - Amount to adjust (-1 to 1, negative = darker)
 */
export function adjustLightness(oklch: OklchColor, amount: number): OklchColor {
  return {
    ...oklch,
    l: Math.max(0, Math.min(1, oklch.l + amount)),
  }
}

/**
 * Adjust chroma (saturation) of a color
 * @param oklch - Input color
 * @param amount - Amount to adjust (negative = less saturated)
 */
export function adjustChroma(oklch: OklchColor, amount: number): OklchColor {
  return {
    ...oklch,
    c: Math.max(0, oklch.c + amount),
  }
}

/**
 * Rotate hue of a color
 * @param oklch - Input color
 * @param degrees - Degrees to rotate (can be negative)
 */
export function rotateHue(oklch: OklchColor, degrees: number): OklchColor {
  let newHue = (oklch.h + degrees) % 360
  if (newHue < 0) newHue += 360
  return {
    ...oklch,
    h: newHue,
  }
}

/**
 * Create a lighter variant of a color
 */
export function lighten(oklch: OklchColor, amount: number = 0.1): OklchColor {
  return adjustLightness(oklch, amount)
}

/**
 * Create a darker variant of a color
 */
export function darken(oklch: OklchColor, amount: number = 0.1): OklchColor {
  return adjustLightness(oklch, -amount)
}

/**
 * Desaturate a color (reduce chroma)
 */
export function desaturate(oklch: OklchColor, amount: number = 0.05): OklchColor {
  return adjustChroma(oklch, -amount)
}

/**
 * Saturate a color (increase chroma)
 */
export function saturate(oklch: OklchColor, amount: number = 0.05): OklchColor {
  return adjustChroma(oklch, amount)
}

// =============================================================================
// Contrast & Accessibility
// =============================================================================

/**
 * Calculate relative luminance for WCAG contrast
 */
export function getRelativeLuminance(oklch: OklchColor): number {
  // OKLCH lightness is perceptually uniform, good approximation
  return oklch.l
}

/**
 * Determine if text should be light or dark on a background
 * Returns true if light text is needed (dark background)
 */
export function needsLightText(backgroundOklch: OklchColor): boolean {
  // Threshold around 0.5-0.6 works well for OKLCH
  return backgroundOklch.l < 0.55
}

/**
 * Get optimal text color (black or white) for a background
 */
export function getContrastTextColor(backgroundHex: string): string {
  const oklch = hexToOklch(backgroundHex)
  return needsLightText(oklch) ? '#ffffff' : '#000000'
}

/**
 * Get optimal text color as OKLCH CSS
 */
export function getContrastTextColorOklch(backgroundHex: string): string {
  const oklch = hexToOklch(backgroundHex)
  if (needsLightText(oklch)) {
    return 'oklch(100% 0 0)' // white
  }
  return 'oklch(0% 0 0)' // black
}

// =============================================================================
// Palette Generation
// =============================================================================

/**
 * Generate a complete color palette from a single primary color
 */
export function generatePalette(primaryHex: string): {
  primary: OklchColor
  secondary: OklchColor
  accent: OklchColor
  dark: OklchColor
  light: OklchColor
  surface: OklchColor
  text: OklchColor
  textLight: OklchColor
  border: OklchColor
} {
  const primary = hexToOklch(primaryHex)

  // Secondary: complementary or analogous based on primary saturation
  const secondary: OklchColor = {
    l: Math.max(0.2, primary.l - 0.15),
    c: primary.c * 0.8,
    h: (primary.h + 30) % 360, // Analogous
  }

  // Accent: slightly lighter and more saturated
  const accent: OklchColor = {
    l: Math.min(0.85, primary.l + 0.1),
    c: Math.min(0.4, primary.c * 1.2),
    h: primary.h,
  }

  // Dark: very low lightness, minimal chroma
  const dark: OklchColor = {
    l: 0.15,
    c: primary.c * 0.3,
    h: primary.h,
  }

  // Light: very high lightness, very low chroma
  const light: OklchColor = {
    l: 0.97,
    c: primary.c * 0.1,
    h: primary.h,
  }

  // Surface: almost white with hint of primary
  const surface: OklchColor = {
    l: 0.99,
    c: primary.c * 0.02,
    h: primary.h,
  }

  // Text: dark with hint of primary
  const text: OklchColor = {
    l: 0.2,
    c: primary.c * 0.2,
    h: primary.h,
  }

  // Text light: medium gray with hint of primary
  const textLight: OklchColor = {
    l: 0.45,
    c: primary.c * 0.1,
    h: primary.h,
  }

  // Border: light gray with hint of primary
  const border: OklchColor = {
    l: 0.88,
    c: primary.c * 0.05,
    h: primary.h,
  }

  return {
    primary,
    secondary,
    accent,
    dark,
    light,
    surface,
    text,
    textLight,
    border,
  }
}

/**
 * Generate contrast text colors for all theme colors
 */
export function generateContrastColors(colors: {
  primary: OklchColor
  secondary: OklchColor
  accent: OklchColor
  dark: OklchColor
  light: OklchColor
  surface: OklchColor
}): {
  textOnPrimary: OklchColor
  textOnSecondary: OklchColor
  textOnAccent: OklchColor
  textOnDark: OklchColor
  textOnLight: OklchColor
  textOnSurface: OklchColor
} {
  const white: OklchColor = { l: 1, c: 0, h: 0 }
  const black: OklchColor = { l: 0, c: 0, h: 0 }
  const darkText: OklchColor = { l: 0.15, c: 0, h: 0 }

  return {
    textOnPrimary: needsLightText(colors.primary) ? white : darkText,
    textOnSecondary: needsLightText(colors.secondary) ? white : darkText,
    textOnAccent: needsLightText(colors.accent) ? white : darkText,
    textOnDark: white,
    textOnLight: darkText,
    textOnSurface: darkText,
  }
}
