#!/usr/bin/env node
const scraper = require('../lib/jails/scraper');
const CovidClient = require('../lib/covid/client');

(async () => {
    const inmates = await scraper.scrapeTotal();
    console.log(`There are a total ${inmates} in Franklin County jails.`);
})();

(async() => {
    const inmatesByGender = await scraper.scrapeByGender();
    console.log(`There are ${inmatesByGender.male} male inmates and ${inmatesByGender.female} female inmates in Franklin County jails.`);
})();

(async() => {
    const client = new CovidClient();
    const cases = await client.get()
    console.log(`There are ${cases.male} male and ${cases.female} female cases for a total of ${cases.total} total cases of COVID-19 in Franklin County.`);
})();
