import { Op } from 'sequelize';
import { signToken } from '../../../../utils';

class Auth {
  constructor(model, h) {
    this.model = model;
    this.h = h;
  }

  handleResponse(message, code, token = null) {
    const userToken = token ? { token } : {};
    return this.h
      .response({
        message,
        ...userToken,
      })
      .code(code);
  }

  async register(payload) {
    try {
      const { name, id } = await this.model.Users.create(payload);
      const token = signToken(id, payload.role);
      return this.handleResponse(
        `${name}'s account successfully created`,
        201,
        token,
      );
    } catch (error) {
      return this.handleResponse(
        'User already exist, sign in to continue',
        409,
      );
    }
  }

  async login({ email, username, password }) {
    const isUser = await this.model.Users.findOne({
      where: {
        [Op.or]: [
          { email: email || '' },
          { username: username || '' },
        ],
      },
    });
    try {
      const isValid = await this.validateUser(isUser, password);
      if (!isValid) {
        return this.handleResponse('Invalid credentials', 404);
      }
      const { id, role } = isUser;
      const token = signToken(id, role);
      return this.handleResponse('success', 200, token);
    } catch (error) {
      return this.handleResponse(error.message, 400);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async validateUser(isUser, password) {
    if (!isUser) {
      return false;
    }
    const isCorrectPassword = await isUser.validatePassword(password);
    if (!isCorrectPassword) {
      return false;
    }
    return true;
  }

  async changeRole(id, role) {
    try {
      const [isUpdated] = await this.model.Users.update(
        { role },
        { where: { id } },
      );
      if (isUpdated) {
        return this.handleResponse(`Role updated to [${role}]`, 200);
      }
      return this.handleResponse('User not found', 404);
    } catch (error) {
      /* istanbul ignore next */
      return this.handleResponse(error, 500);
    }
  }

  async deleteUser(id) {
    try {
      const response = await this.model.Users.destroy({ where: { id } });
      if (response) {
        return this.handleResponse('User deleted', 200);
      }
      return this.handleResponse('User not registered', 404);
    } catch (error) {
      /* istanbul ignore next */
      return this.handleResponse(error, 500);
    }
  }
}

export default Auth;
