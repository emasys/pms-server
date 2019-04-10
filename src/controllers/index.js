import model from '../../sequelize/models';
import { createUser, login } from './auth';
import {
  createLocation,
  createSubLocation,
  modifyLocation,
  modifySubLocation,
  fetchMainLocation,
  fetchSubLocation,
} from './location';

const controllerPlugin = {
  name: 'controller',
  register: (server) => {
    server.bind({ model });
    server.auth.strategy('jwt-strategy', 'hapi-now-auth', {
      verifyJWT: true,
      keychain: [process.env.SECRET],
      validate: async (request, token) => {
        const credentials = token.decodedJWT;
        if (credentials.role === 'admin') {
          credentials.scope = 'admin';
        } else {
          credentials.scope = 'user';
        }
        return {
          isValid: true,
          credentials,
        };
      },
    });

    server.auth.default('jwt-strategy');
    server.route(createUser);
    server.route(login);
    server.route(createLocation);
    server.route(createSubLocation);
    server.route(modifyLocation);
    server.route(modifySubLocation);
    server.route(fetchMainLocation);
    server.route(fetchSubLocation);
  },
};

export default controllerPlugin;
