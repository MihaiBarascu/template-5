import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletter',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'simple',
      options: [
        { label: 'Simplu', value: 'simple' },
        { label: 'Cu imagine de fundal', value: 'with-image' },
        { label: 'Inchis (dark)', value: 'dark' },
        { label: 'Cu pattern', value: 'with-pattern' },
        { label: 'Inline (compact)', value: 'inline' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu',
      defaultValue: 'Aboneaza-te la Newsletter',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Descriere',
      defaultValue: 'Primeste noutati, oferte speciale si sfaturi direct in inbox.',
    },
    {
      name: 'placeholder',
      type: 'text',
      label: 'Placeholder input',
      defaultValue: 'Adresa ta de email',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Text buton',
      defaultValue: 'Aboneaza-te',
    },
    {
      name: 'successMessage',
      type: 'text',
      label: 'Mesaj succes',
      defaultValue: 'Te-ai abonat cu succes! Multumim.',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine fundal (pentru varianta cu imagine)',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-image',
      },
    },
    {
      name: 'privacyText',
      type: 'text',
      label: 'Text privacy',
      defaultValue: 'Datele tale sunt in siguranta. Nu facem spam.',
    },
    {
      name: 'showPrivacyLink',
      type: 'checkbox',
      label: 'Afiseaza link politica confidentialitate',
      defaultValue: true,
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Beneficii (optional)',
      maxRows: 4,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Beneficiu',
        },
      ],
    },
  ],
}

export default NewsletterBlock
