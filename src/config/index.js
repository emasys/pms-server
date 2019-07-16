import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import Swagger from 'hapi-swagger';
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
          basePath: '/v1',
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
