const path = require('path');
const log = require('../lib/log');

const filename = path.basename(__filename, '.js');

exports.up = (knex, Promise) => {
  log(knex, filename);

  return Promise.all([
    knex.schema.createTableIfNotExists('users', (table) => {
      table.bigIncrements();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.timestamps();
      table.timestamp('deleted_at');
      table.timestamp('last_logged_in_at');
    })
  ]).then(() => knex.emit('close-log-file'));
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTableIfExists('users')
  ]);
};
