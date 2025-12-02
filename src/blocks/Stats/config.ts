import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: 'Statistici',
    plural: 'Statistici',
  },
  imageURL: '/blocks/stats.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-4',
      options: [
        { label: 'Pe o linie', value: 'inline' },
        { label: '4 Carduri', value: 'grid-4' },
        { label: '3 Carduri', value: 'grid-3' },
        { label: 'Cu iconite', value: 'with-icons' },
        { label: 'Animate (numarare)', value: 'animated' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'businessInfo',
      options: [
        { label: 'Din BusinessInfo', value: 'businessInfo' },
        { label: 'Continut custom', value: 'custom' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistici',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Valoare',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Eticheta',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (Lucide)',
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Sufix',
          admin: {
            description: 'Ex: +, %, ani',
          },
        },
      ],
    },
    {
      name: 'animated',
      type: 'checkbox',
      label: 'Numarare animata',
      defaultValue: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'primary',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
