import type { Block } from 'payload'

export const ProductsBlock: Block = {
  slug: 'products',
  interfaceName: 'ProductsBlock',
  labels: {
    singular: 'Produse',
    plural: 'Produse',
  },
  imageURL: '/blocks/products.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-4',
      options: [
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Lista', value: 'list' },
        { label: 'Featured (1 mare + 4 mici)', value: 'featured' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Produsele noastre',
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
        { label: 'Din colectia Produse', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Produse selectate',
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
      defaultValue: 8,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Doar produse recomandate',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'onlySale',
      type: 'checkbox',
      label: 'Doar produse la reducere',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showPrice',
      type: 'checkbox',
      label: 'Afiseaza pret',
      defaultValue: true,
    },
    {
      name: 'showSalePrice',
      type: 'checkbox',
      label: 'Afiseaza pretul vechi (taiat)',
      defaultValue: true,
    },
    {
      name: 'showAddToCart',
      type: 'checkbox',
      label: 'Afiseaza buton adauga in cos',
      defaultValue: false,
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
          defaultValue: 'Vezi toate produsele',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/produse',
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
      ],
    },
  ],
}
