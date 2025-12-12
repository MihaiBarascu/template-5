'use client'

import React, { useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'
import {
  hexToOklch,
  oklchToCss,
  generatePalette,
  generateContrastColors,
  type OklchColor,
} from '@/utilities/colors'

/**
 * ThemeLivePreview - Live preview component for theme customization
 *
 * Shows a mini website simulation with:
 * - Header with navigation
 * - Hero section
 * - Cards section
 * - Buttons in various states
 * - Color palette display
 */

// Theme variants data (simplified for preview)
const THEME_VARIANTS: Record<
  string,
  {
    colors: Record<string, string>
    fonts: { heading: string; body: string }
  }
> = {
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
    fonts: { heading: 'Playfair Display', body: 'Inter' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#f8fafc',
      textOnLight: '#0f172a',
      textOnSurface: '#0f172a',
    },
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#eff6ff',
      textOnLight: '#1e3a8a',
      textOnSurface: '#1e3a8a',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#14532d',
      textOnDark: '#f0fdf4',
      textOnLight: '#14532d',
      textOnSurface: '#14532d',
    },
    fonts: { heading: 'Poppins', body: 'Open Sans' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#ffffff',
      textOnDark: '#fafafa',
      textOnLight: '#171717',
      textOnSurface: '#171717',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#4c1d95',
      textOnDark: '#f5f3ff',
      textOnLight: '#4c1d95',
      textOnSurface: '#4c1d95',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#7c2d12',
      textOnDark: '#fff7ed',
      textOnLight: '#7c2d12',
      textOnSurface: '#7c2d12',
    },
    fonts: { heading: 'Poppins', body: 'Open Sans' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#134e4a',
      textOnDark: '#f0fdfa',
      textOnLight: '#134e4a',
      textOnSurface: '#134e4a',
    },
    fonts: { heading: 'Montserrat', body: 'Inter' },
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
      textOnPrimary: '#faf8f5',
      textOnSecondary: '#3d2914',
      textOnAccent: '#3d2914',
      textOnDark: '#faf8f5',
      textOnLight: '#3d2914',
      textOnSurface: '#3d2914',
    },
    fonts: { heading: 'Lora', body: 'Source Sans Pro' },
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
      textOnPrimary: '#ffffff',
      textOnSecondary: '#ffffff',
      textOnAccent: '#831843',
      textOnDark: '#fdf2f8',
      textOnLight: '#831843',
      textOnSurface: '#831843',
    },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
  },
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
    fonts: { heading: 'Work Sans', body: 'Work Sans' },
  },
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
  },
}

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
  textOnPrimary: string
  textOnSecondary: string
  textOnAccent: string
  textOnDark: string
  textOnLight: string
  textOnSurface: string
}

/**
 * Generate colors from primary using OKLCH (client-side version)
 */
function generateColorsFromPrimary(primaryHex: string): ThemeColors {
  try {
    const palette = generatePalette(primaryHex)
    const contrastColors = generateContrastColors(palette)

    return {
      primary: primaryHex,
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
  } catch {
    // Fallback to variant colors if generation fails
    return THEME_VARIANTS['dark-gold'].colors as ThemeColors
  }
}

export const ThemeLivePreview: React.FC = () => {
  // Get form field values
  const variant = useFormFields(([fields]) => fields.variant?.value as string) || 'dark-gold'
  const useCustomColors = useFormFields(([fields]) => fields.useCustomColors?.value as boolean)
  const autoGeneratePalette = useFormFields(
    ([fields]) => fields.autoGeneratePalette?.value as boolean,
  )

  // Custom colors from form
  const customPrimary = useFormFields(
    ([fields]) => (fields['colors.primary']?.value as string) || '',
  )
  const customSecondary = useFormFields(
    ([fields]) => (fields['colors.secondary']?.value as string) || '',
  )
  const customAccent = useFormFields(
    ([fields]) => (fields['colors.accent']?.value as string) || '',
  )
  const customDark = useFormFields(([fields]) => (fields['colors.dark']?.value as string) || '')
  const customLight = useFormFields(([fields]) => (fields['colors.light']?.value as string) || '')
  const customSurface = useFormFields(
    ([fields]) => (fields['colors.surface']?.value as string) || '',
  )
  const customText = useFormFields(([fields]) => (fields['colors.text']?.value as string) || '')
  const customTextLight = useFormFields(
    ([fields]) => (fields['colors.textLight']?.value as string) || '',
  )
  const customBorder = useFormFields(
    ([fields]) => (fields['colors.border']?.value as string) || '',
  )

  // Calculate final colors based on settings
  const colors = useMemo((): ThemeColors => {
    const variantData = THEME_VARIANTS[variant] || THEME_VARIANTS['dark-gold']

    if (useCustomColors && autoGeneratePalette && customPrimary) {
      // Auto-generate from primary
      return generateColorsFromPrimary(customPrimary)
    } else if (useCustomColors) {
      // Manual custom colors
      return {
        primary: customPrimary || variantData.colors.primary,
        secondary: customSecondary || variantData.colors.secondary,
        accent: customAccent || variantData.colors.accent,
        dark: customDark || variantData.colors.dark,
        light: customLight || variantData.colors.light,
        surface: customSurface || variantData.colors.surface,
        text: customText || variantData.colors.text,
        textLight: customTextLight || variantData.colors.textLight,
        border: customBorder || variantData.colors.border,
        textOnPrimary: variantData.colors.textOnPrimary,
        textOnSecondary: variantData.colors.textOnSecondary,
        textOnAccent: variantData.colors.textOnAccent,
        textOnDark: variantData.colors.textOnDark,
        textOnLight: variantData.colors.textOnLight,
        textOnSurface: variantData.colors.textOnSurface,
      }
    }

    // Use variant colors
    return variantData.colors as ThemeColors
  }, [
    variant,
    useCustomColors,
    autoGeneratePalette,
    customPrimary,
    customSecondary,
    customAccent,
    customDark,
    customLight,
    customSurface,
    customText,
    customTextLight,
    customBorder,
  ])

  const borderRadiusValue = '8px'

  return (
    <div
      style={{
        marginTop: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Preview Header */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Live Preview
          </span>
          {autoGeneratePalette && useCustomColors && (
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                borderRadius: '9999px',
              }}
            >
              Auto-generated
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}
          />
          <div
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}
          />
          <div
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}
          />
        </div>
      </div>

      {/* Mini Website Preview */}
      <div style={{ backgroundColor: colors.light }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: colors.dark,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ color: colors.textOnDark, fontWeight: '700', fontSize: '14px' }}>
            Brand Logo
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Acasa', 'Servicii', 'Contact'].map((item) => (
              <span
                key={item}
                style={{ color: colors.textOnDark, fontSize: '12px', opacity: 0.9 }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div
          style={{
            backgroundColor: colors.primary,
            padding: '32px 20px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: colors.textOnPrimary,
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            Titlu Principal
          </h2>
          <p
            style={{
              color: colors.textOnPrimary,
              fontSize: '12px',
              opacity: 0.9,
              marginBottom: '16px',
            }}
          >
            Descriere scurta a serviciilor oferite
          </p>
          <button
            style={{
              backgroundColor: colors.accent,
              color: colors.textOnAccent,
              padding: '8px 20px',
              border: 'none',
              borderRadius: borderRadiusValue,
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Call to Action
          </button>
        </div>

        {/* Cards Section */}
        <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: borderRadiusValue,
                border: `1px solid ${colors.border}`,
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: colors.light,
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              <div
                style={{
                  color: colors.text,
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                Card {i}
              </div>
              <div style={{ color: colors.textLight, fontSize: '10px' }}>
                Text descriptiv
              </div>
            </div>
          ))}
        </div>

        {/* Buttons Preview */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: colors.surface,
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={{
              backgroundColor: colors.primary,
              color: colors.textOnPrimary,
              padding: '6px 12px',
              border: 'none',
              borderRadius: borderRadiusValue,
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            Primary
          </button>
          <button
            style={{
              backgroundColor: colors.secondary,
              color: colors.textOnSecondary,
              padding: '6px 12px',
              border: 'none',
              borderRadius: borderRadiusValue,
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            Secondary
          </button>
          <button
            style={{
              backgroundColor: colors.accent,
              color: colors.textOnAccent,
              padding: '6px 12px',
              border: 'none',
              borderRadius: borderRadiusValue,
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            Accent
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              padding: '6px 12px',
              border: `1px solid ${colors.primary}`,
              borderRadius: borderRadiusValue,
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            Outline
          </button>
        </div>
      </div>

      {/* Color Palette Display */}
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px',
          }}
        >
          Paleta de Culori
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { name: 'Primary', color: colors.primary },
            { name: 'Secondary', color: colors.secondary },
            { name: 'Accent', color: colors.accent },
            { name: 'Dark', color: colors.dark },
            { name: 'Light', color: colors.light },
            { name: 'Surface', color: colors.surface },
            { name: 'Text', color: colors.text },
            { name: 'Border', color: colors.border },
          ].map(({ name, color }) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: color,
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  marginBottom: '4px',
                }}
                title={color}
              />
              <div style={{ fontSize: '9px', color: '#6b7280' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeLivePreview
