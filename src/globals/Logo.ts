import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const Logo: GlobalConfig = {
  slug: 'logo',
  label: 'Logo',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Tip logo',
      defaultValue: 'text',
      options: [
        { label: 'Doar text', value: 'text' },
        { label: 'Doar imagine', value: 'image' },
        { label: 'Imagine + Text', value: 'both' },
      ],
    },
    {
      name: 'text',
      type: 'text',
      label: 'Text logo',
      admin: {
        condition: (_, siblingData) => ['text', 'both'].includes(siblingData?.type),
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine logo',
      admin: {
        condition: (_, siblingData) => ['image', 'both'].includes(siblingData?.type),
      },
    },
    {
      name: 'imageDark',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine logo (varianta inchisa)',
      admin: {
        description: 'Pentru utilizare pe fundal deschis (optional)',
        condition: (_, siblingData) => ['image', 'both'].includes(siblingData?.type),
      },
    },
    {
      name: 'imageLight',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine logo (varianta deschisa)',
      admin: {
        description: 'Pentru utilizare pe fundal inchis (optional)',
        condition: (_, siblingData) => ['image', 'both'].includes(siblingData?.type),
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
      admin: {
        description: 'Icon-ul care apare in tab-ul browser-ului (32x32 sau 64x64)',
      },
    },
    {
      name: 'size',
      type: 'group',
      label: 'Dimensiuni',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'height',
              type: 'number',
              label: 'Inaltime (px)',
              defaultValue: 40,
              admin: { width: '50%' },
            },
            {
              name: 'heightMobile',
              type: 'number',
              label: 'Inaltime mobile (px)',
              defaultValue: 32,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
