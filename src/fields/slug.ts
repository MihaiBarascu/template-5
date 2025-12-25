import type { Field } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'

/**
 * Slug Field Generator
 *
 * Creates a slug field that auto-generates from another field.
 *
 * Multi-Tenant Note:
 * - We use index: true but NOT unique: true
 * - The multi-tenant plugin adds a compound index on (tenant, slug)
 * - This allows the same slug in different tenants
 *
 * @param fieldToUse - The field to generate the slug from (default: 'title')
 */
export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'URL-ul paginii (generat automat din titlu)',
  },
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
  index: true,
  // IMPORTANT: Do NOT use unique: true in multi-tenant mode
  // The multi-tenant plugin handles uniqueness per-tenant
  // unique: true would prevent same slug across different tenants
  label: 'Slug',
  required: true,
})

/**
 * Slug Field with global uniqueness
 *
 * Use this only for collections that should have truly unique slugs
 * across all tenants (e.g., system pages, shared resources).
 */
export const uniqueSlugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'URL-ul paginii (generat automat din titlu)',
  },
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
  index: true,
  unique: true,
  label: 'Slug',
  required: true,
})
