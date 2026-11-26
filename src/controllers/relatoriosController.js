import db from '../database/connection.js';

export async function relatorioVendasPorCategoria(req, res) {
  try {
    const categorias = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select('produtos.categoria')
      .count('pedidos.id as total_pedidos')
      .sum('pedidos.quantidade as quantidade_itens')
      .sum('pedidos.valor_total as total_vendido')
      .groupBy('produtos.categoria')
      .orderBy('total_vendido', 'desc');

    const formatado = categorias.map((item) => ({
      categoria: item.categoria,
      total_pedidos: Number(item.total_pedidos),
      quantidade_itens: Number(item.quantidade_itens),
      total_vendido: Number(Number(item.total_vendido).toFixed(2))
    }));
    return res.status(200).json(formatado);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao gerar relatório de vendas por categoria.' });
  }
}
export async function relatorioTopProdutos(req, res) {
  try {
    const ranking = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select('produtos.id', 'produtos.nome', 'produtos.categoria')
      .sum('pedidos.quantidade as total_vendido')
      .sum('pedidos.valor_total as valor_arrecadado')
      .groupBy('produtos.id', 'produtos.nome', 'produtos.categoria')
      .orderBy('total_vendido', 'desc')
      .limit(5);

    const formatado = ranking.map((item) => ({
      id: item.id,
      nome: item.nome,
      categoria: item.categoria,
      total_vendido: Number(item.total_vendido),
      valor_arrecadado: Number(Number(item.valor_arrecadado).toFixed(2))
    }));
    return res.status(200).json(formatado);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao gerar relatório de top produtos.' });
  }
}
export async function relatorioFaturamento(req, res) {
  try {
    const { data_inicio, data_fim } = req.query;

    const query = db('pedidos');

    if (data_inicio && data_fim) {
      query.whereBetween('created_at', [`${data_inicio} 00:00:00`, `${data_fim} 23:59:59`]);
    } else if (data_inicio) {
      query.where('created_at', '>=', `${data_inicio} 00:00:00`);
    } else if (data_fim) {
      query.where('created_at', '<=', `${data_fim} 23:59:59`);
    }
    const resultado = await query
      .count('id as total_pedidos')
      .sum('valor_total as faturamento_total')
      .first();

    return res.status(200).json({
      periodo: {
        data_inicio: data_inicio || 'início',
        data_fim: data_fim || 'atual'
      },
      total_pedidos: Number(resultado.total_pedidos) || 0,
      faturamento_total: Number(Number(resultado.faturamento_total || 0).toFixed(2))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao gerar relatório de faturamento.' });
  }
}