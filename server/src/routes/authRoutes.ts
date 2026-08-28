import { Router } from 'express';
import {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  forgotPassword,
  verifyOtpCode,
  resetPassword,
  getMe
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/admin/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtpCode);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;
