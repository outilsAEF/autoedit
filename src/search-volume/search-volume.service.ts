import { Injectable } from '@nestjs/common';
import { firefox } from 'playwright';

@Injectable()
export class SearchVolumeService {
  async findByKeyword(keyword: string): Promise<number> {
    console.log('SearchVolumeService - find by keyword: ', keyword);

    const browser = await firefox.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const context = await browser.newContext();
    context.setDefaultTimeout(10 * 1000);
    const page = await context.newPage();
    await page.setViewportSize({ width: 1366, height: 768 });

    await page.goto('https://ahrefs.com/fr/amazon-keyword-tool');
    // Add a random delay of 1 to 3 seconds to simulate human behavior
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log('SearchVolumeService - before click on keyword input');

    await page.getByPlaceholder('Entrez un mot-cle').click();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log('SearchVolumeService - before writing keyword');

    await page
      .getByPlaceholder('Entrez un mot-cle')
      .fill('investissement immobilier');
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log('SearchVolumeService - before click on country dropdown');

    await page.getByRole('button', { name: 'United States' }).click();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log('SearchVolumeService - before click on France');

    await page
      .locator('div:nth-child(65) > .css-66iqcm-menuItemButton')
      .click();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log(
      'SearchVolumeService - after click on france, before click on Trouver des mots clés'
    );

    await page.getByRole('button', { name: 'Trouver des mots-clés' }).click();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log(
      'SearchVolumeService - after click on trouver des mots-clés, before looking for frame "Vous êtes humain"'
    );

    const label = await page
      .frameLocator(
        'iframe[title="Widget containing a Cloudflare security challenge"]'
      )
      .getByLabel('Vérifiez que vous êtes humain');
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );
    console.log(
      'SearchVolumeService - after looking for frame vous etes humain, before click on "Vous êtes humain"'
    );

    await label.check();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 2000 + 1000))
    );

    console.log('après check vérifier que vous êtes humain');

    /* 
    ESSAYER un peu plus GoLogin mais c'est pas très clair !!!
    
    aller voir:
    peut-être passer tout ce code à un fichier de test de Playwright pour voir si on peut debugger un peu plus - et voir ce que Playwright voit, non ????
    et sinon voir le lien de Medium et GoLogin 
    
    https://www.scrapingbee.com/
    https://brightdata.com/
    https://medium.com/geekculture/how-i-bypassed-cloudflare-bot-protection-for-web-scraping-b7c367b4cb1f
    https://www.zenrows.com/blog/playwright-cloudflare-bypass#set-custom-user-agent
    https://www.zenrows.com/blog/playwright-cloudflare-bypass#go-around-playwright-limitations
    https://www.zenrows.com/
    
    */

    return -1;
  }
}
