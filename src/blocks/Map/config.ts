import type { Block } from 'payload'

export const MapBlock: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Harta',
    plural: 'Harta',
  },
  imageURL: '/blocks/map.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'full-width',
      options: [
        { label: 'Full width', value: 'full-width' },
        { label: 'Cu container', value: 'contained' },
        { label: 'Cu informatii contact', value: 'with-info' },
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
      label: 'Sursa harta',
      defaultValue: 'businessInfo',
      options: [
        { label: 'Din BusinessInfo', value: 'businessInfo' },
        { label: 'Custom embed', value: 'custom' },
      ],
    },
    {
      name: 'customEmbed',
      type: 'textarea',
      label: 'Cod embed Google Maps',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Inaltime',
      defaultValue: 'medium',
      options: [
        { label: 'Mica (300px)', value: 'small' },
        { label: 'Medie (450px)', value: 'medium' },
        { label: 'Mare (600px)', value: 'large' },
      ],
    },
    {
      name: 'showDirectionsButton',
      type: 'checkbox',
      label: 'Afiseaza buton directii',
      defaultValue: true,
    },
  ],
}
