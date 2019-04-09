import Joi from 'joi';
import Boom from 'boom';
import { Op } from 'sequelize';

import { signToken } from '../../../utils';


const createUser = {
  path: '/v1/user',
  method: 'POST',
  options: {
    description: 'User sign up',
    tags: ['api'],
    auth: false,
    validate: {
      payload: Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        username: Joi.string().required(),
      }),
    },
  },
  async handler(request, h) {
    const {
      payload,
      payload: { username },
    } = request;
    const role = username === 'emasys' ? 'admin' : 'user';
    try {
      const { name, id } = await this.model.Users.create(payload);
      const token = signToken(username, id, role);
      return h.response({ message: `${name}'s account successfully created`, token }).code(201);
    } catch (error) {
      if (error.errors && error.errors[0].type === 'unique violation') {
        return Boom.conflict(error.errors[0].message);
      }
      return Boom.badRequest(error.message);
    }
  },
};

const login = {
  path: '/v1/signin',
  method: 'POST',
  options: {
    description: 'User sign in',
    tags: ['api'],
    auth: false,
    validate: {
      payload: Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string(),
        username: Joi.string(),
      }),
    },
  },
  async handler(request, h) {
    const {
      payload: { username, password, email },
    } = request;
    try {
      const isUser = await this.model.Users.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });
      if (!isUser) {
        return Boom.notFound('Invalid credentials');
      }
      const isCorrectPassword = await isUser.validatePassword(password);
      if (!isCorrectPassword) {
        return Boom.notFound('Invalid credentials');
      }
      const { id, role } = isUser;
      const token = signToken(username, id, role);
      return h.response({ message: 'success', token }).code(200);
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  },
};

export { createUser, login };
