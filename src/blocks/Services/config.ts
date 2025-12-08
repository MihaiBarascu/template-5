import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Servicii',
    plural: 'Servicii',
  },
  imageURL: '/blocks/services.svg',
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
        { label: 'Lista alternanta', value: 'list-alternating' },
        { label: 'Lista preturi (dotted)', value: 'price-list' },
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
      name: 'showDuration',
      type: 'checkbox',
      label: 'Afiseaza durata',
      defaultValue: true,
    },
    {
      name: 'showBookButton',
      type: 'checkbox',
      label: 'Afiseaza buton programare',
      defaultValue: false,
    },
    {
      name: 'bookButtonText',
      type: 'text',
      label: 'Text buton programare',
      defaultValue: 'Programeaza-te',
      admin: {
        condition: (_, siblingData) => siblingData?.showBookButton,
      },
    },
    {
      name: 'bookButtonLink',
      type: 'text',
      label: 'Link buton programare',
      defaultValue: '/contact',
      admin: {
        condition: (_, siblingData) => siblingData?.showBookButton,
      },
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
      name: 'detailBasePath',
      type: 'text',
      label: 'Cale pentru pagini detaliu',
      admin: {
        description: 'Ex: /servicii - cardurile vor fi clickable si vor duce la /servicii/slug-serviciu. Lasati gol pentru a dezactiva link-urile.',
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
        { label: 'Primary', value: 'primary' },
      ],
    },
    // Configurable labels for i18n
    {
      name: 'labels',
      type: 'group',
      label: 'Text Labels (i18n)',
      admin: {
        description: 'Customize text labels for different languages',
      },
      fields: [
        {
          name: 'currencySymbol',
          type: 'text',
          label: 'Currency Symbol',
          defaultValue: 'RON',
        },
        {
          name: 'fromLabel',
          type: 'text',
          label: 'From Label (for starting price)',
          defaultValue: 'de la',
        },
      ],
    },
  ],
}
