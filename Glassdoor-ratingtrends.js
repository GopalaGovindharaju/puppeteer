import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import xlsx from 'xlsx';

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.glassdoor.co.in/Overview/Working-at-Quess-EI_IE977654.11,16.htm');

    const companyName = await page.$eval("#Container > div > div.container-max-width.mx-auto.px-0.px-lg-lg.py-lg-xxl > div:nth-child(1) > div > div > div:nth-child(1) > div.d-none.d-md-block > div > div.left.d-flex > div.info.d-flex.flex-column.justify-content-end > div > h1", h1 => h1.textContent.trim());
    console.log("Company Name:", companyName);

    try {
        console.log("Before waiting for selector");

        const elementSelector = await page.$("#MainContent > div:nth-child(5) > div.mb-md-md.mb-xsm.d-flex.justify-content-center.align-items-center > div.css-aztz7y.eky1qiu1 > span > svg");
        await elementSelector.click();
        console.log("rating_trend is clicked");

        console.log("element is loading");

        await page.evaluate(() => {
          return new Promise(resolve => {
              setTimeout(resolve, 2000); // Wait for 2000 milliseconds (2 seconds)
          });
        });

        console.log("element is loading");

        const ratings = [];

        for (let i = 2; i <= 7; i++) {
            const Description = await page.$eval(`body > div.modal__modal-module__ModalContainer > div.modal__modal-module__Modal > div > div.row.mx-0.mt-std > div:nth-child(1) > div > div:nth-child(${i}) > div > div.col-6.p-0.ratingTrends__RatingTrendsStyle__ratingText.ratingTrends__RatingTrendsStyle__categoryText > span`, span => span.textContent.trim());
            const Ratings = await page.$eval(`body > div.modal__modal-module__ModalContainer > div.modal__modal-module__Modal > div > div.row.mx-0.mt-std > div:nth-child(1) > div > div:nth-child(${i}) > div > div.col-2.p-0.ratingTrends__RatingTrendsStyle__ratingNum.ratingTrends__RatingTrendsStyle__ratingText`, span => span.textContent.trim());

            ratings.push({ Description, Ratings });
        }

        const ws = xlsx.utils.json_to_sheet(ratings);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Ratings1');
        xlsx.writeFile(wb, 'Year_trend_ratings.xlsx');

        console.log("Excel file created successfully!");
    } catch (error) {
        console.error("Error:", error);
    }

    await browser.close();
});
