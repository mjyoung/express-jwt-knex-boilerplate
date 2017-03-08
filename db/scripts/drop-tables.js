'use strict';

const chalk = require('chalk');

exports.seed = (knex, Promise) => {

  const query  = 'drop schema public cascade; create schema public;';

  return knex
    .raw(query)
    .then(() => {
      console.log(chalk.green('Running all migrations :'));
      return knex.migrate.latest(knex.client.migrationConfig);
    });
};
