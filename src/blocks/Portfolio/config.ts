import type { Block } from 'payload'

export const PortfolioBlock: Block = {
  slug: 'portfolio',
  interfaceName: 'PortfolioBlock',
  labels: {
    singular: 'Portofoliu',
    plural: 'Portofoliu',
  },
  imageURL: '/blocks/portfolio.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-masonry',
      options: [
        { label: 'Grid masonry', value: 'grid-masonry' },
        { label: 'Grid uniform', value: 'grid-uniform' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Cu filtre pe categorii', value: 'filterable' },
        { label: 'Cu lightbox', value: 'lightbox' },
        { label: 'Case studies (carduri mari)', value: 'case-studies' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Proiectele noastre',
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
        { label: 'Din colectia Portofoliu', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedProjects',
      type: 'relationship',
      relationTo: 'portfolio',
      hasMany: true,
      label: 'Proiecte selectate',
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
      label: 'Doar proiecte featured',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showDescription',
      type: 'checkbox',
      label: 'Afiseaza descriere',
      defaultValue: true,
    },
    {
      name: 'showClient',
      type: 'checkbox',
      label: 'Afiseaza client',
      defaultValue: false,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Coloane',
      defaultValue: '3',
      options: [
        { label: '2 coloane', value: '2' },
        { label: '3 coloane', value: '3' },
        { label: '4 coloane', value: '4' },
      ],
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
          defaultValue: 'Vezi toate proiectele',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/portofoliu',
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
