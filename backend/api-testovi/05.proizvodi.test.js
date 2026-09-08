const { BASE_URL, expect } = require('./00.setup');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Proizvodi API', () => {
    let testId;
    const testData = {
        naziv: 'Test Proizvod',
        sifra: 'TEST-001',
        cijena: 19.99,
        jedinica_mjere: 'kom',
        id_kategorija: 1,
        id_proizvodac: 1,
    };

    describe('GET /proizvodi', () => {
        it('treba dohvatiti sve proizvode', (done) => {
            chai.request(BASE_URL)
                .get('/proizvodi')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('data');
                    done();
                });
        });
    });

    describe('GET /proizvodi s filterima', () => {
        it('treba filtrirati proizvode po kategoriji', (done) => {
            chai.request(BASE_URL)
                .get('/proizvodi?kategorija=1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('treba filtrirati proizvode po pretrazi', (done) => {
            chai.request(BASE_URL)
                .get('/proizvodi?pretraga=stiropor')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /index-summary', () => {
        it('treba dohvatiti podatke za početnu stranicu', (done) => {
            chai.request(BASE_URL)
                .get('/index-summary')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('broj_proizvoda');
                    expect(res.body).to.have.property('broj_korisnika');
                    done();
                });
        });
    });
});