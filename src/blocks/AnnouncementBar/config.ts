import type { Block } from 'payload'
import { advancedSettingsGroup } from '../_shared/commonFields'

export const AnnouncementBarBlock: Block = {
  slug: 'announcementBar',
  labels: {
    singular: 'Bara Anunturi',
    plural: 'Bare Anunturi',
  },
  interfaceName: 'AnnouncementBarBlock',
  imageURL: '/blocks/announcement-bar.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'simple',
      options: [
        { label: 'Simplu', value: 'simple' },
        { label: 'Cu buton', value: 'with-button' },
        { label: 'Slider (mai multe mesaje)', value: 'slider' },
      ],
    },
    {
      name: 'messages',
      type: 'array',
      label: 'Mesaje',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text mesaj',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-button',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Vezi oferta',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
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
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Rosu', value: 'red' },
            { label: 'Verde', value: 'green' },
            { label: 'Negru', value: 'black' },
          ],
        },
        {
          name: 'sticky',
          type: 'checkbox',
          label: 'Sticky (ramane vizibil la scroll)',
          defaultValue: false,
        },
      ],
    }),
  ],
}
