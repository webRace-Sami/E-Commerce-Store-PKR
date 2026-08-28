"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffer = exports.updateOffer = exports.createOffer = exports.getAllOffers = exports.getActiveOffers = void 0;
const dataStore_1 = require("../store/dataStore");
// Get active offers for client-side display (Hero / Banners)
const getActiveOffers = async (_req, res) => {
    try {
        const active = dataStore_1.store.offers.filter(o => o.isActive);
        res.json({ success: true, count: active.length, offers: active });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getActiveOffers = getActiveOffers;
// Admin: Get all offers
const getAllOffers = async (_req, res) => {
    try {
        res.json({ success: true, count: dataStore_1.store.offers.length, offers: dataStore_1.store.offers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllOffers = getAllOffers;
// Admin: Create Offer
const createOffer = async (req, res) => {
    try {
        const { title, subtitle, badge, discountText, discountCode, bannerImage, bgGradient, buttonText, buttonLink, expiresAt, isActive, featuredProductId } = req.body;
        if (!title || !discountText) {
            res.status(400).json({ success: false, message: 'Please provide offer title and discount text.' });
            return;
        }
        const newOffer = {
            _id: `offer_${Date.now()}`,
            title,
            subtitle: subtitle || 'Limited time special promotion across selected items.',
            badge: badge || '⚡ MEGA PROMO',
            discountText,
            discountCode: discountCode || '',
            bannerImage: bannerImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
            bgGradient: bgGradient || 'from-indigo-950 via-purple-900 to-slate-950',
            buttonText: buttonText || 'Shop Offer Now',
            buttonLink: buttonLink || '/shop?filter=offers',
            expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isActive: isActive !== undefined ? !!isActive : true,
            featuredProductId,
            createdAt: new Date()
        };
        dataStore_1.store.offers.unshift(newOffer);
        dataStore_1.store.persist();
        res.status(201).json({
            success: true,
            message: 'Promotional offer published successfully!',
            offer: newOffer
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createOffer = createOffer;
// Admin: Update Offer
const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dataStore_1.store.offers.findIndex(o => o._id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Offer not found.' });
            return;
        }
        const existing = dataStore_1.store.offers[index];
        const { title, subtitle, badge, discountText, discountCode, bannerImage, bgGradient, buttonText, buttonLink, expiresAt, isActive, featuredProductId } = req.body;
        const updated = {
            ...existing,
            title: title ?? existing.title,
            subtitle: subtitle ?? existing.subtitle,
            badge: badge ?? existing.badge,
            discountText: discountText ?? existing.discountText,
            discountCode: discountCode !== undefined ? discountCode : existing.discountCode,
            bannerImage: bannerImage ?? existing.bannerImage,
            bgGradient: bgGradient ?? existing.bgGradient,
            buttonText: buttonText ?? existing.buttonText,
            buttonLink: buttonLink ?? existing.buttonLink,
            expiresAt: expiresAt ? new Date(expiresAt) : existing.expiresAt,
            isActive: isActive !== undefined ? !!isActive : existing.isActive,
            featuredProductId: featuredProductId !== undefined ? featuredProductId : existing.featuredProductId
        };
        dataStore_1.store.offers[index] = updated;
        dataStore_1.store.persist();
        res.json({
            success: true,
            message: 'Promotional offer updated successfully!',
            offer: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOffer = updateOffer;
// Admin: Delete Offer
const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dataStore_1.store.offers.findIndex(o => o._id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Offer not found.' });
            return;
        }
        const removed = dataStore_1.store.offers.splice(index, 1)[0];
        dataStore_1.store.persist();
        res.json({
            success: true,
            message: `Offer "${removed.title}" removed.`,
            offerId: id
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteOffer = deleteOffer;
