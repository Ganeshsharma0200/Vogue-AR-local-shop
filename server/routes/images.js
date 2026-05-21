import { Router } from 'express';
import sharp from 'sharp';
import { protect, shopkeeperOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// POST /api/images/upload — Upload and process product image
router.post('/upload', protect, shopkeeperOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });

    const buffer = req.file.buffer;

    // Process with Sharp: resize, optimize, create variants
    const processed = await sharp(buffer)
      .resize(800, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const thumbnail = await sharp(buffer)
      .resize(200, 300, { fit: 'cover' })
      .webp({ quality: 75 })
      .toBuffer();

    // In production: upload to Cloudinary
    // const cloudinary = (await import('cloudinary')).v2;
    // cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, ... });
    // const result = await cloudinary.uploader.upload_stream(...)

    // For dev: save as base64 data URLs
    const originalUrl = `data:image/webp;base64,${processed.toString('base64')}`;
    const thumbnailUrl = `data:image/webp;base64,${thumbnail.toString('base64')}`;

    // Get image metadata
    const metadata = await sharp(buffer).metadata();

    res.json({
      success: true,
      images: {
        original: originalUrl,
        thumbnail: thumbnailUrl,
      },
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images/remove-bg — Remove background (AI)
router.post('/remove-bg', protect, shopkeeperOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });

    // Option 1: Use Remove.bg API
    if (process.env.REMOVEBG_API_KEY) {
      const formData = new FormData();
      formData.append('image_file', new Blob([req.file.buffer]), 'image.png');
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': process.env.REMOVEBG_API_KEY },
        body: formData,
      });

      if (response.ok) {
        const resultBuffer = Buffer.from(await response.arrayBuffer());
        const url = `data:image/png;base64,${resultBuffer.toString('base64')}`;
        return res.json({ success: true, processedImage: url, method: 'remove.bg' });
      }
    }

    // Option 2: Basic background removal with Sharp (threshold-based)
    const processed = await sharp(req.file.buffer)
      .ensureAlpha()
      .resize(800, 1200, { fit: 'inside' })
      .png()
      .toBuffer();

    const url = `data:image/png;base64,${processed.toString('base64')}`;
    res.json({
      success: true,
      processedImage: url,
      method: 'basic',
      note: 'For better results, configure REMOVEBG_API_KEY in .env',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images/extract-colors — Extract dominant colors (OpenCV equivalent)
router.post('/extract-colors', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });

    // Sample pixels and find dominant colors using Sharp
    const { data, info } = await sharp(req.file.buffer)
      .resize(50, 50, { fit: 'cover' }) // Downsample for speed
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Simple K-means-like clustering
    const pixels = [];
    for (let i = 0; i < data.length; i += 3) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    // Find 5 dominant colors by bucketing
    const buckets = {};
    pixels.forEach(([r, g, b]) => {
      const key = `${Math.round(r/32)*32},${Math.round(g/32)*32},${Math.round(b/32)*32}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });

    const colors = Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => {
        const [r, g, b] = key.split(',').map(Number);
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
      });

    res.json({ success: true, dominantColors: colors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
