import type { Block } from 'payload'

export const BeforeAfterBlock: Block = {
  slug: 'beforeAfter',
  labels: {
    singular: 'Inainte/Dupa',
    plural: 'Inainte/Dupa',
  },
  imageURL: '/blocks/before-after.svg',
  interfaceName: 'BeforeAfterBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          label: 'Varianta',
          defaultValue: 'slider',
          options: [
            { label: 'Slider interactiv', value: 'slider' },
            { label: 'Grid side-by-side', value: 'grid' },
            { label: 'Carousel', value: 'carousel' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Fundal',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
          admin: { width: '50%' },
        },
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
      name: 'items',
      type: 'array',
      label: 'Comparatii',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'beforeImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagine Inainte',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'afterImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagine Dupa',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titlu (optional)',
          admin: {
            description: 'Ex: Tunsoare Fade, Tratament Albire',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere (optional)',
        },
      ],
    },
    {
      name: 'sliderPosition',
      type: 'number',
      label: 'Pozitie initiala slider (%)',
      defaultValue: 50,
      min: 10,
      max: 90,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'slider',
        description: 'Procentajul de la stanga (50 = centrat)',
      },
    },
  ],
}
