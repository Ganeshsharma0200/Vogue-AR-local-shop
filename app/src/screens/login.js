/* ============================================================
   LOGIN SCREEN — Phone OTP authentication
   ============================================================ */
import { setState, getState } from '../state.js';
import { navigate } from '../router.js';
import { api } from '../services/api.js';

export async function renderLogin(container) {
  const state = getState();
  if (state.isLoggedIn) { navigate('#/'); return; }

  container.innerHTML = `
    <div class="login-screen">
      <div class="login__bg"></div>
      <div class="login__content">
        <div class="login__header fade-in-up">
          <span class="material-symbols-outlined" style="font-size:40px;color:var(--primary-container)">view_in_ar</span>
          <h1 class="login__brand">VOGUE AR</h1>
          <p class="login__subtitle">Sign in to discover nearby fashion</p>
        </div>

        <div class="login__form fade-in-up" style="animation-delay:0.15s" id="login-form">
          <div class="login__input-group">
            <label class="text-label-sm" style="color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;display:block">Phone Number</label>
            <div class="login__input-wrap">
              <span class="login__prefix">+91</span>
              <input type="tel" id="phone-input" class="login__input" placeholder="Enter your mobile number" maxlength="10" autocomplete="tel" />
            </div>
          </div>

          <div class="login__otp-group" id="otp-group" style="display:none">
            <label class="text-label-sm" style="color:var(--on-surface-variant);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;display:block">Enter OTP</label>
            <div class="login__otp-inputs">
              <input type="text" maxlength="1" class="login__otp" data-idx="0" inputmode="numeric" />
              <input type="text" maxlength="1" class="login__otp" data-idx="1" inputmode="numeric" />
              <input type="text" maxlength="1" class="login__otp" data-idx="2" inputmode="numeric" />
              <input type="text" maxlength="1" class="login__otp" data-idx="3" inputmode="numeric" />
            </div>
            <p class="login__otp-hint">Demo: Enter any 4 digits</p>
          </div>

          <button class="neon-button login__btn" id="login-btn">
            <span>Send OTP</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>

          <button class="login__skip" id="skip-btn">Skip for now →</button>
        </div>

        <div class="login__features fade-in-up" style="animation-delay:0.3s">
          <div class="login__feature"><span class="material-symbols-outlined" style="color:var(--primary)">explore</span><span>Discover nearby shops</span></div>
          <div class="login__feature"><span class="material-symbols-outlined" style="color:var(--secondary)">view_in_ar</span><span>AR try-on experience</span></div>
          <div class="login__feature"><span class="material-symbols-outlined" style="color:var(--tertiary)">bookmark</span><span>Reserve & visit</span></div>
        </div>
      </div>
    </div>
  `;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .login-screen { min-height:100dvh; display:flex; align-items:center; justify-content:center; padding:20px; position:relative; }
    .login__bg { position:absolute; inset:0; background:radial-gradient(ellipse at top, #1a0030 0%, var(--background) 70%); }
    .login__content { position:relative; z-index:2; width:100%; max-width:380px; }
    .login__header { text-align:center; margin-bottom:40px; }
    .login__brand { font-size:36px; font-weight:900; font-style:italic; letter-spacing:-0.04em; color:#a855f7; margin:12px 0 8px; }
    .login__subtitle { font-size:14px; color:var(--on-surface-variant); }
    .login__input-group { margin-bottom:20px; }
    .login__input-wrap { display:flex; align-items:center; background:var(--surface-container-high); border:1px solid var(--glass-border); border-radius:var(--radius-xl); overflow:hidden; box-shadow:var(--inset-dark); }
    .login__input-wrap:focus-within { border-color:var(--secondary); }
    .login__prefix { padding:16px; font-size:16px; font-weight:600; color:var(--on-surface-variant); border-right:1px solid var(--glass-border); }
    .login__input { flex:1; padding:16px; background:transparent; border:none; font-size:16px; color:var(--on-surface); }
    .login__input::placeholder { color:var(--outline); }
    .login__otp-group { margin-bottom:20px; }
    .login__otp-inputs { display:flex; gap:12px; }
    .login__otp { width:56px; height:56px; text-align:center; font-size:24px; font-weight:700; background:var(--surface-container-high); border:1px solid var(--glass-border); border-radius:var(--radius-lg); color:var(--on-surface); box-shadow:var(--inset-dark); transition:border-color 0.2s; }
    .login__otp:focus { border-color:var(--primary); }
    .login__otp-hint { font-size:12px; color:var(--outline); margin-top:8px; }
    .login__btn { width:100%; padding:16px; border-radius:var(--radius-xl); font-size:16px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:16px; }
    .login__skip { width:100%; padding:12px; text-align:center; font-size:14px; color:var(--outline); transition:color 0.2s; }
    .login__skip:hover { color:var(--primary); }
    .login__features { display:flex; flex-direction:column; gap:12px; margin-top:40px; padding-top:24px; border-top:1px solid var(--glass-border); }
    .login__feature { display:flex; align-items:center; gap:12px; font-size:13px; color:var(--on-surface-variant); }
    .login__feature .material-symbols-outlined { font-size:20px; }
  `;
  container.appendChild(style);

  // Logic
  let step = 'phone';
  const phoneInput = container.querySelector('#phone-input');
  const otpGroup = container.querySelector('#otp-group');
  const loginBtn = container.querySelector('#login-btn');
  const skipBtn = container.querySelector('#skip-btn');
  const otpInputs = container.querySelectorAll('.login__otp');

  loginBtn.addEventListener('click', async () => {
    if (step === 'phone') {
      if (phoneInput.value.length < 10) { phoneInput.focus(); return; }
      step = 'otp';
      loginBtn.querySelector('span:first-child').textContent = 'Sending...';
      // Try backend OTP
      await api.sendOtp('+91' + phoneInput.value);
      otpGroup.style.display = 'block';
      loginBtn.querySelector('span:first-child').textContent = 'Verify & Login';
      otpInputs[0].focus();
    } else {
      const otp = Array.from(otpInputs).map(i => i.value).join('');
      if (otp.length < 4) { otpInputs[0].focus(); return; }
      loginBtn.querySelector('span:first-child').textContent = 'Verifying...';
      // Try backend verify
      const result = await api.verifyOtp('+91' + phoneInput.value, otp);
      if (result?.token) {
        setState({ isLoggedIn: true, user: { ...getState().user, phone: '+91 ' + phoneInput.value, token: result.token } });
      } else {
        // Fallback to local auth
        setState({ isLoggedIn: true, user: { ...getState().user, phone: '+91 ' + phoneInput.value } });
      }
      navigate('#/');
    }
  });

  // OTP auto-focus
  otpInputs.forEach((inp, idx) => {
    inp.addEventListener('input', () => {
      if (inp.value && idx < 3) otpInputs[idx + 1].focus();
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && idx > 0) otpInputs[idx - 1].focus();
    });
  });

  skipBtn.addEventListener('click', () => {
    setState({ isLoggedIn: true });
    navigate('#/');
  });
}
