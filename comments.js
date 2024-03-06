const puppeteer = require('puppeteer');
const xlsx = require("xlsx");


(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.ambitionbox.com/reviews/quess-reviews');

  const comments = await page.$$eval(".flex-wrap .category-ratings p", allAs => allAs.map(p => p));
  console.log(comments);

  const commentsemp = comments.map(l => [l]);

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(commentsemp);
  xlsx.utils.book_append_sheet(wb,ws);
  xlsx.writeFile(wb,"Comments.xlsx");
  
})