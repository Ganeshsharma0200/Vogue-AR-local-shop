# VOGUE AR — Complete PRD + Progress Report

---

## 📊 PROGRESS: Kitna Ho Gaya, Kitna Baaki Hai

### ✅ COMPLETED (Frontend MVP — ~35% of full product)

| Feature | Status | Details |
|---------|--------|---------|
| Splash Screen | ✅ Done | Animated logo, particles, auto-navigate |
| Login (Phone OTP) | ✅ Done | Simulated OTP, skip option, localStorage auth |
| Nearby Shop Discovery | ✅ Done | Search, category filter, shop cards, AR badge |
| Shop Profile | ✅ Done | Bento header, product grid, category tabs |
| Product Detail | ✅ Done | Hero image, sizes, description, fabric/care |
| AR Preview (Camera + MediaPipe) | ✅ Done | Real camera, body detection, clothing overlay |
| Favorites | ✅ Done | Add/remove, localStorage persistence |
| Profile | ✅ Done | Stats, reservations, size preference, logout |
| Map View | ✅ Done | Leaflet dark tiles, shop markers, preview |
| Design System | ✅ Done | Full glassmorphism dark theme, animations |
| SPA Router | ✅ Done | Hash routing, page transitions, back nav |
| State Management | ✅ Done | localStorage persistence for all user data |

### ❌ REMAINING (~65% of full product)

| Feature | Priority | Effort | Details |
|---------|----------|--------|---------|
| Backend API (Node.js + Express) | 🔴 Critical | 2-3 weeks | User auth, shop CRUD, product CRUD, reservations |
| MongoDB Database | 🔴 Critical | 1 week | Schema design, Atlas setup, indexing |
| Real Auth (Firebase) | 🔴 Critical | 3-4 days | Phone OTP via Firebase Auth, JWT tokens |
| Shopkeeper Dashboard | 🔴 Critical | 2 weeks | Product upload, inventory mgmt, reservation mgmt |
| Image Upload + Processing | 🟡 High | 1 week | Cloudinary/S3, background removal, compression |
| OpenCV Image Processing | 🟡 High | 2 weeks | Garment segmentation, color extraction, fitting |
| Advanced AR (3D overlays) | 🟡 High | 3-4 weeks | 3D model generation, physics simulation |
| Payment Integration | 🟡 High | 1 week | Razorpay for reservations/deposits |
| Push Notifications | 🟢 Medium | 3 days | FCM for reservation updates |
| PWA (Offline + Install) | 🟢 Medium | 2 days | Service worker, manifest, caching |
| Analytics Dashboard | 🟢 Medium | 1 week | Shop analytics, user behavior tracking |
| Review System | 🟢 Medium | 4 days | Product ratings, shop reviews |
| Chat (Shop ↔ User) | 🟢 Medium | 1 week | Real-time messaging via Socket.io |
| Admin Panel | 🔵 Low | 1 week | Shop verification, content moderation |
| Flutter Native App | 🔵 Low | 4-6 weeks | Convert web app to native mobile |

> **Summary:** Frontend prototype = DONE. Backend + real data + advanced AR = REMAINING.

---

## 🎯 1. Product Vision (Detailed)

**VOGUE AR** ek hyperlocal fashion marketplace hai jo:

1. **Users** ko nearby clothing shops discover karne deta hai (GPS-based)
2. **AR Camera** se kapde body par overlay karke dikhata hai (try before visit)
3. **Reserve** karke shop par jaake buy karne ka option deta hai
4. **Shopkeepers** ko digital storefront + inventory management deta hai

### Why This Matters
- India mein 12 million+ clothing retail shops hain — 95% have ZERO digital presence
- Trial rooms mein average 15-20 min wait hota hai
- Online shopping returns = 25-40% (fitting issues)
- **VOGUE AR solves all three problems**

---

## 🔧 2. Complete Tech Stack (Every Tool + API)

### 2.1 Frontend (Current — Web MVP)

| Tool | Version | Purpose | Cost |
|------|---------|---------|------|
| **Vite** | 6.4 | Build tool, HMR dev server | Free |
| **Vanilla JS** | ES2024 | App logic, no framework overhead | Free |
| **CSS Custom Properties** | CSS3 | Design system tokens | Free |
| **Leaflet** | 1.9.4 | Interactive maps | Free |
| **MediaPipe Tasks-Vision** | Latest | Body pose detection (33 landmarks) | Free |
| **Material Symbols** | CDN | Icon system | Free |
| **Inter Font** | Google Fonts | Typography | Free |

### 2.2 Frontend (Phase 2 — Native App)

| Tool | Purpose | Cost |
|------|---------|------|
| **Flutter** | Cross-platform (Android + iOS) | Free |
| **camera** package | Device camera access | Free |
| **google_mlkit_pose_detection** | On-device body detection | Free |
| **ARCore** (Android) / **ARKit** (iOS) | 3D spatial tracking | Free |
| **flutter_map** | Maps integration | Free |

### 2.3 Backend

| Tool | Purpose | Cost |
|------|---------|------|
| **Node.js 20+** | Server runtime | Free |
| **Express.js** | REST API framework | Free |
| **MongoDB Atlas** | Cloud database | Free (512MB) / $57/mo (dedicated) |
| **Mongoose** | ODM for MongoDB | Free |
| **JWT (jsonwebtoken)** | Auth tokens | Free |
| **bcrypt** | Password hashing | Free |
| **multer** | File upload handling | Free |
| **cors, helmet, rate-limit** | Security middleware | Free |
| **Socket.io** | Real-time chat/notifications | Free |

### 2.4 Authentication

| Tool | Purpose | Cost |
|------|---------|------|
| **Firebase Auth** | Phone OTP verification | Free (10K/mo) then $0.06/verify |
| **Firebase Admin SDK** | Server-side token verification | Free |

### 2.5 Image Storage & Processing

| Tool | Purpose | Cost |
|------|---------|------|
| **Cloudinary** | Image hosting + CDN + transforms | Free (25GB) / $89/mo (Plus) |
| **Remove.bg API** | Background removal from product photos | Free (50/mo) / $0.20/image |
| **Sharp (npm)** | Server-side image resize/compress | Free |
| **Segment Anything (SAM2)** | AI garment segmentation (self-hosted) | Free (GPU needed) |

### 2.6 Computer Vision & AR (OpenCV + MediaPipe)

| Tool | Purpose | How It's Used |
|------|---------|---------------|
| **MediaPipe Pose Landmarker** | 33-point body skeleton detection | Detect shoulders, hips, arms in real-time camera feed |
| **OpenCV.js** | Image processing in browser | Color extraction, edge detection, image warping |
| **OpenCV (Python)** | Server-side image processing | Garment segmentation, perspective transform, mask generation |
| **TensorFlow.js** | Browser ML inference | Custom clothing segmentation model |
| **ONNX Runtime Web** | Run trained models in browser | Virtual try-on model inference |

#### OpenCV Usage in Detail:

```
1. GARMENT SEGMENTATION (Server-side Python)
   ├── Input: Raw product photo from shopkeeper
   ├── cv2.GrabCut() → Remove background
   ├── cv2.findContours() → Find garment edges
   ├── cv2.createCLAHE() → Enhance contrast
   └── Output: Clean garment PNG with alpha channel

2. COLOR EXTRACTION
   ├── Input: Garment image
   ├── cv2.cvtColor(img, cv2.COLOR_BGR_HSV) → Convert to HSV
   ├── cv2.kmeans() → Dominant color clustering
   └── Output: Primary/secondary/accent colors for UI

3. BODY MEASUREMENT ESTIMATION
   ├── Input: MediaPipe landmarks (33 points)
   ├── Calculate shoulder width (landmark 11↔12)
   ├── Calculate torso length (shoulder midpoint → hip midpoint)
   ├── Estimate body proportions
   └── Output: Approximate size recommendation (S/M/L/XL)

4. CLOTHING WARP/OVERLAY (Browser-side)
   ├── Input: Garment PNG + body landmarks
   ├── cv2.getPerspectiveTransform() → Align to body pose
   ├── cv2.warpPerspective() → Warp garment to match body angle
   ├── Alpha blending → Composite on camera feed
   └── Output: Realistic overlay on user's body
```

### 2.7 AI Tools for Datasets & 3D Models

| Tool | Purpose | Cost | URL |
|------|---------|------|-----|
| **Meshy AI** | Generate 3D clothing models from photos | Free (200 credits) / $20/mo | meshy.ai |
| **Tripo AI** | Photo to 3D model (faster) | Free tier / $10/mo | tripo3d.ai |
| **Rodin Gen-2** | High-quality 3D generation | API pricing | hyper3d.ai |
| **Stability AI** | Image generation for missing assets | Free tier | stability.ai |
| **ClothesNet Dataset** | 20K+ clothing images with labels | Free (research) | GitHub |
| **DeepFashion2** | 491K images, 801K clothing items, segmentation masks | Free (research) | GitHub |
| **VITON-HD Dataset** | Virtual try-on paired images (1024×768) | Free (research) | GitHub |
| **DressCode Dataset** | 53K image pairs for virtual try-on | Free (research) | GitHub |

### 2.8 AI Virtual Try-On Models (State of Art)

| Model | What It Does | How to Use |
|-------|-------------|------------|
| **IDM-VTON** | Best open-source virtual try-on | GitHub → run on GPU server |
| **OOTDiffusion** | Outfitting diffusion model | GitHub → HuggingFace |
| **StableVITON** | Stable Diffusion based try-on | GitHub → local GPU |
| **CatVTON** | Lightweight virtual try-on | GitHub → can run on T4 GPU |
| **Kolors Virtual Try-On** | Kwai's try-on model | HuggingFace Space (free) |

> **Recommendation:** Start with **IDM-VTON** or **CatVTON** hosted on a GPU server (RunPod/Vast.ai ~$0.40/hr). Send product image + user photo → get try-on result in 5-10 seconds.

### 2.9 Maps & Location

| Tool | Purpose | Cost |
|------|---------|------|
| **Google Maps Platform** | Geocoding, directions, places | $200 free credit/mo |
| **Leaflet + OpenStreetMap** | Map display (current) | Free |
| **Mapbox** | Alternative premium maps | Free (50K loads/mo) |

### 2.10 Payments

| Tool | Purpose | Cost |
|------|---------|------|
| **Razorpay** | UPI, cards, wallets | 2% per transaction |
| **PhonePe Business** | UPI payments | 0% (promotional) |

### 2.11 Hosting & Deployment

| Tool | Purpose | Cost |
|------|---------|------|
| **Vercel** | Frontend hosting | Free (hobby) / $20/mo (pro) |
| **Railway** | Backend hosting | Free (500hrs) / $5/mo |
| **Render** | Alternative backend | Free (750hrs) / $7/mo |
| **AWS EC2 (GPU)** | AI model inference | $0.50-$1.50/hr |
| **RunPod** | GPU serverless for AI | $0.40/hr (T4) |
| **MongoDB Atlas** | Database | Free (512MB) |
| **Cloudflare** | CDN + DDoS protection | Free |

---

## 📱 3. Complete User Flow (Every Screen)

```
┌─────────────────────────────────────────────────────┐
│                    USER JOURNEY                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. SPLASH SCREEN ──→ 2. LOGIN (Phone OTP)          │
│         │                      │                     │
│         ▼                      ▼                     │
│  3. HOME (Nearby Shops) ◄────────────────────────── │
│         │                                            │
│         ├──→ 4. MAP VIEW (Shop locations)            │
│         │                                            │
│         ├──→ 5. SHOP PROFILE (Products grid)         │
│         │         │                                  │
│         │         ▼                                  │
│         │    6. PRODUCT DETAIL (Sizes, info)          │
│         │         │                                  │
│         │         ├──→ 7. AR TRY-ON (Camera + Body)  │
│         │         │         │                        │
│         │         │         ├──→ Save Photo           │
│         │         │         └──→ Reserve              │
│         │         │                                  │
│         │         └──→ 8. RESERVE CONFIRMATION        │
│         │                                            │
│         ├──→ 9. FAVORITES (Saved items)              │
│         │                                            │
│         └──→ 10. PROFILE (Settings, history)          │
│                                                      │
├─────────────────────────────────────────────────────┤
│               SHOPKEEPER JOURNEY                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. SHOP LOGIN ──→ 2. DASHBOARD                      │
│                         │                            │
│                         ├──→ Add/Edit Products        │
│                         ├──→ Upload Photos            │
│                         ├──→ View Reservations        │
│                         ├──→ Analytics                │
│                         └──→ Shop Settings            │
└─────────────────────────────────────────────────────┘
```

---

## 🗄️ 4. Database Schema (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  phone: "+919876543210",      // Unique
  name: "Rahul Sharma",
  avatar: "cloudinary_url",
  gender: "male",
  bodyMeasurements: {
    height: 175,               // cm
    shoulderWidth: 44,         // cm (from AR)
    preferredSize: "L"
  },
  favorites: [ObjectId],       // Product refs
  location: {
    type: "Point",
    coordinates: [77.0266, 28.4595]
  },
  createdAt: Date,
  lastActive: Date
}
```

### Shops Collection
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId,           // User ref
  name: "Vogue Ethnic",
  phone: "+919876543210",
  address: "142 Fashion Ave, Cyber City",
  location: {
    type: "Point",             // GeoJSON for $near queries
    coordinates: [77.0266, 28.4595]
  },
  categories: ["women", "ethnic"],
  arEnabled: true,
  verified: true,
  rating: 4.8,
  reviewCount: 124,
  images: {
    storefront: "url",
    banner: "url"
  },
  hours: { open: "10:00", close: "21:00" },
  isActive: true,
  createdAt: Date
}
// INDEX: location (2dsphere), categories, rating
```

### Products Collection
```javascript
{
  _id: ObjectId,
  shopId: ObjectId,
  title: "Designer Floral Kurti",
  description: "...",
  category: "kurtis",
  gender: "women",
  price: 1299,
  mrp: 1899,
  sizes: ["S", "M", "L", "XL"],
  colors: ["#8B0000", "#FFD700"],
  fabric: "Premium Rayon",
  care: ["Hand wash", "Iron low"],
  images: {
    original: "url",           // Shopkeeper upload
    processed: "url",          // Background removed
    arOverlay: "url",          // Transparent PNG for AR
    thumbnail: "url"
  },
  arEnabled: true,
  stock: { S: 5, M: 8, L: 3, XL: 2 },
  isActive: true,
  createdAt: Date
}
// INDEX: shopId, category, gender, price
```

### Reservations Collection
```javascript
{
  _id: ObjectId,
  code: "VA-7TT7DW",          // Unique reservation code
  userId: ObjectId,
  shopId: ObjectId,
  productId: ObjectId,
  size: "M",
  status: "pending",          // pending → confirmed → visited → cancelled
  expiresAt: Date,            // 24hr expiry
  arScreenshot: "url",        // User's AR try-on photo
  createdAt: Date
}
```

---

## 🔌 5. Backend API Endpoints

```
AUTH
  POST   /api/auth/send-otp     → Send OTP to phone
  POST   /api/auth/verify-otp   → Verify & get JWT token
  GET    /api/auth/me            → Get current user

SHOPS
  GET    /api/shops/nearby?lat=&lng=&radius=5  → Nearby shops (geospatial)
  GET    /api/shops/:id          → Shop detail
  GET    /api/shops/:id/products → Shop's products
  POST   /api/shops              → Register shop (shopkeeper)
  PUT    /api/shops/:id          → Update shop

PRODUCTS
  GET    /api/products?category=&gender=&sort=  → Browse products
  GET    /api/products/:id       → Product detail
  POST   /api/products           → Add product (shopkeeper)
  PUT    /api/products/:id       → Update product
  DELETE /api/products/:id       → Remove product

RESERVATIONS
  POST   /api/reservations       → Create reservation
  GET    /api/reservations/mine  → User's reservations
  GET    /api/reservations/shop/:id → Shop's reservations
  PUT    /api/reservations/:id   → Update status

IMAGES
  POST   /api/images/upload      → Upload product image
  POST   /api/images/remove-bg   → Remove background (AI)
  POST   /api/images/process     → Generate AR overlay

FAVORITES
  POST   /api/favorites/:productId    → Add
  DELETE /api/favorites/:productId    → Remove
  GET    /api/favorites               → List

AI/AR
  POST   /api/ar/try-on         → AI virtual try-on (send photo + product)
  POST   /api/ar/size-recommend  → Body measurement → size suggestion
```

---

## 🖼️ 6. Image Processing Pipeline

```
SHOPKEEPER UPLOADS PHOTO
         │
         ▼
┌─────────────────────┐
│  1. VALIDATION       │  → Check resolution (min 800×800)
│     (Sharp/Node.js)  │  → Check format (JPG/PNG/WebP)
│                      │  → Compress to < 2MB
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  2. BACKGROUND       │  → Remove.bg API (quick)
│     REMOVAL          │  → OR SAM2 model (self-hosted, free)
│     (AI)             │  → OR OpenCV GrabCut (basic, free)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  3. GARMENT          │  → OpenCV contour detection
│     SEGMENTATION     │  → Create clean alpha mask
│     (OpenCV)         │  → Crop to garment bounds
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  4. COLOR            │  → OpenCV K-Means clustering
│     EXTRACTION       │  → Extract 3-5 dominant colors
│     (OpenCV)         │  → Save as product metadata
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  5. AR OVERLAY       │  → Resize to standard dimensions
│     GENERATION       │  → Optimize alpha channel
│     (OpenCV)         │  → Generate multiple size variants
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  6. UPLOAD           │  → Cloudinary CDN
│     TO CLOUD         │  → Generate thumbnail
│                      │  → Auto-format (WebP)
└─────────────────────┘
```

---

## 📐 7. AR Try-On Architecture (Detailed)

### Current (MVP — Web Browser)
```
CAMERA FEED (getUserMedia)
    │
    ▼
MEDIAPIPE POSE LANDMARKER (33 points)
    │
    ├── Landmark 11 (Left Shoulder)
    ├── Landmark 12 (Right Shoulder)  
    ├── Landmark 23 (Left Hip)
    ├── Landmark 24 (Right Hip)
    │
    ▼
CALCULATE BODY MEASUREMENTS
    │
    ├── Shoulder width = distance(L11, L12)
    ├── Torso height = distance(shoulder_mid, hip_mid)
    ├── Body angle = atan2(L12.y - L11.y, L12.x - L11.x)
    │
    ▼
CLOTHING OVERLAY (Canvas 2D)
    │
    ├── Scale garment to shoulder width × 2.2
    ├── Rotate to match body angle
    ├── Position at shoulder midpoint
    ├── Alpha blend at 90% opacity
    │
    ▼
COMPOSITE OUTPUT (Video + Overlay)
```

### Phase 2 (Advanced — AI-Powered)
```
USER PHOTO + PRODUCT IMAGE
    │
    ▼
IDM-VTON / CatVTON MODEL (GPU Server)
    │
    ├── DensePose estimation (body surface mapping)
    ├── Garment warping (TPS transformation)
    ├── Try-on synthesis (diffusion model)
    │
    ▼
REALISTIC TRY-ON IMAGE
    │
    ├── Accurate fabric draping
    ├── Correct body shape adaptation
    ├── Lighting/shadow matching
    │
    ▼
RETURN TO USER (3-8 seconds)
```

---

## 🗓️ 8. Development Roadmap

### Phase 1: Frontend MVP ✅ DONE (Current)
- Web app with all screens
- Simulated AR with real camera + MediaPipe
- Mock data, localStorage

### Phase 2: Backend + Real Data (3-4 weeks)
- Node.js + Express API
- MongoDB Atlas database
- Firebase phone auth
- Cloudinary image uploads
- Shopkeeper dashboard (web)

### Phase 3: Advanced AR + AI (3-4 weeks)
- OpenCV image processing pipeline
- AI background removal
- IDM-VTON integration for realistic try-on
- Body measurement → size recommendation

### Phase 4: Production Launch (2 weeks)
- PWA features (offline, install)
- Razorpay payments
- Push notifications
- Analytics
- Performance optimization

### Phase 5: Native App (4-6 weeks)
- Flutter app (Android + iOS)
- ARCore/ARKit integration
- On-device ML with google_mlkit

---

## 💰 9. Cost Estimation (Monthly — Production)

| Service | Free Tier | Paid (1000 users/day) |
|---------|-----------|----------------------|
| MongoDB Atlas | 512MB free | $57/mo (M10) |
| Cloudinary | 25GB free | $89/mo |
| Firebase Auth | 10K verifications | ~$60/mo |
| Remove.bg | 50 images/mo | $99/mo (5000 images) |
| GPU Server (AI) | — | $50-100/mo (RunPod) |
| Vercel (Frontend) | Free | $20/mo |
| Railway (Backend) | 500hrs free | $5/mo |
| Domain + SSL | — | $12/year |
| **TOTAL** | **~$0/mo** | **~$400/mo** |

---

## 🔑 10. Key Risks & Solutions

| Risk | Impact | Solution |
|------|--------|----------|
| Low image quality from shopkeepers | AR overlay looks bad | Force min resolution, auto-enhance with OpenCV |
| Camera permission denied | AR doesn't work | Fallback to static try-on with uploaded selfie |
| Slow AI inference | Bad UX | Cache results, show skeleton while loading |
| Shopkeeper adoption | No inventory | Partner with 10-20 local shops first, offer free onboarding |
| Cloth physics unrealistic | User trust drops | Label as "approximate preview", improve with 3D models |

---

*Last Updated: 2026-05-02 | Version: 2.0*
