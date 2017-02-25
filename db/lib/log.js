const fs = require('fs');
const util = require('util');
const appRootPath = require('app-root-path');

const LOG_DIR = `${appRootPath}/db/.migrations_sql`;
const DEFAULT_LOG_OPTIONS = {
  flags: 'w'
};

/**
 * Logs knex queries to logName file
 * @param knex
 * @param logName
 */
module.exports = (knex, logName) => {
  // Create directory if it does not exist
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }

  const logOptions = DEFAULT_LOG_OPTIONS;
  const logPath = util.format('%s/%s.sql', LOG_DIR, logName);
  const logFile = fs.createWriteStream(logPath, logOptions);

  knex.on('query', (queryData) => {
    logFile.write(`${knex.raw(queryData.sql, queryData.bindings)};\n\n`);
  });

  knex.on('close-log-file', () => {
    knex.removeAllListeners();
    logFile.close();
  });

  knex.on('query-error', () => {
    const logPathError = util.format('%s/%s.sql.log', appRootPath, logName);
    knex.removeAllListeners();
    logFile.close();
    fs.renameSync(logPath, logPathError);
  });
};
