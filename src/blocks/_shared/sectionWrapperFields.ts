import type { Field } from 'payload'

/**
 * Shared fields for SectionWrapper configuration
 * Add these to any block that should support advanced layout options
 *
 * Usage in block config:
 * ```ts
 * import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
 *
 * fields: [
 *   // ... your block fields
 *   ...sectionWrapperFields,
 * ]
 * ```
 */
export const sectionWrapperFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Setari Layout & Design',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'sectionFullWidth',
            type: 'checkbox',
            label: 'Full Width (fara container)',
            defaultValue: false,
            admin: {
              width: '50%',
              description: 'Continutul va ocupa toata latimea ecranului',
            },
          },
          {
            name: 'sectionContainerSize',
            type: 'select',
            label: 'Marime container',
            defaultValue: 'default',
            options: [
              { label: 'Default (1280px)', value: 'default' },
              { label: 'Narrow (896px)', value: 'narrow' },
              { label: 'Wide (1536px)', value: 'wide' },
              { label: 'Full', value: 'full' },
            ],
            admin: {
              width: '50%',
              condition: (_, siblingData) => !siblingData?.sectionFullWidth,
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'sectionPaddingTop',
            type: 'select',
            label: 'Padding sus',
            defaultValue: 'large',
            options: [
              { label: 'Fara', value: 'none' },
              { label: 'Mic (32px / 48px)', value: 'small' },
              { label: 'Mediu (48px / 64px)', value: 'medium' },
              { label: 'Mare (64px / 96px)', value: 'large' },
              { label: 'Extra Large (96px / 128px)', value: 'xl' },
            ],
            admin: {
              width: '50%',
            },
          },
          {
            name: 'sectionPaddingBottom',
            type: 'select',
            label: 'Padding jos',
            defaultValue: 'large',
            options: [
              { label: 'Fara', value: 'none' },
              { label: 'Mic (32px / 48px)', value: 'small' },
              { label: 'Mediu (48px / 64px)', value: 'medium' },
              { label: 'Mare (64px / 96px)', value: 'large' },
              { label: 'Extra Large (96px / 128px)', value: 'xl' },
            ],
            admin: {
              width: '50%',
            },
          },
        ],
      },
      {
        name: 'sectionBackgroundImage',
        type: 'upload',
        relationTo: 'media',
        label: 'Imagine fundal',
        admin: {
          description: 'Optional: imagine de fundal pentru sectiune',
        },
      },
      {
        name: 'sectionBackgroundVideo',
        type: 'group',
        label: 'Video fundal',
        fields: [
          {
            name: 'url',
            type: 'text',
            label: 'URL video (MP4)',
            admin: {
              description: 'Link direct catre fisierul MP4 (ex: /videos/hero.mp4 sau URL extern)',
            },
          },
          {
            name: 'poster',
            type: 'upload',
            relationTo: 'media',
            label: 'Poster (imagine placeholder)',
            admin: {
              condition: (_, siblingData) => !!siblingData?.url,
            },
          },
          {
            type: 'row',
            admin: {
              condition: (_, siblingData) => !!siblingData?.url,
            },
            fields: [
              {
                name: 'autoplay',
                type: 'checkbox',
                label: 'Autoplay',
                defaultValue: true,
                admin: { width: '25%' },
              },
              {
                name: 'loop',
                type: 'checkbox',
                label: 'Loop',
                defaultValue: true,
                admin: { width: '25%' },
              },
              {
                name: 'muted',
                type: 'checkbox',
                label: 'Muted',
                defaultValue: true,
                admin: { width: '25%' },
              },
              {
                name: 'playbackSpeed',
                type: 'number',
                label: 'Viteza',
                defaultValue: 1,
                min: 0.1,
                max: 2,
                admin: { width: '25%' },
              },
            ],
          },
        ],
      },
      {
        name: 'sectionOverlay',
        type: 'group',
        label: 'Overlay',
        admin: {
          description: 'Adauga un strat colorat peste imagine/video pentru lizibilitate',
        },
        fields: [
          {
            name: 'enabled',
            type: 'checkbox',
            label: 'Activeaza overlay',
            defaultValue: true,
          },
          {
            type: 'row',
            admin: {
              condition: (_, siblingData) => siblingData?.enabled,
            },
            fields: [
              {
                name: 'type',
                type: 'select',
                label: 'Tip overlay',
                defaultValue: 'solid',
                options: [
                  { label: 'Solid', value: 'solid' },
                  { label: 'Gradient in sus', value: 'gradient-to-t' },
                  { label: 'Gradient in jos', value: 'gradient-to-b' },
                  { label: 'Gradient radial', value: 'gradient-radial' },
                ],
                admin: { width: '33%' },
              },
              {
                name: 'color',
                type: 'text',
                label: 'Culoare',
                defaultValue: 'rgba(0, 0, 0, 0.5)',
                admin: {
                  width: '33%',
                  description: 'rgba() sau hex',
                },
              },
              {
                name: 'opacity',
                type: 'number',
                label: 'Opacitate (%)',
                defaultValue: 50,
                min: 0,
                max: 100,
                admin: { width: '33%' },
              },
            ],
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'sectionParallax',
            type: 'checkbox',
            label: 'Efect Parallax',
            defaultValue: false,
            admin: {
              width: '50%',
              description: 'Fundalul se misca mai lent decat continutul',
            },
          },
          {
            name: 'sectionParallaxSpeed',
            type: 'number',
            label: 'Viteza parallax',
            defaultValue: 0.5,
            min: 0.1,
            max: 1,
            admin: {
              width: '50%',
              condition: (_, siblingData) => siblingData?.sectionParallax,
            },
          },
        ],
      },
      {
        name: 'sectionId',
        type: 'text',
        label: 'ID sectiune (pentru ancore)',
        admin: {
          description: 'Optional: pentru link-uri tip #sectiune',
        },
      },
      {
        name: 'sectionAnimation',
        type: 'group',
        label: 'Animatii',
        fields: [
          {
            name: 'enabled',
            type: 'checkbox',
            label: 'Activeaza animatii',
            defaultValue: true,
          },
          {
            type: 'row',
            admin: {
              condition: (_, siblingData) => siblingData?.enabled,
            },
            fields: [
              {
                name: 'type',
                type: 'select',
                label: 'Tip animatie',
                defaultValue: 'fade-in-up',
                options: [
                  { label: 'Fade In Up', value: 'fade-in-up' },
                  { label: 'Fade In', value: 'fade-in' },
                  { label: 'Slide In Left', value: 'slide-in-left' },
                  { label: 'Slide In Right', value: 'slide-in-right' },
                  { label: 'Scale Up', value: 'scale-up' },
                  { label: 'Blur In', value: 'blur-in' },
                ],
                admin: { width: '50%' },
              },
              {
                name: 'stagger',
                type: 'checkbox',
                label: 'Stagger (animatie pe rand)',
                defaultValue: true,
                admin: { width: '50%' },
              },
            ],
          },
          {
            type: 'row',
            admin: {
              condition: (_, siblingData) => siblingData?.enabled,
            },
            fields: [
              {
                name: 'duration',
                type: 'number',
                label: 'Durata (ms)',
                defaultValue: 600,
                min: 100,
                max: 2000,
                admin: { width: '50%' },
              },
              {
                name: 'delay',
                type: 'number',
                label: 'Intarziere initiala (ms)',
                defaultValue: 0,
                min: 0,
                max: 1000,
                admin: { width: '50%' },
              },
            ],
          },
        ],
      },
    ],
  },
]

/**
 * Type for the section wrapper data from Payload
 */
export interface SectionWrapperData {
  sectionFullWidth?: boolean
  sectionContainerSize?: 'default' | 'narrow' | 'wide' | 'full'
  sectionPaddingTop?: 'none' | 'small' | 'medium' | 'large' | 'xl'
  sectionPaddingBottom?: 'none' | 'small' | 'medium' | 'large' | 'xl'
  sectionBackgroundImage?: string | { url?: string }
  sectionBackgroundVideo?: {
    url?: string
    poster?: string | { url?: string }
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    playbackSpeed?: number
  }
  sectionOverlay?: {
    enabled?: boolean
    type?: 'solid' | 'gradient-to-t' | 'gradient-to-b' | 'gradient-radial'
    color?: string
    opacity?: number
  }
  sectionParallax?: boolean
  sectionParallaxSpeed?: number
  sectionId?: string
  sectionAnimation?: {
    enabled?: boolean
    type?: 'fade-in-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'scale-up' | 'blur-in'
    stagger?: boolean
    duration?: number
    delay?: number
  }
}

/**
 * Helper to extract SectionWrapper props from block data
 */
export function getSectionWrapperProps(data: SectionWrapperData) {
  return {
    fullWidth: data.sectionFullWidth,
    containerSize: data.sectionContainerSize,
    paddingTop: data.sectionPaddingTop,
    paddingBottom: data.sectionPaddingBottom,
    backgroundImage: data.sectionBackgroundImage,
    backgroundVideo: data.sectionBackgroundVideo,
    overlay: data.sectionOverlay,
    parallax: data.sectionParallax,
    parallaxSpeed: data.sectionParallaxSpeed,
    id: data.sectionId,
    animation: data.sectionAnimation,
  }
}
