import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: {
    singular: 'Formular',
    plural: 'Formulare',
  },
  imageURL: '/blocks/form.svg',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Formular',
      admin: {
        description: 'Selecteaza formularul definit in admin',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Card (cu border)', value: 'card' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Minimal (fara styling)', value: 'minimal' },
      ],
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Afiseaza continut introductiv',
      defaultValue: false,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
    },
    {
      name: 'introContent',
      type: 'richText',
      label: 'Continut introductiv',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
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
  graphQL: {
    singularName: 'FormBlock',
  },
}
