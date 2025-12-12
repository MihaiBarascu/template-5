/**
 * Business types configuration for e2e tests
 * Single source of truth for all business type testing
 *
 * NOTE: DESIGN_VARIANT system has been removed.
 * Configuration is now defined directly in src/seed/seeder-config.ts
 */

export type BusinessType =
  | 'frizerie'
  | 'dentist'
  | 'restaurant'
  | 'auto-service'
  | 'salon'
  | 'avocat'
  | 'constructii'
  | 'magazin'
  | 'fitness'

export interface BusinessConfig {
  type: BusinessType
  name: string
  brandName: string
  heroText: RegExp | string
  hasProducts?: boolean
  hasPortfolio?: boolean
  hasEcommerce?: boolean // Full checkout flow
  sections: string[]
}

export const BUSINESS_CONFIGS: BusinessConfig[] = [
  {
    type: 'frizerie',
    name: 'Frizerie / Barbershop',
    brandName: 'Barber Shop',
    heroText: /frizerie|barbershop|tuns|barber/i,
    sections: ['servicii', 'echipa', 'testimoniale', 'faq', 'contact'],
  },
  {
    type: 'dentist',
    name: 'Cabinet Stomatologic',
    brandName: 'DentalMed',
    heroText: /dental|stomatolog|dinti|zambet/i,
    sections: ['servicii', 'echipa', 'testimoniale', 'faq', 'contact'],
  },
  {
    type: 'restaurant',
    name: 'Restaurant / Cafenea',
    brandName: 'La Copac',
    heroText: /restaurant|cafenea|meniu|bucatarie/i,
    sections: ['meniu', 'galerie', 'echipa', 'testimoniale', 'contact'],
  },
  {
    type: 'auto-service',
    name: 'Service Auto',
    brandName: 'AutoPro',
    heroText: /auto|service|masina|reparatii/i,
    sections: ['servicii', 'echipa', 'galerie', 'faq', 'contact'],
  },
  {
    type: 'salon',
    name: 'Salon Infrumusetare',
    brandName: 'Beauty Elena',
    heroText: /beauty|salon|frumusete|infrumusetare/i,
    sections: ['servicii', 'echipa', 'galerie', 'contact'],
  },
  {
    type: 'avocat',
    name: 'Cabinet Avocat',
    brandName: 'Avocat Ionescu',
    heroText: /avocat|juridic|drept|consultanta/i,
    sections: ['servicii', 'echipa', 'testimoniale', 'faq', 'contact'],
  },
  {
    type: 'constructii',
    name: 'Firma Constructii',
    brandName: 'BuildPro',
    heroText: /constructii|proiecte|renovare|building/i,
    hasPortfolio: true,
    sections: ['servicii', 'portofoliu', 'echipa', 'testimoniale', 'faq', 'contact'],
  },
  {
    type: 'magazin',
    name: 'Magazin Online',
    brandName: 'EcoShop',
    heroText: /magazin|produse|shop|eco/i,
    hasProducts: true,
    hasEcommerce: true, // Full checkout flow with payment
    sections: ['produse', 'testimoniale', 'faq', 'contact'],
  },
  {
    type: 'fitness',
    name: 'Sala Fitness',
    brandName: 'FitZone',
    heroText: /fitness|sala|antrenament|sport/i,
    sections: ['servicii', 'echipa', 'galerie', 'testimoniale', 'faq', 'contact'],
  },
]
