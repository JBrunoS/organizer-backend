
exports.up = function(knex) {
  return knex.schema.createTable('parcelas', function(table){
      table.increments().primary();
      table.boolean('status').notNullable();
      table.float('valor_parcela', [0], [0]).notNullable();
      table.integer('numero_parcela').unsigned().notNullable();
      table.date('data_parcela');
      table.integer('pagamento_id').notNullable();

      table.foreign('pagamento_id').references('id').inTable('pagamentos')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('parcelas');
};
