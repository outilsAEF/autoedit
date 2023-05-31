import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ahrefs.com/fr/amazon-keyword-tool');
  await page.getByPlaceholder('Entrez un mot-cle').click();
  await page.getByPlaceholder('Entrez un mot-cle').click();
  await page.getByPlaceholder('Entrez un mot-cle').fill('romai');
  await page.getByPlaceholder('Entrez un mot-cle').press('Meta+a');
  await page.getByPlaceholder('Entrez un mot-cle').fill('romance ');
  await page.getByRole('button', { name: 'United States' }).click();
  await page.locator('div:nth-child(65) > .css-66iqcm-menuItemButton').click();
  await page.getByRole('button', { name: 'Trouver des mots-clés' }).click();
  await page.frameLocator('iframe[title="Widget containing a Cloudflare security challenge"]').getByLabel('Vérifiez que vous êtes humain').check();
  await page.getByRole('button', { name: 'Trouver des mots-clés' }).click();
  await page.frameLocator('iframe[title="Widget containing a Cloudflare security challenge"]').getByLabel('Vérifiez que vous êtes humain').check();
});