const got = require('got');
const parse = require('csvtojson');

const DatasetURL = 'https://coronavirus.ohio.gov/static/COVIDSummaryData.csv';

class CovidData {
    constructor() {
        this.data = [];
    }

    async getCSVData() {
        const res = await got.stream(DatasetURL);
        const parsed = await parse().fromStream(res)
        this.data = parsed.filter(row => row.County == 'Franklin');
    }

    async buildData() {
        if (this.data.length === 0) await this.getCSVData();

        const maleCases = this.data
            .filter(row => row.Sex === 'Male')
            .map(row => parseInt(row['Case Count']))
            .reduce((acc, next) => acc + next);
        const femaleCases = this.data
            .filter(row => row.Sex === 'Female')
            .map(row => parseInt(row['Case Count']))
            .reduce((acc, next) => acc + next);

        return {
            male: maleCases,
            female: femaleCases,
            total: maleCases + femaleCases
        }
    }

}

module.exports = CovidData;
