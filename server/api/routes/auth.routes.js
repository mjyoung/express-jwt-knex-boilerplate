import { login, register } from '../controllers/auth.controller';

module.exports = (router) => {
  router.route('/v1/login').post(login);
  router.route('/v1/register').post(register);
};
