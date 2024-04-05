import * as OpenApiValidator from 'express-openapi-validator';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import authenticateToken from './lib/authenticateToken.js';

export default (controlers, app) => {
  const apiSpec = JSON.parse(fs.readFileSync('./api/openapi.json'));

  /** * !!! Routes without validation !!! */
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(apiSpec));

  /** * !!! API validation & doc begins here !!! */
  app.use(
    OpenApiValidator.middleware({
      apiSpec,
      validateApiSpec: true,
      validateRequests: {
        removeAdditional: 'all',
      },
      validateResponses: true,
      ignoreUndocumented: false,
    }),
  );

  app.get('/statusCheck', controlers.statusCheck.getStatus);
  app.get('/users', authenticateToken(['admin']), controlers.userCtrl.listUsers);
  app.post('/users', authenticateToken(['admin']), controlers.userCtrl.createUser);
  app.get('/users/:id', authenticateToken(['admin']), controlers.userCtrl.getUser);
  app.put('/users/:id', authenticateToken(['admin']), controlers.userCtrl.updateUser);
  app.delete('/users/:id', authenticateToken(['admin']), controlers.userCtrl.deleteUser);
  app.post('/login', controlers.loginCtrl.loginCheck);
};
