'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

/**
 * VariantPreviewField - Preview vizual pentru varianta selectata
 *
 * Afișează:
 * - Culorile principale
 * - Descrierea stilului
 * - Font preview
 */

// Definirea celor 10 variante universale
const THEME_VARIANTS = {
  'dark-gold': {
    name: 'Dark & Gold',
    description: 'Elegant, premium, sofisticat. Perfect pentru barbershop, restaurante fine dining, cabinete avocat.',
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
    name: 'Modern Red',
    description: 'Bold, energic, puternic. Ideal pentru service auto, restaurante, magazine.',
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
    name: 'Classic Blue',
    description: 'Profesional, de încredere, serios. Perfect pentru cabinete medicale, avocat, corporații.',
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
    name: 'Fresh Green',
    description: 'Natural, eco, sănătos. Ideal pentru magazine bio, restaurante vegane, clinici.',
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
    name: 'Minimal Black',
    description: 'Clean, modern, minimalist. Perfect pentru magazine fashion, studiouri creative.',
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
    name: 'Purple Premium',
    description: 'Luxos, sofisticat, premium. Ideal pentru saloane beauty, magazine de lux.',
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
    name: 'Warm Orange',
    description: 'Prietenos, cald, primitor. Perfect pentru restaurante, cafenele, magazine alimentare.',
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
    name: 'Teal Modern',
    description: 'Fresh, cool, inovator. Ideal pentru clinici dentare, spa, tech.',
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
    name: 'Brown Vintage',
    description: 'Clasic, tradițional, autentic. Perfect pentru barbershop vintage, restaurante tradiționale.',
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
    name: 'Pink Soft',
    description: 'Feminin, delicat, romantic. Ideal pentru saloane beauty, magazine pentru femei.',
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
  'fitness-orange': {
    name: 'Fitness Orange',
    description: 'Energic, sport, dinamic. Perfect pentru săli fitness, centre sportive, antrenori personali.',
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
    },
    fonts: { heading: 'Work Sans', body: 'Work Sans' },
    borderRadius: 'small',
    shadows: 'subtle',
  },
  'fitness-dark': {
    name: 'Fitness Dark',
    description: 'Dark cu accent roșu, stil gym modern. Ideal pentru săli hardcore, CrossFit, MMA.',
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
    },
    fonts: { heading: 'Montserrat', body: 'Inter' },
    borderRadius: 'small',
    shadows: 'none',
  },
}

export const VariantPreviewField: React.FC = () => {
  const variant = useFormFields(([fields]) => fields.variant?.value as string) || 'dark-gold'
  const variantData = THEME_VARIANTS[variant as keyof typeof THEME_VARIANTS] || THEME_VARIANTS['dark-gold']

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header cu preview */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
        {/* Color palette preview */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '60px',
                height: '50px',
                backgroundColor: variantData.colors.primary,
              }}
              title="Primary"
            />
            <div
              style={{
                width: '60px',
                height: '50px',
                backgroundColor: variantData.colors.secondary,
              }}
              title="Secondary"
            />
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '60px',
                height: '30px',
                backgroundColor: variantData.colors.accent,
              }}
              title="Accent"
            />
            <div
              style={{
                width: '60px',
                height: '30px',
                backgroundColor: variantData.colors.light,
                border: '1px solid #e5e5e5',
              }}
              title="Light"
            />
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
            }}
          >
            {variantData.name}
          </h3>
          <p
            style={{
              margin: '0 0 12px 0',
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            {variantData.description}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#9ca3af' }}>
            <span>
              <strong>Titluri:</strong> {variantData.fonts.heading}
            </span>
            <span>
              <strong>Text:</strong> {variantData.fonts.body}
            </span>
            <span>
              <strong>Colturi:</strong> {variantData.borderRadius}
            </span>
          </div>
        </div>
      </div>

      {/* Mini preview - button & card */}
      <div
        style={{
          padding: '16px',
          backgroundColor: variantData.colors.light,
          borderRadius: '8px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {/* Button preview */}
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: variantData.colors.primary,
            color: variantData.colors.primary === '#000000' || variantData.colors.dark === variantData.colors.primary
              ? '#ffffff'
              : variantData.colors.light,
            border: 'none',
            borderRadius: variantData.borderRadius === 'none' ? '0' : variantData.borderRadius === 'full' ? '50px' : '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Buton Primary
        </button>

        {/* Card preview */}
        <div
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: variantData.colors.surface,
            borderRadius: variantData.borderRadius === 'none' ? '0' : '8px',
            border: `1px solid ${variantData.colors.border}`,
            boxShadow: variantData.shadows === 'none' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontWeight: '600', color: variantData.colors.text, fontSize: '14px' }}>
            Preview Card
          </div>
          <div style={{ color: variantData.colors.textLight, fontSize: '13px' }}>
            Asa vor arata cardurile pe site
          </div>
        </div>

        {/* Accent element */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: variantData.colors.accent,
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          Accent
        </div>
      </div>
    </div>
  )
}

// Export pentru import-ul din Payload
export default VariantPreviewField
