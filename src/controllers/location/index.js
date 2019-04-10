import Joi from 'joi';
import LocationOps from '../services';

const createLocation = {
  path: '/v1/location',
  method: 'POST',
  options: {
    description: 'Create Location',
    notes: 'Create main location',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      payload: Joi.object().keys({
        title: Joi.string()
          .trim()
          .required(),
        male: Joi.number(),
        female: Joi.number(),
      }),
    },
  },
  async handler(request, h) {
    const location = new LocationOps(this.model, 'Locations', h);
    const {
      payload,
      auth: {
        credentials: { userId },
      },
    } = request;
    const data = { ...payload, userId };
    return location.create(data);
  },
};

const createSubLocation = {
  path: '/v1/location/{locationId}',
  method: 'POST',
  options: {
    description: 'Create Sub Location',
    notes: 'Create nested location',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      payload: Joi.object().keys({
        title: Joi.string()
          .trim()
          .required(),
        male: Joi.number(),
        female: Joi.number(),
      }),
      params: Joi.object().keys({
        locationId: Joi.number().required(),
      }),
    },
  },
  async handler(request, h) {
    const {
      payload,
      params: { locationId },
      auth: {
        credentials: { userId },
      },
    } = request;
    const location = new LocationOps(this.model, 'SubLocations', h);
    const data = { ...payload, userId, locationId };
    return location.create(data);
  },
};

const modifyLocation = {
  path: '/v1/location/{locationId}',
  method: 'PUT',
  options: {
    description: 'Modify Location',
    notes: 'Modify main location',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      payload: Joi.object().keys({
        title: Joi.string().trim(),
        male: Joi.number(),
        female: Joi.number(),
      }),
      params: Joi.object().keys({
        locationId: Joi.number().required(),
      }),
    },
  },
  async handler(request, h) {
    const {
      payload: { title, male, female },
      params: { locationId },
      auth: {
        credentials: { userId, role },
      },
    } = request;
    const location = new LocationOps(this.model, 'Locations', h);
    const { data, criteria } = location.prepareForDb(role, title, male, female, locationId, userId);

    return location.update(data, criteria);
  },
};

const fetchMainLocation = {
  path: '/v1/location',
  method: 'GET',
  options: {
    description: 'Fetch Location',
    notes: 'Fetch main location',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      query: Joi.object().keys({
        limit: Joi.number().default(20),
        offset: Joi.number().default(0),
      }),
    },
  },
  async handler(request, h) {
    const {
      query: { limit, offset },
    } = request;
    const location = new LocationOps(this.model, 'Locations', h);
    return location.fetch(limit, offset);
  },
};
const fetchSubLocation = {
  path: '/v1/location/{locationId}',
  method: 'GET',
  options: {
    description: 'Fetch Sub Location',
    notes: 'Fetch nested location',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      query: Joi.object().keys({
        limit: Joi.number().default(20),
        offset: Joi.number().default(0),
      }),
      params: Joi.object().keys({
        locationId: Joi.number().required(),
      }),
    },
  },
  async handler(request, h) {
    const {
      query: { limit, offset },
      params: { locationId },
    } = request;
    const location = new LocationOps(this.model, 'SubLocations', h);
    return location.fetch(limit, offset, locationId);
  },
};

const modifySubLocation = {
  path: '/v1/sub-location/{subLocationId}',
  method: 'PUT',
  options: {
    description: 'Modify sub Location',
    notes: 'Modify nested location',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      payload: Joi.object().keys({
        title: Joi.string().trim(),
        male: Joi.number(),
        female: Joi.number(),
      }),
      params: Joi.object().keys({
        subLocationId: Joi.number().required(),
      }),
    },
  },
  async handler(request, h) {
    const {
      payload: { title, male, female },
      params: { subLocationId },
      auth: {
        credentials: { userId, role },
      },
    } = request;

    const location = new LocationOps(this.model, 'SubLocations', h);
    const { data, criteria } = location.prepareForDb(
      role,
      title,
      male,
      female,
      subLocationId,
      userId,
    );
    return location.update(data, criteria);
  },
};

export {
  createLocation,
  createSubLocation,
  modifyLocation,
  modifySubLocation,
  fetchSubLocation,
  fetchMainLocation,
};
