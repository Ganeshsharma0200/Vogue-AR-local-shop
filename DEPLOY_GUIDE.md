# VOGUE AR — Deployment Instructions

## Frontend (Vercel) — 5 Minutes

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Build & Deploy
```bash
cd app
npm run build
vercel --prod
```

### Step 3: Set Environment Variable
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL = https://your-backend.railway.app/api
```

---

## Backend (Railway) — 10 Minutes

### Step 1: Go to railway.app → New Project → Deploy from GitHub

### Step 2: Set Environment Variables in Railway Dashboard:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/voguear
JWT_SECRET=<generate: openssl rand -hex 32>
JWT_EXPIRES_IN=30d
CLIENT_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=<from cloudinary.com>
CLOUDINARY_API_KEY=<from cloudinary.com>
CLOUDINARY_API_SECRET=<from cloudinary.com>
REMOVEBG_API_KEY=<from remove.bg>
```

### Step 3: Railway will auto-deploy. Note the URL (e.g. `https://vogue-ar-server.up.railway.app`)

---

## MongoDB Atlas — 10 Minutes

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account → Build a Cluster (M0 Free Tier)
3. Create Database User (username + password)
4. Network Access → Allow from Anywhere (0.0.0.0/0)
5. Connect → Copy connection string
6. Replace `<password>` in the URI
7. Paste into Railway's `MONGODB_URI` env var

### Seed the database:
```bash
cd server
MONGODB_URI="your_atlas_uri" npm run seed
```

---

## Firebase Auth — 15 Minutes

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create Project → Enable Authentication
3. Sign-in Methods → Enable Phone
4. Project Settings → Service Accounts → Generate Key
5. Add to Railway env vars

---

## Cloudinary — 5 Minutes

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up free → Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Add to Railway env vars

---

## Remove.bg — 2 Minutes

1. Go to [remove.bg/api](https://remove.bg/api)
2. Sign up → Get API Key (50 free/month)
3. Add to Railway env vars

---

## After All Setup:

1. Update `app/vercel.json` — replace `your-backend.railway.app` with actual Railway URL
2. Redeploy frontend: `cd app && vercel --prod`
3. Test: Open your Vercel URL → all features should work with real data!
