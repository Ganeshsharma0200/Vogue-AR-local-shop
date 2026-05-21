/* ============================================================
   PROFILE — User profile screen
   ============================================================ */
import { getState, setState } from '../state.js';
import { products } from '../data/products.js';
import { getShopById } from '../data/shops.js';
import { renderBottomNav } from '../components/bottom-nav.js';
import { IMAGES } from '../data/shops.js';
import { showToast } from '../components/toast.js';

export async function renderProfile(container) {
  const state = getState();
  const reservations = state.reservations || [];

  container.innerHTML = `
    <header class="top-bar">
      <div></div>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">VOGUE AR</span>
      <div></div>
    </header>

    <main class="screen--padded" style="padding-bottom:120px">
      <!-- Avatar Section -->
      <div style="text-align:center;margin-bottom:32px" class="fade-in-up">
        <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;margin:0 auto 12px;border:2px solid var(--primary-container);box-shadow:0 0 20px rgba(183,109,255,0.3)">
          <img src="${IMAGES.avatar}" alt="Profile" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:4px">${state.user.name}</h2>
        <p style="font-size:13px;color:var(--on-surface-variant)">${state.user.phone || 'Phone not set'}</p>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:32px" class="fade-in-up" >
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:16px;text-align:center">
          <p style="font-size:24px;font-weight:700;color:var(--primary)">${state.favorites.length}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Favorites</p>
        </div>
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:16px;text-align:center">
          <p style="font-size:24px;font-weight:700;color:var(--secondary)">${reservations.length}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Reserved</p>
        </div>
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:16px;text-align:center">
          <p style="font-size:24px;font-weight:700;color:var(--tertiary)">${state.user.size}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Size</p>
        </div>
      </div>

      <!-- Size Preference -->
      <div class="glass-panel fade-in-up" style="border-radius:var(--radius-xl);padding:20px;margin-bottom:16px">
        <h3 class="text-label-bold" style="margin-bottom:12px;display:flex;align-items:center;gap:8px">
          <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary)">straighten</span> Size Preference
        </h3>
        <div class="size-grid" id="profile-sizes">
          ${['S','M','L','XL'].map(s => `<button class="size-btn ${s===state.user.size?'active':'glass'}" data-size="${s}">${s}</button>`).join('')}
        </div>
      </div>

      <!-- Reservations -->
      <div class="glass-panel fade-in-up" style="border-radius:var(--radius-xl);padding:20px;margin-bottom:16px">
        <h3 class="text-label-bold" style="margin-bottom:12px;display:flex;align-items:center;gap:8px">
          <span class="material-symbols-outlined" style="font-size:18px;color:var(--secondary)">bookmark</span> Reservations
        </h3>
        ${reservations.length === 0 ? '<p style="font-size:14px;color:var(--outline)">No reservations yet</p>' :
          reservations.slice(-5).reverse().map(r => {
            const p = products.find(x => x.id === r.productId);
            const s = getShopById(r.shopId);
            return `<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--glass-border)">
              <div style="width:48px;height:48px;border-radius:var(--radius);overflow:hidden;flex-shrink:0">
                <img src="${p?.image||''}" alt="" style="width:100%;height:100%;object-fit:cover" />
              </div>
              <div style="flex:1;min-width:0">
                <p style="font-size:14px;font-weight:600" class="truncate">${p?.title||'Product'}</p>
                <p style="font-size:12px;color:var(--on-surface-variant)">Size ${r.size} · ${s?.name||'Shop'}</p>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <p style="font-size:12px;font-weight:700;color:var(--tertiary);font-family:monospace">${r.code}</p>
              </div>
            </div>`;
          }).join('')
        }
      </div>

      <!-- Menu Items -->
      <div style="display:flex;flex-direction:column;gap:8px" class="fade-in-up">
        ${[
          {icon:'notifications',label:'Notifications',color:'var(--primary)'},
          {icon:'help',label:'Help & Support',color:'var(--tertiary)'},
          {icon:'info',label:'About VOGUE AR',color:'var(--on-surface-variant)'},
        ].map(item => `
          <div class="glass-panel" style="border-radius:var(--radius-lg);padding:16px 20px;display:flex;align-items:center;gap:12px;cursor:pointer">
            <span class="material-symbols-outlined" style="font-size:20px;color:${item.color}">${item.icon}</span>
            <span style="flex:1;font-size:14px;font-weight:500">${item.label}</span>
            <span class="material-symbols-outlined" style="font-size:18px;color:var(--outline)">chevron_right</span>
          </div>
        `).join('')}
        <button id="logout-btn" class="glass-panel" style="border-radius:var(--radius-lg);padding:16px 20px;display:flex;align-items:center;gap:12px;cursor:pointer;width:100%;text-align:left;margin-top:8px;border-color:rgba(255,180,171,0.2)">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--error)">logout</span>
          <span style="flex:1;font-size:14px;font-weight:500;color:var(--error)">Logout</span>
        </button>
      </div>
    </main>
    ${renderBottomNav('profile')}
  `;

  // Size preference
  container.querySelector('#profile-sizes').addEventListener('click', (e) => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    const size = btn.dataset.size;
    setState({ user: { ...getState().user, size } });
    container.querySelectorAll('#profile-sizes .size-btn').forEach(b => {
      b.className = 'size-btn ' + (b.dataset.size === size ? 'active' : 'glass');
    });
    showToast(`Default size set to ${size}`, 'straighten');
  });

  // Logout
  container.querySelector('#logout-btn').addEventListener('click', () => {
    setState({ isLoggedIn: false });
    window.location.hash = '#/login';
  });
}
