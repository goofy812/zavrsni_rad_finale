const { BASE_URL, expect } = require('./00.setup');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Kategorije API', () => {
    let testId;
    const testData = {
        naziv: 'Test Kategorija',
        opis: 'Test opis kategorije',
        redoslijed: 99,
    };

    describe('POST /kategorije (admin)', () => {
        it('treba kreirati novu kategoriju', (done) => {
            chai.request(BASE_URL)
                .post('/kategorije')
                .set('Authorization', 'Bearer admin_token')
                .send(testData)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('success', true);
                    testId = res.body.id;
                    done();
                });
        });
    });

    describe('GET /kategorije', () => {
        it('treba dohvatiti sve kategorije', (done) => {
            chai.request(BASE_URL)
                .get('/kategorije')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /kategorije/glavne', () => {
        it('treba dohvatiti glavne kategorije', (done) => {
            chai.request(BASE_URL)
                .get('/kategorije/glavne')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
});