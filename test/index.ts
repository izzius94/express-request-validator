import chai from 'chai'
import chaiHttp from 'chai-http'
import app from './server'

chai.use(chaiHttp)
chai.should()

describe('Requests', () => {
    it('Should send the request without errors', (done) => {
        chai.request(app).post('/').send({password: 'Password1%#', password_confirmation: 'Password1%#'}).end((err, res) => {
            res.should.have.status(200)
            done()
        })
    });

    it('Should recieve a 422 error', (done) => {
        chai.request(app).post('/').send({password: 'Password1%#', password_confirmation: 'Password1a%#'}).end((err, res) => {
            res.should.have.status(422)
            done()
        })
    });

    it('Should receive a 401 error', done => {
        chai.request(app).post('/auth').end((err, res) => {
            res.should.have.status(401)
            done()
        })
    })
});
