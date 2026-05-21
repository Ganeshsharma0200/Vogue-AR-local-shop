/* ============================================================
   BOTTOM NAVIGATION — Floating glass nav dock
   ============================================================ */

const tabs = [
  { id: 'explore', icon: 'explore', label: 'Explore', hash: '#/' },
  { id: 'ar', icon: 'view_in_ar', label: 'AR Home', hash: '#/ar-home' },
  { id: 'favorites', icon: 'favorite', label: 'Favorites', hash: '#/favorites' },
  { id: 'profile', icon: 'person', label: 'Profile', hash: '#/profile' },
];

export function renderBottomNav(activeTab = 'explore') {
  return `
    <nav class="bottom-nav" id="bottom-nav" role="navigation" aria-label="Main navigation">
      ${tabs.map(t => `
        <a href="${t.hash}" class="bottom-nav__item ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}" aria-label="${t.label}">
          <span class="material-symbols-outlined ${t.id === activeTab ? 'filled' : ''}">${t.icon}</span>
        </a>
      `).join('')}
    </nav>
  `;
}
