/* ============================================================
   CHAT — User ↔ Shop messaging (simulated)
   ============================================================ */
import { getShopById } from '../data/shops.js';
import { goBack } from '../router.js';

export async function renderChat(container, params) {
  const shop = getShopById(params.id);
  const shopName = shop ? shop.name : 'Shop';

  // Simulated chat messages
  const messages = [
    { from: 'shop', text: `Welcome to ${shopName}! How can we help you? 👋`, time: '10:30 AM' },
    { from: 'user', text: 'Hi! I saw the Designer Floral Kurti on the app. Is it available in size M?', time: '10:31 AM' },
    { from: 'shop', text: 'Yes! Size M is in stock. Would you like to reserve it?', time: '10:32 AM' },
    { from: 'user', text: 'I tried it with AR and it looks great! Can I come by at 5 PM?', time: '10:33 AM' },
    { from: 'shop', text: "Perfect! We'll keep it ready for you. See you at 5! 🛍️", time: '10:34 AM' },
  ];

  container.innerHTML = `
    <div style="position:fixed;inset:0;display:flex;flex-direction:column;max-width:430px;margin:0 auto;background:var(--background)">
      <!-- Chat Header -->
      <header class="glass-panel" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--glass-border);flex-shrink:0">
        <button id="chat-back" style="padding:8px"><span class="material-symbols-outlined" style="color:#a1a1aa">arrow_back</span></button>
        ${shop ? `<img src="${shop.images.storefront}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid rgba(183,109,255,0.3)" />` : ''}
        <div style="flex:1;min-width:0">
          <p style="font-size:15px;font-weight:700">${shopName}</p>
          <p style="font-size:11px;color:#22c55e;display:flex;align-items:center;gap:4px">
            <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block"></span> Online
          </p>
        </div>
        <button style="padding:8px"><span class="material-symbols-outlined" style="color:var(--primary)">call</span></button>
      </header>

      <!-- Messages Area -->
      <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px" id="messages">
        ${messages.map(m => `
          <div style="display:flex;${m.from==='user'?'justify-content:flex-end':'justify-content:flex-start'}">
            <div style="max-width:80%;padding:10px 14px;border-radius:${m.from==='user'?'var(--radius-xl) var(--radius-xl) 4px var(--radius-xl)':'var(--radius-xl) var(--radius-xl) var(--radius-xl) 4px'};background:${m.from==='user'?'rgba(183,109,255,0.2)':'var(--surface-container-high)'};border:1px solid ${m.from==='user'?'rgba(183,109,255,0.2)':'var(--glass-border)'}">
              <p style="font-size:14px;line-height:1.5">${m.text}</p>
              <p style="font-size:9px;color:var(--outline);text-align:right;margin-top:4px">${m.time}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Chat Input -->
      <div style="padding:12px 16px;border-top:1px solid var(--glass-border);background:rgba(9,9,11,0.9);backdrop-filter:blur(20px);display:flex;gap:10px;align-items:center;flex-shrink:0">
        <button style="padding:8px"><span class="material-symbols-outlined" style="color:var(--outline)">add_circle</span></button>
        <input type="text" id="chat-input" placeholder="Type a message..." style="flex:1;padding:10px 16px;background:var(--surface-container-high);border:1px solid var(--glass-border);border-radius:var(--radius-full);color:var(--on-surface);font-size:14px" />
        <button id="send-btn" style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#b76dff,#842bd2);display:flex;align-items:center;justify-content:center">
          <span class="material-symbols-outlined" style="font-size:20px;color:white">send</span>
        </button>
      </div>
    </div>
  `;

  container.querySelector('#chat-back').addEventListener('click', () => goBack());

  // Send message
  const sendMessage = () => {
    const input = container.querySelector('#chat-input');
    const text = input.value.trim();
    if (!text) return;

    const messagesDiv = container.querySelector('#messages');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    messagesDiv.innerHTML += `
      <div style="display:flex;justify-content:flex-end" class="fade-in-up">
        <div style="max-width:80%;padding:10px 14px;border-radius:var(--radius-xl) var(--radius-xl) 4px var(--radius-xl);background:rgba(183,109,255,0.2);border:1px solid rgba(183,109,255,0.2)">
          <p style="font-size:14px;line-height:1.5">${text}</p>
          <p style="font-size:9px;color:var(--outline);text-align:right;margin-top:4px">${time}</p>
        </div>
      </div>`;

    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Simulated reply
    setTimeout(() => {
      messagesDiv.innerHTML += `
        <div style="display:flex;justify-content:flex-start" class="fade-in-up">
          <div style="max-width:80%;padding:10px 14px;border-radius:var(--radius-xl) var(--radius-xl) var(--radius-xl) 4px;background:var(--surface-container-high);border:1px solid var(--glass-border)">
            <p style="font-size:14px;line-height:1.5">Thanks for your message! We'll get back to you shortly 🙏</p>
            <p style="font-size:9px;color:var(--outline);text-align:right;margin-top:4px">${time}</p>
          </div>
        </div>`;
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1500);
  };

  container.querySelector('#send-btn').addEventListener('click', sendMessage);
  container.querySelector('#chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Scroll to bottom
  setTimeout(() => { container.querySelector('#messages').scrollTop = 99999; }, 100);
}
