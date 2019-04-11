/* eslint-disable no-undef */
import '@babel/polyfill';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src';
import models from '../sequelize/models';

// eslint-disable-next-line import/prefer-default-export
export const testResource = {};

describe('test suite for user operations', () => {
  describe('POST /user', () => {
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
    it('should respond with success message', (done) => {
      request(app.server.listener)
        .post('/v1/user')
        .send({
          email: 'sample@example.com',
          password: 'password',
          username: 'emasys',
          name: 'john doe',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          testResource.token = res.body.token;
          if (!err) {
            expect(res.body).to.include({ message: "john doe's account successfully created" });
          }
          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should respond with success message', (done) => {
      request(app.server.listener)
        .post('/v1/signin')
        .send({
          username: 'emasys',
          password: 'password',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: 'success' });
          }
          done();
        });
    });
    it('should respond with invalid credentials', (done) => {
      request(app.server.listener)
        .post('/v1/signin')
        .send({
          username: 'johndoe',
          password: 'password',
        })
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: 'Invalid credentials' });
          }
          done();
        });
    });
  });
});
