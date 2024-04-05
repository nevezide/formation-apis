import jwt from 'jsonwebtoken';

export default (
  logger,
  userRepo,
  tokenSecret,
  tokenExpiration,
) => {
  const loginCheck = async (req, res) => {
    try {
      const { login, password } = req.body;

      const user = await userRepo.findUserWithCredentials(login, password);

      if (user) {
        const token = jwt.sign(user, tokenSecret, { expiresIn: tokenExpiration });
        res.header('authorization', `Bearer ${token}`);

        return res.send();
      }
      return res.status(403).send({
        error: 'Access not allowed with provided credentials',
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  };

  return {
    loginCheck,
  };
};
