import LocationOps from '../services';
import {
  newLocationOption,
  newSubLocationOption,
  modifyLocationOption,
  modifySubLocationOpt,
  deleteLocationOption,
  delSubLocationOpt,
  fetchLocationOption,
  fetchSubLocationOption,
} from './options';

export const createLocation = {
  path: '/location',
  method: 'POST',
  options: newLocationOption,
  async handler(request, h) {
    const location = new LocationOps(this.model, 'Locations', h);
    const { payload } = request;
    const { userId } = request.auth.credentials;
    const data = { ...payload, userId };
    return location.create(data);
  },
};

export const createSubLocation = {
  path: '/location/{locationId}',
  method: 'POST',
  options: newSubLocationOption,
  async handler(request, h) {
    const { payload } = request;
    const { locationId } = request.params;
    const { userId } = request.auth.credentials;
    const location = new LocationOps(this.model, 'SubLocations', h);
    const data = { ...payload, userId, locationId };
    return location.create(data);
  },
};

export const modifyLocation = {
  path: '/location/{locationId}',
  method: 'PUT',
  options: modifyLocationOption,
  async handler(request, h) {
    const {
      payload: { title, male, female },
      params: { locationId },
      auth: {
        credentials: { userId, role },
      },
    } = request;
    const location = new LocationOps(this.model, 'Locations', h);
    const { data, criteria } = location.prepareForDb(
      role,
      title,
      male,
      female,
      locationId,
      userId,
    );

    return location.update(data, criteria);
  },
};

export const modifySubLocation = {
  path: '/sub-location/{subLocationId}',
  method: 'PUT',
  options: modifySubLocationOpt,
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

export const deleteLocation = {
  path: '/location/{locationId}',
  method: 'DELETE',
  options: deleteLocationOption,
  async handler(request, h) {
    const { locationId } = request.params;
    const { userId, role } = request.auth.credentials;
    const isAdmin = role === 'admin';
    const location = new LocationOps(this.model, 'Locations', h);
    const criteria = isAdmin
      ? { where: { id: locationId } }
      : { where: { id: locationId, userId } };
    return location.delete(criteria);
  },
};

export const deleteSubLocation = {
  path: '/sub-location/{locationId}',
  method: 'DELETE',
  options: delSubLocationOpt,
  async handler(request, h) {
    const {
      params: { locationId },
      auth: {
        credentials: { userId, role },
      },
    } = request;
    const isAdmin = role === 'admin';
    const location = new LocationOps(this.model, 'SubLocations', h);
    const criteria = isAdmin
      ? { where: { id: locationId } }
      : { where: { id: locationId, userId } };
    return location.delete(criteria);
  },
};
export const fetchMainLocation = {
  path: '/location',
  method: 'GET',
  options: fetchLocationOption,
  async handler(request, h) {
    const {
      query: { limit, offset },
    } = request;
    const location = new LocationOps(this.model, 'Locations', h);
    return location.fetch(limit, offset);
  },
};

export const fetchSubLocation = {
  path: '/location/{locationId}',
  method: 'GET',
  options: fetchSubLocationOption,
  async handler(request, h) {
    const {
      query: { limit, offset },
      params: { locationId },
    } = request;
    const location = new LocationOps(this.model, 'SubLocations', h);
    return location.fetch(limit, offset, locationId);
  },
};
