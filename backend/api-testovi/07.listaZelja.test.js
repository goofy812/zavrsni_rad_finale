const { BASE_URL, expect } = require('./00.setup');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Lista želja API', () => {
    let testUserId = 2; // Testni korisnik
    let testProductId = 1;

    describe('POST /lista-zelja (auth)', () => {
        it('treba dodati proizvod na listu', (done) => {
            chai.request(BASE_URL)
                .post('/lista-zelja')
                .set('Authorization', 'Bearer user_token')
                .send({ id_proizvod: testProductId })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('success', true);
                    done();
                });
        });
    });

    describe('GET /lista-zelja (auth)', () => {
        it('treba dohvatiti korisnikovu listu', (done) => {
            chai.request(BASE_URL)
                .get('/lista-zelja')
                .set('Authorization', 'Bearer user_token')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('data');
                    done();
                });
        });
    });

    describe('GET /lista-zelja/check/:id (auth)', () => {
        it('treba provjeriti je li proizvod na listi', (done) => {
            chai.request(BASE_URL)
                .get(`/lista-zelja/check/${testProductId}`)
                .set('Authorization', 'Bearer user_token')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('exists');
                    done();
                });
        });
    });
});