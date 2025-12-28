import type { Config } from '@/payload-types';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import type { Payload } from 'payload';

// Load environment variables BEFORE anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import config from '@payload-config';
import { getPayload } from 'payload';

// Import seeders
import { seedAutoService } from './businesses/auto-service';
import { seedAvocat } from './businesses/avocat';
import { seedConstructii } from './businesses/constructii';
import { seedDentist } from './businesses/dentist';
import { seedFitness } from './businesses/fitness';
import { seedFrizerie } from './businesses/frizerie';
import { seedMagazin } from './businesses/magazin';
import { seedMultiweb } from './businesses/multiweb';
import { seedRestaurant } from './businesses/restaurant';
import { seedSalon } from './businesses/salon';
import { seedTerapiiEnergetice } from './businesses/terapii-energetice';
import {
  clearImageCache,
  setReuseExistingImages,
  triggerRevalidation,
} from './helpers';
import {
  getOrCreateSeedTenant,
  clearSeedTenant,
  useExistingTenant,
} from './tenant-helpers';

const seeders: Record<string, (payload: Payload) => Promise<void>> = {
  frizerie: seedFrizerie,
  dentist: seedDentist,
  avocat: seedAvocat,
  restaurant: seedRestaurant,
  'auto-service': seedAutoService,
  constructii: seedConstructii,
  salon: seedSalon,
  magazin: seedMagazin,
  fitness: seedFitness,
  multiweb: seedMultiweb,
  'terapii-energetice': seedTerapiiEnergetice,
};

// Parse command line arguments
const args = process.argv.slice(2);
const withImages = args.includes('--with-images');
const skipClear = args.includes('--skip-clear');

/**
 * Seed Modes:
 *
 * 1. STANDARD MODE (default):
 *    SEED_TYPE=frizerie pnpm seed
 *    - Creates tenant with slug=frizerie if not exists
 *    - Clears existing data for that tenant
 *    - Seeds all content
 *
 * 2. EXISTING TENANT MODE (for Admin-created tenants):
 *    TENANT_ID=<id> SEED_TYPE=frizerie pnpm seed
 *    - Uses existing tenant by ID (created via Admin UI)
 *    - Clears existing data for that tenant (unless --skip-clear)
 *    - Seeds content using the specified business type template
 *
 * 3. APPEND MODE (add content without clearing):
 *    SEED_TYPE=frizerie pnpm seed --skip-clear
 *    - Keeps existing content
 *    - Adds new content (may cause duplicates!)
 *
 * Flags:
 *   --with-images  Clear and re-upload images
 *   --skip-clear   Don't clear existing data before seeding
 */
async function seed() {
  const seedType = process.env.SEED_TYPE || 'frizerie';
  const existingTenantId = process.env.TENANT_ID;

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🌱 SEED RUNNER');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Template: ${seedType}`);

  if (existingTenantId) {
    console.log(`   Mode: EXISTING TENANT (ID: ${existingTenantId})`);
  } else {
    console.log(`   Mode: STANDARD (create/reuse tenant by slug)`);
  }

  if (skipClear) {
    console.log('   ⚠️  --skip-clear: keeping existing data (may cause duplicates)');
  }
  if (withImages) {
    console.log('   📸 --with-images: will clear media and upload fresh images');
  } else {
    console.log('   ♻️  Reusing existing images from media collection');
    setReuseExistingImages(true);
  }
  console.log('');

  const payload = await getPayload({ config });

  // Check if seeder exists
  const seeder = seeders[seedType];
  if (!seeder) {
    console.error(`❌ Unknown seed type: ${seedType}`);
    console.log(`Available types: ${Object.keys(seeders).join(', ')}`);
    process.exit(1);
  }

  try {
    let tenant;
    let tenantSlug: string;

    clearImageCache();
    clearSeedTenant();

    // ─────────────────────────────────────────────────────────────────────────
    // MODE 1: Use existing tenant by ID (created via Admin UI)
    // ─────────────────────────────────────────────────────────────────────────
    if (existingTenantId) {
      console.log('\n🏢 Loading existing tenant...');
      tenant = await useExistingTenant(payload, existingTenantId);
      tenantSlug = tenant.slug;

      // Clear data if not skipped
      if (!skipClear) {
        console.log(`\n🗑️  Clearing existing data for tenant: ${tenantSlug}...`);
        await clearTenantData(payload, tenant.id, withImages, tenantSlug);
      }
    }
    // ─────────────────────────────────────────────────────────────────────────
    // MODE 2: Standard mode - create/reuse tenant by slug
    // ─────────────────────────────────────────────────────────────────────────
    else {
      tenantSlug = seedType;

      // Check if tenant already exists
      const existingTenant = await payload.find({
        collection: 'tenants',
        where: { slug: { equals: seedType } },
        limit: 1,
      });

      // Clear ONLY this tenant's data (not other tenants!)
      if (existingTenant.docs.length > 0 && !skipClear) {
        const tenantId = existingTenant.docs[0].id;
        console.log(`\n🗑️  Clearing existing data for tenant: ${seedType} (${tenantId})...`);
        await clearTenantData(payload, tenantId, withImages, seedType);
      } else if (existingTenant.docs.length === 0) {
        console.log(`\n🆕 No existing tenant found for: ${seedType} - creating fresh`);
      }

      // Create or get tenant
      console.log('\n🏢 Setting up tenant...');
      const tenantName = seedType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Demo';
      tenant = await getOrCreateSeedTenant(payload, {
        name: tenantName,
        slug: seedType,
        domain: `${seedType}.local`,
      });
    }

    console.log(`   Tenant ID: ${tenant.id}`);
    console.log(`   Domain: ${tenant.domain}`);

    // Run the seeder (tenant context is set via getCurrentSeedTenantId())
    console.log(`\n🌱 Running ${seedType} seeder...`);
    await seeder(payload);

    // Trigger cache revalidation via API (so dev server updates without restart)
    console.log('\n🔄 Triggering cache revalidation...');
    await triggerRevalidation(process.env.NEXT_PUBLIC_SERVER_URL);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`✅ SEED COMPLETE: ${seedType}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n👤 Tenant Admin (access only to this business):');
    console.log(`   Email: admin@${tenantSlug}.local`);
    console.log(`   Password: ${tenantSlug}123`);
    console.log('\n💡 For Super Admin (access to all tenants):');
    console.log('   Run: pnpm seed:super-admin');
    console.log(
      `\n🌐 Access the site at: ${process.env.NEXT_PUBLIC_SERVER_URL}`,
    );
    console.log(
      `🔧 Access admin at: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
    );
    console.log(
      '\n💡 Refresh browser to see changes (no server restart needed!)\n',
    );

    // Print usage hint for existing tenant mode
    if (!existingTenantId) {
      console.log('───────────────────────────────────────────────────────────');
      console.log('💡 TIP: To seed content for a tenant created via Admin UI:');
      console.log(`   TENANT_ID=<id> SEED_TYPE=${seedType} pnpm seed`);
      console.log('───────────────────────────────────────────────────────────\n');
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

/**
 * Clear data ONLY for a specific tenant.
 * This preserves data from other tenants - essential for multi-tenant isolation.
 */
async function clearTenantData(
  payload: Payload,
  tenantId: string,
  clearMedia: boolean = false,
  tenantSlug: string
) {
  // Collections that have tenant field - we filter by tenant ID
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
    // Tenant-global collections (per-tenant settings)
    'tenant-site-themes',
    'tenant-business-info',
    'tenant-headers',
    'tenant-footers',
    'tenant-logos',
  ];

  // Add media to clear list if --with-images flag is present
  if (clearMedia) {
    tenantCollections.push('media');
  }

  // Delete only documents belonging to this tenant
  for (const collection of tenantCollections) {
    try {
      const docs = await payload.find({
        collection,
        where: {
          tenant: { equals: tenantId },
        },
        limit: 1000,
      });

      for (const doc of docs.docs) {
        await payload.delete({
          collection,
          id: doc.id,
        });
      }

      if (docs.docs.length > 0) {
        console.log(`   Cleared ${collection}: ${docs.docs.length} items`);
      }
    } catch (_e) {
      // Collection might not exist or not have tenant field, skip
    }
  }

  // Clear local media folder for this tenant only (subfolder structure)
  if (clearMedia) {
    const tenantMediaDir = path.join(process.cwd(), 'media', tenantSlug);
    if (fs.existsSync(tenantMediaDir)) {
      const files = fs.readdirSync(tenantMediaDir);
      fs.rmSync(tenantMediaDir, { recursive: true, force: true });
      console.log(`   Local media folder cleared for ${tenantSlug}: ${files.length} items`);
    }
  }

  // Clear Next.js image cache (supports both dev and production modes)
  const imageCachePaths = [
    path.join(process.cwd(), '.next', 'cache', 'images'),
    path.join(process.cwd(), '.next', 'dev', 'cache', 'images'),
  ];

  let cacheCleared = false;
  for (const cachePath of imageCachePaths) {
    if (fs.existsSync(cachePath)) {
      fs.rmSync(cachePath, { recursive: true, force: true });
      cacheCleared = true;
    }
  }
  if (cacheCleared) {
    console.log('   Next.js image cache cleared');
  }

  console.log(`   ✅ Tenant data cleared: ${tenantSlug}`);
}

seed();
