import db from '../database/connection.js';

export async function listarProdutos(req, res) {
  try {
    const { categoria, ativo } = req.query;

    const query = db('produtos').select('*');

    if (categoria) {
      query.where('categoria', categoria);
    }
    if (ativo !== undefined) {
      if (ativo === 'true' || ativo === '1') {
        query.where('ativo', true);
      } else if (ativo === 'false' || ativo === '0') {
        query.where('ativo', false);
      } else {
        return res.status(400).json({ error: 'O filtro ativo deve ser true ou false.' });
      }
    }
    const produtos = await query;
    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao listar produtos.' });
  }
}
export async function buscarProdutoPorId(req, res) {
  try {
    const { id } = req.params;
    const produto = await db('produtos').where({ id }).first();

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar produto.' });
  }
}
export async function criarProduto(req, res) {
  try {
    const { nome, categoria, preco, estoque, ativo } = req.body;

    if (!nome || !categoria || preco === undefined || estoque === undefined) {
      return res.status(400).json({
        error: 'Campos obrigatórios: nome, categoria, preco e estoque.'
      });
    }
    if (Number(preco) < 0 || Number(estoque) < 0) {
      return res.status(400).json({
        error: 'Preço e estoque não podem ser negativos.'
      });
    }
    const produtoExistente = await db('produtos').where({ nome: nome.trim() }).first();
    if (produtoExistente) {
      return res.status(409).json({ error: 'Já existe um produto cadastrado com este nome.' });
    }
    const [id] = await db('produtos').insert({
      nome: nome.trim(),
      categoria: categoria.trim(),
      preco: Number(preco),
      estoque: Number(estoque),
      ativo: ativo !== undefined ? Boolean(ativo) : true
    });
    const novoProduto = await db('produtos').where({ id }).first();
    return res.status(201).json(novoProduto);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao criar produto.' });
  }
}
export async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const { nome, categoria, preco, estoque, ativo } = req.body;

    const produtoAtual = await db('produtos').where({ id }).first();
    if (!produtoAtual) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    if (!nome || !categoria || preco === undefined || estoque === undefined) {
      return res.status(400).json({
        error: 'Campos obrigatórios: nome, categoria, preco e estoque.'
      });
    }
    if (Number(preco) < 0 || Number(estoque) < 0) {
      return res.status(400).json({
        error: 'Preço e estoque não podem ser negativos.'
      });
    }
    const nomeDuplicado = await db('produtos')
      .where({ nome: nome.trim() })
      .whereNot({ id })
      .first();

    if (nomeDuplicado) {
      return res.status(409).json({ error: 'Já existe outro produto com este nome.' });
    }
    await db('produtos')
      .where({ id })
      .update({
        nome: nome.trim(),
        categoria: categoria.trim(),
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo !== undefined ? Boolean(ativo) : produtoAtual.ativo
      });
    const produtoAtualizado = await db('produtos').where({ id }).first();
    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
  }
}
export async function deletarProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await db('produtos').where({ id }).first();
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const pedidoVinculado = await db('pedidos').where({ produto_id: id }).first();
    if (pedidoVinculado) {
      return res.status(409).json({
        error: 'Não é possível excluir produto que possui pedidos no histórico.'
      });
    }
    await db('produtos').where({ id }).del();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao deletar produto.' });
  }
}