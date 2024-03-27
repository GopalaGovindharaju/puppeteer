const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const readline = require('readline');

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

            const autoScroll = async (page) => {
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

                    await autoScroll(page);

                    await page.waitForSelector('.k7jAl.miFGmb.lJ3Kh.w6Uhzf .aIFcqe .m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd .Nv2PK.tH5CWc.THOPZb .hfpxzc');
                    const linkes = await page.$('.k7jAl.miFGmb.lJ3Kh.w6Uhzf .aIFcqe .m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd .Nv2PK.tH5CWc.THOPZb .hfpxzc');
                    await linkes.click();
                    await page.waitForSelector('.yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)');
                    const reviewsButton = await page.$('.yx21af.lLU2pe.XDi3Bc .RWPxGd .hh2c6:nth-child(2)');
                    await reviewsButton.click();

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
                    xlsx.writeFile(wb, 'googlemap reviews-ratings-dynamic.xlsx');

                } catch (e) {
                    console.error('error: ', e);
                } finally {
                    await browser.close();
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