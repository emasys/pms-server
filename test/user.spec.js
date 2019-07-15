/* eslint-disable no-undef */
import '@babel/polyfill';
import { expect } from 'chai';
import app from '../src';
import models from '../src/sequelize/models';

// eslint-disable-next-line import/prefer-default-export
export const testResource = {};

describe('test suite for user operations', () => {
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

  describe('User Sign up', () => {
    it('should register a new user', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signup',
        payload: {
          email: 'sample@example.com',
          password: 'password',
          username: 'johnny',
          name: 'john doe',
        },
      });
      expect(statusCode).to.equal(201);
      expect(result).to.include({ message: "john doe's account successfully created" });
    });
    it('should fail to register duplicate users', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signup',
        payload: {
          email: 'sample@example.com',
          password: 'password',
          username: 'johnny',
          name: 'john doe',
        },
      });
      expect(statusCode).to.equal(409);
      expect(result).to.eql({ message: 'User already exist, sign in to continue' });
    });
  });

  describe('User sign in', () => {
    it('should successfully sign in a registered user', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signin',
        payload: {
          password: 'password',
          username: 'johnny',
        },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({ message: 'success' });
    });
    it('should fail to sign in an invalid user', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signin',
        payload: {
          password: 'password',
          username: 'emasys',
        },
      });
      expect(statusCode).to.equal(404);
      expect(result).to.include({ message: 'Invalid credentials' });
    });
  });
});
