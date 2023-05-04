// import { test, expect } from '@playwright/test';
// import { chromium } from 'playwright';
// import GoLogin from 'gologin';

// test('get ahrefs amazon keyword search volume', async ({ page }) => {
//   const GL = new GoLogin({
//     token:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDUxNDg3YjMyZjI1NTE3N2Y1MTE1NzYiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NDUxNGFjNzhhZDY1MmRiMWQxNjg1YTgifQ.Moc_Qcex201GlLOqK2RnZw6HuCsnvZRfqRqNVLY8VsQ',
//     profile_id: '64514974455ad03046200edb',
//   });
//   const { status, wsUrl } = await GL.start();
//   const browser = await chromium.connect({ wsEndpoint: wsUrl.toString() });
//   // const page = await browser.newPage();
//   page.setDefaultTimeout(10 * 1000);
//   await page.setViewportSize({ width: 1366, height: 768 });

//   await page.goto('https://ahrefs.com/fr/amazon-keyword-tool');
//   // Add a random delay of 1 to 3 seconds to simulate human behavior
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log('SearchVolumeService - before click on keyword input');

//   await page.getByPlaceholder('Entrez un mot-cle').click();
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log('SearchVolumeService - before writing keyword');

//   await page
//     .getByPlaceholder('Entrez un mot-cle')
//     .fill('investissement immobilier');
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log('SearchVolumeService - before click on country dropdown');

//   await page.getByRole('button', { name: 'United States' }).click();
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log('SearchVolumeService - before click on France');

//   await page.locator('div:nth-child(65) > .css-66iqcm-menuItemButton').click();
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log(
//     'SearchVolumeService - after click on france, before click on Trouver des mots clés'
//   );

//   await page.getByRole('button', { name: 'Trouver des mots-clés' }).click();
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log(
//     'SearchVolumeService - after click on trouver des mots-clés, before looking for frame "Vous êtes humain"'
//   );

//   const label = await page
//     .frameLocator(
//       'iframe[title="Widget containing a Cloudflare security challenge"]'
//     )
//     .getByLabel('Vérifiez que vous êtes humain');
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );
//   console.log(
//     'SearchVolumeService - after looking for frame vous etes humain, before click on "Vous êtes humain"'
//   );

//   await label.check();
//   await new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
//   );

//   console.log('après check vérifier que vous êtes humain');
//   expect(label.isChecked()).toBeTruthy();
//   await GL.stop();
// });

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });
