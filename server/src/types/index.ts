export interface IUser {
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

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number; // in PKR
  originalPrice?: number; // in PKR
  discountPercentage?: number;
  category: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isOffer: boolean;
  offerTag?: string; // e.g. "MEGA DEAL", "40% OFF", "FLASH SALE"
  rating: number;
  numReviews: number;
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IOffer {
  _id: string;
  title: string;
  subtitle: string;
  badge: string; // e.g. "LIMITED TIME SALE"
  discountText: string; // e.g. "UP TO 50% OFF"
  discountCode?: string; // e.g. "AZADI50"
  bannerImage: string;
  bgGradient: string;
  buttonText: string;
  buttonLink: string;
  expiresAt: Date;
  isActive: boolean;
  featuredProductId?: string;
  createdAt: Date;
}

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number; // in PKR
  quantity: number;
}

export interface IOrder {
  _id: string;
  user?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  orderItems: IOrderItem[];
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'EasyPaisa / JazzCash';
  itemsPrice: number;
  shippingPrice: number;
  taxPrice?: number;
  totalPrice: number; // in PKR
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
}

export interface IStoreSettings {
  storeName: string;
  adminEmail: string;
  phone: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  currency: string;
  address: string;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}
