import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { revalidateTag } from 'next/cache'

/**
 * Logo Collection (converted from Global)
 * Each tenant has their own logo configuration.
 */
export const LogoCollection: CollectionConfig = {
  slug: 'tenant-logos',
  labels: {
    singular: 'Logo Tenant',
    plural: 'Logos Tenant',
  },
  admin: {
    useAsTitle: 'text',
    group: 'Setari Tenant',
    description: 'Logo-ul site-ului: text, imagine sau ambele',
    defaultColumns: ['tenant', 'type', 'text', 'updatedAt'],
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
            revalidateTag(`tenant-logos-${tenantId}`, "max")
          } catch (e) {
            req.payload.logger.warn('Could not revalidate logo cache')
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Tip logo',
      defaultValue: 'text',
      options: [
        { label: 'Doar text', value: 'text' },
        { label: 'Doar imagine', value: 'image' },
        { label: 'Imagine + Text', value: 'both' },
      ],
    },
    {
      name: 'text',
      type: 'text',
      label: 'Text logo',
      admin: { condition: (_, siblingData) => ['text', 'both'].includes(siblingData?.type) },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine logo',
      admin: { condition: (_, siblingData) => ['image', 'both'].includes(siblingData?.type) },
    },
    {
      name: 'imageDark',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine logo (varianta inchisa)',
      admin: {
        description: 'Pentru utilizare pe fundal deschis',
        condition: (_, siblingData) => ['image', 'both'].includes(siblingData?.type),
      },
    },
    {
      name: 'imageLight',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine logo (varianta deschisa)',
      admin: {
        description: 'Pentru utilizare pe fundal inchis',
        condition: (_, siblingData) => ['image', 'both'].includes(siblingData?.type),
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'size',
      type: 'group',
      label: 'Dimensiuni',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'height', type: 'number', label: 'Inaltime (px)', defaultValue: 40, admin: { width: '50%' } },
            { name: 'heightMobile', type: 'number', label: 'Inaltime mobile (px)', defaultValue: 32, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
