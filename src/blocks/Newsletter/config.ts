import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, advancedSettingsGroup } from '../_shared/commonFields'
import { patternField } from '@/fields/patternField'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletter',
  },
  imageURL: '/blocks/newsletter.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'simple',
      options: [
        { label: 'Simplu', value: 'simple' },
        { label: 'Cu imagine de fundal', value: 'with-image' },
        { label: 'Inchis (dark)', value: 'dark' },
        { label: 'Cu pattern configurabil', value: 'with-pattern' },
        { label: 'Inline (compact)', value: 'inline' },
      ],
    },
    ...headingFields({ headingDefault: 'Aboneaza-te la Newsletter' }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine fundal',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-image',
      },
    },
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Aboneaza-te',
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder input',
          defaultValue: 'Adresa ta de email',
        },
        {
          name: 'successMessage',
          type: 'text',
          label: 'Mesaj succes',
          defaultValue: 'Te-ai abonat cu succes! Multumim.',
        },
        {
          name: 'requireConsent',
          type: 'checkbox',
          label: 'Necesita acord explicit (checkbox GDPR)',
          defaultValue: false,
        },
        {
          name: 'consentText',
          type: 'text',
          label: 'Text checkbox acord',
          defaultValue: 'Da, ma abonez la newsletter',
          admin: {
            condition: (_, siblingData) => siblingData?.requireConsent,
          },
        },
        // Pattern configuration
        ...patternField({
          condition: (_, siblingData) => (siblingData as Record<string, unknown>)?.variant === 'with-pattern',
        }),
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}

export default NewsletterBlock
