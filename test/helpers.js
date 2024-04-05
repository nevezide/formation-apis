import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import api from '../api/index.js';
import db from './db.js';

dotenv.config();

const seeder = await db(process.env.TEST_DATABASE_URL);

const makeToken = (content) => jwt.sign(
  content,
  process.env.TOKEN_SECRET,
  { expiresIn: process.env.TOKEN_EXPIRATION },
);

// For testing purposes
const app = await api.launch(
  console,
  process.env.TEST_DATABASE_URL,
  process.env.API_PORT,
  process.env.TOKEN_SECRET,
  process.env.TOKEN_EXPIRATION,
);

export default {
  app, seeder, makeToken,
};
