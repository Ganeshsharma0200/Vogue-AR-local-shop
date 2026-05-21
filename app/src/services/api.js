/* ============================================================
   API SERVICE — Connects frontend to backend
   Falls back to mock data if backend is unavailable
   ============================================================ */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken = localStorage.getItem('voguear_token') || null;

// ── Helper ───────────────────────────────────
async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (err) {
    console.warn(`[API] ${endpoint} failed:`, err.message);
    return null; // Fallback to mock data
  }
}

// ── Auth ─────────────────────────────────────
export const api = {
  // Auth
  async sendOtp(phone) {
    return request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) });
  },

  async verifyOtp(phone, otp) {
    const data = await request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) });
    if (data?.token) {
      authToken = data.token;
      localStorage.setItem('voguear_token', data.token);
    }
    return data;
  },

  async getProfile() {
    return request('/auth/me');
  },

  async updateProfile(updates) {
    return request('/auth/me', { method: 'PUT', body: JSON.stringify(updates) });
  },

  // Shops
  async getNearbyShops(lat, lng, radius = 10, category) {
    let url = `/shops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
    if (category && category !== 'all') url += `&category=${category}`;
    return request(url);
  },

  async getShop(id) {
    return request(`/shops/${id}`);
  },

  async getShopProducts(shopId, category) {
    let url = `/shops/${shopId}/products`;
    if (category) url += `?category=${category}`;
    return request(url);
  },

  async registerShop(shopData) {
    return request('/shops', { method: 'POST', body: JSON.stringify(shopData) });
  },

  async getShopStats(shopId) {
    return request(`/shops/${shopId}/stats`);
  },

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    return request(`/products?${params}`);
  },

  async getProduct(id) {
    return request(`/products/${id}`);
  },

  async addProduct(productData) {
    return request('/products', { method: 'POST', body: JSON.stringify(productData) });
  },

  async updateProduct(id, updates) {
    return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  },

  async deleteProduct(id) {
    return request(`/products/${id}`, { method: 'DELETE' });
  },

  async addReview(productId, review) {
    return request(`/products/${productId}/review`, { method: 'POST', body: JSON.stringify(review) });
  },

  // Reservations
  async createReservation(productId, size, arScreenshot) {
    return request('/reservations', { method: 'POST', body: JSON.stringify({ productId, size, arScreenshot }) });
  },

  async getMyReservations() {
    return request('/reservations/mine');
  },

  async getShopReservations(shopId, status) {
    let url = `/reservations/shop/${shopId}`;
    if (status) url += `?status=${status}`;
    return request(url);
  },

  async updateReservation(id, status) {
    return request(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
  },

  // Images
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/images/upload`, {
        method: 'POST',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
        body: formData,
      });
      return res.json();
    } catch (err) {
      console.warn('[API] Image upload failed:', err.message);
      return null;
    }
  },

  async removeBackground(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/images/remove-bg`, {
        method: 'POST',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
        body: formData,
      });
      return res.json();
    } catch (err) {
      console.warn('[API] BG removal failed:', err.message);
      return null;
    }
  },

  async extractColors(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/images/extract-colors`, {
        method: 'POST',
        headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
        body: formData,
      });
      return res.json();
    } catch (err) {
      console.warn('[API] Color extraction failed:', err.message);
      return null;
    }
  },

  // Favorites
  async addFavorite(productId) {
    return request(`/favorites/${productId}`, { method: 'POST' });
  },

  async removeFavorite(productId) {
    return request(`/favorites/${productId}`, { method: 'DELETE' });
  },

  async getFavorites() {
    return request('/favorites');
  },

  // Health
  async checkHealth() {
    return request('/health');
  },

  // Token
  setToken(token) {
    authToken = token;
    localStorage.setItem('voguear_token', token);
  },

  clearToken() {
    authToken = null;
    localStorage.removeItem('voguear_token');
  },

  isAuthenticated() {
    return !!authToken;
  },
};

export default api;
