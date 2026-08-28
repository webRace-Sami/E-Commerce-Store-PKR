import mongoose, { Schema } from 'mongoose';
import { IStoreSettings } from '../types';

const settingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: 'SM*Store' },
    adminEmail: { type: String, default: 'samiullahnawaz942@gmail.com' },
    phone: { type: String, default: '+92 300 1234567' },
    shippingFee: { type: Number, default: 350 },
    freeShippingThreshold: { type: Number, default: 50000 },
    taxRate: { type: Number, default: 0 },
    currency: { type: String, default: 'PKR' },
    address: { type: String, default: 'Karachi, Pakistan' }
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.model<IStoreSettings>('Settings', settingsSchema);
