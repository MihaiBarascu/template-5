import type { Field } from 'payload'

/**
 * Shared fields for SectionWrapper configuration - SIMPLIFIED
 *
 * Reduced from 52 fields to 5 essential ones.
 * Most users only need: padding and an anchor ID.
 */
export const sectionWrapperFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Layout sectiune',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'sectionPaddingTop',
            type: 'select',
            label: 'Spatiu sus',
            defaultValue: 'large',
            options: [
              { label: 'Fara', value: 'none' },
              { label: 'Mic', value: 'small' },
              { label: 'Mediu', value: 'medium' },
              { label: 'Mare', value: 'large' },
            ],
            admin: { width: '50%' },
          },
          {
            name: 'sectionPaddingBottom',
            type: 'select',
            label: 'Spatiu jos',
            defaultValue: 'large',
            options: [
              { label: 'Fara', value: 'none' },
              { label: 'Mic', value: 'small' },
              { label: 'Mediu', value: 'medium' },
              { label: 'Mare', value: 'large' },
            ],
            admin: { width: '50%' },
          },
        ],
      },
      {
        name: 'sectionBackgroundImage',
        type: 'upload',
        relationTo: 'media',
        label: 'Imagine fundal',
      },
      {
        name: 'sectionId',
        type: 'text',
        label: 'ID sectiune (pentru ancore)',
        admin: {
          description: 'Optional: pentru link-uri tip #sectiune',
        },
      },
    ],
  },
]

/**
 * Type for the section wrapper data from Payload
 */
export interface SectionWrapperData {
  sectionPaddingTop?: 'none' | 'small' | 'medium' | 'large'
  sectionPaddingBottom?: 'none' | 'small' | 'medium' | 'large'
  sectionBackgroundImage?: string | { url?: string }
  sectionId?: string
}

/**
 * Helper to extract SectionWrapper props from block data
 */
export function getSectionWrapperProps(data: SectionWrapperData) {
  return {
    paddingTop: data.sectionPaddingTop,
    paddingBottom: data.sectionPaddingBottom,
    backgroundImage: data.sectionBackgroundImage,
    id: data.sectionId,
  }
}
