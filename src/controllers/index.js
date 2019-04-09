import db from '../../sequelize/models';
import { hello } from './auth';

const controllerPlugin = {
  name: 'controller',
  register: (server) => {
    server.bind({ db });
    server.route(hello);
  },
};

export default controllerPlugin;
