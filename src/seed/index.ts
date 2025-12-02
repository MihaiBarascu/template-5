// @ts-nocheck
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables BEFORE anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { getPayload } from 'payload'
import config from '@payload-config'

// Import seeders
import { seedFrizerie } from './businesses/frizerie'
import { seedDentist } from './businesses/dentist'
import { seedAvocat } from './businesses/avocat'
import { seedRestaurant } from './businesses/restaurant'
import { seedAutoService } from './businesses/auto-service'
import { seedConstructii } from './businesses/constructii'
import { seedSalon } from './businesses/salon'
import { seedMagazin } from './businesses/magazin'
import { clearImageCache } from './helpers'

const seeders: Record<string, (payload: any) => Promise<void>> = {
  frizerie: seedFrizerie,
  dentist: seedDentist,
  avocat: seedAvocat,
  restaurant: seedRestaurant,
  'auto-service': seedAutoService,
  constructii: seedConstructii,
  salon: seedSalon,
  magazin: seedMagazin,
}

async function seed() {
  const seedType = process.env.SEED_TYPE || 'frizerie'

  console.log(`\n🌱 Starting seed for: ${seedType}\n`)

  const payload = await getPayload({ config })

  // Check if seeder exists
  const seeder = seeders[seedType]
  if (!seeder) {
    console.error(`❌ Unknown seed type: ${seedType}`)
    console.log(`Available types: ${Object.keys(seeders).join(', ')}`)
    process.exit(1)
  }

  try {
    // Clear existing data (optional - can be commented out)
    console.log('🗑️  Clearing existing data...')
    await clearData(payload)
    clearImageCache()

    // Run the seeder
    console.log(`\n🌱 Running ${seedType} seeder...`)
    await seeder(payload)

    console.log(`\n✅ Seed complete for: ${seedType}`)
    console.log('\n👤 Default admin user:')
    console.log('   Email: admin@example.com')
    console.log('   Password: admin123')
    console.log('\n🌐 Access the site at: http://localhost:3000')
    console.log('🔧 Access admin at: http://localhost:3000/admin\n')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

async function clearData(payload: any) {
  const collections = [
    'pages',
    'posts',
    'services',
    'products',
    'team',
    'portfolio',
    'testimonials',
    'price-packages',
    'bookings',
    'faq',
    'contact-submissions',
    'categories',
    'product-categories',
    'carts',
    'orders',
    'media',
  ]

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
      console.log(`   Cleared ${collection}: ${docs.docs.length} items`)
    } catch (e) {
      // Collection might not exist, skip
    }
  }

  // Clear media files from filesystem
  const mediaDir = path.join(process.cwd(), 'media')
  if (fs.existsSync(mediaDir)) {
    const files = fs.readdirSync(mediaDir)
    for (const file of files) {
      const filePath = path.join(mediaDir, file)
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      }
    }
    console.log(`   Cleared media files: ${files.length} files`)
  }
}

seed()
