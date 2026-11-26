import { Router } from 'express';
import produtosRoutes from './produtosRoutes.js';
import pedidosRoutes from './pedidosRoutes.js';
import relatoriosRoutes from './relatoriosRoutes.js';

const router = Router();

router.use('/produtos', produtosRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/relatorios', relatoriosRoutes);

export default router;