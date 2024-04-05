import Express from 'express';
import cors from 'cors';

import router from './router.js';
import controlers from './controlers/index.js';
import repository from './repository/index.js';

const launch = async (
  logger,
  dbConnectionUri,
  apiPort,
  tokenSecret,
  tokenExpiration,
) => {
  const app = new Express();
  app.use(Express.json());

  /* CORS policy */
  app.use(cors({
    origin: 'http://localhost:3001',
  }));

  const repositories = await repository(logger, dbConnectionUri);

  router(
    controlers(
      logger,
      repositories,
      tokenSecret,
      tokenExpiration,
    ),
    app,
  );

  // IMPORTANT : Do not remove unused params because will not work instead
  // when OpenApiValidator fail
  app.use((err, _, res, __) => { // eslint-disable-line no-unused-vars
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  app.listen(apiPort);

  logger.log(`API server listening on port ${apiPort}...`);

  // For testing purposes
  return app;
};

export default { launch };
