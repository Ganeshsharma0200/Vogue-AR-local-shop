import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'visited', 'purchased', 'cancelled', 'expired'],
    default: 'pending',
  },
  arScreenshot: { type: String, default: '' },
  notes: { type: String, default: '' },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

reservationSchema.index({ user: 1, status: 1 });
reservationSchema.index({ shop: 1, status: 1 });
reservationSchema.index({ code: 1 });
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

// Generate unique code
reservationSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'VA-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export default mongoose.model('Reservation', reservationSchema);
