import { Injectable } from '@nestjs/common';
import { firefox, chromium, webkit } from 'playwright';

@Injectable()
export class SearchVolumeService {
  async findAhrefsSearchVolume(keyword: string): Promise<Map<string, string>> {
    console.log(`[keyword=${keyword}] - findAhrefsSearchVolume - START`);


    const browser = await firefox.launch({
      // headless: true,
      // args: ['--no-sandbox'],
      headless: false,
      proxy: {
        server: 'zproxy.lum-superproxy.io:9222',
        username: 'brd-customer-hl_61019365-zone-scraping_browser',
        password: 'k7l4hx3oyjou'
      },
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://lumtest.com/myip.json');
    await page.screenshot({ path: 'example.png' });
    await browser.close();


    return new Map<string, string>();

    // const context = await browser.newContext();
    // context.setDefaultTimeout(10 * 1000);
    // const page = await context.newPage();
    // await page.setViewportSize({ width: 1366, height: 768 });

    // await page.goto('https://ahrefs.com/fr/amazon-keyword-tool');


    // await waitRandom();
    // await page.getByPlaceholder('Entrez un mot-cle').click();

    // await waitRandom();
    // await page
    //   .getByPlaceholder('Entrez un mot-cle')
    //   .fill(keyword);

    // await waitRandom();
    // await page.getByRole('button', { name: 'United States' }).click();


    // await waitRandom();
    // await page
    //   .locator('div:nth-child(65) > .css-66iqcm-menuItemButton')
    //   .click();

    // await waitRandom();
    // await page.getByRole('button', { name: 'Trouver des mots-clés' }).click();

    // console.log(
    //   `[keyword=${keyword}] - after click on 'trouver des mots-clés'`);

    // await waitRandom();
    // const label = await page
    //   .frameLocator(
    //     'iframe[title="Widget containing a Cloudflare security challenge"]'
    //   )
    //   .getByLabel('Vérifiez que vous êtes humain');

    // console.log(
    //   `[keyword=${keyword}] - after looking for frame vous etes humain`
    // );

    // await page.screenshot({ path: 'screenshot.png' })

    // await waitRandom();
    // const ahrefskwLocator = await page.locator('.ReactModalPortal table tbody tr td:nth-child(1) p');
    // const textKwLocator = await ahrefskwLocator.allTextContents();

    // const ahrefsSearchVolumeLocator = await page.locator('.ReactModalPortal table tbody tr td:nth-child(2) p');
    // const searchVolumeLocator = await ahrefsSearchVolumeLocator.allTextContents();

    // const volumeSearchPerKeyword: Map<string, string> = new Map<string, string>();
    // textKwLocator.forEach((kw, index) => {
    //   const volume = searchVolumeLocator[index];
    //   volumeSearchPerKeyword.set(kw, volume);
    // })

    // console.log(`[keyword=${keyword}] - results`, volumeSearchPerKeyword)


    // await page.close();
    // await context.close();
    // await browser.close();

    // console.log(`[keyword=${keyword}] - findAhrefsSearchVolume - DONE`);


    // return volumeSearchPerKeyword;
  }
}

const waitRandom = async () => {
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
  );
}
