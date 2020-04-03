const puppeteer = require('puppeteer');
const BookingPage = require('./page');

module.exports.scrape = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const bp = new BookingPage(page);

    await bp.open();
    await bp.search()
    const inmates = await bp.countInmates();

    console.log(`There appears to be ${inmates} total inmates`);

    await browser.close();
}
