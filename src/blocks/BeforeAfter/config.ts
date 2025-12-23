import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, advancedSettingsGroup } from '../_shared/commonFields'

export const BeforeAfterBlock: Block = {
  slug: 'beforeAfter',
  labels: {
    singular: 'Inainte/Dupa',
    plural: 'Inainte/Dupa',
  },
  imageURL: '/blocks/before-after.svg',
  interfaceName: 'BeforeAfterBlock',
  fields: [
    // === ESSENTIAL FIELDS ===
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
    },
    ...headingFields(),
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
        },
      ],
    },
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'sliderPosition',
          type: 'number',
          label: 'Pozitie initiala slider (%)',
          defaultValue: 50,
          min: 10,
          max: 90,
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'slider',
          },
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
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
