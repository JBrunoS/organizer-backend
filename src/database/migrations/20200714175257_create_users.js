
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){
      table.increments().primary();
      table.string('nome_usuario').notNullable();
      table.string('email').notNullable();
      table.string('telefone').notNullable();
      table.string('senha').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
