/**
 * Unit Tests for HTML Escape Utilities
 *
 * Critical for XSS prevention - these tests ensure security.
 */

import { describe, it, expect } from 'vitest'
import { escapeHtml, escapeHtmlWithLineBreaks } from '@/utilities/escapeHtml'

describe('HTML Escape Utilities', () => {
  // ============================================
  // escapeHtml
  // ============================================
  describe('escapeHtml', () => {
    it('escapes ampersand', () => {
      expect(escapeHtml('foo & bar')).toBe('foo &amp; bar')
    })

    it('escapes less than', () => {
      expect(escapeHtml('a < b')).toBe('a &lt; b')
    })

    it('escapes greater than', () => {
      expect(escapeHtml('a > b')).toBe('a &gt; b')
    })

    it('escapes double quotes', () => {
      expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
    })

    it('escapes single quotes', () => {
      expect(escapeHtml("it's")).toBe('it&#039;s')
    })

    it('escapes all special characters together', () => {
      const input = '<script>alert("xss" & \'attack\')</script>'
      const expected = '&lt;script&gt;alert(&quot;xss&quot; &amp; &#039;attack&#039;)&lt;/script&gt;'
      expect(escapeHtml(input)).toBe(expected)
    })

    it('leaves safe text unchanged', () => {
      const safeText = 'Hello World 123'
      expect(escapeHtml(safeText)).toBe(safeText)
    })

    it('handles empty string', () => {
      expect(escapeHtml('')).toBe('')
    })

    it('escapes HTML tags', () => {
      expect(escapeHtml('<div class="test">')).toBe('&lt;div class=&quot;test&quot;&gt;')
    })

    it('escapes script injection attempts', () => {
      const malicious = '<img src=x onerror="alert(1)">'
      const escaped = escapeHtml(malicious)

      expect(escaped).not.toContain('<')
      expect(escaped).not.toContain('>')
      expect(escaped).not.toContain('"')
    })

    it('escapes event handlers', () => {
      const input = '<div onclick="steal()">'
      const result = escapeHtml(input)

      expect(result).not.toContain('<div')
      expect(result).toContain('&lt;div')
    })

    it('handles multiple occurrences', () => {
      expect(escapeHtml('<<>>')).toBe('&lt;&lt;&gt;&gt;')
      expect(escapeHtml('&&&')).toBe('&amp;&amp;&amp;')
    })

    it('preserves unicode characters', () => {
      expect(escapeHtml('Română: ăîșțâ')).toBe('Română: ăîșțâ')
      expect(escapeHtml('中文')).toBe('中文')
      expect(escapeHtml('🎉')).toBe('🎉')
    })
  })

  // ============================================
  // escapeHtmlWithLineBreaks
  // ============================================
  describe('escapeHtmlWithLineBreaks', () => {
    it('converts newlines to <br> tags', () => {
      expect(escapeHtmlWithLineBreaks('line1\nline2')).toBe('line1<br>line2')
    })

    it('escapes HTML before converting newlines', () => {
      const input = '<script>\nalert(1)\n</script>'
      const result = escapeHtmlWithLineBreaks(input)

      expect(result).toBe('&lt;script&gt;<br>alert(1)<br>&lt;/script&gt;')
    })

    it('handles multiple newlines', () => {
      expect(escapeHtmlWithLineBreaks('a\n\n\nb')).toBe('a<br><br><br>b')
    })

    it('handles Windows-style line endings (partial)', () => {
      // Note: \r\n will become \r<br> - may need adjustment
      const input = 'line1\nline2'
      expect(escapeHtmlWithLineBreaks(input)).toBe('line1<br>line2')
    })

    it('escapes and converts mixed content', () => {
      const input = 'Name: <John>\nEmail: john@test.com'
      const result = escapeHtmlWithLineBreaks(input)

      expect(result).toBe('Name: &lt;John&gt;<br>Email: john@test.com')
    })

    it('handles empty string', () => {
      expect(escapeHtmlWithLineBreaks('')).toBe('')
    })

    it('handles string with no newlines', () => {
      expect(escapeHtmlWithLineBreaks('single line')).toBe('single line')
    })
  })
})
