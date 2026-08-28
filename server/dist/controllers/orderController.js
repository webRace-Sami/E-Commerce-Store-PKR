"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const dataStore_1 = require("../store/dataStore");
// Create New Order
const createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, shippingAddress, orderItems, paymentMethod } = req.body;
        if (!customerName || !customerPhone || !shippingAddress?.address || !shippingAddress?.city) {
            res.status(400).json({ success: false, message: 'Please provide full contact and shipping details.' });
            return;
        }
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            res.status(400).json({ success: false, message: 'Your cart is empty. Please add items to checkout.' });
            return;
        }
        // Verify stock and calculate prices
        let itemsPrice = 0;
        const validatedItems = [];
        for (const item of orderItems) {
            const product = dataStore_1.store.products.find(p => p._id === item.productId);
            if (!product) {
                res.status(404).json({ success: false, message: `Product "${item.name}" not found.` });
                return;
            }
            if (product.stock < item.quantity) {
                res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${product.name}". Only ${product.stock} units available.`
                });
                return;
            }
            itemsPrice += product.price * item.quantity;
            validatedItems.push({
                productId: product._id,
                name: product.name,
                image: product.images[0] || item.image,
                price: product.price,
                quantity: item.quantity
            });
        }
        // Decrement stock in store
        for (const item of orderItems) {
            const product = dataStore_1.store.products.find(p => p._id === item.productId);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
            }
        }
        const shippingPrice = itemsPrice >= 50000 ? 0 : 350; // Free delivery in Pakistan above Rs. 50,000
        const totalPrice = itemsPrice + shippingPrice;
        const newOrder = {
            _id: `order_${Date.now()}`,
            user: req.user?.id,
            customerName,
            customerEmail: customerEmail || req.user?.email || 'guest@store.pk',
            customerPhone,
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode || 'N/A',
                notes: shippingAddress.notes || ''
            },
            orderItems: validatedItems,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            itemsPrice,
            shippingPrice,
            totalPrice,
            orderStatus: 'Pending',
            createdAt: new Date()
        };
        dataStore_1.store.orders.unshift(newOrder);
        dataStore_1.store.persist();
        res.status(201).json({
            success: true,
            message: `Order #${newOrder._id} placed successfully!`,
            order: newOrder
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createOrder = createOrder;
// Customer: Get My Orders
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userEmail = req.user?.email;
        const userOrders = dataStore_1.store.orders.filter(o => (userId && o.user === userId) || (userEmail && o.customerEmail.toLowerCase() === userEmail.toLowerCase()));
        res.json({ success: true, count: userOrders.length, orders: userOrders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyOrders = getMyOrders;
// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = dataStore_1.store.orders.find(o => o._id === id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        res.json({ success: true, order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOrderById = getOrderById;
// Admin: Get All Orders
const getAllOrders = async (_req, res) => {
    try {
        res.json({ success: true, count: dataStore_1.store.orders.length, orders: dataStore_1.store.orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllOrders = getAllOrders;
// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!orderStatus || !validStatuses.includes(orderStatus)) {
            res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
            return;
        }
        const order = dataStore_1.store.orders.find(o => o._id === id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        // If cancelled, restore stock
        if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
            for (const item of order.orderItems) {
                const product = dataStore_1.store.products.find(p => p._id === item.productId);
                if (product) {
                    product.stock += item.quantity;
                }
            }
        }
        order.orderStatus = orderStatus;
        dataStore_1.store.persist();
        res.json({
            success: true,
            message: `Order #${id} status updated to "${orderStatus}".`,
            order
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
