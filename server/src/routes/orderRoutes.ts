import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController';
import { protect, adminOnly, optionalAuth } from '../middleware/auth';

const router = Router();

// Create order (Customer / Guest)
router.post('/', optionalAuth, createOrder);

// Customer order history
router.get('/my-orders', protect, getMyOrders);

// Order by ID
router.get('/:id', optionalAuth, getOrderById);

// Admin only: Get all orders and update status
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
