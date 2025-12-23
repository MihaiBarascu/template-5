import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const BookingBlock: Block = {
  slug: 'booking',
  interfaceName: 'BookingBlock',
  labels: {
    singular: 'Programare',
    plural: 'Programare',
  },
  imageURL: '/blocks/booking.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Cu selectie serviciu', value: 'with-service' },
        { label: 'Complet (serviciu + persoana)', value: 'full' },
      ],
    },
    ...headingFields(),
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showServiceSelection',
          type: 'checkbox',
          label: 'Selectie serviciu',
          defaultValue: true,
        },
        {
          name: 'showTeamSelection',
          type: 'checkbox',
          label: 'Selectie persoana',
          defaultValue: false,
        },
        {
          name: 'showDatePicker',
          type: 'checkbox',
          label: 'Selectie data',
          defaultValue: true,
        },
        {
          name: 'showTimePicker',
          type: 'checkbox',
          label: 'Selectie ora',
          defaultValue: true,
        },
        {
          name: 'showWhatsappOption',
          type: 'checkbox',
          label: 'Afiseaza optiunea WhatsApp',
          defaultValue: true,
        },
        {
          name: 'showPhoneOption',
          type: 'checkbox',
          label: 'Afiseaza optiunea telefon',
          defaultValue: true,
        },
      ],
    }),
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'submitButtonText',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Programeaza-te',
        },
        {
          name: 'successMessage',
          type: 'textarea',
          label: 'Mesaj de succes',
          defaultValue: 'Programarea ta a fost trimisa cu succes!',
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Culoare fundal',
          defaultValue: 'light',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
