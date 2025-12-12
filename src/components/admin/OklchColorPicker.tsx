'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useField } from '@payloadcms/ui'
import { hexToOklch, oklchToHex, type OklchColor } from '@/utilities/colors'

/**
 * OklchColorPicker - Advanced color picker with OKLCH sliders
 *
 * Features:
 * - Visual color preview
 * - OKLCH sliders (Lightness, Chroma, Hue)
 * - HEX input with live conversion
 * - Complementary color suggestions
 */

interface OklchColorPickerProps {
  path: string
  label?: string
  description?: string
}

export const OklchColorPicker: React.FC<OklchColorPickerProps> = ({ path, label, description }) => {
  const { value, setValue } = useField<string>({ path })

  // Parse current value to OKLCH
  const [oklch, setOklch] = useState<OklchColor>(() => {
    if (value && value.startsWith('#')) {
      try {
        return hexToOklch(value)
      } catch {
        return { l: 0.5, c: 0.1, h: 250 }
      }
    }
    return { l: 0.5, c: 0.1, h: 250 }
  })

  const [hexInput, setHexInput] = useState(value || '#000000')
  const [isExpanded, setIsExpanded] = useState(false)

  // Update OKLCH when value changes externally
  useEffect(() => {
    if (value && value.startsWith('#') && value !== hexInput) {
      try {
        setOklch(hexToOklch(value))
        setHexInput(value)
      } catch {
        // Invalid hex, ignore
      }
    }
  }, [value])

  // Update value when OKLCH changes
  const updateFromOklch = useCallback(
    (newOklch: OklchColor) => {
      setOklch(newOklch)
      try {
        const hex = oklchToHex(newOklch)
        setHexInput(hex)
        setValue(hex)
      } catch {
        // Conversion failed, keep current value
      }
    },
    [setValue],
  )

  // Handle HEX input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    setHexInput(newHex)

    // Validate and update if valid HEX
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      try {
        const newOklch = hexToOklch(newHex)
        setOklch(newOklch)
        setValue(newHex)
      } catch {
        // Invalid conversion, ignore
      }
    }
  }

  // Handle slider changes
  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFromOklch({ ...oklch, l: parseFloat(e.target.value) })
  }

  const handleChromaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFromOklch({ ...oklch, c: parseFloat(e.target.value) })
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFromOklch({ ...oklch, h: parseFloat(e.target.value) })
  }

  // Generate complementary color
  const getComplementaryHex = () => {
    const complementary: OklchColor = {
      ...oklch,
      h: (oklch.h + 180) % 360,
    }
    try {
      return oklchToHex(complementary)
    } catch {
      return '#888888'
    }
  }

  // Generate analogous colors
  const getAnalogousHexes = () => {
    const analogous1: OklchColor = { ...oklch, h: (oklch.h + 30) % 360 }
    const analogous2: OklchColor = { ...oklch, h: (oklch.h - 30 + 360) % 360 }
    try {
      return [oklchToHex(analogous1), oklchToHex(analogous2)]
    } catch {
      return ['#888888', '#888888']
    }
  }

  const complementaryHex = getComplementaryHex()
  const [analogous1, analogous2] = getAnalogousHexes()

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Label */}
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          {label}
        </label>
      )}

      {/* Main color input row */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Color preview box */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: value || '#000000',
            borderRadius: '6px',
            border: '2px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          title="Click to expand advanced options"
        />

        {/* HEX input */}
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontFamily: 'monospace',
            maxWidth: '120px',
          }}
        />

        {/* Native color picker */}
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => {
            const newHex = e.target.value
            setHexInput(newHex)
            try {
              setOklch(hexToOklch(newHex))
              setValue(newHex)
            } catch {
              // ignore
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            padding: '0',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        />

        {/* Expand/collapse button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            backgroundColor: isExpanded ? '#3b82f6' : '#f3f4f6',
            color: isExpanded ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isExpanded ? 'Ascunde' : 'OKLCH'}
        </button>
      </div>

      {/* Description */}
      {description && (
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{description}</p>
      )}

      {/* Expanded OKLCH controls */}
      {isExpanded && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* OKLCH values display */}
          <div
            style={{
              marginBottom: '16px',
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#6b7280',
            }}
          >
            oklch({(oklch.l * 100).toFixed(0)}% {oklch.c.toFixed(3)} {oklch.h.toFixed(0)})
          </div>

          {/* Lightness slider */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '12px',
              }}
            >
              <span style={{ color: '#374151', fontWeight: '500' }}>Lightness</span>
              <span style={{ color: '#6b7280' }}>{(oklch.l * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={oklch.l}
              onChange={handleLightnessChange}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right, #000000, ${oklchToHex({ ...oklch, l: 0.5 })}, #ffffff)`,
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Chroma slider */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '12px',
              }}
            >
              <span style={{ color: '#374151', fontWeight: '500' }}>Chroma (Saturation)</span>
              <span style={{ color: '#6b7280' }}>{oklch.c.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.005"
              value={oklch.c}
              onChange={handleChromaChange}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right, #888888, ${oklchToHex({ ...oklch, c: 0.2 })})`,
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Hue slider */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                fontSize: '12px',
              }}
            >
              <span style={{ color: '#374151', fontWeight: '500' }}>Hue</span>
              <span style={{ color: '#6b7280' }}>{oklch.h.toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={oklch.h}
              onChange={handleHueChange}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background:
                  'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Color suggestions */}
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}
            >
              Sugestii culori
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Complementary */}
              <div
                onClick={() => {
                  setHexInput(complementaryHex)
                  setOklch(hexToOklch(complementaryHex))
                  setValue(complementaryHex)
                }}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: complementaryHex,
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '2px',
                  }}
                />
                <span style={{ fontSize: '10px', color: '#6b7280' }}>Compl.</span>
              </div>

              {/* Analogous 1 */}
              <div
                onClick={() => {
                  setHexInput(analogous1)
                  setOklch(hexToOklch(analogous1))
                  setValue(analogous1)
                }}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: analogous1,
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '2px',
                  }}
                />
                <span style={{ fontSize: '10px', color: '#6b7280' }}>+30°</span>
              </div>

              {/* Analogous 2 */}
              <div
                onClick={() => {
                  setHexInput(analogous2)
                  setOklch(hexToOklch(analogous2))
                  setValue(analogous2)
                }}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: analogous2,
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '2px',
                  }}
                />
                <span style={{ fontSize: '10px', color: '#6b7280' }}>-30°</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OklchColorPicker
