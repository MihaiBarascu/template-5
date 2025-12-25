/**
 * Multi-Tenant Seed All Script
 *
 * Seeds ALL business types simultaneously, each as a separate tenant.
 * This creates a true multi-tenant setup where all sites coexist.
 *
 * Usage:
 *   pnpm seed:all              - Seed all tenants (reuse existing media)
 *   pnpm seed:all --with-images - Fresh images for all tenants
 *
 * After seeding, access each site via its domain:
 *   - frizerie.local:3100
 *   - dentist.local:3100
 *   - etc.
 *
 * For local testing, add to /etc/hosts:
 *   127.0.0.1 frizerie.local dentist.local avocat.local restaurant.local
 *   127.0.0.1 auto-service.local constructii.local salon.local magazin.local
 *   127.0.0.1 fitness.local multiweb.local terapii.local
 */

import type { Config } from '@/payload-types'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

// Load environment variables BEFORE anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import config from '@payload-config'
import { getPayload } from 'payload'

// Import all seeders
import { seedAutoService } from './businesses/auto-service'
import { seedAvocat } from './businesses/avocat'
import { seedConstructii } from './businesses/constructii'
import { seedDentist } from './businesses/dentist'
import { seedFitness } from './businesses/fitness'
import { seedFrizerie } from './businesses/frizerie'
import { seedMagazin } from './businesses/magazin'
import { seedMultiweb } from './businesses/multiweb'
import { seedRestaurant } from './businesses/restaurant'
import { seedSalon } from './businesses/salon'
import { seedTerapiiEnergetice } from './businesses/terapii-energetice'

import {
  clearImageCache,
  setReuseExistingImages,
  triggerRevalidation,
} from './helpers'
import {
  getOrCreateSeedTenant,
  clearSeedTenant,
} from './tenant-helpers'

// Tenant configurations
interface TenantConfig {
  slug: string
  name: string
  domain: string
  seeder: (payload: Payload) => Promise<void>
}

const TENANT_CONFIGS: TenantConfig[] = [
  {
    slug: 'frizerie',
    name: 'Frizerie Demo',
    domain: 'frizerie.local',
    seeder: seedFrizerie,
  },
  {
    slug: 'dentist',
    name: 'Cabinet Dentar Demo',
    domain: 'dentist.local',
    seeder: seedDentist,
  },
  {
    slug: 'avocat',
    name: 'Cabinet Avocatură Demo',
    domain: 'avocat.local',
    seeder: seedAvocat,
  },
  {
    slug: 'restaurant',
    name: 'Restaurant Demo',
    domain: 'restaurant.local',
    seeder: seedRestaurant,
  },
  {
    slug: 'auto-service',
    name: 'Auto Service Demo',
    domain: 'auto-service.local',
    seeder: seedAutoService,
  },
  {
    slug: 'constructii',
    name: 'Construcții Demo',
    domain: 'constructii.local',
    seeder: seedConstructii,
  },
  {
    slug: 'salon',
    name: 'Salon Demo',
    domain: 'salon.local',
    seeder: seedSalon,
  },
  {
    slug: 'magazin',
    name: 'Magazin Online Demo',
    domain: 'magazin.local',
    seeder: seedMagazin,
  },
  {
    slug: 'fitness',
    name: 'Fitness Demo',
    domain: 'fitness.local',
    seeder: seedFitness,
  },
  {
    slug: 'multiweb',
    name: 'MultiWeb Agency Demo',
    domain: 'multiweb.local',
    seeder: seedMultiweb,
  },
  {
    slug: 'terapii-energetice',
    name: 'Terapii Energetice Demo',
    domain: 'terapii.local',
    seeder: seedTerapiiEnergetice,
  },
]

// Parse command line arguments
const args = process.argv.slice(2)
const withImages = args.includes('--with-images')

async function seedAll() {
  console.log('\n🌱 Starting Multi-Tenant Seed All')
  console.log(`   Total tenants: ${TENANT_CONFIGS.length}`)

  if (withImages) {
    console.log('📸 --with-images: will clear media and upload fresh images')
  } else {
    console.log('♻️  Reusing existing images from media collection')
    setReuseExistingImages(true)
  }
  console.log('')

  const payload = await getPayload({ config })

  try {
    // Step 1: Clear ALL existing data
    console.log('🗑️  Clearing ALL existing data...')
    await clearAllData(payload, withImages)
    clearImageCache()

    // Step 2: Seed each tenant
    console.log('\n🏢 Seeding tenants...\n')

    for (const tenantConfig of TENANT_CONFIGS) {
      console.log(`\n${'─'.repeat(60)}`)
      console.log(`🌱 Seeding: ${tenantConfig.name}`)
      console.log(`   Domain: ${tenantConfig.domain}`)
      console.log(`${'─'.repeat(60)}`)

      // Clear previous tenant context
      clearSeedTenant()

      // Create or get tenant
      const tenant = await getOrCreateSeedTenant(payload, {
        name: tenantConfig.name,
        slug: tenantConfig.slug,
        domain: tenantConfig.domain,
      })
      console.log(`   Tenant ID: ${tenant.id}`)

      // Run the seeder for this tenant
      await tenantConfig.seeder(payload)

      console.log(`✅ ${tenantConfig.name} completed`)
    }

    // Step 3: Trigger cache revalidation
    console.log('\n🔄 Triggering cache revalidation...')
    await triggerRevalidation(process.env.NEXT_PUBLIC_SERVER_URL)

    // Step 4: Print summary
    console.log('\n' + '═'.repeat(60))
    console.log('✅ All tenants seeded successfully!')
    console.log('═'.repeat(60))

    console.log('\n👤 Default admin user:')
    console.log('   Email: admin@example.com')
    console.log('   Password: admin123')

    console.log('\n🌐 Access sites at:')
    for (const tc of TENANT_CONFIGS) {
      console.log(`   http://${tc.domain}:3100`)
    }

    console.log('\n📝 Add to /etc/hosts (Linux/Mac) or C:\\Windows\\System32\\drivers\\etc\\hosts (Windows):')
    console.log(`   127.0.0.1 ${TENANT_CONFIGS.map(tc => tc.domain).join(' ')}`)

    console.log('\n🔧 Admin panel: http://localhost:3100/admin')
    console.log('   (use tenant switcher to manage each tenant)\n')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

/**
 * Clear ALL data from ALL tenants
 */
async function clearAllData(payload: Payload, clearMedia: boolean = false) {
  // Reset globals to clean state
  console.log('   Resetting globals...')

  // Reset site-theme to defaults
  await payload.updateGlobal({
    slug: 'site-theme',
    data: {
      variant: 'dark-gold',
      borderRadius: undefined,
      shadows: undefined,
      animations: 'moderate',
      containerWidth: '1280',
      sectionSpacing: 'normal',
      headingScale: 'normal',
      bodyTextSize: 'normal',
      cardGap: 'normal',
      useCustomColors: false,
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#c9a962',
        dark: '#1a1a1a',
        light: '#f5f5f5',
        surface: '#ffffff',
        text: '#1a1a1a',
        textLight: '#666666',
        border: '#e5e5e5',
        textOnPrimary: '#ffffff',
        textOnSecondary: '#ffffff',
        textOnAccent: '#000000',
        textOnDark: '#ffffff',
        textOnLight: '#1a1a1a',
        textOnSurface: '#1a1a1a',
      },
      headingFont: undefined,
      bodyFont: undefined,
    },
  })

  // Reset business-info
  await payload.updateGlobal({
    slug: 'business-info',
    data: {
      name: 'Business Name',
      social: {
        facebook: '',
        instagram: '',
        tiktok: '',
        youtube: '',
        linkedin: '',
      },
      whatsappFloat: {
        enabled: false,
        position: 'bottom-right',
        showOnMobile: true,
        defaultMessage: '',
        tooltipText: '',
        pulseAnimation: false,
      },
      announcementBar: {
        enabled: false,
        message: '',
        linkText: '',
        linkUrl: '',
      },
    },
  })

  // Reset shop-settings
  await payload.updateGlobal({
    slug: 'shop-settings',
    data: {
      enabled: false,
    },
  })
  console.log('   Shop settings reset (ecommerce disabled)')

  // Reset Footer badges when clearing media
  if (clearMedia) {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        badges: [],
      },
    })
    console.log('   Footer badges cleared')
  }

  console.log('   Globals reset to clean state')

  // Collections to clear
  const collections: (keyof Config['collections'])[] = [
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
    // Tenant-global collections
    'tenant-site-themes',
    'tenant-business-info',
    'tenant-headers',
    'tenant-footers',
    'tenant-logos',
    // Tenants themselves (to start fresh)
    'tenants',
  ]

  // Add media to clear list if --with-images flag is present
  if (clearMedia) {
    collections.push('media')
  }

  for (const collection of collections) {
    try {
      const docs = await payload.find({
        collection,
        limit: 1000,
      })

      for (const doc of docs.docs) {
        await payload.delete({
          collection,
          id: doc.id,
        })
      }
      if (docs.docs.length > 0) {
        console.log(`   Cleared ${collection}: ${docs.docs.length} items`)
      }
    } catch (_e) {
      // Collection might not exist, skip
    }
  }

  // Clear users EXCEPT admin@example.com
  try {
    const users = await payload.find({
      collection: 'users',
      limit: 1000,
      where: {
        email: {
          not_equals: 'admin@example.com',
        },
      },
    })

    for (const user of users.docs) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      })
    }
    if (users.docs.length > 0) {
      console.log(`   Cleared users (except admin): ${users.docs.length} items`)
    }
  } catch (_e) {
    // Users collection error, skip
  }

  // Clear local media folder if --with-images
  if (clearMedia) {
    const mediaDir = path.join(process.cwd(), 'media')
    if (fs.existsSync(mediaDir)) {
      const files = fs.readdirSync(mediaDir)
      for (const file of files) {
        const filePath = path.join(mediaDir, file)
        try {
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true })
          } else {
            fs.unlinkSync(filePath)
          }
        } catch (_e) {
          // Skip files we can't delete
        }
      }
      console.log(`   Local media folder cleared: ${files.length} items`)
    }
  }

  // Clear Next.js image cache
  const imageCachePaths = [
    path.join(process.cwd(), '.next', 'cache', 'images'),
    path.join(process.cwd(), '.next', 'dev', 'cache', 'images'),
  ]

  let cacheCleared = false
  for (const cachePath of imageCachePaths) {
    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true })
      cacheCleared = true
    }
  }
  if (cacheCleared) {
    console.log('   Next.js image cache cleared')
  }
}

seedAll()
