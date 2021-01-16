const got = require('got');
const parse = require('csvtojson');

const DatasetURL = 'https://coronavirus.ohio.gov/static/dashboards/COVIDSummaryData.csv';

const getCSVData = async() => {
    const res = await got.stream(DatasetURL);
    return parse().fromStream(res)
}

const sumRows = (data, sex) => {
    return data
        .filter(row => row.Sex === sex)
        .map(row => parseInt(row['Case Count']))
        .reduce((acc, next) => acc + next);
} 

const buildData = async(county, data) => {
    const filteredData = data.filter(row => row.County == county);

    const maleCases = sumRows(filteredData, 'Male');
    const femaleCases = sumRows(filteredData, 'Female');
    const unknownCases = sumRows(filteredData, 'Unknown');

    return {
        male: maleCases,
        female: femaleCases,
        unknown: unknownCases,
        total: maleCases + femaleCases + unknownCases,
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
