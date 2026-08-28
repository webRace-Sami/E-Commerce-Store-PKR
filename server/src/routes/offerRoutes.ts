import { Router } from 'express';
import {
  getActiveOffers,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from '../controllers/offerController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

// Public: Get active promo offers
router.get('/', getActiveOffers);

// Admin-only protected routes
router.get('/all', protect, adminOnly, getAllOffers);
router.post('/', protect, adminOnly, createOffer);
router.put('/:id', protect, adminOnly, updateOffer);
router.delete('/:id', protect, adminOnly, deleteOffer);

export default router;
