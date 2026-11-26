export function up(knex) {
  return knex.schema.createTable('pedidos', (table) => {
    table.increments('id').primary();
    table.string('aluno_nome', 100).notNullable();
    table
      .integer('produto_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('produtos')
      .onDelete('RESTRICT');
    table.integer('quantidade').notNullable().checkBetween([1, 999999]);
    table.decimal('valor_total', 8, 2).notNullable();
    table.timestamps(true, true);
  });
}
export function down(knex) {
  return knex.schema.dropTable('pedidos');
}