import Joi from 'joi';
import LocationOps from './services';

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
        title: Joi.string().required(),
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
        title: Joi.string().required(),
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

const addResidents = {
  path: '/v1/location/{locationId}/add-residents',
  method: 'POST',
  options: {
    description: 'Add residents',
    notes: 'Add new residents',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      payload: Joi.object().keys({
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
    const location = new LocationOps(this.model, 'Residents', h);
    const data = { ...payload, modifiedBy: userId, locationId };
    return location.create(data);
  },
};

const addSubResidents = {
  path: '/v1/location/sub/{subLocationId}/add-residents',
  method: 'POST',
  options: {
    description: 'Add residents',
    notes: 'Add new residents',
    tags: ['api'],
    auth: {
      scope: ['user', 'admin'],
    },
    validate: {
      payload: Joi.object().keys({
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
      payload,
      params: { subLocationId },
      auth: {
        credentials: { userId },
      },
    } = request;
    const location = new LocationOps(this.model, 'Residents', h);
    const data = { ...payload, modifiedBy: userId, subLocationId };
    return location.create(data);
  },
};

export {
  createLocation, createSubLocation, addResidents, addSubResidents,
};
