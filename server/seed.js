// Seed script — Populate database with initial mock data
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Shop from './models/Shop.js';
import Product from './models/Product.js';

const IMG = 'https://lh3.googleusercontent.com/aida-public/';

const seedData = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing
  await User.deleteMany({});
  await Shop.deleteMany({});
  await Product.deleteMany({});

  // Create users
  const shopkeeper1 = await User.create({ phone: '+919876543210', name: 'Priya Sharma', role: 'shopkeeper', gender: 'female' });
  const shopkeeper2 = await User.create({ phone: '+918765432109', name: 'Rajesh Kumar', role: 'shopkeeper', gender: 'male' });
  const user1 = await User.create({ phone: '+917654321098', name: 'Test User', role: 'user' });
  console.log('✅ Users created');

  // Create shops
  const shop1 = await Shop.create({
    owner: shopkeeper1._id, name: 'Vogue Ethnic', phone: shopkeeper1.phone,
    address: '142 Fashion Avenue, Cyber City',
    location: { type: 'Point', coordinates: [77.0266, 28.4595] },
    categories: ['women', 'ethnic'], arEnabled: true, verified: true, rating: 4.8, reviewCount: 124,
    images: { storefront: IMG+'AB6AXuClCpYNabDamFmVt2fg70qfq_ay47jbsKLKLeikXQkfT_cdZNy0IeIB7hzvxZy5vy_nF9lB9wVVeoBmI6LytZfnHFA6uv8Q7HOLSpa4LTqNgRaMktjxbqmU5U1GiPwBHuDM7xgji2En-Cgj7FaQ5XgKCM9DUvAaj0siUltuJJ6LEmsIkVBCusTi1qWwd9nF-xiMXYkp8GJ13v0EjkH2A7Kvi3WvhJOzhLFYkLA6eCHOQ2Q35qpL55EUxA0JCAhCH0bHKsAgKmgzVNoE' },
  });
  const shop2 = await Shop.create({
    owner: shopkeeper2._id, name: "Classic Men's Wear", phone: shopkeeper2.phone,
    address: '78 Tailor Street, MG Road',
    location: { type: 'Point', coordinates: [77.0310, 28.4650] },
    categories: ['men', 'western'], arEnabled: true, verified: true, rating: 4.5, reviewCount: 89,
    images: { storefront: IMG+'AB6AXuCtKxh3pZi0I6KpuEXDR-5IltTppGP8xoCOjPQIFQG_C69SctR4PiVKfcOhyWYV6AyYTzcjb0mdYg9o9orjQgv8N3Gu4zneC4dv1TvwCXRadFgdXlXcX5CnEzikzcrlP-UrplqWF6Y017B2odkGP6rfyfZ-iF7E27OenSHt_C5a294QNvKEQJTLYnt_uUxSHNDGmDcW4me_gjEqByM5sPn9Yh3U2NjeYKfv3wJgP0NAPDCWbzQ-vmjrctXKco4VIxls-HIcm7DTTcFS' },
  });
  console.log('✅ Shops created');

  // Product images
  const P = [
    IMG+'AB6AXuBORlq77eSeCA72gHDThj2ukt8N50E4uSUWXYoqE-JHHwtj0TushzcimNyoxqvQ07QANHja7k02eIRI6vTrYf2hPlG3oJbi4NW2e1XMtpJKn9fEeuRmCXhHdex4TSQm0BL4y59DK2KLCPiypQaRSICzx9hzYwBFJMOQVDeFGsyrt6dQpo9OBoj2JAxSNkUWdQs1S9rcpEiH_6vjvIK-v78CPjQHyRGvlJaweWqhZFFUI_oqucACKjkJ-ZxbpWHdosImbDpsVkz0amon',
    IMG+'AB6AXuAFr6wgk4si02P3T9nzZ6csT2SWeIGOUPYIZ7kC10lpSPtvIAYiDYZrSuVgRLfAkUb7V6duHB_dWXXZ8mEXiwjhztPXJcCI84rW_Jaw6oKX0yHfGSUuxwmp4fFC8H4_XA-LS_zO5HRZ2Zub-OpO09usjqJkzq4I_J2M10VvZ1y_jWt-ZHcvqQCSp5Dk8Lr5uTwi9BbmcluOZZGGRyjSajOlmx5XGOT24XVxvhJazddXtyUjoi8L_LAfzP0sXa3AZ3frl7wo7Z3BjPUD',
  ];
  const AR = IMG+'AB6AXuDW8WWbveXclax87kGpr9l4QmXOSE2DBg_P9r8nsCr2nWixlcZOWQG5gYI-8jar_vnK4Sds-XO-XCJAlJIhTij8lfRWQQw7p-SbJ4_1y55uN_EAyPJ9vVlYqx2jk47I0hspOkGFvI_su7TS5HFi1GE4aaVlNzQOaQz7B85_wC1CEqFYiNIF-OUJTBy_YzsyQQb5Zu8IKWyOOVZwR74v-NvWIzNmijfWc5vh9BKTVHlQZyzWRqhkCknx5uvT2wn2kn7ABfa2U7SGGZAm';

  // Create products
  const products = [
    { shop: shop1._id, title: 'Designer Floral Kurti', category: 'kurtis', gender: 'women', price: 1299, mrp: 1899, sizes: ['S','M','L','XL'], fabric: 'Premium Rayon', arEnabled: true, images: { original: P[0], arOverlay: AR, thumbnail: P[0] }, care: ['Hand wash cold','Iron on low','100% Rayon'], description: 'Premium Designer Floral Kurti with intricate botanical prints.' },
    { shop: shop1._id, title: 'Midnight Silk Kurti', category: 'kurtis', gender: 'women', price: 1299, sizes: ['S','M','L','XL'], fabric: 'Silk Blend', arEnabled: true, images: { original: P[1], arOverlay: AR, thumbnail: P[1] }, care: ['Dry clean','Iron low'], description: 'Luxurious silk blend kurti with midnight blue palette.' },
    { shop: shop2._id, title: 'Premium Tailored Blazer', category: 'suits', gender: 'men', price: 3499, mrp: 4999, sizes: ['S','M','L','XL'], fabric: 'Wool Blend', arEnabled: true, images: { original: shop2.images.storefront, arOverlay: AR, thumbnail: shop2.images.storefront }, care: ['Dry clean only','Steam press'], description: 'Impeccably tailored navy blazer.' },
  ];

  await Product.insertMany(products);
  console.log('✅ Products created');
  console.log(`\n🎉 Seed complete! ${await User.countDocuments()} users, ${await Shop.countDocuments()} shops, ${await Product.countDocuments()} products`);
  process.exit(0);
};

seedData().catch(err => { console.error('Seed failed:', err); process.exit(1); });
