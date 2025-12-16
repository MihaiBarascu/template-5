/**
 * Unit Tests for OKLCH Color Utilities
 */

import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  rgbToHex,
  hexToOklch,
  oklchToHex,
  oklchToCss,
  hexToOklchCss,
  adjustLightness,
  adjustChroma,
  rotateHue,
  lighten,
  darken,
  needsLightText,
  getContrastTextColor,
  generatePalette,
  type OklchColor,
} from '@/utilities/colors/oklch'

describe('OKLCH Color Utilities', () => {
  // ============================================
  // HEX ↔ RGB Conversion
  // ============================================
  describe('hexToRgb', () => {
    it('converts black', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('converts white', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('converts red', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('converts green', () => {
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    })

    it('converts blue', () => {
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('handles hex without #', () => {
      expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe('rgbToHex', () => {
    it('converts black', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
    })

    it('converts white', () => {
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
    })

    it('converts colors', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
    })

    it('clamps out of range values', () => {
      expect(rgbToHex({ r: 300, g: -50, b: 128 })).toBe('#ff0080')
    })
  })

  // ============================================
  // HEX ↔ OKLCH Conversion
  // ============================================
  describe('hexToOklch', () => {
    it('converts black to low lightness', () => {
      const result = hexToOklch('#000000')
      expect(result.l).toBeCloseTo(0, 1)
    })

    it('converts white to high lightness', () => {
      const result = hexToOklch('#ffffff')
      expect(result.l).toBeCloseTo(1, 1)
    })

    it('converts gray to low chroma', () => {
      const result = hexToOklch('#808080')
      expect(result.c).toBeLessThan(0.01)
    })

    it('converts saturated colors to high chroma', () => {
      const result = hexToOklch('#ff0000')
      expect(result.c).toBeGreaterThan(0.1)
    })
  })

  describe('oklchToHex', () => {
    it('round-trips black', () => {
      const oklch = hexToOklch('#000000')
      const hex = oklchToHex(oklch)
      expect(hex).toBe('#000000')
    })

    it('round-trips white', () => {
      const oklch = hexToOklch('#ffffff')
      const hex = oklchToHex(oklch)
      expect(hex).toBe('#ffffff')
    })

    it('approximately round-trips colors', () => {
      const original = '#3366cc'
      const oklch = hexToOklch(original)
      const result = oklchToHex(oklch)

      // Allow small differences due to color space conversion
      const origRgb = hexToRgb(original)
      const resultRgb = hexToRgb(result)

      expect(Math.abs(origRgb.r - resultRgb.r)).toBeLessThan(5)
      expect(Math.abs(origRgb.g - resultRgb.g)).toBeLessThan(5)
      expect(Math.abs(origRgb.b - resultRgb.b)).toBeLessThan(5)
    })
  })

  // ============================================
  // CSS Output
  // ============================================
  describe('oklchToCss', () => {
    it('formats OKLCH color as CSS', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.15, h: 180 }
      const css = oklchToCss(oklch)

      expect(css).toMatch(/oklch\(\d+\.\d+% 0\.\d+ \d+\.\d+\)/)
    })

    it('handles zero values', () => {
      const oklch: OklchColor = { l: 0, c: 0, h: 0 }
      const css = oklchToCss(oklch)

      expect(css).toBe('oklch(0.0% 0.000 0.0)')
    })
  })

  describe('hexToOklchCss', () => {
    it('converts hex to CSS oklch', () => {
      const css = hexToOklchCss('#ff0000')
      expect(css).toMatch(/^oklch\(/)
    })
  })

  // ============================================
  // Color Manipulation
  // ============================================
  describe('adjustLightness', () => {
    it('increases lightness', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = adjustLightness(oklch, 0.2)

      expect(result.l).toBe(0.7)
      expect(result.c).toBe(0.1) // unchanged
      expect(result.h).toBe(180) // unchanged
    })

    it('decreases lightness', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = adjustLightness(oklch, -0.2)

      expect(result.l).toBe(0.3)
    })

    it('clamps at 0', () => {
      const oklch: OklchColor = { l: 0.1, c: 0.1, h: 180 }
      const result = adjustLightness(oklch, -0.5)

      expect(result.l).toBe(0)
    })

    it('clamps at 1', () => {
      const oklch: OklchColor = { l: 0.9, c: 0.1, h: 180 }
      const result = adjustLightness(oklch, 0.5)

      expect(result.l).toBe(1)
    })
  })

  describe('adjustChroma', () => {
    it('increases chroma', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = adjustChroma(oklch, 0.05)

      expect(result.c).toBeCloseTo(0.15, 10)
    })

    it('decreases chroma', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = adjustChroma(oklch, -0.05)

      expect(result.c).toBe(0.05)
    })

    it('clamps at 0', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = adjustChroma(oklch, -0.5)

      expect(result.c).toBe(0)
    })
  })

  describe('rotateHue', () => {
    it('rotates hue forward', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = rotateHue(oklch, 90)

      expect(result.h).toBe(270)
    })

    it('wraps around 360', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 300 }
      const result = rotateHue(oklch, 90)

      expect(result.h).toBe(30)
    })

    it('handles negative rotation', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 30 }
      const result = rotateHue(oklch, -90)

      expect(result.h).toBe(300)
    })
  })

  describe('lighten/darken', () => {
    it('lighten increases lightness', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = lighten(oklch, 0.1)

      expect(result.l).toBe(0.6)
    })

    it('darken decreases lightness', () => {
      const oklch: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      const result = darken(oklch, 0.1)

      expect(result.l).toBe(0.4)
    })
  })

  // ============================================
  // Contrast & Accessibility
  // ============================================
  describe('needsLightText', () => {
    it('returns true for dark backgrounds', () => {
      const dark: OklchColor = { l: 0.2, c: 0.1, h: 180 }
      expect(needsLightText(dark)).toBe(true)
    })

    it('returns false for light backgrounds', () => {
      const light: OklchColor = { l: 0.8, c: 0.1, h: 180 }
      expect(needsLightText(light)).toBe(false)
    })

    it('returns true for colors below threshold', () => {
      const midDark: OklchColor = { l: 0.5, c: 0.1, h: 180 }
      expect(needsLightText(midDark)).toBe(true)
    })

    it('returns false for colors above threshold', () => {
      const midLight: OklchColor = { l: 0.6, c: 0.1, h: 180 }
      expect(needsLightText(midLight)).toBe(false)
    })
  })

  describe('getContrastTextColor', () => {
    it('returns white for dark backgrounds', () => {
      expect(getContrastTextColor('#000000')).toBe('#ffffff')
      expect(getContrastTextColor('#333333')).toBe('#ffffff')
    })

    it('returns black for light backgrounds', () => {
      expect(getContrastTextColor('#ffffff')).toBe('#000000')
      expect(getContrastTextColor('#f0f0f0')).toBe('#000000')
    })
  })

  // ============================================
  // Palette Generation
  // ============================================
  describe('generatePalette', () => {
    it('generates all required colors', () => {
      const palette = generatePalette('#3366cc')

      expect(palette).toHaveProperty('primary')
      expect(palette).toHaveProperty('secondary')
      expect(palette).toHaveProperty('accent')
      expect(palette).toHaveProperty('dark')
      expect(palette).toHaveProperty('light')
      expect(palette).toHaveProperty('surface')
      expect(palette).toHaveProperty('text')
      expect(palette).toHaveProperty('textLight')
      expect(palette).toHaveProperty('border')
    })

    it('dark has low lightness', () => {
      const palette = generatePalette('#3366cc')
      expect(palette.dark.l).toBeLessThan(0.3)
    })

    it('light has high lightness', () => {
      const palette = generatePalette('#3366cc')
      expect(palette.light.l).toBeGreaterThan(0.9)
    })

    it('primary matches input color', () => {
      const palette = generatePalette('#ff0000')
      const primaryHex = oklchToHex(palette.primary)
      const inputRgb = hexToRgb('#ff0000')
      const primaryRgb = hexToRgb(primaryHex)

      // Should be close to input
      expect(Math.abs(inputRgb.r - primaryRgb.r)).toBeLessThan(10)
    })
  })
})
