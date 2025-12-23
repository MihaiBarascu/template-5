import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Import blocks that can be nested inside Content columns
import { FormBlock } from '../Form/config'
import { ContactBlock } from '../Contact/config'
import { MapBlock } from '../Map/config'
import { CTABlock } from '../CTA/config'

const columnFields: Field[] = [
  {
    name: 'width',
    type: 'select',
    label: 'Latime',
    defaultValue: '100',
    options: [
      // Full widths
      { label: '100%', value: '100' },
      { label: '90%', value: '90' },
      { label: '80%', value: '80' },
      { label: '75%', value: '75' },
      { label: '70%', value: '70' },
      // Two-thirds / half
      { label: '66%', value: '66' },
      { label: '60%', value: '60' },
      { label: '50%', value: '50' },
      // Smaller widths
      { label: '40%', value: '40' },
      { label: '33%', value: '33' },
      { label: '30%', value: '30' },
      { label: '25%', value: '25' },
      { label: '20%', value: '20' },
      // Legacy values for backwards compatibility
      { label: '100% (legacy)', value: 'full' },
      { label: '75% (legacy)', value: 'three-quarters' },
      { label: '66% (legacy)', value: 'two-thirds' },
      { label: '50% (legacy)', value: 'half' },
      { label: '33% (legacy)', value: 'one-third' },
      { label: '25% (legacy)', value: 'one-quarter' },
    ],
  },
  {
    name: 'alignment',
    type: 'select',
    label: 'Aliniere verticala',
    defaultValue: 'top',
    options: [
      { label: 'Sus', value: 'top' },
      { label: 'Centru', value: 'center' },
      { label: 'Jos', value: 'bottom' },
    ],
  },
  {
    name: 'contentType',
    type: 'select',
    label: 'Tip continut',
    defaultValue: 'richText',
    options: [
      { label: 'Text formatat', value: 'richText' },
      { label: 'Imagine', value: 'image' },
      { label: 'Video', value: 'video' },
      { label: 'Blocuri', value: 'blocks' },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    label: 'Continut',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    admin: {
      condition: (_, siblingData) => siblingData?.contentType === 'richText',
    },
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    label: 'Imagine',
    admin: {
      condition: (_, siblingData) => siblingData?.contentType === 'image',
    },
  },
  {
    name: 'videoUrl',
    type: 'text',
    label: 'URL Video',
    admin: {
      condition: (_, siblingData) => siblingData?.contentType === 'video',
    },
  },
  {
    name: 'blocks',
    type: 'blocks',
    label: 'Blocuri',
    blocks: [FormBlock, ContactBlock, MapBlock, CTABlock],
    admin: {
      condition: (_, siblingData) => siblingData?.contentType === 'blocks',
      description: 'Adauga blocuri in aceasta coloana (formulare, contact, harta, CTA)',
      initCollapsed: true,
    },
  },
]

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Continut',
    plural: 'Continut',
  },
  imageURL: '/blocks/content.svg',
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Coloane',
      minRows: 1,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    // === ADVANCED SETTINGS (collapsible) ===
    {
      type: 'collapsible',
      label: 'Setari avansate',
      admin: {
        initCollapsed: true,
      },
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
        {
          name: 'paddingTop',
          type: 'select',
          label: 'Padding sus',
          defaultValue: 'medium',
          options: [
            { label: 'Fara', value: 'none' },
            { label: 'Mic', value: 'small' },
            { label: 'Mediu', value: 'medium' },
            { label: 'Mare', value: 'large' },
          ],
        },
        {
          name: 'paddingBottom',
          type: 'select',
          label: 'Padding jos',
          defaultValue: 'medium',
          options: [
            { label: 'Fara', value: 'none' },
            { label: 'Mic', value: 'small' },
            { label: 'Mediu', value: 'medium' },
            { label: 'Mare', value: 'large' },
          ],
        },
      ],
    },
  ],
}
