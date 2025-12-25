/**
 * Drop unique slug indexes from MongoDB
 *
 * This script removes the globally unique slug indexes that were created
 * before multi-tenant support was added. In multi-tenant mode, slugs should
 * only be unique within a tenant, not globally.
 *
 * Usage: pnpm tsx --env-file=.env src/seed/drop-slug-indexes.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import { MongoClient } from 'mongodb'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function dropSlugIndexes() {
  const uri = process.env.DATABASE_URI
  if (!uri) {
    throw new Error('DATABASE_URI not found in environment')
  }

  console.log('Connecting to MongoDB...')
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    const collections = [
      // Payload uses plural names for collections in MongoDB
      'pages',
      'posts',
      'services',
      'service-categories',
      'team',
      'teams', // Payload pluralizes to 'teams'
      'portfolio',
      'portfolios', // Payload pluralizes
      'subscriptions',
      'product-categories',
      'product-tags',
      'categories',
      'testimonial-categories',
      'testimonials',
      'faqs',
      'bookings',
      // Ecommerce collections
      'products',
      'addresses',
      'carts',
      'orders',
    ]

    console.log('\nDropping unique slug indexes:')

    for (const colName of collections) {
      try {
        const col = db.collection(colName)
        const indexes = await col.indexes()
        for (const idx of indexes) {
          // Check if this is a unique index on slug
          if (idx.key && idx.key.slug && idx.unique && idx.name) {
            console.log(`  ✓ Dropping '${idx.name}' from '${colName}'`)
            await col.dropIndex(idx.name)
          }
        }
      } catch (e: unknown) {
        const error = e as Error
        if (!error.message.includes('ns not found')) {
          console.log(`  ⚠ Skipping '${colName}': ${error.message}`)
        }
      }
    }

    console.log('\n✅ Done! Unique slug indexes have been dropped.')
    console.log('   Slugs are now unique only within each tenant.')
  } finally {
    await client.close()
  }
}

dropSlugIndexes().catch(console.error)
