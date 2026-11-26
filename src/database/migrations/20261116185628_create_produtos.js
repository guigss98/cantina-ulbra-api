export function up(knex) {
  return knex.schema.createTable('produtos', (table) => {
    table.increments('id').primary();
    table.string('nome', 80).notNullable().unique();
    table.string('categoria', 30).notNullable();
    table.decimal('preco', 8, 2).notNullable();
    table.integer('estoque').notNullable().checkBetween([0, 999999]);
    table.boolean('ativo').notNullable().defaultTo(true);
  });
}
export function down(knex) {
  return knex.schema.dropTable('produtos');
}