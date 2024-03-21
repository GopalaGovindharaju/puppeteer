import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import xlsx from 'xlsx'

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false, timeout: 0 }).then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.glassdoor.co.in/Overview/Working-at-Quess-EI_IE977654.11,16.htm');

  const companyName = await page.$eval("#Container > div > div.container-max-width.mx-auto.px-0.px-lg-lg.py-lg-xxl > div:nth-child(1) > div > div > div:nth-child(1) > div.d-md-none > div > div.info > p", p => p.textContent.trim());
  console.log("Company Name:", companyName);

  const overallRating = await page.$eval("span.employer-overview__employer-overview-module__employerOverviewRating", span => span.textContent.trim());
  console.log("Overall Rating:", overallRating);

  try {
    const website = await page.$eval("#MainContent > div.css-cxgx8d > div > ul > li:nth-child(1) > a", a => a.textContent.trim());
    console.log("Website:", website);
    
    const locationElement = await page.$("#MainContent > div.css-cxgx8d > div > ul > li:nth-child(2)");
    let locationText = await (await locationElement.getProperty('textContent')).jsonValue();
    locationText = locationText.replace("Location:", "").trim();
    const location = locationText.split(",")[0]; // Extracting only the city part
    console.log("Location:", location);

    const yearElement = await page.$("#MainContent > div.css-cxgx8d > div > ul > li:nth-child(6)");
    let year = await (await yearElement.getProperty('textContent')).jsonValue();
    year = year.replace("Founded in", "").trim();
    console.log("Year Founded:", year);

    const revenueElement = await page.$("#MainContent > div.css-cxgx8d > div > ul > li:nth-child(7)");
    let revenue = await (await revenueElement.getProperty('textContent')).jsonValue();
    revenue = revenue.replace("Revenue", "").trim();
    console.log("Revenue:", revenue);

    await page.click("#MainContent > div.css-cxgx8d > div > div:nth-child(4) > span > button");
    await page.waitForSelector("#MainContent > div.css-cxgx8d > div > div:nth-child(4) > span");
    
    const aboutElement = await page.$("#MainContent > div.css-cxgx8d > div > div:nth-child(4) > span");
    let aboutText = await page.evaluate(element => element.innerText, aboutElement);
    aboutText = aboutText.split('\n').filter(line => line.trim() !== ''); 
    const about = aboutText.join('\n');
    console.log("About:", about);

    const mission = await page.$eval("#MainContent > div.css-cxgx8d > div > div:nth-child(5) > span:nth-child(2)", span => span.textContent.trim());
    console.log("Mission:", mission);

    const overviewData = [];
    overviewData.push({
      'Company Name': companyName,
      'Overall Rating': overallRating,
      'Website': website,
      'Location': location,
      'Founded Year': year,
      'Revenue': revenue,
      'About': about,
      'Mission': mission,
    });

    const columnHeader = Object.keys(overviewData[0]);
    const ws = xlsx.utils.json_to_sheet(overviewData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.sheet_add_json(ws, [{}], { header: columnHeader, skipHeader: true, origin: -1 });
    xlsx.utils.book_append_sheet(wb,ws,'Overview')
    xlsx.writeFile(wb, 'Glassdoor_overview.xlsx');

    console.log("File created successfully");

      
  } catch (error) {
      console.error("Error:", error);
  }
  
  await browser.close();
});
