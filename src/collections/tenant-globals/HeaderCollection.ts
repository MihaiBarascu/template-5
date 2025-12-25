import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { revalidateTag } from 'next/cache'
import { linkFields } from '@/fields/link'

/**
 * Header Collection (converted from Global)
 * Each tenant has their own header configuration.
 */
export const HeaderCollection: CollectionConfig = {
  slug: 'tenant-headers',
  labels: {
    singular: 'Header Tenant',
    plural: 'Headers Tenant',
  },
  admin: {
    useAsTitle: 'variant',
    group: 'Setari Tenant',
    description: 'Configurare header: navigatie, logo, top bar',
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
            revalidateTag(`tenant-headers-${tenantId}`, "max")
          } catch (e) {
            req.payload.logger.warn('Could not revalidate header cache')
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
      label: 'Varianta header',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu TopBar', value: 'with-topbar' },
        { label: 'Full Width', value: 'full-width' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'showTopBar',
      type: 'checkbox',
      label: 'Afiseaza Top Bar',
      defaultValue: false,
    },
    {
      name: 'topBar',
      type: 'group',
      label: 'Configurare Top Bar',
      admin: { condition: (_, siblingData) => siblingData?.showTopBar === true },
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Culoare fundal',
          defaultValue: 'dark',
          options: [
            { label: 'Inchis', value: 'dark' },
            { label: 'Primary', value: 'primary' },
            { label: 'Transparent', value: 'transparent' },
            { label: 'Deschis', value: 'light' },
          ],
        },
        { name: 'showPhone', type: 'checkbox', label: 'Afiseaza telefon', defaultValue: true },
        { name: 'showEmail', type: 'checkbox', label: 'Afiseaza email', defaultValue: true },
        { name: 'showSocial', type: 'checkbox', label: 'Afiseaza social media', defaultValue: true },
        { name: 'customText', type: 'text', label: 'Mesaj personalizat' },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Meniu navigare',
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', label: 'Text', required: true },
        ...linkFields,
        { name: 'hasSubmenu', type: 'checkbox', label: 'Are submeniu', defaultValue: false },
        {
          name: 'submenu',
          type: 'array',
          label: 'Submeniu',
          admin: { condition: (_, siblingData) => siblingData?.hasSubmenu },
          fields: [
            { name: 'label', type: 'text', label: 'Text', required: true },
            ...linkFields,
            { name: 'description', type: 'text', label: 'Descriere' },
          ],
        },
      ],
    },
    { name: 'showSearch', type: 'checkbox', label: 'Afiseaza buton cautare', defaultValue: false },
    { name: 'showCart', type: 'checkbox', label: 'Afiseaza cos cumparaturi', defaultValue: false },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Afiseaza buton CTA', defaultValue: true },
        { name: 'label', type: 'text', label: 'Text buton', defaultValue: 'Programeaza-te' },
        { name: 'link', type: 'text', label: 'Link', defaultValue: '/contact' },
        {
          name: 'variant',
          type: 'select',
          label: 'Stil',
          defaultValue: 'default',
          options: [
            { label: 'Primary', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
    { name: 'sticky', type: 'checkbox', label: 'Header sticky', defaultValue: true },
    { name: 'isTransparent', type: 'checkbox', label: 'Header transparent', defaultValue: false },
  ],
  timestamps: true,
}
