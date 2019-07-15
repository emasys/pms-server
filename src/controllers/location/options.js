import Joi from 'joi';

const locationValidateOption = {
  payload: Joi.object().keys({
    title: Joi.string()
      .trim()
      .required(),
    male: Joi.number(),
    female: Joi.number(),
  }),
};

const modificationValidation = {
  payload: Joi.object().keys({
    title: Joi.string().trim(),
    male: Joi.number(),
    female: Joi.number(),
  }),
};
const deleteValidation = {
  params: Joi.object().keys({
    locationId: Joi.number().required(),
  }),
};
const fetchValidation = {
  query: Joi.object().keys({
    limit: Joi.number().default(20),
    offset: Joi.number().default(0),
  }),
};

export const newLocationOption = {
  description: 'Create Location',
  notes: 'Create main location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: {
    ...locationValidateOption,
  },
};

export const newSubLocationOption = {
  description: 'Create Sub Location',
  notes: 'Create nested location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: {
    ...locationValidateOption,
    params: Joi.object().keys({
      locationId: Joi.number().required(),
    }),
  },
};


export const modifyLocationOption = {
  description: 'Modify Location',
  notes: 'Modify main location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: {
    ...modificationValidation,
    params: Joi.object().keys({
      locationId: Joi.number().required(),
    }),
  },
};

export const modifySubLocationOpt = {
  description: 'Modify sub Location',
  notes: 'Modify nested location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: {
    ...modificationValidation,
    params: Joi.object().keys({
      subLocationId: Joi.number().required(),
    }),
  },
};


export const deleteLocationOption = {
  description: 'Delete Location',
  notes: 'Delete main location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: deleteValidation,
};

export const delSubLocationOpt = {
  description: 'Delete sub Location',
  notes: 'Delete nested location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: deleteValidation,
};


export const fetchLocationOption = {
  description: 'Fetch Location',
  notes: 'Fetch main location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: fetchValidation,
};

export const fetchSubLocationOption = {
  description: 'Fetch Sub Location',
  notes: 'Fetch nested location',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: {
    ...fetchValidation,
    params: Joi.object().keys({
      locationId: Joi.number().required(),
    }),
  },
};
