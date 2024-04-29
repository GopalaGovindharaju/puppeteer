import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import xlsx from 'xlsx'
import fs from 'fs'

puppeteer.use(StealthPlugin());

async function map (companyName) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const waitForSelector = async (selector) => {
      await page.waitForSelector(selector);
      console.log("Element is loading");
    };

    const encodedCompanyName = encodeURIComponent(companyName);
    const googleMapsUrl = `https://www.google.com/maps/search/${encodedCompanyName}`;
    await page.goto(googleMapsUrl);
    console.log("Page redirected!");
    await waitForSelector("#searchboxinput");

    await page.type("#searchboxinput", companyName); // Enter the company name in the search input
    await page.keyboard.press("Enter"); // Press Enter to initiate the search
    console.log("Search box entered!");

    console.log("Waiting for review element");
    await page.waitForSelector(
      ".k7jAl.miFGmb.lJ3Kh.w6Uhzf .aIFcqe .m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd .Nv2PK.tH5CWc.THOPZb .hfpxzc"
    );
    const links = await page.$(
      ".k7jAl.miFGmb.lJ3Kh.w6Uhzf .aIFcqe .m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd .Nv2PK.tH5CWc.THOPZb .hfpxzc"
    );
    await links.click();
    await page.waitForSelector(
      ".yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)"
    );
    const reviewsButton = await page.$(
      ".yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)"
    );
    await reviewsButton.click();
    console.log("Review button is clicked");

    console.log("Scraping reviews open succcessfully!");

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.jANrlb > div.fontDisplayLarge");
    const Overall_Rating = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.jANrlb > div.fontDisplayLarge", p => p.textContent.trim());
    console.log("Overall-Rating: ", Overall_Rating);

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.jANrlb > div.fontBodySmall");
    const Total_Review = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.jANrlb > div.fontBodySmall", p => p.textContent.trim());
    console.log("No of Reviews: ", Total_Review);

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(1)");
    const FiveStar_Rating = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(1)", p => {
      const ariaLabel = p.getAttribute('aria-label');
      const parts = ariaLabel.split(',');
      return parts[1].trim();});
    console.log("Fivestar: ", FiveStar_Rating);

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(2)");
    const FourStar_Rating = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(2)", p => {
      const ariaLabel = p.getAttribute('aria-label');
      const parts = ariaLabel.split(',');
      return parts[1].trim();});
    console.log("Fourstar: ", FourStar_Rating);

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(3)");
    const ThreeStar_Rating = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(3)", p => {
      const ariaLabel = p.getAttribute('aria-label');
      const parts = ariaLabel.split(',');
      return parts[1].trim();});
    console.log("Threestar: ", ThreeStar_Rating);

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(4)");
    const TwoStar_Rating = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(4)", p => {
      const ariaLabel = p.getAttribute('aria-label');
      const parts = ariaLabel.split(',');
      return parts[1].trim();});
    console.log("Twostar: ", TwoStar_Rating);

    await page.waitForSelector("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(5)");
    const OneStar_Rating = await page.$eval("#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.PPCwl > div > div.ExlQHd > table > tbody > tr:nth-child(5)", p => {
      const ariaLabel = p.getAttribute('aria-label');
      const parts = ariaLabel.split(',');
      return parts[1].trim();});
    console.log("Onestar: ", OneStar_Rating);

    const ratings_data = [];

    ratings_data.push({
      'Overall Rating': Overall_Rating,
      'Total Ratings': Total_Review,
      'Five Star Rating': FiveStar_Rating,
      'Four Star Rating': FourStar_Rating,
      'Three Star Rating': ThreeStar_Rating,
      'Two Star Rating': TwoStar_Rating,
      'One Star Rating': OneStar_Rating
    });

            // Excel data
            const wb = xlsx.utils.book_new();

            const Ratings = xlsx.utils.json_to_sheet(ratings_data);
            xlsx.utils.book_append_sheet(wb, Ratings, 'GoogleMap_Ratings');
        
            const excelData = xlsx.write(wb, {bookType:'xlsx', type:'buffer'});
        
            fs.writeFileSync('GoogleMap-Ratings.xlsx', excelData);
            console.log("Excel file created successfully!");
            // Close the browser
            await browser.close();
    
    
    return ratings_data;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}; 

const companyName = 'Quess corp, Bangalore';
map(companyName);