import db from '../database/connection.js';

export async function listarPedidos(req, res) {
  try {
    const { aluno, page = 1, limit = 10 } = req.query;
    const paginaAtual = Math.max(1, Number(page) || 1);
    const itensPorPagina = Math.max(1, Number(limit) || 10);
    const offset = (paginaAtual - 1) * itensPorPagina;
    const query = db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select(
        'pedidos.id',
        'pedidos.aluno_nome',
        'pedidos.produto_id',
        'produtos.nome as produto_nome',
        'produtos.preco as produto_preco',
        'pedidos.quantidade',
        'pedidos.valor_total',
        'pedidos.created_at',
        'pedidos.updated_at'
      );
    const countQuery = db('pedidos');

    if (aluno) {
      query.where('pedidos.aluno_nome', 'like', `%${aluno}%`);
      countQuery.where('aluno_nome', 'like', `%${aluno}%`);
    }

    const totalResult = await countQuery.count('id as total').first();
    const pedidos = await query.limit(itensPorPagina).offset(offset);

    return res.status(200).json({
      pagina: paginaAtual,
      limite: itensPorPagina,
      total: Number(totalResult.total),
      dados: pedidos
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao listar pedidos.' });
  }
}
export async function buscarPedidoPorId(req, res) {
  try {
    const { id } = req.params;

    const pedido = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select(
        'pedidos.id',
        'pedidos.aluno_nome',
        'pedidos.produto_id',
        'produtos.nome as produto_nome',
        'produtos.preco as produto_preco',
        'pedidos.quantidade',
        'pedidos.valor_total',
        'pedidos.created_at',
        'pedidos.updated_at'
      )
      .where('pedidos.id', id)
      .first();

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar pedido.' });
  }
}
export async function criarPedido(req, res) {
  try {
    const { aluno_nome, produto_id, quantidade } = req.body;

    if (!aluno_nome || !produto_id || quantidade === undefined) {
      return res.status(400).json({
        error: 'Campos obrigatórios: aluno_nome, produto_id e quantidade.'
      });
    }
    const qtd = Number(quantidade);
    if (!Number.isInteger(qtd) || qtd < 1) {
      return res.status(400).json({
        error: 'A quantidade deve ser um número inteiro maior ou igual a 1.'
      });
    }
    const resultado = await db.transaction(async (trx) => {
      const produto = await trx('produtos').where({ id: produto_id }).first();

      if (!produto) {
        return { status: 404, body: { error: 'Produto não encontrado.' } };
      }
      if (!produto.ativo) {
        return { status: 400, body: { error: 'Não é possível pedir um produto inativo.' } };
      }
      if (produto.estoque < qtd) {
        return {
          status: 409,
          body: { error: `Estoque insuficiente. Disponível: ${produto.estoque}.` }
        };
      }
      const valorTotal = Number((produto.preco * qtd).toFixed(2));

      const [pedidoId] = await trx('pedidos').insert({
        aluno_nome: aluno_nome.trim(),
        produto_id: produto.id,
        quantidade: qtd,
        valor_total: valorTotal
      });
      await trx('produtos')
        .where({ id: produto.id })
        .update({ estoque: produto.estoque - qtd });

      const novoPedido = await trx('pedidos').where({ id: pedidoId }).first();
      return { status: 201, body: novoPedido };
    });
    return res.status(resultado.status).json(resultado.body);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao criar pedido.' });
  }
}
export async function deletarPedido(req, res) {
  try {
    const { id } = req.params;

    const resultado = await db.transaction(async (trx) => {
      const pedido = await trx('pedidos').where({ id }).first();

      if (!pedido) {
        return { status: 404, body: { error: 'Pedido não encontrado.' } };
      }
      const produto = await trx('produtos').where({ id: pedido.produto_id }).first();

      if (produto) {
        await trx('produtos')
          .where({ id: produto.id })
          .update({ estoque: produto.estoque + pedido.quantidade });
      }
      await trx('pedidos').where({ id }).del();
      return { status: 204, body: null };
    });
    if (resultado.status === 204) {
      return res.status(204).send();
    }
    return res.status(resultado.status).json(resultado.body);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao cancelar pedido.' });
  }
}