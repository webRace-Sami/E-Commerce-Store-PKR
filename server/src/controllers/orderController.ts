import { Request, Response } from 'express';
import { store } from '../store/dataStore';
import { IOrder, IOrderItem } from '../types';

// Create New Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      orderItems,
      paymentMethod
    } = req.body;

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
    const validatedItems: IOrderItem[] = [];

    for (const item of orderItems) {
      const product = store.products.find(p => p._id === item.productId);
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
      const product = store.products.find(p => p._id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    }

    const settings = await store.getSettings();
    const shippingPrice = itemsPrice >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    const taxPrice = settings.taxRate > 0 ? Math.round((itemsPrice * settings.taxRate) / 100) : 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const newOrder: IOrder = {
      _id: `order_${Date.now()}`,
      user: req.user?.id,
      customerName,
      customerEmail: customerEmail || req.user?.email || 'customer@smstore.pk',
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
      taxPrice,
      totalPrice,
      orderStatus: 'Pending',
      createdAt: new Date()
    };

    store.orders.unshift(newOrder);
    store.persist();

    res.status(201).json({
      success: true,
      message: `Order #${newOrder._id} placed successfully!`,
      order: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer: Get My Orders
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    const userOrders = store.orders.filter(
      o => (userId && o.user === userId) || (userEmail && o.customerEmail.toLowerCase() === userEmail.toLowerCase())
    );

    res.json({ success: true, count: userOrders.length, orders: userOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = store.orders.find(o => o._id === id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get All Orders
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, count: store.orders.length, orders: store.orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update Order Status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
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

    const order = store.orders.find(o => o._id === id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // If cancelled, restore stock
    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        const product = store.products.find(p => p._id === item.productId);
        if (product) {
          product.stock += item.quantity;
        }
      }
    }

    order.orderStatus = orderStatus;
    store.persist();

    res.json({
      success: true,
      message: `Order #${id} status updated to "${orderStatus}".`,
      order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
