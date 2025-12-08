import type { Block } from 'payload'

export const ServiceDetailBlock: Block = {
  slug: 'serviceDetail',
  interfaceName: 'ServiceDetailBlock',
  labels: {
    singular: 'Service Detail',
    plural: 'Service Details',
  },
  imageURL: '/blocks/service-detail.svg',
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Serviciu',
      required: true,
      admin: {
        description: 'Selecteaza serviciul de afisat',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'full',
      options: [
        { label: 'Full (Image + Sidebar)', value: 'full' },
        { label: 'Compact (No Sidebar)', value: 'compact' },
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
      name: 'showSchedule',
      type: 'checkbox',
      label: 'Show Schedule',
      defaultValue: true,
      admin: {
        description: 'Only shown if service has schedule data',
      },
    },
    {
      name: 'showPricing',
      type: 'checkbox',
      label: 'Show Pricing',
      defaultValue: true,
    },
    {
      name: 'showTeamMember',
      type: 'checkbox',
      label: 'Show Team Member Card',
      defaultValue: true,
      admin: {
        description: 'Shows assigned team member/instructor',
      },
    },
    {
      name: 'showBenefits',
      type: 'checkbox',
      label: 'Show Benefits Section',
      defaultValue: true,
    },
    {
      name: 'showFeatures',
      type: 'checkbox',
      label: 'Show Features (What\'s Included)',
      defaultValue: true,
    },
    {
      name: 'showRequirements',
      type: 'checkbox',
      label: 'Show Requirements',
      defaultValue: true,
    },
    {
      name: 'showRelatedServices',
      type: 'checkbox',
      label: 'Show Related Services',
      defaultValue: true,
    },
    {
      name: 'relatedServicesCount',
      type: 'number',
      label: 'Number of Related Services',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.showRelatedServices,
      },
    },
    {
      name: 'relatedServicesTitle',
      type: 'text',
      label: 'Related Services Title',
      defaultValue: 'Servicii similare',
      admin: {
        condition: (_, siblingData) => siblingData?.showRelatedServices,
      },
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      label: 'CTA Button Text',
      defaultValue: 'Rezerva acum',
    },
    {
      name: 'ctaButtonLink',
      type: 'text',
      label: 'CTA Button Link (Optional)',
      admin: {
        description: 'Leave empty to use default booking link',
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
          name: 'breadcrumbServices',
          type: 'text',
          label: 'Breadcrumb - Services',
          defaultValue: 'Servicii',
        },
        // Section titles
        {
          name: 'benefitsTitle',
          type: 'text',
          label: 'Benefits Section Title',
          defaultValue: 'Beneficii',
        },
        {
          name: 'featuresTitle',
          type: 'text',
          label: 'Features Section Title',
          defaultValue: 'Ce include',
        },
        {
          name: 'scheduleTitle',
          type: 'text',
          label: 'Schedule Section Title',
          defaultValue: 'Program',
        },
        {
          name: 'pricingTitle',
          type: 'text',
          label: 'Pricing Section Title',
          defaultValue: 'Preturi',
        },
        {
          name: 'teamMemberTitle',
          type: 'text',
          label: 'Team Member Section Title',
          defaultValue: 'Responsabil',
        },
        {
          name: 'requirementsTitle',
          type: 'text',
          label: 'Requirements Section Title',
          defaultValue: 'Cerinte / Echipament necesar',
        },
        {
          name: 'viewAllServicesText',
          type: 'text',
          label: 'View All Services Button',
          defaultValue: 'Vezi toate serviciile',
        },
        // Stats labels
        {
          name: 'minutesLabel',
          type: 'text',
          label: 'Minutes Label',
          defaultValue: 'minute',
        },
        {
          name: 'spotsLabel',
          type: 'text',
          label: 'Spots/Capacity Label',
          defaultValue: 'locuri',
        },
        {
          name: 'priceFromLabel',
          type: 'text',
          label: 'Price From Label',
          defaultValue: 'de la',
        },
        // Pricing labels
        {
          name: 'dropInLabel',
          type: 'text',
          label: 'Drop-in Price Label',
          defaultValue: 'Pret per sedinta',
        },
        {
          name: 'monthlyLabel',
          type: 'text',
          label: 'Monthly Price Label',
          defaultValue: 'Abonament lunar',
        },
        {
          name: 'packageLabel',
          type: 'text',
          label: 'Package Label (use {sessions} for number)',
          defaultValue: 'Pachet {sessions} sedinte',
        },
        {
          name: 'currencySymbol',
          type: 'text',
          label: 'Currency Symbol',
          defaultValue: 'RON',
        },
        // Day labels (JSON format for flexibility)
        {
          name: 'dayLabels',
          type: 'json',
          label: 'Day Labels (JSON)',
          defaultValue: {
            monday: 'Luni',
            tuesday: 'Marti',
            wednesday: 'Miercuri',
            thursday: 'Joi',
            friday: 'Vineri',
            saturday: 'Sambata',
            sunday: 'Duminica',
          },
          admin: {
            description: 'JSON object with day translations: { "monday": "Luni", ... }',
          },
        },
        // Difficulty labels (JSON format)
        {
          name: 'difficultyLabels',
          type: 'json',
          label: 'Difficulty Labels (JSON)',
          defaultValue: {
            beginner: 'Incepator',
            intermediate: 'Intermediar',
            advanced: 'Avansat',
            'all-levels': 'Toate nivelurile',
          },
          admin: {
            description: 'JSON object with difficulty translations',
          },
        },
        // Service type labels (JSON format)
        {
          name: 'serviceTypeLabels',
          type: 'json',
          label: 'Service Type Labels (JSON)',
          defaultValue: {
            standard: 'Standard',
            class: 'Clasa',
            individual: 'Sesiune individuala',
            consultation: 'Consultatie',
            treatment: 'Tratament',
          },
          admin: {
            description: 'JSON object with service type translations',
          },
        },
        // Error message
        {
          name: 'notFoundMessage',
          type: 'text',
          label: 'Service Not Found Message',
          defaultValue: 'Serviciul nu a fost gasit',
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
          name: 'servicesBasePath',
          type: 'text',
          label: 'Services Base Path',
          defaultValue: '/servicii',
        },
        {
          name: 'teamBasePath',
          type: 'text',
          label: 'Team Base Path',
          defaultValue: '/echipa',
        },
        {
          name: 'bookingPath',
          type: 'text',
          label: 'Booking Page Path',
          defaultValue: '/rezervare',
        },
      ],
    },
  ],
}
