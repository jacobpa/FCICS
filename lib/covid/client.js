const got = require('got');
const parse = require('csvtojson');

const DatasetURL = 'https://coronavirus.ohio.gov/static/COVIDSummaryData.csv';

const getCSVData = async() => {
    const res = await got.stream(DatasetURL);
    return parse().fromStream(res)
}

const buildData = async(county, data) => {
    const filteredData = data.filter(row => row.County == county);

    const maleCases = filteredData
        .filter(row => row.Sex === 'Male')
        .map(row => parseInt(row['Case Count']))
        .reduce((acc, next) => acc + next);
    const femaleCases = filteredData
        .filter(row => row.Sex === 'Female')
        .map(row => parseInt(row['Case Count']))
        .reduce((acc, next) => acc + next);

    return {
        male: maleCases,
        female: femaleCases,
        total: maleCases + femaleCases
    }
}

class CovidClient {
    constructor(opts = {}) {
        const {
            county = 'Franklin'
        } = opts;
        this.county = county;
    }

    async get() {
        const data = await getCSVData();
        return buildData(this.county, data);
    }
}

module.exports = CovidClient;
