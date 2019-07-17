import Joi from 'joi';

export const signUpOptions = {
  description: 'User sign up',
  tags: ['api', 'auth'],
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
};

export const signInOptions = {
  description: 'User sign in',
  tags: ['api', 'auth'],
  auth: false,
  validate: {
    payload: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
      username: Joi.string(),
    }),
  },
};

export const changeRoleOptions = {
  description: 'Change user role',
  tags: ['api'],
  auth: {
    scope: ['admin'],
  },
  validate: {
    params: Joi.object().keys({
      userId: Joi.number().required(),
    }),
    payload: Joi.object().keys({
      role: Joi.string().valid('admin', 'user').required(),
    }),
  },
};

export const deleteUserOptions = {
  description: 'Delete a User',
  tags: ['api'],
  auth: {
    scope: ['admin'],
  },
  validate: {
    params: Joi.object().keys({
      userId: Joi.number().required(),
    }),
  },
};
