import type { Block } from 'payload'

export const PricingKitsBlock: Block = {
  slug: 'pricing-kits',
  interfaceName: 'PricingKitsBlock',
  labels: {
    singular: 'Pricing Kits',
    plural: 'Pricing Kits',
  },
  imageURL: '/blocks/pricing-kits.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards',
      options: [
        { label: 'Carduri clasice', value: 'cards' },
        { label: 'Carduri cu imagine', value: 'cards-image' },
        { label: 'Compacte (tabel)', value: 'compact' },
        { label: 'Highlighted (un card evidentiat)', value: 'highlighted' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Pachete si preturi',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu / descriere',
    },
    {
      name: 'kits',
      type: 'array',
      label: 'Pachete / Kituri',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nume pachet',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Pret',
          required: true,
        },
        {
          name: 'priceLabel',
          type: 'text',
          label: 'Eticheta pret',
          defaultValue: 'lei',
          admin: {
            description: 'Ex: "lei", "RON/luna", "€", etc.',
          },
        },
        {
          name: 'originalPrice',
          type: 'number',
          label: 'Pret original (optional)',
          admin: {
            description: 'Pentru a afisa reducere',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere scurta',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Caracteristici incluse',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Caracteristica',
              required: true,
            },
            {
              name: 'included',
              type: 'checkbox',
              label: 'Inclusa',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'badge',
          type: 'select',
          label: 'Badge',
          defaultValue: 'none',
          options: [
            { label: 'Fara', value: 'none' },
            { label: 'Popular', value: 'popular' },
            { label: 'Best Value', value: 'best-value' },
            { label: 'Nou', value: 'new' },
            { label: 'Limitat', value: 'limited' },
            { label: 'Recomandat', value: 'recommended' },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Buton CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text buton',
              defaultValue: 'Comanda',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine (optional)',
          admin: {
            condition: (_, siblingData) => {
              // Show only for cards-image variant - this is checked at block level
              return true
            },
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          label: 'Evidentiat (scalat mai mare)',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Numar coloane',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (dupa numar pachete)', value: 'auto' },
        { label: '2 coloane', value: '2' },
        { label: '3 coloane', value: '3' },
        { label: '4 coloane', value: '4' },
      ],
    },
    {
      name: 'showCompareFeatures',
      type: 'checkbox',
      label: 'Afiseaza comparatie caracteristici',
      defaultValue: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'light',
      options: [
        { label: 'Default (alb)', value: 'default' },
        { label: 'Light (gri deschis)', value: 'light' },
        { label: 'Dark (inchis)', value: 'dark' },
        { label: 'Primary (accent)', value: 'primary' },
      ],
    },
  ],
}
