"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginAdmin = exports.loginCustomer = exports.registerCustomer = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dataStore_1 = require("../store/dataStore");
const auth_1 = require("../middleware/auth");
// Register Customer
const registerCustomer = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        const existing = dataStore_1.store.users.find(u => u.email.toLowerCase() === cleanEmail);
        if (existing) {
            res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = {
            _id: `user_${Date.now()}`,
            name,
            email: cleanEmail,
            password: hashedPassword,
            role: 'user',
            phone,
            address,
            createdAt: new Date()
        };
        dataStore_1.store.users.push(newUser);
        dataStore_1.store.persist();
        const token = (0, auth_1.generateToken)({ id: newUser._id, email: newUser.email, role: newUser.role });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
    }
};
exports.registerCustomer = registerCustomer;
// Customer Login
const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide email and password.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        const user = dataStore_1.store.users.find(u => u.email.toLowerCase() === cleanEmail);
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const isMatch = user.password ? await bcryptjs_1.default.compare(password, user.password) : false;
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const token = (0, auth_1.generateToken)({ id: user._id, email: user.email, role: user.role });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Login failed.' });
    }
};
exports.loginCustomer = loginCustomer;
// Admin Login (Strict Admin verification)
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please enter admin credentials.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        const user = dataStore_1.store.users.find(u => u.email.toLowerCase() === cleanEmail);
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
        const isMatch = user.password ? await bcryptjs_1.default.compare(password, user.password) : false;
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
            return;
        }
        const token = (0, auth_1.generateToken)({ id: user._id, email: user.email, role: 'admin' });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Admin login failed.' });
    }
};
exports.loginAdmin = loginAdmin;
// Get current user profile
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated.' });
            return;
        }
        const user = dataStore_1.store.users.find(u => u._id === req.user?.id);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMe = getMe;
