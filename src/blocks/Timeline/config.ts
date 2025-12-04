import type { Block } from 'payload'

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Timeline / Istorie',
    plural: 'Timeline',
  },
  interfaceName: 'TimelineBlock',
  imageURL: '/blocks/timeline.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Vertical alternant', value: 'vertical-alternating' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Povestea noastra',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu',
    },
    {
      name: 'events',
      type: 'array',
      label: 'Evenimente / Etape',
      required: true,
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'An / Data',
          required: true,
        },
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (Lucide)',
          admin: {
            description: 'Ex: Star, Award, Building, Users',
          },
        },
      ],
    },
    {
      name: 'showConnector',
      type: 'checkbox',
      label: 'Afiseaza linie conectoare',
      defaultValue: true,
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
