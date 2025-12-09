/**
 * Tax/VAT Calculation Utilities
 *
 * Principii:
 * - Preturile in DB pot fi CU sau FARA TVA (configurat in ShopSettings)
 * - Pentru B2C Romania: preturile afisate TREBUIE sa includa TVA (obligatoriu legal)
 * - Romania TVA (din august 2025): 21% standard, 11% redus
 */

export type TaxCategory = 'standard' | 'reduced' | 'zero'

export interface VatRates {
  standard: number
  reduced: number
  zero: number
}

export interface TaxSettings {
  vatEnabled: boolean
  pricesIncludeVat: boolean
  displayPricesWithVat: boolean
  vatRates: VatRates
  defaultVatRate: TaxCategory
  showVatBreakdown: boolean
}

// Default values (Romania din august 2025)
const DEFAULT_VAT_RATES: VatRates = {
  standard: 21,
  reduced: 11,
  zero: 0,
}

const DEFAULT_TAX_SETTINGS: TaxSettings = {
  vatEnabled: true,
  pricesIncludeVat: true,  // Recomandat pentru B2C Romania
  displayPricesWithVat: true,  // Obligatoriu legal pentru B2C Romania
  vatRates: DEFAULT_VAT_RATES,
  defaultVatRate: 'standard',
  showVatBreakdown: true,
}

/**
 * Get VAT rate percentage for a category
 */
export function getVatRate(
  category: TaxCategory = 'standard',
  vatRates: VatRates = DEFAULT_VAT_RATES,
): number {
  return vatRates[category] ?? vatRates.standard
}

/**
 * Calculate price with VAT from net price
 * Formula: priceWithVat = priceNet * (1 + vatRate/100)
 */
export function addVat(priceNet: number, vatRate: number): number {
  return priceNet * (1 + vatRate / 100)
}

/**
 * Calculate net price from price with VAT
 * Formula: priceNet = priceWithVat / (1 + vatRate/100)
 */
export function removeVat(priceWithVat: number, vatRate: number): number {
  return priceWithVat / (1 + vatRate / 100)
}

/**
 * Calculate VAT amount from net price
 */
export function calculateVat(priceNet: number, vatRate: number): number {
  return priceNet * (vatRate / 100)
}

/**
 * Get display price based on settings
 *
 * @param priceInDb - Price stored in database
 * @param taxCategory - Product tax category
 * @param settings - Tax settings from ShopSettings global
 * @returns Price to display on frontend
 */
export function getDisplayPrice(
  priceInDb: number,
  taxCategory: TaxCategory = 'standard',
  settings: Partial<TaxSettings> = {},
): number {
  const mergedSettings = { ...DEFAULT_TAX_SETTINGS, ...settings }

  if (!mergedSettings.vatEnabled) {
    return priceInDb
  }

  const vatRate = getVatRate(taxCategory, mergedSettings.vatRates)

  // If prices in DB include VAT
  if (mergedSettings.pricesIncludeVat) {
    // Want to display with VAT? Return as-is
    if (mergedSettings.displayPricesWithVat) {
      return priceInDb
    }
    // Want to display without VAT? Remove it
    return removeVat(priceInDb, vatRate)
  }

  // Prices in DB are without VAT (recommended)
  // Want to display with VAT? Add it
  if (mergedSettings.displayPricesWithVat) {
    return addVat(priceInDb, vatRate)
  }
  // Want to display without VAT? Return as-is
  return priceInDb
}

/**
 * Calculate cart totals with VAT breakdown
 */
export interface CartItem {
  price: number
  quantity: number
  taxCategory?: TaxCategory
}

export interface CartTotals {
  subtotal: number // Total without VAT
  vatAmount: number // Total VAT
  total: number // Total with VAT
  vatBreakdown: Array<{
    rate: number
    amount: number
  }>
}

export function calculateCartTotals(
  items: CartItem[],
  settings: Partial<TaxSettings> = {},
): CartTotals {
  const mergedSettings = { ...DEFAULT_TAX_SETTINGS, ...settings }

  let subtotal = 0
  const vatByRate: Record<number, number> = {}

  for (const item of items) {
    const taxCategory = item.taxCategory || mergedSettings.defaultVatRate
    const vatRate = getVatRate(taxCategory, mergedSettings.vatRates)

    let netPrice = item.price
    // If DB prices include VAT, remove it for calculations
    if (mergedSettings.pricesIncludeVat) {
      netPrice = removeVat(item.price, vatRate)
    }

    const lineTotal = netPrice * item.quantity
    subtotal += lineTotal

    if (mergedSettings.vatEnabled && vatRate > 0) {
      const vatAmount = calculateVat(lineTotal, vatRate)
      vatByRate[vatRate] = (vatByRate[vatRate] || 0) + vatAmount
    }
  }

  const vatAmount = Object.values(vatByRate).reduce((sum, v) => sum + v, 0)
  const total = subtotal + vatAmount

  const vatBreakdown = Object.entries(vatByRate).map(([rate, amount]) => ({
    rate: Number(rate),
    amount,
  }))

  return {
    subtotal: roundPrice(subtotal),
    vatAmount: roundPrice(vatAmount),
    total: roundPrice(total),
    vatBreakdown,
  }
}

/**
 * Round price to 2 decimal places
 */
export function roundPrice(price: number): number {
  return Math.round(price * 100) / 100
}

/**
 * Format price for display
 */
export function formatPrice(
  price: number,
  _currency: string = 'RON',
  currencySymbol: string = 'lei',
  position: 'before' | 'after' = 'after',
): string {
  const formattedPrice = price.toFixed(2)

  if (position === 'before') {
    return `${currencySymbol}${formattedPrice}`
  }
  return `${formattedPrice} ${currencySymbol}`
}

/**
 * Format price with VAT indicator
 */
export function formatPriceWithVatIndicator(
  price: number,
  includesVat: boolean,
  currencySymbol: string = 'lei',
  position: 'before' | 'after' = 'after',
): string {
  const formatted = formatPrice(price, 'RON', currencySymbol, position)
  const indicator = includesVat ? '(TVA inclus)' : '(fara TVA)'
  return `${formatted} ${indicator}`
}
