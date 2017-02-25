import logger from './lib/logger';

require('dotenv').config();
// initialize the configuration first!
require('./config/init')();

// load and output the configuration
const config = require('./config');

// load the express application
const app = require('./express');

// start the application
app.listen(config.port, (err) => {
  if (err) {
    logger.error(err);
  }

  logger.info(`Express server listening on port ${config.port} ` +
    `in ${process.env.NODE_ENV} environment`);
});
