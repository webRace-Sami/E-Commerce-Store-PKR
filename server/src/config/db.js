"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Product_1 = require("../models/Product");
const Offer_1 = require("../models/Offer");
const Order_1 = require("../models/Order");
const dataStore_1 = require("../store/dataStore");
const DEFAULT_MONGO_URI = 'mongodb+srv://samiullahnawaz942_db_user:IIJUllXitmg0FnhA@cluster0.2didtxe.mongodb.net/ecommerce_db?retryWrites=true&w=majority&appName=Cluster0';
const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGO_URI;
    try {
        const conn = await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000
        });
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        // Sync seed data to MongoDB Atlas if collections are empty
        await syncInitialDatabase();
    }
    catch (error) {
        console.warn(`⚠️ MongoDB Atlas connection notice: (${error.message}). Running with persistent resilient data store.`);
    }
};
exports.connectDB = connectDB;
async function syncInitialDatabase() {
    try {
        // 1. Sync / Seed Admin and initial users
        const samiAdmin = dataStore_1.store.users.find(u => u.email.toLowerCase() === 'samiullahnawaz942@gmail.com');
        if (samiAdmin) {
            await User_1.UserModel.findOneAndUpdate({ email: 'samiullahnawaz942@gmail.com' }, {
                _id: samiAdmin._id,
                name: samiAdmin.name,
                email: 'samiullahnawaz942@gmail.com',
                password: samiAdmin.password,
                role: 'admin',
                phone: samiAdmin.phone,
                createdAt: new Date()
            }, { upsert: true, new: true });
            console.log('👑 Admin account (samiullahnawaz942@gmail.com) verified in MongoDB Atlas.');
        }
        const userCount = await User_1.UserModel.countDocuments();
        if (userCount <= 1) {
            console.log('🌱 Seeding users into MongoDB Atlas...');
            for (const u of dataStore_1.store.users) {
                await User_1.UserModel.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
            }
        }
        // 2. Sync Products
        const productCount = await Product_1.ProductModel.countDocuments();
        if (productCount === 0) {
            console.log('🌱 Seeding catalog products into MongoDB Atlas...');
            for (const p of dataStore_1.store.products) {
                await Product_1.ProductModel.findOneAndUpdate({ _id: p._id }, p, { upsert: true });
            }
        }
        // 3. Sync Offers
        const offerCount = await Offer_1.OfferModel.countDocuments();
        if (offerCount === 0) {
            console.log('🌱 Seeding promotional offers into MongoDB Atlas...');
            for (const o of dataStore_1.store.offers) {
                await Offer_1.OfferModel.findOneAndUpdate({ _id: o._id }, o, { upsert: true });
            }
        }
        // 4. Sync Orders
        const orderCount = await Order_1.OrderModel.countDocuments();
        if (orderCount === 0) {
            for (const ord of dataStore_1.store.orders) {
                await Order_1.OrderModel.findOneAndUpdate({ _id: ord._id }, ord, { upsert: true });
            }
        }
        console.log('✨ MongoDB Atlas synchronization complete.');
    }
    catch (syncErr) {
        console.warn('Sync notice:', syncErr.message);
    }
}
