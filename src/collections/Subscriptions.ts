import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: {
    singular: 'Abonament',
    plural: 'Abonamente',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'price', 'highlighted', 'order'],
    group: 'Business',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nume abonament',
      required: true,
    },
    slugField('title'),
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitlu',
      admin: { placeholder: 'Ex: "8 sedinte", "Nelimitat", "Cel mai popular"' },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine (pentru carduri cu overlay)',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tip abonament',
      required: true,
      defaultValue: 'gym',
      options: [
        { label: 'Sala / GYM', value: 'gym' },
        { label: 'SPA', value: 'spa' },
        { label: 'Solar', value: 'solar' },
        { label: 'Fitness + SPA', value: 'fitness-spa' },
        { label: 'Clase', value: 'classes' },
        { label: 'Personal Training', value: 'personal' },
        { label: 'Piscina', value: 'pool' },
        { label: 'Premium', value: 'premium' },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Pret',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              label: 'Suma',
              admin: { width: '33%' },
            },
            {
              name: 'currency',
              type: 'text',
              defaultValue: 'RON',
              admin: { width: '33%' },
            },
            {
              name: 'period',
              type: 'text',
              defaultValue: '/luna',
              admin: { width: '33%', placeholder: '/luna, /an, /sedinta' },
            },
          ],
        },
        {
          name: 'oldPrice',
          type: 'number',
          label: 'Pret vechi (pentru reduceri)',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Beneficii incluse',
      fields: [
        { name: 'text', type: 'text', required: true },
        {
          name: 'included',
          type: 'checkbox',
          defaultValue: true,
          label: 'Inclus (check) sau Nu (x)',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Buton actiune',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Contacteaza-ne',
        },
        {
          name: 'linkType',
          type: 'radio',
          defaultValue: 'custom',
          options: [
            { label: 'Pagina interna', value: 'page' },
            { label: 'URL custom', value: 'custom' },
          ],
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: { condition: (_, siblingData) => siblingData?.linkType === 'page' },
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '/contact',
          admin: { condition: (_, siblingData) => siblingData?.linkType === 'custom' },
        },
      ],
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      label: 'Evidentiat (Popular)',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'highlightLabel',
      type: 'text',
      defaultValue: 'Popular',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.highlighted,
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
