/**
 * Unit Tests for Tax/VAT Utilities
 *
 * Tests all tax calculation functions.
 * These are pure functions - perfect for unit testing.
 */

import { describe, it, expect } from 'vitest'
import {
  getVatRate,
  addVat,
  removeVat,
  calculateVat,
  getDisplayPrice,
  calculateCartTotals,
  roundPrice,
  formatPrice,
  formatPriceWithVatIndicator,
  type TaxCategory,
  type TaxSettings,
  type CartItem,
} from '@/utilities/tax'

describe('Tax Utilities', () => {
  // ============================================
  // getVatRate
  // ============================================
  describe('getVatRate', () => {
    it('returns standard rate by default', () => {
      expect(getVatRate()).toBe(21)
    })

    it('returns correct rate for each category', () => {
      expect(getVatRate('standard')).toBe(21)
      expect(getVatRate('reduced')).toBe(11)
      expect(getVatRate('zero')).toBe(0)
    })

    it('uses custom VAT rates when provided', () => {
      const customRates = { standard: 19, reduced: 9, zero: 0 }
      expect(getVatRate('standard', customRates)).toBe(19)
      expect(getVatRate('reduced', customRates)).toBe(9)
    })
  })

  // ============================================
  // addVat
  // ============================================
  describe('addVat', () => {
    it('adds 21% VAT correctly', () => {
      expect(addVat(100, 21)).toBe(121)
    })

    it('adds 11% VAT correctly', () => {
      expect(addVat(100, 11)).toBeCloseTo(111, 10)
    })

    it('returns same price for 0% VAT', () => {
      expect(addVat(100, 0)).toBe(100)
    })

    it('handles decimal prices', () => {
      expect(addVat(99.99, 21)).toBeCloseTo(120.99, 2)
    })
  })

  // ============================================
  // removeVat
  // ============================================
  describe('removeVat', () => {
    it('removes 21% VAT correctly', () => {
      expect(removeVat(121, 21)).toBeCloseTo(100, 2)
    })

    it('removes 11% VAT correctly', () => {
      expect(removeVat(111, 11)).toBeCloseTo(100, 2)
    })

    it('returns same price for 0% VAT', () => {
      expect(removeVat(100, 0)).toBe(100)
    })

    it('is inverse of addVat', () => {
      const original = 99.99
      const withVat = addVat(original, 21)
      expect(removeVat(withVat, 21)).toBeCloseTo(original, 2)
    })
  })

  // ============================================
  // calculateVat
  // ============================================
  describe('calculateVat', () => {
    it('calculates VAT amount from net price', () => {
      expect(calculateVat(100, 21)).toBe(21)
    })

    it('calculates reduced VAT correctly', () => {
      expect(calculateVat(100, 11)).toBe(11)
    })

    it('returns 0 for zero VAT rate', () => {
      expect(calculateVat(100, 0)).toBe(0)
    })
  })

  // ============================================
  // roundPrice
  // ============================================
  describe('roundPrice', () => {
    it('rounds to 2 decimal places', () => {
      expect(roundPrice(10.126)).toBe(10.13)
      expect(roundPrice(10.124)).toBe(10.12)
    })

    it('handles whole numbers', () => {
      expect(roundPrice(100)).toBe(100)
    })

    it('handles very small differences', () => {
      expect(roundPrice(0.001)).toBe(0)
      expect(roundPrice(0.009)).toBe(0.01)
    })
  })

  // ============================================
  // formatPrice
  // ============================================
  describe('formatPrice', () => {
    it('formats price with lei suffix by default', () => {
      expect(formatPrice(100)).toBe('100.00 lei')
    })

    it('formats price with custom currency symbol', () => {
      expect(formatPrice(100, 'EUR', '€')).toBe('100.00 €')
    })

    it('formats price with prefix position', () => {
      expect(formatPrice(100, 'USD', '$', 'before')).toBe('$100.00')
    })

    it('handles decimal prices', () => {
      expect(formatPrice(99.99)).toBe('99.99 lei')
    })
  })

  // ============================================
  // formatPriceWithVatIndicator
  // ============================================
  describe('formatPriceWithVatIndicator', () => {
    it('shows TVA inclus when price includes VAT', () => {
      expect(formatPriceWithVatIndicator(121, true)).toBe('121.00 lei (TVA inclus)')
    })

    it('shows fara TVA when price excludes VAT', () => {
      expect(formatPriceWithVatIndicator(100, false)).toBe('100.00 lei (fara TVA)')
    })
  })

  // ============================================
  // getDisplayPrice
  // ============================================
  describe('getDisplayPrice', () => {
    it('returns price as-is when VAT disabled', () => {
      const settings: Partial<TaxSettings> = { vatEnabled: false }
      expect(getDisplayPrice(100, 'standard', settings)).toBe(100)
    })

    it('returns price as-is when DB includes VAT and display includes VAT', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: true,
        displayPricesWithVat: true,
      }
      expect(getDisplayPrice(121, 'standard', settings)).toBe(121)
    })

    it('removes VAT when DB includes VAT but display should not', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: true,
        displayPricesWithVat: false,
      }
      expect(getDisplayPrice(121, 'standard', settings)).toBeCloseTo(100, 2)
    })

    it('adds VAT when DB excludes VAT but display should include', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: false,
        displayPricesWithVat: true,
      }
      expect(getDisplayPrice(100, 'standard', settings)).toBeCloseTo(121, 2)
    })

    it('uses correct VAT rate for tax category', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: false,
        displayPricesWithVat: true,
      }
      expect(getDisplayPrice(100, 'reduced', settings)).toBeCloseTo(111, 2)
      expect(getDisplayPrice(100, 'zero', settings)).toBe(100)
    })
  })

  // ============================================
  // calculateCartTotals
  // ============================================
  describe('calculateCartTotals', () => {
    const defaultSettings: Partial<TaxSettings> = {
      vatEnabled: true,
      pricesIncludeVat: false,
      displayPricesWithVat: true,
    }

    it('calculates totals for single item', () => {
      const items: CartItem[] = [{ price: 100, quantity: 1 }]
      const result = calculateCartTotals(items, defaultSettings)

      expect(result.subtotal).toBe(100)
      expect(result.vatAmount).toBe(21)
      expect(result.total).toBe(121)
    })

    it('calculates totals for multiple items', () => {
      const items: CartItem[] = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ]
      const result = calculateCartTotals(items, defaultSettings)

      expect(result.subtotal).toBe(250) // (100*2) + 50
      expect(result.vatAmount).toBe(52.5) // 250 * 0.21
      expect(result.total).toBe(302.5)
    })

    it('calculates VAT breakdown by rate', () => {
      const items: CartItem[] = [
        { price: 100, quantity: 1, taxCategory: 'standard' },
        { price: 100, quantity: 1, taxCategory: 'reduced' },
      ]
      const result = calculateCartTotals(items, defaultSettings)

      expect(result.vatBreakdown).toHaveLength(2)
      expect(result.vatBreakdown).toContainEqual({ rate: 21, amount: 21 })
      expect(result.vatBreakdown).toContainEqual({ rate: 11, amount: 11 })
    })

    it('handles empty cart', () => {
      const result = calculateCartTotals([], defaultSettings)

      expect(result.subtotal).toBe(0)
      expect(result.vatAmount).toBe(0)
      expect(result.total).toBe(0)
      expect(result.vatBreakdown).toHaveLength(0)
    })

    it('handles prices that include VAT', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: true,
      }
      const items: CartItem[] = [{ price: 121, quantity: 1 }]
      const result = calculateCartTotals(items, settings)

      expect(result.subtotal).toBeCloseTo(100, 0)
      expect(result.vatAmount).toBeCloseTo(21, 0)
      expect(result.total).toBeCloseTo(121, 0)
    })

    it('handles zero VAT items', () => {
      const items: CartItem[] = [
        { price: 100, quantity: 1, taxCategory: 'zero' },
      ]
      const result = calculateCartTotals(items, defaultSettings)

      expect(result.subtotal).toBe(100)
      expect(result.vatAmount).toBe(0)
      expect(result.total).toBe(100)
    })
  })

  // ============================================
  // EDGE CASES (from BugMagnet methodology)
  // ============================================
  describe('Edge Cases', () => {
    describe('price edge cases', () => {
      it.each([
        [0, 0, 'zero price'],
        [0.01, 0.0121, 'minimum price (1 ban)'],
        [0.001, 0.00121, 'sub-cent price'],
        [99999.99, 120999.9879, 'very large price'], // Note: floating point precision
      ])('addVat handles %s correctly (%s)', (input, expected) => {
        expect(addVat(input, 21)).toBeCloseTo(expected, 2)
      })

      it('handles negative price (refund scenario)', () => {
        expect(addVat(-100, 21)).toBe(-121)
        expect(removeVat(-121, 21)).toBeCloseTo(-100, 2)
      })

      it('handles zero price in cart', () => {
        const items: CartItem[] = [{ price: 0, quantity: 5 }]
        const result = calculateCartTotals(items, {
          vatEnabled: true,
          pricesIncludeVat: false,
        })
        expect(result.subtotal).toBe(0)
        expect(result.total).toBe(0)
      })
    })

    describe('quantity edge cases', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: false,
      }

      it('handles zero quantity', () => {
        const items: CartItem[] = [{ price: 100, quantity: 0 }]
        const result = calculateCartTotals(items, settings)
        expect(result.subtotal).toBe(0)
        expect(result.total).toBe(0)
      })

      it('handles very large quantity', () => {
        const items: CartItem[] = [{ price: 0.01, quantity: 1000000 }]
        const result = calculateCartTotals(items, settings)
        expect(result.subtotal).toBe(10000)
        expect(result.vatAmount).toBeCloseTo(2100, 0)
      })

      it('handles fractional quantity (weight-based products)', () => {
        const items: CartItem[] = [{ price: 10, quantity: 0.5 }]
        const result = calculateCartTotals(items, settings)
        expect(result.subtotal).toBe(5)
      })
    })

    describe('rounding edge cases', () => {
      it.each([
        [0.004, 0, 'rounds down at .004'],
        [0.005, 0.01, 'rounds up at .005 (banker rounding boundary)'],
        [0.006, 0.01, 'rounds up at .006'],
        [0.014, 0.01, 'rounds down at .014'],
        [0.015, 0.02, 'rounds up at .015'],
        [0.025, 0.03, 'rounds up at .025'],
        [10.994, 10.99, 'rounds down complex'],
        [10.995, 11, 'rounds up complex'],
        [10.999, 11, 'rounds up near integer'],
      ])('roundPrice(%s) = %s (%s)', (input, expected) => {
        expect(roundPrice(input)).toBe(expected)
      })

      it('avoids floating point accumulation errors', () => {
        // Classic floating point issue: 0.1 + 0.2 !== 0.3
        const price1 = 0.1
        const price2 = 0.2
        const sum = roundPrice(price1 + price2)
        expect(sum).toBe(0.3)
      })

      it('handles rounding in cart totals', () => {
        // Multiple items that could cause rounding accumulation
        const items: CartItem[] = [
          { price: 0.01, quantity: 3 }, // 0.03
          { price: 0.01, quantity: 3 }, // 0.03
          { price: 0.01, quantity: 3 }, // 0.03
        ]
        const result = calculateCartTotals(items, {
          vatEnabled: true,
          pricesIncludeVat: false,
        })
        expect(result.subtotal).toBeCloseTo(0.09, 2)
      })
    })

    describe('VAT rate edge cases', () => {
      it('handles 0% VAT rate', () => {
        expect(addVat(100, 0)).toBe(100)
        expect(removeVat(100, 0)).toBe(100)
        expect(calculateVat(100, 0)).toBe(0)
      })

      it('handles 100% VAT rate (theoretical)', () => {
        expect(addVat(100, 100)).toBe(200)
        expect(removeVat(200, 100)).toBe(100)
        expect(calculateVat(100, 100)).toBe(100)
      })

      it('handles very small VAT rate', () => {
        expect(addVat(100, 0.1)).toBeCloseTo(100.1, 2)
      })
    })

    describe('mixed tax categories in cart', () => {
      const settings: Partial<TaxSettings> = {
        vatEnabled: true,
        pricesIncludeVat: false,
      }

      it('handles all three tax categories', () => {
        const items: CartItem[] = [
          { price: 100, quantity: 1, taxCategory: 'standard' }, // 21% = 21
          { price: 100, quantity: 1, taxCategory: 'reduced' }, // 11% = 11
          { price: 100, quantity: 1, taxCategory: 'zero' }, // 0% = 0
        ]
        const result = calculateCartTotals(items, settings)

        expect(result.subtotal).toBe(300)
        expect(result.vatAmount).toBe(32) // 21 + 11 + 0
        expect(result.total).toBe(332)
        // Note: 0% VAT items are not included in breakdown (correct behavior)
        expect(result.vatBreakdown).toHaveLength(2)
        expect(result.vatBreakdown).toContainEqual({ rate: 21, amount: 21 })
        expect(result.vatBreakdown).toContainEqual({ rate: 11, amount: 11 })
      })

      it('consolidates same tax rates', () => {
        const items: CartItem[] = [
          { price: 50, quantity: 1, taxCategory: 'standard' },
          { price: 50, quantity: 1, taxCategory: 'standard' },
        ]
        const result = calculateCartTotals(items, settings)

        // Should have only one entry for 21%
        const standardEntries = result.vatBreakdown.filter((b) => b.rate === 21)
        expect(standardEntries).toHaveLength(1)
        expect(standardEntries[0].amount).toBe(21) // 100 * 0.21
      })
    })

    describe('currency formatting edge cases', () => {
      it('formats zero correctly', () => {
        expect(formatPrice(0)).toBe('0.00 lei')
      })

      it('formats very small amounts', () => {
        expect(formatPrice(0.01)).toBe('0.01 lei')
        expect(formatPrice(0.001)).toBe('0.00 lei') // Rounded
      })

      it('formats very large amounts', () => {
        expect(formatPrice(999999.99)).toBe('999999.99 lei')
      })

      it('formats with different currencies', () => {
        expect(formatPrice(100, 'EUR', '€')).toBe('100.00 €')
        expect(formatPrice(100, 'USD', '$', 'before')).toBe('$100.00')
        expect(formatPrice(100, 'GBP', '£', 'before')).toBe('£100.00')
      })
    })
  })
})
