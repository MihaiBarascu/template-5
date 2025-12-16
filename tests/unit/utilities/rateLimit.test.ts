/**
 * Unit Tests for Rate Limit Utility
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { checkRateLimit, getClientIP } from '@/utilities/rateLimit'

describe('Rate Limit Utility', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('checkRateLimit', () => {
    it('allows first request', () => {
      const result = checkRateLimit('test-ip-1', 5, 60000)

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('decrements remaining count', () => {
      checkRateLimit('test-ip-2', 5, 60000)
      const result = checkRateLimit('test-ip-2', 5, 60000)

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(3)
    })

    it('blocks after limit exceeded', () => {
      const identifier = 'test-ip-3'
      const limit = 3

      // Use up the limit
      checkRateLimit(identifier, limit, 60000)
      checkRateLimit(identifier, limit, 60000)
      checkRateLimit(identifier, limit, 60000)

      // This should be blocked
      const result = checkRateLimit(identifier, limit, 60000)

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('resets after time window expires', () => {
      const identifier = 'test-ip-4'
      const windowMs = 60000

      // Use up the limit
      checkRateLimit(identifier, 2, windowMs)
      checkRateLimit(identifier, 2, windowMs)

      // Should be blocked
      expect(checkRateLimit(identifier, 2, windowMs).success).toBe(false)

      // Advance time past window
      vi.advanceTimersByTime(windowMs + 1000)

      // Should be allowed again
      const result = checkRateLimit(identifier, 2, windowMs)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('tracks different identifiers separately', () => {
      checkRateLimit('ip-a', 2, 60000)
      checkRateLimit('ip-a', 2, 60000)

      // ip-a should be blocked
      expect(checkRateLimit('ip-a', 2, 60000).success).toBe(false)

      // ip-b should still be allowed
      expect(checkRateLimit('ip-b', 2, 60000).success).toBe(true)
    })

    it('returns reset time', () => {
      const now = Date.now()
      const windowMs = 60000
      const result = checkRateLimit('test-ip-5', 5, windowMs)

      expect(result.reset).toBeGreaterThan(now)
      expect(result.reset).toBeLessThanOrEqual(now + windowMs)
    })

    it('uses default values', () => {
      const result = checkRateLimit('test-ip-default')

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4) // default limit is 5
    })
  })

  describe('getClientIP', () => {
    it('extracts IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '192.168.1.1' },
      })

      expect(getClientIP(request)).toBe('192.168.1.1')
    })

    it('handles multiple IPs in x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1' },
      })

      expect(getClientIP(request)).toBe('192.168.1.1')
    })

    it('extracts IP from x-real-ip header', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '10.0.0.1' },
      })

      expect(getClientIP(request)).toBe('10.0.0.1')
    })

    it('prefers x-forwarded-for over x-real-ip', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '10.0.0.1',
        },
      })

      expect(getClientIP(request)).toBe('192.168.1.1')
    })

    it('returns unknown when no headers present', () => {
      const request = new Request('http://localhost')

      expect(getClientIP(request)).toBe('unknown')
    })

    it('trims whitespace from IP', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '  192.168.1.1  ' },
      })

      expect(getClientIP(request)).toBe('192.168.1.1')
    })
  })
})
