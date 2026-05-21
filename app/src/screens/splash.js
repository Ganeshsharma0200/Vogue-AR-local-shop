/* ============================================================
   SPLASH SCREEN — Animated brand intro
   ============================================================ */

export async function renderSplash(container) {
  container.innerHTML = `
    <div class="splash" id="splash-screen">
      <div class="splash__bg"></div>
      <div class="splash__content">
        <div class="splash__logo logo-entrance">
          <div class="splash__logo-icon">
            <span class="material-symbols-outlined" style="font-size:48px;color:var(--primary-container)">view_in_ar</span>
          </div>
          <h1 class="splash__brand neon-text-glow">VOGUE AR</h1>
          <p class="splash__tagline">Camera Se Pehen Ke Dekho</p>
        </div>
        <div class="splash__subtitle fade-in" style="animation-delay:0.8s">
          <span class="material-symbols-outlined" style="font-size:16px">location_on</span>
          <span>Discover Nearby Fashion • Try Before Visit</span>
        </div>
        <div class="splash__loader fade-in" style="animation-delay:1.2s">
          <div class="splash__loader-bar"></div>
        </div>
      </div>
      <div class="splash__particles" id="particles"></div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .splash { position:fixed; inset:0; z-index:100; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .splash__bg { position:absolute; inset:0; background:radial-gradient(ellipse at center, #1a0030 0%, #131315 60%, #0a0a0c 100%); }
    .splash__bg::before { content:''; position:absolute; top:20%; left:50%; transform:translateX(-50%); width:300px; height:300px; background:radial-gradient(circle, rgba(183,109,255,0.15) 0%, transparent 70%); border-radius:50%; filter:blur(60px); animation:float 3s ease-in-out infinite; }
    .splash__content { position:relative; z-index:2; text-align:center; padding:20px; }
    .splash__logo { margin-bottom:32px; }
    .splash__logo-icon { width:80px; height:80px; border-radius:20px; background:rgba(183,109,255,0.1); border:1px solid rgba(183,109,255,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 0 30px rgba(183,109,255,0.2); }
    .splash__brand { font-size:48px; font-weight:900; font-style:italic; letter-spacing:-0.04em; background:linear-gradient(135deg, #ddb7ff, #b76dff, #ffafd3); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:8px; }
    .splash__tagline { font-size:14px; font-weight:500; color:var(--on-surface-variant); letter-spacing:0.15em; text-transform:uppercase; }
    .splash__subtitle { display:flex; align-items:center; gap:6px; justify-content:center; color:var(--outline); font-size:12px; letter-spacing:0.05em; opacity:0; margin-bottom:40px; }
    .splash__loader { width:200px; margin:0 auto; height:3px; background:var(--surface-container-high); border-radius:var(--radius-full); overflow:hidden; opacity:0; }
    .splash__loader-bar { width:0%; height:100%; background:linear-gradient(90deg, var(--inverse-primary), var(--primary-container), var(--secondary)); border-radius:var(--radius-full); animation:loaderFill 2s ease-in-out forwards 1.5s; }
    @keyframes loaderFill { to { width:100%; } }
    .splash__particles { position:absolute; inset:0; z-index:1; }
  `;
  container.appendChild(style);

  // Create particles
  const particlesEl = container.querySelector('#particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `position:absolute; width:${size}px; height:${size}px; background:rgba(183,109,255,${Math.random()*0.4+0.1}); border-radius:50%; top:${Math.random()*100}%; left:${Math.random()*100}%; animation:float ${3+Math.random()*4}s ease-in-out infinite; animation-delay:${Math.random()*2}s;`;
    particlesEl.appendChild(p);
  }

  // Auto-navigate after animation
  setTimeout(() => {
    window.location.hash = '#/login';
  }, 3500);
}
