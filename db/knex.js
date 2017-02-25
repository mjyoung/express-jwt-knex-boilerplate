const knexConfig = require('../knexfile').default;

const knex = require('knex')(knexConfig);

module.exports = knex;
