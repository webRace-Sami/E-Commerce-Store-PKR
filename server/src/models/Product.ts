import mongoose, { Schema } from 'mongoose';

export interface IProductDoc {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isOffer: boolean;
  offerTag?: string;
  rating: number;
  numReviews: number;
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountPercentage: { type: Number, default: 0 },
    category: { type: String, required: true, trim: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    offerTag: { type: String },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    specifications: { type: Map, of: String, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false, timestamps: false }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
