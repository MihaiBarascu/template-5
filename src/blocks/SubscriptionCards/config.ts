import type { Block } from 'payload'

export const SubscriptionCardsBlock: Block = {
  slug: 'subscriptionCards',
  labels: {
    singular: 'Carduri Abonamente',
    plural: 'Carduri Abonamente',
  },
  imageURL: '/blocks/subscription-cards.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards-3',
      options: [
        { label: 'Cards 3 coloane', value: 'cards-3' },
        { label: 'Cards 4 coloane', value: 'cards-4' },
        { label: 'Cards cu imagine overlay', value: 'cards-overlay' },
        { label: 'Lista compacta', value: 'list-compact' },
        { label: 'Tabele comparatie', value: 'table-compare' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
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
        { label: 'Din colectia Abonamente', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedSubscriptions',
      type: 'relationship',
      relationTo: 'subscriptions',
      hasMany: true,
      label: 'Abonamente selectate',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'filterByType',
      type: 'select',
      label: 'Filtreaza dupa tip',
      options: [
        { label: 'Toate', value: 'all' },
        { label: 'Sala / GYM', value: 'gym' },
        { label: 'SPA', value: 'spa' },
        { label: 'Solar', value: 'solar' },
        { label: 'Fitness + SPA', value: 'fitness-spa' },
        { label: 'Clase', value: 'classes' },
        { label: 'Personal Training', value: 'personal' },
        { label: 'Premium', value: 'premium' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: 4,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showImage',
      type: 'checkbox',
      label: 'Afiseaza imagine',
      defaultValue: false,
    },
    {
      name: 'showFeatures',
      type: 'checkbox',
      label: 'Afiseaza beneficii',
      defaultValue: true,
    },
    {
      name: 'showOldPrice',
      type: 'checkbox',
      label: 'Afiseaza pret vechi (reduceri)',
      defaultValue: true,
    },
    {
      name: 'highlightStyle',
      type: 'select',
      label: 'Stil highlight',
      defaultValue: 'border',
      options: [
        { label: 'Chenar colorat', value: 'border' },
        { label: 'Fundal colorat', value: 'background' },
        { label: 'Efect ridicat', value: 'elevated' },
        { label: 'Badge', value: 'badge' },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA global',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Afiseaza buton',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Text',
          defaultValue: 'Vezi toate abonamentele',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/abonamente',
        },
      ],
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
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
