import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { linkFields } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta header',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (Logo stanga, meniu dreapta)', value: 'standard' },
        { label: 'Centrat (Logo centru)', value: 'centered' },
        { label: 'Cu TopBar', value: 'with-topbar' },
        { label: 'Transparent (pe hero)', value: 'transparent' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'topBar',
      type: 'group',
      label: 'Top Bar',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-topbar',
      },
      fields: [
        {
          name: 'showPhone',
          type: 'checkbox',
          label: 'Afiseaza telefon',
          defaultValue: true,
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          label: 'Afiseaza email',
          defaultValue: true,
        },
        {
          name: 'showSocial',
          type: 'checkbox',
          label: 'Afiseaza social media',
          defaultValue: true,
        },
        {
          name: 'showWorkingHours',
          type: 'checkbox',
          label: 'Afiseaza program',
          defaultValue: false,
        },
        {
          name: 'customText',
          type: 'text',
          label: 'Text personalizat',
          admin: {
            description: 'Ex: Transport gratuit la comenzi peste 200 lei',
          },
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Meniu navigare',
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text',
          required: true,
        },
        ...linkFields,
        {
          name: 'hasSubmenu',
          type: 'checkbox',
          label: 'Are submeniu',
          defaultValue: false,
        },
        {
          name: 'submenu',
          type: 'array',
          label: 'Submeniu',
          admin: {
            condition: (_, siblingData) => siblingData?.hasSubmenu,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text',
              required: true,
            },
            ...linkFields,
            {
              name: 'description',
              type: 'text',
              label: 'Descriere (optional)',
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (Lucide)',
            },
          ],
        },
      ],
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Afiseaza buton cautare',
      defaultValue: false,
    },
    {
      name: 'showCart',
      type: 'checkbox',
      label: 'Afiseaza cos cumparaturi',
      defaultValue: false,
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Afiseaza buton CTA',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Programeaza-te',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/contact',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Stil',
          defaultValue: 'default',
          options: [
            { label: 'Primary', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
    {
      name: 'sticky',
      type: 'checkbox',
      label: 'Header sticky la scroll',
      defaultValue: true,
    },
  ],
}
