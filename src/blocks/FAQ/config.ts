import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  imageURL: '/blocks/faq.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'accordion',
      options: [
        { label: 'Accordion', value: 'accordion' },
        { label: 'Doua coloane', value: 'two-columns' },
        { label: 'Grupate in tabs', value: 'tabs' },
        { label: 'Cu search', value: 'searchable' },
        { label: 'Numerotate', value: 'numbered' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Intrebari frecvente',
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
        { label: 'Din colectia FAQ', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
        { label: 'Continut custom', value: 'custom' },
      ],
    },
    {
      name: 'selectedFAQs',
      type: 'relationship',
      relationTo: 'faq',
      hasMany: true,
      label: 'Intrebari selectate',
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
      defaultValue: 10,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'customFAQs',
      type: 'array',
      label: 'Intrebari custom',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Intrebare',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Raspuns',
          required: true,
        },
      ],
    },
    {
      name: 'defaultOpen',
      type: 'select',
      label: 'Deschis implicit',
      defaultValue: 'first',
      options: [
        { label: 'Niciunul', value: 'none' },
        { label: 'Primul', value: 'first' },
        { label: 'Toate', value: 'all' },
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
