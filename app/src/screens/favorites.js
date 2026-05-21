/* ============================================================
   FAVORITES — Saved products screen
   ============================================================ */
import { products } from '../data/products.js';
import { getState, isFavorite, toggleFavorite } from '../state.js';
import { renderBottomNav } from '../components/bottom-nav.js';
import { showToast } from '../components/toast.js';

export async function renderFavorites(container) {
  const state = getState();
  const favProducts = products.filter(p => state.favorites.includes(p.id));

  container.innerHTML = `
    <header class="top-bar">
      <div></div>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">VOGUE AR</span>
      <div></div>
    </header>

    <main class="screen--padded" style="padding-bottom:120px">
      <h2 style="font-size:24px;font-weight:700;margin-bottom:24px">Your Favorites</h2>

      ${favProducts.length === 0 ? `
        <div style="text-align:center;padding:80px 0">
          <span class="material-symbols-outlined" style="font-size:64px;color:var(--outline-variant);display:block;margin-bottom:16px">favorite_border</span>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px;color:var(--on-surface)">No favorites yet</h3>
          <p style="font-size:14px;color:var(--on-surface-variant);margin-bottom:24px">Browse shops and tap ♡ to save items you love</p>
          <a href="#/" class="neon-button" style="display:inline-flex;padding:12px 32px;border-radius:var(--radius-full);font-size:14px;font-weight:600;gap:8px;text-decoration:none">
            <span class="material-symbols-outlined">explore</span> Explore Shops
          </a>
        </div>
      ` : `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px" id="fav-grid">
          ${favProducts.map(p => `
            <div class="product-card" data-product="${p.id}" style="cursor:pointer">
              <div class="product-card__image-wrap">
                <img src="${p.image}" alt="${p.title}" loading="lazy" />
                <button class="product-card__fav active" data-pid="${p.id}" aria-label="Remove">
                  <span class="material-symbols-outlined filled">favorite</span>
                </button>
              </div>
              <div class="product-card__info">
                <h3 class="product-card__title">${p.title}</h3>
                <p class="product-card__price">₹${p.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </main>
    ${renderBottomNav('favorites')}
  `;

  // Events
  container.querySelector('#fav-grid')?.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.product-card__fav');
    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.pid);
      showToast('Removed from favorites', 'heart_broken');
      // Re-render
      renderFavorites(container);
      return;
    }
    const card = e.target.closest('[data-product]');
    if (card) window.location.hash = '#/product/' + card.dataset.product;
  });
}
