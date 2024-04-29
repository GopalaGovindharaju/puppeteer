import puppeteer from 'puppeteer';
import xlsx from 'xlsx';
import readline from 'readline';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function map() {
    try {
        rl.question('Enter the Company Name to scrape: ', async (companyName) => {
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
                        const maxScrolls = 50;
                        const distance = 2000; // Amount to scroll per iteration
                        const scrollDelay = 1000; // Delay between each scroll (in milliseconds)
            
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

                    await page.waitForSelector('.Nv2PK.tH5CWc.THOPZb .hfpxzc');
                    const linkes = await page.$('.Nv2PK.tH5CWc.THOPZb .hfpxzc');
                    await linkes.click();
                    await page.waitForSelector('.yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)');
                    const reviewsButton = await page.$('.yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)');
                    await reviewsButton.click();
                    console.log("waiting for reviews");

                    const sort = await page.$('#QA0Szd > div > div > div.w6VYqd > div.bJzME.tTVLSc > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf > div.m6QErb.Pf6ghf.KoSBEe.ecceSd.tLjsW > div.TrU0dc.kdfrQc > button > span > span')
                    await sort.click();
                    const newest = await page.$('#action-menu > div:nth-child(2)')
                    await newest.click();

                    await page.evaluate(() => {
                        return new Promise(resolve => {
                            setTimeout(resolve, 4000); // Wait for 2000 milliseconds (2 seconds)
                        });
                      });

                    await autoScroll(page, '.m6QErb.DxyBCb.kA9KIf.dS8AEf');
                    await page.waitForSelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf .m6QErb .jftiEf.fontBodyMedium .jJc9Ad')

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
                    const ws = xlsx.utils.json_to_sheet(reviews);
                    xlsx.utils.book_append_sheet(wb, ws);
                    xlsx.writeFile(wb, 'googlemap reviews-ratings-dynami.xlsx');

                } catch (e) {
                    console.error('error: ', e);
                } finally {
                    //await browser.close();
                }
            };

            await scrapeOverallReview(companyName);
            rl.close();
        });

    } catch (error) {
        console.error('Error in map:', error);
    }
}


map()