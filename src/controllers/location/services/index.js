import Boom from 'boom';

class LocationOps {
  constructor(model, table, h) {
    this.model = model;
    this.table = table;
    this.h = h;
  }

  async create(data) {
    try {
      const response = await this.model[this.table].create(data);
      return this.h.response({ response }).code(201);
    } catch (error) {
      return Boom.badRequest(error);
    }
  }
}

export default LocationOps;
