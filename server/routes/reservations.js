import { Router } from 'express';
import Reservation from '../models/Reservation.js';
import Product from '../models/Product.js';
import { protect, shopkeeperOnly } from '../middleware/auth.js';

const router = Router();

// POST /api/reservations — Create reservation
router.post('/', protect, async (req, res) => {
  try {
    const { productId, size, arScreenshot } = req.body;
    if (!productId || !size) return res.status(400).json({ error: 'Product and size required' });

    const product = await Product.findById(productId).populate('shop');
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check stock
    const stockCount = product.stock.get(size);
    if (stockCount !== undefined && stockCount <= 0) {
      return res.status(400).json({ error: `Size ${size} out of stock` });
    }

    const code = Reservation.generateCode();
    const reservation = await Reservation.create({
      code,
      user: req.user._id,
      shop: product.shop._id,
      product: product._id,
      size,
      arScreenshot: arScreenshot || '',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    res.status(201).json({
      reservation,
      shopName: product.shop.name,
      productTitle: product.title,
      message: `Reserved! Show code ${code} at ${product.shop.name}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/mine — User's reservations
router.get('/mine', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('product', 'title images price')
      .populate('shop', 'name address phone')
      .sort('-createdAt');
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/shop/:shopId — Shop's reservations (shopkeeper)
router.get('/shop/:shopId', protect, shopkeeperOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { shop: req.params.shopId };
    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate('user', 'name phone')
      .populate('product', 'title images price sizes')
      .sort('-createdAt');
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reservations/:id — Update status (shopkeeper confirms/user cancels)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    // User can only cancel their own
    if (req.user.role === 'user' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    reservation.status = status;
    await reservation.save();
    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
