import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: {
    singular: 'Contact',
    plural: 'Contact',
  },
  imageURL: '/blocks/contact.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'split',
      options: [
        { label: 'Split (formular + info)', value: 'split' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu harta', value: 'with-map' },
        { label: 'Full width', value: 'full-width' },
        { label: 'Minimal (doar info)', value: 'minimal' },
        { label: 'Carduri contact', value: 'cards' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Contacteaza-ne',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    {
      name: 'showForm',
      type: 'checkbox',
      label: 'Afiseaza formular',
      defaultValue: true,
    },
    {
      name: 'formType',
      type: 'select',
      label: 'Tip formular',
      defaultValue: 'standard',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm,
        description: 'Standard = campuri predefinite, Custom = campuri personalizate',
      },
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Personalizat (custom fields)', value: 'custom' },
      ],
    },
    // Standard form fields
    {
      name: 'formFields',
      type: 'group',
      label: 'Campuri formular standard',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm && siblingData?.formType !== 'custom',
      },
      fields: [
        {
          name: 'showName',
          type: 'checkbox',
          label: 'Nume',
          defaultValue: true,
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          label: 'Email',
          defaultValue: true,
        },
        {
          name: 'showPhone',
          type: 'checkbox',
          label: 'Telefon',
          defaultValue: true,
        },
        {
          name: 'showSubject',
          type: 'checkbox',
          label: 'Subiect',
          defaultValue: false,
        },
        {
          name: 'showService',
          type: 'checkbox',
          label: 'Selectie serviciu',
          defaultValue: false,
        },
        {
          name: 'showMessage',
          type: 'checkbox',
          label: 'Mesaj',
          defaultValue: true,
        },
      ],
    },
    // Custom form fields array
    {
      name: 'customFields',
      type: 'array',
      label: 'Campuri personalizate',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm && siblingData?.formType === 'custom',
        description: 'Defineste campurile formularului in ordinea dorita',
      },
      fields: [
        {
          name: 'fieldType',
          type: 'select',
          label: 'Tip camp',
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Telefon', value: 'tel' },
            { label: 'Numar', value: 'number' },
            { label: 'Textarea (mesaj lung)', value: 'textarea' },
            { label: 'Select (dropdown)', value: 'select' },
            { label: 'Checkbox', value: 'checkbox' },
            { label: 'Data', value: 'date' },
            { label: 'Ora', value: 'time' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          label: 'Nume camp (intern)',
          required: true,
          admin: {
            description: 'Ex: preferredClass, experienceLevel (fara spatii sau caractere speciale)',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Eticheta afisata',
          required: true,
          admin: {
            description: 'Ex: Clasa preferata, Nivel experienta',
          },
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Obligatoriu',
          defaultValue: false,
        },
        {
          name: 'halfWidth',
          type: 'checkbox',
          label: 'Jumatate de latime (2 pe rand)',
          defaultValue: false,
        },
        {
          name: 'options',
          type: 'array',
          label: 'Optiuni (pentru select)',
          admin: {
            condition: (_, siblingData) => siblingData?.fieldType === 'select',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text afisat',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              label: 'Valoare',
              required: true,
            },
          ],
        },
        {
          name: 'min',
          type: 'number',
          label: 'Minim',
          admin: {
            condition: (_, siblingData) => siblingData?.fieldType === 'number',
          },
        },
        {
          name: 'max',
          type: 'number',
          label: 'Maxim',
          admin: {
            condition: (_, siblingData) => siblingData?.fieldType === 'number',
          },
        },
      ],
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Text buton trimitere',
      defaultValue: 'Trimite mesajul',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm,
      },
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Mesaj de succes',
      defaultValue: 'Multumim! Mesajul tau a fost trimis cu succes. Te vom contacta in cel mai scurt timp.',
      admin: {
        condition: (_, siblingData) => siblingData?.showForm,
      },
    },
    {
      name: 'showContactInfo',
      type: 'checkbox',
      label: 'Afiseaza informatii contact',
      defaultValue: true,
    },
    {
      name: 'contactInfoItems',
      type: 'group',
      label: 'Informatii afisate',
      admin: {
        condition: (_, siblingData) => siblingData?.showContactInfo,
      },
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
    {
      name: 'showMap',
      type: 'checkbox',
      label: 'Afiseaza harta',
      defaultValue: false,
    },
    {
      name: 'mapPosition',
      type: 'select',
      label: 'Pozitie harta',
      defaultValue: 'bottom',
      admin: {
        condition: (_, siblingData) => siblingData?.showMap,
      },
      options: [
        { label: 'Deasupra', value: 'top' },
        { label: 'Dedesubt', value: 'bottom' },
        { label: 'Lateral', value: 'side' },
      ],
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
    // Configurable labels for i18n
    {
      name: 'labels',
      type: 'group',
      label: 'Text Labels (i18n)',
      admin: {
        description: 'Personalizare text pentru diferite limbi',
      },
      fields: [
        {
          name: 'formTitle',
          type: 'text',
          label: 'Titlu formular',
          defaultValue: 'Trimite-ne un mesaj',
        },
        {
          name: 'contactInfoTitle',
          type: 'text',
          label: 'Titlu informatii contact',
          defaultValue: 'Informatii de contact',
        },
        {
          name: 'nameLabel',
          type: 'text',
          label: 'Label nume',
          defaultValue: 'Nume complet',
        },
        {
          name: 'emailLabel',
          type: 'text',
          label: 'Label email',
          defaultValue: 'Email',
        },
        {
          name: 'phoneLabel',
          type: 'text',
          label: 'Label telefon',
          defaultValue: 'Telefon',
        },
        {
          name: 'subjectLabel',
          type: 'text',
          label: 'Label subiect',
          defaultValue: 'Subiect',
        },
        {
          name: 'serviceLabel',
          type: 'text',
          label: 'Label serviciu',
          defaultValue: 'Serviciu de interes',
        },
        {
          name: 'messageLabel',
          type: 'text',
          label: 'Label mesaj',
          defaultValue: 'Mesaj',
        },
        {
          name: 'selectPlaceholder',
          type: 'text',
          label: 'Placeholder select',
          defaultValue: 'Selecteaza o optiune',
        },
        {
          name: 'requiredText',
          type: 'text',
          label: 'Text camp obligatoriu',
          defaultValue: '*',
        },
        {
          name: 'submittingText',
          type: 'text',
          label: 'Text in timp ce se trimite',
          defaultValue: 'Se trimite...',
        },
        {
          name: 'errorMessage',
          type: 'text',
          label: 'Mesaj eroare',
          defaultValue: 'A aparut o eroare. Te rugam sa incerci din nou.',
        },
        {
          name: 'addressLabel',
          type: 'text',
          label: 'Label adresa',
          defaultValue: 'Adresa',
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
  ],
}
