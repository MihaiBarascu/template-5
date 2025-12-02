import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Preturi',
    plural: 'Preturi',
  },
  imageURL: '/blocks/pricing.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards-3',
      options: [
        { label: '3 Carduri', value: 'cards-3' },
        { label: '4 Carduri', value: 'cards-4' },
        { label: 'Tabel comparativ', value: 'table' },
        { label: 'Lista simpla', value: 'list' },
        { label: 'Cu toggle lunar/anual', value: 'toggle' },
        { label: 'Card featured in centru', value: 'featured-center' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Preturi si pachete',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'collection',
      options: [
        { label: 'Din colectia Pachete', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedPackages',
      type: 'relationship',
      relationTo: 'price-packages',
      hasMany: true,
      label: 'Pachete selectate',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showFeatures',
      type: 'checkbox',
      label: 'Afiseaza lista caracteristici',
      defaultValue: true,
    },
    {
      name: 'showOldPrice',
      type: 'checkbox',
      label: 'Afiseaza pretul vechi (taiat)',
      defaultValue: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Text buton implicit',
      defaultValue: 'Alege pachetul',
    },
    {
      name: 'disclaimer',
      type: 'text',
      label: 'Text disclaimer',
      admin: {
        description: 'Ex: Preturile nu includ TVA',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
