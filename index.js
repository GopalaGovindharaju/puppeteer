import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.ambitionbox.com/reviews/quess-reviews');

    async function getText(elementSelector) {
        await page.waitForSelector(elementSelector);
        return await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : null;
        }, elementSelector);
    }

    async function getTextAll(elementSelector) {
        await page.waitForSelector(elementSelector);
        return await page.evaluate((selector) => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).map(element => element.textContent.trim());
        }, elementSelector);
    }

    const ratingTitles = await getTextAll('.rating_stats_bars .stars_values'); 
    console.log(ratingTitles)
    console.log(await getText('.bold-section-header.title'), await getText('.rating-val.bold-title'))

    await browser.close();
});
