const { BASE_URL, expect } = require('./00.setup');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Proizvođači API', () => {
    let testId;
    const testData = {
        naziv: 'Test Proizvođač',
        kontakt_osoba: 'Ivan Testni',
        email: 'test@proizvodac.com',
        telefon: '091 123 4567',
        web: 'www.test-proizvodac.com',
    };

    describe('POST /proizvodaci (admin)', () => {
        it('treba kreirati novog proizvođača', (done) => {
            chai.request(BASE_URL)
                .post('/proizvodaci')
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

    describe('GET /proizvodaci', () => {
        it('treba dohvatiti sve proizvođače', (done) => {
            chai.request(BASE_URL)
                .get('/proizvodaci')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /proizvodaci/simple', () => {
        it('treba dohvatiti jednostavnu listu za dropdown', (done) => {
            chai.request(BASE_URL)
                .get('/proizvodaci/simple')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
});