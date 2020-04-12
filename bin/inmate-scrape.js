#!/usr/bin/env node
const JailClient = require('../lib/jails/client');
const CovidClient = require('../lib/covid/client');

(async () => {
    const client = new JailClient();
    const inmates = await client.search();
    console.log(`There are a total ${inmates} in Franklin County jails.`);
})();

(async() => {
    const client = new JailClient();
    const inmates = {
        male: await client.search({gender: 'M'}),
        female: await client.search({gender: 'F'}),
    };
    console.log(`There are ${inmates.male} male inmates and ${inmates.female} female inmates in Franklin County jails.`);
})();

(async() => {
    const client = new CovidClient();
    const cases = await client.get()
    console.log(`There are ${cases.male} male, ${cases.female} female, and ${cases.unknown} unknown sex cases for a total of ${cases.total} total cases of COVID-19 in Franklin County.`);
})();
