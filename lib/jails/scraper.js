const puppeteer = require('puppeteer');
const {BookingPage, genders} = require('./page');

const setup = async() => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    return new BookingPage(page);
}

const scrapeTotal = async () => {
    const bp = await setup()

    await bp.open();
    await bp.search()
    const inmates = await bp.countInmates();
    await bp.page.browser().close();

    return inmates;
}

const scrapeByGender = async () => {
    const bp = await setup()

    await bp.open();
    await bp.search({gender: genders.male});
    const maleInmates = await bp.countInmates();
    await bp.search({gender: genders.female});
    const femaleInmates = await bp.countInmates();

    await bp.page.browser().close();

    return {
        male: maleInmates,
        female: femaleInmates
    };
}

module.exports = {scrapeTotal, scrapeByGender};
