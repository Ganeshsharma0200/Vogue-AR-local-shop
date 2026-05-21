# Product Requirements Document (PRD): LocalShop AR Try-On Marketplace

## 1. Product Vision
LocalShop AR Try-On ek mobile platform hai jo users ko unke aas-pass ki clothing shops se connect karta hai aur unhe dukan jaane se pehle camera-based AR (Augmented Reality) ke zariye kapde try karne ki suvidha deta hai.

## 2. Core Problem
- Local shops digital visibility mein piche hain.
- Users ko trial rooms mein bheed aur time waste pasand nahi.
- Online shopping (Meesho/Flipkart) mein fitting issues aur returns ki problem hoti hai.

## 3. Key Features (MVP)
- **Nearby Shop Discovery:** GPS based shop listing.
- **Product Gallery:** Shopkeepers dwara upload kiye gaye kapde.
- **2D AR Virtual Try-On:** Camera overlay feature body landmarks detect karke.
- **Reserve for Visit:** Pasandaida kapde ko shop par jaakar try/buy karne ke liye reserve karna.
- **Shopkeeper Dashboard:** Products upload aur reservations manage karne ke liye.

## 4. Tech Stack Recommendations
- **Frontend:** Flutter (Cross-platform).
- **AR/CV:** MediaPipe Pose Landmarker, OpenCV.
- **Backend:** Node.js + Express, MongoDB.
- **AI Tools:** Remove.bg (Background removal), Meshy AI (Future 3D).

## 5. User Flow
1. App Open -> Location Permission.
2. Browse Nearby Shops/Products.
3. Select Product -> Click "Try on Camera".
4. Camera opens -> AI overlays clothing on user's body.
5. Save look or Reserve and Navigate to Shop.

---
*Created based on user discussion and AI strategy.*