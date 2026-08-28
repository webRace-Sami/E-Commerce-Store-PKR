import mongoose from 'mongoose';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import { OfferModel } from '../models/Offer';
import { OrderModel } from '../models/Order';
import { store } from '../store/dataStore';

const DEFAULT_MONGO_URI =
  'mongodb+srv://samiullahnawaz942_db_user:IIJUllXitmg0FnhA@cluster0.2didtxe.mongodb.net/ecommerce_db?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);

    // Sync seed data to MongoDB Atlas if collections are empty
    await syncInitialDatabase();
  } catch (error: any) {
    console.warn(`⚠️ MongoDB Atlas connection notice: (${error.message}). Running with persistent resilient data store.`);
  }
};

async function syncInitialDatabase() {
  try {
    // 1. Sync / Seed Admin and initial users
    const samiAdmin = store.users.find(u => u.email.toLowerCase() === 'samiullahnawaz942@gmail.com');
    if (samiAdmin) {
      await UserModel.findOneAndUpdate(
        { email: 'samiullahnawaz942@gmail.com' },
        {
          _id: samiAdmin._id,
          name: samiAdmin.name,
          email: 'samiullahnawaz942@gmail.com',
          password: samiAdmin.password,
          role: 'admin',
          phone: samiAdmin.phone,
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
      console.log('👑 Admin account (samiullahnawaz942@gmail.com) verified in MongoDB Atlas.');
    }

    const userCount = await UserModel.countDocuments();
    if (userCount <= 1) {
      console.log('🌱 Seeding users into MongoDB Atlas...');
      for (const u of store.users) {
        await UserModel.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
      }
    }

    // 2. Sync Products
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding catalog products into MongoDB Atlas...');
      for (const p of store.products) {
        await ProductModel.findOneAndUpdate({ _id: p._id }, p, { upsert: true });
      }
    }

    // 3. Sync Offers
    const offerCount = await OfferModel.countDocuments();
    if (offerCount === 0) {
      console.log('🌱 Seeding promotional offers into MongoDB Atlas...');
      for (const o of store.offers) {
        await OfferModel.findOneAndUpdate({ _id: o._id }, o, { upsert: true });
      }
    }

    // 4. Sync Orders
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      for (const ord of store.orders) {
        await OrderModel.findOneAndUpdate({ _id: ord._id }, ord, { upsert: true });
      }
    }

    console.log('✨ MongoDB Atlas synchronization complete.');
  } catch (syncErr: any) {
    console.warn('Sync notice:', syncErr.message);
  }
}
