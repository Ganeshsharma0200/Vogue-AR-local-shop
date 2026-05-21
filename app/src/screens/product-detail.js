/* ============================================================
   PRODUCT DETAIL — Full product page
   ============================================================ */
import { getProductById } from '../data/products.js';
import { getShopById } from '../data/shops.js';
import { getState, setState, isFavorite, toggleFavorite, addReservation } from '../state.js';
import { showToast } from '../components/toast.js';
import { goBack } from '../router.js';
import { IMAGES } from '../data/shops.js';

export async function renderProductDetail(container, params) {
  const product = getProductById(params.id);
  if (!product) { window.location.hash = '#/'; return; }
  const shop = getShopById(product.shopId);
  const state = getState();
  let selectedSize = state.selectedSize || 'M';
  const fav = isFavorite(product.id);

  container.innerHTML = `
    <!-- Top Bar -->
    <header class="top-bar">
      <button id="back-btn" style="padding:8px;border-radius:50%">
        <span class="material-symbols-outlined" style="color:#a1a1aa">arrow_back</span>
      </button>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">VOGUE AR</span>
      <div style="width:32px;height:32px;border-radius:50%;overflow:hidden;background:var(--surface-container)">
        <img src="${IMAGES.avatar}" alt="Profile" style="width:100%;height:100%;object-fit:cover" />
      </div>
    </header>

    <main style="padding-top:64px;padding-bottom:120px">
      <!-- Hero Image -->
      <div style="position:relative;width:100%;height:530px;background:var(--surface-container)">
        <img src="${product.image}" alt="${product.title}" style="width:100%;height:100%;object-fit:cover;object-position:center" />
        <!-- AR Ping Tag -->
        ${product.arEnabled ? `
        <div style="position:absolute;bottom:25%;right:25%;display:flex;flex-direction:column;align-items:center">
          <div class="pulse-dot" style="width:12px;height:12px;border-radius:50%;background:var(--primary);box-shadow:0 0 15px rgba(221,183,255,0.8)"></div>
          <div style="height:48px;width:1px;background:linear-gradient(to bottom, var(--primary), transparent);border-left:1px dashed rgba(221,183,255,0.5);margin:4px 0"></div>
          <div class="glass-panel" style="padding:4px 12px;border-radius:var(--radius-full);display:flex;align-items:center;gap:4px">
            <span class="material-symbols-outlined" style="font-size:14px;color:var(--primary)">view_in_ar</span>
            <span class="text-label-sm" style="color:var(--on-surface)">AR Ready</span>
          </div>
        </div>` : ''}
        <!-- Gradient -->
        <div style="position:absolute;bottom:0;width:100%;height:128px;background:linear-gradient(to top, var(--background), transparent)"></div>
      </div>

      <!-- Content -->
      <div style="padding:0 var(--margin);margin-top:-32px;position:relative;z-index:10">
        <!-- Title Card -->
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:var(--space-md);margin-bottom:var(--space-md)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <h2 style="font-size:32px;font-weight:700;color:var(--on-surface);line-height:40px;letter-spacing:-0.01em">${product.title}</h2>
            <button id="fav-btn" style="color:${fav?'var(--secondary)':'#a1a1aa'};padding:4px;transition:color 0.2s" aria-label="Favorite">
              <span class="material-symbols-outlined ${fav?'filled':''}">${fav?'favorite':'favorite_border'}</span>
            </button>
          </div>
          <p style="font-size:24px;font-weight:700;color:var(--primary);margin-bottom:4px">₹${product.price.toLocaleString('en-IN')}</p>
          <div style="display:flex;align-items:center;gap:4px;color:var(--on-surface-variant);font-size:14px">
            ${[1,2,3,4].map(() => '<span class="material-symbols-outlined filled" style="font-size:16px;color:var(--tertiary)">star</span>').join('')}
            <span class="material-symbols-outlined filled" style="font-size:16px;color:var(--tertiary)">star_half</span>
            <span style="margin-left:4px;font-size:14px">${shop?.rating || 4.8} (${shop?.reviewCount || 124} reviews)</span>
          </div>
        </div>

        <!-- Size Selector -->
        <div style="margin-bottom:var(--space-lg)">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:var(--space-sm)">
            <h3 class="text-label-bold" style="text-transform:uppercase;letter-spacing:0.1em">Select Size</h3>
            <a href="#" style="font-size:12px;color:var(--primary);text-decoration:underline;text-underline-offset:4px">Size Guide</a>
          </div>
          <div class="size-grid" id="size-grid">
            ${product.sizes.map(s => `<button class="size-btn ${s===selectedSize?'active':'glass'}" data-size="${s}">${s}</button>`).join('')}
          </div>
        </div>

        <!-- Try On CTA -->
        <button class="neon-button" id="try-on-btn" style="width:100%;height:64px;border-radius:var(--radius-xl);font-size:20px;font-weight:700;margin-bottom:var(--space-sm);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 0 30px rgba(132,43,210,0.3)">
          <span class="material-symbols-outlined">auto_awesome</span> TRY ON CAMERA
        </button>

        <!-- Secondary Actions -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-lg)">
          <button class="glass-button" id="reserve-btn" style="height:48px;border-radius:var(--radius);font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
            <span class="material-symbols-outlined" style="font-size:18px">storefront</span> Reserve for Visit
          </button>
          <button class="glass-button" id="contact-btn" style="height:48px;border-radius:var(--radius);font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
            <span class="material-symbols-outlined" style="font-size:18px">chat_bubble_outline</span> Contact Shop
          </button>
        </div>

        <!-- Reviews Section -->
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:var(--space-md);margin-bottom:var(--space-sm)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 class="text-label-bold" style="display:flex;align-items:center;gap:8px">
              <span class="material-symbols-outlined" style="color:var(--tertiary);font-size:20px">reviews</span> Reviews
            </h3>
            <button id="add-review-btn" style="font-size:12px;color:var(--primary);font-weight:600;padding:4px 12px;border-radius:var(--radius-full);border:1px solid rgba(183,109,255,0.3)">Write Review</button>
          </div>
          <div id="reviews-list">
            <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--glass-border)">
              <div style="width:36px;height:36px;border-radius:50%;background:rgba(183,109,255,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-size:14px;font-weight:700;color:var(--primary)">A</span>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:600">Ananya</span>
                  <span style="font-size:11px;color:var(--outline)">2 days ago</span>
                </div>
                <div style="display:flex;gap:2px;margin-bottom:4px">${[1,2,3,4,5].map(()=>'<span class="material-symbols-outlined filled" style="font-size:12px;color:var(--tertiary)">star</span>').join('')}</div>
                <p style="font-size:13px;color:var(--on-surface-variant);line-height:1.4">Tried it with AR first — looked exactly the same when I visited the shop! Amazing experience 💯</p>
                <span style="font-size:10px;color:var(--primary);display:flex;align-items:center;gap:4px;margin-top:4px"><span class="material-symbols-outlined" style="font-size:12px">view_in_ar</span>Verified AR Try-On</span>
              </div>
            </div>
            <div style="display:flex;gap:12px;padding:12px 0">
              <div style="width:36px;height:36px;border-radius:50%;background:rgba(60,221,199,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-size:14px;font-weight:700;color:var(--tertiary)">R</span>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:600">Riya</span>
                  <span style="font-size:11px;color:var(--outline)">5 days ago</span>
                </div>
                <div style="display:flex;gap:2px;margin-bottom:4px">${[1,2,3,4].map(()=>'<span class="material-symbols-outlined filled" style="font-size:12px;color:var(--tertiary)">star</span>').join('')}<span class="material-symbols-outlined" style="font-size:12px;color:var(--outline)">star</span></div>
                <p style="font-size:13px;color:var(--on-surface-variant);line-height:1.4">Beautiful print and fabric quality. Runs slightly large, go one size down.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
          <div class="glass-panel" style="border-radius:var(--radius-xl);padding:var(--space-md)">
            <h3 class="text-label-bold" style="margin-bottom:var(--space-xs);display:flex;align-items:center;gap:8px">
              <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px">description</span> Product Description
            </h3>
            <p style="font-size:16px;color:var(--on-surface-variant);line-height:1.6">${product.description}</p>
          </div>
          <div class="glass-panel" style="border-radius:var(--radius-xl);padding:var(--space-md)">
            <h3 class="text-label-bold" style="margin-bottom:var(--space-xs);display:flex;align-items:center;gap:8px">
              <span class="material-symbols-outlined" style="color:var(--tertiary);font-size:20px">checkroom</span> Fabric & Care
            </h3>
            <ul style="font-size:16px;color:var(--on-surface-variant);line-height:1.8;list-style:disc;padding-left:20px">
              ${product.care.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </main>
  `;

  // Events
  container.querySelector('#back-btn').addEventListener('click', () => goBack());

  container.querySelector('#fav-btn').addEventListener('click', () => {
    const added = toggleFavorite(product.id);
    const btn = container.querySelector('#fav-btn');
    btn.style.color = added ? 'var(--secondary)' : '#a1a1aa';
    const icon = btn.querySelector('.material-symbols-outlined');
    icon.textContent = added ? 'favorite' : 'favorite_border';
    icon.classList.toggle('filled', added);
    showToast(added ? 'Added to favorites ❤️' : 'Removed from favorites');
  });

  container.querySelector('#size-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    selectedSize = btn.dataset.size;
    setState({ selectedSize });
    container.querySelectorAll('.size-btn').forEach(b => { b.className = 'size-btn ' + (b.dataset.size === selectedSize ? 'active' : 'glass'); });
  });

  container.querySelector('#try-on-btn').addEventListener('click', () => {
    window.location.hash = '#/ar/' + product.id;
  });

  container.querySelector('#reserve-btn').addEventListener('click', () => {
    const res = addReservation(product.id, product.shopId, selectedSize);
    showToast(`Reserved! Code: ${res.code}`, 'bookmark_added');
    setTimeout(() => { window.location.hash = `#/reserved/${product.id}?code=${res.code}`; }, 800);
  });

  container.querySelector('#contact-btn').addEventListener('click', () => {
    window.location.hash = '#/chat/' + product.shopId;
  });

  container.querySelector('#add-review-btn').addEventListener('click', () => {
    showToast('Login to write a review', 'rate_review');
  });
}
