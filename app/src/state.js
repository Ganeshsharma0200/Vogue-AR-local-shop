/* ============================================================
   APP STATE — Centralized state with localStorage persistence
   ============================================================ */

const STORAGE_KEY = 'vogue_ar_state';

const defaultState = {
  isLoggedIn: false,
  user: { name: 'Fashion Lover', phone: '', size: 'M', gender: 'women' },
  favorites: [],       // product IDs
  reservations: [],    // { productId, shopId, size, time, code }
  selectedSize: 'M',
  activeCategory: 'all',
  searchQuery: '',
};

let state = { ...defaultState };

// Load from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = { ...defaultState, ...JSON.parse(saved) };
  } catch(e) { /* ignore */ }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}

export function getState() { return state; }

export function setState(partial) {
  state = { ...state, ...partial };
  saveState();
}

export function toggleFavorite(productId) {
  const idx = state.favorites.indexOf(productId);
  if (idx > -1) state.favorites.splice(idx, 1);
  else state.favorites.push(productId);
  saveState();
  return state.favorites.includes(productId);
}

export function isFavorite(productId) {
  return state.favorites.includes(productId);
}

export function addReservation(productId, shopId, size) {
  const code = 'VA-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  const reservation = { productId, shopId, size, time: new Date().toISOString(), code };
  state.reservations.push(reservation);
  saveState();
  return reservation;
}

export function getReservationCount() { return state.reservations.length; }

// Initialize
loadState();
