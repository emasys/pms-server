import Glue from 'glue';
import Log from 'fancy-log';
import config from './config';

const options = {
  relativeTo: __dirname,
};

(async () => {
  try {
    const server = await Glue.compose(
      config,
      options,
    );
    await server.start();
    Log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    Log.error(error);
    process.exit(1);
  }
})();
