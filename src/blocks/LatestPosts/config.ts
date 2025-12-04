import type { Block } from 'payload'

export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  labels: {
    singular: 'Ultimele Articole',
    plural: 'Ultimele Articole',
  },
  imageURL: '/blocks/latest-posts.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 2 coloane', value: 'grid-2' },
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Lista', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Featured (1 mare + 2 mici)', value: 'featured' },
        { label: 'Minimal (doar titluri)', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Ultimele Articole',
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
        { label: 'Din colectia Articole', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Articole selectate',
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
      label: 'Numar maxim articole',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showImage',
      type: 'checkbox',
      label: 'Afiseaza imagine',
      defaultValue: true,
    },
    {
      name: 'showExcerpt',
      type: 'checkbox',
      label: 'Afiseaza rezumat',
      defaultValue: true,
    },
    {
      name: 'showDate',
      type: 'checkbox',
      label: 'Afiseaza data',
      defaultValue: true,
    },
    {
      name: 'showCategory',
      type: 'checkbox',
      label: 'Afiseaza categoria',
      defaultValue: true,
    },
    {
      name: 'showAuthor',
      type: 'checkbox',
      label: 'Afiseaza autor',
      defaultValue: false,
    },
    {
      name: 'showReadMore',
      type: 'checkbox',
      label: 'Afiseaza buton Citeste mai mult',
      defaultValue: true,
    },
    {
      name: 'readMoreText',
      type: 'text',
      label: 'Text buton Citeste mai mult',
      defaultValue: 'Citeste mai mult',
      admin: {
        condition: (_, siblingData) => siblingData?.showReadMore,
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
          defaultValue: 'Vezi toate articolele',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/blog',
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
