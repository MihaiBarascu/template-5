import type { Block } from 'payload'

export const PriceListDottedBlock: Block = {
  slug: 'priceListDotted',
  labels: {
    singular: 'Lista Preturi cu Puncte',
    plural: 'Liste Preturi',
  },
  interfaceName: 'PriceListDottedBlock',
  imageURL: '/blocks/price-list.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'single-column',
      options: [
        { label: 'O coloana', value: 'single-column' },
        { label: 'Doua coloane', value: 'two-columns' },
        { label: 'Cu categorii', value: 'categorized' },
        { label: 'Cu imagini', value: 'with-images' },
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
      label: 'Subtitlu',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'services',
      options: [
        { label: 'Din Servicii', value: 'services' },
        { label: 'Lista custom', value: 'custom' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim servicii',
      defaultValue: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'services',
      },
    },
    {
      name: 'filterByCategory',
      type: 'text',
      label: 'Filtreaza dupa categorie',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'services',
        description: 'Lasa gol pentru toate serviciile',
      },
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Categorii',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.source === 'custom' && siblingData?.variant === 'categorized',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nume categorie',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Servicii',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Nume serviciu',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'price',
                  type: 'text',
                  label: 'Pret',
                  required: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'duration',
                  type: 'text',
                  label: 'Durata',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'text',
              label: 'Descriere scurta',
            },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Servicii',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.source === 'custom' && siblingData?.variant !== 'categorized',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Nume serviciu',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'price',
              type: 'text',
              label: 'Pret',
              required: true,
              admin: { width: '25%' },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Durata',
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
          label: 'Descriere scurta',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          admin: {
            condition: (data) => data?.variant === 'with-images',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Promovat',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Moneda',
      defaultValue: 'RON',
    },
    {
      name: 'showDuration',
      type: 'checkbox',
      label: 'Afiseaza durata',
      defaultValue: true,
    },
    {
      name: 'dotStyle',
      type: 'select',
      label: 'Stil linie',
      defaultValue: 'dotted',
      options: [
        { label: 'Punctat', value: 'dotted' },
        { label: 'Linie continua', value: 'solid' },
        { label: 'Linie intrerupta', value: 'dashed' },
        { label: 'Fara linie', value: 'none' },
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
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      fields: [
        {
          name: 'show',
          type: 'checkbox',
          label: 'Afiseaza buton',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Programeaza-te',
          admin: {
            condition: (_, siblingData) => siblingData?.show,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/contact',
          admin: {
            condition: (_, siblingData) => siblingData?.show,
          },
        },
      ],
    },
  ],
}
