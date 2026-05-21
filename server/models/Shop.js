import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },  // [lng, lat]
  },
  categories: [{ type: String, enum: ['men', 'women', 'ethnic', 'western', 'kids', 'accessories'] }],
  arEnabled: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  images: {
    storefront: { type: String, default: '' },
    banner: { type: String, default: '' },
  },
  hours: {
    open: { type: String, default: '10:00' },
    close: { type: String, default: '21:00' },
  },
  description: { type: String, default: '', maxlength: 500 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

shopSchema.index({ location: '2dsphere' });
shopSchema.index({ categories: 1 });
shopSchema.index({ rating: -1 });
shopSchema.index({ owner: 1 });

// Virtual: get products count
shopSchema.virtual('productCount', {
  ref: 'Product', localField: '_id', foreignField: 'shop', count: true,
});

shopSchema.set('toJSON', { virtuals: true });
shopSchema.set('toObject', { virtuals: true });

export default mongoose.model('Shop', shopSchema);
