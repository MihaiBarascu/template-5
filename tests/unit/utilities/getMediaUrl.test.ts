/**
 * Unit Tests for getMediaUrl Utility
 */

import { describe, it, expect } from 'vitest'
import { getMediaUrl } from '@/utilities/getMediaUrl'

describe('getMediaUrl', () => {
  describe('empty inputs', () => {
    it('returns empty string for null', () => {
      expect(getMediaUrl(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(getMediaUrl(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      expect(getMediaUrl('')).toBe('')
    })
  })

  describe('relative URLs', () => {
    it('returns relative path unchanged', () => {
      expect(getMediaUrl('/media/image.jpg')).toBe('/media/image.jpg')
    })

    it('strips query string from relative URL', () => {
      expect(getMediaUrl('/media/image.jpg?v=123')).toBe('/media/image.jpg')
    })

    it('handles complex query strings', () => {
      expect(getMediaUrl('/media/image.jpg?width=100&height=200')).toBe('/media/image.jpg')
    })
  })

  describe('localhost URLs', () => {
    it('converts localhost http URL to relative path', () => {
      expect(getMediaUrl('http://localhost:3000/media/image.jpg')).toBe('/media/image.jpg')
    })

    it('converts localhost https URL to relative path', () => {
      expect(getMediaUrl('https://localhost:3000/media/image.jpg')).toBe('/media/image.jpg')
    })

    it('converts 127.0.0.1 URL to relative path', () => {
      expect(getMediaUrl('http://127.0.0.1:3000/media/image.jpg')).toBe('/media/image.jpg')
    })

    it('handles localhost without port', () => {
      expect(getMediaUrl('http://localhost/media/image.jpg')).toBe('/media/image.jpg')
    })
  })

  describe('external URLs', () => {
    it('keeps external URL unchanged', () => {
      expect(getMediaUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
    })

    it('adds cache tag to external URL', () => {
      expect(getMediaUrl('https://example.com/image.jpg', 'cache123')).toBe(
        'https://example.com/image.jpg?cache123'
      )
    })

    it('handles external URLs without cache tag', () => {
      expect(getMediaUrl('https://cdn.example.com/assets/logo.png')).toBe(
        'https://cdn.example.com/assets/logo.png'
      )
    })
  })

  describe('edge cases', () => {
    it('handles URL with hash', () => {
      // Hash is part of pathname for relative URLs
      const result = getMediaUrl('/media/image.jpg#section')
      expect(result).toBe('/media/image.jpg#section')
    })

    it('handles deeply nested paths', () => {
      expect(getMediaUrl('/media/2024/01/15/uploads/image.jpg')).toBe(
        '/media/2024/01/15/uploads/image.jpg'
      )
    })

    it('handles special characters in path', () => {
      expect(getMediaUrl('/media/image%20file.jpg')).toBe('/media/image%20file.jpg')
    })

    it('handles file with multiple dots', () => {
      expect(getMediaUrl('/media/my.image.file.jpg')).toBe('/media/my.image.file.jpg')
    })
  })
})
