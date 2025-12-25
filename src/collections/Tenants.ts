import type { CollectionConfig } from 'payload'
import { isSuperAdmin, isSuperAdminAccess } from '@/access/multiTenant'

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
      admin: {
        description: 'Folosit în URL: /[slug]/pagina',
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
