import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'Timeline / Istorie',
    plural: 'Timeline',
  },
  interfaceName: 'TimelineBlock',
  imageURL: '/blocks/timeline.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
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
    ...headingFields({ headingDefault: 'Povestea noastra' }),
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
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showConnector',
          type: 'checkbox',
          label: 'Afiseaza linie conectoare',
          defaultValue: true,
        },
      ],
    }),
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
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
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
