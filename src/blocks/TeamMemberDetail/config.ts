import type { Block } from 'payload'

export const TeamMemberDetailBlock: Block = {
  slug: 'teamMemberDetail',
  interfaceName: 'TeamMemberDetailBlock',
  labels: {
    singular: 'Team Member Detail',
    plural: 'Team Member Details',
  },
  imageURL: '/blocks/team-member-detail.svg',
  fields: [
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'team',
      label: 'Membru echipa',
      required: true,
      admin: {
        description: 'Selecteaza membrul echipei de afisat',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'full',
      options: [
        { label: 'Full (2 Columns - Image Left)', value: 'full' },
        { label: 'Compact (Single Column)', value: 'compact' },
        { label: 'Hero Style', value: 'hero' },
      ],
    },
    {
      name: 'showBreadcrumb',
      type: 'checkbox',
      label: 'Show Breadcrumb',
      defaultValue: true,
    },
    {
      name: 'showExperience',
      type: 'checkbox',
      label: 'Show Experience Badge',
      defaultValue: true,
    },
    {
      name: 'showSpecializations',
      type: 'checkbox',
      label: 'Show Specializations',
      defaultValue: true,
    },
    {
      name: 'showContact',
      type: 'checkbox',
      label: 'Show Contact Info',
      defaultValue: true,
    },
    {
      name: 'showSocialMedia',
      type: 'checkbox',
      label: 'Show Social Media Links',
      defaultValue: true,
    },
    {
      name: 'showSchedule',
      type: 'checkbox',
      label: 'Show Schedule',
      defaultValue: false,
    },
    {
      name: 'showCTA',
      type: 'checkbox',
      label: 'Show CTA Section',
      defaultValue: true,
    },
    {
      name: 'showRelatedMembers',
      type: 'checkbox',
      label: 'Show Related Team Members',
      defaultValue: true,
    },
    {
      name: 'relatedMembersCount',
      type: 'number',
      label: 'Number of Related Members',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.showRelatedMembers,
      },
    },
    {
      name: 'relatedMembersTitle',
      type: 'text',
      label: 'Related Members Title',
      defaultValue: 'Alti membri ai echipei',
      admin: {
        condition: (_, siblingData) => siblingData?.showRelatedMembers,
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    // Configurable Labels Group
    {
      name: 'labels',
      type: 'group',
      label: 'Text Labels (for i18n)',
      admin: {
        description: 'Customize all text labels for different languages',
      },
      fields: [
        // Breadcrumb labels
        {
          name: 'breadcrumbHome',
          type: 'text',
          label: 'Breadcrumb - Home',
          defaultValue: 'Acasa',
        },
        {
          name: 'breadcrumbTeam',
          type: 'text',
          label: 'Breadcrumb - Team',
          defaultValue: 'Echipa',
        },
        // Section titles
        {
          name: 'experienceTitle',
          type: 'text',
          label: 'Experience Label',
          defaultValue: 'Ani experienta',
        },
        {
          name: 'specializationsTitle',
          type: 'text',
          label: 'Specializations Title',
          defaultValue: 'Specializari',
        },
        {
          name: 'scheduleTitle',
          type: 'text',
          label: 'Schedule Title',
          defaultValue: 'Program',
        },
        {
          name: 'contactTitle',
          type: 'text',
          label: 'Contact Title',
          defaultValue: 'Contact',
        },
        // CTA labels
        {
          name: 'ctaTitle',
          type: 'text',
          label: 'CTA Title (use {name} for member first name)',
          defaultValue: 'Vrei sa lucrezi cu {name}?',
        },
        {
          name: 'ctaDescription',
          type: 'textarea',
          label: 'CTA Description',
          defaultValue: 'Contacteaza-ne pentru a programa o sesiune de antrenament sau pentru mai multe informatii.',
        },
        {
          name: 'ctaButtonText',
          type: 'text',
          label: 'CTA Button Text',
          defaultValue: 'Contacteaza-ne',
        },
        {
          name: 'ctaSecondaryButtonText',
          type: 'text',
          label: 'CTA Secondary Button Text',
          defaultValue: 'Vezi clasele disponibile',
        },
        {
          name: 'viewAllTeamText',
          type: 'text',
          label: 'View All Team Button',
          defaultValue: 'Vezi toti membrii echipei',
        },
        // Error message
        {
          name: 'notFoundMessage',
          type: 'text',
          label: 'Member Not Found Message',
          defaultValue: 'Membrul echipei nu a fost gasit',
        },
      ],
    },
    // Links configuration
    {
      name: 'links',
      type: 'group',
      label: 'Link Paths',
      admin: {
        description: 'Configure URL paths',
      },
      fields: [
        {
          name: 'teamBasePath',
          type: 'text',
          label: 'Team Base Path',
          defaultValue: '/antrenori',
        },
        {
          name: 'contactPath',
          type: 'text',
          label: 'Contact Page Path',
          defaultValue: '/contact',
        },
        {
          name: 'classesPath',
          type: 'text',
          label: 'Classes Page Path',
          defaultValue: '/clase',
        },
        {
          name: 'bookingPath',
          type: 'text',
          label: 'Booking Page Path',
          defaultValue: '/clase/inscriere',
        },
      ],
    },
  ],
}
