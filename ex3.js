const puppeteer = require('puppeteer');
const fs = require('fs');
const xlsx = require('xlsx');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.ambitionbox.com/reviews/zoho-reviews');
    console.log("Page loaded successfully");

    const companyName = await page.$eval("#ab_company_review_rating_card > div.ab_section-header.container.header.flex.header-end > div > h1", h1 => h1.textContent.trim());
    console.log("Company Name:", companyName);

    const overallRating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.badge-cont > div.badge-x-large", badge => badge.textContent.trim());
    console.log("Overall Rating:", overallRating);

    const TimeStamp = await page.$eval("#ab_company_review_rating_card > div.ab_section-header.container.header.flex.header-end > span", badge => badge.textContent.trim());
    console.log("Rating Posted Date:", TimeStamp);

    const ratings = await page.$$eval("#ab_company_review_rating_card div.rating_stats_bars div label p.stars_values.count.body-medium", elements => elements.map(el => el.textContent.trim()));
    const [fiveStarRating, fourStarRating, threeStarRating, twoStarRating, oneStarRating] = ratings;

    
    console.log("Five Star Rating:", fiveStarRating);
      console.log("Four Star Rating:", fourStarRating);
      console.log("Three Star Rating:", threeStarRating);
      console.log("Two Star Rating:", twoStarRating);
      console.log("One Star Rating:", oneStarRating);
    
      try {
        console.log("Before waiting for selector");
        const elementSelector = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.badge-cont > div:nth-child(2) > div");
        await page.waitForSelector(elementSelector, { visible: true, timeout: 60000 }); 
        console.log("After waiting for selector");
        await page.click(elementSelector);
        console.log("rating_trend is clicked");
    } catch (error) {
        console.error("Error:", error);
    }
    

    const year = await page.$$eval("#LCgraphContainer > div:nth-child(1) > div.bold-list-header.year", elements => elements.map(el => el.textContent.trim()));
    const year_rating = await page.$$eval("#LCgraphContainer > div:nth-child(1) > div.label", elements => elements.map(el => el.textContent.trim()));
    const year_rating_description = await page.$$eval("#LCgraphContainer > div:nth-child(1) > div.line-container > div.circle-pointer > div > span", elements => elements.map(el => el.textContent.trim()));
    const [y1, y2, y3, y4, y5] = year;
    const [yr1, yr2, yr3, yr4, yr5] = year_rating;
    const [yrdes1, yrdes2, yrdes3, yrdes4, yrdes5] = year_rating_description;

    const year_rating_data = [
      {'year': y1, 'Rating': yr1, 'Description': yrdes1},
      {'year': y2, 'Rating': yr2, 'Description': yrdes2},
      {'year': y3, 'Rating': yr3, 'Description': yrdes3},
      {'year': y4, 'Rating': yr4, 'Description': yrdes4},
      {'year': y5, 'Rating': yr5, 'Description': yrdes5},
    ];

    const data = [
      { 'Company Name': companyName, 'Overall Rating': overallRating, 'Rating Posted Date': TimeStamp, 'Five Star Rating': fiveStarRating, 'Four Star Rating': fourStarRating, 'Three Star Rating': threeStarRating, 'Two Star Rating': twoStarRating, 'One Star Rating': oneStarRating }
    ];



    const ws = xlsx.utils.json_to_sheet(year_rating_data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Ratings1');
    xlsx.writeFile(wb, 'Year_trend_ratings.xlsx');

    console.log("Excel file created successfully!");

  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
