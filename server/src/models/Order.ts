import mongoose, { Schema } from 'mongoose';
import { IOrderItem } from '../types';

export interface IOrderDoc {
  _id: string;
  user?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  orderItems: IOrderItem[];
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'EasyPaisa / JazzCash';
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

const OrderSchema = new Schema<IOrderDoc>(
  {
    _id: { type: String, required: true },
    user: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      notes: { type: String }
    },
    orderItems: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Bank Transfer', 'EasyPaisa / JazzCash'],
      default: 'Cash on Delivery'
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false, timestamps: false }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);
