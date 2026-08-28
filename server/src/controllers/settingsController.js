"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const dataStore_1 = require("../store/dataStore");
// Get Public & Admin Store Settings
const getSettings = async (_req, res) => {
    try {
        const settings = await dataStore_1.store.getSettings();
        res.json({
            success: true,
            settings
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch settings' });
    }
};
exports.getSettings = getSettings;
// Admin: Update Store Settings (Email, Phone, Courier fee, Tax)
const updateSettings = async (req, res) => {
    try {
        const { storeName, adminEmail, phone, shippingFee, freeShippingThreshold, taxRate, currency, address } = req.body;
        const updated = await dataStore_1.store.updateSettings({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
