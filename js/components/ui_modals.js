/**
 * SIM-UI Modals & Dialogs Component
 * SDN Kalisalak 01 Component Engine
 * 
 * Standar Desain:
 * - Latar belakang modern dengan tema Navy Blue (#0b1329 / #111e38)
 * - Aksen Emas / Gold (#f59e0b / #fbbf24)
 * - Status Sukses (#10b981) / Bahaya-Merah (#ef4444)
 * - Teks Kontras Tinggi Putih (#ffffff / #e2e8f0)
 * - Animasi Smooth Fade & Scale (Backdrop blur)
 * - Dukungan Promise async/await & callback
 * - Kompatibel dengan SweetAlert2 (window.Swal.fire)
 * - Override fail-safe untuk window.alert(), window.confirm(), window.prompt()
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

  function createModalHtml(props = {}) {
    const {
      id = 'sim-modal-default',
      title = 'Informasi',
      body = '',
      footer = '',
      maxWidth = '600px',
      theme = 'navy'
    } = props;

    const themeClass = theme === 'navy' ? 'sim-modal-theme-navy' : '';

    return `
      <div id="${id}" class="sim-modal-overlay" onclick="if(event.target === this) window.SIM_UI ? window.SIM_UI.closeModal('${id}') : SIM_MODALS.closeModal('${id}')">
        <div class="sim-modal-card ${themeClass}" style="max-width: ${maxWidth};">
          <div class="sim-modal-header">
            <h4 class="sim-modal-title">${escapeHtml(title)}</h4>
            <button type="button" class="sim-modal-close-btn" onclick="window.SIM_UI ? window.SIM_UI.closeModal('${id}') : SIM_MODALS.closeModal('${id}')" title="Tutup">✕</button>
          </div>
          <div class="sim-modal-body">
            ${body}
          </div>
          ${footer ? `<div class="sim-modal-footer">${footer}</div>` : ''}
        </div>
      </div>
    `.trim();
  }

  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.add('sim-modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove('sim-modal-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (el.parentNode && el.id.startsWith('sim-dynamic-dialog-')) {
          el.parentNode.removeChild(el);
        }
      }, 250);
    }
  }

  function getIconBadgeHtml(iconType = 'info') {
    switch (iconType) {
      case 'success':
        return `
          <div class="sim-dialog-icon sim-dialog-icon-success">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        `;
      case 'danger':
      case 'error':
        return `
          <div class="sim-dialog-icon sim-dialog-icon-danger">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        `;
      case 'warning':
        return `
          <div class="sim-dialog-icon sim-dialog-icon-warning">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        `;
      case 'info':
      default:
        return `
          <div class="sim-dialog-icon sim-dialog-icon-info">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        `;
    }
  }

  /**
   * Custom Alert Dialog (Navy Blue + Gold / Status Accent)
   * Resolves Promise saat ditutup
   */
  function showAlertDialog(options = {}) {
    let opts = options;
    if (typeof options === 'string') {
      opts = { message: options, title: 'Pemberitahuan', icon: 'info' };
    }

    const {
      title = 'Pemberitahuan Sistem',
      message = '',
      icon = 'info',
      buttonText = 'Mengerti',
      maxWidth = '440px',
      onClose
    } = opts;

    return new Promise((resolve) => {
      const modalId = 'sim-dynamic-dialog-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const container = document.createElement('div');
      container.id = modalId;
      container.className = 'sim-modal-overlay';

      const iconHtml = getIconBadgeHtml(icon);

      container.innerHTML = `
        <div class="sim-modal-card sim-modal-theme-navy" style="max-width: ${maxWidth};">
          <div class="sim-dialog-center-header">
            ${iconHtml}
            <h3 class="sim-dialog-title">${escapeHtml(title)}</h3>
          </div>
          <div class="sim-dialog-body-text">
            ${message ? (typeof message === 'string' && (message.includes('<') ? message : escapeHtml(message))) : ''}
          </div>
          <div class="sim-dialog-actions-center">
            <button type="button" id="${modalId}-btn-ok" class="sim-dialog-btn sim-dialog-btn-gold">
              ${escapeHtml(buttonText)}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Trigger open animation
      requestAnimationFrame(() => {
        container.classList.add('sim-modal-open');
        document.body.style.overflow = 'hidden';
      });

      const cleanup = () => {
        container.classList.remove('sim-modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 250);
        if (typeof onClose === 'function') onClose();
        resolve();
      };

      const btnOk = document.getElementById(`${modalId}-btn-ok`);
      if (btnOk) {
        btnOk.onclick = cleanup;
        btnOk.focus();
      }

      container.onclick = (e) => {
        if (e.target === container) cleanup();
      };
    });
  }

  /**
   * Custom Confirm Dialog (Navy Blue + Gold / Danger Accent)
   * Mengembalikan Promise<boolean> dan juga mengeksekusi onConfirm/onCancel
   */
  function showConfirmDialog(options = {}) {
    let opts = options;
    if (typeof options === 'string') {
      opts = { message: options, title: 'Konfirmasi', variant: 'warning' };
    }

    const {
      title = 'Konfirmasi Tindakan',
      message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
      icon = 'warning',
      confirmText = 'Ya, Lanjutkan',
      cancelText = 'Batal',
      variant = 'gold', // 'gold', 'danger', 'primary'
      maxWidth = '460px',
      onConfirm,
      onCancel
    } = opts;

    return new Promise((resolve) => {
      const modalId = 'sim-dynamic-dialog-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const container = document.createElement('div');
      container.id = modalId;
      container.className = 'sim-modal-overlay';

      const iconType = (variant === 'danger' || String(confirmText).toLowerCase().includes('hapus')) ? 'danger' : icon;
      const iconHtml = getIconBadgeHtml(iconType);

      const confirmBtnClass = (variant === 'danger' || String(confirmText).toLowerCase().includes('hapus'))
        ? 'sim-dialog-btn sim-dialog-btn-danger'
        : 'sim-dialog-btn sim-dialog-btn-gold';

      container.innerHTML = `
        <div class="sim-modal-card sim-modal-theme-navy" style="max-width: ${maxWidth};">
          <div class="sim-dialog-center-header">
            ${iconHtml}
            <h3 class="sim-dialog-title">${escapeHtml(title)}</h3>
          </div>
          <div class="sim-dialog-body-text">
            ${message ? (typeof message === 'string' && (message.includes('<') ? message : escapeHtml(message))) : ''}
          </div>
          <div class="sim-dialog-actions-split">
            <button type="button" id="${modalId}-btn-cancel" class="sim-dialog-btn sim-dialog-btn-secondary">
              ${escapeHtml(cancelText)}
            </button>
            <button type="button" id="${modalId}-btn-confirm" class="${confirmBtnClass}">
              ${escapeHtml(confirmText)}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      requestAnimationFrame(() => {
        container.classList.add('sim-modal-open');
        document.body.style.overflow = 'hidden';
      });

      const cleanup = (confirmed) => {
        container.classList.remove('sim-modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 250);

        if (confirmed) {
          if (typeof onConfirm === 'function') onConfirm();
          resolve(true);
        } else {
          if (typeof onCancel === 'function') onCancel();
          resolve(false);
        }
      };

      const btnConfirm = document.getElementById(`${modalId}-btn-confirm`);
      const btnCancel = document.getElementById(`${modalId}-btn-cancel`);

      if (btnConfirm) btnConfirm.onclick = () => cleanup(true);
      if (btnCancel) btnCancel.onclick = () => cleanup(false);

      container.onclick = (e) => {
        if (e.target === container) cleanup(false);
      };

      // Escape key to dismiss
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          window.removeEventListener('keydown', handleKeyDown);
          cleanup(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
    });
  }

  /**
   * Custom Prompt Dialog (Navy Blue + Gold Input)
   * Mengembalikan Promise<string|null>
   */
  function showPromptDialog(options = {}) {
    let opts = options;
    if (typeof options === 'string') {
      opts = { message: options, title: 'Input Data', defaultValue: '' };
    }

    const {
      title = 'Masukkan Data',
      message = '',
      defaultValue = '',
      placeholder = 'Ketik di sini...',
      confirmText = 'Simpan',
      cancelText = 'Batal',
      maxWidth = '460px',
      onConfirm,
      onCancel
    } = opts;

    return new Promise((resolve) => {
      const modalId = 'sim-dynamic-dialog-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const container = document.createElement('div');
      container.id = modalId;
      container.className = 'sim-modal-overlay';

      const iconHtml = `
        <div class="sim-dialog-icon sim-dialog-icon-gold">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </div>
      `;

      container.innerHTML = `
        <div class="sim-modal-card sim-modal-theme-navy" style="max-width: ${maxWidth};">
          <div class="sim-dialog-center-header">
            ${iconHtml}
            <h3 class="sim-dialog-title">${escapeHtml(title)}</h3>
          </div>
          ${message ? `<div class="sim-dialog-body-text" style="margin-bottom: 0.75rem;">${escapeHtml(message)}</div>` : ''}
          <div style="padding: 0 1.5rem 1rem 1.5rem;">
            <input type="text" id="${modalId}-input" class="sim-dialog-input" value="${escapeHtml(defaultValue)}" placeholder="${escapeHtml(placeholder)}">
          </div>
          <div class="sim-dialog-actions-split">
            <button type="button" id="${modalId}-btn-cancel" class="sim-dialog-btn sim-dialog-btn-secondary">
              ${escapeHtml(cancelText)}
            </button>
            <button type="button" id="${modalId}-btn-confirm" class="sim-dialog-btn sim-dialog-btn-gold">
              ${escapeHtml(confirmText)}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const input = document.getElementById(`${modalId}-input`);

      requestAnimationFrame(() => {
        container.classList.add('sim-modal-open');
        document.body.style.overflow = 'hidden';
        if (input) {
          input.focus();
          input.select();
        }
      });

      const cleanup = (value) => {
        container.classList.remove('sim-modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
          if (container.parentNode) container.parentNode.removeChild(container);
        }, 250);

        if (value !== null) {
          if (typeof onConfirm === 'function') onConfirm(value);
          resolve(value);
        } else {
          if (typeof onCancel === 'function') onCancel();
          resolve(null);
        }
      };

      const btnConfirm = document.getElementById(`${modalId}-btn-confirm`);
      const btnCancel = document.getElementById(`${modalId}-btn-cancel`);

      if (btnConfirm) btnConfirm.onclick = () => cleanup(input ? input.value : '');
      if (btnCancel) btnCancel.onclick = () => cleanup(null);

      if (input) {
        input.onkeydown = (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            cleanup(input.value);
          } else if (e.key === 'Escape') {
            cleanup(null);
          }
        };
      }

      container.onclick = (e) => {
        if (e.target === container) cleanup(null);
      };
    });
  }

  // =========================================================================
  // SWEETALERT2 (Swal.fire) COMPATIBILITY LAYER
  // =========================================================================
  const Swal = {
    fire: function (titleOrOptions, text, icon) {
      let opts = {};
      if (typeof titleOrOptions === 'string') {
        opts.title = titleOrOptions;
        opts.text = text || '';
        opts.icon = icon || 'info';
      } else if (typeof titleOrOptions === 'object') {
        opts = Object.assign({}, titleOrOptions);
      }

      const title = opts.title || (opts.icon === 'error' ? 'Terjadi Kesalahan' : 'Pemberitahuan');
      const message = opts.html || opts.text || '';
      const iconType = opts.icon || 'info';

      if (opts.showCancelButton || opts.showDenyButton) {
        return showConfirmDialog({
          title: title,
          message: message,
          icon: iconType,
          confirmText: opts.confirmButtonText || 'Ya, Lanjutkan',
          cancelText: opts.cancelButtonText || 'Batal',
          variant: (iconType === 'error' || iconType === 'danger') ? 'danger' : 'gold'
        }).then((confirmed) => {
          return {
            isConfirmed: !!confirmed,
            isDenied: false,
            isDismissed: !confirmed
          };
        });
      }

      if (opts.input) {
        return showPromptDialog({
          title: title,
          message: message,
          defaultValue: opts.inputValue || '',
          placeholder: opts.inputPlaceholder || '',
          confirmText: opts.confirmButtonText || 'OK',
          cancelText: opts.cancelButtonText || 'Batal'
        }).then((val) => {
          return {
            isConfirmed: val !== null,
            isDismissed: val === null,
            value: val
          };
        });
      }

      return showAlertDialog({
        title: title,
        message: message,
        icon: iconType,
        buttonText: opts.confirmButtonText || 'Mengerti'
      }).then(() => {
        return { isConfirmed: true, isDismissed: false };
      });
    }
  };

  // Expose SweetAlert2 shim globally so any standard Swal call works seamlessly
  global.Swal = Swal;

  // =========================================================================
  // FAIL-SAFE NATIVE BROWSER OVERRIDES (NO MORE BLOCKING UGLY BROWSER POPUPS)
  // =========================================================================
  if (typeof window !== 'undefined') {
    window.alert = function (message) {
      return showAlertDialog({
        title: 'Pemberitahuan Sistem',
        message: String(message || ''),
        icon: String(message).toLowerCase().includes('berhasil') ? 'success' : (String(message).toLowerCase().includes('gagal') ? 'danger' : 'info')
      });
    };

    window.confirm = function (message) {
      console.warn('Native window.confirm() terpanggil. Disarankan menggunakan async/await SIM_UI.confirm().');
      // Tampilkan toast peringatan jika berjalan di alur sinkron
      if (global.SIM_FEEDBACK && global.SIM_FEEDBACK.toast) {
        global.SIM_FEEDBACK.toast(message, 'warning', 4000);
      }
      return true;
    };

    window.prompt = function (message, defaultValue) {
      console.warn('Native window.prompt() terpanggil. Disarankan menggunakan async/await SIM_UI.prompt().');
      return defaultValue !== undefined ? defaultValue : '';
    };
  }

  global.SIM_MODALS = {
    modal: createModalHtml,
    openModal,
    closeModal,
    confirm: showConfirmDialog,
    alert: showAlertDialog,
    prompt: showPromptDialog
  };

})(typeof window !== 'undefined' ? window : global);
