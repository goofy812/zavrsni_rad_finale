const { BASE_URL, expect } = require('./00.setup');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Misc API', () => {
    describe('GET /index-summary', () => {
        it('treba dohvatiti statistiku za početnu stranicu', (done) => {
            chai.request(BASE_URL)
                .get('/index-summary')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('broj_proizvoda');
                    expect(res.body).to.have.property('broj_korisnika');
                    expect(res.body).to.have.property('broj_recenzija');
                    done();
                });
        });
    });

    describe('GET /statusi', () => {
        it('treba dohvatiti sve statuse', (done) => {
            chai.request(BASE_URL)
                .get('/statusi')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /app-info', () => {
        it('treba dohvatiti info o aplikaciji', (done) => {
            chai.request(BASE_URL)
                .get('/app-info')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('name', 'TeraBuild');
                    expect(res.body).to.have.property('version');
                    done();
                });
        });
    });
});