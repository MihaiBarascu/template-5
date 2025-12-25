import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { revalidateTag } from 'next/cache'
import { linkFields } from '@/fields/link'

/**
 * Footer Collection (converted from Global)
 * Each tenant has their own footer configuration.
 */
export const FooterCollection: CollectionConfig = {
  slug: 'tenant-footers',
  labels: {
    singular: 'Footer Tenant',
    plural: 'Footers Tenant',
  },
  admin: {
    useAsTitle: 'variant',
    group: 'Setari Tenant',
    description: 'Configurare footer: coloane, linkuri, contact',
    defaultColumns: ['tenant', 'variant', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const tenantId = typeof doc.tenant === 'string' ? doc.tenant : doc.tenant?.id
        if (tenantId) {
          try {
            revalidateTag(`tenant-${tenantId}`, "max")
            revalidateTag(`tenant-footers-${tenantId}`, "max")
          } catch (e) {
            req.payload.logger.warn('Could not revalidate footer cache')
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta footer',
      defaultValue: 'columns-4',
      options: [
        { label: '4 Coloane', value: 'columns-4' },
        { label: '3 Coloane', value: 'columns-3' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu newsletter', value: 'with-newsletter' },
      ],
    },
    {
      name: 'colorScheme',
      type: 'select',
      label: 'Schema culori',
      defaultValue: 'dark',
      options: [
        { label: 'Întunecat', value: 'dark' },
        { label: 'Deschis', value: 'light' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Coloane',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', label: 'Titlu coloana' },
        {
          name: 'type',
          type: 'select',
          label: 'Tip continut',
          defaultValue: 'links',
          options: [
            { label: 'Link-uri', value: 'links' },
            { label: 'Contact', value: 'contact' },
            { label: 'Program', value: 'schedule' },
            { label: 'Text liber', value: 'text' },
            { label: 'Social Media', value: 'social' },
          ],
        },
        {
          name: 'links',
          type: 'array',
          label: 'Link-uri',
          admin: { condition: (_, siblingData) => siblingData?.type === 'links' },
          fields: [
            { name: 'label', type: 'text', label: 'Text', required: true },
            ...linkFields,
          ],
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Continut',
          admin: { condition: (_, siblingData) => siblingData?.type === 'text' },
        },
      ],
    },
    { name: 'showSocialLinks', type: 'checkbox', label: 'Afiseaza social media', defaultValue: true },
    { name: 'showContactInfo', type: 'checkbox', label: 'Afiseaza contact', defaultValue: true },
    { name: 'showWorkingHours', type: 'checkbox', label: 'Afiseaza program', defaultValue: false },
    {
      name: 'copyright',
      type: 'text',
      label: 'Text copyright',
      defaultValue: '© {year} {businessName}. Toate drepturile rezervate.',
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Link-uri legale',
      fields: [
        { name: 'label', type: 'text', label: 'Text', required: true },
        ...linkFields,
      ],
    },
  ],
  timestamps: true,
}
