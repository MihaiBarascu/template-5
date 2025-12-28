'use client'

/**
 * ShopSettings Provider
 *
 * Provides shop settings (TVA, shipping, etc.) to client components.
 * Settings are fetched on server in layout and passed to this provider.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { TenantShopSetting as ShopSetting } from '@/payload-types'

// Tax category type
export type TaxCategory = 'standard' | 'reduced' | 'zero'

// VAT rates interface
export interface VatRates {
  standard: number
  reduced: number
  zero: number
}

// Tax settings interface
export interface TaxSettings {
  vatEnabled: boolean
  pricesIncludeVat: boolean  // If false, prices in DB are without VAT
  displayPricesWithVat: boolean  // Always true for B2C Romania
  vatRates: VatRates  // All VAT rates
  defaultVatRate: TaxCategory  // Default category for products without taxCategory
  showVatBreakdown: boolean
}

// Shipping method interface
export interface ShippingMethod {
  id: string
  enabled: boolean
  label: string
  deliveryTime?: string
  price: number
  freeAbove?: number | null
}

// Full shop settings interface
export interface ShopSettings {
  enabled: boolean
  currency: string
  currencySymbol: string
  pricePosition: 'before' | 'after'
  tax: TaxSettings
  shippingCost: number
  freeShippingThreshold: number | null
  orderMinimum: number | null
  shippingMethods: ShippingMethod[]
}

// Default shipping methods (fallback if none configured)
const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    enabled: true,
    label: 'Livrare standard',
    deliveryTime: '2-4 zile lucratoare',
    price: 20,
    freeAbove: 200,
  },
]

// Default VAT rates (Romania din august 2025)
const DEFAULT_VAT_RATES: VatRates = {
  standard: 21,
  reduced: 11,
  zero: 0,
}

// Default values
const DEFAULT_SETTINGS: ShopSettings = {
  enabled: false,
  currency: 'RON',
  currencySymbol: 'lei',
  pricePosition: 'after',
  tax: {
    vatEnabled: true,
    pricesIncludeVat: true,  // Default: prices in DB include VAT
    displayPricesWithVat: true,
    vatRates: DEFAULT_VAT_RATES,
    defaultVatRate: 'standard',
    showVatBreakdown: true,
  },
  shippingCost: 20,
  freeShippingThreshold: 200,
  orderMinimum: null,
  shippingMethods: DEFAULT_SHIPPING_METHODS,
}

const ShopSettingsContext = createContext<ShopSettings>(DEFAULT_SETTINGS)

interface ShopSettingsProviderProps {
  children: React.ReactNode
  settings: ShopSetting | null
}

/**
 * Parse raw ShopSettings global into typed settings
 */
function parseShopSettings(raw: ShopSetting | null): ShopSettings {
  if (!raw) return DEFAULT_SETTINGS

  // Parse shipping methods from admin
  let shippingMethods: ShippingMethod[] = DEFAULT_SHIPPING_METHODS

  if (raw.shippingMethods && Array.isArray(raw.shippingMethods) && raw.shippingMethods.length > 0) {
    shippingMethods = raw.shippingMethods
      .filter((m): m is NonNullable<typeof m> => m !== null && m !== undefined)
      .map((m) => ({
        id: m.id || 'standard',
        enabled: m.enabled ?? true,
        label: m.label || 'Livrare',
        deliveryTime: m.deliveryTime || undefined,
        price: m.price ?? 0,
        freeAbove: m.freeAbove ?? null,
      }))
      .filter((m) => m.enabled) // Only include enabled methods
  } else if (raw.shippingCost !== undefined) {
    // Fallback: create default method from legacy shippingCost field
    shippingMethods = [{
      id: 'standard',
      enabled: true,
      label: 'Livrare standard',
      deliveryTime: '2-4 zile lucratoare',
      price: raw.shippingCost ?? 20,
      freeAbove: raw.freeShippingThreshold ?? null,
    }]
  }

  return {
    enabled: raw.enabled ?? false,
    currency: raw.currency ?? 'RON',
    currencySymbol: raw.currencySymbol ?? 'lei',
    pricePosition: (raw.pricePosition as 'before' | 'after') ?? 'after',
    tax: {
      vatEnabled: raw.vatEnabled ?? true,
      pricesIncludeVat: raw.pricesIncludeVat ?? true,
      displayPricesWithVat: raw.displayPricesWithVat ?? true,
      vatRates: {
        standard: raw.vatRates?.standard ?? 21,
        reduced: raw.vatRates?.reduced ?? 11,
        zero: 0,
      },
      defaultVatRate: (raw.defaultVatRate as TaxCategory) ?? 'standard',
      showVatBreakdown: raw.showVatBreakdown ?? true,
    },
    shippingCost: raw.shippingCost ?? 20,
    freeShippingThreshold: raw.freeShippingThreshold ?? null,
    orderMinimum: raw.orderMinimum ?? null,
    shippingMethods,
  }
}

// Extend window type for shop settings
declare global {
  interface Window {
    __SHOP_SETTINGS__?: ShopSetting
  }
}

export function ShopSettingsProvider({ children, settings }: ShopSettingsProviderProps) {
  // Initialize with settings from prop (server-side) or DEFAULT_SETTINGS (client fallback)
  const [parsedSettings, setParsedSettings] = useState(() => parseShopSettings(settings))

  // After mount, ensure we have correct settings from window if context has defaults
  // This handles HMR/Turbopack issues in dev mode where context might reset
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__SHOP_SETTINGS__) {
      const windowSettings = parseShopSettings(window.__SHOP_SETTINGS__)
      // Update if current settings differ from window settings
      // Compare key VAT values to detect stale defaults
      if (windowSettings.tax.pricesIncludeVat !== parsedSettings.tax.pricesIncludeVat ||
          windowSettings.tax.vatEnabled !== parsedSettings.tax.vatEnabled ||
          windowSettings.currencySymbol !== parsedSettings.currencySymbol) {
        setParsedSettings(windowSettings)
      }
    }
  }, [parsedSettings.tax.pricesIncludeVat, parsedSettings.tax.vatEnabled, parsedSettings.currencySymbol])

  // Also update if prop changes (for revalidation)
  useEffect(() => {
    if (settings) {
      setParsedSettings(parseShopSettings(settings))
    }
  }, [settings])

  return (
    <ShopSettingsContext.Provider value={parsedSettings}>
      {children}
    </ShopSettingsContext.Provider>
  )
}

/**
 * Hook to access shop settings in client components
 * Returns consistent values between server and client to avoid hydration mismatch
 */
export function useShopSettings(): ShopSettings {
  const contextSettings = useContext(ShopSettingsContext)

  // Always return context settings during render to maintain SSR/hydration consistency
  // The context is updated via useEffect in ShopSettingsProvider after hydration
  return contextSettings
}

/**
 * Get VAT rate for a specific tax category
 */
function getVatRate(category: TaxCategory, vatRates: VatRates): number {
  return vatRates[category] ?? vatRates.standard
}

/**
 * Calculate display price based on VAT settings
 *
 * @param priceInDb - Price stored in database
 * @param settings - Shop settings (or just tax settings)
 * @param taxCategory - Product's tax category (optional, uses default if not provided)
 * @returns Price to display on frontend
 */
export function getDisplayPrice(
  priceInDb: number,
  settings: ShopSettings | TaxSettings,
  taxCategory?: TaxCategory
): number {
  const tax = 'tax' in settings ? settings.tax : settings
  const category = taxCategory ?? tax.defaultVatRate
  const vatRate = getVatRate(category, tax.vatRates)

  if (!tax.vatEnabled) {
    return priceInDb
  }

  // If prices in DB already include VAT, return as-is
  if (tax.pricesIncludeVat) {
    return priceInDb
  }

  // Prices in DB are without VAT - add VAT for display
  // Formula: displayPrice = priceInDb * (1 + vatRate/100)
  return priceInDb * (1 + vatRate / 100)
}

/**
 * Get the base price (without VAT) for storing in orders
 *
 * @param priceInDb - Price stored in database
 * @param settings - Shop settings
 * @param taxCategory - Product's tax category (optional, uses default if not provided)
 * @returns Price without VAT (for order storage)
 */
export function getBasePrice(
  priceInDb: number,
  settings: ShopSettings | TaxSettings,
  taxCategory?: TaxCategory
): number {
  const tax = 'tax' in settings ? settings.tax : settings
  const category = taxCategory ?? tax.defaultVatRate
  const vatRate = getVatRate(category, tax.vatRates)

  if (!tax.vatEnabled) {
    return priceInDb
  }

  // If prices in DB already include VAT, remove it
  if (tax.pricesIncludeVat) {
    // Formula: basePrice = priceWithVat / (1 + vatRate/100)
    return priceInDb / (1 + vatRate / 100)
  }

  // Prices in DB are already without VAT
  return priceInDb
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  amount: number,
  currencySymbol: string = 'lei',
  position: 'before' | 'after' = 'after'
): string {
  const formatted = amount.toFixed(2).replace('.', ',')

  if (position === 'before') {
    return `${currencySymbol}${formatted}`
  }
  return `${formatted} ${currencySymbol}`
}
