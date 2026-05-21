import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, trim: true },
  name: { type: String, default: 'Fashion Lover' },
  avatar: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  role: { type: String, enum: ['user', 'shopkeeper', 'admin'], default: 'user' },
  pin: { type: String, select: false },  // hashed 4-digit PIN (optional)
  bodyMeasurements: {
    height: Number,
    shoulderWidth: Number,
    preferredSize: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], default: 'M' },
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },  // [lng, lat]
  },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });
userSchema.index({ phone: 1 });

userSchema.methods.matchPin = async function(pin) {
  if (!this.pin) return true;
  return bcrypt.compare(pin, this.pin);
};

userSchema.pre('save', async function(next) {
  if (this.isModified('pin') && this.pin) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

export default mongoose.model('User', userSchema);
