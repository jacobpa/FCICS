const got = require('got');
const cheerio = require('cheerio');

class SearchParameterException extends Error {
    constructor(given, allowed, ...params) {
        super(params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SearchParameterException)
        }
        this.message = `Parameter ${given} is not one of ${allowed}`;
        this.name = 'SearchParameterException';
    }
}

class JailClient {
    constructor(opts = {}) {
        const {
            baseUrl = 'https://fcsojmsweb.franklincountyohio.gov',
            path = '/Publicview/'
        } = opts;

        this.baseURL = baseUrl;
        this.path = path;
        this.isSetup = false;
    }

    validParams = {
        genders: ['M', 'F', 'T', 'U', ''],
        races: ['A', 'B', 'H', 'I', 'U', 'W', ''],
    };

    async setup() {
        const request = await got(this.path, {
            prefixUrl: this.baseURL,
        });

        this.path = request.req.path;
        this.isSetup = true;
    }

    async search(opts = {}) {
        const {
            race = '',
            gender = '',
        } = opts;

        if (!this.isSetup) await this.setup();
        if (!this.validParams.genders.includes(gender)) throw new SearchParameterException(gender, this.validParams.genders)

        const newRes = await got(this.path, {
            method: 'POST',
            prefixUrl: this.baseURL,
            form: {
                '__EVENTTARGET': '',
                '__EVENTARGUMENT': '',
                '__VIEWSTATE': '/wEPDwUKMjA4Njc1NTE3Ng9kFgICAQ9kFgoCAQ8QDxYCHgtfIURhdGFCb3VuZGdkZBYBZmQCBQ8QDxYIHgpEYXRhTWVtYmVyBQ90YmxJbm1hdGVTdGF0dXMeDURhdGFUZXh0RmllbGQFC0Rlc2NyaXB0aW9uHg5EYXRhVmFsdWVGaWVsZAULRGVzY3JpcHRpb24fAGdkEBUOAANGRUQDRkVMA0pVVgNNSUwETUlTRARTRkVEBFNGRUwEU0pVVgRTTUlTBVNWRkVEBVNWRkVMBFZGRUQEVkZFTBUOAANGRUQDRkVMA0pVVgNNSUwETUlTRARTRkVEBFNGRUwEU0pVVgRTTUlTBVNWRkVEBVNWRkVMBFZGRUQEVkZFTBQrAw5nZ2dnZ2dnZ2dnZ2dnZxYBZmQCBw8QDxYIHwEFB3RibFJhY2UfAgUIUmFjZURlc2MfAwUIUmFjZUNvZGUfAGdkEBUHABlBU0lBTiAtIFBBQ0lGSUMgSVNMQU5ERVJTBUJMQUNLCEhJU1BBTklDD0FNRVJJQ0FOIElORElBTgdVTktOT1dOBVdISVRFFQcAAUEBQgFIAUkBVQFXFCsDB2dnZ2dnZ2dkZAIXDxAPFggfAQUJdGJsR2VuZGVyHwIFCkdlbmRlckRlc2MfAwUKR2VuZGVyQ29kZR8AZ2QQFQUABkZlbWFsZQRNYWxlC1RyYW5zZ2VuZGVyB1Vua25vd24VBQABRgFNAVQBVRQrAwVnZ2dnZ2RkAh8PPCsACwEADxYIHghEYXRhS2V5cxYAHgtfIUl0ZW1Db3VudAL/////Dx4VXyFEYXRhU291cmNlSXRlbUNvdW50Av////8PHglQYWdlQ291bnRmZGRkgJoLqeeu6xcILdi9GQ4kxC1iUYYPtNwwK/3KfTk6hnY=',
                '__VIEWSTATEGENERATOR': '2E3D538C',
                '__EVENTVALIDATION': '/wEdACFNGsBaKfkmqlK+lX8Lq8oxnGux+8NJLBn1mgFgXojpEs3BYG7yrzZhD8lPhXW0R1K/IgC7a2nDZUmOm//p3CvWLdVibaIN9/6IRkMTpJWq3aAbGb+NfY4c2wf9D6p0H81bsVUHh4zSjrzWmynv9A/UmfpGOVAUYbsf95fywHfFl1VknBnFXm7Jlo7Jb5Ty4Mgc2rC0T5f2Oh4J219/p/9LQIvz0vCoDnUejaKEtDEOpR3ZEfXRoD+UqttwySW/TKDU6LSlUMVrayAEkUK1EpiiBUqWyLonU5AgLyHZvOtT4K2Ozk6lkXLhv6zIxz5ka4nVKoPvIm8QYlhJllw+uHPAxOVABOs0spEJmUpFHcwzNl3dB1MsGB32InJN0hvS1M2Y5V8GRRLbvtJlSvpH5esbYZEX7+cDhv79W71ukHBFAnrdZPVoLGdRkbvkcCXWXfUxhplw51zgLdV5yaqM/9qZQyvL9/FEd2+nGnxeMgPYBBDUlpz3hb5bNHTPpawoyGmTDDUiuu1P28Y9l9QpgR7gkRDyCeuVdMgyCYrgnKA2krgpMvSl6eXPOAu/c8DLBpeYwNr26mjAuYFyr2R5QL1Dud9x9YBESoFmD9MLGA2lwl4PHaDy9VRKSY4Z77VQJ6CDSL3O4APt5rKaFaMD4MOsPPpM9tna6QFSGqogYEs3AY7U3Vc0WZ+wxclqyPFfzmOSL8WB7QHP/BukOzN3XRK8WXKGHTWvrUylag+EYKtHEg==',
                GenderList: gender,
                RaceList: race,
                btnSearch: 'Search'
            }
        });
            
        const $ = cheerio.load(newRes.body);
        return $('tr.Table').length;
    }
}

module.exports = JailClient;
