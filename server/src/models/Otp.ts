import mongoose, { Schema } from 'mongoose';

export interface IOtpDoc {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtpDoc>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }
  },
  { timestamps: false }
);

export const OtpModel = mongoose.models.Otp || mongoose.model<IOtpDoc>('Otp', OtpSchema);
