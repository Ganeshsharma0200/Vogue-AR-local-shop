import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  arTryOnUsed: { type: Boolean, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 1000 },
  category: {
    type: String, required: true,
    enum: ['kurtis', 'suits', 'sarees', 'shirts', 'trousers', 'jackets', 'hoodies', 'dresses', 'tops', 'lehengas', 'shoes', 'accessories'],
  },
  gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, min: 0 },
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free', '6', '7', '8', '9', '10', '11', '12'] }],
  colors: [String],
  fabric: { type: String, default: '' },
  care: [String],
  images: {
    original: { type: String, default: '' },     // Raw upload
    processed: { type: String, default: '' },    // Background removed
    arOverlay: { type: String, default: '' },    // Transparent PNG for AR
    thumbnail: { type: String, default: '' },    // 200px thumb
  },
  dominantColors: [String],                       // Extracted by OpenCV
  arEnabled: { type: Boolean, default: false },
  stock: { type: Map, of: Number, default: {} }, // { S: 5, M: 8, L: 3 }
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [reviewSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ shop: 1 });
productSchema.index({ category: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ arEnabled: 1 });
productSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
