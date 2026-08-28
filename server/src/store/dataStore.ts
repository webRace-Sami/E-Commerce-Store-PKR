import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IUser, IProduct, IOffer, IOrder, IStoreSettings } from '../types';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import { OfferModel } from '../models/Offer';
import { OrderModel } from '../models/Order';
import { OtpModel } from '../models/Otp';
import { SettingsModel } from '../models/Settings';

const DATA_FILE = path.join(__dirname, '../../data_backup.json');

const INITIAL_PRODUCTS: IProduct[] = [
  {
    _id: 'prod_1',
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    description: 'Industry-leading noise canceling with two processors and 8 microphones. Ultra-comfortable lightweight design with soft fit leather. Up to 30-hour battery life with quick charging.',
    price: 98500,
    originalPrice: 115000,
    discountPercentage: 14,
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    isFeatured: true,
    isOffer: true,
    offerTag: 'MEGA DISCOUNT',
    rating: 4.9,
    numReviews: 86,
    specifications: {
      'Battery Life': '30 Hours',
      'Bluetooth': 'v5.2',
      'Noise Cancellation': 'Active Dual Processor',
      'Weight': '250g',
      'Warranty': '1 Year Official'
    },
    createdAt: new Date('2026-01-10')
  },
  {
    _id: 'prod_2',
    name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    price: 435000,
    originalPrice: 460000,
    discountPercentage: 5,
    category: 'Smartphones',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 7,
    isFeatured: true,
    isOffer: false,
    rating: 5.0,
    numReviews: 142,
    specifications: {
      'Chipset': 'Apple A17 Pro (3nm)',
      'Display': '6.7-inch Super Retina XDR OLED 120Hz',
      'Main Camera': '48MP Triple Camera System',
      'Battery': '4422 mAh',
      'PTA Status': 'Official Approved'
    },
    createdAt: new Date('2026-01-12')
  },
  {
    _id: 'prod_3',
    name: 'Samsung Galaxy Watch 6 Classic (47mm, Bluetooth)',
    description: 'Timeless rotating bezel style with advanced health monitoring, ECG, blood pressure tracking, sleep coaching, and sapphire crystal glass.',
    price: 68999,
    originalPrice: 82000,
    discountPercentage: 16,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 4,
    isFeatured: true,
    isOffer: true,
    offerTag: 'LIMITED STOCK',
    rating: 4.7,
    numReviews: 49,
    specifications: {
      'Display': '1.5-inch Super AMOLED',
      'Water Resistance': '5ATM + IP68',
      'Sensors': 'BioActive Sensor, Temperature, Barometer',
      'Battery': 'Up to 40 Hours'
    },
    createdAt: new Date('2026-01-15')
  },
  {
    _id: 'prod_4',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    description: 'Full aluminum CNC machined body, QMK/VIA programmable, hot-swappable double-gasket design with K Pro Banana tactile switches.',
    price: 46500,
    originalPrice: 52000,
    discountPercentage: 10,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 12,
    isFeatured: false,
    isOffer: false,
    rating: 4.8,
    numReviews: 31,
    specifications: {
      'Layout': '75% Compact',
      'Connectivity': 'Bluetooth 5.1 & Type-C Wired',
      'Switches': 'Gateron Jupiter Brown (Hot-swappable)',
      'Keycaps': 'Double-shot KSA PBT'
    },
    createdAt: new Date('2026-01-18')
  },
  {
    _id: 'prod_5',
    name: 'Apple MacBook Air M3 (13.6-inch, 16GB, 512GB SSD)',
    description: 'Supercharged by the next-generation M3 chip. Strikingly thin design with up to 18 hours of battery life and Liquid Retina display.',
    price: 365000,
    originalPrice: 385000,
    discountPercentage: 5,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 8,
    isFeatured: true,
    isOffer: true,
    offerTag: 'HOT PICK',
    rating: 4.9,
    numReviews: 73,
    specifications: {
      'Processor': 'Apple M3 chip (8-core CPU / 10-core GPU)',
      'Memory': '16GB Unified Memory',
      'Storage': '512GB High-speed SSD',
      'Display': '13.6-inch Liquid Retina Display',
      'Weight': '1.24 kg'
    },
    createdAt: new Date('2026-01-20')
  },
  {
    _id: 'prod_6',
    name: 'Anker 737 Power Bank (PowerCore 24K, 140W Ultra-Fast)',
    description: 'Equipped with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or get a 140W ultra-powerful charge.',
    price: 32500,
    originalPrice: 39000,
    discountPercentage: 17,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1609592426867-b50117b4c6e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    isFeatured: false,
    isOffer: false,
    rating: 4.8,
    numReviews: 64,
    specifications: {
      'Capacity': '24,000 mAh',
      'Max Output': '140W High Speed',
      'Ports': '2x USB-C, 1x USB-A',
      'Screen': 'Smart Digital Display'
    },
    createdAt: new Date('2026-01-22')
  },
  {
    _id: 'prod_7',
    name: 'Sony PlayStation 5 Slim Digital Edition (1TB SSD)',
    description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    price: 165000,
    originalPrice: 178000,
    discountPercentage: 7,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 0,
    isFeatured: true,
    isOffer: false,
    rating: 4.9,
    numReviews: 110,
    specifications: {
      'Storage': '1TB Custom NVMe SSD',
      'Resolution': 'Up to 4K 120Hz & 8K Output',
      'Audio': 'Tempest 3D AudioTech',
      'Includes': 'DualSense Wireless Controller'
    },
    createdAt: new Date('2026-01-25')
  },
  {
    _id: 'prod_8',
    name: 'Marshall Emberton II Portable Bluetooth Speaker',
    description: 'Compact portable speaker with loud and vibrant sound that only Marshall can deliver. 30+ hours of portable playtime on a single charge with IP67 water resistance.',
    price: 49500,
    originalPrice: 58000,
    discountPercentage: 15,
    category: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 9,
    isFeatured: false,
    isOffer: true,
    offerTag: 'SPECIAL DISCOUNT',
    rating: 4.8,
    numReviews: 28,
    specifications: {
      'Playtime': '30+ Hours',
      'Waterproof': 'IP67 Dust and Water Resistant',
      'Sound': 'True Stereophonic 360° Sound',
      'Weight': '0.7 kg'
    },
    createdAt: new Date('2026-01-28')
  }
];

const INITIAL_OFFERS: IOffer[] = [
  {
    _id: 'offer_1',
    title: 'Grand Pakistan Mega Electronics Gala',
    subtitle: 'Exclusive discounts on premium Flagship Smartphones, Studio Audio & Laptops.',
    badge: '⚡ FLASH SALE • UP TO 40% OFF',
    discountText: 'SAVE UP TO RS. 35,000 ON TOP TECH',
    discountCode: 'PAKTECH2026',
    bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    buttonText: 'Shop Mega Offers Now',
    buttonLink: '/shop?filter=offers',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    featuredProductId: 'prod_1',
    createdAt: new Date()
  },
  {
    _id: 'offer_2',
    title: 'Premium Audio & Smart Accessories Festival',
    subtitle: 'Upgrade your workspace with studio-grade sound and smart timepieces.',
    badge: '🔥 WEEKEND SPECIAL',
    discountText: 'EXTRA 15% OFF AT CHECKOUT',
    discountCode: 'AUDIO15',
    bannerImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&auto=format&fit=crop&q=80',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
    buttonText: 'Explore Audio Gear',
    buttonLink: '/shop?category=Audio',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isActive: true,
    featuredProductId: 'prod_8',
    createdAt: new Date()
  }
];

interface IOtpEntry {
  otp: string;
  expiresAt: number;
}

class MemoryDataStore {
  public users: IUser[] = [];
  public products: IProduct[] = [];
  public offers: IOffer[] = [];
  public orders: IOrder[] = [];
  public otps: Map<string, IOtpEntry> = new Map();
  public settings: IStoreSettings = {
    storeName: 'SM*Store',
    adminEmail: 'samiullahnawaz942@gmail.com',
    phone: '+92 300 1234567',
    shippingFee: 350,
    freeShippingThreshold: 50000,
    taxRate: 0,
    currency: 'PKR',
    address: 'Karachi, Pakistan'
  };

  constructor() {
    this.init();
  }

  private init() {
    const salt = bcrypt.genSaltSync(10);
    const samiAdminPassword = bcrypt.hashSync('561703SM*Store', salt);

    const primaryAdmin: IUser = {
      _id: 'admin_samiullah',
      name: 'Samiullah Nawaz (Admin)',
      email: 'samiullahnawaz942@gmail.com',
      password: samiAdminPassword,
      role: 'admin',
      phone: '+92 300 1234567',
      createdAt: new Date()
    };

    const secondaryAdmin: IUser = {
      _id: 'user_admin',
      name: 'Store Administrator',
      email: 'admin@smstore.pk',
      password: samiAdminPassword,
      role: 'admin',
      phone: '+92 300 1234567',
      createdAt: new Date()
    };

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = (data.users || []).filter((u: any) => u.name !== 'Hamza Khan' && u.email !== 'user@store.pk');
        this.products = data.products || [];
        this.offers = data.offers || [];
        this.orders = (data.orders || []).filter((o: any) => o.customerName !== 'Hamza Khan');
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
        }

        // Ensure primary admin samiullahnawaz942@gmail.com is always present
        const existingAdmin = this.users.find(u => u.email.toLowerCase() === 'samiullahnawaz942@gmail.com');
        if (!existingAdmin) {
          this.users.unshift(primaryAdmin);
        } else {
          existingAdmin.role = 'admin';
        }
        return;
      } catch (err) {
        console.error('Error reading backup data file, fallback to seed data:', err);
      }
    }

    this.users = [primaryAdmin, secondaryAdmin];
    this.products = [...INITIAL_PRODUCTS];
    this.offers = [...INITIAL_OFFERS];
    this.orders = [];

    this.persist();
  }

  public persist() {
    try {
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            settings: this.settings,
            users: this.users,
            products: this.products,
            offers: this.offers,
            orders: this.orders
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      // Ignored if in read-only environment
    }
  }

  // --- Store Settings Management ---
  public async getSettings(): Promise<IStoreSettings> {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbSettings = await SettingsModel.findOne().lean();
        if (dbSettings) {
          this.settings = {
            storeName: dbSettings.storeName || this.settings.storeName,
            adminEmail: dbSettings.adminEmail || this.settings.adminEmail,
            phone: dbSettings.phone || this.settings.phone,
            shippingFee: dbSettings.shippingFee !== undefined ? dbSettings.shippingFee : this.settings.shippingFee,
            freeShippingThreshold: dbSettings.freeShippingThreshold !== undefined ? dbSettings.freeShippingThreshold : this.settings.freeShippingThreshold,
            taxRate: dbSettings.taxRate !== undefined ? dbSettings.taxRate : this.settings.taxRate,
            currency: dbSettings.currency || this.settings.currency,
            address: dbSettings.address || this.settings.address
          };
          return this.settings;
        }
      } catch (err) {
        // fallback
      }
    }
    return this.settings;
  }

  public async updateSettings(newSettings: Partial<IStoreSettings>): Promise<IStoreSettings> {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
    this.persist();

    if (mongoose.connection.readyState === 1) {
      try {
        await SettingsModel.findOneAndUpdate({}, this.settings, { upsert: true, new: true });
      } catch (err) {
        console.warn('Could not update settings in MongoDB Atlas:', err);
      }
    }
    return this.settings;
  }

  // --- Asynchronous User Management with MongoDB Sync ---
  public async findUserByEmail(email: string): Promise<IUser | null> {
    const cleanEmail = email.toLowerCase().trim();
    let user: IUser | null = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const dbUser = await UserModel.findOne({ email: cleanEmail }).lean();
        if (dbUser) user = dbUser as any as IUser;
      } catch (err) {
        // fallback to memory
      }
    }

    if (!user) {
      user = this.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
    }

    // Always enforce admin role for designated administrator emails
    if (user && (cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk')) {
      user.role = 'admin';
    }

    return user;
  }

  public async findUserById(id: string): Promise<IUser | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbUser = await UserModel.findById(id).lean();
        if (dbUser) return dbUser as any as IUser;
      } catch (err) {
        // fallback
      }
    }
    return this.users.find(u => u._id === id) || null;
  }

  public async createUser(userData: IUser): Promise<IUser> {
    const cleanEmail = userData.email.toLowerCase().trim();
    if (cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk') {
      userData.role = 'admin';
    }

    this.users.push(userData);
    this.persist();

    if (mongoose.connection.readyState === 1) {
      try {
        await UserModel.findOneAndUpdate({ email: userData.email }, userData, { upsert: true, new: true });
      } catch (err) {
        console.warn('Could not save user to MongoDB Atlas:', err);
      }
    }
    return userData;
  }

  public async updateUserPassword(email: string, hashedPassword: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const isAdmin = cleanEmail === 'samiullahnawaz942@gmail.com' || cleanEmail === 'admin@smstore.pk' || cleanEmail === 'admin@store.pk';
    const idx = this.users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx !== -1) {
      this.users[idx].password = hashedPassword;
      if (isAdmin) {
        this.users[idx].role = 'admin';
      }
      this.persist();
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await UserModel.updateOne(
          { email: cleanEmail },
          { $set: { password: hashedPassword, ...(isAdmin ? { role: 'admin' } : {}) } }
        );
      } catch (err) {
        console.warn('Could not update password in MongoDB Atlas:', err);
      }
    }
    return true;
  }

  // --- OTP Verification Store ---
  public async saveOtp(email: string, otp: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otps.set(cleanEmail, { otp, expiresAt });

    if (mongoose.connection.readyState === 1) {
      try {
        await OtpModel.findOneAndUpdate(
          { email: cleanEmail },
          { email: cleanEmail, otp, expiresAt: new Date(expiresAt) },
          { upsert: true, new: true }
        );
      } catch (err) {
        // fallback
      }
    }
  }

  public async verifyOtp(email: string, otp: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    // Check memory OTP
    const memOtp = this.otps.get(cleanEmail);
    if (memOtp && memOtp.otp === cleanOtp && memOtp.expiresAt > Date.now()) {
      return true;
    }

    // Check MongoDB OTP
    if (mongoose.connection.readyState === 1) {
      try {
        const dbOtp = await OtpModel.findOne({ email: cleanEmail, otp: cleanOtp });
        if (dbOtp && new Date(dbOtp.expiresAt).getTime() > Date.now()) {
          return true;
        }
      } catch (err) {
        // fallback
      }
    }

    return false;
  }

  public async clearOtp(email: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    this.otps.delete(cleanEmail);

    if (mongoose.connection.readyState === 1) {
      try {
        await OtpModel.deleteMany({ email: cleanEmail });
      } catch (err) {
        // fallback
      }
    }
  }
}

export const store = new MemoryDataStore();
