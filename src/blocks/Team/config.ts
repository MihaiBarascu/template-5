import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import {
  headingFields,
  backgroundColorField,
  columnsSelectField,
  toggleField,
} from '../_shared/commonFields'

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Echipa',
    plural: 'Echipa',
  },
  imageURL: '/blocks/team.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid',
      options: [
        { label: 'Grid carduri', value: 'grid' },
        { label: 'Grid centrat', value: 'grid-centered' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Lista', value: 'list' },
        { label: 'Un membru featured + restul', value: 'featured' },
        { label: 'Cu modal la click', value: 'with-modal' },
      ],
    },
    ...headingFields({ headingDefault: 'Echipa noastra' }),
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'collection',
      options: [
        { label: 'Din colectia Echipa', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedMembers',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      label: 'Membri selectati',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: 4,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Doar membri featured',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    toggleField({ name: 'showRole', label: 'Afiseaza functia', defaultValue: true }),
    toggleField({ name: 'showBio', label: 'Afiseaza biografie', defaultValue: false }),
    toggleField({ name: 'showSocial', label: 'Afiseaza social media', defaultValue: true }),
    toggleField({ name: 'showContact', label: 'Afiseaza contact', defaultValue: false }),
    {
      name: 'detailBasePath',
      type: 'text',
      label: 'Cale de baza pentru detalii',
      admin: {
        description: 'Ex: /echipa - cardurile vor deveni clickable si vor duce la /echipa/slug-membru',
      },
    },
    columnsSelectField({ options: ['2', '3', '4'], defaultValue: '4' }),
    backgroundColorField({ includePrimary: false }),
    // Section wrapper fields for advanced layout options
    ...sectionWrapperFields,
  ],
}
