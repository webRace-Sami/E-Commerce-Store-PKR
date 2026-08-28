import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../store/dataStore';
import { generateToken } from '../middleware/auth';
import { IUser } from '../types';

// Register Customer
export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = store.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = {
      _id: `user_${Date.now()}`,
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: 'user',
      phone,
      address,
      createdAt: new Date()
    };

    store.users.push(newUser);
    store.persist();

    const token = generateToken({ id: newUser._id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
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

// Customer Login
export const loginCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = store.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

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

// Admin Login (Strict Admin verification)
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please enter admin credentials.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = store.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Unauthorized access. This account does not possess administrator privileges.'
      });
      return;
    }

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      return;
    }

    const token = generateToken({ id: user._id, email: user.email, role: 'admin' });

    res.json({
      success: true,
      message: 'Admin authentication verified. Welcome to control panel.',
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

// Get current user profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = store.users.find(u => u._id === req.user?.id);
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
