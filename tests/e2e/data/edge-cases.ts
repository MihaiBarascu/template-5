/**
 * BugMagnet Edge Cases - Date pentru teste E2E
 *
 * CUM FOLOSEȘTI:
 * 1. Import: import { EDGE } from './data/edge-cases'
 * 2. Folosește în teste: EDGE.strings.empty, EDGE.prices.zero, etc.
 *
 * CATEGORII:
 * - strings: texte pentru formulare
 * - emails: adrese email valide/invalide
 * - phones: numere telefon România
 * - prices: prețuri edge case
 * - quantities: cantități pentru coș
 * - names: nume persoane
 * - addresses: adrese complete
 */

// ============================================
// STRINGS - Pentru orice câmp text
// ============================================
export const STRINGS = {
  // Cazuri de bază
  empty: '',
  space: ' ',
  spaces: '   ',
  tab: '\t',
  newline: '\n',

  // Lungimi
  short: 'a',
  medium: 'Test value',
  long: 'a'.repeat(100),
  veryLong: 'a'.repeat(500),

  // Caractere speciale
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  quotes: `"test" 'test' \`test\``,

  // Românești (IMPORTANT pentru formulare)
  romanian: 'Ștefan Țărănescu',
  romanianChars: 'ăîșțâĂÎȘȚÂ',

  // Internaționale
  chinese: '中文测试',
  arabic: 'اختبار',
  emoji: '😀🎉👍',

  // Security
  xss: '<script>alert("xss")</script>',
  xssImg: '<img src=x onerror=alert(1)>',
  sqlInjection: "'; DROP TABLE users; --",

  // Edge cases ciudate
  nullString: 'null',
  undefinedString: 'undefined',
  zeroString: '0',
}

// ============================================
// EMAILS - Pentru câmpuri email
// ============================================
export const EMAILS = {
  // Valide
  simple: 'test@example.com',
  withPlus: 'test+tag@example.com',
  subdomain: 'test@mail.example.com',
  shortDomain: 'test@ex.co',
  romanian: 'ștefan@example.ro',

  // Invalide (pentru testare validare)
  empty: '',
  noAt: 'testexample.com',
  noDomain: 'test@',
  noUser: '@example.com',
  spaces: 'test @example.com',
  doubleDot: 'test@example..com',
  justText: 'not-an-email',
}

// ============================================
// PHONES - Numere telefon România
// ============================================
export const PHONES = {
  // Valide
  mobile: '0722123456',
  mobileSpaces: '0722 123 456',
  mobileDashes: '0722-123-456',
  withPrefix: '+40722123456',
  withPrefixSpaces: '+40 722 123 456',
  landline: '0212345678',

  // Invalide
  empty: '',
  tooShort: '072212',
  tooLong: '07221234567890',
  letters: '0722abc456',
  specialChars: '0722!@#456',
}

// ============================================
// PRICES - Pentru teste de prețuri
// ============================================
export const PRICES = {
  zero: 0,
  oneBan: 0.01,
  subBan: 0.001,        // Sub 1 ban - test rotunjire
  small: 1.99,
  medium: 49.99,
  large: 999.99,
  veryLarge: 99999.99,
  negative: -10,        // Refund/discount

  // Pentru display
  wholeNumber: 100,
  manyDecimals: 10.999,
}

// ============================================
// QUANTITIES - Pentru coș
// ============================================
export const QUANTITIES = {
  zero: 0,
  one: 1,
  small: 5,
  medium: 50,
  large: 999,
  veryLarge: 10000,
  negative: -1,
  decimal: 2.5,         // Produse la kg
}

// ============================================
// NAMES - Nume persoane
// ============================================
export const NAMES = {
  // Românești comune
  simple: 'Ion Popescu',
  withAccents: 'Ștefan Țăranu',
  compound: 'Ana-Maria Ionescu',

  // Edge cases
  singleChar: 'X',
  veryLong: 'Wolfeschlegelsteinhausenbergerdorff',
  withApostrophe: "O'Brien",
  withNumbers: 'Ion123',

  // First/Last separate
  firstSimple: 'Ion',
  firstAccent: 'Ștefan',
  lastSimple: 'Popescu',
  lastAccent: 'Țărănescu',
}

// ============================================
// ADDRESSES - Adrese complete România
// ============================================
export const ADDRESSES = {
  // Valide
  simple: {
    street: 'Str. Victoriei nr. 10',
    city: 'București',
    county: 'Sector 1',
    postalCode: '010001',
  },
  withAccents: {
    street: 'Str. Ștefan cel Mare nr. 25, bl. A1, sc. B, ap. 15',
    city: 'Iași',
    county: 'Iași',
    postalCode: '700001',
  },
  minimal: {
    street: 'Str. Test 1',
    city: 'Cluj',
    county: 'Cluj',
    postalCode: '400001',
  },

  // Edge cases
  longStreet: {
    street: 'Strada foarte lungă cu multe detalii, bloc A1, scara B, etaj 5, apartament 42, interfon 123',
    city: 'București',
    county: 'Sector 3',
    postalCode: '030001',
  },
}

// ============================================
// POSTAL CODES - Coduri poștale România
// ============================================
export const POSTAL_CODES = {
  // Valide (6 cifre)
  bucuresti: '010001',
  cluj: '400001',
  iasi: '700001',
  timisoara: '300001',

  // Invalide
  empty: '',
  tooShort: '0100',
  tooLong: '01000123',
  withLetters: '01000A',
  withSpaces: '010 001',
}

// ============================================
// EXPORT PRINCIPAL - Folosește EDGE.category.value
// ============================================
export const EDGE = {
  strings: STRINGS,
  emails: EMAILS,
  phones: PHONES,
  prices: PRICES,
  quantities: QUANTITIES,
  names: NAMES,
  addresses: ADDRESSES,
  postalCodes: POSTAL_CODES,
}

// ============================================
// ARRAYS PENTRU test.each() - Playwright
// ============================================

/** Strings pentru validare formulare */
export const STRING_EDGE_CASES = [
  ['empty', STRINGS.empty],
  ['spaces', STRINGS.spaces],
  ['romanian chars', STRINGS.romanianChars],
  ['very long', STRINGS.veryLong],
  ['XSS attempt', STRINGS.xss],
  ['SQL injection', STRINGS.sqlInjection],
] as const

/** Emails pentru validare */
export const EMAIL_EDGE_CASES = [
  ['empty', EMAILS.empty, false],
  ['simple valid', EMAILS.simple, true],
  ['with plus', EMAILS.withPlus, true],
  ['no @', EMAILS.noAt, false],
  ['no domain', EMAILS.noDomain, false],
  ['with spaces', EMAILS.spaces, false],
] as const

/** Prețuri pentru calcule */
export const PRICE_EDGE_CASES = [
  ['zero', PRICES.zero],
  ['1 ban', PRICES.oneBan],
  ['sub-ban', PRICES.subBan],
  ['very large', PRICES.veryLarge],
  ['negative', PRICES.negative],
] as const

/** Cantități pentru coș */
export const QUANTITY_EDGE_CASES = [
  ['zero', QUANTITIES.zero],
  ['one', QUANTITIES.one],
  ['very large', QUANTITIES.veryLarge],
  ['negative', QUANTITIES.negative],
  ['decimal', QUANTITIES.decimal],
] as const

export default EDGE
