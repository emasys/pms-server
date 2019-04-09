import Inert from 'inert';
import Vision from 'vision';
import Swagger from 'hapi-swagger';
import Log from 'fancy-log';
import Auth from '@now-ims/hapi-now-auth';
import controller from '../controllers';

const config = {
  server: {
    debug: { request: ['error'] },
    port: 8080,
    router: { stripTrailingSlash: true },
    routes: {
      timeout: { server: 15000 },
      cors: { credentials: true },
      validate: {
        options: {
          stripUnknown: true,
        },
        failAction: async (request, h, err) => {
          Log.error(err);
          throw err;
        },
      },
    },
  },
  register: {
    plugins: [
      { plugin: Inert.plugin },
      { plugin: Vision.plugin },
      { plugin: Auth.plugin },
      {
        plugin: Swagger.plugin,
        options: {
          info: {
            title: 'Population Management System',
            version: process.env.VERSION,
          },
          securityDefinitions: {
            token: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
            },
          },
        },
      },
      { plugin: controller },
    ],
  },
};

export default config;
