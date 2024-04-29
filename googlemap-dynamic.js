import puppeteer from 'puppeteer';
import xlsx from 'xlsx';
import fs from 'fs';

const app = express();

async function map() {
    try {
        const companyName = 'Quess'
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();

            const waitForSelector = async (selector) => {
                await page.waitForSelector(selector);
                console.log("Element is loading");
            };

            const autoScroll = async (page, selector) => {
                console.log("autoScroll");
                try {
                    await page.evaluate(async (selector) => {
                        const container = document.querySelector(selector);
                        if (!container) {
                            console.error("Container with selector '${selector}' not found.");
                            return;
                        }
            
                        let totalHeight = 0;
                        let lastScrollTop = 0;
                        const distance = 2000; // Amount to scroll per iteration
                        const scrollDelay = 1700; // Delay between each scroll (in milliseconds)
            
                        while (true) {
                            // Scroll down
                            container.scrollTop += distance;
            
                            // Give time for new content to load
                            await new Promise(resolve => setTimeout(resolve, scrollDelay));
            
                            // Check the new height
                            totalHeight = container.scrollHeight;
            
                            // Check if we have reached the bottom of the container
                            const currentScrollTop = container.scrollTop;
                            if (currentScrollTop === lastScrollTop) {
                                // If the scroll position has not changed, we've reached the bottom
                                break;
                            }
            
                            // Update the last scroll position
                            lastScrollTop = currentScrollTop;
                        }
                    }, selector);
                } catch (error) {
                    console.error('Error in autoScroll:', error);
                }
            };

            const scrapeOverallReview = async (companyName) => {
                try {
                    await page.goto("https://www.google.com/maps/@11.0493696,77.0585192,14z?entry=ttu");
                    await waitForSelector("#searchboxinput");

                    if (!companyName) {
                        console.error("Company name is undefined.");
                        return;
                    }

                    await page.type('#searchboxinput', companyName); // Enter the company name in the search input
                    await page.keyboard.press('Enter'); // Press Enter to initiate the search

                    await page
                      .waitForSelector(".Nv2PK.tH5CWc.THOPZb .hfpxzc", {
                        timeout: 5000,
                      })
                      .then(async () => {
                        const links = await page.$(
                          ".Nv2PK.tH5CWc.THOPZb .hfpxzc"
                        );
                        if (links) {
                          await links.click();
                          console.log("Link clicked successfully");
                        } else {
                          console.log(
                            "Selector found, but no element matched."
                          );
                        }
                      })
                      .catch(() => {
                        console.log(
                          "Selector not found or timeout occurred. Skipping the link click."
                        );
                      });

                    await page.waitForSelector('.yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)');
                    const reviewsButton = await page.$('.yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)');
                    await reviewsButton.click();
                    console.log("waiting for reviews");

                    //Ratings Scraping
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

                    //Reviews Scraping

                    await page.waitForSelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf')
                    const sort = await page.$('#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.m6QErb.Pf6ghf.KoSBEe.ecceSd.tLjsW > div.TrU0dc.kdfrQc > button > span > span')
                    await sort.click();
                    const newest = await page.$('#action-menu > div:nth-child(2)')
                    await newest.click();
                    
                    await page.waitForSelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf .m6QErb .jftiEf.fontBodyMedium .jJc9Ad')
                    await autoScroll(page, '.m6QErb.DxyBCb.kA9KIf.dS8AEf');

                    const reviews = await page.$$eval('.m6QErb.DxyBCb.kA9KIf.dS8AEf .m6QErb .jftiEf.fontBodyMedium .jJc9Ad', reviews => reviews.map(review => {
                        const currentDate = new Date().toLocaleDateString();
                        const nameElement = review.querySelector('.GHT2ce.NsCY4 .WNxzHc.qLhwHc .al6Kxe .d4r55');
                        const timePeriodElement = review.querySelector('.GHT2ce .DU9Pgb .rsqaWe');
                        const contentElement = review.querySelector('.MyEned .wiI7pd');
                        const ratingElement = review.querySelector('.DU9Pgb .kvMYJc');

                        const rating = ratingElement ? ratingElement.getAttribute('aria-label') : '';
                        return {
                            Date_of_scrapping: currentDate,
                            Name: nameElement ? nameElement.textContent.trim() : '',
                            Timeperiod: timePeriodElement ? timePeriodElement.textContent.trim() : '',
                            Ratings: rating ? rating.trim() : '',
                            review: contentElement ? contentElement.textContent.trim() : ''
                        };
                    }));

                    console.log(reviews);

                    console.log('done');

                    const wb = xlsx.utils.book_new();

                    const companyReview = xlsx.utils.json_to_sheet(reviews);
                    xlsx.utils.book_append_sheet(wb, companyReview, 'Reviews');

                    const OverallRatings = xlsx.utils.json_to_sheet(ratings_data);
                    xlsx.utils.book_append_sheet(wb, OverallRatings, 'Overall Ratings');

                    const excelData = xlsx.write(wb, {bookType:'xlsx', type:'buffer' });
                    fs.writeFileSync('GoogleMap-overalldata.xlsx', excelData);

                    console.log('Excel file created successfully!')

                } catch (e) {
                    console.error('error: ', e);
                } finally {
                    await browser.close();
                }
            };

            await scrapeOverallReview(companyName);

    } catch (error) {
        console.error('Error in map:', error);
    }
}

app.get('/download-googlemapexcel', async(req, res) => {
    const companyName = req.query.companyName;

    try{
        const filePath = await map();
        res.download(filePath);
    }
    catch(error){
        console.error('Error scraping google data:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servier is running on port ${PORT}`);
});