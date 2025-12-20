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

    // Trigger cache revalidation via API (so dev server updates without restart)
    console.log('\n🔄 Triggering cache revalidation...');
    await triggerRevalidation(process.env.NEXT_PUBLIC_SERVER_URL);

    console.log(`\n✅ Seed complete for: ${seedType}`);
    console.log('\n👤 Default admin user:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log(
      `\n🌐 Access the site at: ${process.env.NEXT_PUBLIC_SERVER_URL}`,
    );
    console.log(
      `🔧 Access admin at: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
    );
    console.log(
      '\n💡 Refresh browser to see changes (no server restart needed!)\n',
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

async function clearData(payload: Payload, clearMedia: boolean = false) {
  // Reset globals to clean state (fixes theme colors, announcementBar, etc. persisting between seeds)
  console.log('   Resetting globals...');

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
  });

  // Reset business-info - clear fields that persist between seeds (social, whatsappFloat, announcementBar)
  // Note: We only reset the problematic fields, not required fields like 'name'
  await payload.updateGlobal({
    slug: 'business-info',
    data: {
      // Reset social links to empty (prevents old values persisting)
      social: {
        facebook: '',
        instagram: '',
        tiktok: '',
        youtube: '',
        linkedin: '',
      },
      // Reset whatsappFloat completely
      whatsappFloat: {
        enabled: false,
        position: 'bottom-right',
        showOnMobile: true,
        defaultMessage: '',
        tooltipText: '',
        pulseAnimation: false,
      },
      // Reset announcementBar completely
      announcementBar: {
        enabled: false,
        message: '',
        linkText: '',
        linkUrl: '',
      },
    },
  });

  // Reset Footer badges when clearing media (to remove orphaned references)
  if (clearMedia) {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        badges: [], // Clear badge references before media is deleted
      },
    });
    console.log('   Footer badges cleared');
  }

  // Note: Header, Footer, Logo are fully set by each seeder, so no need to reset them
  // The seeder's seedHeader, seedFooter, seedLogo calls will overwrite all values

  console.log('   Globals reset to clean state');

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

  // Clear Next.js image cache (supports both dev and production modes)
  const imageCachePaths = [
    path.join(process.cwd(), '.next', 'cache', 'images'), // Production runtime (all versions)
    path.join(process.cwd(), '.next', 'dev', 'cache', 'images'), // Development mode (Next.js 16+)
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
}

seed();
