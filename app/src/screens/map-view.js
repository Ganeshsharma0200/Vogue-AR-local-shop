/* ============================================================
   MAP VIEW — Shop locations on interactive map
   ============================================================ */
import { shops } from '../data/shops.js';
import { goBack } from '../router.js';
import L from 'leaflet';

export async function renderMap(container) {
  container.innerHTML = `
    <header class="top-bar">
      <button id="map-back" style="padding:8px;border-radius:50%">
        <span class="material-symbols-outlined" style="color:#a1a1aa">arrow_back</span>
      </button>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">Shops Near You</span>
      <div></div>
    </header>
    <div id="map" style="position:fixed;top:64px;bottom:0;left:0;right:0;z-index:1"></div>
    <!-- Shop Preview Card -->
    <div id="shop-preview" style="position:fixed;bottom:24px;left:var(--margin);right:var(--margin);z-index:10;display:none">
      <div class="glass-panel-heavy" style="border-radius:var(--radius-xl);padding:16px;display:flex;gap:12px;align-items:center;cursor:pointer" id="preview-card">
        <div style="width:64px;height:64px;border-radius:var(--radius);overflow:hidden;flex-shrink:0">
          <img id="preview-img" src="" alt="" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div style="flex:1;min-width:0">
          <h3 id="preview-name" style="font-size:16px;font-weight:700;margin-bottom:4px" class="truncate"></h3>
          <p id="preview-meta" style="font-size:12px;color:var(--on-surface-variant)"></p>
        </div>
        <span class="material-symbols-outlined" style="color:var(--primary)">chevron_right</span>
      </div>
    </div>
  `;

  container.querySelector('#map-back').addEventListener('click', () => goBack());

  // Init map after DOM ready
  requestAnimationFrame(() => {
    const center = [28.4620, 77.0280];
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, 14);

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Custom purple marker
    const createIcon = (arAvailable) => L.divIcon({
      className: 'custom-marker',
      html: `<div style="width:36px;height:36px;border-radius:50%;background:${arAvailable ? 'linear-gradient(135deg,#b76dff,#842bd2)' : 'var(--surface-container-high)'};border:2px solid ${arAvailable ? 'rgba(221,183,255,0.6)' : 'rgba(255,255,255,0.2)'};display:flex;align-items:center;justify-content:center;box-shadow:${arAvailable ? '0 0 15px rgba(183,109,255,0.5)' : 'none'}"><span class="material-symbols-outlined" style="font-size:18px;color:${arAvailable ? 'white' : 'var(--outline)'}">storefront</span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Add markers
    shops.forEach(shop => {
      const marker = L.marker([shop.location.lat, shop.location.lng], {
        icon: createIcon(shop.arAvailable),
      }).addTo(map);

      marker.on('click', () => {
        const preview = container.querySelector('#shop-preview');
        container.querySelector('#preview-img').src = shop.images.featured;
        container.querySelector('#preview-name').textContent = shop.name;
        container.querySelector('#preview-meta').textContent = `${shop.distance} · ★ ${shop.rating} · ${shop.arAvailable ? 'AR Try-On' : 'No AR'}`;
        preview.style.display = 'block';
        preview.querySelector('#preview-card').onclick = () => {
          window.location.hash = '#/shop/' + shop.id;
        };
      });
    });

    // User location marker
    L.circleMarker(center, {
      radius: 8, fillColor: '#a855f7', fillOpacity: 1, color: 'white', weight: 2,
    }).addTo(map);
    L.circleMarker(center, {
      radius: 20, fillColor: '#a855f7', fillOpacity: 0.15, color: '#a855f7', weight: 1,
    }).addTo(map);

    // Click map to hide preview
    map.on('click', () => {
      container.querySelector('#shop-preview').style.display = 'none';
    });
  });
}
