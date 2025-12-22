import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { Banner } from '@/blocks/Banner/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { revalidateTeamAfterChange, revalidateTeamAfterDelete } from '@/hooks/revalidateTeam'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Membru echipa',
    plural: 'Echipa',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'role', 'featured', 'order'],
    useAsTitle: 'name',
    group: 'Business',
  },
  hooks: {
    afterChange: [revalidateTeamAfterChange],
    afterDelete: [revalidateTeamAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume complet',
      required: true,
    },
    slugField('name'),
    {
      name: 'role',
      type: 'text',
      label: 'Functie / Specializare',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografie',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografie scurtă',
      admin: {
        description: '2-3 propoziții pentru carduri și liste (text simplu)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere detaliată',
      admin: {
        description: 'Conținut complet pentru pagina individuală - cu titluri, imagini, liste și formatare avansată',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },
    {
      name: 'experience',
      type: 'text',
      label: 'Experienta',
      admin: {
        description: 'Ex: 10+ ani experienta',
      },
    },
    {
      name: 'specializations',
      type: 'array',
      label: 'Specializari',
      fields: [
        {
          name: 'specialization',
          type: 'text',
          label: 'Specializare',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp',
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X',
        },
      ],
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Program',
      fields: [
        {
          name: 'day',
          type: 'select',
          label: 'Zi',
          options: [
            { label: 'Luni', value: 'luni' },
            { label: 'Marti', value: 'marti' },
            { label: 'Miercuri', value: 'miercuri' },
            { label: 'Joi', value: 'joi' },
            { label: 'Vineri', value: 'vineri' },
            { label: 'Sambata', value: 'sambata' },
            { label: 'Duminica', value: 'duminica' },
          ],
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Ore',
          admin: {
            description: 'Ex: 09:00 - 17:00 sau Inchis',
          },
        },
      ],
    },
    {
      name: 'showCTAOnDetailPage',
      type: 'checkbox',
      label: 'Afișează CTA pe pagina individuală',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Activează/dezactivează secțiunea "Vrei să programezi?"',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Afisat pe homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine afisare',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
