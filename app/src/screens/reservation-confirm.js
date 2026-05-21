/* ============================================================
   RESERVATION CONFIRMATION — After user reserves
   ============================================================ */
import { getProductById } from '../data/products.js';
import { getShopById } from '../data/shops.js';
import { goBack } from '../router.js';
import { showToast } from '../components/toast.js';

export async function renderReservationConfirm(container, params) {
  const product = getProductById(params.id);
  const shop = product ? getShopById(product.shopId) : null;
  const code = params.code || 'VA-XXXXXX';

  container.innerHTML = `
    <div style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;background:radial-gradient(ellipse at center,rgba(183,109,255,0.08),transparent 70%)">
      <!-- Success Animation -->
      <div class="pulse-glow" style="width:100px;height:100px;border-radius:50%;background:rgba(60,221,199,0.1);border:2px solid rgba(60,221,199,0.3);display:flex;align-items:center;justify-content:center;margin-bottom:24px">
        <span class="material-symbols-outlined filled" style="font-size:48px;color:var(--tertiary)">check_circle</span>
      </div>

      <h1 style="font-size:24px;font-weight:800;margin-bottom:8px">Reserved!</h1>
      <p style="font-size:14px;color:var(--on-surface-variant);margin-bottom:32px">Show this code at the shop</p>

      <!-- Code Card -->
      <div class="glass-panel" style="border-radius:var(--radius-xl);padding:24px 32px;margin-bottom:24px;border:1px solid rgba(60,221,199,0.3)">
        <p style="font-size:10px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px">Reservation Code</p>
        <p style="font-size:36px;font-weight:900;font-family:monospace;color:var(--tertiary);letter-spacing:0.15em">${code}</p>
        <p style="font-size:11px;color:var(--outline);margin-top:8px">Valid for 24 hours</p>
      </div>

      ${product ? `
      <!-- Product Details -->
      <div class="glass-panel" style="border-radius:var(--radius-xl);padding:16px;margin-bottom:24px;display:flex;gap:16px;align-items:center;width:100%;max-width:340px">
        <div style="width:64px;height:64px;border-radius:var(--radius);overflow:hidden;flex-shrink:0">
          <img src="${product.image}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div style="text-align:left;min-width:0">
          <p style="font-size:14px;font-weight:600" class="truncate">${product.title}</p>
          <p style="font-size:14px;color:var(--primary);font-weight:700">₹${product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
      ` : ''}

      ${shop ? `
      <!-- Shop Info -->
      <div class="glass-panel" style="border-radius:var(--radius-xl);padding:16px;margin-bottom:32px;width:100%;max-width:340px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">storefront</span>
          <p style="font-size:14px;font-weight:600">${shop.name}</p>
        </div>
        <p style="font-size:12px;color:var(--on-surface-variant);margin-bottom:12px">${shop.address}</p>
        <a href="https://maps.google.com/?q=${shop.location.lat},${shop.location.lng}" target="_blank" class="neon-button" style="padding:10px;border-radius:var(--radius-lg);font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;text-decoration:none">
          <span class="material-symbols-outlined" style="font-size:18px">directions</span> Get Directions
        </a>
      </div>
      ` : ''}

      <!-- Actions -->
      <div style="display:flex;gap:12px;width:100%;max-width:340px">
        <button id="share-btn" class="glass-panel" style="flex:1;padding:12px;border-radius:var(--radius-lg);font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(255,255,255,0.1)">
          <span class="material-symbols-outlined" style="font-size:18px">share</span> Share
        </button>
        <button id="home-btn" class="glass-panel" style="flex:1;padding:12px;border-radius:var(--radius-lg);font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(183,109,255,0.2);color:var(--primary)">
          <span class="material-symbols-outlined" style="font-size:18px">home</span> Home
        </button>
      </div>
    </div>
  `;

  container.querySelector('#share-btn').addEventListener('click', async () => {
    if (navigator.share) {
      await navigator.share({ title: 'VOGUE AR Reservation', text: `I reserved ${product?.title||'an item'} at ${shop?.name||'a shop'}! Code: ${code}` });
    } else {
      navigator.clipboard.writeText(code);
      showToast('Code copied!', 'content_copy');
    }
  });

  container.querySelector('#home-btn').addEventListener('click', () => { window.location.hash = '#/'; });
}
