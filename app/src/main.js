/* ============================================================
   MAIN — App entry point
   ============================================================ */

// Styles
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';

// Router
import { registerRoute, initRouter } from './router.js';

// Screens
import { renderSplash } from './screens/splash.js';
import { renderLogin } from './screens/login.js';
import { renderNearbyShops } from './screens/nearby-shops.js';
import { renderShopProfile } from './screens/shop-profile.js';
import { renderProductDetail } from './screens/product-detail.js';
import { renderARPreview } from './screens/ar-preview.js';
import { renderFavorites } from './screens/favorites.js';
import { renderProfile } from './screens/profile.js';
import { renderMap } from './screens/map-view.js';
import { renderShopDashboard, renderAddProduct } from './screens/shop-dashboard.js';
import { renderReservationConfirm } from './screens/reservation-confirm.js';
import { renderChat } from './screens/chat.js';
import { getState } from './state.js';

// Register routes — User Screens
registerRoute('/splash', (c) => renderSplash(c));
registerRoute('/login', (c) => renderLogin(c));
registerRoute('/', (c, p) => {
  const state = getState();
  if (!state.isLoggedIn) { window.location.hash = '#/login'; return; }
  return renderNearbyShops(c, p);
});
registerRoute('/shop/:id', (c, p) => renderShopProfile(c, p));
registerRoute('/product/:id', (c, p) => renderProductDetail(c, p));
registerRoute('/ar/:id', (c, p) => renderARPreview(c, p));
registerRoute('/favorites', (c) => renderFavorites(c));
registerRoute('/profile', (c) => renderProfile(c));
registerRoute('/map', (c) => renderMap(c));
registerRoute('/ar-home', (c) => renderNearbyShops(c, {}));
registerRoute('/reserved/:id', (c, p) => renderReservationConfirm(c, p));
registerRoute('/chat/:id', (c, p) => renderChat(c, p));

// Register routes — Shopkeeper Dashboard
registerRoute('/shop/dashboard', (c) => renderShopDashboard(c));
registerRoute('/shop/add-product', (c) => renderAddProduct(c));
registerRoute('/shop/reservations', (c) => renderShopDashboard(c)); // reuse dashboard

// Initialize
const hash = window.location.hash;
if (!hash || hash === '#' || hash === '#/') {
  const state = getState();
  if (!state.isLoggedIn) {
    window.location.hash = '#/splash';
  }
}

initRouter();

// Register Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', reg.scope);
    } catch (err) {
      console.log('SW registration skipped (dev mode):', err.message);
    }
  });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install banner after 30s
  setTimeout(() => {
    if (deferredPrompt) {
      const banner = document.createElement('div');
      banner.id = 'install-banner';
      banner.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:100;max-width:400px;width:90%';
      banner.innerHTML = `
        <div style="background:rgba(19,19,21,0.95);backdrop-filter:blur(20px);border:1px solid rgba(183,109,255,0.3);border-radius:16px;padding:16px;display:flex;align-items:center;gap:12px">
          <span class="material-symbols-outlined" style="font-size:28px;color:#a855f7">install_mobile</span>
          <div style="flex:1">
            <p style="font-size:14px;font-weight:700;color:white">Install VOGUE AR</p>
            <p style="font-size:11px;color:#a1a1aa">Add to home screen for best experience</p>
          </div>
          <button id="install-btn" style="padding:8px 16px;border-radius:99px;background:linear-gradient(135deg,#b76dff,#842bd2);color:white;font-size:12px;font-weight:700;border:none">Install</button>
          <button id="install-dismiss" style="padding:4px;color:#a1a1aa;background:none;border:none"><span class="material-symbols-outlined" style="font-size:18px">close</span></button>
        </div>`;
      document.body.appendChild(banner);
      document.getElementById('install-btn').onclick = async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install:', outcome);
        deferredPrompt = null;
        banner.remove();
      };
      document.getElementById('install-dismiss').onclick = () => banner.remove();
    }
  }, 30000);
});

// Console branding
console.log(
  '%c VOGUE AR %c Camera Se Pehen Ke Dekho ',
  'background: linear-gradient(135deg, #b76dff, #842bd2); color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: 900; font-style: italic;',
  'background: #131315; color: #ddb7ff; padding: 8px 12px; border-radius: 0 4px 4px 0;'
);
