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

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (supports both /api/* and direct route for serverless environments)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/offers', '/offers'], offerRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/stats', '/stats'], statsRoutes);
app.use(['/api/settings', '/settings'], settingsRoutes);

// Health check endpoint
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
