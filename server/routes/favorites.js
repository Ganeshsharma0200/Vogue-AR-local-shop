import { Router } from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// POST /api/favorites/:productId — Add to favorites
router.post('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    user.favorites.push(req.params.productId);
    await user.save();
    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/favorites/:productId — Remove from favorites
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/favorites — List favorites
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'shop', select: 'name' },
    });
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
