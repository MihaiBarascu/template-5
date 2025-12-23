import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { advancedSettingsGroup } from '../_shared/commonFields'

export const DownloadLinksBlock: Block = {
  slug: 'download-links',
  interfaceName: 'DownloadLinksBlock',
  labels: {
    singular: 'Download Links',
    plural: 'Download Links',
  },
  imageURL: '/blocks/download-links.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'buttons',
      options: [
        { label: 'Butoane cu iconita', value: 'buttons' },
        { label: 'Lista simpla', value: 'list' },
        { label: 'Carduri', value: 'cards' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
    },
    {
      name: 'links',
      type: 'array',
      label: 'Linkuri Download',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text link',
          required: true,
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Tip link',
          defaultValue: 'upload',
          options: [
            { label: 'Fisier incarcat', value: 'upload' },
            { label: 'URL extern', value: 'external' },
          ],
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'Fisier',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'upload',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'external',
          },
        },
      ],
    },
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
