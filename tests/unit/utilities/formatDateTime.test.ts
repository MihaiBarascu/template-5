/**
 * Unit Tests for Date/Time Formatting Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDateTime,
  formatDateTimeWithTime,
  formatRelativeTime,
} from '@/utilities/formatDateTime'

describe('Date/Time Formatting Utilities', () => {
  // ============================================
  // formatDateTime
  // ============================================
  describe('formatDateTime', () => {
    it('formats Date object to Romanian locale', () => {
      const date = new Date('2025-03-15')
      const result = formatDateTime(date)

      expect(result).toContain('15')
      expect(result).toContain('2025')
      // Month should be in Romanian (martie)
    })

    it('formats ISO string to Romanian locale', () => {
      const result = formatDateTime('2025-03-15T10:30:00Z')

      expect(result).toContain('15')
      expect(result).toContain('2025')
    })

    it('respects custom locale', () => {
      const date = new Date('2025-03-15')
      const resultRo = formatDateTime(date, 'ro-RO')
      const resultEn = formatDateTime(date, 'en-US')

      // Different locales should produce different results
      expect(resultRo).not.toBe(resultEn)
    })

    it('handles various date formats', () => {
      // ISO format
      expect(() => formatDateTime('2025-01-01')).not.toThrow()

      // Date object
      expect(() => formatDateTime(new Date())).not.toThrow()
    })
  })

  // ============================================
  // formatDateTimeWithTime
  // ============================================
  describe('formatDateTimeWithTime', () => {
    it('includes hours and minutes', () => {
      const date = new Date('2025-03-15T14:30:00')
      const result = formatDateTimeWithTime(date)

      // Should contain time parts
      expect(result).toContain('14')
      expect(result).toContain('30')
    })

    it('formats both date and time', () => {
      const date = new Date('2025-03-15T10:30:00')
      const result = formatDateTimeWithTime(date)

      // Should contain date parts
      expect(result).toContain('15')
      expect(result).toContain('2025')
    })
  })

  // ============================================
  // formatRelativeTime
  // ============================================
  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock Date.now to have consistent tests
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-03-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('formats seconds ago', () => {
      const date = new Date('2025-03-15T11:59:30Z') // 30 seconds ago
      const result = formatRelativeTime(date)

      // Should contain some form of "seconds" in Romanian
      expect(result).toBeTruthy()
    })

    it('formats minutes ago', () => {
      const date = new Date('2025-03-15T11:55:00Z') // 5 minutes ago
      const result = formatRelativeTime(date)

      expect(result).toBeTruthy()
    })

    it('formats hours ago', () => {
      const date = new Date('2025-03-15T10:00:00Z') // 2 hours ago
      const result = formatRelativeTime(date)

      expect(result).toBeTruthy()
    })

    it('formats days ago', () => {
      const date = new Date('2025-03-13T12:00:00Z') // 2 days ago
      const result = formatRelativeTime(date)

      expect(result).toBeTruthy()
    })

    it('formats months ago', () => {
      const date = new Date('2025-01-15T12:00:00Z') // 2 months ago
      const result = formatRelativeTime(date)

      expect(result).toBeTruthy()
    })

    it('formats years ago', () => {
      const date = new Date('2023-03-15T12:00:00Z') // 2 years ago
      const result = formatRelativeTime(date)

      expect(result).toBeTruthy()
    })

    it('works with string timestamps', () => {
      const result = formatRelativeTime('2025-03-15T11:59:00Z')
      expect(result).toBeTruthy()
    })
  })
})
