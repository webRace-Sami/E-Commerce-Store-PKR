import mongoose, { Schema } from 'mongoose';

export interface IUserDoc {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, trim: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true }
    },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false, timestamps: false }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
