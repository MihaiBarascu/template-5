import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: {
    singular: 'Servicii',
    plural: 'Servicii',
  },
  imageURL: '/blocks/services.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Grid 2 coloane', value: 'grid-2' },
        { label: 'Lista', value: 'list' },
        { label: 'Lista cu imagini alternante', value: 'list-alternating' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Tabs', value: 'tabs' },
        { label: 'Cu preturi', value: 'with-prices' },
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
        { label: 'Din colectia Servicii', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
        { label: 'Continut custom', value: 'custom' },
      ],
    },
    {
      name: 'selectedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicii selectate',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'filterByCategory',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Filtreaza dupa categorie',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Doar servicii populare',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'customServices',
      type: 'array',
      label: 'Servicii custom',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (Lucide)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Pret (RON)',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
      ],
    },
    {
      name: 'showPrices',
      type: 'checkbox',
      label: 'Afiseaza preturi',
      defaultValue: true,
    },
    {
      name: 'showIcons',
      type: 'checkbox',
      label: 'Afiseaza iconite',
      defaultValue: true,
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Afiseaza buton',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Text',
          defaultValue: 'Vezi toate serviciile',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/servicii',
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
