import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByEmail,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Customer routes
router.post('/', createOrder);
router.get('/email/:email', getOrdersByEmail);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', authenticate, authorize(['admin']), getAllOrders);
router.patch('/:id/status', authenticate, authorize(['admin']), updateOrderStatus);

export default router;
