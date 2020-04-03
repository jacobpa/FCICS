const elements = {
    races: ['A', 'B', 'H', 'I', 'U', 'W'],
    genders: {
        male: 'M',
        female: 'F',
        transgender: 'T',
        unknown: 'U'
    },
    searchButton: 'input#btnSearch',
    genderSelector: 'select#GenderList',
    raceSelector: 'select#RaceList',
    ageInput: 'input#Age',
    statusSelector: 'select#StatusList',  // Disabled input
    firstNameInput: 'input#InmateFirst',
    lastNameInput: 'input#InmateLast',
    
    resultsTable: 'table#Table1',
    tableRow: 'tr.Table',
}

const FCCBookingURL = 'https://fcsojmsweb.franklincountyohio.gov/Publicview/';


class BookingPage {
    constructor(page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(FCCBookingURL);
    }
    
    async search(options = {}) {
        const {
            gender = ''
        } = options;

        await this.page.select(elements.genderSelector, gender);

        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(elements.searchButton)
        ]);
    }

    async countInmates() {
        let inmateRows = await this.page.$$(elements.tableRow);
        return inmateRows.length;
    }
}

module.exports = {BookingPage, genders: elements.genders};