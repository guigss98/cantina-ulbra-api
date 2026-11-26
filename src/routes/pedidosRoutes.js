import { Router } from 'express';
import {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  deletarPedido
} from '../controllers/pedidosController.js';

const router = Router();

router.get('/', listarPedidos);
router.get('/:id', buscarPedidoPorId);
router.post('/', criarPedido);
router.delete('/:id', deletarPedido);

export default router;