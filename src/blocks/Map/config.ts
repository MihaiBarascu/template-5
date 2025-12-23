import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { advancedSettingsGroup } from '../_shared/commonFields'

export const MapBlock: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Harta',
    plural: 'Harta',
  },
  imageURL: '/blocks/map.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
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
        { label: 'Din BusinessInfo (automat)', value: 'businessInfo' },
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
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
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
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
