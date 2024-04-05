import pg from 'pg';
import userRepo from './userRepo.js';

const { Client } = pg;

export default async (logger, connectionString) => {
  const dbClient = new Client({
    connectionString,
  });

  await dbClient.connect();

  logger.log(`Connected to ${connectionString}`);

  return {
    userRepo: userRepo(dbClient),
  };
};
