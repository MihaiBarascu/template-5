import type { Block } from 'payload'

export const LogoCloudBlock: Block = {
  slug: 'logo-cloud',
  interfaceName: 'LogoCloudBlock',
  labels: {
    singular: 'Logo Cloud (Parteneri)',
    plural: 'Logo Cloud (Parteneri)',
  },
  imageURL: '/blocks/logo-cloud.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'simple',
      options: [
        { label: 'Simpla (grid)', value: 'simple' },
        { label: 'Carousel automat', value: 'carousel' },
        { label: 'Cu fundal carduri', value: 'cards' },
        { label: 'Grayscale -> Color la hover', value: 'grayscale' },
        { label: 'Cu text "Parteneri"', value: 'with-text' },
        { label: 'Marquee (scroll infinit)', value: 'marquee' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      admin: {
        description: 'Ex: "Partenerii nostri", "Au avut incredere in noi", "As Seen In"',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subtitlu',
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
          admin: {
            description: 'Pentru accesibilitate (alt text)',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link (optional)',
          admin: {
            description: 'URL catre site-ul partenerului',
          },
        },
      ],
    },
    {
      name: 'logoSize',
      type: 'select',
      label: 'Dimensiune logo-uri',
      defaultValue: 'medium',
      options: [
        { label: 'Mica (80px)', value: 'small' },
        { label: 'Medie (120px)', value: 'medium' },
        { label: 'Mare (160px)', value: 'large' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Numar coloane (desktop)',
      defaultValue: '5',
      options: [
        { label: '3 coloane', value: '3' },
        { label: '4 coloane', value: '4' },
        { label: '5 coloane', value: '5' },
        { label: '6 coloane', value: '6' },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      label: 'Logo-uri grayscale',
      defaultValue: false,
      admin: {
        description: 'Afiseaza logo-urile in alb-negru (colorate la hover)',
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
        { label: 'Transparent', value: 'transparent' },
      ],
    },
  ],
}
