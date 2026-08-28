"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create order (Customer / Guest)
router.post('/', auth_1.optionalAuth, orderController_1.createOrder);
// Customer order history
router.get('/my-orders', auth_1.protect, orderController_1.getMyOrders);
// Order by ID
router.get('/:id', auth_1.optionalAuth, orderController_1.getOrderById);
// Admin only: Get all orders and update status
router.get('/', auth_1.protect, auth_1.adminOnly, orderController_1.getAllOrders);
router.patch('/:id/status', auth_1.protect, auth_1.adminOnly, orderController_1.updateOrderStatus);
exports.default = router;
