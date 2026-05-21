import { Router } from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/send-otp — Send OTP (simulated in dev)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) return res.status(400).json({ error: 'Valid phone required' });

    // In production: use Firebase Auth / MSG91 / Twilio
    // For dev: OTP is always 1234
    console.log(`📱 OTP sent to ${phone}: 1234 (dev mode)`);
    res.json({ success: true, message: 'OTP sent', devOtp: process.env.NODE_ENV === 'development' ? '1234' : undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-otp — Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    // Dev mode: accept any 4-digit OTP
    if (process.env.NODE_ENV !== 'development') {
      // Production: verify with Firebase Admin SDK
      // const decodedToken = await admin.auth().verifyIdToken(otp);
    }

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name: 'Fashion Lover' });
    }

    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, phone: user.phone, name: user.name, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/me — Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, gender, bodyMeasurements, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (bodyMeasurements) user.bodyMeasurements = { ...user.bodyMeasurements, ...bodyMeasurements };
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
