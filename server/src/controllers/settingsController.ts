import { Request, Response } from 'express';
import { store } from '../store/dataStore';

// Get Public & Admin Store Settings
export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await store.getSettings();
    res.json({
      success: true,
      settings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch settings' });
  }
};

// Admin: Update Store Settings (Email, Phone, Courier fee, Tax)
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      storeName,
      adminEmail,
      phone,
      shippingFee,
      freeShippingThreshold,
      taxRate,
      currency,
      address
    } = req.body;

    const updated = await store.updateSettings({
      ...(storeName ? { storeName: storeName.trim() } : {}),
      ...(adminEmail ? { adminEmail: adminEmail.toLowerCase().trim() } : {}),
      ...(phone ? { phone: phone.trim() } : {}),
      ...(shippingFee !== undefined ? { shippingFee: Number(shippingFee) } : {}),
      ...(freeShippingThreshold !== undefined ? { freeShippingThreshold: Number(freeShippingThreshold) } : {}),
      ...(taxRate !== undefined ? { taxRate: Number(taxRate) } : {}),
      ...(currency ? { currency: currency.trim() } : {}),
      ...(address ? { address: address.trim() } : {})
    });

    res.json({
      success: true,
      message: 'Store settings updated successfully! New courier fee, tax, and helpline are now live.',
      settings: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update settings' });
  }
};
