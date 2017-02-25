import { getStatus } from '../controllers/status.controller';

module.exports = (router) => {
  router.route('/v1/status').get(getStatus);
};
