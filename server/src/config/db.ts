import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('ℹ️ No MONGODB_URI defined. Using in-memory persistent store.');
    return;
  }
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500 // Don't hang if unreachable
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection unavailable (${error.message}). Using in-memory store.`);
  }
};
