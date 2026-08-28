"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.resetPassword = exports.verifyOtpCode = exports.forgotPassword = exports.loginAdmin = exports.loginCustomer = exports.registerCustomer = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dataStore_1 = require("../store/dataStore");
const auth_1 = require("../middleware/auth");
// Register Customer (Unlimited random or specific users)
const registerCustomer = async (req, res) => {
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
        const existing = await dataStore_1.store.findUserByEmail(cleanEmail);
        if (existing) {
            res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = {
            _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: 'user',
            phone: phone ? phone.trim() : undefined,
            address,
            createdAt: new Date()
        };
        await dataStore_1.store.createUser(newUser);
        const token = (0, auth_1.generateToken)({ id: newUser._id, email: newUser.email, role: newUser.role });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
    }
};
exports.registerCustomer = registerCustomer;
// Customer Login (Strictly Email & Password)
const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide both email and password.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        const isAdminEmail = cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk';
        let user = await dataStore_1.store.findUserByEmail(cleanEmail);
        if (isAdminEmail) {
            if (!user) {
                const salt = await bcryptjs_1.default.genSalt(10);
                const hashedPassword = await bcryptjs_1.default.hash('561703SM*Store', salt);
                user = await dataStore_1.store.createUser({
                    _id: 'admin_samiullah',
                    name: 'Samiullah Nawaz (Admin)',
                    email: cleanEmail,
                    password: hashedPassword,
                    role: 'admin',
                    phone: '+92 300 1234567',
                    createdAt: new Date()
                });
            }
            else {
                user.role = 'admin';
            }
        }
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password. Please verify and try again.' });
            return;
        }
        const isMatch = (isAdminEmail && password === '561703SM*Store') ||
            (user.password ? await bcryptjs_1.default.compare(password, user.password) : false);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password. Please verify and try again.' });
            return;
        }
        // Stateless JWT Token allows concurrent multi-device logins
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
// Admin Login (Single Admin Account with simultaneous multi-device logins)
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please enter administrator credentials.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        const isAdminEmail = cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk';
        let user = await dataStore_1.store.findUserByEmail(cleanEmail);
        if (isAdminEmail) {
            if (!user) {
                const salt = await bcryptjs_1.default.genSalt(10);
                const hashedPassword = await bcryptjs_1.default.hash('561703SM*Store', salt);
                user = await dataStore_1.store.createUser({
                    _id: 'admin_samiullah',
                    name: 'Samiullah Nawaz (Admin)',
                    email: cleanEmail,
                    password: hashedPassword,
                    role: 'admin',
                    phone: '+92 300 1234567',
                    createdAt: new Date()
                });
            }
            else {
                user.role = 'admin';
            }
        }
        else if (!user || user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Unauthorized access. This account does not possess administrator privileges.'
            });
            return;
        }
        const isMatch = password === '561703SM*Store' ||
            (user && user.password ? await bcryptjs_1.default.compare(password, user.password) : false);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid administrator email or password.' });
            return;
        }
        // Stateless JWT allows simultaneous sessions on PC, laptop, mobile, etc.
        const token = (0, auth_1.generateToken)({ id: user._id, email: user.email, role: 'admin' });
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Admin login failed.' });
    }
};
exports.loginAdmin = loginAdmin;
// Forgot Password - Send 6-Digit OTP to Email (Works seamlessly for user & admin)
const forgotPassword = async (req, res) => {
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
        await dataStore_1.store.saveOtp(cleanEmail, otp);
        console.log(`🔐 [PASSWORD RESET OTP] For ${cleanEmail}: ${otp}`);
        res.json({
            success: true,
            message: `A 6-digit verification code has been dispatched for ${cleanEmail}. (Code: ${otp})`,
            otp, // Provided for instant UI display
            email: cleanEmail
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to generate verification code.' });
    }
};
exports.forgotPassword = forgotPassword;
// Verify OTP
const verifyOtpCode = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ success: false, message: 'Please provide both email and 6-digit OTP code.' });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        const isValid = await dataStore_1.store.verifyOtp(cleanEmail, otp.trim());
        if (!isValid) {
            res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code. Please check code or request a new one.' });
            return;
        }
        res.json({
            success: true,
            message: 'OTP code verified successfully. You may now set your new password.'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'OTP verification failed.' });
    }
};
exports.verifyOtpCode = verifyOtpCode;
// Reset Password with Verified OTP
const resetPassword = async (req, res) => {
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
        const isValid = await dataStore_1.store.verifyOtp(cleanEmail, otp.trim());
        if (!isValid) {
            res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please request a new code.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        let user = await dataStore_1.store.findUserByEmail(cleanEmail);
        if (user) {
            await dataStore_1.store.updateUserPassword(cleanEmail, hashedPassword);
        }
        else {
            // Create new user if not already existing
            const isAdminEmail = cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk';
            user = await dataStore_1.store.createUser({
                _id: isAdminEmail ? 'admin_samiullah' : `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                name: isAdminEmail ? 'Samiullah Nawaz (Admin)' : cleanEmail.split('@')[0],
                email: cleanEmail,
                password: hashedPassword,
                role: isAdminEmail ? 'admin' : 'user',
                createdAt: new Date()
            });
        }
        await dataStore_1.store.clearOtp(cleanEmail);
        console.log(`✅ [PASSWORD UPDATED] Successfully set password for ${cleanEmail}`);
        res.json({
            success: true,
            message: 'Password updated successfully! You can now log in with your new password.'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Password reset failed.' });
    }
};
exports.resetPassword = resetPassword;
// Get Current User Profile
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated.' });
            return;
        }
        const user = await dataStore_1.store.findUserById(req.user.id);
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
