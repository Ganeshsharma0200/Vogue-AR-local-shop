/* ============================================================
   AR PREVIEW — Real Camera + MediaPipe Pose + Clothing Overlay
   ============================================================ */
import { getProductById } from '../data/products.js';
import { getState, setState, addReservation } from '../state.js';
import { showToast } from '../components/toast.js';
import { goBack } from '../router.js';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

let poseLandmarker = null;
let animationId = null;
let stream = null;

// Key landmarks
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;

async function initPoseDetection() {
  if (poseLandmarker) return poseLandmarker;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
    });
    return poseLandmarker;
  } catch (e) {
    console.warn('MediaPipe GPU failed, trying CPU...', e);
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'CPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
    });
    return poseLandmarker;
  }
}

function cleanup() {
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
}

export async function renderARPreview(container, params) {
  const product = getProductById(params.id);
  if (!product) { window.location.hash = '#/'; return; }
  const state = getState();
  let selectedSize = state.selectedSize || 'M';
  let scale = 1.0;
  let useFrontCamera = true;
  let poseDetected = false;
  let clothOpacity = 0.92;

  // Cleanup on navigation away
  const onHashChange = () => { cleanup(); window.removeEventListener('hashchange', onHashChange); };
  window.addEventListener('hashchange', onHashChange);

  container.innerHTML = `
    <div class="ar-screen" id="ar-screen">
      <!-- Camera Video Feed -->
      <video id="ar-video" autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;transform:scaleX(-1)"></video>

      <!-- Canvas for clothing overlay -->
      <canvas id="ar-canvas" style="position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none"></canvas>

      <!-- Pose skeleton canvas (debug/visual) -->
      <canvas id="pose-canvas" style="position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;opacity:0.3"></canvas>

      <!-- Loading State -->
      <div id="ar-loading" style="position:absolute;inset:0;z-index:30;background:var(--background);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;transition:opacity 0.5s">
        <div class="pulse-glow" style="width:80px;height:80px;border-radius:50%;background:rgba(183,109,255,0.1);border:2px solid rgba(183,109,255,0.3);display:flex;align-items:center;justify-content:center">
          <span class="material-symbols-outlined" style="font-size:36px;color:var(--primary)">view_in_ar</span>
        </div>
        <p style="font-size:14px;color:var(--on-surface-variant)" id="loading-text">Initializing Camera...</p>
        <div style="width:160px;height:3px;background:var(--surface-container-high);border-radius:var(--radius-full);overflow:hidden">
          <div class="gradient-shift" style="width:60%;height:100%;background:linear-gradient(90deg,var(--inverse-primary),var(--primary-container),var(--secondary));border-radius:var(--radius-full)"></div>
        </div>
      </div>

      <!-- Scanning Reticle -->
      <div id="reticle" style="position:absolute;top:10%;bottom:22%;left:10%;right:10%;z-index:5;pointer-events:none;opacity:0;transition:opacity 0.5s">
        <div style="position:absolute;top:0;left:0;width:40px;height:40px;border-top:2px solid var(--secondary);border-left:2px solid var(--secondary);border-radius:8px 0 0 0" class="reticle-blink"></div>
        <div style="position:absolute;top:0;right:0;width:40px;height:40px;border-top:2px solid var(--secondary);border-right:2px solid var(--secondary);border-radius:0 8px 0 0" class="reticle-blink"></div>
        <div style="position:absolute;bottom:0;left:0;width:40px;height:40px;border-bottom:2px solid var(--secondary);border-left:2px solid var(--secondary);border-radius:0 0 0 8px" class="reticle-blink"></div>
        <div style="position:absolute;bottom:0;right:0;width:40px;height:40px;border-bottom:2px solid var(--secondary);border-right:2px solid var(--secondary);border-radius:0 0 8px 0" class="reticle-blink"></div>
      </div>

      <!-- Top Bar -->
      <header class="glass-panel" style="position:absolute;top:0;width:100%;z-index:10;display:flex;justify-content:space-between;align-items:center;height:56px;padding:0 16px;border-bottom:1px solid rgba(255,255,255,0.1)">
        <button id="ar-back" style="color:var(--primary);padding:8px">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div style="text-align:center">
          <h1 style="font-size:16px;font-weight:700;color:var(--on-surface)">AR Try-On</h1>
          <p style="font-size:10px;color:var(--on-surface-variant)" id="ar-status">Loading...</p>
        </div>
        <button id="camera-flip" style="color:var(--primary);padding:8px">
          <span class="material-symbols-outlined">flip_camera_ios</span>
        </button>
      </header>

      <!-- Guidance Pill -->
      <div id="guidance-pill" style="position:absolute;top:68px;left:50%;transform:translateX(-50%);z-index:10;opacity:0;transition:opacity 0.5s">
        <div class="glass-panel" style="padding:6px 16px;border-radius:var(--radius-full);display:flex;align-items:center;gap:6px;white-space:nowrap">
          <span class="material-symbols-outlined" style="font-size:14px;color:var(--secondary)">center_focus_weak</span>
          <span style="font-size:12px;font-weight:600;color:var(--on-surface)" id="guidance-text">Stand back and face the camera</span>
        </div>
      </div>

      <!-- Pose Detection Indicator -->
      <div id="pose-indicator" style="position:absolute;top:68px;right:16px;z-index:10;opacity:0;transition:opacity 0.3s">
        <div class="glass-panel" style="padding:4px 10px;border-radius:var(--radius-full);display:flex;align-items:center;gap:4px">
          <div id="pose-dot" style="width:8px;height:8px;border-radius:50%;background:#ef4444;transition:background 0.3s"></div>
          <span style="font-size:10px;font-weight:600;color:var(--on-surface)" id="pose-label">No body</span>
        </div>
      </div>

      <!-- Product Info Badge -->
      <div style="position:absolute;top:100px;left:16px;z-index:10">
        <div class="glass-panel" style="padding:8px 12px;border-radius:var(--radius-lg);display:flex;align-items:center;gap:8px;max-width:200px">
          <img src="${product.image}" alt="" style="width:36px;height:36px;border-radius:var(--radius);object-fit:cover" />
          <div style="min-width:0">
            <p style="font-size:11px;font-weight:600;color:var(--on-surface)" class="truncate">${product.title}</p>
            <p style="font-size:11px;font-weight:700;color:var(--primary)">₹${product.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <!-- Scale Control -->
      <div style="position:absolute;right:12px;top:50%;transform:translateY(-50%);z-index:10;display:flex;flex-direction:column;gap:12px;opacity:0;transition:opacity 0.5s" id="scale-control">
        <div class="glass-panel" style="padding:8px;border-radius:var(--radius-xl);display:flex;flex-direction:column;align-items:center;gap:8px">
          <button id="scale-up" style="width:32px;height:32px;border-radius:50%;background:rgba(221,183,255,0.15);display:flex;align-items:center;justify-content:center;border:1px solid rgba(221,183,255,0.3)">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">add</span>
          </button>
          <span style="font-size:10px;color:var(--on-surface-variant);letter-spacing:0.1em" id="scale-label">100%</span>
          <button id="scale-down" style="width:32px;height:32px;border-radius:50%;background:rgba(221,183,255,0.15);display:flex;align-items:center;justify-content:center;border:1px solid rgba(221,183,255,0.3)">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">remove</span>
          </button>
        </div>
        <div class="glass-panel" style="padding:8px;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center">
          <button id="opacity-toggle" style="display:flex;align-items:center;justify-content:center">
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--tertiary)">opacity</span>
          </button>
        </div>
      </div>

      <!-- Bottom Controls -->
      <div style="position:absolute;bottom:0;width:100%;z-index:10;padding:0 16px 20px;padding-top:24px;background:linear-gradient(to top, rgba(9,9,11,0.95), rgba(9,9,11,0.6), transparent)">
        <!-- Size Switcher -->
        <div style="display:flex;justify-content:center;margin-bottom:16px">
          <div class="glass-panel" style="border-radius:var(--radius-full);padding:3px;display:flex;border:1px solid rgba(255,255,255,0.15)" id="ar-sizes">
            ${product.sizes.map(s => `
              <button class="ar-size-btn" data-size="${s}" style="padding:6px 20px;border-radius:var(--radius-full);font-size:13px;font-weight:600;letter-spacing:0.05em;transition:all 0.2s;${s===selectedSize?'background:rgba(183,109,255,0.3);color:var(--primary);border:1px solid rgba(183,109,255,0.3)':'color:var(--on-surface-variant)'}">${s}</button>
            `).join('')}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;justify-content:center;align-items:center;gap:16px;max-width:400px;margin:0 auto">
          <button id="photo-btn" class="glass-panel" style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.2);flex-shrink:0" aria-label="Capture">
            <span class="material-symbols-outlined" style="font-size:22px">photo_camera</span>
          </button>
          <button id="reserve-ar-btn" class="neon-button" style="flex:1;padding:14px;border-radius:var(--radius-xl);font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;max-width:240px">
            Reserve Now <span class="material-symbols-outlined" style="font-size:20px">shopping_bag</span>
          </button>
          <button id="skeleton-toggle" class="glass-panel" style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.2);flex-shrink:0" aria-label="Skeleton">
            <span class="material-symbols-outlined" style="font-size:22px">skeleton</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // AR screen specific styles
  const style = document.createElement('style');
  style.textContent = `
    .ar-screen { position:fixed; inset:0; overflow:hidden; background:#000; }
  `;
  container.appendChild(style);

  // DOM refs
  const video = container.querySelector('#ar-video');
  const arCanvas = container.querySelector('#ar-canvas');
  const poseCanvas = container.querySelector('#pose-canvas');
  const arCtx = arCanvas.getContext('2d');
  const poseCtx = poseCanvas.getContext('2d');
  const loadingEl = container.querySelector('#ar-loading');
  const statusEl = container.querySelector('#ar-status');
  const guidanceEl = container.querySelector('#guidance-pill');
  const guidanceTextEl = container.querySelector('#guidance-text');
  const reticleEl = container.querySelector('#reticle');
  const scaleControl = container.querySelector('#scale-control');
  const poseDot = container.querySelector('#pose-dot');
  const poseLabel = container.querySelector('#pose-label');
  const poseIndicator = container.querySelector('#pose-indicator');
  const scaleLabelEl = container.querySelector('#scale-label');
  let showSkeleton = false;

  // Load clothing image
  const clothImg = new Image();
  clothImg.crossOrigin = 'anonymous';
  clothImg.src = product.arImage;
  await new Promise((resolve) => {
    clothImg.onload = resolve;
    clothImg.onerror = resolve;
  });

  // Start camera
  async function startCamera() {
    try {
      statusEl.textContent = 'Starting camera...';
      const constraints = {
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment',
          width: { ideal: 640 },
          height: { ideal: 960 },
        },
        audio: false,
      };

      if (stream) { stream.getTracks().forEach(t => t.stop()); }
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => { video.play(); resolve(); };
      });

      // Set canvas sizes to match video
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      arCanvas.width = vw;
      arCanvas.height = vh;
      poseCanvas.width = vw;
      poseCanvas.height = vh;

      // Mirror video for front camera
      video.style.transform = useFrontCamera ? 'scaleX(-1)' : 'none';
      arCanvas.style.transform = useFrontCamera ? 'scaleX(-1)' : 'none';
      poseCanvas.style.transform = useFrontCamera ? 'scaleX(-1)' : 'none';

      return true;
    } catch (err) {
      console.error('Camera error:', err);
      statusEl.textContent = 'Camera access denied';
      container.querySelector('#loading-text').textContent = 'Camera permission needed';
      showToast('Please allow camera access', 'videocam_off');
      return false;
    }
  }

  // Initialize
  const cameraOk = await startCamera();
  if (!cameraOk) return;

  statusEl.textContent = 'Loading AI model...';
  container.querySelector('#loading-text').textContent = 'Loading body detection AI...';

  let detector = null;
  try {
    detector = await initPoseDetection();
    statusEl.textContent = 'Body detection ready';
  } catch (e) {
    console.error('Pose detection failed:', e);
    statusEl.textContent = 'AI model failed - overlay mode';
    showToast('Body detection unavailable, using overlay mode', 'info');
  }

  // Hide loading
  loadingEl.style.opacity = '0';
  setTimeout(() => { loadingEl.style.display = 'none'; }, 500);

  // Show UI elements
  reticleEl.style.opacity = '1';
  guidanceEl.style.opacity = '1';
  scaleControl.style.opacity = '1';
  poseIndicator.style.opacity = '1';

  // Draw loop
  let lastTime = 0;
  function drawFrame(timestamp) {
    if (!video.videoWidth) { animationId = requestAnimationFrame(drawFrame); return; }

    // Clear canvases
    arCtx.clearRect(0, 0, arCanvas.width, arCanvas.height);
    poseCtx.clearRect(0, 0, poseCanvas.width, poseCanvas.height);

    let landmarks = null;

    // Pose detection
    if (detector && timestamp !== lastTime) {
      try {
        const results = detector.detectForVideo(video, timestamp);
        if (results.landmarks && results.landmarks.length > 0) {
          landmarks = results.landmarks[0];
          poseDetected = true;

          // Update UI
          poseDot.style.background = '#22c55e';
          poseLabel.textContent = 'Body found';
          guidanceTextEl.textContent = 'Looking great! See how it fits';
          reticleEl.style.borderColor = 'rgba(60,221,199,0.5)';

          // Draw skeleton if enabled
          if (showSkeleton) {
            drawSkeleton(poseCtx, landmarks, arCanvas.width, arCanvas.height);
          }
        } else {
          poseDetected = false;
          poseDot.style.background = '#ef4444';
          poseLabel.textContent = 'No body';
          guidanceTextEl.textContent = 'Stand back and face the camera';
        }
      } catch (e) { /* silently skip frame */ }
      lastTime = timestamp;
    }

    // Draw clothing overlay
    if (landmarks) {
      drawClothingOnBody(arCtx, landmarks, clothImg, arCanvas.width, arCanvas.height);
    } else if (!detector) {
      // Fallback: draw in center when no body detection
      drawClothingFallback(arCtx, clothImg, arCanvas.width, arCanvas.height);
    }

    animationId = requestAnimationFrame(drawFrame);
  }

  function drawClothingOnBody(ctx, lm, img, cw, ch) {
    // Get shoulder and hip positions in pixel coordinates
    const lShoulder = { x: lm[LEFT_SHOULDER].x * cw, y: lm[LEFT_SHOULDER].y * ch };
    const rShoulder = { x: lm[RIGHT_SHOULDER].x * cw, y: lm[RIGHT_SHOULDER].y * ch };
    const lHip = { x: lm[LEFT_HIP].x * cw, y: lm[LEFT_HIP].y * ch };
    const rHip = { x: lm[RIGHT_HIP].x * cw, y: lm[RIGHT_HIP].y * ch };

    // Calculate body measurements
    const shoulderMidX = (lShoulder.x + rShoulder.x) / 2;
    const shoulderMidY = (lShoulder.y + rShoulder.y) / 2;
    const hipMidY = (lHip.y + rHip.y) / 2;
    const shoulderWidth = Math.abs(rShoulder.x - lShoulder.x);

    // Clothing dimensions based on body
    const clothWidth = shoulderWidth * 2.2 * scale;  // Wider than shoulders
    const bodyHeight = hipMidY - shoulderMidY;
    const clothHeight = bodyHeight * 1.5 * scale;     // Extend below hips

    // Position: center on shoulder midpoint, start slightly above shoulders
    const x = shoulderMidX - clothWidth / 2;
    const y = shoulderMidY - (clothHeight * 0.1);

    // Calculate rotation from shoulder angle
    const angle = Math.atan2(rShoulder.y - lShoulder.y, rShoulder.x - lShoulder.x);

    // Draw with rotation
    ctx.save();
    ctx.globalAlpha = clothOpacity;
    ctx.translate(shoulderMidX, shoulderMidY);
    ctx.rotate(angle);
    ctx.drawImage(img, -clothWidth / 2, -(clothHeight * 0.1), clothWidth, clothHeight);
    ctx.restore();
  }

  function drawClothingFallback(ctx, img, cw, ch) {
    const clothWidth = cw * 0.55 * scale;
    const clothHeight = (clothWidth / img.width) * img.height;
    const x = (cw - clothWidth) / 2;
    const y = ch * 0.2;
    ctx.globalAlpha = clothOpacity;
    ctx.drawImage(img, x, y, clothWidth, clothHeight);
  }

  function drawSkeleton(ctx, lm, cw, ch) {
    // Connection pairs for upper body
    const connections = [
      [11, 12], // shoulders
      [11, 13], [13, 15], // left arm
      [12, 14], [14, 16], // right arm
      [11, 23], [12, 24], // torso sides
      [23, 24], // hips
    ];

    ctx.strokeStyle = 'rgba(221, 183, 255, 0.6)';
    ctx.lineWidth = 2;

    for (const [a, b] of connections) {
      if (lm[a] && lm[b]) {
        ctx.beginPath();
        ctx.moveTo(lm[a].x * cw, lm[a].y * ch);
        ctx.lineTo(lm[b].x * cw, lm[b].y * ch);
        ctx.stroke();
      }
    }

    // Draw keypoints
    const keypoints = [11, 12, 13, 14, 15, 16, 23, 24];
    for (const idx of keypoints) {
      if (lm[idx]) {
        ctx.beginPath();
        ctx.arc(lm[idx].x * cw, lm[idx].y * ch, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 175, 211, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // Start detection loop
  animationId = requestAnimationFrame(drawFrame);

  // ── Events ──────────────────────────────────────
  container.querySelector('#ar-back').addEventListener('click', () => {
    cleanup();
    goBack();
  });

  // Camera flip
  container.querySelector('#camera-flip').addEventListener('click', async () => {
    useFrontCamera = !useFrontCamera;
    showToast(useFrontCamera ? 'Front camera' : 'Rear camera', 'flip_camera_ios');
    await startCamera();
  });

  // Scale controls
  container.querySelector('#scale-up').addEventListener('click', () => {
    scale = Math.min(scale + 0.1, 2.0);
    scaleLabelEl.textContent = Math.round(scale * 100) + '%';
  });
  container.querySelector('#scale-down').addEventListener('click', () => {
    scale = Math.max(scale - 0.1, 0.4);
    scaleLabelEl.textContent = Math.round(scale * 100) + '%';
  });

  // Opacity toggle
  container.querySelector('#opacity-toggle').addEventListener('click', () => {
    clothOpacity = clothOpacity > 0.6 ? 0.5 : 0.92;
    showToast(`Overlay: ${Math.round(clothOpacity * 100)}%`, 'opacity');
  });

  // Size selection
  container.querySelector('#ar-sizes').addEventListener('click', (e) => {
    const btn = e.target.closest('.ar-size-btn');
    if (!btn) return;
    selectedSize = btn.dataset.size;
    setState({ selectedSize });
    container.querySelectorAll('.ar-size-btn').forEach(b => {
      const isActive = b.dataset.size === selectedSize;
      b.style.background = isActive ? 'rgba(183,109,255,0.3)' : 'transparent';
      b.style.color = isActive ? 'var(--primary)' : 'var(--on-surface-variant)';
      b.style.border = isActive ? '1px solid rgba(183,109,255,0.3)' : 'none';
    });
    showToast(`Size: ${selectedSize}`, 'straighten');
  });

  // Photo capture
  container.querySelector('#photo-btn').addEventListener('click', () => {
    // Create composite screenshot
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const captureCtx = captureCanvas.getContext('2d');

    // Draw video frame
    if (useFrontCamera) {
      captureCtx.translate(captureCanvas.width, 0);
      captureCtx.scale(-1, 1);
    }
    captureCtx.drawImage(video, 0, 0);
    if (useFrontCamera) {
      captureCtx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Draw clothing overlay
    captureCtx.drawImage(arCanvas, 0, 0);

    // Download
    const link = document.createElement('a');
    link.download = `vogue-ar-tryon-${Date.now()}.png`;
    link.href = captureCanvas.toDataURL('image/png');
    link.click();

    showToast('Look saved! 📸', 'photo_camera');
  });

  // Reserve
  container.querySelector('#reserve-ar-btn').addEventListener('click', () => {
    const res = addReservation(product.id, product.shopId, selectedSize);
    showToast(`Reserved! Code: ${res.code} 🛍️`, 'bookmark_added');
  });

  // Skeleton toggle
  container.querySelector('#skeleton-toggle').addEventListener('click', () => {
    showSkeleton = !showSkeleton;
    poseCanvas.style.opacity = showSkeleton ? '0.5' : '0.3';
    showToast(showSkeleton ? 'Skeleton visible' : 'Skeleton hidden', 'skeleton');
  });
}
