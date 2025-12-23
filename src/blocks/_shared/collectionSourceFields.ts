import type { Field, CollectionSlug } from 'payload'

/**
 * Collection Source Fields Helper - SIMPLIFIED
 *
 * Generates fields for blocks that fetch data from collections:
 * - limit: number of items to show
 * - filterByCategory: filter by category (optional)
 * - onlyFeatured: show only featured items (optional)
 *
 * REMOVED: 'manual' and 'custom' source options (were never used in RenderBlocks)
 */

export interface CollectionSourceOptions {
  /** The slug of the collection to fetch from */
  collectionSlug: string

  /** Human-readable label for the collection */
  collectionLabel: string

  /** Optional category collection for filtering */
  categoryRelation?: string

  /** Human-readable label for categories */
  categoryLabel?: string

  /** Default limit value */
  defaultLimit?: number

  /** Show the 'onlyFeatured' filter option */
  showFeaturedFilter?: boolean

  /** Label for featured filter */
  featuredLabel?: string
}

export function collectionSourceFields(options: CollectionSourceOptions): Field[] {
  const {
    collectionLabel,
    categoryRelation,
    categoryLabel = 'Categorii',
    defaultLimit = 6,
    showFeaturedFilter = true,
    featuredLabel = `Doar ${collectionLabel.toLowerCase()} featured`,
  } = options

  const fields: Field[] = [
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: defaultLimit,
      min: 1,
      max: 100,
    },
  ]

  // Category filter (only if collection has categories)
  if (categoryRelation) {
    fields.push({
      name: 'filterByCategory',
      type: 'relationship',
      relationTo: categoryRelation as CollectionSlug,
      hasMany: true,
      label: `Filtreaza dupa ${categoryLabel.toLowerCase()}`,
    })
  }

  // Featured filter
  if (showFeaturedFilter) {
    fields.push({
      name: 'onlyFeatured',
      type: 'checkbox',
      label: featuredLabel,
      defaultValue: false,
    })
  }

  return fields
}

/**
 * Preset configurations for common collections
 */

export const servicesSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'services',
    collectionLabel: 'Servicii',
    categoryRelation: 'service-categories',
    categoryLabel: 'Categorie',
    featuredLabel: 'Doar servicii populare',
    defaultLimit: 6,
    ...overrides,
  })

export const teamSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'team',
    collectionLabel: 'Membri echipa',
    featuredLabel: 'Doar membri featured',
    defaultLimit: 4,
    ...overrides,
  })

export const testimonialsSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'testimonials',
    collectionLabel: 'Testimoniale',
    categoryRelation: 'testimonial-categories',
    categoryLabel: 'Categorie',
    featuredLabel: 'Doar testimoniale featured',
    defaultLimit: 6,
    ...overrides,
  })

export const productsSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'products',
    collectionLabel: 'Produse',
    categoryRelation: 'product-categories',
    categoryLabel: 'Categorie',
    featuredLabel: 'Doar produse recomandate',
    defaultLimit: 8,
    ...overrides,
  })

export const portfolioSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'portfolio',
    collectionLabel: 'Proiecte',
    categoryRelation: 'categories',
    categoryLabel: 'Categorie',
    featuredLabel: 'Doar proiecte recomandate',
    defaultLimit: 6,
    ...overrides,
  })

export const faqSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'faq',
    collectionLabel: 'Intrebari',
    categoryRelation: 'categories',
    categoryLabel: 'Categorie',
    showFeaturedFilter: false,
    defaultLimit: 10,
    ...overrides,
  })

export const postsSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'posts',
    collectionLabel: 'Articole',
    categoryRelation: 'categories',
    categoryLabel: 'Categorie',
    showFeaturedFilter: false,
    defaultLimit: 3,
    ...overrides,
  })

export const subscriptionsSourceFields = (overrides: Partial<CollectionSourceOptions> = {}) =>
  collectionSourceFields({
    collectionSlug: 'subscriptions',
    collectionLabel: 'Abonamente',
    showFeaturedFilter: false,
    defaultLimit: 4,
    ...overrides,
  })
