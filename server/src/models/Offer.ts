import mongoose, { Schema } from 'mongoose';

export interface IOfferDoc {
  _id: string;
  title: string;
  subtitle: string;
  badge: string;
  discountText: string;
  discountCode?: string;
  bannerImage: string;
  bgGradient: string;
  buttonText: string;
  buttonLink: string;
  expiresAt: Date;
  isActive: boolean;
  featuredProductId?: string;
  createdAt: Date;
}

const OfferSchema = new Schema<IOfferDoc>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    badge: { type: String, required: true },
    discountText: { type: String, required: true },
    discountCode: { type: String },
    bannerImage: { type: String, required: true },
    bgGradient: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    featuredProductId: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false, timestamps: false }
);

export const OfferModel = mongoose.models.Offer || mongoose.model<IOfferDoc>('Offer', OfferSchema);
