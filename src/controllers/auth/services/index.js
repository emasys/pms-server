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
      return this.handleResponse(`${name}'s account successfully created`, 201, token);
    } catch (error) {
      return this.handleResponse('User already exist, sign in to continue', 409);
    }
  }

  async login({ email, username, password }) {
    const isUser = await this.model.Users.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    const isValid = await this.validateUser(isUser, password);
    if (!isValid) {
      return this.handleResponse('Invalid credentials', 404);
    }
    const { id, role } = isUser;
    const token = signToken(id, role);
    return this.handleResponse('success', 200, token);
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
}

export default Auth;
