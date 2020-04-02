const puppeteer = require('puppeteer');
const bookingPage = require('./booking-page');

const FCCBookingURL = 'https://fcsojmsweb.franklincountyohio.gov/Publicview/';

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(FCCBookingURL);

    await Promise.all([
        page.waitForNavigation(),
        page.click(bookingPage.searchButton)
    ]);

    let inmateRows = await page.$$(bookingPage.tableRow);
    let inmates = await inmateRows.length;

    console.log(`There appears to be ${inmates} total inmates`);

    await browser.close();
})();
