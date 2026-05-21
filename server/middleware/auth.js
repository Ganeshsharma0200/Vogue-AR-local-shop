import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authorized — no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-pin');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};

export const shopkeeperOnly = (req, res, next) => {
  if (req.user.role !== 'shopkeeper' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Shopkeeper access required' });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
};
