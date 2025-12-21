import type { Field } from 'payload'

/**
 * Reusable pattern field group for blocks
 * Adds professional background patterns to sections
 *
 * Usage in block config:
 * import { patternField } from '@/fields/patternField'
 * fields: [...patternField()]
 *
 * Usage in component:
 * import { SectionPattern } from '@/components/SectionPattern'
 * {pattern?.enabled && <SectionPattern {...pattern} />}
 */

export const patternField = (options?: {
  /** Show condition - when to display the pattern fields */
  condition?: (data: unknown, siblingData: unknown) => boolean
}): Field[] => [
  {
    name: 'pattern',
    type: 'group',
    label: 'Pattern Fundal',
    admin: {
      description: 'Adauga un pattern decorativ profesional in fundal',
      condition: options?.condition,
    },
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        label: 'Activeaza pattern',
        defaultValue: false,
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
            label: 'Tip pattern',
            defaultValue: 'bubbles',
            options: [
              { label: 'Cercuri Organice (Bubbles)', value: 'bubbles' },
              { label: 'Puncte Flotante', value: 'floating-dots' },
              { label: 'Linii Diagonale', value: 'diagonal-lines' },
              { label: 'Valuri', value: 'waves' },
              { label: 'Topografie', value: 'topography' },
              { label: 'Grid Simplu', value: 'grid' },
              { label: 'Hexagoane (Tech)', value: 'hexagons' },
              { label: 'Circuit (Tech)', value: 'circuit' },
              { label: 'Diamante (Luxury)', value: 'diamonds' },
              { label: 'Morocan (Spa/Beauty)', value: 'moroccan' },
              { label: 'Cruci/Plus (Medical)', value: 'plus' },
              { label: 'Textura Grain', value: 'noise' },
              { label: 'Cross-Hatch', value: 'crosshatch' },
            ],
            admin: {
              width: '50%',
            },
          },
          {
            name: 'position',
            type: 'select',
            label: 'Pozitie',
            defaultValue: 'left',
            options: [
              { label: 'Intreg fundalul', value: 'full' },
              { label: 'Stanga (fade)', value: 'left' },
              { label: 'Dreapta (fade)', value: 'right' },
              { label: 'Colt stanga-sus', value: 'top-left' },
              { label: 'Colt dreapta-sus', value: 'top-right' },
              { label: 'Colt stanga-jos', value: 'bottom-left' },
              { label: 'Colt dreapta-jos', value: 'bottom-right' },
              { label: 'Centru (fade circular)', value: 'center' },
            ],
            admin: {
              width: '50%',
            },
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
            name: 'color',
            type: 'select',
            label: 'Culoare',
            defaultValue: 'primary',
            options: [
              { label: 'Primary (din tema)', value: 'primary' },
              { label: 'Accent (din tema)', value: 'accent' },
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' },
              { label: 'Alb', value: 'white' },
              { label: 'Negru', value: 'black' },
            ],
            admin: {
              width: '33%',
            },
          },
          {
            name: 'opacity',
            type: 'select',
            label: 'Opacitate',
            defaultValue: '8',
            options: [
              { label: 'Foarte subtila (3%)', value: '3' },
              { label: 'Subtila (5%)', value: '5' },
              { label: 'Normala (8%)', value: '8' },
              { label: 'Vizibila (10%)', value: '10' },
              { label: 'Accentuata (15%)', value: '15' },
              { label: 'Puternica (20%)', value: '20' },
              { label: 'Foarte puternica (25%)', value: '25' },
              { label: 'Intensa (30%)', value: '30' },
              { label: 'Foarte intensa (40%)', value: '40' },
              { label: 'Maxima (50%)', value: '50' },
            ],
            admin: {
              width: '33%',
              description: 'Cu cat e mai mare textul, cu atat opacitatea trebuie sa fie mai mica',
            },
          },
          {
            name: 'size',
            type: 'select',
            label: 'Dimensiune elemente',
            defaultValue: 'md',
            options: [
              { label: 'Mic', value: 'sm' },
              { label: 'Mediu', value: 'md' },
              { label: 'Mare', value: 'lg' },
            ],
            admin: {
              width: '33%',
            },
          },
        ],
      },
      {
        name: 'animated',
        type: 'checkbox',
        label: 'Animatie subtila (pulse)',
        defaultValue: false,
        admin: {
          condition: (_, siblingData) => siblingData?.enabled,
          description: 'Adauga o animatie de pulsatie foarte subtila',
        },
      },
    ],
  },
]

// Type for pattern config - use in components
export interface PatternConfig {
  enabled?: boolean | null
  type?: 'bubbles' | 'floating-dots' | 'diagonal-lines' | 'waves' | 'topography' | 'grid' | 'hexagons' | 'circuit' | 'diamonds' | 'moroccan' | 'plus' | 'noise' | 'crosshatch' | null
  position?: 'full' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | null
  color?: 'primary' | 'accent' | 'dark' | 'light' | 'white' | 'black' | null
  opacity?: string | null
  size?: 'sm' | 'md' | 'lg' | null
  animated?: boolean | null
}

// Helper to convert pattern config to component props
export const getPatternProps = (pattern?: PatternConfig | null) => {
  if (!pattern?.enabled) return null

  return {
    type: pattern.type || 'bubbles',
    position: pattern.position || 'left',
    color: pattern.color || 'primary',
    opacity: parseInt(pattern.opacity || '8', 10) / 100,
    size: pattern.size || 'md',
    animated: pattern.animated || false,
  }
}

export default patternField
