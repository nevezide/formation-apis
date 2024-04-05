import crypto from 'crypto';

export default (logger, userRepo) => {
  const listUsers = async (req, res) => {
    try {
      return res.send({
        data: await userRepo.listUsers(),
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  };

  const createUser = async (req, res) => {
    try {
      const userData = req.body;

      const hash = crypto.createHash('sha256').update(userData.password).digest('base64');
      userData.password = hash;

      const user = await userRepo.createUser(userData);

      if (user) {
        return res.status(201).send({
          data: user,
        });
      }
      return res.status(409).send({
        error: `User with login ${req.body.login} already exists`,
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  };

  const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;

      const hash = crypto.createHash('sha256').update(userData.password).digest('base64');
      userData.password = hash;
      const user = await userRepo.updateUser(id, userData);

      if (user) {
        return res.send({
          data: user,
        });
      }

      return res.status(404).send({
        error: `User ${id} not found`,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  };

  const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userRepo.findUser(id);

      if (user) {
        return res.send({
          data: user,
        });
      }

      return res.status(404).send({
        error: `User ${id} not found`,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await userRepo.deleteUser(id);

      if (deletedUser) {
        return res.send({
          meta: {
            _deleted: deletedUser,
          },
        });
      }

      return res.status(404).send({
        error: `User ${id} not found`,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  };

  return {
    listUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
  };
};
