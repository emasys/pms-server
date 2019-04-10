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
      return this.h.response({ message: response }).code(201);
    } catch (error) {
      if (error.errors[0]) {
        return Boom.conflict(error.errors[0].type);
      }
      return Boom.badRequest(error.message);
    }
  }

  async update(data, criteria) {
    try {
      const [response] = await this.model[this.table].update(data, criteria);
      if (response) {
        return { message: 'record updated' };
      }
      throw new Error('either the location id is invalid or you are not authorized to modify this location');
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isChanged(value, key) {
    if (value) {
      return { [key]: value };
    }
    return {};
  }

  prepareForDb(role, title, male, female, id, userId) {
    const isAdmin = role === 'admin';
    const titleChanged = this.isChanged(title, 'title');
    const maleChanged = this.isChanged(male, 'male');
    const femaleChanged = this.isChanged(female, 'female');
    const data = {
      ...titleChanged,
      ...maleChanged,
      ...femaleChanged,
    };

    const criteria = isAdmin ? { where: { id } } : { where: { id, userId } };

    return { data, criteria };
  }
}

export default LocationOps;
