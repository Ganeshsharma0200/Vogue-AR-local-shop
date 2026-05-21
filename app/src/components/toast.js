/* ============================================================
   TOAST — Notification component
   ============================================================ */

let toastTimeout = null;

export function showToast(message, icon = 'check_circle') {
  // Remove existing
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  clearTimeout(toastTimeout);

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="material-symbols-outlined filled">${icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
