/* eslint-disable no-undef */
import '@babel/polyfill';
import { expect } from 'chai';
import app from '../src';
import models from '../src/sequelize/models';

let userToken = null;
let adminToken = null;

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
      userToken = result.token;
      expect(result).to.include({ message: "john doe's account successfully created" });
    });
    it('should register an admin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signup',
        payload: {
          email: 'admin@example.com',
          password: 'password',
          username: 'emasys',
          name: 'admin',
        },
      });
      expect(statusCode).to.equal(201);
      adminToken = result.token;
      expect(result).to.include({ message: "admin's account successfully created" });
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
    it('should successfully sign in a registered user with username', async () => {
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
    it('should successfully sign in a registered user with email', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/auth/signin',
        payload: {
          password: 'password',
          email: 'sample@example.com',
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
          username: 'emasysnd',
        },
      });
      expect(statusCode).to.equal(404);
      expect(result).to.include({ message: 'Invalid credentials' });
    });
  });

  describe('User Modification', () => {
    it('should upgrade a user to admin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/user/1',
        headers: { Authorization: `Bearer ${adminToken}` },
        payload: {
          role: 'admin',
        },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.eql({ message: 'Role updated to [admin]' });
    });
    it('should fail to upgrade a user if not an admin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/user/1',
        headers: { Authorization: `Bearer ${userToken}` },
        payload: {
          role: 'admin',
        },
      });
      expect(statusCode).to.equal(403);
      expect(result).to.include({ error: 'Forbidden' });
    });
    it('should fail to delete a user if not an admin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: '/v1/user/1',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(403);
      expect(result).to.include({ error: 'Forbidden' });
    });
    it('should delete a user', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: '/v1/user/1',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({ message: 'User deleted' });
    });
  });
});
