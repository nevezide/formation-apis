import jwt from 'jsonwebtoken';

export default (allowedRoles) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).send({
      error: 'Missing authentication data',
    });
  }

  return jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        error: 'Invalid authentication data',
      });
    }

    if (allowedRoles.includes(user.role)) {
      req.user = user;
      return next();
    }

    return res.status(403).send({
      error: 'Access forbidden',
    });
  });
};
