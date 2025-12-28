/**
 * API Endpoint: Seed Tenant Content
 *
 * Populates an existing tenant with content from a business template.
 * Used by the Admin Dashboard to help new tenants get started.
 *
 * POST /api/seed-tenant
 * Body: { tenantId: string, seedType: string }
 *
 * Authentication: Requires super-admin or tenant-admin role
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/access/multiTenant'

// Import seeders
import { seedAutoService } from '@/seed/businesses/auto-service'
import { seedAvocat } from '@/seed/businesses/avocat'
import { seedConstructii } from '@/seed/businesses/constructii'
import { seedDentist } from '@/seed/businesses/dentist'
import { seedFitness } from '@/seed/businesses/fitness'
import { seedFrizerie } from '@/seed/businesses/frizerie'
import { seedMagazin } from '@/seed/businesses/magazin'
import { seedMultiweb } from '@/seed/businesses/multiweb'
import { seedRestaurant } from '@/seed/businesses/restaurant'
import { seedSalon } from '@/seed/businesses/salon'
import { seedTerapiiEnergetice } from '@/seed/businesses/terapii-energetice'
import { setSeedTenantId, clearSeedTenant } from '@/seed/tenant-helpers'
import { clearImageCache, setReuseExistingImages } from '@/seed/helpers'
import type { Payload } from 'payload'
import type { Config } from '@/payload-types'

// Available seeders with metadata
export const SEED_TEMPLATES = {
  frizerie: {
    name: 'Frizerie / Barbershop',
    icon: '💇',
    description: 'Salon de coafură cu servicii, prețuri, echipă',
    seeder: seedFrizerie,
  },
  salon: {
    name: 'Salon Beauty',
    icon: '💅',
    description: 'Salon de frumusețe cu tratamente și programări',
    seeder: seedSalon,
  },
  dentist: {
    name: 'Cabinet Stomatologic',
    icon: '🦷',
    description: 'Cabinet dentar cu servicii și echipă medicală',
    seeder: seedDentist,
  },
  avocat: {
    name: 'Cabinet Avocat',
    icon: '⚖️',
    description: 'Firmă de avocatură cu arii de practică',
    seeder: seedAvocat,
  },
  restaurant: {
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Restaurant cu meniu, galerie și rezervări',
    seeder: seedRestaurant,
  },
  fitness: {
    name: 'Sală Fitness',
    icon: '🏋️',
    description: 'Sală de sport cu clase, antrenori și abonamente',
    seeder: seedFitness,
  },
  'auto-service': {
    name: 'Service Auto',
    icon: '🚗',
    description: 'Service auto cu servicii și prețuri',
    seeder: seedAutoService,
  },
  constructii: {
    name: 'Firma Construcții',
    icon: '🏗️',
    description: 'Companie construcții cu proiecte și servicii',
    seeder: seedConstructii,
  },
  magazin: {
    name: 'Magazin Online',
    icon: '🛒',
    description: 'E-commerce cu produse, categorii și coș',
    seeder: seedMagazin,
  },
  multiweb: {
    name: 'Business General',
    icon: '🌐',
    description: 'Template generic pentru orice tip de business',
    seeder: seedMultiweb,
  },
  'terapii-energetice': {
    name: 'Terapii & Wellness',
    icon: '🧘',
    description: 'Centru terapii cu servicii holistic și cursuri',
    seeder: seedTerapiiEnergetice,
  },
} as const

export type SeedTemplateType = keyof typeof SEED_TEMPLATES

/**
 * Clear tenant data before seeding
 */
async function clearTenantData(
  payload: Payload,
  tenantId: string,
  tenantSlug: string
) {
  const tenantCollections: (keyof Config['collections'])[] = [
    'pages',
    'posts',
    'services',
    'service-categories',
    'products',
    'team',
    'portfolio',
    'testimonials',
    'testimonial-categories',
    'bookings',
    'subscription-orders',
    'newsletter-subscribers',
    'faq',
    'form-submissions',
    'forms',
    'categories',
    'product-categories',
    'product-tags',
    'carts',
    'orders',
    'addresses',
    'subscriptions',
    'tenant-site-themes',
    'tenant-business-info',
    'tenant-headers',
    'tenant-footers',
    'tenant-logos',
  ]

  for (const collection of tenantCollections) {
    try {
      const docs = await payload.find({
        collection,
        where: { tenant: { equals: tenantId } },
        limit: 1000,
      })

      for (const doc of docs.docs) {
        await payload.delete({ collection, id: doc.id })
      }
    } catch {
      // Collection might not exist or not have tenant field
    }
  }
}

/**
 * Check if tenant has any content
 */
async function isTenantEmpty(payload: Payload, tenantId: string): Promise<boolean> {
  const contentCollections = ['pages', 'services', 'team'] as const

  for (const collection of contentCollections) {
    try {
      const docs = await payload.find({
        collection,
        where: { tenant: { equals: tenantId } },
        limit: 1,
      })
      if (docs.docs.length > 0) {
        return false
      }
    } catch {
      // Collection error
    }
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get authenticated user
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json(
        { error: 'Autentificare necesară' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { tenantId, seedType, clearExisting = true } = body

    if (!tenantId || !seedType) {
      return NextResponse.json(
        { error: 'tenantId și seedType sunt obligatorii' },
        { status: 400 }
      )
    }

    // Validate seed type
    if (!(seedType in SEED_TEMPLATES)) {
      return NextResponse.json(
        { error: `Template invalid: ${seedType}`, available: Object.keys(SEED_TEMPLATES) },
        { status: 400 }
      )
    }

    // Get tenant
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant negăsit' },
        { status: 404 }
      )
    }

    // Check permissions: super-admin OR user belongs to this tenant
    const userTenants = (user as { tenants?: Array<{ tenant: string | { id: string } }> }).tenants || []
    const userTenantIds = userTenants.map(t =>
      typeof t.tenant === 'string' ? t.tenant : t.tenant?.id
    )
    const hasAccess = isSuperAdmin(user) || userTenantIds.includes(tenantId)

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Nu ai permisiune pentru acest tenant' },
        { status: 403 }
      )
    }

    // Clear existing content if requested
    if (clearExisting) {
      await clearTenantData(payload, tenantId, tenant.slug)
    }

    // Set up seeding context
    clearImageCache()
    clearSeedTenant()
    setSeedTenantId(tenantId)
    setReuseExistingImages(true) // Reuse images for faster seeding

    // Run the seeder
    const template = SEED_TEMPLATES[seedType as SeedTemplateType]
    await template.seeder(payload)

    // Clear context
    clearSeedTenant()

    return NextResponse.json({
      success: true,
      message: `Tenant "${tenant.name}" a fost populat cu template-ul "${template.name}"`,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      template: {
        type: seedType,
        name: template.name,
      },
    })
  } catch (error) {
    console.error('[seed-tenant] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la populare' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/seed-tenant
 * Returns available templates and tenant status
 *
 * Query params:
 * - tenantId: specific tenant to check
 * - fetchEmptyTenants: if true, returns all empty tenants (super admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get authenticated user
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json(
        { error: 'Autentificare necesară' },
        { status: 401 }
      )
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const fetchEmptyTenants = searchParams.get('fetchEmptyTenants') === 'true'

    // Check if user is super admin
    const userIsSuperAdmin = isSuperAdmin(user)

    // Return available templates
    const templates = Object.entries(SEED_TEMPLATES).map(([key, value]) => ({
      id: key,
      name: value.name,
      icon: value.icon,
      description: value.description,
    }))

    // If tenantId provided, check if it's empty
    let tenantStatus = null
    if (tenantId) {
      const tenant = await payload.findByID({
        collection: 'tenants',
        id: tenantId,
      })
      if (tenant) {
        const isEmpty = await isTenantEmpty(payload, tenantId)
        tenantStatus = {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          isEmpty,
        }
      }
    }

    // If super admin and fetchEmptyTenants requested, get all empty tenants
    let emptyTenants: Array<{ id: string; name: string; slug: string; isEmpty: boolean }> = []
    if (userIsSuperAdmin && fetchEmptyTenants) {
      const allTenants = await payload.find({
        collection: 'tenants',
        limit: 100,
      })

      // Check each tenant for emptiness
      for (const tenant of allTenants.docs) {
        const isEmpty = await isTenantEmpty(payload, tenant.id)
        if (isEmpty) {
          emptyTenants.push({
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            isEmpty: true,
          })
        }
      }
    }

    return NextResponse.json({
      templates,
      tenant: tenantStatus,
      emptyTenants: userIsSuperAdmin ? emptyTenants : undefined,
      isSuperAdmin: userIsSuperAdmin,
    })
  } catch (error) {
    console.error('[seed-tenant] GET Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare' },
      { status: 500 }
    )
  }
}
