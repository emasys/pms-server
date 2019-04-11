/* eslint-disable no-undef */
import '@babel/polyfill';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src';
import models from '../sequelize/models';

// eslint-disable-next-line import/prefer-default-export
let userToken;

describe('test suite for location operations', () => {
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
    it('should generate a user token', (done) => {
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
          if (!err) {
            userToken = res.body.token;
          }
          done();
        });
    });
  });

  describe('POST /location', () => {
    it('should create a new location', (done) => {
      request(app.server.listener)
        .post('/v1/location')
        .send({
          title: 'lagos',
          male: 24,
          female: 24,
        })
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            expect(res.body.message).to.include({
              id: 1,
              title: 'lagos',
              male: '24',
              female: '24',
              userId: 1,
            });
          }
          done();
        });
    });
    it('should create a new nested location', (done) => {
      request(app.server.listener)
        .post('/v1/location/1')
        .send({
          title: 'ikeja',
          male: 24,
          female: 24,
        })
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            expect(res.body.message).to.include({
              id: 1,
              title: 'ikeja',
              locationId: 1,
              male: '24',
              female: '24',
              userId: 1,
            });
          }
          done();
        });
    });
    it('should modify a location', (done) => {
      request(app.server.listener)
        .put('/v1/location/1')
        .send({
          title: 'Kano',
          male: 242,
          female: 242,
        })
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            expect(res.body.message).to.include({
              id: 1,
              title: 'kano',
              male: '242',
              female: '242',
              userId: 1,
            });
          }
          done();
        });
    });
    it('should modify a nested location', (done) => {
      request(app.server.listener)
        .put('/v1/sub-location/1')
        .send({
          title: 'ikeja',
          male: 500,
          female: 500,
        })
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message: 'record updated',
            });
          }
          done();
        });
    });
    it('should fetch main locations', (done) => {
      request(app.server.listener)
        .get('/v1/location')
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.have.property('data');
            expect(res.body)
              .to.have.property('meta')
              .to.eql({
                total: 1, limit: 20, offset: 0, pages: 1,
              });
            expect(res.body.data).to.have.length(1);
          }
          done();
        });
    });
    it('should fetch nested locations', (done) => {
      request(app.server.listener)
        .get('/v1/location/1')
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.have.property('data');
            expect(res.body)
              .to.have.property('meta')
              .to.eql({
                total: 1, limit: 20, offset: 0, pages: 1,
              });
            expect(res.body.data).to.have.length(1);
          }
          done();
        });
    });
    it('should delete a location', (done) => {
      request(app.server.listener)
        .delete('/v1/location/1')
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message: 'record deleted',
            });
          }
          done();
        });
    });
    it('should delete a nested location', (done) => {
      request(app.server.listener)
        .delete('/v1/sub-location/1')
        .set('Authorization', `bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message: 'record deleted',
            });
          }
          done();
        });
    });
  });
});
