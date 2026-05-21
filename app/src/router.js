/* ============================================================
   ROUTER — Hash-based SPA router with page transitions
   ============================================================ */

const routes = {};
let currentScreen = null;
let navigationDirection = 'forward';

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(hash, direction = 'forward') {
  navigationDirection = direction;
  window.location.hash = hash;
}

export function goBack() {
  navigationDirection = 'back';
  history.back();
}

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/';
  // Try exact match first
  if (routes[path]) return { handler: routes[path], params: {} };
  // Try param matching: /shop/:id
  for (const pattern of Object.keys(routes)) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) continue;
    const params = {};
    let match = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        match = false; break;
      }
    }
    if (match) return { handler: routes[pattern], params };
  }
  return null;
}

async function handleRoute() {
  const hash = window.location.hash || '#/';
  const match = matchRoute(hash);
  if (!match) { navigate('#/'); return; }

  const app = document.getElementById('app');
  const newContent = document.createElement('div');
  newContent.className = 'screen';

  // Render screen content
  await match.handler(newContent, match.params);

  // Page transition
  if (currentScreen) {
    const exitClass = navigationDirection === 'back' ? 'page-exit-forward' : 'page-exit';
    const enterClass = navigationDirection === 'back' ? 'page-enter-back' : 'page-enter';
    currentScreen.classList.add(exitClass);
    newContent.classList.add(enterClass);
    newContent.style.position = 'absolute';
    newContent.style.top = '0';
    newContent.style.left = '0';
    newContent.style.width = '100%';
    app.appendChild(newContent);
    setTimeout(() => {
      if (currentScreen && currentScreen.parentNode) currentScreen.remove();
      newContent.style.position = '';
      newContent.style.top = '';
      newContent.style.left = '';
      currentScreen = newContent;
    }, 400);
  } else {
    app.innerHTML = '';
    app.appendChild(newContent);
    currentScreen = newContent;
  }

  // Reset scroll
  window.scrollTo(0, 0);
  // Reset navigation direction
  navigationDirection = 'forward';
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('popstate', () => { navigationDirection = 'back'; });
  handleRoute();
}
