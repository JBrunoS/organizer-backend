const knex =  require('knex');
const configuration = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';

const connection = configuration[env]

module.exports = knex(connection);