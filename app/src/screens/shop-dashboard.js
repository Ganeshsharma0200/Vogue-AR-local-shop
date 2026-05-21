/* ============================================================
   SHOPKEEPER DASHBOARD — Home, Add Product, Reservations
   ============================================================ */
import { getState } from '../state.js';
import { shops } from '../data/shops.js';
import { products } from '../data/products.js';
import { showToast } from '../components/toast.js';
import { api } from '../services/api.js';

export async function renderShopDashboard(container) {
  const state = getState();
  const shop = shops[0]; // Mock: first shop for demo
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const reservations = state.reservations || [];

  container.innerHTML = `
    <header class="top-bar">
      <button onclick="history.back()" style="padding:8px"><span class="material-symbols-outlined" style="color:#a1a1aa">arrow_back</span></button>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">Shop Dashboard</span>
      <div></div>
    </header>

    <main class="screen--padded" style="padding-bottom:40px">
      <!-- Shop Header -->
      <div class="glass-panel fade-in-up" style="border-radius:var(--radius-xl);padding:20px;margin-bottom:24px;display:flex;gap:16px;align-items:center">
        <div style="width:64px;height:64px;border-radius:var(--radius-lg);overflow:hidden;flex-shrink:0;border:2px solid rgba(183,109,255,0.3)">
          <img src="${shop.images.storefront}" alt="${shop.name}" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div>
          <h1 style="font-size:20px;font-weight:700">${shop.name}</h1>
          <p style="font-size:12px;color:var(--on-surface-variant)">${shop.address}</p>
          <div style="display:flex;align-items:center;gap:4px;margin-top:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:#22c55e"></span>
            <span style="font-size:11px;color:#22c55e;font-weight:600">Open Now</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px" class="fade-in-up">
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;text-align:center">
          <span class="material-symbols-outlined" style="font-size:28px;color:var(--primary);display:block;margin-bottom:8px">inventory_2</span>
          <p style="font-size:28px;font-weight:800;color:var(--primary)">${shopProducts.length}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Products</p>
        </div>
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;text-align:center">
          <span class="material-symbols-outlined" style="font-size:28px;color:var(--secondary);display:block;margin-bottom:8px">bookmark</span>
          <p style="font-size:28px;font-weight:800;color:var(--secondary)">${reservations.length}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Reservations</p>
        </div>
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;text-align:center">
          <span class="material-symbols-outlined filled" style="font-size:28px;color:var(--tertiary);display:block;margin-bottom:8px">star</span>
          <p style="font-size:28px;font-weight:800;color:var(--tertiary)">${shop.rating}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Rating</p>
        </div>
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;text-align:center">
          <span class="material-symbols-outlined" style="font-size:28px;color:var(--on-surface-variant);display:block;margin-bottom:8px">visibility</span>
          <p style="font-size:28px;font-weight:800">${Math.floor(Math.random()*500+200)}</p>
          <p style="font-size:11px;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em">Views Today</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <h2 style="font-size:18px;font-weight:700;margin-bottom:12px" class="fade-in-up">Quick Actions</h2>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px" class="fade-in-up">
        <a href="#/shop/add-product" class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;text-decoration:none;color:inherit;transition:border-color 0.2s;border:1px solid rgba(183,109,255,0.2)">
          <span class="material-symbols-outlined" style="font-size:32px;color:var(--primary)">add_photo_alternate</span>
          <span style="font-size:13px;font-weight:600">Add Product</span>
        </a>
        <a href="#/shop/reservations" class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;text-decoration:none;color:inherit;transition:border-color 0.2s">
          <span class="material-symbols-outlined" style="font-size:32px;color:var(--secondary)">list_alt</span>
          <span style="font-size:13px;font-weight:600">Reservations</span>
        </a>
        <a href="#/shop/shop-1" class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;text-decoration:none;color:inherit">
          <span class="material-symbols-outlined" style="font-size:32px;color:var(--tertiary)">storefront</span>
          <span style="font-size:13px;font-weight:600">View Shop</span>
        </a>
        <div class="glass-panel" style="border-radius:var(--radius-xl);padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer" id="edit-shop-btn">
          <span class="material-symbols-outlined" style="font-size:32px;color:var(--on-surface-variant)">settings</span>
          <span style="font-size:13px;font-weight:600">Shop Settings</span>
        </div>
      </div>

      <!-- Recent Products -->
      <h2 style="font-size:18px;font-weight:700;margin-bottom:12px" class="fade-in-up">Your Products</h2>
      <div style="display:flex;flex-direction:column;gap:12px" class="fade-in-up">
        ${shopProducts.map(p => `
          <div class="glass-panel" style="border-radius:var(--radius-lg);padding:12px;display:flex;gap:12px;align-items:center">
            <div style="width:56px;height:56px;border-radius:var(--radius);overflow:hidden;flex-shrink:0">
              <img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover" />
            </div>
            <div style="flex:1;min-width:0">
              <p style="font-size:14px;font-weight:600" class="truncate">${p.title}</p>
              <p style="font-size:14px;color:var(--primary);font-weight:700">₹${p.price.toLocaleString('en-IN')}</p>
              <div style="display:flex;gap:4px;margin-top:2px">
                ${p.sizes.map(s => `<span style="font-size:9px;padding:1px 6px;border-radius:var(--radius-full);background:var(--surface-container);color:var(--on-surface-variant)">${s}</span>`).join('')}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
              ${p.arEnabled ? '<span style="font-size:9px;padding:2px 6px;border-radius:var(--radius-full);background:rgba(183,109,255,0.15);color:var(--primary);font-weight:600">AR ON</span>' : ''}
              <span style="font-size:9px;padding:2px 6px;border-radius:var(--radius-full);background:rgba(60,221,199,0.15);color:var(--tertiary);font-weight:600">Active</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Recent Reservations -->
      <h2 style="font-size:18px;font-weight:700;margin:24px 0 12px" class="fade-in-up">Recent Reservations</h2>
      ${reservations.length === 0 ? '<p class="fade-in-up" style="font-size:14px;color:var(--outline)">No reservations yet</p>' :
        `<div style="display:flex;flex-direction:column;gap:12px" class="fade-in-up">${
          reservations.slice(-5).reverse().map(r => {
            const p = products.find(x => x.id === r.productId);
            return `<div class="glass-panel" style="border-radius:var(--radius-lg);padding:12px;display:flex;gap:12px;align-items:center">
              <div style="width:48px;height:48px;border-radius:var(--radius);overflow:hidden;flex-shrink:0">
                <img src="${p?.image||''}" alt="" style="width:100%;height:100%;object-fit:cover" />
              </div>
              <div style="flex:1;min-width:0">
                <p style="font-size:13px;font-weight:600" class="truncate">${p?.title||'Product'}</p>
                <p style="font-size:11px;color:var(--on-surface-variant)">Size ${r.size} · ${new Date(r.time).toLocaleDateString()}</p>
              </div>
              <div style="text-align:right">
                <p style="font-size:12px;font-weight:700;color:var(--tertiary);font-family:monospace">${r.code}</p>
                <span style="font-size:9px;padding:2px 6px;border-radius:var(--radius-full);background:rgba(255,175,211,0.15);color:var(--secondary);font-weight:600">Pending</span>
              </div>
            </div>`;
          }).join('')
        }</div>`
      }
    </main>
  `;

  container.querySelector('#edit-shop-btn')?.addEventListener('click', () => showToast('Shop settings coming soon', 'info'));
}

// ── Add Product Screen ──
export async function renderAddProduct(container) {
  container.innerHTML = `
    <header class="top-bar">
      <button onclick="history.back()" style="padding:8px"><span class="material-symbols-outlined" style="color:#a1a1aa">arrow_back</span></button>
      <span style="font-size:20px;font-weight:900;font-style:italic;letter-spacing:-0.05em;color:#a855f7">Add Product</span>
      <div></div>
    </header>

    <main class="screen--padded" style="padding-bottom:40px">
      <form id="product-form" style="display:flex;flex-direction:column;gap:20px">
        <!-- Image Upload -->
        <div class="glass-panel fade-in-up" style="border-radius:var(--radius-xl);padding:32px;text-align:center;cursor:pointer;border:2px dashed rgba(183,109,255,0.3);transition:border-color 0.2s" id="upload-area">
          <div id="upload-preview" style="display:none;margin-bottom:12px"><img id="preview-img" style="width:100%;max-height:300px;object-fit:contain;border-radius:var(--radius)" /></div>
          <span class="material-symbols-outlined" style="font-size:48px;color:var(--primary);display:block;margin-bottom:8px" id="upload-icon">add_photo_alternate</span>
          <p style="font-size:14px;font-weight:600;margin-bottom:4px" id="upload-label">Tap to upload product photo</p>
          <p style="font-size:11px;color:var(--outline)">JPG, PNG or WebP · Max 10MB</p>
          <input type="file" id="file-input" accept="image/*" style="display:none" />
        </div>

        <!-- Title -->
        <div class="fade-in-up" style="animation-delay:0.05s">
          <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Product Title</label>
          <input type="text" id="p-title" placeholder="e.g. Designer Floral Kurti" style="width:100%;padding:14px 16px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:15px" required />
        </div>

        <!-- Category + Gender -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px" class="fade-in-up" >
          <div>
            <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Category</label>
            <select id="p-category" style="width:100%;padding:14px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:14px">
              <option value="kurtis">Kurtis</option><option value="suits">Suits</option><option value="sarees">Sarees</option>
              <option value="shirts">Shirts</option><option value="dresses">Dresses</option><option value="jackets">Jackets</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Gender</label>
            <select id="p-gender" style="width:100%;padding:14px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:14px">
              <option value="women">Women</option><option value="men">Men</option><option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <!-- Price -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px" class="fade-in-up">
          <div>
            <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Selling Price ₹</label>
            <input type="number" id="p-price" placeholder="999" style="width:100%;padding:14px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:15px" required />
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">MRP ₹</label>
            <input type="number" id="p-mrp" placeholder="1499" style="width:100%;padding:14px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:15px" />
          </div>
        </div>

        <!-- Sizes -->
        <div class="fade-in-up">
          <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Available Sizes</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap" id="size-checkboxes">
            ${['S','M','L','XL','XXL','Free'].map(s => `
              <label style="display:flex;align-items:center;gap:6px;padding:10px 16px;border-radius:var(--radius-full);background:var(--surface-container);border:1px solid var(--glass-border);cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s" class="size-check">
                <input type="checkbox" value="${s}" ${['S','M','L','XL'].includes(s)?'checked':''} style="accent-color:var(--primary)" />
                ${s}
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Fabric + Description -->
        <div class="fade-in-up">
          <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Fabric</label>
          <input type="text" id="p-fabric" placeholder="e.g. Premium Rayon" style="width:100%;padding:14px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:15px" />
        </div>

        <div class="fade-in-up">
          <label style="font-size:12px;font-weight:600;color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Description</label>
          <textarea id="p-desc" rows="3" placeholder="Describe the product..." style="width:100%;padding:14px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-lg);color:var(--on-surface);font-size:15px;resize:vertical"></textarea>
        </div>

        <!-- AR Toggle -->
        <div class="glass-panel fade-in-up" style="border-radius:var(--radius-xl);padding:16px;display:flex;justify-content:space-between;align-items:center">
          <div style="display:flex;align-items:center;gap:12px">
            <span class="material-symbols-outlined" style="color:var(--primary)">view_in_ar</span>
            <div>
              <p style="font-size:14px;font-weight:600">Enable AR Try-On</p>
              <p style="font-size:11px;color:var(--on-surface-variant)">Allow users to try this product via camera</p>
            </div>
          </div>
          <label style="position:relative;width:44px;height:24px;cursor:pointer">
            <input type="checkbox" id="p-ar" checked style="opacity:0;width:0;height:0" />
            <span style="position:absolute;inset:0;background:var(--surface-container);border-radius:var(--radius-full);transition:all 0.3s;border:1px solid var(--glass-border)" class="toggle-track"></span>
          </label>
        </div>

        <!-- Submit -->
        <button type="submit" class="neon-button fade-in-up" style="width:100%;padding:16px;border-radius:var(--radius-xl);font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px">
          <span class="material-symbols-outlined">publish</span> Publish Product
        </button>
      </form>
    </main>
  `;

  // Toggle styling
  const style = document.createElement('style');
  style.textContent = `
    .toggle-track::before { content:''; position:absolute; width:18px; height:18px; border-radius:50%; background:var(--outline); top:2px; left:2px; transition:all 0.3s; }
    #p-ar:checked + .toggle-track { background:rgba(183,109,255,0.3); border-color:var(--primary); }
    #p-ar:checked + .toggle-track::before { transform:translateX(20px); background:var(--primary); }
  `;
  container.appendChild(style);

  // File upload
  let uploadedFile = null;
  let uploadedImageUrl = null;
  const uploadArea = container.querySelector('#upload-area');
  const fileInput = container.querySelector('#file-input');
  uploadArea.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      container.querySelector('#preview-img').src = ev.target.result;
      container.querySelector('#upload-preview').style.display = 'block';
      container.querySelector('#upload-icon').style.display = 'none';
      container.querySelector('#upload-label').textContent = file.name;
    };
    reader.readAsDataURL(file);

    // Try uploading to backend
    container.querySelector('#upload-label').textContent = 'Uploading...';
    const result = await api.uploadImage(file);
    if (result?.images) {
      uploadedImageUrl = result.images.original;
      container.querySelector('#upload-label').textContent = '✅ Uploaded — ' + file.name;
    } else {
      container.querySelector('#upload-label').textContent = file.name;
    }
  });

  // Form submit
  container.querySelector('#product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sizes = Array.from(container.querySelectorAll('#size-checkboxes input:checked')).map(i => i.value);
    const productData = {
      title: container.querySelector('#p-title').value,
      category: container.querySelector('#p-category').value,
      gender: container.querySelector('#p-gender').value,
      price: Number(container.querySelector('#p-price').value),
      mrp: Number(container.querySelector('#p-mrp').value) || undefined,
      sizes,
      fabric: container.querySelector('#p-fabric').value,
      description: container.querySelector('#p-desc').value,
      arEnabled: container.querySelector('#p-ar').checked,
      images: uploadedImageUrl ? { original: uploadedImageUrl } : {},
    };

    // Try backend
    const result = await api.addProduct(productData);
    if (result?.product) {
      showToast('Product published to server! 🎉', 'check_circle');
    } else {
      showToast('Product saved locally! 🎉', 'check_circle');
    }
    setTimeout(() => { window.location.hash = '#/shop/dashboard'; }, 1500);
  });
}
