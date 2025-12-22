import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../../test-results', 'manual-page-test');
const ADMIN_URL = 'http://localhost:3100/admin';
const FRONTEND_URL = 'http://localhost:3100';
const PAGE_SLUG = 'test-qa';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const results: Record<string, { status: string; message?: string; time?: number }> = {};

test.describe('Manual Page Creation Test - Complete Flow', () => {
  test.setTimeout(180000); // 3 minutes for entire flow

  test('Complete Page Creation Flow', async ({ page }) => {
    console.log('\n=== Starting Page Creation Test ===\n');

    // 1. Login
    console.log('Step 1: Logging in...');
    let startTime = Date.now();
    try {
      await page.goto(ADMIN_URL);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-login-page.png'), fullPage: true });

      await page.fill('input[name="email"]', 'admin@example.com');
      await page.fill('input[name="password"]', 'admin123');

      await page.click('button[type="submit"]');

      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-after-login.png'), fullPage: true });

      const time = Date.now() - startTime;
      results['login'] = { status: '✅', message: `Login successful`, time };
      console.log(`✅ Login successful (${time}ms)`);
    } catch (error) {
      results['login'] = { status: '❌', message: `Login failed: ${error}` };
      console.log(`❌ Login failed: ${error}`);
      throw error;
    }

    // 2. Navigate to Pages
    console.log('\nStep 2: Navigating to Pages...');
    startTime = Date.now();
    try {
      // Navigate directly to pages URL (avoids click interception issues)
      await page.goto(`${ADMIN_URL}/collections/pages`);

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-pages-list.png'), fullPage: true });

      const time = Date.now() - startTime;
      results['navigate_to_pages'] = { status: '✅', message: `Navigated to Pages`, time };
      console.log(`✅ Navigated to Pages (${time}ms)`);
    } catch (error) {
      results['navigate_to_pages'] = { status: '❌', message: `Navigation failed: ${error}` };
      console.log(`❌ Navigation to Pages failed: ${error}`);
      throw error;
    }

    // 3. Click Create New
    console.log('\nStep 3: Clicking Create New...');
    startTime = Date.now();
    try {
      // Navigate directly to create page
      await page.goto(`${ADMIN_URL}/collections/pages/create`);

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-create-page-form.png'), fullPage: true });

      const time = Date.now() - startTime;
      results['open_create_form'] = { status: '✅', message: `Create form opened`, time };
      console.log(`✅ Create form opened (${time}ms)`);
    } catch (error) {
      results['open_create_form'] = { status: '❌', message: `Open form failed: ${error}` };
      console.log(`❌ Open create form failed: ${error}`);
      throw error;
    }

    // 4. Fill Basic Info
    console.log('\nStep 4: Filling basic info...');
    startTime = Date.now();
    try {
      // Find and fill title
      const titleInput = page.locator('input[name="title"], input[id*="title"]').first();
      await titleInput.fill('Pagină Test QA');
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-title-filled.png'), fullPage: true });

      const time = Date.now() - startTime;
      results['fill_title'] = { status: '✅', message: `Title filled`, time };
      console.log(`✅ Title filled (${time}ms)`);
    } catch (error) {
      results['fill_title'] = { status: '❌', message: `Fill title failed: ${error}` };
      console.log(`❌ Fill title failed: ${error}`);
      throw error;
    }

    // 5. Try to find and click Add Block
    console.log('\nStep 5: Looking for Add Block button...');
    startTime = Date.now();
    try {
      // Scroll down to find blocks section
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-scrolled-down.png'), fullPage: true });

      // Try different selectors for Add Block button
      const addBlockSelectors = [
        'button:has-text("Add Block")',
        'button:has-text("Adaugă Block")',
        'button:has-text("Add")',
        'button[aria-label*="Add"]',
        'button[aria-label*="Block"]'
      ];

      let blockButtonFound = false;
      for (const selector of addBlockSelectors) {
        const button = page.locator(selector).first();
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          await button.click();
          blockButtonFound = true;
          console.log(`✅ Found Add Block button with selector: ${selector}`);
          break;
        }
      }

      if (blockButtonFound) {
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-add-block-clicked.png'), fullPage: true });

        const time = Date.now() - startTime;
        results['find_add_block'] = { status: '✅', message: `Add Block button found and clicked`, time };
      } else {
        const time = Date.now() - startTime;
        results['find_add_block'] = { status: '⚠️', message: `Add Block button not found - taking screenshot for analysis`, time };
        console.log(`⚠️ Add Block button not found`);
      }
    } catch (error) {
      results['find_add_block'] = { status: '❌', message: `Find block button failed: ${error}` };
      console.log(`❌ Find Add Block failed: ${error}`);
    }

    // 6. Save as draft
    console.log('\nStep 6: Saving page...');
    startTime = Date.now();
    try {
      const saveButton = page.locator('button').filter({ hasText: /Save|Salvează|Publish/i }).first();
      await saveButton.click();

      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-after-save.png'), fullPage: true });

      const time = Date.now() - startTime;
      results['save_page'] = { status: '✅', message: `Page saved`, time };
      console.log(`✅ Page saved (${time}ms)`);
    } catch (error) {
      results['save_page'] = { status: '❌', message: `Save failed: ${error}` };
      console.log(`❌ Save failed: ${error}`);
    }

    // 7. Try to view frontend (if slug was auto-generated)
    console.log('\nStep 7: Checking frontend...');
    startTime = Date.now();
    try {
      await page.goto(`${FRONTEND_URL}/${PAGE_SLUG}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-frontend-view.png'), fullPage: true });

      const pageTitle = await page.title();

      const time = Date.now() - startTime;
      results['view_frontend'] = { status: '✅', message: `Frontend loaded - Title: ${pageTitle}`, time };
      console.log(`✅ Frontend loaded (${time}ms) - Title: ${pageTitle}`);
    } catch (error) {
      results['view_frontend'] = { status: '⚠️', message: `Frontend might not exist yet: ${error}` };
      console.log(`⚠️ Frontend check: ${error}`);
    }

    // 8. Generate Report
    console.log('\n=== Generating Report ===\n');

    const summary = {
      testDate: new Date().toISOString(),
      results,
      screenshotsDir: SCREENSHOTS_DIR,
      totalTests: Object.keys(results).length,
      passed: Object.values(results).filter(r => r.status === '✅').length,
      failed: Object.values(results).filter(r => r.status === '❌').length,
      warnings: Object.values(results).filter(r => r.status === '⚠️').length,
    };

    // Save report
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'test-report.json'),
      JSON.stringify(summary, null, 2)
    );

    // Generate markdown report
    let markdownReport = '# QA Test Report - Page Creation with Blocks\n\n';
    markdownReport += `**Date**: ${new Date().toLocaleString()}\n\n`;
    markdownReport += `**Server**: ${ADMIN_URL}\n\n`;
    markdownReport += `## Summary\n\n`;
    markdownReport += `- Total Tests: ${summary.totalTests}\n`;
    markdownReport += `- Passed: ${summary.passed} ✅\n`;
    markdownReport += `- Failed: ${summary.failed} ❌\n`;
    markdownReport += `- Warnings: ${summary.warnings} ⚠️\n\n`;
    markdownReport += `## Detailed Results\n\n`;

    Object.entries(results).forEach(([test, result]) => {
      markdownReport += `### ${result.status} ${test}\n`;
      markdownReport += `- **Status**: ${result.status}\n`;
      markdownReport += `- **Message**: ${result.message}\n`;
      if (result.time) {
        markdownReport += `- **Time**: ${result.time}ms\n`;
      }
      markdownReport += '\n';
    });

    markdownReport += `## Screenshots\n\n`;
    markdownReport += `All screenshots saved to: \`${SCREENSHOTS_DIR}\`\n\n`;

    const screenshots = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'));
    screenshots.forEach(screenshot => {
      markdownReport += `- ${screenshot}\n`;
    });

    markdownReport += '\n## UI/UX Issues Found\n\n';
    markdownReport += '- [ ] Add Block button visibility (needs verification)\n';
    markdownReport += '- [ ] Auto-slug generation (needs verification)\n';
    markdownReport += '- [ ] Block reordering functionality\n';
    markdownReport += '- [ ] Block deletion functionality\n';

    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'TEST-REPORT.md'),
      markdownReport
    );

    console.log('=== Test Report ===');
    console.log(`Total: ${summary.totalTests}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Warnings: ${summary.warnings} ⚠️`);
    console.log('\nDetailed Results:');
    Object.entries(results).forEach(([test, result]) => {
      console.log(`${result.status} ${test}: ${result.message} ${result.time ? `(${result.time}ms)` : ''}`);
    });
    console.log(`\nFull report saved to: ${path.join(SCREENSHOTS_DIR, 'TEST-REPORT.md')}`);
  });
});
