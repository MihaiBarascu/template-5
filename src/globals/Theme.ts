import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import {
  COLOR_PRESETS,
  FONT_PRESETS,
  STYLE_PRESETS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  ANIMATION_OPTIONS,
  CONTAINER_WIDTH_OPTIONS,
  SECTION_SPACING_OPTIONS,
  HEADING_FONT_OPTIONS,
  BODY_FONT_OPTIONS,
} from '@/config/theme-presets'

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Tema & Design',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Culori',
          fields: [
            {
              name: 'preset',
              type: 'select',
              label: 'Preset culori',
              defaultValue: 'modern',
              options: [...COLOR_PRESETS],
            },
            {
              name: 'colors',
              type: 'group',
              label: 'Culori personalizate',
              admin: {
                condition: (_, siblingData) => siblingData?.preset === 'custom',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'primary',
                      type: 'text',
                      label: 'Culoare primara',
                      defaultValue: '#000000',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'secondary',
                      type: 'text',
                      label: 'Culoare secundara',
                      defaultValue: '#666666',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'accent',
                      type: 'text',
                      label: 'Culoare accent',
                      defaultValue: '#c9a962',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dark',
                      type: 'text',
                      label: 'Culoare inchisa',
                      defaultValue: '#1a1a1a',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'light',
                      type: 'text',
                      label: 'Culoare deschisa',
                      defaultValue: '#f5f5f5',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'surface',
                      type: 'text',
                      label: 'Background suprafata',
                      defaultValue: '#ffffff',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Culoare text',
                      defaultValue: '#1a1a1a',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'textLight',
                      type: 'text',
                      label: 'Text secundar',
                      defaultValue: '#666666',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'border',
                      type: 'text',
                      label: 'Culoare borduri',
                      defaultValue: '#e5e5e5',
                      admin: { width: '33%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tipografie',
          fields: [
            {
              name: 'fontPreset',
              type: 'select',
              label: 'Preset fonturi',
              defaultValue: 'modern',
              options: [...FONT_PRESETS],
            },
            {
              name: 'fonts',
              type: 'group',
              label: 'Setari fonturi',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'headingFont',
                      type: 'select',
                      label: 'Font titluri',
                      defaultValue: 'Inter',
                      options: [...HEADING_FONT_OPTIONS],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'bodyFont',
                      type: 'select',
                      label: 'Font text',
                      defaultValue: 'Inter',
                      options: [...BODY_FONT_OPTIONS],
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Stil Design',
          fields: [
            {
              name: 'stylePreset',
              type: 'select',
              label: 'Stil general',
              defaultValue: 'modern',
              options: [...STYLE_PRESETS],
            },
            {
              name: 'borderRadius',
              type: 'select',
              label: 'Raze colturi',
              defaultValue: 'medium',
              options: [...BORDER_RADIUS_OPTIONS],
            },
            {
              name: 'shadows',
              type: 'select',
              label: 'Umbre',
              defaultValue: 'subtle',
              options: [...SHADOW_OPTIONS],
            },
            {
              name: 'animations',
              type: 'select',
              label: 'Animatii',
              defaultValue: 'subtle',
              options: [...ANIMATION_OPTIONS],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'containerWidth',
              type: 'select',
              label: 'Latime container',
              defaultValue: '1280',
              options: [...CONTAINER_WIDTH_OPTIONS],
            },
            {
              name: 'sectionSpacing',
              type: 'select',
              label: 'Spatiere sectiuni',
              defaultValue: 'normal',
              options: [...SECTION_SPACING_OPTIONS],
            },
          ],
        },
      ],
    },
  ],
}
