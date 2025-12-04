import type { Block } from 'payload'

export const AnnouncementBarBlock: Block = {
  slug: 'announcementBar',
  labels: {
    singular: 'Bara Anunturi',
    plural: 'Bare Anunturi',
  },
  interfaceName: 'AnnouncementBarBlock',
  imageURL: '/blocks/announcement-bar.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'simple',
      options: [
        { label: 'Simplu', value: 'simple' },
        { label: 'Cu buton', value: 'with-button' },
        { label: 'Cu countdown', value: 'countdown' },
        { label: 'Slider (mai multe mesaje)', value: 'slider' },
        { label: 'Dismissabil', value: 'dismissable' },
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
        {
          name: 'linkText',
          type: 'text',
          label: 'Text link',
          defaultValue: 'Afla mai mult',
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
    {
      name: 'countdown',
      type: 'group',
      label: 'Countdown',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'countdown',
      },
      fields: [
        {
          name: 'endDate',
          type: 'date',
          label: 'Data sfarsit',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'expiredText',
          type: 'text',
          label: 'Text dupa expirare',
          defaultValue: 'Oferta a expirat',
        },
      ],
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide)',
      admin: {
        description: 'Ex: Gift, Percent, Bell, Star',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Rosu', value: 'red' },
        { label: 'Verde', value: 'green' },
        { label: 'Albastru', value: 'blue' },
        { label: 'Negru', value: 'black' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
    {
      name: 'position',
      type: 'select',
      label: 'Pozitie',
      defaultValue: 'top',
      options: [
        { label: 'Sus', value: 'top' },
        { label: 'Jos', value: 'bottom' },
      ],
    },
    {
      name: 'sticky',
      type: 'checkbox',
      label: 'Sticky (ramane vizibil la scroll)',
      defaultValue: false,
    },
  ],
}
