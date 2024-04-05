import statusCheck from './statusCheck.js';
import userCtrl from './userCtrl.js';
import loginCtrl from './loginCtrl.js';

export default (
  logger,
  repository,
  tokenSecret,
  tokenExpiration,
) => ({
  statusCheck,
  userCtrl: userCtrl(logger, repository.userRepo),
  loginCtrl: loginCtrl(
    logger,
    repository.userRepo,
    tokenSecret,
    tokenExpiration,
  ),
});
