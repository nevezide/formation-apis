import { v4 as uuidv4 } from 'uuid';

export default (dbClient) => {
  const listUsers = async () => {
    const res = await dbClient.query('SELECT id, login, role FROM "User"');
    return res.rows;
  };

  const findUser = async (id) => {
    const res = await dbClient.query(
      'SELECT id, login, role FROM "User" WHERE id = $1',
      [id],
    );
    return res.rows[0];
  };

  const isUserExists = async (login) => {
    const res = await dbClient.query(
      'SELECT id FROM "User" WHERE login = $1',
      [login],
    );
    return res.rows.length > 0;
  };

  const findUserWithCredentials = async (login, password) => {
    const res = await dbClient.query(
      'SELECT id, login, role FROM "User" WHERE login = $1 AND password = $2',
      [login, password],
    );
    return res.rows[0];
  };

  const createUser = async (userData) => {
    const isExists = await isUserExists(userData.login);
    if (isExists) {
      return null;
    }
    const res = await dbClient.query(
      'INSERT INTO "User"(id, login, password, role) VALUES ($1, $2, $3, $4) RETURNING id, login, role',
      [
        uuidv4(),
        userData.login,
        userData.password,
        userData.role,
      ],
    );
    return res.rows[0];
  };

  const updateUser = async (id, userData) => {
    const res = await dbClient.query(
      `UPDATE "User" SET
              login    = $2,
              password = $3,
              role = $4
        WHERE id = $1`,
      [
        id,
        userData.login,
        userData.password,
        userData.role,
      ],
    );
    if (res.rowCount > 0) {
      return findUser(id);
    }

    return null;
  };

  const deleteUser = async (id) => {
    const deletedUser = await findUser(id);

    if (deletedUser) {
      const res = await dbClient.query(
        'DELETE FROM "User" WHERE id = $1',
        [id],
      );
      if (res.rowCount > 0) {
        return deletedUser;
      }
    }

    return null;
  };

  return {
    isUserExists,
    listUsers,
    createUser,
    findUser,
    findUserWithCredentials,
    updateUser,
    deleteUser,
  };
};
