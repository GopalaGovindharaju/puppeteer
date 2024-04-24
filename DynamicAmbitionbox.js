import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import xlsx from 'xlsx'
import fs from 'fs'
import express from 'express';



puppeteer.use(StealthPlugin());

const app = express();

async function scrapeData(){

  try {
    const companyName = 'Quess'
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    const waitForSelector = async (selector) => {
      await page.waitForSelector(selector);
      console.log("Element is loading");
    };
  
    // Function to scrape overall ratings
    const scrapeOverallRatings = async (companyName) => {
      const url = `https://www.ambitionbox.com/reviews/${companyName}-reviews`;
      await page.goto(url);
      console.log("website loaded")
  
      await waitForSelector("#ab_company_review_rating_card > div.ab_section-header.container.header.flex.header-end > div > h1");
  
      const CompanyName = await page.$eval("#ab_company_review_rating_card > div.ab_section-header.container.header.flex.header-end > div > h1", h1 => h1.textContent.trim());
      console.log("Company Name:", CompanyName);
  
      const overallrating_data = [];
  
      await page.waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.badge-cont > div.badge-x-large.rating-4 > span");
      const Overall_Rating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.badge-cont > div.badge-x-large.rating-4 > span", span => span.textContent.trim());
      console.log(Overall_Rating);
  
      await page.waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(1) > label > p.stars_values.count.body-medium");
      const FiveStar_Rating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(1) > label > p.stars_values.count.body-medium", p => p.textContent.trim());
      console.log(FiveStar_Rating);
  
      await page.waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(2) > label > p.stars_values.count.body-medium");
      const FourStar_Rating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(2) > label > p.stars_values.count.body-medium", p => p.textContent.trim());
      console.log("Fourstar:", FourStar_Rating);
  
      await page.waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(3) > label > p.stars_values.count.body-medium");
      const ThreeStar_Rating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(3) > label > p.stars_values.count.body-medium", p => p.textContent.trim());
      console.log(ThreeStar_Rating);
  
      await page.waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(4) > label > p.stars_values.count.body-medium");
      const TwoStar_Rating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(4) > label > p.stars_values.count.body-medium", p => p.textContent.trim());
      console.log(TwoStar_Rating);
  
      await page.waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(5) > label > p.stars_values.count.body-medium");
      const OneStar_Rating = await page.$eval("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.rating_stats_bars > div:nth-child(5) > label > p.stars_values.count.body-medium", p => p.textContent.trim());
      console.log("onestar",OneStar_Rating);
  
      overallrating_data.push({
        'Company Name': CompanyName,
        'Overall Rating': Overall_Rating,
        'Five Star Rating': FiveStar_Rating,
        'Four Star Rating': FourStar_Rating,
        'Three Star Rating': ThreeStar_Rating,
        'Two Star Rating': TwoStar_Rating,
        'One Star Rating': OneStar_Rating
      });
  
      return overallrating_data;
    };
  
    // Function to scrape employee reviews
    const scrapeEmployeeReviews = async (companyName) => {
      const url = `https://www.ambitionbox.com/reviews/${companyName}-reviews`;
      await page.goto(url);
      
      await waitForSelector(".reviewer-info > h2");
  
      const Employee_roles_and_locations = await page.$$eval(".reviewer-info > h2", h2s => {
        return h2s.map(h2 => {
          const text = h2.textContent.trim();
          const regex = /(.*)\s+in\s+(.*)/;
          const match = text.match(regex);
          if (match && match.length === 3) {
            return {
              role: match[1].trim(),
              location: match[2].trim()
            };
          }
          return null;
        }).filter(data => data !== null);
      });
  
      const Job_Types = await page.$$eval(".reviewer-info > div > div > p", paragraphs => {
        return paragraphs.map(p => p.textContent.trim());
      });
  
      const Employee_Department = await page.$$eval(".user-wrap > p", paragraphs => {
        return paragraphs.map(p => p.textContent.trim());
      });
  
      const Posted_Dates = await page.$$eval(".badgePstdWrpr > span", spans => {
        return spans.map(span => {
          const match = span.textContent.trim().match(/posted on (\d{2} [a-zA-Z]+ \d{4})/);
          return match ? match[1] : "";
        });
      });
  
      const Employee_Ratings = await page.$$eval(".badgePstdWrpr > div > span > span", spans => {
        return spans.map(span => span.textContent.trim());
      });
  
      const employeeReviews = await page.$$("div.review-content-wrap > div.review-content-cont > div");
  
      const employeeData = [];
      for (const review of employeeReviews) {
        const Emp_likes = await review.$eval("div:nth-child(1) > p", p => p.textContent.trim());
        const Emp_Dislikes = await review.$eval("p:nth-child(4)", p => p.textContent.trim()); //As of now i made the selector path of likes
        const rowData = {
          likes: Emp_likes,
          dislikes: Emp_Dislikes,
        };
        employeeData.push(rowData);
      }
  
      const data = [];
      for (let i = 0; i < Employee_roles_and_locations.length; i++) {
        data.push({
          'Role': Employee_roles_and_locations[i].role,
          'Location': Employee_roles_and_locations[i].location,
          'Job Type': Job_Types[i],
          'Department': Employee_Department[i],
          'Posted Date': Posted_Dates[i],
          'Overall Rating': Employee_Ratings[i],
          'Likes': employeeData[i].likes,
          'Dislikes': employeeData[i].dislikes,
        });
      }
  
      return data;
    };
  
    // Function to scrape year trend ratings
    const scrapeYearTrendRatings = async (companyName) => {
      const url = `https://www.ambitionbox.com/reviews/${companyName}-reviews`;
      await page.goto(url);
  
      await waitForSelector("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.badge-cont > div.caption-strong-large.toggle-trend-cta > span");
      const elementSelector = await page.$("#ab_company_review_rating_card > div.card.globalCard.globalCard--elevated > div > div.overall-wrap > div > div.badge-cont > div.caption-strong-large.toggle-trend-cta > span");
      await elementSelector.click();
      console.log("Rating trend is clicked");
  
      await page.evaluate(() => {
        return new Promise(resolve => {
            setTimeout(resolve, 2000); // Wait for 2000 milliseconds (2 seconds)
        });
      });
  
      const yearData = await page.evaluate(() => {
        const yearSelectors = document.querySelectorAll("#LCgraphContainer > div > div.bold-list-header.year");
        const ratingSelectors = document.querySelectorAll("#LCgraphContainer > div > div.label");
        const descriptionSelectors = document.querySelectorAll("#LCgraphContainer > div > div.line-container > div.circle-pointer > div > span");
  
        const yearData = [];
  
        // Iterate over each selector to gather data
        yearSelectors.forEach((yearSelector, index) => {
          const year = yearSelector.textContent.trim();
          const rating = ratingSelectors[index].textContent.trim();
          const description = descriptionSelectors[index].textContent.trim();
  
          yearData.push({ year, rating, description });
        });
  
        return yearData;
      });
      return yearData;
    };
  
    // Scrape data from all sources
    const overallRatingsData = await scrapeOverallRatings(companyName);
    const employeeReviewsData = await scrapeEmployeeReviews(companyName);
    const yearTrendRatingsData = await scrapeYearTrendRatings(companyName);
  
    // Write data to Excel
    const wb = xlsx.utils.book_new();
  
    const overallRatingsSheet = xlsx.utils.json_to_sheet(overallRatingsData);
    xlsx.utils.book_append_sheet(wb, overallRatingsSheet, 'Overall Ratings');
  
    const employeeReviewsSheet = xlsx.utils.json_to_sheet(employeeReviewsData);
    xlsx.utils.book_append_sheet(wb, employeeReviewsSheet, 'Employee Reviews');
  
    const yearTrendRatingsSheet = xlsx.utils.json_to_sheet(yearTrendRatingsData);
    xlsx.utils.book_append_sheet(wb, yearTrendRatingsSheet, 'Year Trend Ratings');
  
    const excelData = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
  
    fs.writeFileSync('AmbitionBox-overalldata.xlsx', excelData);
  
    console.log("Excel file created successfully!");
  
    // Close the browser
    await browser.close();
  
    
  } catch (error) {
    console.error("An error occurred:", error);
  }
}



app.get('/download-excel', async (req, res) => {
  const companyName = req.query.companyName;


  try {
      // Call the scrapeData function
      const filePath = await scrapeData();
      
      // Send the Excel file as a response
      res.download(filePath);
  } catch (error) {
      console.error('Error scraping data:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Start the server on a specific port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});