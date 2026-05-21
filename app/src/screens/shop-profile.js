/* ============================================================
   SHOP PROFILE — Shop detail with product grid
   ============================================================ */
import { getShopById } from '../data/shops.js';
import { getProductsByShop } from '../data/products.js';
import { isFavorite, toggleFavorite, getReservationCount } from '../state.js';
import { showToast } from '../components/toast.js';
import { goBack } from '../router.js';

export async function renderShopProfile(container, params) {
  const shop = getShopById(params.id);
  if (!shop) { window.location.hash = '#/'; return; }
  const products = getProductsByShop(shop.id);
  const cats = [...new Set(products.map(p => p.category))];

  container.innerHTML = `
    <!-- Top Bar -->
    <header class="top-bar">
      <button id="back-btn" aria-label="Go back" style="padding:8px;border-radius:50%">
        <span class="material-symbols-outlined" style="color:#a1a1aa">arrow_back</span>
      </button>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">${shop.name}</span>
      <button style="padding:8px;border-radius:50%" aria-label="Share">
        <span class="material-symbols-outlined" style="color:#a1a1aa">ios_share</span>
      </button>
    </header>

    <main style="padding-top:64px;padding-left:var(--margin);padding-right:var(--margin);max-width:900px;margin:0 auto;padding-bottom:100px">
      <!-- Bento Header -->
      <section style="margin-top:var(--space-md);margin-bottom:var(--space-lg);display:grid;grid-template-columns:2fr 1fr;gap:var(--space-xs)">
        <div style="border-radius:var(--radius-xl);overflow:hidden;position:relative;height:256px;border:1px solid rgba(255,255,255,0.2)">
          <img src="${shop.images.storefront}" alt="${shop.name}" style="width:100%;height:100%;object-fit:cover" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.3) 40%, transparent 100%)"></div>
          <div style="position:absolute;bottom:16px;left:16px;right:16px">
            <h1 style="font-size:32px;font-weight:700;color:var(--on-surface);margin-bottom:4px;letter-spacing:-0.01em">${shop.name}</h1>
            <p style="font-size:14px;color:var(--on-surface-variant);display:flex;align-items:center;gap:8px">
              <span class="material-symbols-outlined" style="font-size:16px;color:var(--tertiary)">location_on</span>${shop.address}
            </p>
          </div>
        </div>
        <div style="background:var(--surface-container);border-radius:var(--radius-xl);padding:16px;border:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;backdrop-filter:blur(12px)">
          <div style="width:64px;height:64px;border-radius:50%;background:rgba(183,109,255,0.1);display:flex;align-items:center;justify-content:center;border:1px solid rgba(183,109,255,0.3)">
            <span class="material-symbols-outlined" style="font-size:32px;color:var(--primary)">directions</span>
          </div>
          <h3 class="text-label-bold" style="text-align:center">Visit Shop</h3>
          <p class="text-label-sm" style="color:var(--on-surface-variant);text-align:center">Open until ${shop.closeTime}</p>
          <button class="neon-button" style="width:100%;padding:12px 24px;border-radius:var(--radius-full);font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">Get Directions</button>
        </div>
      </section>

      <!-- Category Tabs -->
      <section style="margin-bottom:var(--space-lg);overflow-x:auto" class="no-scrollbar">
        <div style="display:flex;gap:16px;min-width:max-content" id="shop-cats">
          ${cats.map((c, i) => `<button class="chip ${i===0?'active':''}" data-cat="${c}" style="text-transform:capitalize">${c}</button>`).join('')}
        </div>
      </section>

      <!-- Product Grid -->
      <section style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:48px" id="product-grid">
        ${products.map(p => renderProductCard(p)).join('')}
      </section>
    </main>

    <!-- Reserve FAB -->
    <div style="position:fixed;bottom:24px;right:24px;z-index:50">
      <button class="neon-button" style="border-radius:var(--radius-full);padding:16px 24px;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600">
        <span class="material-symbols-outlined filled" style="font-size:20px">shopping_bag</span>
        <span>Reserve (${getReservationCount()})</span>
      </button>
    </div>
  `;

  // Back button
  container.querySelector('#back-btn').addEventListener('click', () => goBack());

  // Product card clicks
  container.querySelector('#product-grid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-product]');
    if (card && !e.target.closest('.product-card__fav')) {
      window.location.hash = '#/product/' + card.dataset.product;
    }
  });

  // Favorite toggle
  container.querySelectorAll('.product-card__fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.dataset.pid;
      const added = toggleFavorite(pid);
      btn.classList.toggle('active', added);
      const icon = btn.querySelector('.material-symbols-outlined');
      icon.textContent = added ? 'favorite' : 'favorite_border';
      icon.classList.toggle('filled', added);
      showToast(added ? 'Added to favorites' : 'Removed from favorites', added ? 'favorite' : 'heart_broken');
    });
  });

  // Category filter
  container.querySelector('#shop-cats').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    container.querySelectorAll('#shop-cats .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.cat;
    const filtered = products.filter(p => p.category === cat);
    container.querySelector('#product-grid').innerHTML = filtered.map(p => renderProductCard(p)).join('');
  });
}

function renderProductCard(p) {
  const fav = isFavorite(p.id);
  return `
    <div class="product-card" data-product="${p.id}" style="cursor:pointer">
      <div class="product-card__image-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <button class="product-card__fav ${fav?'active':''}" data-pid="${p.id}" aria-label="Favorite">
          <span class="material-symbols-outlined ${fav?'filled':''}">${fav?'favorite':'favorite_border'}</span>
        </button>
        <div class="product-card__ar-overlay">
          <span class="ar-try-chip"><span class="material-symbols-outlined">view_in_ar</span> Try Now</span>
        </div>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__title">${p.title}</h3>
        <p class="product-card__price">₹${p.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  `;
}
