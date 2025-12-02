/**
 * Theme Presets Configuration
 * Single source of truth for all theme preset options.
 * Used by both Payload CMS globals and seed design variants.
 */

// Color Presets
export const COLOR_PRESETS = [
  { label: 'Modern (Negru/Alb)', value: 'modern' },
  { label: 'Classic (Navy/Auriu)', value: 'classic' },
  { label: 'Bold (Colorat)', value: 'bold' },
  { label: 'Elegant (Sofisticat)', value: 'elegant' },
  { label: 'Minimal (Simplu)', value: 'minimal' },
  { label: 'Custom', value: 'custom' },
] as const

export type ColorPreset = (typeof COLOR_PRESETS)[number]['value']

// Font Presets
export const FONT_PRESETS = [
  { label: 'Modern (Inter)', value: 'modern' },
  { label: 'Elegant (Playfair + Source Sans)', value: 'elegant' },
  { label: 'Bold (Montserrat + Open Sans)', value: 'bold' },
  { label: 'Minimalist (Geist)', value: 'minimalist' },
  { label: 'Classic (Georgia + Lora)', value: 'classic' },
] as const

export type FontPreset = (typeof FONT_PRESETS)[number]['value']

// Style Presets
export const STYLE_PRESETS = [
  { label: 'Modern & Minimal', value: 'modern' },
  { label: 'Classic & Elegant', value: 'classic' },
  { label: 'Bold & Vibrant', value: 'bold' },
  { label: 'Minimal', value: 'minimal' },
] as const

export type StylePreset = (typeof STYLE_PRESETS)[number]['value']

// Border Radius Options
export const BORDER_RADIUS_OPTIONS = [
  { label: 'Patrat (0)', value: 'none' },
  { label: 'Subtil (4px)', value: 'small' },
  { label: 'Mediu (8px)', value: 'medium' },
  { label: 'Mare (16px)', value: 'large' },
  { label: 'Rotunjit (50px)', value: 'full' },
] as const

export type BorderRadius = (typeof BORDER_RADIUS_OPTIONS)[number]['value']

// Shadow Options
export const SHADOW_OPTIONS = [
  { label: 'Fara umbre', value: 'none' },
  { label: 'Subtile', value: 'subtle' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Puternice', value: 'strong' },
] as const

export type ShadowOption = (typeof SHADOW_OPTIONS)[number]['value']

// Animation Options
export const ANIMATION_OPTIONS = [
  { label: 'Fara animatii', value: 'none' },
  { label: 'Subtile', value: 'subtle' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Dinamice', value: 'dynamic' },
] as const

export type AnimationOption = (typeof ANIMATION_OPTIONS)[number]['value']

// Container Width Options
export const CONTAINER_WIDTH_OPTIONS = [
  { label: '1024px (Compact)', value: '1024' },
  { label: '1280px (Standard)', value: '1280' },
  { label: '1400px (Wide)', value: '1400' },
  { label: '1600px (Extra Wide)', value: '1600' },
] as const

export type ContainerWidth = (typeof CONTAINER_WIDTH_OPTIONS)[number]['value']

// Section Spacing Options
export const SECTION_SPACING_OPTIONS = [
  { label: 'Compact', value: 'compact' },
  { label: 'Normal', value: 'normal' },
  { label: 'Spatios', value: 'spacious' },
] as const

export type SectionSpacing = (typeof SECTION_SPACING_OPTIONS)[number]['value']

// Heading Font Options
export const HEADING_FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Geist', value: 'Geist' },
  { label: 'Roboto', value: 'Roboto' },
] as const

// Body Font Options
export const BODY_FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Source Sans Pro', value: 'Source Sans Pro' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Geist', value: 'Geist' },
  { label: 'Poppins', value: 'Poppins' },
] as const

// Hero Types
export const HERO_TYPES = [
  { label: 'Fullscreen', value: 'fullscreen' },
  { label: 'Centered', value: 'centered' },
  { label: 'Split', value: 'split' },
  { label: 'Minimal', value: 'minimal' },
  { label: 'Video', value: 'video' },
] as const

export type HeroType = (typeof HERO_TYPES)[number]['value']

// Helper to extract just values for validation
export const getPresetValues = <T extends readonly { value: string }[]>(
  presets: T
): T[number]['value'][] => presets.map((p) => p.value)
