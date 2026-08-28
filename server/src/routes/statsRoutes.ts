import { Router } from 'express';
import { getAdminStats } from '../controllers/statsController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/admin', protect, adminOnly, getAdminStats);

export default router;
