import type { Field } from 'payload'

/**
 * Common shared fields for Payload CMS block configurations
 * Eliminates duplicate field definitions across blocks
 *
 * Usage in block config:
 * ```ts
 * import { backgroundColorField, headingFields, ctaButtonFields, iconSelectField } from '../_shared/commonFields'
 *
 * fields: [
 *   ...headingFields,
 *   backgroundColorField(),
 *   // or for specific options:
 *   backgroundColorField({ includeTransparent: true }),
 * ]
 * ```
 */

// ============================================================
// BACKGROUND COLOR FIELD
// ============================================================

interface BackgroundColorOptions {
  /** Include 'transparent' option (default: false) */
  includeTransparent?: boolean
  /** Include 'primary' option (default: true) */
  includePrimary?: boolean
  /** Default value (default: 'default') */
  defaultValue?: 'default' | 'light' | 'dark' | 'primary' | 'transparent'
  /** Show helpful descriptions for each option */
  showDescriptions?: boolean
}

export function backgroundColorField(options: BackgroundColorOptions = {}): Field {
  const {
    includeTransparent = false,
    includePrimary = true,
    defaultValue = 'default',
    showDescriptions = false,
  } = options

  const baseOptions = [
    {
      label: showDescriptions ? 'Default (alb)' : 'Default',
      value: 'default'
    },
    {
      label: showDescriptions ? 'Light (gri deschis)' : 'Light',
      value: 'light'
    },
    {
      label: showDescriptions ? 'Dark (inchis)' : 'Dark',
      value: 'dark'
    },
  ]

  if (includePrimary) {
    baseOptions.push({
      label: showDescriptions ? 'Primary (accent)' : 'Primary',
      value: 'primary'
    })
  }

  if (includeTransparent) {
    baseOptions.push({
      label: 'Transparent',
      value: 'transparent'
    })
  }

  return {
    name: 'backgroundColor',
    type: 'select',
    label: 'Culoare fundal',
    defaultValue,
    options: baseOptions,
  }
}

// ============================================================
// HEADING FIELDS (heading + subheading)
// ============================================================

interface HeadingFieldsOptions {
  /** Default heading text */
  headingDefault?: string
  /** Make heading required */
  headingRequired?: boolean
  /** Include subheading field (default: true) */
  includeSubheading?: boolean
  /** Use richText for subheading instead of textarea */
  richSubheading?: boolean
}

export function headingFields(options: HeadingFieldsOptions = {}): Field[] {
  const {
    headingDefault,
    headingRequired = false,
    includeSubheading = true,
    richSubheading = false,
  } = options

  const fields: Field[] = [
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      required: headingRequired,
      ...(headingDefault && { defaultValue: headingDefault }),
    },
  ]

  if (includeSubheading) {
    fields.push(
      richSubheading
        ? {
            name: 'subheading',
            type: 'richText',
            label: 'Subtitlu / descriere',
          }
        : {
            name: 'subheading',
            type: 'textarea',
            label: 'Subtitlu / descriere',
          }
    )
  }

  return fields
}

// ============================================================
// CTA BUTTON FIELD GROUP
// ============================================================

interface CtaButtonOptions {
  /** Default button label */
  defaultLabel?: string
  /** Group label in admin */
  groupLabel?: string
}

export function ctaButtonFields(options: CtaButtonOptions = {}): Field {
  const {
    defaultLabel = 'Incepe acum',
    groupLabel = 'Buton CTA (optional)',
  } = options

  return {
    name: 'ctaButton',
    type: 'group',
    label: groupLabel,
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        label: 'Afiseaza buton',
        defaultValue: false,
      },
      {
        name: 'label',
        type: 'text',
        label: 'Text buton',
        defaultValue: defaultLabel,
        admin: {
          condition: (_, siblingData) => siblingData?.enabled,
        },
      },
      {
        name: 'link',
        type: 'text',
        label: 'Link buton',
        admin: {
          condition: (_, siblingData) => siblingData?.enabled,
        },
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Stil buton',
        defaultValue: 'primary',
        admin: {
          condition: (_, siblingData) => siblingData?.enabled,
        },
        options: [
          { label: 'Primary (plin)', value: 'primary' },
          { label: 'Secondary (outline)', value: 'secondary' },
          { label: 'Ghost (transparent)', value: 'ghost' },
        ],
      },
    ],
  }
}

// ============================================================
// ICON SELECT FIELD
// ============================================================

/**
 * Common Lucide icon options used across multiple blocks
 * Organized by category for easier selection
 */
export const iconOptions = {
  // Actions
  actions: [
    { label: 'Cauta', value: 'Search' },
    { label: 'Click', value: 'MousePointerClick' },
    { label: 'Bifa', value: 'Check' },
    { label: 'Bifa in cerc', value: 'CheckCircle' },
    { label: 'Plus', value: 'Plus' },
    { label: 'Setari', value: 'Settings' },
  ],
  // Communication
  communication: [
    { label: 'Telefon', value: 'Phone' },
    { label: 'Email', value: 'Mail' },
    { label: 'Mesaj', value: 'MessageSquare' },
    { label: 'MessageCircle', value: 'MessageCircle' },
    { label: 'Headphones (support)', value: 'Headphones' },
  ],
  // Ecommerce
  ecommerce: [
    { label: 'Magazin', value: 'Store' },
    { label: 'Cos', value: 'ShoppingCart' },
    { label: 'Card credit', value: 'CreditCard' },
    { label: 'Pachet', value: 'Package' },
    { label: 'Camion (livrare)', value: 'Truck' },
    { label: 'Cadou', value: 'Gift' },
    { label: 'Banknote', value: 'Banknote' },
    { label: 'CircleDollarSign', value: 'CircleDollarSign' },
  ],
  // Time & Calendar
  time: [
    { label: 'Calendar', value: 'Calendar' },
    { label: 'Ceas', value: 'Clock' },
    { label: 'Zap (rapid)', value: 'Zap' },
  ],
  // Trust & Security
  trust: [
    { label: 'Scut', value: 'Shield' },
    { label: 'Scut cu bifa', value: 'ShieldCheck' },
    { label: 'BadgeCheck', value: 'BadgeCheck' },
    { label: 'Medalie', value: 'Award' },
    { label: 'Stea', value: 'Star' },
    { label: 'ThumbsUp', value: 'ThumbsUp' },
  ],
  // People & Users
  people: [
    { label: 'Utilizator', value: 'User' },
    { label: 'Utilizatori', value: 'Users' },
    { label: 'Inima', value: 'Heart' },
  ],
  // Places
  places: [
    { label: 'Casa', value: 'Home' },
    { label: 'MapPin', value: 'MapPin' },
    { label: 'Globe', value: 'Globe' },
  ],
  // Documents
  documents: [
    { label: 'Formular', value: 'FileText' },
    { label: 'Clipboard', value: 'ClipboardCheck' },
    { label: 'Document', value: 'File' },
  ],
  // Nature & Eco
  nature: [
    { label: 'Frunza (eco)', value: 'Leaf' },
    { label: 'Recycle', value: 'Recycle' },
    { label: 'Soare', value: 'Sun' },
  ],
  // Business specific
  business: [
    { label: 'Foarfece', value: 'Scissors' },
    { label: 'Refresh (retur)', value: 'RefreshCw' },
    { label: 'Target', value: 'Target' },
    { label: 'Rocket', value: 'Rocket' },
    { label: 'Lightbulb', value: 'Lightbulb' },
    { label: 'Trending Up', value: 'TrendingUp' },
    { label: 'BarChart', value: 'BarChart' },
  ],
}

// Flatten all icon options into a single array
export const allIconOptions = Object.values(iconOptions).flat()

interface IconSelectOptions {
  /** Field name (default: 'icon') */
  name?: string
  /** Required field */
  required?: boolean
  /** Include only specific categories */
  categories?: (keyof typeof iconOptions)[]
  /** Custom options to use instead of predefined */
  customOptions?: { label: string; value: string }[]
  /** Admin condition */
  condition?: (data: any, siblingData: any) => boolean
}

export function iconSelectField(options: IconSelectOptions = {}): Field {
  const {
    name = 'icon',
    required = false,
    categories,
    customOptions,
    condition,
  } = options

  let opts = customOptions
  if (!opts) {
    opts = categories
      ? categories.flatMap(cat => iconOptions[cat])
      : allIconOptions
  }

  return {
    name,
    type: 'select',
    label: 'Iconita',
    required,
    options: opts,
    ...(condition && {
      admin: {
        condition,
      },
    }),
  }
}

// ============================================================
// COLUMNS SELECT FIELD
// ============================================================

interface ColumnsSelectOptions {
  /** Available column options */
  options?: ('1' | '2' | '3' | '4' | '5' | '6')[]
  /** Default value */
  defaultValue?: '1' | '2' | '3' | '4'
}

export function columnsSelectField(options: ColumnsSelectOptions = {}): Field {
  const {
    options: colOptions = ['2', '3', '4'],
    defaultValue = '3'
  } = options

  const optionLabels: Record<string, string> = {
    '1': '1 coloana',
    '2': '2 coloane',
    '3': '3 coloane',
    '4': '4 coloane',
    '5': '5 coloane',
    '6': '6 coloane',
  }

  return {
    name: 'columns',
    type: 'select',
    label: 'Coloane',
    defaultValue,
    options: colOptions.map(col => ({
      label: optionLabels[col],
      value: col,
    })),
  }
}

// ============================================================
// SHOW/HIDE TOGGLE FIELDS
// ============================================================

interface ToggleFieldOptions {
  name: string
  label: string
  defaultValue?: boolean
  description?: string
}

export function toggleField(options: ToggleFieldOptions): Field {
  const { name, label, defaultValue = true, description } = options
  return {
    name,
    type: 'checkbox',
    label,
    defaultValue,
    ...(description && {
      admin: { description },
    }),
  }
}

// Preset toggles for common show/hide options
export const showNumbersField: Field = {
  name: 'showNumbers',
  type: 'checkbox',
  label: 'Afiseaza numerele pasilor',
  defaultValue: true,
}

export const showConnectorsField: Field = {
  name: 'showConnectors',
  type: 'checkbox',
  label: 'Afiseaza linii conectoare',
  defaultValue: true,
}

export const showRatingField: Field = {
  name: 'showRating',
  type: 'checkbox',
  label: 'Afiseaza rating (stele)',
  defaultValue: true,
}

export const showAvatarField: Field = {
  name: 'showAvatar',
  type: 'checkbox',
  label: 'Afiseaza avatar',
  defaultValue: true,
}

export const showDescriptionsField: Field = {
  name: 'showDescriptions',
  type: 'checkbox',
  label: 'Afiseaza descrierile',
  defaultValue: true,
}

// ============================================================
// SIZE SELECT FIELDS
// ============================================================

export const iconSizeField: Field = {
  name: 'iconSize',
  type: 'select',
  label: 'Dimensiune iconite',
  defaultValue: 'medium',
  options: [
    { label: 'Mica', value: 'small' },
    { label: 'Medie', value: 'medium' },
    { label: 'Mare', value: 'large' },
  ],
}

// ============================================================
// DISPLAY OPTIONS GROUP (collapsible)
// ============================================================

interface DisplayOptionsGroupOptions {
  /** Fields to include in the group */
  fields: Field[]
  /** Group label */
  label?: string
  /** Whether the group is collapsed by default */
  collapsed?: boolean
}

/**
 * Creates a collapsible group for display/show-hide options
 * Keeps admin UI clean by hiding advanced options
 * NOTE: Collapsible fields don't nest data - fields remain at root level
 */
export function displayOptionsGroup(options: DisplayOptionsGroupOptions): Field {
  const {
    fields,
    label = 'Optiuni afisare',
    collapsed = true,
  } = options

  return {
    type: 'collapsible',
    label,
    admin: {
      initCollapsed: collapsed,
    },
    fields,
  }
}

// ============================================================
// DESIGN OPTIONS GROUP (collapsible)
// ============================================================

interface DesignOptionsGroupOptions {
  /** Additional fields to include */
  additionalFields?: Field[]
  /** Include background color field */
  includeBackgroundColor?: boolean
  /** Include hover effect field */
  includeHoverEffect?: boolean
  /** Group label */
  label?: string
}

/**
 * Creates a collapsible group for design/styling options
 * Includes backgroundColor, hoverEffect, and custom fields
 * NOTE: Collapsible fields don't nest data - fields remain at root level
 */
export function designOptionsGroup(options: DesignOptionsGroupOptions = {}): Field {
  const {
    additionalFields = [],
    includeBackgroundColor = true,
    includeHoverEffect = false,
    label = 'Design & Stil',
  } = options

  const fields: Field[] = []

  if (includeBackgroundColor) {
    fields.push(backgroundColorField())
  }

  if (includeHoverEffect) {
    fields.push({
      name: 'hoverEffect',
      type: 'select',
      label: 'Efect hover carduri',
      defaultValue: 'default',
      options: [
        { label: 'Default (shadow + border)', value: 'default' },
        { label: 'Lift (ridicare)', value: 'lift' },
        { label: 'Glow (stralucire)', value: 'glow' },
        { label: 'Scale (marire)', value: 'scale' },
        { label: 'Fara efect', value: 'none' },
      ],
    })
  }

  fields.push(...additionalFields)

  return {
    type: 'collapsible',
    label,
    admin: {
      initCollapsed: true,
    },
    fields,
  }
}

// ============================================================
// ADVANCED SETTINGS GROUP (collapsible)
// ============================================================

interface AdvancedSettingsGroupOptions {
  /** Fields to include */
  fields: Field[]
  /** Group label */
  label?: string
}

/**
 * Creates a collapsible group for advanced/rarely-used settings
 * NOTE: Collapsible fields don't nest data - fields remain at root level
 */
export function advancedSettingsGroup(options: AdvancedSettingsGroupOptions): Field {
  const { fields, label = 'Setari avansate' } = options

  return {
    type: 'collapsible',
    label,
    admin: {
      initCollapsed: true,
    },
    fields,
  }
}
