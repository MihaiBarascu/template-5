/**
 * Edge Cases for Testing
 *
 * Based on BugMagnet methodology - comprehensive edge cases for:
 * - Numeric values (prices, quantities, calculations)
 * - Strings (form inputs, content, names)
 * - Security (XSS, SQL injection)
 * - Collections (carts, orders, arrays)
 * - E-commerce specific scenarios
 *
 * Usage:
 *   import { numericEdgeCases, stringEdgeCases } from '@tests/utilities/edgeCases'
 *   test.each(numericEdgeCases.prices)('handles price %p', (price) => { ... })
 */

// ============================================================================
// NUMERIC EDGE CASES
// ============================================================================

export const numericEdgeCases = {
  /** Basic numeric boundaries */
  basic: [
    0,
    -0,
    1,
    -1,
    0.1,
    -0.1,
    0.0001,
    -0.0001,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    Number.MAX_VALUE,
    Number.MIN_VALUE,
    Infinity,
    -Infinity,
    NaN,
  ],

  /** Price values (RON/EUR) - for e-commerce */
  prices: [
    0, // Free item
    0.01, // Minimum price
    0.001, // Sub-cent (rounding test)
    0.005, // Banker's rounding boundary
    0.99,
    1.0,
    9.99,
    10.0,
    99.99,
    100.0,
    999.99,
    1000.0,
    9999.99,
    99999.99, // High-value item
    -10.0, // Refund/discount
    -0.01, // Minimum refund
  ],

  /** Quantity values - for cart/inventory */
  quantities: [
    0, // Out of stock
    1, // Single item
    -1, // Invalid (return?)
    0.5, // Fractional (weight-based?)
    2,
    10,
    100,
    999, // Near limit
    1000, // Common limit
    1001, // Over limit
    999999, // Very large
  ],

  /** Tax rates (percentages) */
  taxRates: [
    0, // Tax-free
    5,
    9, // Reduced rate RO
    19, // Standard rate RO
    20,
    21,
    25,
    27, // Hungary (highest EU)
    100, // Edge case
    -5, // Invalid
  ],

  /** 32-bit boundaries (for legacy systems) */
  int32Boundaries: [
    -2147483648, // INT32_MIN
    -2147483649, // Below INT32_MIN
    2147483647, // INT32_MAX
    2147483648, // Above INT32_MAX
    4294967295, // UINT32_MAX
  ],

  /** Powers of 2 (for pagination, limits) */
  powersOf2: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
}

// ============================================================================
// STRING EDGE CASES
// ============================================================================

export const stringEdgeCases = {
  /** Empty and whitespace */
  empty: ['', ' ', '  ', '\t', '\n', '\r\n', '\t\n ', '   \t   '],

  /** Length extremes */
  length: [
    'a', // Single char
    'ab', // Two chars
    'a'.repeat(50), // Medium
    'a'.repeat(255), // Common limit
    'a'.repeat(256), // Just over
    'a'.repeat(1000), // Long
    'a'.repeat(10000), // Very long
  ],

  /** Unicode and internationalization */
  unicode: [
    'Română: ăîșțâ ĂÎȘȚÂ', // Romanian diacritics
    'Ελληνικά', // Greek
    'Кирилица', // Cyrillic
    '中文字符', // Chinese
    'العربية', // Arabic (RTL)
    'עברית', // Hebrew (RTL)
    '日本語', // Japanese
    '한국어', // Korean
    'Ñoño España', // Spanish
    'Ångström Malmö', // Swedish
  ],

  /** Emoji and special Unicode */
  emoji: [
    '😀',
    '🎉',
    '👨‍👩‍👧‍👦', // ZWJ family
    '🇷🇴', // Flag (regional indicator)
    '👍🏽', // Skin tone modifier
    '1️⃣', // Keycap
    '❤️', // Variation selector
    '🏳️‍🌈', // Combined flag
  ],

  /** Special characters */
  special: [
    "it's",
    '"quoted"',
    'back\\slash',
    'pipe|char',
    'ampersand&co',
    'less<than',
    'greater>than',
    'at@sign',
    'hash#tag',
    'dollar$sign',
    'percent%20',
    'caret^up',
    'asterisk*star',
    'plus+sign',
    'equals=sign',
    'curly{brace}',
    'square[bracket]',
    'tilde~wave',
    'backtick`mark',
  ],

  /** Names (person names) */
  names: [
    'X', // Single letter
    "O'Brien", // Apostrophe
    'Mary-Jane', // Hyphen
    'José García', // Accents
    'Müller', // Umlaut
    'Çelik', // Cedilla
    'Nguyễn', // Vietnamese
    'Wolfeschlegelsteinhausenbergerdorff', // Very long
    'Null', // Reserved word
    'Test', // Common test value
    'None', // Falsy string
    'Undefined', // Falsy string
    'Admin', // Privileged name
    'Root', // Privileged name
  ],

  /** Email edge cases */
  emails: [
    'simple@example.com',
    'user+tag@domain.com',
    'user.name@domain.co.uk',
    'user@subdomain.domain.org',
    'user@123.123.123.123',
    '"quoted"@example.com',
    'very.long.email.address.that.goes.on@really.long.domain.name.example.com',
  ],

  /** Invalid emails (for validation testing) */
  invalidEmails: [
    '',
    'notanemail',
    '@nodomain.com',
    'no@domain',
    'spaces in@email.com',
    'double@@at.com',
    '.startswithdot@example.com',
    'endswith.@example.com',
  ],
}

// ============================================================================
// SECURITY EDGE CASES (XSS, SQL Injection, etc.)
// ============================================================================

export const securityEdgeCases = {
  /** XSS attack vectors */
  xss: [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)">',
    '"><script>alert(1)</script>',
    "'-alert(1)-'",
    '<body onload=alert(1)>',
    '<input onfocus=alert(1) autofocus>',
    '<marquee onstart=alert(1)>',
    '<details open ontoggle=alert(1)>',
    '<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>',
  ],

  /** SQL injection patterns */
  sqlInjection: [
    "'; DROP TABLE users; --",
    "1' OR '1'='1",
    '1; DELETE FROM products',
    "admin'--",
    "1' UNION SELECT * FROM users --",
    "'; EXEC xp_cmdshell('dir'); --",
    "1' AND SLEEP(5) --",
  ],

  /** Path traversal */
  pathTraversal: [
    '../',
    '..\\',
    '....//....//etc/passwd',
    '%2e%2e%2f',
    '..%252f',
    '/etc/passwd',
    'C:\\Windows\\System32',
  ],

  /** LDAP injection */
  ldapInjection: ['*', '*)(&', '*)(uid=*))(|(uid=*', 'admin)(&)'],

  /** Command injection */
  commandInjection: [
    '; ls -la',
    '| cat /etc/passwd',
    '`whoami`',
    '$(whoami)',
    '& dir',
    '\n cat /etc/passwd',
  ],
}

// ============================================================================
// COLLECTION EDGE CASES
// ============================================================================

export const collectionEdgeCases = {
  /** Array sizes */
  arrays: {
    empty: [],
    single: [1],
    two: [1, 2],
    many: Array.from({ length: 100 }, (_, i) => i),
    large: Array.from({ length: 10000 }, (_, i) => i),
  },

  /** Arrays with special values */
  specialArrays: {
    withNulls: [1, null, 2, null, 3],
    withUndefined: [1, undefined, 2],
    withDuplicates: [1, 2, 2, 3, 3, 3],
    mixed: [1, '2', true, null, { a: 1 }, [1, 2]],
    nested: [[1, 2], [3, 4], [[5, 6]]],
  },

  /** Object edge cases */
  objects: {
    empty: {},
    single: { a: 1 },
    nested: { a: { b: { c: { d: 1 } } } },
    withNull: { a: null, b: undefined },
    circular: (() => {
      const obj: Record<string, unknown> = { a: 1 }
      obj.self = obj
      return obj
    })(),
  },
}

// ============================================================================
// E-COMMERCE SPECIFIC EDGE CASES
// ============================================================================

export const ecommerceEdgeCases = {
  /** Cart scenarios */
  cart: {
    empty: [],
    singleItem: [{ productId: '1', quantity: 1, price: 99.99 }],
    multipleItems: [
      { productId: '1', quantity: 2, price: 49.99 },
      { productId: '2', quantity: 1, price: 199.99 },
      { productId: '3', quantity: 5, price: 9.99 },
    ],
    largeQuantity: [{ productId: '1', quantity: 9999, price: 0.01 }],
    mixedPrices: [
      { productId: '1', quantity: 1, price: 0 }, // Free
      { productId: '2', quantity: 1, price: 0.01 }, // Minimum
      { productId: '3', quantity: 1, price: 99999.99 }, // Maximum
    ],
    withDiscounts: [
      { productId: '1', quantity: 1, price: 100, discount: 10 },
      { productId: '2', quantity: 1, price: 100, discount: 100 }, // 100% off
    ],
  },

  /** Product states */
  product: {
    outOfStock: { stock: 0, available: false },
    lowStock: { stock: 1, available: true },
    unlimited: { stock: null, available: true },
    preorder: { stock: 0, available: true, preorder: true },
    discontinued: { stock: 0, available: false, discontinued: true },
  },

  /** Discount scenarios */
  discounts: {
    percentage: [0, 1, 5, 10, 25, 50, 75, 99, 100],
    fixed: [0, 0.01, 1, 10, 100, 1000],
    invalid: [-10, 101, 150, -0.01],
  },

  /** Shipping scenarios */
  shipping: {
    domestic: { country: 'RO', zone: 'domestic', cost: 15 },
    eu: { country: 'DE', zone: 'eu', cost: 25 },
    international: { country: 'US', zone: 'international', cost: 50 },
    freeThreshold: 200, // Free shipping above this
    weightBased: [
      { maxWeight: 1, cost: 10 },
      { maxWeight: 5, cost: 20 },
      { maxWeight: 10, cost: 35 },
      { maxWeight: Infinity, cost: 50 },
    ],
  },

  /** Coupon codes */
  coupons: {
    valid: ['SAVE10', 'FREESHIP', 'WELCOME20'],
    expired: ['EXPIRED2023', 'OLDCODE'],
    invalid: ['', 'NOTACODE', 'a'.repeat(100)],
    caseVariations: ['save10', 'SAVE10', 'Save10', 'SaVe10'],
  },
}

// ============================================================================
// DATE/TIME EDGE CASES
// ============================================================================

export const dateTimeEdgeCases = {
  /** Special dates */
  dates: [
    new Date('2000-01-01'), // Y2K
    new Date('2000-02-29'), // Leap year
    new Date('2001-02-28'), // Non-leap year Feb end
    new Date('2024-02-29'), // Recent leap year
    new Date('2038-01-19'), // 32-bit Unix time limit
    new Date('1970-01-01'), // Unix epoch
    new Date('1969-12-31'), // Before epoch
  ],

  /** Date strings (for parsing tests) */
  dateStrings: [
    '2024-01-15',
    '15/01/2024',
    '01/15/2024',
    'January 15, 2024',
    '15 Jan 2024',
    '2024-01-15T10:30:00Z',
    '2024-01-15T10:30:00+02:00',
  ],

  /** Invalid dates */
  invalidDates: [
    '2024-02-30', // Feb 30
    '2024-04-31', // Apr 31
    '2023-02-29', // Feb 29 non-leap
    '2024-13-01', // Month 13
    '2024-00-15', // Month 0
    'not-a-date',
    '',
  ],

  /** Timezone edge cases */
  timezones: [
    'UTC',
    'Europe/Bucharest', // Romania
    'Europe/London', // GMT/BST
    'America/New_York', // EST/EDT
    'Asia/Tokyo', // JST (no DST)
    'Pacific/Auckland', // Far from UTC
  ],
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate test cases with labels for test.each
 */
export function labeledCases<T>(cases: T[], labelFn: (c: T) => string): [string, T][] {
  return cases.map((c) => [labelFn(c), c])
}

/**
 * Combine multiple edge case arrays
 */
export function combineCases<T>(...arrays: T[][]): T[] {
  return arrays.flat()
}

/**
 * Generate price test cases with proper labels
 */
export function priceTestCases(): [string, number][] {
  return labeledCases(numericEdgeCases.prices, (p) =>
    p < 0 ? `negative ${p}` : p === 0 ? 'zero' : p < 1 ? `sub-unit ${p}` : `${p}`,
  )
}

/**
 * Generate string test cases with truncated labels
 */
export function stringTestCases(cases: string[]): [string, string][] {
  return labeledCases(cases, (s) =>
    s.length === 0 ? 'empty' : s.length > 20 ? `${s.slice(0, 17)}... (${s.length} chars)` : s,
  )
}
