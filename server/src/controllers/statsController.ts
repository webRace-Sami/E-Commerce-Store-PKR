import { Request, Response } from 'express';
import { store } from '../store/dataStore';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalProducts = store.products.length;
    const lowStockProducts = store.products.filter(p => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = store.products.filter(p => p.stock === 0);

    const totalOrders = store.orders.length;
    const pendingOrders = store.orders.filter(o => o.orderStatus === 'Pending').length;
    const deliveredOrders = store.orders.filter(o => o.orderStatus === 'Delivered').length;

    const totalRevenue = store.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const totalOffers = store.offers.length;
    const activeOffers = store.offers.filter(o => o.isActive).length;

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
        recentOrders: store.orders.slice(0, 5)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
