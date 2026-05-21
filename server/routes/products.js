import { Router } from 'express';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import { protect, shopkeeperOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/products — Browse products
router.get('/', async (req, res) => {
  try {
    const { category, gender, search, sort = '-createdAt', page = 1, limit = 20, arOnly } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (gender) query.gender = gender;
    if (arOnly === 'true') query.arEnabled = true;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .populate('shop', 'name address arEnabled')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);
    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id — Product detail
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop', 'name address phone rating reviewCount arEnabled location hours');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products — Add product (shopkeeper)
router.post('/', protect, shopkeeperOnly, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(404).json({ error: 'Register your shop first' });

    const product = await Product.create({ ...req.body, shop: shop._id });
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id — Update product
router.put('/:id', protect, shopkeeperOnly, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    Object.assign(product, req.body);
    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id — Soft delete
router.delete('/:id', protect, shopkeeperOnly, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, shop: shop._id });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/review — Add review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment, arTryOnUsed } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating 1-5 required' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check duplicate
    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ error: 'Already reviewed' });

    product.reviews.push({ user: req.user._id, rating, comment, arTryOnUsed });
    product.reviewCount = product.reviews.length;
    product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();

    // Update shop rating
    const shopProducts = await Product.find({ shop: product.shop, reviewCount: { $gt: 0 } });
    const shopRating = shopProducts.reduce((a, p) => a + p.rating, 0) / shopProducts.length;
    await Shop.findByIdAndUpdate(product.shop, { rating: Math.round(shopRating * 10) / 10 });

    res.json({ message: 'Review added', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
