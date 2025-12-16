/**
 * Unit Tests for CN (classnames) Utility
 */

import { describe, it, expect } from 'vitest'
import { cn } from '@/utilities/cn'

describe('CN Utility', () => {
  describe('basic usage', () => {
    it('merges single class', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('merges multiple classes', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('handles undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('handles null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })

    it('handles false values', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar')
    })

    it('handles empty string', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar')
    })
  })

  describe('conditional classes', () => {
    it('handles conditional object', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo')
    })

    it('handles mixed conditional and string', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active')
    })

    it('handles array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })
  })

  describe('tailwind merge', () => {
    it('merges conflicting padding', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4')
    })

    it('merges conflicting margin', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4')
    })

    it('merges conflicting text colors', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('merges conflicting background colors', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('preserves non-conflicting classes', () => {
      expect(cn('p-2', 'm-4')).toBe('p-2 m-4')
    })

    it('handles responsive prefixes', () => {
      expect(cn('p-2', 'md:p-4', 'lg:p-6')).toBe('p-2 md:p-4 lg:p-6')
    })

    it('merges same responsive prefix', () => {
      expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4')
    })

    it('handles state variants', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500')
    })
  })

  describe('edge cases', () => {
    it('handles no arguments', () => {
      expect(cn()).toBe('')
    })

    it('handles all falsy values', () => {
      expect(cn(null, undefined, false, '')).toBe('')
    })

    it('handles deeply nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })
  })
})
