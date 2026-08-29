import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import offerRoutes from './routes/offerRoutes';
import orderRoutes from './routes/orderRoutes';
import statsRoutes from './routes/statsRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Bulletproof CORS Configuration for Vercel, Render, Preview URLs & Localhost
app.use(
  cors({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'Pragma'],
    optionsSuccessStatus: 200
  })
);

app.options('*', cors());

// Fallback headers for all responses (including errors or raw responses)
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (supports both /api/* and direct route for serverless environments)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/offers', '/offers'], offerRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/stats', '/stats'], statsRoutes);
app.use(['/api/settings', '/settings'], settingsRoutes);

// Root & Health Check Endpoints
app.get(['/', '/api'], (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'online',
    message: '🚀 SM*Store E-Commerce API Server (Pakistan PKR) is Live & Operational!',
    timestamp: new Date().toISOString(),
    currency: 'PKR',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      offers: '/api/offers',
      orders: '/api/orders',
      auth: '/api/auth',
      settings: '/api/settings',
      stats: '/api/stats/admin'
    }
  });
});

app.use(['/api/health', '/health'], (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'E-Commerce MERN API Server (TypeScript)',
    currency: 'PKR'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server when run directly or in standalone mode
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 E-Commerce Server running on http://localhost:${PORT}`);
  });
}

export default app;
