export async function seed(knex) {
  await knex('pedidos').del();
  await knex('produtos').del();

  await knex.raw("DELETE FROM sqlite_sequence WHERE name IN ('produtos', 'pedidos')");

  await knex('produtos').insert([
    { id: 1, nome: 'Risoles de Frango', categoria: 'Salgados', preco: 7.00, estoque: 30, ativo: true },
    { id: 2, nome: 'Pastel de Carne', categoria: 'Salgados', preco: 8.50, estoque: 25, ativo: true },
    { id: 3, nome: 'Pão de Queijo', categoria: 'Salgados', preco: 5.00, estoque: 40, ativo: true },
    { id: 4, nome: 'Refrigerante Lata', categoria: 'Bebidas', preco: 6.00, estoque: 50, ativo: true },
    { id: 5, nome: 'Suco Natural de Laranja', categoria: 'Bebidas', preco: 8.00, estoque: 20, ativo: true },
    { id: 6, nome: 'Brigadeiro', categoria: 'Doces', preco: 4.00, estoque: 35, ativo: true },
    { id: 7, nome: 'Torta de Limão', categoria: 'Doces', preco: 9.50, estoque: 10, ativo: false }
  ]);

  await knex('pedidos').insert([
    {
      aluno_nome: 'Guilherme',
      produto_id: 1,
      quantidade: 2,
      valor_total: 14.00,
      created_at: '2026-11-10 10:15:00',
      updated_at: '2026-11-10 10:15:00'
    },
    {
      aluno_nome: 'Bruna',
      produto_id: 4,
      quantidade: 1,
      valor_total: 6.00,
      created_at: '2026-11-11 14:30:00',
      updated_at: '2026-11-11 14:30:00'
    },
    {
      aluno_nome: 'Mel',
      produto_id: 2,
      quantidade: 3,
      valor_total: 25.50,
      created_at: '2026-11-12 19:45:00',
      updated_at: '2026-11-12 19:45:00'
    },
    {
      aluno_nome: 'Guilherme',
      produto_id: 5,
      quantidade: 2,
      valor_total: 16.00,
      created_at: '2026-11-13 09:20:00',
      updated_at: '2026-11-13 09:20:00'
    },
    {
      aluno_nome: 'André',
      produto_id: 6,
      quantidade: 4,
      valor_total: 16.00,
      created_at: '2026-11-14 20:10:00',
      updated_at: '2026-11-14 20:10:00'
    },
    {
      aluno_nome: 'Bruna',
      produto_id: 3,
      quantidade: 2,
      valor_total: 10.00,
      created_at: '2026-11-15 16:00:00',
      updated_at: '2026-11-15 16:00:00'
    }
  ]);
}