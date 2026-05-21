/* ============================================================
   NEARBY SHOPS — Home screen with discovery
   ============================================================ */
import { shops, searchShops, getShopsByCategory, IMAGES } from '../data/shops.js';
import { renderBottomNav } from '../components/bottom-nav.js';
import { getState, setState } from '../state.js';

export async function renderNearbyShops(container) {
  const state = getState();
  const activeCategory = state.activeCategory || 'all';

  container.innerHTML = `
    <!-- Top Bar -->
    <header class="top-bar" id="home-header">
      <div style="display:flex;align-items:center;gap:16px">
        <span class="material-symbols-outlined" style="color:#a1a1aa;cursor:pointer" id="menu-btn">menu</span>
        <div>
          <h1 class="top-bar__brand">VOGUE AR</h1>
          <div style="display:flex;align-items:center;gap:4px;color:#a1a1aa;cursor:pointer" id="location-btn">
            <span class="material-symbols-outlined" style="font-size:14px">location_on</span>
            <span style="font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em">Current Location</span>
            <span class="material-symbols-outlined" style="font-size:14px">expand_more</span>
          </div>
        </div>
      </div>
      <img alt="Profile" src="${IMAGES.avatar}" style="width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);object-fit:cover;cursor:pointer" id="avatar-btn" />
    </header>

    <main class="screen--padded" style="padding-bottom:120px">
      <!-- Search -->
      <div class="search-bar" style="margin-bottom:var(--space-lg)">
        <span class="material-symbols-outlined search-bar__icon">search</span>
        <input class="search-bar__input" type="text" placeholder="Search shops, brands, or 'silk dress'..." id="search-input" value="${state.searchQuery || ''}" />
        <button class="search-bar__filter" aria-label="Filters">
          <span class="material-symbols-outlined">tune</span>
        </button>
      </div>

      <!-- Categories -->
      <section style="margin-bottom:var(--space-lg)">
        <div class="no-scrollbar" style="display:flex;gap:16px;overflow-x:auto;padding:4px 0;margin:0 calc(var(--margin) * -1);padding-left:var(--margin);padding-right:var(--margin)" id="category-chips">
          <button class="chip ${activeCategory==='all'?'active':''}" data-cat="all">All Styles</button>
          <button class="chip ${activeCategory==='men'?'active':''}" data-cat="men">Men</button>
          <button class="chip ${activeCategory==='women'?'active':''}" data-cat="women">Women</button>
          <button class="chip ${activeCategory==='ethnic'?'active':''}" data-cat="ethnic">Ethnic</button>
          <button class="chip ${activeCategory==='western'?'active':''}" data-cat="western">Western</button>
        </div>
      </section>

      <!-- Shops -->
      <section>
        <div class="section-header">
          <h2 class="section-header__title">Shops Near You</h2>
          <a href="#/map" class="section-header__action">See Map <span class="material-symbols-outlined">map</span></a>
        </div>
        <div id="shops-list" class="stagger-children" style="display:flex;flex-direction:column;gap:var(--space-md)"></div>
      </section>
    </main>

    ${renderBottomNav('explore')}
  `;

  // Render shops
  function renderShopCards(shopList) {
    const list = container.querySelector('#shops-list');
    if (!shopList.length) {
      list.innerHTML = '<div style="text-align:center;padding:48px 0;color:var(--outline)"><span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:12px">search_off</span>No shops found</div>';
      return;
    }
    list.innerHTML = shopList.map(shop => `
      <article class="shop-card" data-shop="${shop.id}" style="cursor:pointer;${!shop.arAvailable?'opacity:0.8':''}">
        <div style="padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <h3 style="font-size:22px;font-weight:700;color:var(--on-surface)">${shop.name}</h3>
                ${shop.arAvailable ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:var(--radius-full);background:rgba(183,109,255,0.15);border:1px solid rgba(183,109,255,0.3);font-size:9px;font-weight:700;color:var(--primary);letter-spacing:0.1em;text-transform:uppercase"><span class="material-symbols-outlined" style="font-size:12px">view_in_ar</span>AR</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:12px;font-size:12px;font-weight:500;color:var(--on-surface-variant)">
                <span style="display:flex;align-items:center;gap:4px"><span class="material-symbols-outlined" style="font-size:14px">directions_walk</span>${shop.distance}</span>
                <span style="width:4px;height:4px;border-radius:50%;background:var(--outline-variant)"></span>
                <span style="display:flex;align-items:center;gap:4px;color:var(--tertiary-fixed)"><span class="material-symbols-outlined filled" style="font-size:14px">star</span>${shop.rating}</span>
              </div>
            </div>
            <button class="product-card__fav" style="width:40px;height:40px" aria-label="Save shop" onclick="event.stopPropagation()">
              <span class="material-symbols-outlined">favorite_border</span>
            </button>
          </div>
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:8px;height:128px">
            <div style="border-radius:var(--radius);overflow:hidden">
              <img src="${shop.images.featured}" alt="${shop.name}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s" loading="lazy" />
            </div>
            <div style="display:grid;grid-template-rows:1fr 1fr;gap:8px">
              <div style="border-radius:var(--radius);overflow:hidden">
                <img src="${shop.images.thumb1}" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
              </div>
              <div style="border-radius:var(--radius);overflow:hidden;position:relative">
                <div style="position:absolute;inset:0;background:rgba(32,31,34,0.8);backdrop-filter:blur(4px);z-index:1;display:flex;align-items:center;justify-content:center">
                  <span style="font-size:14px;font-weight:600;color:var(--on-surface)">+${shop.productCount}</span>
                </div>
                <img src="${shop.images.thumb2}" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  renderShopCards(activeCategory === 'all' ? shops : getShopsByCategory(activeCategory));

  // Event: shop click
  container.querySelector('#shops-list').addEventListener('click', (e) => {
    const card = e.target.closest('[data-shop]');
    if (card) window.location.hash = '#/shop/' + card.dataset.shop;
  });

  // Event: category filter
  container.querySelector('#category-chips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const cat = chip.dataset.cat;
    setState({ activeCategory: cat });
    container.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
    renderShopCards(cat === 'all' ? shops : getShopsByCategory(cat));
  });

  // Event: search
  const searchInput = container.querySelector('#search-input');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    setState({ searchQuery: q });
    if (!q) { renderShopCards(shops); return; }
    renderShopCards(searchShops(q));
  });

  // Event: avatar
  container.querySelector('#avatar-btn').addEventListener('click', () => { window.location.hash = '#/profile'; });
}
