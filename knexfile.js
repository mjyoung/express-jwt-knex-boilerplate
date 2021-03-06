const _ = require('lodash');
const path = require('path');

const baseEnv = {
  client: process.env.DB_CLIENT || 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || null,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'test-app_development',
    multipleStatements: true
  }
};

module.exports = {
  default: baseEnv,
  static: _.merge({}, baseEnv, {
    migrations: {
      directory: path.join(__dirname, '/db/migrations_static'),
      tableName: 'migration_static_version'
    }
  }),
  schema: _.merge({}, baseEnv, {
    migrations: {
      directory: path.join(__dirname, '/db/migrations_schema'),
      tableName: 'migration_schema_version'
    }
  }),
  data: _.merge({}, baseEnv, {
    migrations: {
      directory: path.join(__dirname, '/db/migrations_data'),
      tableName: 'migration_data_version'
    }
  }),
  seed: _.merge({}, baseEnv, {
    seeds: {
      directory: path.join(__dirname, '/db/seeds')
    }
  }),
  clean: _.merge({}, baseEnv, {
    migrations: {
      directory: path.join(__dirname, '/db/migrations_schema'),
      tableName: 'migration_schema_version'
    },
    seeds: {
      directory: path.join(__dirname, '/db/scripts')
    }
  })
};
