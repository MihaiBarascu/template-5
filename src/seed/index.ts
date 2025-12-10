import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import type { Payload } from 'payload';
import type { Config } from '@/payload-types';

// Load environment variables BEFORE anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { getPayload } from 'payload';
import config from '@payload-config';

// Import seeders
import { seedFrizerie } from './businesses/frizerie';
import { seedDentist } from './businesses/dentist';
import { seedAvocat } from './businesses/avocat';
import { seedRestaurant } from './businesses/restaurant';
import { seedAutoService } from './businesses/auto-service';
import { seedConstructii } from './businesses/constructii';
import { seedSalon } from './businesses/salon';
import { seedMagazin } from './businesses/magazin';
import { seedFitness } from './businesses/fitness';
import { clearImageCache, setReuseExistingImages } from './helpers';

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
};

// Parse command line arguments
const args = process.argv.slice(2);
const withImages = args.includes('--with-images');

async function seed() {
  const seedType = process.env.SEED_TYPE || 'frizerie';

  console.log(`\n🌱 Starting seed for: ${seedType}`);
  if (withImages) {
    console.log('📸 --with-images: will clear media and upload fresh images');
  } else {
    console.log('♻️  Reusing existing images from media collection');
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
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await clearData(payload, withImages);
    clearImageCache();

    // Run the seeder
    console.log(`\n🌱 Running ${seedType} seeder...`);
    await seeder(payload);

    console.log(`\n✅ Seed complete for: ${seedType}`);
    console.log('\n👤 Default admin user:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n🌐 Access the site at: http://localhost:3010');
    console.log('🔧 Access admin at: http://localhost:3000/admin\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

async function clearData(payload: Payload, clearMedia: boolean = false) {
  // Collections to clear (media only if --with-images flag)
  const collections: (keyof Config['collections'])[] = [
    'pages',
    'posts',
    'services',
    'products',
    'team',
    'portfolio',
    'testimonials',
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
  ];

  // Add media to clear list if --with-images flag is present
  if (clearMedia) {
    collections.push('media');
  }

  for (const collection of collections) {
    try {
      const docs = await payload.find({
        collection,
        limit: 1000,
      });

      for (const doc of docs.docs) {
        await payload.delete({
          collection,
          id: doc.id,
        });
      }
      console.log(`   Cleared ${collection}: ${docs.docs.length} items`);
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
    });

    for (const user of users.docs) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      });
    }
    console.log(`   Cleared users (except admin): ${users.docs.length} items`);
  } catch (_e) {
    // Users collection error, skip
  }

  // Clear local media folder contents if --with-images
  // Note: We only delete files inside, not the folder itself (Docker volume permissions)
  if (clearMedia) {
    const mediaDir = path.join(process.cwd(), 'media');
    if (fs.existsSync(mediaDir)) {
      const files = fs.readdirSync(mediaDir);
      for (const file of files) {
        const filePath = path.join(mediaDir, file);
        try {
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
        } catch (_e) {
          // Skip files we can't delete
        }
      }
      console.log(`   Local media folder cleared: ${files.length} items`);
    }
  }

  // Clear Next.js image cache
  const nextImageCacheDir = path.join(
    process.cwd(),
    '.next',
    'cache',
    'images',
  );
  if (fs.existsSync(nextImageCacheDir)) {
    fs.rmSync(nextImageCacheDir, { recursive: true, force: true });
    console.log('   Next.js image cache cleared');
  }
}

seed();
