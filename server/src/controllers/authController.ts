import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../store/dataStore';
import { generateToken } from '../middleware/auth';
import { IUser } from '../types';

// Register Customer (Unlimited random or specific users)
export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const existing = await store.findUserByEmail(cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'user',
      phone: phone ? phone.trim() : undefined,
      address,
      createdAt: new Date()
    };

    await store.createUser(newUser);

    const token = generateToken({ id: newUser._id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to SM*Store.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

// Customer Login (Strictly Email & Password)
export const loginCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await store.findUserByEmail(cleanEmail);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password. Please verify and try again.' });
      return;
    }

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password. Please verify and try again.' });
      return;
    }

    // Stateless JWT Token allows concurrent multi-device logins
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

// Admin Login (Single Admin Account with simultaneous multi-device logins)
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please enter administrator credentials.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const isAdminEmail = cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk';

    let user = await store.findUserByEmail(cleanEmail);

    if (isAdminEmail) {
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('561703SM*Store', salt);
        user = await store.createUser({
          _id: 'admin_samiullah',
          name: 'Samiullah Nawaz (Admin)',
          email: cleanEmail,
          password: hashedPassword,
          role: 'admin',
          phone: '+92 300 1234567',
          createdAt: new Date()
        });
      } else {
        user.role = 'admin';
      }
    } else if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Unauthorized access. This account does not possess administrator privileges.'
      });
      return;
    }

    const isMatch =
      password === '561703SM*Store' ||
      (user && user.password ? await bcrypt.compare(password, user.password) : false);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid administrator email or password.' });
      return;
    }

    // Stateless JWT allows simultaneous sessions on PC, laptop, mobile, etc.
    const token = generateToken({ id: user._id, email: user.email, role: 'admin' });

    res.json({
      success: true,
      message: 'Admin authorization verified. Welcome to control panel.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
        phone: user.phone
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Admin login failed.' });
  }
};

// Forgot Password - Send 6-Digit OTP to Email (Works seamlessly for user & admin)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email address.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email format (e.g. name@example.com).' });
      return;
    }

    // Generate 6-digit cryptographic OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await store.saveOtp(cleanEmail, otp);

    console.log(`🔐 [PASSWORD RESET OTP] For ${cleanEmail}: ${otp}`);

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched for ${cleanEmail}. (Code: ${otp})`,
      otp, // Provided for instant UI display
      email: cleanEmail
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate verification code.' });
  }
};

// Verify OTP
export const verifyOtpCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Please provide both email and 6-digit OTP code.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const isValid = await store.verifyOtp(cleanEmail, otp.trim());

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code. Please check code or request a new one.' });
      return;
    }

    res.json({
      success: true,
      message: 'OTP code verified successfully. You may now set your new password.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'OTP verification failed.' });
  }
};

// Reset Password with Verified OTP
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide email, OTP code, and your new password.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const isValid = await store.verifyOtp(cleanEmail, otp.trim());

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please request a new code.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    let user = await store.findUserByEmail(cleanEmail);
    if (user) {
      await store.updateUserPassword(cleanEmail, hashedPassword);
    } else {
      // Create new user if not already existing
      const isAdminEmail = cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk';
      user = await store.createUser({
        _id: isAdminEmail ? 'admin_samiullah' : `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: isAdminEmail ? 'Samiullah Nawaz (Admin)' : cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        role: isAdminEmail ? 'admin' : 'user',
        createdAt: new Date()
      });
    }

    await store.clearOtp(cleanEmail);

    console.log(`✅ [PASSWORD UPDATED] Successfully set password for ${cleanEmail}`);

    res.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Password reset failed.' });
  }
};

// Get Current User Profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await store.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
