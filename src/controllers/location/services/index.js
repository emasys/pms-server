import Boom from 'boom';

class LocationOps {
  constructor(model, table, h) {
    this.model = model;
    this.table = table;
    this.h = h;
  }

  handleResponse(message, code) {
    return this.h.response({ message }).code(code);
  }

  async create(data) {
    try {
      const response = await this.model[this.table].create(data);
      return this.handleResponse(response, 201);
    } catch (error) {
      if (error.errors && error.errors[0]) {
        return this.handleResponse('Location already exists', 409);
      }
      return Boom.badRequest(error.message);
    }
  }

  async fetch(limit, offset, locationId = null) {
    const criteria = locationId ? { where: { locationId } } : {};
    try {
      const response = await this.model[this.table].findAndCountAll({
        limit,
        offset,
        ...criteria,
      });
      const residents = response.rows.map((row) => {
        /* istanbul ignore next */
        const male = parseInt(row.dataValues.male, 10) || 0;
        /* istanbul ignore next */
        const female = parseInt(row.dataValues.female, 10) || 0;
        return {
          ...row.dataValues,
          totalResidents: male + female,
        };
      });

      const data = residents;
      const meta = {};
      const total = response.count;
      const computePage = Math.floor(total / limit);
      /* istanbul ignore next */
      const pages = computePage === 0 ? 1 : computePage;
      meta.total = total;
      meta.limit = limit;
      meta.offset = offset;
      meta.pages = pages;
      return { data, meta };
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }

  async update(data, criteria) {
    try {
      const [response] = await this.model[this.table].update(data, criteria);
      if (response) {
        return { message: 'record updated' };
      }
      return this.handleResponse('location not found', 404);
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }

  async delete(criteria) {
    try {
      const response = await this.model[this.table].destroy(criteria);
      if (response) {
        return { message: 'record deleted' };
      }
      return this.handleResponse('location not found', 404);
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

    /* istanbul ignore next */
    const criteria = isAdmin ? { where: { id } } : { where: { id, userId } };

    return { data, criteria };
  }
}

export default LocationOps;
