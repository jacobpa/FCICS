#!/usr/bin/env node
const scraper = require('../lib/jails/scraper');

(async () => {
    const inmates = await scraper.scrapeTotal();
    console.log(`There are a total ${inmates} in Franklin County jails.`);
})();

(async() => {
    const inmatesByGender = await scraper.scrapeByGender();
    console.log(`There are ${inmatesByGender.male} male inmates and ${inmatesByGender.female} female inmates in Franklin County jails.`);
})();
