import pg from 'pg';

const { Client } = pg;

const user1 = {
  id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  login: 'rototo',
  password: 'Kk8aCyi5m65lmk7BbHh8iYsEqUMfKHA0oKDUiXFYe4g=',
  role: 'admin',
};
const user2 = {
  id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
  login: 'batiti',
  password: 'GqS5LmBg5eNyGtmMkxuT8KdbpHBYuQ0RbHw0WQ4r6TE=',
  role: 'visitor',
};

export default async (connectionString) => {
  const dbClient = new Client({
    connectionString,
  });
  await dbClient.connect();

  async function createUsers() {
    await dbClient.query(`
      INSERT INTO "User"(id, login, password, role) VALUES ($1, $2, $3, $4)
    `, Object.values(user1));
    await dbClient.query(`
      INSERT INTO "User"(id, login, password, role) VALUES ($1, $2, $3, $4)
    `, Object.values(user2));

    return {
      user1,
      user2,
    };
  }

  async function cleanAll() {
    await dbClient.query('TRUNCATE "User"');
  }

  async function findUser(id) {
    const res = await dbClient.query(
      'SELECT * FROM "User" WHERE id = $1',
      [id],
    );
    return res.rows[0];
  }

  return {
    createUsers,
    cleanAll,
    findUser,
    data: {
      user1,
      user2,
    },
  };
};
