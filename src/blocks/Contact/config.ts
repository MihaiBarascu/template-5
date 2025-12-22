import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'

/**
 * ContactInfo Block
 *
 * Displays business contact information (address, phone, email, hours, social).
 * For maps, use the separate Map block.
 * For contact forms, use the Form block.
 *
 * To create a full contact page with form + info + map, use the Content block
 * with columns:
 *   - Column 1 (50%): ContactInfo block
 *   - Column 2 (50%): Form block
 *   - Below: Map block (full width)
 */
export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Date Contact',
    plural: 'Date Contact',
  },
  imageURL: '/blocks/contact.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (lista verticala)', value: 'standard' },
        { label: 'Carduri', value: 'cards' },
        { label: 'Compact (o linie)', value: 'compact' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Full (info + formular + harta)', value: 'full' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    // Contact info display options
    {
      name: 'contactInfoItems',
      type: 'group',
      label: 'Informatii afisate',
      fields: [
        {
          name: 'showAddress',
          type: 'checkbox',
          label: 'Adresa',
          defaultValue: true,
        },
        {
          name: 'showPhone',
          type: 'checkbox',
          label: 'Telefon',
          defaultValue: true,
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          label: 'Email',
          defaultValue: true,
        },
        {
          name: 'showWorkingHours',
          type: 'checkbox',
          label: 'Program',
          defaultValue: true,
        },
        {
          name: 'showSocial',
          type: 'checkbox',
          label: 'Social media',
          defaultValue: false,
        },
      ],
    },
    // Form relationship - for 'full' variant
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Formular contact',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'full',
        description: 'Selecteaza formularul de contact pentru varianta Full',
      },
    },
    // Map settings - for 'full' variant
    {
      name: 'mapSettings',
      type: 'group',
      label: 'Setari harta',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'full',
      },
      fields: [
        {
          name: 'showMap',
          type: 'checkbox',
          label: 'Afiseaza harta',
          defaultValue: true,
        },
        {
          name: 'mapHeight',
          type: 'select',
          label: 'Inaltime harta',
          defaultValue: 'medium',
          options: [
            { label: 'Mica (300px)', value: 'small' },
            { label: 'Medie (400px)', value: 'medium' },
            { label: 'Mare (500px)', value: 'large' },
          ],
        },
        {
          name: 'mapHeading',
          type: 'text',
          label: 'Titlu sectiune harta',
          defaultValue: 'Locatia noastra',
        },
      ],
    },
    // Form labels - for 'full' variant
    {
      name: 'formSettings',
      type: 'group',
      label: 'Setari formular',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'full',
      },
      fields: [
        {
          name: 'formHeading',
          type: 'text',
          label: 'Titlu formular',
          defaultValue: 'Trimite-ne un mesaj',
        },
        {
          name: 'formSubheading',
          type: 'textarea',
          label: 'Subtitlu formular',
          defaultValue: 'Completeaza formularul si te vom contacta in cel mai scurt timp',
        },
      ],
    },
    // Background
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'transparent',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    // Labels for i18n
    {
      name: 'labels',
      type: 'group',
      label: 'Text Labels (i18n)',
      admin: {
        description: 'Personalizare text pentru diferite limbi',
        condition: () => false, // Hide by default, show via admin condition if needed
      },
      fields: [
        {
          name: 'addressLabel',
          type: 'text',
          label: 'Label adresa',
          defaultValue: 'Adresa',
        },
        {
          name: 'phoneLabel',
          type: 'text',
          label: 'Label telefon',
          defaultValue: 'Telefon',
        },
        {
          name: 'emailLabel',
          type: 'text',
          label: 'Label email',
          defaultValue: 'Email',
        },
        {
          name: 'scheduleLabel',
          type: 'text',
          label: 'Label program',
          defaultValue: 'Program',
        },
        {
          name: 'socialLabel',
          type: 'text',
          label: 'Label social media',
          defaultValue: 'Social Media',
        },
      ],
    },
    // Section wrapper fields for advanced layout options
    ...sectionWrapperFields,
  ],
}
