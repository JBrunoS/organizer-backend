
exports.up = function(knex) {
  return knex.schema.createTable('parcelas', function(table){
      table.increments().primary();
      table.boolean('status').notNullable();
      table.float('valor_parcela').notNullable();
      table.string('numero_parcela').unsigned().notNullable();
      table.string('data_parcela');
      table.string('pagamento_id').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.foreign('pagamento_id').references('id').inTable('pagamentos')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('parcelas');
};
