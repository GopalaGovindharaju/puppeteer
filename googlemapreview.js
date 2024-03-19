const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

async function map(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    
    await autoScroll(page);

    
    await page.waitForFunction(() => {
      
      const reviewElements = document.querySelectorAll('.m6QErb .jftiEf.fontBodyMedium .jJc9Ad');
      return reviewElements.length > 50; 
    });

    
    const reviews = await page.$$eval('.m6QErb.DxyBCb.kA9KIf.dS8AEf .m6QErb .jftiEf.fontBodyMedium .jJc9Ad', reviews => reviews.map(review => {
      const currentDate = new Date().toLocaleDateString(); 
      const nameElement = review.querySelector('.GHT2ce.NsCY4 .WNxzHc.qLhwHc .al6Kxe .d4r55');
      const timePeriodElement = review.querySelector('.GHT2ce .DU9Pgb .rsqaWe');
      const contentElement = review.querySelector('.MyEned .wiI7pd');
      const ratingElement = review.querySelector('.DU9Pgb .kvMYJc');
      
      const rating = ratingElement ? ratingElement.getAttribute('aria-label') : '';
      return {
        Date_of_scrapping : currentDate ,
        Name: nameElement ? nameElement.textContent.trim() : '',
        Timeperiod: timePeriodElement ? timePeriodElement.textContent.trim() : '',
        Ratings: rating ? rating.trim() : '',
        review: contentElement ? contentElement.textContent.trim() : ''
      };
    }));

    console.log(reviews);
    
    console.log('done');

    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(reviews);
    xlsx.utils.book_append_sheet(wb, ws);
    xlsx.writeFile(wb, 'googlemap reviews-ratings.xlsx');

    await browser.close();

  } catch(e) {
    console.error('error: ', e);
  }
}

async function autoScroll(page) {
  try {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const maxScrolls = 50; // Adjust this value as needed
        let scrollCount = 0;

        const scrollInterval = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          scrollCount++;

          if (scrollCount >= maxScrolls) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 200);
      });
    });
  } catch (error) {
    console.error('Error in autoScroll:', error);
  }
}

map('https://www.google.com/maps/place/Quess+Corp+Limited/@12.920436,77.6647596,17z/data=!4m8!3m7!1s0x3bae137729289ecb:0x3caf3cb0ae3be874!8m2!3d12.920436!4d77.6673345!9m1!1b1!16s%2Fg%2F1q65_c65s?entry=ttu');
