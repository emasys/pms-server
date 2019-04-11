/* eslint-disable no-undef */
import '@babel/polyfill';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import models from '../sequelize/models';

let userToken = null;
describe('test suite for phone numbers generator', () => {
  describe('GET /generate', () => {
    before((done) => {
      models.sequelize
        .sync({ force: true })
        .then(() => {
          done(null);
        })
        .catch((errors) => {
          done(errors);
        });
    });

    it.skip('should generate fresh user token', (done) => {
      request(app.listener)
        .post('/register')
        .send({
          email: 'sample@example.com',
          password: 'password',
          username: 'admin',
          name: 'john doe',
        })
        .end((err, res) => {
          if (!err) {
            userToken = res.body.token;
            expect(res.body).to.include({ message: "john doe's account successfully created" });
          }
          done();
        });
    });
    it.skip('should respond with an error message for unauthenticated user', (done) => {
      request(app.listener)
        .get('/generate')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: 'Missing authentication' });
          }
          done();
        });
    });

    it.skip('should respond with a success message for authenticated user', (done) => {
      request(app.listener)
        .get('/generate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(201, done);
    });
  });
});
