import type { Field } from 'payload'

export type LinkAppearance = 'default' | 'outline' | 'ghost' | 'link'

export const linkFields: Field[] = [
  {
    name: 'type',
    type: 'radio',
    admin: {
      layout: 'horizontal',
    },
    defaultValue: 'reference',
    options: [
      {
        label: 'Pagina interna',
        value: 'reference',
      },
      {
        label: 'URL extern',
        value: 'custom',
      },
    ],
  },
  {
    name: 'reference',
    type: 'relationship',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'reference',
    },
    label: 'Pagina',
    relationTo: ['pages'],
    required: true,
  },
  {
    name: 'url',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'custom',
    },
    label: 'URL',
    required: true,
  },
  {
    name: 'newTab',
    type: 'checkbox',
    admin: {
      style: {
        alignSelf: 'flex-end',
      },
    },
    label: 'Deschide in tab nou',
  },
]

export const linkGroup: Field = {
  name: 'link',
  type: 'group',
  admin: {
    hideGutter: true,
  },
  fields: [
    ...linkFields,
    {
      name: 'label',
      type: 'text',
      label: 'Text buton',
      required: true,
    },
    {
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Stilul butonului',
      },
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Outline',
          value: 'outline',
        },
        {
          label: 'Ghost',
          value: 'ghost',
        },
        {
          label: 'Link',
          value: 'link',
        },
      ],
    },
  ],
}
