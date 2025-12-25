/**
 * Super Admin Seeder
 *
 * Creates the platform super-admin user with full access to all tenants.
 * Run this ONCE when setting up the platform, before seeding any businesses.
 *
 * Usage: pnpm seed:super-admin
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables BEFORE anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import config from '@payload-config'
import { getPayload } from 'payload'

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@example.com'
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'admin123'
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Super Administrator'

async function seedSuperAdmin() {
  console.log('\n🔐 Super Admin Seeder')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const payload = await getPayload({ config })

  try {
    // Check if super-admin already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: SUPER_ADMIN_EMAIL },
      },
      limit: 1,
    })

    if (existingUser.docs.length > 0) {
      const user = existingUser.docs[0]
      const mtUser = user as typeof user & { roles?: string[] }
      const hasSuperAdmin = mtUser.roles?.includes('super-admin')

      if (hasSuperAdmin) {
        console.log(`✅ Super Admin already exists: ${SUPER_ADMIN_EMAIL}`)
        console.log('   No changes needed.\n')
      } else {
        // Upgrade existing user to super-admin
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            roles: ['super-admin'],
          },
        })
        console.log(`⬆️  Upgraded existing user to Super Admin: ${SUPER_ADMIN_EMAIL}`)
      }
    } else {
      // Create new super-admin
      await payload.create({
        collection: 'users',
        data: {
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
          name: SUPER_ADMIN_NAME,
          roles: ['super-admin'],
        },
      })
      console.log(`✅ Created Super Admin: ${SUPER_ADMIN_EMAIL}`)
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔑 Super Admin Credentials:')
    console.log(`   Email: ${SUPER_ADMIN_EMAIL}`)
    console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`)
    console.log('\n💡 You can customize these via environment variables:')
    console.log('   SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_NAME')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('❌ Failed to create Super Admin:', error)
    process.exit(1)
  }

  process.exit(0)
}

seedSuperAdmin()
