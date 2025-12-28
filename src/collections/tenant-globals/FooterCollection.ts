import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { createTenantRevalidateHook } from '@/hooks/revalidateTenantGlobal'
import { linkFields } from '@/fields/link'

/**
 * Footer Collection (converted from Global)
 * Each tenant has their own footer configuration.
 */
export const FooterCollection: CollectionConfig = {
  slug: 'tenant-footers',
  labels: {
    singular: 'Footer',
    plural: 'Footers',
  },
  admin: {
    useAsTitle: 'variant',
    group: 'Setari',
    description: 'Coloane, linkuri, contact',
    defaultColumns: ['tenant', 'variant', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [createTenantRevalidateHook('tenant-footers')],
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
    // Background settings
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine fundal',
      admin: {
        description: 'Imagine de fundal pentru footer (optional)',
      },
    },
    {
      name: 'backgroundOpacity',
      type: 'number',
      label: 'Opacitate fundal (%)',
      defaultValue: 20,
      min: 0,
      max: 100,
      admin: {
        condition: (data) => !!data?.backgroundImage,
      },
    },
    // Decorative element settings
    {
      name: 'decorativeImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Element decorativ',
      admin: {
        description: 'Imagine decorativa (ex: logo mare, mascota)',
      },
    },
    {
      name: 'decorativePosition',
      type: 'select',
      label: 'Pozitie element decorativ',
      defaultValue: 'left',
      options: [
        { label: 'Stanga', value: 'left' },
        { label: 'Dreapta', value: 'right' },
        { label: 'Centru', value: 'center' },
        { label: 'Stanga jos', value: 'bottom-left' },
        { label: 'Dreapta jos', value: 'bottom-right' },
      ],
      admin: {
        condition: (data) => !!data?.decorativeImage,
      },
    },
    {
      name: 'decorativeOpacity',
      type: 'number',
      label: 'Opacitate element decorativ (%)',
      defaultValue: 30,
      min: 0,
      max: 100,
      admin: {
        condition: (data) => !!data?.decorativeImage,
      },
    },
    {
      name: 'decorativeSize',
      type: 'select',
      label: 'Marime element decorativ',
      defaultValue: 'medium',
      options: [
        { label: 'Mic', value: 'small' },
        { label: 'Mediu', value: 'medium' },
        { label: 'Mare', value: 'large' },
        { label: 'Foarte mare', value: 'xl' },
      ],
      admin: {
        condition: (data) => !!data?.decorativeImage,
      },
    },
    // Payment methods (for shops)
    {
      name: 'showPaymentIcons',
      type: 'checkbox',
      label: 'Afiseaza metode de plata',
      defaultValue: false,
    },
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'Metode de plata',
      admin: {
        condition: (data) => data?.showPaymentIcons,
      },
      fields: [
        {
          name: 'method',
          type: 'select',
          label: 'Metoda',
          options: [
            { label: 'Visa', value: 'visa' },
            { label: 'Mastercard', value: 'mastercard' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Apple Pay', value: 'applepay' },
            { label: 'Google Pay', value: 'googlepay' },
            { label: 'Plata la livrare', value: 'cash' },
            { label: 'Transfer bancar', value: 'transfer' },
          ],
        },
      ],
    },
    // Badges (trust badges, certificates)
    {
      name: 'badges',
      type: 'array',
      label: 'Badge-uri si Certificari',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          required: true,
        },
        { name: 'alt', type: 'text', label: 'Text alternativ' },
        { name: 'link', type: 'text', label: 'Link (optional)' },
      ],
    },
  ],
  timestamps: true,
}
