import { Router } from 'express';
import {
  relatorioVendasPorCategoria,
  relatorioTopProdutos,
  relatorioFaturamento
} from '../controllers/relatoriosController.js';

const router = Router();

router.get('/vendas-por-categoria', relatorioVendasPorCategoria);
router.get('/top-produtos', relatorioTopProdutos);
router.get('/faturamento', relatorioFaturamento);

export default router;