/**
 * SIM-UI Feedback, Badges & Floating Toasts Component
 * SDN Kalisalak 01 Component Engine
 * 
 * Standar Desain:
 * - Latar belakang modern dengan tema Navy Blue (#0b1329 / #0f172a)
 * - Aksen Emas / Gold (#f59e0b)
 * - Status Sukses Hijau (#10b981), Bahaya Merah (#ef4444)
 * - Teks Kontras Putih (#ffffff)
 * - Animasi Smooth Fade & Slide
 * - Kompatibel gaya Sonner / React-Hot-Toast (toast.success, toast.error)
 */
(function (global) {
  'use strict';

  function escapeHtml(str) {
    if (global.SIM_CORE && global.SIM_CORE.escapeHtml) {
      return global.SIM_CORE.escapeHtml(str);
    }
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function ensureToastContainer() {
    let container = document.getElementById('sim-toast-stack');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sim-toast-stack';
      container.className = 'sim-toast-stack';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, variant = 'info', duration = 3500) {
    const container = ensureToastContainer();
    const toastEl = document.createElement('div');
    toastEl.className = `sim-toast sim-toast-${variant}`;

    let iconHtml = `
      <span class="sim-toast-icon sim-toast-icon-info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </span>
    `;

    if (variant === 'success') {
      iconHtml = `
        <span class="sim-toast-icon sim-toast-icon-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </span>
      `;
    } else if (variant === 'danger' || variant === 'error') {
      iconHtml = `
        <span class="sim-toast-icon sim-toast-icon-danger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        </span>
      `;
    } else if (variant === 'warning') {
      iconHtml = `
        <span class="sim-toast-icon sim-toast-icon-warning">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </span>
      `;
    } else if (variant === 'gold') {
      iconHtml = `
        <span class="sim-toast-icon sim-toast-icon-gold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </span>
      `;
    }

    toastEl.innerHTML = `
      ${iconHtml}
      <span class="sim-toast-message">${escapeHtml(message)}</span>
      <button type="button" class="sim-toast-close" title="Tutup">✕</button>
    `;

    container.appendChild(toastEl);

    const closeBtn = toastEl.querySelector('.sim-toast-close');
    let timer = null;

    const dismiss = () => {
      if (timer) clearTimeout(timer);
      toastEl.classList.add('sim-toast-hiding');
      setTimeout(() => {
        if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
      }, 250);
    };

    if (closeBtn) closeBtn.onclick = dismiss;

    timer = setTimeout(dismiss, duration);
  }

  function createBadgeHtml(text, variant = 'blue') {
    return `<span class="sim-badge-pill sim-badge-${variant}">${escapeHtml(text)}</span>`;
  }

  function showLoading(title = 'Sedang Memproses Dokumen...', desc = 'Mohon tunggu sejenak, sistem sedang menyusun dokumen resmi...') {
    hideLoading();
    const overlay = document.createElement('div');
    overlay.id = 'sim-loading-overlay';
    overlay.className = 'sim-loading-overlay';
    overlay.innerHTML = `
      <div class="sim-loading-box">
        <div class="sim-loading-spinner"></div>
        <h4 class="sim-loading-title">${escapeHtml(title)}</h4>
        <p class="sim-loading-desc">${escapeHtml(desc)}</p>
        <div class="sim-loading-progress-bar"><div class="sim-loading-progress-fill"></div></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function hideLoading() {
    const existing = document.getElementById('sim-loading-overlay');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  // Sonner / React-Hot-Toast style helper
  const toastObj = function (msg, variant, duration) {
    return showToast(msg, variant, duration);
  };
  toastObj.success = (msg, dur) => showToast(msg, 'success', dur);
  toastObj.error = (msg, dur) => showToast(msg, 'danger', dur);
  toastObj.danger = (msg, dur) => showToast(msg, 'danger', dur);
  toastObj.warning = (msg, dur) => showToast(msg, 'warning', dur);
  toastObj.info = (msg, dur) => showToast(msg, 'info', dur);
  toastObj.gold = (msg, dur) => showToast(msg, 'gold', dur);

  if (typeof window !== 'undefined') {
    window.showToast = showToast;
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.toast = toastObj;
  }

  global.SIM_FEEDBACK = {
    toast: toastObj,
    badge: createBadgeHtml,
    showLoading: showLoading,
    hideLoading: hideLoading
  };

})(typeof window !== 'undefined' ? window : global);
