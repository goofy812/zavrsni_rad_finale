const { BASE_URL, expect } = require('./00.setup');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Korisnici API', () => {
    let testUserId;
    const testUser = {
        ime: 'Test',
        prezime: 'Korisnik',
        email: 'test@terabuild.com',
        lozinka: 'test123',
        telefon: '091 123 4567',
    };

    describe('POST /registracija', () => {
        it('treba registrirati novog korisnika', (done) => {
            chai.request(BASE_URL)
                .post('/registracija')
                .send(testUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('success', true);
                    done();
                });
        });
    });

    describe('POST /prijava', () => {
        it('treba prijaviti korisnika', (done) => {
            chai.request(BASE_URL)
                .post('/prijava')
                .send({
                    email: testUser.email,
                    lozinka: testUser.lozinka,
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success', true);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });
    });
});