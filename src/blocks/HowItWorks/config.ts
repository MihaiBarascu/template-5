import type { Block } from 'payload'

export const HowItWorksBlock: Block = {
  slug: 'how-it-works',
  labels: {
    singular: 'Cum Functioneaza',
    plural: 'Cum Functioneaza',
  },
  imageURL: '/blocks/how-it-works.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'numbered',
      options: [
        { label: 'Numerotate (1, 2, 3...)', value: 'numbered' },
        { label: 'Cu iconite', value: 'icons' },
        { label: 'Timeline vertical', value: 'timeline' },
        { label: 'Carduri orizontale', value: 'horizontal-cards' },
        { label: 'Cu conectori (linii)', value: 'connected' },
        { label: 'Alternant (zig-zag)', value: 'alternating' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Cum functioneaza',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Pasi',
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu pas',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere',
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Iconita',
          admin: {
            condition: (_, { variant } = {}) => variant === 'icons' || variant === 'connected',
          },
          options: [
            { label: 'Cauta', value: 'Search' },
            { label: 'Click', value: 'MousePointerClick' },
            { label: 'Calendar', value: 'Calendar' },
            { label: 'Bifa', value: 'CheckCircle' },
            { label: 'Utilizator', value: 'User' },
            { label: 'Magazin', value: 'Store' },
            { label: 'Cos', value: 'ShoppingCart' },
            { label: 'Card', value: 'CreditCard' },
            { label: 'Pachet', value: 'Package' },
            { label: 'Camion', value: 'Truck' },
            { label: 'Casa', value: 'Home' },
            { label: 'Telefon', value: 'Phone' },
            { label: 'Email', value: 'Mail' },
            { label: 'Mesaj', value: 'MessageSquare' },
            { label: 'Setari', value: 'Settings' },
            { label: 'Formular', value: 'FileText' },
            { label: 'Foarfece', value: 'Scissors' },
            { label: 'Stea', value: 'Star' },
            { label: 'Inima', value: 'Heart' },
            { label: 'Clipboard', value: 'ClipboardCheck' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine (optional)',
          admin: {
            condition: (_, { variant } = {}) => variant === 'alternating',
          },
        },
      ],
    },
    {
      name: 'showNumbers',
      type: 'checkbox',
      label: 'Afiseaza numerele pasilor',
      defaultValue: true,
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA (optional)',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Afiseaza buton',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Incepe acum',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link buton',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
      ],
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
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
