import dotenv from 'dotenv';

import api from './api/index.js';

dotenv.config();

await api.launch(
  console,
  process.env.PROD_DATABASE_URL,
  process.env.API_PORT,
  process.env.TOKEN_SECRET,
  process.env.TOKEN_EXPIRATION,
);
