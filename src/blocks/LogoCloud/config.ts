import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const LogoCloudBlock: Block = {
  slug: 'logo-cloud',
  interfaceName: 'LogoCloudBlock',
  labels: {
    singular: 'Logo Cloud (Parteneri)',
    plural: 'Logo Cloud (Parteneri)',
  },
  imageURL: '/blocks/logo-cloud.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'simple',
      options: [
        { label: 'Simpla (grid)', value: 'simple' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Marquee (scroll infinit)', value: 'marquee' },
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
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Nume companie',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link (optional)',
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
          defaultValue: false,
        },
        {
          name: 'logoSize',
          type: 'select',
          label: 'Dimensiune logo-uri',
          defaultValue: 'medium',
          options: [
            { label: 'Mica', value: 'small' },
            { label: 'Medie', value: 'medium' },
            { label: 'Mare', value: 'large' },
          ],
        },
        {
          name: 'columns',
          type: 'select',
          label: 'Numar coloane',
          defaultValue: '5',
          options: [
            { label: '3 coloane', value: '3' },
            { label: '4 coloane', value: '4' },
            { label: '5 coloane', value: '5' },
            { label: '6 coloane', value: '6' },
          ],
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
