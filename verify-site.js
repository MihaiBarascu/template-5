import { chromium } from 'playwright';

async function verifySite() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = [];
  const baseUrl = 'http://localhost:3005';

  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/servicii', name: 'Servicii' },
    { path: '/echipa', name: 'Echipa' },
    { path: '/programare', name: 'Programare' },
    { path: '/contact', name: 'Contact' },
    { path: '/blog', name: 'Blog' },
    { path: '/admin', name: 'Admin Login' }
  ];

  console.log('='.repeat(80));
  console.log('DENTIST SITE VERIFICATION REPORT');
  console.log('='.repeat(80));
  console.log('');

  for (const pageInfo of pages) {
    const url = `${baseUrl}${pageInfo.path}`;
    console.log(`\n📄 Testing: ${pageInfo.name} (${url})`);
    console.log('-'.repeat(80));

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      const status = response.status();

      // Take screenshot
      const screenshotPath = `/home/evr/Desktop/website-templates/template-5/media/verify-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Check for errors in console
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      // Wait a bit to let any errors appear
      await page.waitForTimeout(1000);

      // Check visible elements based on page
      let checks = {};

      if (pageInfo.path === '/') {
        // Homepage - scroll complet pentru a verifica toate secțiunile
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollTo(0, 0));

        checks = {
          'Hero section': await page.locator('section').first().isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
          'Servicii section': await page.getByText(/servicii|tratamente/i).first().isVisible().catch(() => false),
          'CTA/Programare button': await page.getByRole('link', { name: /programare|program/i }).first().isVisible().catch(() => false),
        };
      } else if (pageInfo.path === '/servicii') {
        checks = {
          'Main content': await page.locator('main').isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
          'Servicii/Tratamente listed': await page.locator('h1,h2,h3').filter({ hasText: /servicii|tratamente/i }).first().isVisible().catch(() => false),
        };
      } else if (pageInfo.path === '/echipa') {
        checks = {
          'Main content': await page.locator('main').isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
          'Team/Echipa heading': await page.locator('h1,h2').filter({ hasText: /echipa|doctori|medici/i }).first().isVisible().catch(() => false),
        };
      } else if (pageInfo.path === '/programare') {
        checks = {
          'Main content': await page.locator('main').isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
          'Form exists': await page.locator('form').isVisible().catch(() => false),
          'Input fields': await page.locator('input').first().isVisible().catch(() => false),
        };

        // Test formular - încearcă să completezi câmpuri
        try {
          const nameInput = page.locator('input[name="name"],input[name="nume"],input[placeholder*="nume"]').first();
          const emailInput = page.locator('input[type="email"]').first();

          if (await nameInput.isVisible()) {
            await nameInput.fill('Test Patient');
            checks['Name field works'] = true;
          }
          if (await emailInput.isVisible()) {
            await emailInput.fill('test@test.com');
            checks['Email field works'] = true;
          }
        } catch (e) {
          checks['Form interaction'] = false;
        }
      } else if (pageInfo.path === '/contact') {
        checks = {
          'Main content': await page.locator('main').isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
          'Contact info': await page.getByText(/telefon|email|adresa|program/i).first().isVisible().catch(() => false),
          'Form or contact method': await page.locator('form,a[href^="tel"],a[href^="mailto"]').first().isVisible().catch(() => false),
        };
      } else if (pageInfo.path === '/blog') {
        checks = {
          'Main content': await page.locator('main').isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
          'Blog/Articles heading': await page.locator('h1,h2').filter({ hasText: /blog|articole|sfaturi/i }).first().isVisible().catch(() => false),
        };
      } else if (pageInfo.path === '/admin') {
        checks = {
          'Login form': await page.locator('form').isVisible(),
          'Email input': await page.locator('input[type="email"]').isVisible(),
          'Password input': await page.locator('input[type="password"]').isVisible(),
          'Submit button': await page.locator('button[type="submit"]').isVisible(),
        };
      } else {
        checks = {
          'Main content': await page.locator('main').isVisible(),
          'Navigation': await page.locator('nav').first().isVisible(),
        };
      }

      const allChecksPass = Object.values(checks).every(v => v);
      const statusIcon = status === 200 && allChecksPass ? '✅' : '❌';

      console.log(`   Status Code: ${status} ${status === 200 ? '✅' : '❌'}`);
      console.log(`   Screenshot: ${screenshotPath}`);
      console.log(`   Element Checks:`);
      for (const [check, passed] of Object.entries(checks)) {
        console.log(`      ${passed ? '✅' : '❌'} ${check}`);
      }

      if (errors.length > 0) {
        console.log(`   Console Errors: ${errors.length}`);
        errors.forEach(err => console.log(`      ❌ ${err}`));
      }

      results.push({
        name: pageInfo.name,
        url,
        status,
        success: status === 200 && allChecksPass && errors.length === 0,
        checks,
        errors
      });

    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      results.push({
        name: pageInfo.name,
        url,
        status: 0,
        success: false,
        error: error.message
      });
    }
  }

  await browser.close();

  // Print summary
  console.log('\n');
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  const passedCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  console.log('');
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name} - HTTP ${result.status || 'FAILED'}`);
  });

  console.log('');
  console.log(`Total: ${passedCount}/${totalCount} pages passed`);
  console.log('');
  console.log(`Overall Status: ${passedCount === totalCount ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(80));

  process.exit(passedCount === totalCount ? 0 : 1);
}

verifySite().catch(console.error);
