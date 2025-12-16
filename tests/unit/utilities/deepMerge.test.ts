/**
 * Unit Tests for Deep Merge Utility
 */

import { describe, it, expect } from 'vitest'
import deepMerge, { isObject } from '@/utilities/deepMerge'

describe('Deep Merge Utilities', () => {
  // ============================================
  // isObject
  // ============================================
  describe('isObject', () => {
    it('returns true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it('returns false for arrays', () => {
      expect(isObject([])).toBe(false)
      expect(isObject([1, 2, 3])).toBe(false)
    })

    it('returns false for null', () => {
      expect(isObject(null)).toBe(false)
    })

    it('returns false for primitives', () => {
      expect(isObject(1)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(undefined)).toBe(false)
    })

    it('returns false for functions', () => {
      expect(isObject(() => {})).toBe(false)
    })
  })

  // ============================================
  // deepMerge
  // ============================================
  describe('deepMerge', () => {
    it('merges flat objects', () => {
      const target = { a: 1, b: 2 }
      const source = { c: 3 }
      const result = deepMerge(target, source)

      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('overwrites values from source', () => {
      const target = { a: 1, b: 2 }
      const source = { b: 3 }
      const result = deepMerge(target, source)

      expect(result).toEqual({ a: 1, b: 3 })
    })

    it('deeply merges nested objects', () => {
      const target = {
        a: 1,
        nested: { x: 1, y: 2 },
      }
      const source = {
        nested: { y: 3, z: 4 },
      }
      const result = deepMerge(target, source)

      expect(result).toEqual({
        a: 1,
        nested: { x: 1, y: 3, z: 4 },
      })
    })

    it('handles multiple levels of nesting', () => {
      const target = {
        level1: {
          level2: {
            level3: { a: 1 },
          },
        },
      }
      const source = {
        level1: {
          level2: {
            level3: { b: 2 },
          },
        },
      }
      const result = deepMerge(target, source)

      expect(result.level1.level2.level3).toEqual({ a: 1, b: 2 })
    })

    it('does not mutate original objects', () => {
      const target = { a: 1, nested: { x: 1 } }
      const source = { b: 2, nested: { y: 2 } }

      const targetCopy = JSON.parse(JSON.stringify(target))
      const sourceCopy = JSON.parse(JSON.stringify(source))

      deepMerge(target, source)

      expect(target).toEqual(targetCopy)
      expect(source).toEqual(sourceCopy)
    })

    it('handles empty objects', () => {
      expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 })
      expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 })
      expect(deepMerge({}, {})).toEqual({})
    })

    it('replaces arrays (does not merge them)', () => {
      const target = { arr: [1, 2, 3] }
      const source = { arr: [4, 5] }
      const result = deepMerge(target, source)

      expect(result.arr).toEqual([4, 5])
    })

    it('handles null values in source', () => {
      const target = { a: 1, b: { x: 1 } }
      const source = { b: null }
      const result = deepMerge(target, source as any)

      expect(result.b).toBe(null)
    })

    it('adds new nested objects from source', () => {
      const target = { a: 1 }
      const source = { nested: { x: 1 } }
      const result = deepMerge(target, source)

      expect(result).toEqual({ a: 1, nested: { x: 1 } })
    })
  })
})
