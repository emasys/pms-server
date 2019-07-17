import Joi from 'joi';

export const signUpOptions = {
  description: 'User sign up',
  notes: 'Register a new user',
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
  notes: 'User can login with either email or username',
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
  notes: 'Only an admin can change the role of a user',
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
  notes: 'Only an admin can delete a user',
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
