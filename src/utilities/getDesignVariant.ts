import { getPayload } from 'payload'
import config from '@payload-config'
import {
  getVariant,
  barbershopVariants,
  dentistVariants,
  restaurantVariants,
  magazinVariants,
  autoServiceVariants,
  salonVariants,
  avocatVariants,
  constructiiVariants,
  type DesignVariant,
} from '@/seed/design-variants'

// Map business types to their variant arrays
const variantsByType: Record<string, DesignVariant[]> = {
  barbershop: barbershopVariants,
  dentist: dentistVariants,
  restaurant: restaurantVariants,
  magazin: magazinVariants,
  'auto-service': autoServiceVariants,
  salon: salonVariants,
  avocat: avocatVariants,
  constructii: constructiiVariants,
}

/**
 * Get design variant from admin global or fallback to env/default
 *
 * Usage in Server Components:
 * ```ts
 * const variant = await getDesignVariant()
 * // Use variant.theme.colors, variant.hero.type, variant.layout.sections, etc.
 * ```
 */
export async function getDesignVariant(): Promise<DesignVariant> {
  try {
    const payload = await getPayload({ config })

    const designVariantGlobal = await payload.findGlobal({
      slug: 'design-variant',
    })

    if (designVariantGlobal) {
      const businessType = designVariantGlobal.businessType as string || 'magazin'
      const variantIndex = parseInt(designVariantGlobal.variantIndex as string || '0', 10)

      // Get the variant from predefined variants
      const variants = variantsByType[businessType] || magazinVariants
      const baseVariant = variants[variantIndex] || variants[0]

      // Apply overrides if enabled
      if (designVariantGlobal.useOverride && designVariantGlobal.override) {
        const override = designVariantGlobal.override as any
        return {
          ...baseVariant,
          hero: {
            ...baseVariant.hero,
            type: override.heroType || baseVariant.hero.type,
            overlay: override.heroOverlay || baseVariant.hero.overlay,
          },
          layout: {
            ...baseVariant.layout,
            servicesVariant: override.servicesVariant || baseVariant.layout.servicesVariant,
            teamVariant: override.teamVariant || baseVariant.layout.teamVariant,
            testimonialsVariant: override.testimonialsVariant || baseVariant.layout.testimonialsVariant,
            galleryVariant: override.galleryVariant || baseVariant.layout.galleryVariant,
          },
        }
      }

      return baseVariant
    }
  } catch (error) {
    console.warn('Could not fetch design variant from global, using env fallback')
  }

  // Fallback to environment variable
  const envVariant = parseInt(process.env.DESIGN_VARIANT || '0', 10)
  const envBusinessType = (process.env.SEED_TYPE || 'magazin') as Parameters<typeof getVariant>[0]

  return getVariant(envBusinessType, envVariant)
}

/**
 * Get design variant info for admin display
 */
export function getVariantInfo(businessType: string, variantIndex: number): string {
  const variants = variantsByType[businessType]
  if (!variants) return 'Tip de business necunoscut'

  const variant = variants[variantIndex]
  if (!variant) return 'Varianta indisponibila'

  return `${variant.name}\n\n${variant.description}\n\nCuloare primara: ${variant.theme.colors.primary}\nStil: ${variant.theme.stylePreset}\nHero: ${variant.hero.type}`
}

/**
 * Get all available variants for a business type
 */
export function getAvailableVariants(businessType: string): Array<{ index: number; name: string; description: string }> {
  const variants = variantsByType[businessType] || []
  return variants.map((v, i) => ({
    index: i,
    name: v.name,
    description: v.description,
  }))
}
