'use client'

import React, { useRef, useState } from 'react'
import { useFormFields, useForm } from '@payloadcms/ui'

/**
 * ThemeExportImport - Export and Import theme configurations
 *
 * Features:
 * - Export current theme settings to JSON file
 * - Import theme settings from JSON file
 * - Validation on import
 */

interface ThemeConfig {
  variant?: string
  borderRadius?: string
  shadows?: string
  animations?: string
  containerWidth?: string
  sectionSpacing?: string
  useCustomColors?: boolean
  autoGeneratePalette?: boolean
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    dark?: string
    light?: string
    surface?: string
    text?: string
    textLight?: string
    border?: string
    textOnPrimary?: string
    textOnSecondary?: string
    textOnAccent?: string
    textOnDark?: string
    textOnLight?: string
    textOnSurface?: string
  }
  headingFont?: string
  bodyFont?: string
  useAdvancedTypography?: boolean
  letterSpacing?: string
  headingLineHeight?: string
  bodyLineHeight?: string
  useCustomButtons?: boolean
  buttonPadding?: string
  buttonTextTransform?: string
  buttonFontWeight?: string
  buttonLetterSpacing?: string
}

// List of fields to export
const EXPORTABLE_FIELDS = [
  'variant',
  'borderRadius',
  'shadows',
  'animations',
  'containerWidth',
  'sectionSpacing',
  'useCustomColors',
  'autoGeneratePalette',
  'colors.primary',
  'colors.secondary',
  'colors.accent',
  'colors.dark',
  'colors.light',
  'colors.surface',
  'colors.text',
  'colors.textLight',
  'colors.border',
  'colors.textOnPrimary',
  'colors.textOnSecondary',
  'colors.textOnAccent',
  'colors.textOnDark',
  'colors.textOnLight',
  'colors.textOnSurface',
  'headingFont',
  'bodyFont',
  'useAdvancedTypography',
  'letterSpacing',
  'headingLineHeight',
  'bodyLineHeight',
  'useCustomButtons',
  'buttonPadding',
  'buttonTextTransform',
  'buttonFontWeight',
  'buttonLetterSpacing',
]

export const ThemeExportImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const { dispatchFields } = useForm()

  // Get all field values for export
  const fieldValues = useFormFields(([fields]) => {
    const values: Record<string, unknown> = {}
    EXPORTABLE_FIELDS.forEach((fieldPath) => {
      if (fields[fieldPath]) {
        values[fieldPath] = fields[fieldPath].value
      }
    })
    return values
  })

  // Export theme to JSON file
  const handleExport = () => {
    // Build nested object from flat field paths
    const themeConfig: ThemeConfig = {}

    Object.entries(fieldValues).forEach(([path, value]) => {
      if (value === undefined || value === null || value === '') return

      if (path.startsWith('colors.')) {
        const colorKey = path.replace('colors.', '')
        if (!themeConfig.colors) themeConfig.colors = {}
        ;(themeConfig.colors as Record<string, string>)[colorKey] = value as string
      } else {
        ;(themeConfig as Record<string, unknown>)[path] = value
      }
    })

    // Create and download file
    const blob = new Blob([JSON.stringify(themeConfig, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `theme-config-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setImportStatus({ type: 'success', message: 'Tema exportata cu succes!' })
    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000)
  }

  // Import theme from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const themeConfig: ThemeConfig = JSON.parse(content)

        // Validate structure
        if (typeof themeConfig !== 'object') {
          throw new Error('Fisier invalid - trebuie sa fie un obiect JSON')
        }

        // Apply values to form fields
        Object.entries(themeConfig).forEach(([key, value]) => {
          if (key === 'colors' && typeof value === 'object' && value !== null) {
            // Handle nested colors object
            Object.entries(value).forEach(([colorKey, colorValue]) => {
              if (typeof colorValue === 'string') {
                dispatchFields({
                  type: 'UPDATE',
                  path: `colors.${colorKey}`,
                  value: colorValue,
                })
              }
            })
          } else if (EXPORTABLE_FIELDS.includes(key)) {
            // Handle top-level fields
            dispatchFields({
              type: 'UPDATE',
              path: key,
              value: value,
            })
          }
        })

        setImportStatus({ type: 'success', message: 'Tema importata cu succes! Nu uita sa salvezi.' })
        setTimeout(() => setImportStatus({ type: null, message: '' }), 5000)
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: `Eroare la import: ${err instanceof Error ? err.message : 'Fisier invalid'}`,
        })
        setTimeout(() => setImportStatus({ type: null, message: '' }), 5000)
      }
    }

    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Eroare la citirea fisierului' })
      setTimeout(() => setImportStatus({ type: null, message: '' }), 5000)
    }

    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      style={{
        marginTop: '24px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
      }}
    >
      <h4
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
        }}
      >
        Export / Import Tema
      </h4>

      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '13px',
          color: '#6b7280',
        }}
      >
        Exporta configuratia temei curente sau importa o tema salvata anterior.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {/* Export Button */}
        <button
          type="button"
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export JSON
        </button>

        {/* Import Button */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#ffffff',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.borderColor = '#9ca3af'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Import JSON
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Status message */}
      {importStatus.type && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            backgroundColor: importStatus.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: importStatus.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${importStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {importStatus.message}
        </div>
      )}
    </div>
  )
}

export default ThemeExportImport
