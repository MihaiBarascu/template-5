import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const BrandLogosBlock: Block = {
  slug: 'brandLogos',
  labels: {
    singular: 'Logo-uri Branduri',
    plural: 'Logo-uri Branduri',
  },
  interfaceName: 'BrandLogosBlock',
  imageURL: '/blocks/brand-logos.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'row',
      options: [
        { label: 'Rand simplu', value: 'row' },
        { label: 'Grid', value: 'grid' },
        { label: 'Slider', value: 'slider' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
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
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'grayscale',
          type: 'checkbox',
          label: 'Logo-uri grayscale (color la hover)',
          defaultValue: true,
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
          name: 'autoplay',
          type: 'checkbox',
          label: 'Autoplay slider',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'slider',
          },
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
