import { Request, Response } from 'express';
import { store } from '../store/dataStore';
import { IOffer } from '../types';

// Get active offers for client-side display (Hero / Banners)
export const getActiveOffers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const active = store.offers.filter(o => o.isActive);
    res.json({ success: true, count: active.length, offers: active });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all offers
export const getAllOffers = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, count: store.offers.length, offers: store.offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create Offer
export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      subtitle,
      badge,
      discountText,
      discountCode,
      bannerImage,
      bgGradient,
      buttonText,
      buttonLink,
      expiresAt,
      isActive,
      featuredProductId
    } = req.body;

    if (!title || !discountText) {
      res.status(400).json({ success: false, message: 'Please provide offer title and discount text.' });
      return;
    }

    const newOffer: IOffer = {
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

    store.offers.unshift(newOffer);
    store.persist();

    res.status(201).json({
      success: true,
      message: 'Promotional offer published successfully!',
      offer: newOffer
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update Offer
export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.offers.findIndex(o => o._id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    const existing = store.offers[index];
    const {
      title,
      subtitle,
      badge,
      discountText,
      discountCode,
      bannerImage,
      bgGradient,
      buttonText,
      buttonLink,
      expiresAt,
      isActive,
      featuredProductId
    } = req.body;

    const updated: IOffer = {
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

    store.offers[index] = updated;
    store.persist();

    res.json({
      success: true,
      message: 'Promotional offer updated successfully!',
      offer: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Offer
export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.offers.findIndex(o => o._id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    const removed = store.offers.splice(index, 1)[0];
    store.persist();

    res.json({
      success: true,
      message: `Offer "${removed.title}" removed.`,
      offerId: id
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
