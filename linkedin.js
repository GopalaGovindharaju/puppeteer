import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import xlsx from 'xlsx';

(async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.linkedin.com/in/chitra-lakshmi-b554b4227/');
    await page.waitForNavigation({waitUntil:"networkidle0"});
    const name = await page.$$eval("#ember33 > h1", h1 => h1.textContent);
    console.log(name);
    const about = await page.$$eval("#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-none.scaffold-layout--main-aside.scaffold-layout--single-column.scaffold-layout--reflow.pv-profile > div > div > main > section.artdeco-card.sqoNofSlCuEyoCFIEswbkxhboyNetyplLeRGE > div.ph5.pb5 > div.mt2.relative > div:nth-child(1) > div.text-body-medium.break-words", text => text.textContent);
    console.log(about);
  } catch (error) {
    console.error('Error:', error);
  } 
})();
