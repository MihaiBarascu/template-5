import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { linkFields } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
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
        { label: 'Minimal (o linie)', value: 'minimal' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu newsletter', value: 'with-newsletter' },
        { label: 'Cu harta', value: 'with-map' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Coloane',
      maxRows: 4,
      admin: {
        condition: (_, siblingData) =>
          ['columns-4', 'columns-3', 'centered'].includes(siblingData?.variant),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu coloana',
        },
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
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'links',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text',
              required: true,
            },
            ...linkFields,
          ],
        },
        {
          name: 'text',
          type: 'richText',
          label: 'Continut',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'text',
          },
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-newsletter',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
          defaultValue: 'Aboneaza-te la newsletter',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Descriere',
          defaultValue: 'Primeste noutati si oferte speciale',
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Aboneaza-te',
        },
      ],
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      label: 'Afiseaza link-uri social media',
      defaultValue: true,
    },
    {
      name: 'showContactInfo',
      type: 'checkbox',
      label: 'Afiseaza informatii contact',
      defaultValue: true,
    },
    {
      name: 'showWorkingHours',
      type: 'checkbox',
      label: 'Afiseaza program',
      defaultValue: false,
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Text copyright',
      defaultValue: '© {year} {businessName}. Toate drepturile rezervate.',
      admin: {
        description: 'Foloseste {year} pentru an si {businessName} pentru numele afacerii',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Link-uri legale',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text',
          required: true,
        },
        ...linkFields,
      ],
    },
    {
      name: 'showPaymentIcons',
      type: 'checkbox',
      label: 'Afiseaza metode de plata',
      defaultValue: false,
    },
    {
      name: 'paymentMethods',
      type: 'select',
      label: 'Metode de plata acceptate',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.showPaymentIcons,
      },
      options: [
        { label: 'Visa', value: 'visa' },
        { label: 'Mastercard', value: 'mastercard' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Ramburs', value: 'cash' },
        { label: 'Transfer bancar', value: 'bank' },
      ],
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badge-uri (ANPC, etc.)',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Text alternativ',
        },
      ],
    },
  ],
}
