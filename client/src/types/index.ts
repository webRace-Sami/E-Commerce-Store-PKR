export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number; // in PKR
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
  createdAt: string;
}

export interface Offer {
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
  expiresAt: string;
  isActive: boolean;
  featuredProductId?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
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
  orderItems: OrderItem[];
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'EasyPaisa / JazzCash';
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalOffers: number;
  activeOffers: number;
  lowStockItems: Array<{
    _id: string;
    name: string;
    stock: number;
    price: number;
    category: string;
  }>;
  recentOrders: Order[];
}
