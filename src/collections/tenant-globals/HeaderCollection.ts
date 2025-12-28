import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { createTenantRevalidateHook } from '@/hooks/revalidateTenantGlobal'
import { linkFields } from '@/fields/link'

/**
 * Header Collection (converted from Global)
 * Each tenant has their own header configuration.
 */
export const HeaderCollection: CollectionConfig = {
  slug: 'tenant-headers',
  labels: {
    singular: 'Header',
    plural: 'Headers',
  },
  admin: {
    useAsTitle: 'variant',
    group: 'Setari',
    description: 'Navigatie, logo, top bar',
    defaultColumns: ['tenant', 'variant', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [createTenantRevalidateHook('tenant-headers')],
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
          name: 'layout',
          type: 'select',
          label: 'Layout',
          defaultValue: 'social-left',
          options: [
            { label: 'Social stanga, contact dreapta', value: 'social-left' },
            { label: 'Contact stanga, social dreapta', value: 'contact-left' },
            { label: 'Tot centrat', value: 'centered' },
            { label: 'Doar contact', value: 'contact-only' },
            { label: 'Doar mesaj', value: 'message-only' },
            { label: 'Mesaj + contact stanga, social dreapta', value: 'message-left' },
          ],
        },
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
        {
          name: 'customSocialLinks',
          type: 'array',
          label: 'Linkuri social personalizate',
          admin: { description: 'Lasa gol pentru a folosi linkurile din Business Info' },
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platforma',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter/X', value: 'twitter' },
              ],
            },
            { name: 'url', type: 'text', label: 'URL' },
          ],
        },
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
    {
      name: 'transparentTextColor',
      type: 'select',
      label: 'Culoare text header transparent',
      defaultValue: 'white',
      options: [
        { label: 'Alb', value: 'white' },
        { label: 'Inchis', value: 'dark' },
        { label: 'Auto', value: 'auto' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.isTransparent,
      },
    },
  ],
  timestamps: true,
}
