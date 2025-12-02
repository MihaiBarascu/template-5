import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const PricePackages: CollectionConfig = {
  slug: 'price-packages',
  labels: {
    singular: 'Pachet pret',
    plural: 'Pachete preturi',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'price', 'period', 'highlighted', 'order'],
    useAsTitle: 'title',
    group: 'Business',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Denumire pachet',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitlu',
      admin: {
        description: 'Ex: Cel mai popular, Recomandat pentru incepatori',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descriere',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Pret (RON)',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'oldPrice',
          type: 'number',
          label: 'Pret vechi (RON)',
          admin: {
            width: '33%',
            description: 'Pentru reduceri',
          },
        },
        {
          name: 'period',
          type: 'select',
          label: 'Perioada',
          defaultValue: 'luna',
          options: [
            { label: 'pe luna', value: 'luna' },
            { label: 'pe an', value: 'an' },
            { label: 'o singura data', value: 'unic' },
            { label: 'pe sedinta', value: 'sedinta' },
            { label: 'pe ora', value: 'ora' },
            { label: 'pe zi', value: 'zi' },
          ],
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Ce include',
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Caracteristica',
          required: true,
        },
        {
          name: 'included',
          type: 'checkbox',
          label: 'Inclus',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Buton CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Alege pachetul',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/contact',
        },
      ],
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      label: 'Pachet recomandat',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Va fi evidentiat vizual',
      },
    },
    {
      name: 'highlightLabel',
      type: 'text',
      label: 'Eticheta highlight',
      defaultValue: 'Cel mai popular',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.highlighted,
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine afisare',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
