Set-Content -Path README.md -Encoding UTF8 -Value @'
Cantina ULBRA API

API RESTful criada com Node.js, Express, Knex.js e SQLite3 para gerenciar produtos, estoque, pedidos e relatórios da cantina.

Autor:
Nome: Guilherme da Silva dos Santos
Curso: Engenharia de Software — ULBRA

Tecnologias:
- Node.js
- Express
- Knex.js
- SQLite3

Como rodar:
1. Instalar dependências: `npm install`
2. Criar banco de dados: `npx knex migrate:latest`
3. Popular banco de dados: `npx knex seed:run`
4. Iniciar servidor: `npm start`

Endpoints:
- `GET /api/produtos` — Lista todos os produtos (filtros: `?categoria=` e `?ativo=`)
- `GET /api/produtos/:id` — Busca um produto pelo ID
- `POST /api/produtos` — Cadastra um novo produto
- `PUT /api/produtos/:id` — Atualiza um produto
- `DELETE /api/produtos/:id` — Remove um produto (bloqueado se tiver pedidos)
- `GET /api/pedidos` — Lista pedidos paginados (`?page=1&limit=10`) e filtro (`?aluno=`)
- `GET /api/pedidos/:id` — Busca um pedido pelo ID com o nome do produto
- `POST /api/pedidos` — Cria um pedido, calcula `valor_total` e desconta o estoque
- `DELETE /api/pedidos/:id` — Cancela um pedido e devolve o estoque
- `GET /api/relatorios/vendas-por-categoria` — Total vendido e itens por categoria
- `GET /api/relatorios/top-produtos` — Ranking dos 5 produtos mais vendidos
- `GET /api/relatorios/faturamento` — Faturamento por período (`?data_inicio=&data_fim=`)

Exemplos de uso:
Criar pedido (`POST /api/pedidos`):
Requisição: `{"aluno_nome": "Guilherme", "produto_id": 1, "quantidade": 2}`
Resposta (201): `{"id": 6, "aluno_nome": "Guilherme", "produto_id": 1, "quantidade": 2, "valor_total": 14}`

Relatório vendas por categoria (`GET /api/relatorios/vendas-por-categoria`):
Resposta (200): `[{"categoria": "Salgados", "total_pedidos": 3, "quantidade_itens": 7, "total_vendido": 49.5}]`

Uso de Transação (`db.transaction`):
Utilizado no `POST /api/pedidos` e `DELETE /api/pedidos/:id` para garantir que a criação/cancelamento do pedido e a atualização do estoque aconteçam juntos no banco. Se ocorrer erro em uma etapa, tudo é desfeito automaticamente.
'@