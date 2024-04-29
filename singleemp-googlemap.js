import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

(async () => {
  puppeteer.use(StealthPlugin());

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.google.com/maps/place/Quess+Corp+Limited/@12.920436,77.5952367,13z/data=!4m12!1m2!2m1!1sgoogle+map+quesscorp,+bangalore!3m8!1s0x3bae137729289ecb:0x3caf3cb0ae3be874!8m2!3d12.920436!4d77.6673345!9m1!1b1!15sCh9nb29nbGUgbWFwIHF1ZXNzY29ycCwgYmFuZ2Fsb3JlIgOIAQGSARBjb3Jwb3JhdGVfY2FtcHVz4AEA!16s%2Fg%2F1q65_c65s?entry=ttu');
    console.log("Website loaded!");

    await page.evaluate(() => {
      return new Promise(resolve => {
          setTimeout(resolve, 2000); // Wait for 2000 milliseconds (2 seconds)
      });
    });

    const result = await page.evaluate(() => {
      const fullName = document.querySelector('.d4r55');
      const postDate = document.querySelector('.rsqaWe');
      const starRating = document.querySelector('.kvMYJc');
      const postReview = document.querySelector('.wiI7pd');

      console.log(fullName);
      console.log(postDate);
      console.log(starRating);
      console.log(postReview);

      return {
        fullName,
        postDate,
        starRating,
        postReview
      };
    });

    // Close the browser
    await browser.close();
    console.log(result);

  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
