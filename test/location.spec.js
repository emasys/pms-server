/* eslint-disable no-undef */
import '@babel/polyfill';
import { expect } from 'chai';
import app from '../src';
import models from '../src/sequelize/models';

let userToken;
let adminToken;

describe('test suite for location operations', () => {
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
  after(() => {
    app.server.stop();
  });
  describe('Add user', () => {
    it('should generate an admin token', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signup',
        payload: {
          email: 'sample@example.com',
          password: 'password',
          username: 'emasys',
          name: 'john doe',
        },
      });
      adminToken = result.token;
      expect(statusCode).to.equal(201);
    });
    it('should generate a user token', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signup',
        payload: {
          email: 'sample@example2.com',
          password: 'password',
          username: 'john',
          name: 'john doe',
        },
      });
      userToken = result.token;
      expect(statusCode).to.equal(201);
    });
  });

  describe('Create locations', () => {
    it('should create a new location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/location',
        payload: {
          title: 'lagos',
          male: 24,
          female: 24,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(201);
      expect(result.message.dataValues).to.include({
        title: 'lagos',
        userId: 2,
      });
    });
    it('should fail to create duplicate locations', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/location',
        payload: {
          title: 'lagos',
          male: 240000,
          female: 240000,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(409);
      expect(result).to.eql({
        message: 'Location already exists',
      });
    });
    it('should create a new nested location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/location/1',
        payload: {
          title: 'ikeja',
          male: 10,
          female: 13,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(201);
      expect(result.message.dataValues).to.include({
        title: 'ikeja',
        locationId: 1,
        userId: 2,
      });
    });
  });

  describe('Modify locations', () => {
    it('should modify a location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/location/1',
        payload: {
          title: 'lagos state',
          male: 24000,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.eql({
        message: 'record updated',
      });
    });
    it('should modify a non-existent location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/location/10',
        payload: {
          title: 'random state',
          male: 24000,
          female: 240000,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(404);
      expect(result).to.eql({
        message: 'location not found',
      });
    });
    it('should modify a nested location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/sub-location/1',
        payload: {
          title: 'ikeja lga',
          male: 500,
          female: 500,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.eql({
        message: 'record updated',
      });
    });
    it('should fail to modify a nested location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/sub-location/ikeja',
        payload: {
          title: 'ikeja lga',
          male: 500,
          female: 500,
        },
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message: 'child "locationId" fails because ["locationId" must be a number]',
      });
    });
  });

  describe('Fetch locations', () => {
    it('should fetch main locations', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: '/v1/location?limit=5',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result.data).to.have.length(1);
      expect(result)
        .to.have.property('meta')
        .to.eql({
          total: 1,
          limit: 5,
          offset: 0,
          pages: 1,
        });
    });

    it('should fetch nested locations', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: '/v1/location/1?limit=10',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result.data).to.have.length(1);
      expect(result)
        .to.have.property('meta')
        .to.eql({
          total: 1,
          limit: 10,
          offset: 0,
          pages: 1,
        });
    });
  });

  describe('Delete location', () => {
    it('should delete a nested location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: '/v1/sub-location/1',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.eql({ message: 'record deleted' });
    });
    it('should delete a location', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: '/v1/location/1',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.eql({ message: 'record deleted' });
    });
  });
});
