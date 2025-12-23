import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { linkFields } from '@/fields/link'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Setari Site',
    description: 'Configurare header: navigatie, logo, top bar',
  },
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
        { label: 'Full Width (fara container, pe tot ecranul)', value: 'full-width' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'showTopBar',
      type: 'checkbox',
      label: 'Afiseaza Top Bar',
      defaultValue: false,
      admin: {
        description: 'Bara superioara cu social media, contact, mesaj etc.',
      },
    },
    {
      name: 'topBar',
      type: 'group',
      label: 'Configurare Top Bar',
      admin: {
        condition: (_, siblingData) => siblingData?.showTopBar === true,
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Culoare fundal',
          defaultValue: 'dark',
          options: [
            { label: 'Inchis (dark)', value: 'dark' },
            { label: 'Primary', value: 'primary' },
            { label: 'Transparent', value: 'transparent' },
            { label: 'Deschis (light)', value: 'light' },
          ],
        },
        {
          name: 'layout',
          type: 'select',
          label: 'Aranjament',
          defaultValue: 'social-left',
          options: [
            { label: 'Social stanga, mesaj dreapta', value: 'social-left' },
            { label: 'Mesaj stanga, social dreapta', value: 'message-left' },
            { label: 'Contact stanga, social dreapta', value: 'contact-left' },
            { label: 'Centrat', value: 'centered' },
          ],
        },
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
          label: 'Afiseaza social media (din BusinessInfo)',
          defaultValue: true,
        },
        {
          name: 'customSocialLinks',
          type: 'array',
          label: 'Social links personalizate (optional)',
          admin: {
            description: 'Daca nu sunt setate, se folosesc link-urile din BusinessInfo',
          },
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platforma',
              required: true,
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'Twitter/X', value: 'twitter' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'WhatsApp', value: 'whatsapp' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
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
          label: 'Mesaj personalizat',
          admin: {
            description: 'Ex: Te rugam sa te intorci la persoana care te-a recomandat!',
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
    {
      name: 'isTransparent',
      type: 'checkbox',
      label: 'Header transparent (overlay pe hero)',
      defaultValue: false,
      admin: {
        description: 'Header-ul va fi transparent și suprapus peste primul block (ideal pentru Video Hero)',
      },
    },
    {
      name: 'transparentTextColor',
      type: 'select',
      label: 'Culoare text când transparent',
      defaultValue: 'white',
      options: [
        { label: 'Alb', value: 'white' },
        { label: 'Negru', value: 'dark' },
        { label: 'Auto (bazat pe hero)', value: 'auto' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.isTransparent,
        description: 'Culoarea textului și logo-ului când header-ul este transparent',
      },
    },
  ],
}
