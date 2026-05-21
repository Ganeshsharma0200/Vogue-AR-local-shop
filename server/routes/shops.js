import { Router } from 'express';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import { protect, shopkeeperOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/shops/nearby — Find nearby shops
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10, category, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000, // km to meters
        },
      };
    }
    if (category && category !== 'all') query.categories = category;

    const shops = await Shop.find(query)
      .populate('productCount')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Shop.countDocuments(query);
    res.json({ shops, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/shops/:id — Shop detail
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('productCount');
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    res.json({ shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/shops/:id/products — Shop's products
router.get('/:id/products', async (req, res) => {
  try {
    const { category, sort = '-createdAt' } = req.query;
    const query = { shop: req.params.id, isActive: true };
    if (category) query.category = category;

    const products = await Product.find(query).sort(sort);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shops — Register new shop (shopkeeper)
router.post('/', protect, async (req, res) => {
  try {
    const { name, phone, address, coordinates, categories, hours, description } = req.body;
    if (!name || !address || !coordinates) return res.status(400).json({ error: 'Name, address, coordinates required' });

    // Upgrade user role to shopkeeper
    req.user.role = 'shopkeeper';
    await req.user.save();

    const shop = await Shop.create({
      owner: req.user._id,
      name, phone: phone || req.user.phone, address,
      location: { type: 'Point', coordinates },
      categories: categories || [],
      hours: hours || {},
      description: description || '',
    });

    res.status(201).json({ shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/shops/:id — Update shop
router.put('/:id', protect, shopkeeperOnly, async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!shop) return res.status(404).json({ error: 'Shop not found or unauthorized' });

    Object.assign(shop, req.body);
    await shop.save();
    res.json({ shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/shops/:id/stats — Shop analytics (shopkeeper)
router.get('/:id/stats', protect, shopkeeperOnly, async (req, res) => {
  try {
    const Reservation = (await import('../models/Reservation.js')).default;
    const productCount = await Product.countDocuments({ shop: req.params.id, isActive: true });
    const reservations = await Reservation.countDocuments({ shop: req.params.id });
    const pending = await Reservation.countDocuments({ shop: req.params.id, status: 'pending' });
    const visited = await Reservation.countDocuments({ shop: req.params.id, status: 'visited' });

    res.json({ stats: { productCount, reservations, pending, visited } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
