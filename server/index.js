import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import shopRoutes from './routes/shops.js';
import productRoutes from './routes/products.js';
import reservationRoutes from './routes/reservations.js';
import imageRoutes from './routes/images.js';
import favoriteRoutes from './routes/favorites.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ── Middleware ────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// ── API Routes ───────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/favorites', favoriteRoutes);

// ── Health Check ─────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'VOGUE AR API', version: '1.0.0', time: new Date().toISOString() });
});

// ── API Docs ─────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'VOGUE AR API',
    version: '1.0.0',
    endpoints: {
      auth: { 'POST /api/auth/send-otp': 'Send OTP', 'POST /api/auth/verify-otp': 'Verify & Login', 'GET /api/auth/me': 'Profile' },
      shops: { 'GET /api/shops/nearby?lat=&lng=': 'Nearby shops', 'GET /api/shops/:id': 'Shop detail', 'POST /api/shops': 'Register shop' },
      products: { 'GET /api/products': 'Browse', 'GET /api/products/:id': 'Detail', 'POST /api/products': 'Add (shopkeeper)', 'POST /api/products/:id/review': 'Review' },
      reservations: { 'POST /api/reservations': 'Reserve', 'GET /api/reservations/mine': 'My reservations' },
      images: { 'POST /api/images/upload': 'Upload', 'POST /api/images/remove-bg': 'Remove BG', 'POST /api/images/extract-colors': 'Colors' },
      favorites: { 'POST /api/favorites/:id': 'Add', 'DELETE /api/favorites/:id': 'Remove', 'GET /api/favorites': 'List' },
    },
  });
});

// ── Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// ── 404 Handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     VOGUE AR API Server v1.0.0        ║
  ║     Port: ${PORT}                         ║
  ║     Env: ${process.env.NODE_ENV || 'development'}                ║
  ║     Docs: http://localhost:${PORT}/api    ║
  ╚═══════════════════════════════════════╝
  `);
});

export default app;
