import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import xlsx from 'xlsx'

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false}).then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.glassdoor.co.in/Reviews/Quess-Reviews-E977654.htm');

  await page.evaluate(() => {
    return new Promise(resolve => {
        setTimeout(resolve, 2000); // Wait for 2000 milliseconds (2 seconds)
    });
  });

  const companyName = await page.$eval("#Container > div > div.container-max-width.mx-auto.px-0.px-lg-lg.py-lg-xxl > div:nth-child(1) > div > div > div:nth-child(1) > div.d-none.d-md-block > div > div.left.d-flex > div.info.d-flex.flex-column.justify-content-end > div > p", p => p.textContent.trim());
  console.log("Company Name:", companyName);

  const overallRating = await page.$eval("#Container > div > div.container-max-width.mx-auto.px-0.px-lg-lg.py-lg-xxl > div:nth-child(2) > main > div.e155uas70.gd-ui-module.css-1b1jfg7.ec4dwm00 > div > div.review-overview__review-overview-module__overallRating > div > p", span => span.textContent.trim());
  console.log("Overall Rating:", overallRating);

  const totalReviews = await page.$eval("#Container > div > div.container-max-width.mx-auto.px-0.px-lg-lg.py-lg-xxl > div:nth-child(2) > main > div.e155uas70.gd-ui-module.css-1b1jfg7.ec4dwm00 > div > p.review-overview__review-overview-module__reviewCount", p => p.textContent.trim());
  console.log("Total Reviews:", totalReviews);

  await page.evaluate(() => {
    return new Promise(resolve => {
        setTimeout(resolve, 2000); // Wait for 2000 milliseconds (2 seconds)
    });
  });

  try {
    const emprole = await page.$eval("#empReview_82895908 > div > div > div > div.review-details__review-details-module__topReview > div.review-details__review-details-module__employeeContainer > span", span => span.textContent());
    console.log("Employee Role:", emprole);

      
  } catch (error) {
      console.error("Error:", error);
  }
  
  await browser.close();
});
