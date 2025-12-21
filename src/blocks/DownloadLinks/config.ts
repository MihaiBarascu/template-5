import type { Block } from 'payload'
import { backgroundColorField } from '../_shared/commonFields'

export const DownloadLinksBlock: Block = {
  slug: 'download-links',
  interfaceName: 'DownloadLinksBlock',
  labels: {
    singular: 'Download Links',
    plural: 'Download Links',
  },
  imageURL: '/blocks/download-links.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'buttons',
      options: [
        { label: 'Butoane cu iconita', value: 'buttons' },
        { label: 'Lista simpla', value: 'list' },
        { label: 'Carduri cu descriere', value: 'cards' },
        { label: 'Inline (pe un rand)', value: 'inline' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune (optional)',
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
          name: 'description',
          type: 'text',
          label: 'Descriere (optional)',
          admin: {
            condition: (_, siblingData, { blockData }) => blockData?.variant === 'cards',
          },
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
        {
          name: 'icon',
          type: 'select',
          label: 'Iconita',
          defaultValue: 'download',
          options: [
            { label: 'Download', value: 'download' },
            { label: 'PDF', value: 'pdf' },
            { label: 'Document', value: 'document' },
            { label: 'Link extern', value: 'external-link' },
            { label: 'Fara', value: 'none' },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Deschide in tab nou',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Aliniere',
      defaultValue: 'center',
      options: [
        { label: 'Stanga', value: 'left' },
        { label: 'Centrat', value: 'center' },
        { label: 'Dreapta', value: 'right' },
      ],
    },
    backgroundColorField({ showDescriptions: true }),
  ],
}
