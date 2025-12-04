import type { Block } from 'payload'

export const BrandLogosBlock: Block = {
  slug: 'brandLogos',
  labels: {
    singular: 'Logo-uri Branduri',
    plural: 'Logo-uri Branduri',
  },
  interfaceName: 'BrandLogosBlock',
  imageURL: '/blocks/brand-logos.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'row',
      options: [
        { label: 'Rand simplu', value: 'row' },
        { label: 'Grid', value: 'grid' },
        { label: 'Slider', value: 'slider' },
        { label: 'Cu titlu deasupra', value: 'titled' },
        { label: 'Cu sectiuni', value: 'sectioned' },
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
      label: 'Sursa logo-uri',
      defaultValue: 'custom',
      options: [
        { label: 'Logo-uri custom', value: 'custom' },
        { label: 'Pe sectiuni', value: 'sections' },
      ],
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logo-uri',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Nume brand',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Sectiuni',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'sections',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu sectiune',
          required: true,
        },
        {
          name: 'logos',
          type: 'array',
          label: 'Logo-uri',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Nume brand',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
            },
          ],
        },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      label: 'Logo-uri grayscale (color la hover)',
      defaultValue: true,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay slider',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'slider',
      },
    },
    {
      name: 'logoSize',
      type: 'select',
      label: 'Marime logo',
      defaultValue: 'medium',
      options: [
        { label: 'Mic', value: 'small' },
        { label: 'Mediu', value: 'medium' },
        { label: 'Mare', value: 'large' },
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
