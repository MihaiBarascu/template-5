import type { CollectionConfig, CollectionAfterChangeHook, FieldHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { isSuperAdmin, isSuperAdminAccess } from '@/access/multiTenant'

/**
 * Revalidate cache when tenant changes (especially domain)
 */
const revalidateTenant: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context?.disableRevalidate) {
    // Revalidate tenant-specific tags
    // Tags MUST match cache tags in getTenantGlobal.ts and getDocument.ts:
    // - getTenantGlobal uses: tenant_${domain}, tenant_${tenantKey}
    // - getDocument uses: tenant_${tenantKey}
    revalidateTag(`tenant_${doc.id}`, { expire: 0 })
    revalidateTag(`tenant_${doc.slug}`, { expire: 0 })

    // Revalidate domain routing - CRITICAL: use tenant_ prefix to match cache tags
    if (doc.domain) {
      revalidateTag(`tenant_${doc.domain}`, { expire: 0 })
      // Also invalidate tenants collection cache for domain lookups
      revalidateTag('tenants', { expire: 0 })
    }

    // Revalidate root paths
    revalidatePath('/', 'layout')
    revalidatePath(`/${doc.slug}`, 'layout')

    req.payload.logger.info(`[Revalidate] Tenant ${doc.name} - slug: ${doc.slug}, domain: ${doc.domain}`)
  }
  return doc
}

/**
 * Generate URL-friendly slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '')          // Trim dashes from start/end
    .slice(0, 50)                     // Limit length
}

/**
 * Generate short random ID (4 chars)
 */
function generateShortId(): string {
  return Math.random().toString(36).substring(2, 6)
}

/**
 * Hook to auto-generate unique slug from name
 * If slug exists, adds random suffix (e.g., salon-bella-a7x3)
 */
const generateUniqueSlug: FieldHook = async ({ data, operation, req, originalDoc }) => {
  // Keep existing slug on update
  if (operation !== 'create' && originalDoc?.slug) {
    return originalDoc.slug
  }

  if (!data?.name) return undefined

  const baseSlug = generateSlug(data.name)

  // Check if slug exists
  const existing = await req.payload.find({
    collection: 'tenants',
    where: { slug: { equals: baseSlug } },
    limit: 1,
  })

  if (existing.docs.length === 0) {
    return baseSlug
  }

  // Add random suffix until unique
  for (let i = 0; i < 10; i++) {
    const candidateSlug = `${baseSlug}-${generateShortId()}`

    const check = await req.payload.find({
      collection: 'tenants',
      where: { slug: { equals: candidateSlug } },
      limit: 1,
    })

    if (check.docs.length === 0) {
      return candidateSlug
    }
  }

  // Fallback cu timestamp
  return `${baseSlug}-${Date.now().toString(36)}`
}

/**
 * Tenants Collection
 *
 * Central collection for multi-tenant architecture.
 * Each tenant represents a separate business/website.
 *
 * Based on official Payload multi-tenant example:
 * https://github.com/payloadcms/payload/tree/main/examples/multi-tenant
 */
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Tenant',
    plural: 'Tenants',
  },
  access: {
    // Only super-admins can create tenants
    create: isSuperAdminAccess,
    // Public read needed for domain-based tenant routing
    // Only exposes: id, name, slug, domain, status, plan (all non-sensitive)
    read: () => true,
    // Only super-admins or tenant-admins of this tenant can update
    update: ({ req }) => {
      if (!req.user) return false
      if (isSuperAdmin(req.user)) return true
      // Tenant admins can update their own tenant
      // This will be filtered by the plugin automatically
      return false
    },
    // Only super-admins can delete tenants
    delete: isSuperAdminAccess,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Administrare',
    defaultColumns: ['name', 'slug', 'domain', 'status', 'plan'],
    description: 'Gestionare clienți/site-uri multiple',
  },
  hooks: {
    afterChange: [revalidateTenant],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume',
      required: true,
      admin: {
        description: 'Numele afacerii/tenant-ului',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [generateUniqueSlug],
      },
      admin: {
        readOnly: true,
        description: 'Auto-generat din nume (ex: "Salon Bella" → "salon-bella")',
      },
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Domeniu',
      index: true,
      admin: {
        description: 'Pentru domain-based routing (ex: frizerie.multiwebsite.org)',
      },
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      label: 'Conținut Public',
      defaultValue: true,
      admin: {
        description: 'Dacă e bifat, paginile sunt publice fără autentificare',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'trial',
      options: [
        { label: 'Activ', value: 'active' },
        { label: 'Trial', value: 'trial' },
        { label: 'Suspendat', value: 'suspended' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'plan',
      type: 'select',
      label: 'Plan',
      required: true,
      defaultValue: 'basic',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiră La',
      admin: {
        position: 'sidebar',
        description: 'Data expirării abonamentului (opțional)',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
  ],
  timestamps: true,
}
