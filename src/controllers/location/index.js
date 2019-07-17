import LocationOps from './services';
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
import { modifyHandler, deleteHandler } from './util';

export const createLocation = {
  path: '/location',
  method: 'POST',
  options: newLocationOption,
  handler(request, h) {
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
  handler(request, h) {
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
  handler(request, h) {
    return modifyHandler(this.model, h, request, 'Locations');
  },
};

export const modifySubLocation = {
  path: '/sub-location/{locationId}',
  method: 'PUT',
  options: modifySubLocationOpt,
  handler(request, h) {
    return modifyHandler(this.model, h, request, 'SubLocations');
  },
};

export const deleteLocation = {
  path: '/location/{locationId}',
  method: 'DELETE',
  options: deleteLocationOption,
  handler(request, h) {
    return deleteHandler(this.model, h, request, 'Locations');
  },
};

export const deleteSubLocation = {
  path: '/sub-location/{locationId}',
  method: 'DELETE',
  options: delSubLocationOpt,
  handler(request, h) {
    return deleteHandler(this.model, h, request, 'SubLocations');
  },
};
export const fetchMainLocation = {
  path: '/location',
  method: 'GET',
  options: fetchLocationOption,
  handler(request, h) {
    const { limit, offset } = request.query;
    const location = new LocationOps(this.model, 'Locations', h);
    return location.fetch(limit, offset);
  },
};

export const fetchSubLocation = {
  path: '/location/{locationId}',
  method: 'GET',
  options: fetchSubLocationOption,
  handler(request, h) {
    const {
      query: { limit, offset },
      params: { locationId },
    } = request;
    const location = new LocationOps(this.model, 'SubLocations', h);
    return location.fetch(limit, offset, locationId);
  },
};
