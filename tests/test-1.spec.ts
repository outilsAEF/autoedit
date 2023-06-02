import { test, expect } from '@playwright/test';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

const KEYWORDS_SAMPLE = ['livre romance', 'new romance', 'roman', 'romance', 'Déménagement', 'Colmar', 'Alsace', 'livres romance', 'Deuil', 'developpement personnel femme', 'roman developpement personnel', 'resilience livre', 'roman romance', 'Solitude', 'changer de vie', 'livre drole adulte', 'livre humour', 'roman initiatique', 'livre feel good', 'roman femme', 'chick lit', 'Résilience', 'roman feel good', 'livre inspirant', 'roman chick lit', 'livre deuil', 'livre drole', 'livre humour femme', 'comédie romantique', 'romance contemporaine', 'romance adulte', 'feel good', 'Tristesse', 'livre comedie romantique', 'Nouveau départ', 'comedie romantique', 'feel good livre', 'comedies romantiques', 'livre humoristique', 'Rupture conventionnelle', 'feelgood', 'feel good roman', 'livres feelgood', 'roman comedie', 'roman comedie romantique', 'roman contemporain francais', 'romance feel good', 'romans feel good', 'comedie romantique drole', 'comedie romantique en francais', 'comédie romantique livre', 'lecture feel good', 'litterature feel good', 'livre romance contemporaine', 'livre romance feel good', 'roman feel good en francais', 'romance feel good en francais', 'amitie livre', 'bien etre roman', 'chick lit en francais', 'chick lit francais', 'chicklit', 'chicklit francais', 'comedie de noel', 'comedie drole', 'comedie romantique feel good', 'ebooks feel good', 'feel good en francais', 'feel good ete', 'feel good francais', 'feel good humour', 'feelgood livre', 'livre comedie romantique drole', 'livre drole femme', 'livre feelgood', 'livre initiatique', 'livre roman feel good', 'livres feel good', 'roman actuel', 'roman adulte femme', 'roman bonne humeur', 'roman de developpement personnel', 'roman developpement personnel femme', 'roman ete', 'roman feel good ete', 'roman feel good francais', 'roman feelgood', 'roman feelgood francais', 'roman initiatique spirituel', 'romance feel good livre', 'romans ete', 'romans feelgood'];

const password = 'k7l4hx3oyjou'
const auth = `brd-customer-hl_61019365-zone-scraping_browser:${password}`;
const browserURL = `wss://${auth}@zproxy.lum-superproxy.io:9222`;

test('test', async () => {
  test.setTimeout(1000 * 60 * 2);
  const keyword = KEYWORDS_SAMPLE[Math.floor(Math.random() * KEYWORDS_SAMPLE.length)]
  console.log(`[keyword=${keyword}] - findAhrefsSearchVolume - START`);
  console.time(`[keyword=${keyword}]`)

  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  const volumeSearchPerKeyword: Map<string, string> = new Map<string, string>();

  try {
    browser = await chromium.connectOverCDP(
      browserURL
    );


    // const context = await browser.newContext();
    // const page = await context.newPage();
    // await page.goto('http://lumtest.com/myip.json');
    // await page.screenshot({ path: 'example.png' });
    // await browser.close();


    // return new Map<string, string>();

    context = await browser.newContext();
    context.setDefaultTimeout(10 * 1000);
    const page = await context.newPage();
    // await page.setViewportSize({ width: 1366, height: 768 });
    // thinkabout blocking some ressource to have less data transfer
    // see https://www.zenrows.com/blog/blocking-resources-in-playwright#blocking-resources
    // await page.route()
    await page.goto('https://ahrefs.com/fr/amazon-keyword-tool');
    console.timeLog(`[keyword=${keyword}]`, ' - after going to Amazon KW page')
    await waitRandom();
    await page.getByPlaceholder('Entrez un mot-cle').click();
    console.timeLog(`[keyword=${keyword}]`, ' - after clicking on Entrez un mot-clé')

    await waitRandom();
    await page
      .getByPlaceholder('Entrez un mot-cle')
      .fill(keyword);
    console.timeLog(`[keyword=${keyword}]`, ' - after filling mot-clé')

    await waitRandom();
    await page.getByRole('button', { name: 'United States' }).click();
    console.timeLog(`[keyword=${keyword}]`, ' - after clicking on dropdown countries')

    await waitRandom();
    await page
      .locator('div:nth-child(65) > .css-66iqcm-menuItemButton')
      .click();
    console.timeLog(`[keyword=${keyword}]`, ' - after clicking on France')
    await page.screenshot({ path: 'screenshot-after-click-on-france.png' })
    await waitRandom();
    await page.getByRole('button', { name: 'Trouver des mots-clés' }).click();


    console.timeLog(
      `[keyword=${keyword}]`, ' - after click on trouver des mots-clés');

    await waitRandom();
    await page.screenshot({ path: 'screenshot-after-click-on-trouver-des-mots-cles.png' })

    const label = await page
      .frameLocator(
        'iframe[title="Widget containing a Cloudflare security challenge"]'
      )
      // .getByLabel('Vérifiez que vous êtes humain');
      .getByLabel('Verify you are human');

    console.timeLog(
      `[keyword=${keyword}]`, ' - after looking for frame vous etes humain'
    );
    await waitRandom();
    await page.screenshot({ path: 'screenshot-before-click.png' })
    await label.check({ timeout: 20000, noWaitAfter: true });
    console.timeLog(
      `[keyword=${keyword}]`, ' - after clicking on Vous etes humain'
    );

    await page.screenshot({ path: 'screenshot-after-click.png' })

    await waitRandom();
    await page.screenshot({ path: 'screenshot-after-click-and-wait.png' })
    const ahrefskwLocator = await page.locator('.ReactModalPortal table tbody tr td:nth-child(1) p');
    const textKwLocator = await ahrefskwLocator.allTextContents();

    const ahrefsSearchVolumeLocator = await page.locator('.ReactModalPortal table tbody tr td:nth-child(2) p');
    const searchVolumeLocator = await ahrefsSearchVolumeLocator.allTextContents();

    // const volumeSearchPerKeyword: Map<string, string> = new Map<string, string>();
    textKwLocator.forEach((kw, index) => {
      const volume = searchVolumeLocator[index];
      volumeSearchPerKeyword.set(kw, volume);
    })

    console.log(`[keyword=${keyword}] - results`, volumeSearchPerKeyword)


    await page.close();
    await context.close();
    await browser.close();
  } catch (error) {
    console.error(error);
    await page?.close();
    await context?.close();
    await browser?.close();
  }

  console.log(`[keyword=${keyword}] - findAhrefsSearchVolume - DONE`);

  console.timeEnd(`[keyword=${keyword}]`);


});

const waitRandom = async () => {
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
  );
}