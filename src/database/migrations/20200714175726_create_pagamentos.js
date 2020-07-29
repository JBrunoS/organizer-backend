
exports.up = function(knex) {
  return knex.schema.createTable('pagamentos', function(table){
      table.increments().primary();
      table.integer('categoria').notNullable();
      table.string('titulo').notNullable();
      table.string('descricao').notNullable();
      table.float('valor_total').unsigned().notNullable();
      table.float('valor_restante').unsigned().notNullable();
      table.integer('numero_parcelas').unsigned().notNullable();
      table.integer('dia_pagamento').unsigned().notNullable();
      table.date('comeca_pagar').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.boolean('status').notNullable();
      table.integer('user_id').notNullable();
      

      table.foreign('user_id').references('id').inTable('users');
      
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('pagamentos');
};
