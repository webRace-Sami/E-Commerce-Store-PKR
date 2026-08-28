"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = void 0;
const dataStore_1 = require("../store/dataStore");
const getAdminStats = async (_req, res) => {
    try {
        const totalProducts = dataStore_1.store.products.length;
        const lowStockProducts = dataStore_1.store.products.filter(p => p.stock > 0 && p.stock <= 5);
        const outOfStockProducts = dataStore_1.store.products.filter(p => p.stock === 0);
        const totalOrders = dataStore_1.store.orders.length;
        const pendingOrders = dataStore_1.store.orders.filter(o => o.orderStatus === 'Pending').length;
        const deliveredOrders = dataStore_1.store.orders.filter(o => o.orderStatus === 'Delivered').length;
        const totalRevenue = dataStore_1.store.orders
            .filter(o => o.orderStatus !== 'Cancelled')
            .reduce((sum, o) => sum + o.totalPrice, 0);
        const totalOffers = dataStore_1.store.offers.length;
        const activeOffers = dataStore_1.store.offers.filter(o => o.isActive).length;
        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalProducts,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                lowStockCount: lowStockProducts.length,
                outOfStockCount: outOfStockProducts.length,
                totalOffers,
                activeOffers,
                lowStockItems: lowStockProducts.map(p => ({
                    _id: p._id,
                    name: p.name,
                    stock: p.stock,
                    price: p.price,
                    category: p.category
                })),
                recentOrders: dataStore_1.store.orders.slice(0, 5)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAdminStats = getAdminStats;
