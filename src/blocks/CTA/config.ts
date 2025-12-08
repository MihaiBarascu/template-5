import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Action',
  },
  imageURL: '/blocks/cta.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'centered',
      options: [
        { label: 'Centrat', value: 'centered' },
        { label: 'Split (text stanga, buton dreapta)', value: 'split' },
        { label: 'Cu imagine fundal', value: 'with-image' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Card flotant', value: 'floating' },
        { label: 'Cu formular', value: 'with-form' },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Titlu',
      required: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subtitlu',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine fundal',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-image',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Butoane',
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Stil',
          defaultValue: 'default',
          options: [
            { label: 'Primary', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
    {
      name: 'showPhoneNumber',
      type: 'checkbox',
      label: 'Afiseaza numar telefon',
      defaultValue: false,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'primary',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    {
      name: 'textAlignment',
      type: 'select',
      label: 'Aliniere text',
      defaultValue: 'center',
      options: [
        { label: 'Stanga', value: 'left' },
        { label: 'Centru', value: 'center' },
        { label: 'Dreapta', value: 'right' },
      ],
    },
    {
      name: 'size',
      type: 'select',
      label: 'Dimensiune',
      defaultValue: 'medium',
      options: [
        { label: 'Mica', value: 'small' },
        { label: 'Medie', value: 'medium' },
        { label: 'Mare', value: 'large' },
      ],
    },
  ],
}
