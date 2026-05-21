import { IMAGES as I } from './shops.js';

const P = [
  // Product images from designs
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBORlq77eSeCA72gHDThj2ukt8N50E4uSUWXYoqE-JHHwtj0TushzcimNyoxqvQ07QANHja7k02eIRI6vTrYf2hPlG3oJbi4NW2e1XMtpJKn9fEeuRmCXhHdex4TSQm0BL4y59DK2KLCPiypQaRSICzx9hzYwBFJMOQVDeFGsyrt6dQpo9OBoj2JAxSNkUWdQs1S9rcpEiH_6vjvIK-v78CPjQHyRGvlJaweWqhZFFUI_oqucACKjkJ-ZxbpWHdosImbDpsVkz0amon',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAFr6wgk4si02P3T9nzZ6csT2SWeIGOUPYIZ7kC10lpSPtvIAYiDYZrSuVgRLfAkUb7V6duHB_dWXXZ8mEXiwjhztPXJcCI84rW_Jaw6oKX0yHfGSUuxwmp4fFC8H4_XA-LS_zO5HRZ2Zub-OpO09usjqJkzq4I_J2M10VvZ1y_jWt-ZHcvqQCSp5Dk8Lr5uTwi9BbmcluOZZGGRyjSajOlmx5XGOT24XVxvhJazddXtyUjoi8L_LAfzP0sXa3AZ3frl7wo7Z3BjPUD',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAT7v9LkqAY1gBuKE7uaKM5UQGe20MqFVgUKFjWT_tEv5-moOlahPjMwWd4FC1bHXGMAH7Ne-NCw33zi513dkqeW5k8uMgTAIQoS5ObAkhVoG1WQpmnOKQkyQdk0mHyXgZlzCe3CrA1td-vRwPjmpmpoGLzZywk7Y9uejNyjClt-5eebo7jmcunR4cLGJ2Z9BF0rL3af4wyPTDd9Ub3ufST3Jjrp6k1TrUPCC8hIr6LX5sg5m866HLkCOpdIM4gmjltNku6-ut-K-o5',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD3SDPPUPeDbkSPrTWD92RWG5wbRxxNU2K35DtdIfRWsrZX2cSvuxFT-Z_tgDMPI1nZXkDUiVV3JzdX9pVIwXAQs4NR-Nqw5iqzoPvRsjRudel6BqZZDJ5NOe7hN0tIGNcy-FQ6HFH9HqANQ8WVjEx-HD6O7_lQicRmAvvX6lMv4cx2ADqN1utQasrzK5dFOOjSAQZMfJQcr1N7f0Fk8V5hWVie3yCwMN3dEGrzZAKujtR227fk9RuElRQNp18l2fMVNaZdGLFALlfF',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCef0rh4N32iVrDydHfdaa8JoUR-oqlQWP15rEH8_urfRBcd3TyDziITD9i-fVxf3qxZTHXrcK179eH6SzgbLW0W3xmPrzvNXXNu9kmjLTdk1WQGVXrpIwXT0bqZVSaF_xI6Q03XaPWj0PkQG7r1A3muLB56jGhJK_hyW_UbCx1wfH2SXsCK4Js5Guv7UPllngg7jYQa1UzGfrsstYnmPMBC4_fdjDSPcaP0Dy_TG8A38F7-IG3UU2mhSzL31tkXz8ahBsrcy-oVpth',
];

// AR background & overlay
export const AR_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCesLzgrgWvDIBCg1SrQOelfoizAsEnicQDnFwonzqBpNltO0PrI4n3V9-WvJpJ0IPXep_XifThl3xBjeYqnv5srx-KPEb-RRRvNcLSU09c1BSjVHFEygQlJuS7wcCTtY7XajJ2np4TR0VnLi1H2CQqQEQGnB_yj9rjwiYhApB8FxBg-vrItoRKeoI4ePB9_hFUucP-0NUsRUYabAvTdymiBb36Y1NPh7sXOnUaO3Zz59D2sNMIDhqg7K3r4TfWTTnzwqVE2Wda1CP8';
export const AR_OVERLAY = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW8WWbveXclax87kGpr9l4QmXOSE2DBg_P9r8nsCr2nWixlcZOWQG5gYI-8jar_vnK4Sds-XO-XCJAlJIhTij8lfRWQQw7p-SbJ4_1y55uN_EAyPJ9vVlYqx2jk47I0hspOkGFvI_su7TS5HFi1GE4aaVlNzQOaQz7B85_wC1CEqFYiNIF-OUJTBy_YzsyQQb5Zu8IKWyOOVZwR74v-NvWIzNmijfWc5vh9BKTVHlQZyzWRqhkCknx5uvT2wn2kn7ABfa2U7SGGZAm';

export const products = [
  { id:'p1', shopId:'shop-1', title:'Designer Floral Kurti', category:'kurtis', gender:'women', price:1299, sizes:['S','M','L','XL'], color:'Floral Multi', fabric:'100% Premium Rayon', image:P[0], arImage:AR_OVERLAY, arEnabled:true,
    description:'Elevate your everyday style with this premium Designer Floral Kurti. Featuring intricate botanical prints inspired by midnight gardens, this piece combines traditional silhouette with modern digital-print aesthetics. Perfect for both casual outings and festive gatherings.',
    care:['100% Premium Rayon','Breathable and lightweight','Digital placement print','Hand wash cold, dry flat'] },
  { id:'p2', shopId:'shop-1', title:'Midnight Silk Kurti', category:'kurtis', gender:'women', price:1299, sizes:['S','M','L','XL'], color:'Midnight Blue', fabric:'Silk Blend', image:P[1], arImage:AR_OVERLAY, arEnabled:true,
    description:'Luxurious silk blend kurti with a midnight blue palette. The subtle sheen and rich drape create an elegant silhouette perfect for evening events.',
    care:['Silk Blend Fabric','Dry clean recommended','Iron on low heat','Store in garment bag'] },
  { id:'p3', shopId:'shop-1', title:'Neon Threadwork Kurti', category:'kurtis', gender:'women', price:899, sizes:['S','M','L','XL'], color:'Teal', fabric:'Cotton', image:P[2], arImage:AR_OVERLAY, arEnabled:true,
    description:'Statement threadwork embroidery on premium cotton. The neon accent threading adds a modern twist to a classic ethnic silhouette.',
    care:['Premium Cotton','Machine washable','Tumble dry low','Iron on medium'] },
  { id:'p4', shopId:'shop-1', title:'Cyber Flare Anarkali', category:'kurtis', gender:'women', price:2499, sizes:['S','M','L','XL'], color:'Deep Red', fabric:'Georgette', image:P[3], arImage:AR_OVERLAY, arEnabled:true,
    description:'Show-stopping Anarkali with flowing georgette panels. The dramatic flare and rich color make this a standout piece for festivals and celebrations.',
    care:['Pure Georgette','Dry clean only','Steam iron','Handle with care'] },
  { id:'p5', shopId:'shop-1', title:'Geo Print Rayon', category:'kurtis', gender:'women', price:749, sizes:['S','M','L','XL'], color:'Multi Geo', fabric:'Rayon', image:P[4], arImage:AR_OVERLAY, arEnabled:true,
    description:'Abstract geometric patterns on soft rayon fabric. A versatile piece that transitions from office to evening seamlessly.',
    care:['Premium Rayon','Machine washable','Line dry','Iron on low'] },
  { id:'p6', shopId:'shop-2', title:'Premium Tailored Blazer', category:'suits', gender:'men', price:3499, sizes:['S','M','L','XL'], color:'Navy', fabric:'Wool Blend', image:I.mens1, arImage:AR_OVERLAY, arEnabled:true,
    description:'Impeccably tailored blazer in navy wool blend. Sharp shoulders and a slim cut deliver a modern silhouette.',
    care:['Wool Blend','Dry clean only','Steam press','Use padded hanger'] },
  { id:'p7', shopId:'shop-2', title:'Classic White Shirt', category:'shirts', gender:'men', price:999, sizes:['S','M','L','XL'], color:'White', fabric:'Cotton Poplin', image:I.mens2, arImage:AR_OVERLAY, arEnabled:true,
    description:'Crisp cotton poplin shirt with a spread collar. Timeless design that works for every occasion.',
    care:['100% Cotton Poplin','Machine wash warm','Iron on high','Collar stays included'] },
  { id:'p8', shopId:'shop-3', title:'Urban Hoodie', category:'hoodies', gender:'men', price:1599, sizes:['S','M','L','XL'], color:'Grey', fabric:'French Terry', image:I.urban1, arImage:AR_OVERLAY, arEnabled:false,
    description:'Heavyweight French Terry hoodie with a relaxed fit. Kangaroo pocket and ribbed cuffs for the perfect streetwear look.',
    care:['French Terry Cotton','Machine wash cold','Tumble dry medium','Do not bleach'] },
  { id:'p9', shopId:'shop-3', title:'Canvas Sneakers', category:'shoes', gender:'men', price:2199, sizes:['7','8','9','10'], color:'Black', fabric:'Canvas/Rubber', image:I.urban2, arImage:AR_OVERLAY, arEnabled:false,
    description:'Minimalist canvas sneakers with vulcanized rubber sole. Clean lines and durable construction for everyday wear.',
    care:['Canvas Upper','Spot clean','Air dry','Use shoe trees'] },
  { id:'p10', shopId:'shop-4', title:'Royal Silk Saree', category:'sarees', gender:'women', price:4999, sizes:['Free'], color:'Royal Purple', fabric:'Pure Silk', image:I.ethnic1, arImage:AR_OVERLAY, arEnabled:true,
    description:'Handwoven pure silk saree with traditional zari work. A masterpiece of craftsmanship.',
    care:['Pure Silk','Dry clean only','Store folded','Avoid direct sunlight'] },
  { id:'p11', shopId:'shop-5', title:'Casual Denim Jacket', category:'jackets', gender:'men', price:1899, sizes:['S','M','L','XL'], color:'Indigo', fabric:'Denim', image:I.mens1, arImage:AR_OVERLAY, arEnabled:true,
    description:'Classic denim jacket with a modern slim fit. Vintage wash and brass hardware.',
    care:['100% Denim','Machine wash cold','Hang dry','Iron inside out'] },
  { id:'p12', shopId:'shop-5', title:'Printed Palazzo Set', category:'kurtis', gender:'women', price:1499, sizes:['S','M','L','XL'], color:'Dusty Rose', fabric:'Crepe', image:P[2], arImage:AR_OVERLAY, arEnabled:true,
    description:'Coordinated palazzo set in dusty rose crepe. Flowy silhouette with intricate yoke embroidery.',
    care:['Premium Crepe','Hand wash','Drip dry','Light iron'] },
];

export const getProductById = id => products.find(p => p.id === id) || null;
export const getProductsByShop = shopId => products.filter(p => p.shopId === shopId);
export const getProductsByCategory = cat => (!cat||cat==='all') ? products : products.filter(p => p.category === cat);
