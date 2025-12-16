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

  // ============================================
  // SECURITY EDGE CASES (from BugMagnet methodology)
  // ============================================
  describe('Security Edge Cases', () => {
    describe('XSS attack vectors', () => {
      const xssVectors = [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        '<iframe src="javascript:alert(1)">',
        '"><script>alert(1)</script>',
        "'-alert(1)-'",
        '<body onload=alert(1)>',
        '<input onfocus=alert(1) autofocus>',
        '<marquee onstart=alert(1)>',
        '<details open ontoggle=alert(1)>',
        '<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>',
        '<a href="javascript:alert(1)">click</a>',
        '<div style="background:url(javascript:alert(1))">',
        '<!--<script>alert(1)</script>-->',
        '<img src="x" onerror="alert(1)" />',
      ]

      it.each(xssVectors)('escapes XSS vector: %s', (vector) => {
        const escaped = escapeHtml(vector)

        // Must not contain unescaped HTML characters - this makes it safe
        // The < and > being escaped prevents browser from parsing as HTML
        expect(escaped).not.toContain('<')
        expect(escaped).not.toContain('>')

        // Verify special chars are properly escaped
        if (vector.includes('<')) {
          expect(escaped).toContain('&lt;')
        }
        if (vector.includes('>')) {
          expect(escaped).toContain('&gt;')
        }
      })
    })

    describe('encoded attack vectors', () => {
      it('handles HTML entities in input', () => {
        // These are already escaped - should double-escape
        const input = '&lt;script&gt;'
        const result = escapeHtml(input)

        // The & should be escaped to &amp;
        expect(result).toBe('&amp;lt;script&amp;gt;')
      })

      it('handles mixed encoded/unencoded', () => {
        const input = '<script>&amp;test</script>'
        const result = escapeHtml(input)

        expect(result).not.toContain('<script>')
        expect(result).toContain('&amp;amp;') // Double escaped
      })
    })

    describe('unicode attacks', () => {
      it('handles fullwidth characters', () => {
        // Fullwidth < and > (U+FF1C, U+FF1E) - might be rendered as < >
        const input = '＜script＞alert(1)＜/script＞'
        const result = escapeHtml(input)

        // These should pass through (not standard HTML)
        // but verify they don't become actual tags
        expect(result).toBe(input)
      })

      it('handles zero-width characters', () => {
        // Zero-width joiner/non-joiner might hide malicious content
        const input = '<scr\u200Bipt>alert(1)</script>'
        const result = escapeHtml(input)

        expect(result).not.toContain('<scr')
        expect(result).toContain('&lt;scr')
      })

      it('handles RTL override characters', () => {
        // Right-to-left override could visually hide content
        const input = '<script\u202E>1(trela<</script>'
        const result = escapeHtml(input)

        expect(result).not.toContain('<script')
      })

      it('preserves legitimate unicode', () => {
        const legitimateUnicode = [
          'Română: ăîșțâ ĂÎȘȚÂ',
          'Ελληνικά',
          'Кирилица',
          '中文字符',
          'العربية',
          '日本語',
          '👨‍👩‍👧‍👦',
          '🇷🇴',
        ]

        legitimateUnicode.forEach((text) => {
          expect(escapeHtml(text)).toBe(text)
        })
      })
    })

    describe('edge case strings', () => {
      it('handles very long strings', () => {
        const longMalicious = '<script>' + 'x'.repeat(10000) + '</script>'
        const result = escapeHtml(longMalicious)

        expect(result).not.toContain('<script>')
        expect(result.length).toBeGreaterThan(10000)
      })

      it('handles many special characters', () => {
        const input = '<><><><><>'.repeat(1000)
        const result = escapeHtml(input)

        expect(result).not.toContain('<')
        expect(result).not.toContain('>')
      })

      it('handles null bytes', () => {
        // Null bytes can sometimes truncate strings
        const input = '<scr\x00ipt>alert(1)</script>'
        const result = escapeHtml(input)

        expect(result).not.toContain('<scr')
      })

      it('handles backslash escapes', () => {
        const input = '<script>alert(\\"xss\\")</script>'
        const result = escapeHtml(input)

        expect(result).not.toContain('<script>')
      })

      it('handles nested quotes', () => {
        const input = `<div onclick="alert('nested')">`
        const result = escapeHtml(input)

        // Angle brackets must be escaped - this prevents HTML parsing
        expect(result).not.toContain('<')
        expect(result).not.toContain('>')
        expect(result).toContain('&lt;div')
        // Quotes must be escaped
        expect(result).not.toContain('"')
        expect(result).toContain('&quot;')
      })
    })

    describe('SQL injection (should still escape HTML)', () => {
      const sqlVectors = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "1' UNION SELECT * FROM users --",
      ]

      it.each(sqlVectors)('preserves SQL but escapes quotes: %s', (sql) => {
        const result = escapeHtml(sql)

        // Single quotes should be escaped
        expect(result).not.toContain("'")
        expect(result).toContain('&#039;')
      })
    })

    describe('attribute injection', () => {
      it('escapes attribute breakout attempts', () => {
        const input = '" onmouseover="alert(1)" data-x="'
        const result = escapeHtml(input)

        // Double quotes must be escaped - this prevents attribute breakout
        expect(result).not.toContain('"')
        expect(result).toContain('&quot;')
      })

      it('escapes single quote attribute breakout', () => {
        const input = "' onclick='alert(1)' x='"
        const result = escapeHtml(input)

        expect(result).not.toContain("'")
        expect(result).toContain('&#039;')
      })
    })
  })
})
