import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../../test-results', 'page-blocks-test');
const ADMIN_URL = 'http://localhost:3100/admin';
const FRONTEND_URL = 'http://localhost:3100';
const PAGE_SLUG = 'test-qa';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

test.describe('Page Creation with Blocks - QA Testing', () => {
  test.setTimeout(120000); // 2 minutes timeout

  let pageId: string;
  const timings: Record<string, number> = {};
  const results: Record<string, { status: string; message?: string }> = {};

  test('1. Login to Admin Panel', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(ADMIN_URL);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-login-page.png'), fullPage: true });

      // Login
      await page.fill('input[name="email"]', 'admin@example.com');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');

      // Wait for dashboard
      await page.waitForURL(/\/admin/);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-dashboard.png'), fullPage: true });

      timings['login'] = Date.now() - startTime;
      results['login'] = { status: '✅', message: `Logged in successfully (${timings['login']}ms)` };
    } catch (error) {
      results['login'] = { status: '❌', message: `Login failed: ${error}` };
      throw error;
    }
  });

  test('2. Navigate to Pages and Create New', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(ADMIN_URL);
      await loginIfNeeded(page);

      // Navigate to Pages
      await page.click('a[href="/admin/collections/pages"]');
      await page.waitForURL(/\/admin\/collections\/pages/);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-pages-list.png'), fullPage: true });

      // Click Create New
      await page.click('a[href="/admin/collections/pages/create"]');
      await page.waitForURL(/\/admin\/collections\/pages\/create/);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-create-page.png'), fullPage: true });

      timings['navigate_to_create'] = Date.now() - startTime;
      results['navigate_to_create'] = { status: '✅', message: `Navigated to create page (${timings['navigate_to_create']}ms)` };
    } catch (error) {
      results['navigate_to_create'] = { status: '❌', message: `Navigation failed: ${error}` };
      throw error;
    }
  });

  test('3. Fill Basic Page Info', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      // Fill Title
      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Fill Slug
      const slugInput = page.locator('input[name="slug"]');
      if (await slugInput.isVisible()) {
        await slugInput.fill(PAGE_SLUG);
      }

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-basic-info-filled.png'), fullPage: true });

      timings['fill_basic_info'] = Date.now() - startTime;
      results['fill_basic_info'] = { status: '✅', message: `Basic info filled (${timings['fill_basic_info']}ms)` };
    } catch (error) {
      results['fill_basic_info'] = { status: '❌', message: `Fill basic info failed: ${error}` };
      throw error;
    }
  });

  test('4. Add Hero Block', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      // Fill basic info first
      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Find and click "Add Block" button
      const addBlockButton = page.locator('button:has-text("Add Block"), button:has-text("Adaugă Block")').first();
      await addBlockButton.click();
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-add-block-menu.png'), fullPage: true });

      // Select Hero block
      await page.click('button:has-text("Hero"), li:has-text("Hero")');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-hero-block-added.png'), fullPage: true });

      // Fill Hero fields
      const heroTitleInput = page.locator('input[name*="blocks"][name*="title"], input[name*="layout"][name*="title"]').first();
      if (await heroTitleInput.isVisible()) {
        await heroTitleInput.fill('Bine ați venit la testare QA');
      }

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-hero-block-filled.png'), fullPage: true });

      timings['add_hero_block'] = Date.now() - startTime;
      results['add_hero_block'] = { status: '✅', message: `Hero block added (${timings['add_hero_block']}ms)` };
    } catch (error) {
      results['add_hero_block'] = { status: '❌', message: `Add hero block failed: ${error}` };
      throw error;
    }
  });

  test('5. Add Content Block', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Add Content block
      const addBlockButton = page.locator('button:has-text("Add Block"), button:has-text("Adaugă Block")').last();
      await addBlockButton.click();
      await page.click('button:has-text("Content"), li:has-text("Content")');
      await page.waitForTimeout(1000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-content-block-added.png'), fullPage: true });

      timings['add_content_block'] = Date.now() - startTime;
      results['add_content_block'] = { status: '✅', message: `Content block added (${timings['add_content_block']}ms)` };
    } catch (error) {
      results['add_content_block'] = { status: '❌', message: `Add content block failed: ${error}` };
      throw error;
    }
  });

  test('6. Add CTA Block', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Add CTA block
      const addBlockButton = page.locator('button:has-text("Add Block"), button:has-text("Adaugă Block")').last();
      await addBlockButton.click();
      await page.click('button:has-text("CTA"), li:has-text("CTA")');
      await page.waitForTimeout(1000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-cta-block-added.png'), fullPage: true });

      timings['add_cta_block'] = Date.now() - startTime;
      results['add_cta_block'] = { status: '✅', message: `CTA block added (${timings['add_cta_block']}ms)` };
    } catch (error) {
      results['add_cta_block'] = { status: '❌', message: `Add CTA block failed: ${error}` };
      throw error;
    }
  });

  test('7. Add Stats Block', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Add Stats block
      const addBlockButton = page.locator('button:has-text("Add Block"), button:has-text("Adaugă Block")').last();
      await addBlockButton.click();
      await page.click('button:has-text("Stats"), li:has-text("Stats"), button:has-text("Statistici")');
      await page.waitForTimeout(1000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11-stats-block-added.png'), fullPage: true });

      timings['add_stats_block'] = Date.now() - startTime;
      results['add_stats_block'] = { status: '✅', message: `Stats block added (${timings['add_stats_block']}ms)` };
    } catch (error) {
      results['add_stats_block'] = { status: '❌', message: `Add stats block failed: ${error}` };
      throw error;
    }
  });

  test('8. Save as Draft', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Save as draft
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Salvează")').first();
      await saveButton.click();

      // Wait for save to complete
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12-saved-as-draft.png'), fullPage: true });

      // Extract page ID from URL
      const url = page.url();
      const match = url.match(/\/pages\/([a-f0-9]+)/);
      if (match) {
        pageId = match[1];
      }

      timings['save_draft'] = Date.now() - startTime;
      results['save_draft'] = { status: '✅', message: `Saved as draft (${timings['save_draft']}ms)` };
    } catch (error) {
      results['save_draft'] = { status: '❌', message: `Save draft failed: ${error}` };
      throw error;
    }
  });

  test('9. Publish Page', async ({ page }) => {
    const startTime = Date.now();

    try {
      await page.goto(`${ADMIN_URL}/collections/pages/create`);
      await loginIfNeeded(page);

      // Fill and create a simple page
      await page.fill('input[name="title"]', 'Pagină Test QA');

      // Change status to Published
      const statusSelect = page.locator('select[name="_status"]');
      if (await statusSelect.isVisible()) {
        await statusSelect.selectOption('published');
      }

      // Save
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Salvează"), button:has-text("Publish")').first();
      await saveButton.click();

      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13-published.png'), fullPage: true });

      timings['publish_page'] = Date.now() - startTime;
      results['publish_page'] = { status: '✅', message: `Page published (${timings['publish_page']}ms)` };
    } catch (error) {
      results['publish_page'] = { status: '❌', message: `Publish failed: ${error}` };
      throw error;
    }
  });

  test('10. View Frontend Page', async ({ page }) => {
    const startTime = Date.now();

    try {
      // Visit the frontend page
      await page.goto(`${FRONTEND_URL}/${PAGE_SLUG}`);
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14-frontend-view.png'), fullPage: true });

      // Check if page loaded
      const pageTitle = await page.title();

      timings['view_frontend'] = Date.now() - startTime;
      results['view_frontend'] = { status: '✅', message: `Frontend viewed (${timings['view_frontend']}ms) - Title: ${pageTitle}` };
    } catch (error) {
      results['view_frontend'] = { status: '❌', message: `Frontend view failed: ${error}` };
      throw error;
    }
  });

  test('11. Generate Report', async ({ page }) => {
    // Generate final report
    const report = {
      testDate: new Date().toISOString(),
      results,
      timings,
      screenshotsDir: SCREENSHOTS_DIR,
      summary: {
        total: Object.keys(results).length,
        passed: Object.values(results).filter(r => r.status === '✅').length,
        failed: Object.values(results).filter(r => r.status === '❌').length,
      }
    };

    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n=== QA TEST REPORT ===\n');
    console.log(`Total Tests: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log('\nDetailed Results:');
    Object.entries(results).forEach(([test, result]) => {
      console.log(`${result.status} ${test}: ${result.message}`);
    });
    console.log('\nTimings:');
    Object.entries(timings).forEach(([operation, time]) => {
      console.log(`  ${operation}: ${time}ms`);
    });
    console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);
  });
});

async function loginIfNeeded(page: Page) {
  const currentUrl = page.url();
  if (currentUrl.includes('/login')) {
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  }
}
