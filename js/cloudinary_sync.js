/**
 * CLOUDINARY OFFLINE-FIRST SYNCHRONIZATION MANAGER
 * SDN KALISALAK 01 - KECAMATAN MARGASARI
 * 
 * Prinsip:
 * 1. Offline-First: Seluruh foto disimpan lokal (IndexedDB) terlebih dahulu.
 * 2. Auto-Sync: Begitu internet aktif, otomatis disinkronkan ke Cloudinary via secure proxy backend.
 * 3. Keamanan: API Secret Cloudinary berada di backend (server.js), tidak pernah terekspos ke browser.
 * 4. Penggantian/Penghapusan: Foto lama/terhapus otomatis dibersihkan dari Cloudinary (Zero Orphaned Files).
 * 5. Data Lokal Aman: Jika upload gagal, gambar lokal tidak akan hilang dan masuk antrean coba lagi.
 */

(function (global) {
  'use strict';

  const QUEUE_STORAGE_KEY = 'simlapor_cloudinary_queue_v1';

  class CloudinarySyncManager {
    constructor() {
      this.isSyncing = false;
      this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      this.serverReachable = null;
      this.queue = this.loadQueue();
      this.syncInterval = null;
      this.lastSyncTime = null;
    }

    init() {
      // 1. Pantau status jaringan online / offline
      if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
          console.log('[CloudinarySync] Perangkat ONLINE. Memulai sinkronisasi otomatis...');
          this.isOnline = true;
          this.updateUiConnectionStatus();
          this.syncAll();
        });

        window.addEventListener('offline', () => {
          console.log('[CloudinarySync] Perangkat OFFLINE. Mengaktifkan mode simpan lokal mandiri.');
          this.isOnline = false;
          this.updateUiConnectionStatus();
        });

        // 2. Cek konektivitas server secara berkala & sinkronkan antrean
        this.checkServerStatus().then(() => {
          if (this.isOnline && (this.queue.uploads.length > 0 || this.queue.deletes.length > 0)) {
            this.syncAll();
          }
        });

        this.syncInterval = setInterval(() => {
          if (this.isOnline && (this.queue.uploads.length > 0 || this.queue.deletes.length > 0)) {
            this.syncAll();
          }
        }, 20000);
      }
    }

    loadQueue() {
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            return {
              uploads: Array.isArray(parsed.uploads) ? parsed.uploads : [],
              deletes: Array.isArray(parsed.deletes) ? parsed.deletes : []
            };
          }
        }
      } catch (e) {
        console.warn('[CloudinarySync] Gagal membaca antrean dari localStorage:', e);
      }
      return { uploads: [], deletes: [] };
    }

    saveQueue() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
        }
      } catch (e) {
        console.error('[CloudinarySync] Gagal menyimpan antrean:', e);
      }
      this.updateUiConnectionStatus();
    }

    async checkServerStatus() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('/api/cloudinary/status', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          this.serverReachable = true;
          return true;
        }
      } catch (e) {
        this.serverReachable = false;
      }
      return false;
    }

    /**
     * Mendaftarkan foto baru/foto yang diedit ke dalam antrean sinkronisasi
     */
    enqueueUpload(reportId, photoId, oldPublicId = null) {
      if (!reportId || !photoId) return;

      // Hapus duplikasi antrean upload untuk foto yang sama
      this.queue.uploads = this.queue.uploads.filter(
        item => !(item.reportId === reportId && item.photoId === photoId)
      );

      this.queue.uploads.push({
        reportId: parseInt(reportId),
        photoId: String(photoId),
        oldPublicId: oldPublicId || null,
        addedAt: new Date().toISOString(),
        attempts: 0
      });

      this.saveQueue();

      // Jika sedang online, segera sinkronkan
      if (this.isOnline) {
        setTimeout(() => this.syncAll(), 300);
      }
    }

    /**
     * Mendaftarkan file Cloudinary yang dihapus oleh user agar dibersihkan dari server
     */
    enqueueDelete(publicId) {
      if (!publicId) return;

      // Batalkan upload yang masih antre jika fotonya langsung dihapus
      this.queue.uploads = this.queue.uploads.filter(u => u.oldPublicId !== publicId);

      if (!this.queue.deletes.some(d => d.publicId === publicId)) {
        this.queue.deletes.push({
          publicId: publicId,
          addedAt: new Date().toISOString(),
          attempts: 0
        });
      }

      this.saveQueue();

      if (this.isOnline) {
        setTimeout(() => this.syncAll(), 300);
      }
    }

    /**
     * Proses sinkronisasi penuh:
     * 1. Hapus file yang ada di antrean delete
     * 2. Unggah file yang ada di antrean upload
     */
    async syncAll() {
      if (this.isSyncing) return;
      if (!this.isOnline) {
        console.log('[CloudinarySync] Perangkat offline, menunda proses sinkronisasi.');
        return;
      }

      this.isSyncing = true;
      this.updateUiConnectionStatus();

      try {
        // Step 1: Eksekusi antrean penghapusan file lama (Zero Orphaned Files)
        await this.processDeleteQueue();

        // Step 2: Eksekusi antrean upload foto lampiran
        await this.processUploadQueue();

        this.lastSyncTime = new Date();
      } catch (err) {
        console.error('[CloudinarySync] Error pada syncAll:', err);
      } finally {
        this.isSyncing = false;
        this.updateUiConnectionStatus();
      }
    }

    async processDeleteQueue() {
      const remainingDeletes = [];

      for (const item of this.queue.deletes) {
        try {
          const res = await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: item.publicId })
          });

          if (res.ok) {
            console.log(`[CloudinarySync] File lama berhasil dibersihkan dari Cloudinary: ${item.publicId}`);
          } else {
            const errJson = await res.json().catch(() => ({}));
            // Jika file memang sudah tidak ada (not found), anggap sukses
            if (errJson.result === 'not found') {
              console.log(`[CloudinarySync] File ${item.publicId} sudah terhapus di Cloudinary.`);
            } else {
              item.attempts = (item.attempts || 0) + 1;
              if (item.attempts < 5) remainingDeletes.push(item);
            }
          }
        } catch (e) {
          console.warn(`[CloudinarySync] Gagal menghubungi backend untuk hapus ${item.publicId}:`, e.message);
          item.attempts = (item.attempts || 0) + 1;
          remainingDeletes.push(item);
        }
      }

      this.queue.deletes = remainingDeletes;
      this.saveQueue();
    }

    async processUploadQueue() {
      const remainingUploads = [];

      for (const item of this.queue.uploads) {
        const { reportId, photoId, oldPublicId } = item;

        // Ambil objek laporan dari storage
        let report = null;
        if (window.appStorage) {
          report = await window.appStorage.getReport(reportId);
        } else if (window.simApp && Array.isArray(window.simApp.reports)) {
          report = window.simApp.reports.find(r => r.id === reportId);
        }

        if (!report || !Array.isArray(report.photos)) {
          // Laporan tidak ditemukan, buang antrean
          continue;
        }

        const photo = report.photos.find(p => p && p.id === photoId);
        if (!photo || !photo.dataUrl) {
          // Foto sudah dihapus user dari dokumen lokal, buang antrean
          continue;
        }

        // Tandai status foto menjadi 'SYNCING'
        photo.sync_status = 'SYNCING';
        this.broadcastPhotoStatus(reportId, photo);

        try {
          const res = await fetch('/api/cloudinary/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: photo.dataUrl,
              folder: `sdn_kalisalak_01/laporan/program_${reportId}`,
              tags: `sdn_kalisalak_01,laporan_${reportId},lampiran_resmi`,
              oldPublicId: oldPublicId || photo.old_public_id || null
            })
          });

          const data = await res.json();

          if (res.ok && data.success && data.public_id) {
            // SINKRONISASI SUKSES!
            console.log(`[CloudinarySync] Foto ${photoId} berhasil tersinkron ke Cloudinary:`, data.secure_url);
            photo.cloudinary_public_id = data.public_id;
            photo.cloudinary_url = data.secure_url;
            photo.sync_status = 'SYNCED';
            photo.synced_at = new Date().toISOString();
            photo.sync_error = null;
            delete photo.old_public_id;

            // Simpan pemutakhiran ke IndexedDB
            if (window.appStorage) {
              await window.appStorage.saveReport(report);
            }
            if (window.simApp && window.simApp.getActiveReport && window.simApp.getActiveReport().id === reportId) {
              window.simApp.loadReport(reportId);
            }

            this.broadcastPhotoStatus(reportId, photo);
          } else {
            throw new Error((data && data.error) || 'Respon server gagal');
          }
        } catch (err) {
          console.warn(`[CloudinarySync] Upload foto ${photoId} gagal (${err.message}). Data lokal tetap aman.`);
          photo.sync_status = 'FAILED';
          photo.sync_error = err.message || 'Koneksi terputus';

          // Tetap simpan status failed di lokal agar user tahu
          if (window.appStorage) {
            await window.appStorage.saveReport(report);
          }
          this.broadcastPhotoStatus(reportId, photo);

          item.attempts = (item.attempts || 0) + 1;
          remainingUploads.push(item);
        }
      }

      this.queue.uploads = remainingUploads;
      this.saveQueue();
    }

    /**
     * Coba ulang sinkronisasi untuk satu foto tertentu (misal ditekan oleh tombol "Coba Lagi")
     */
    async retrySinglePhoto(reportId, photoId) {
      this.enqueueUpload(reportId, photoId);
      if (this.isOnline) {
        await this.syncAll();
      } else {
        if (window.SIM_UI && window.SIM_UI.toast) {
          window.SIM_UI.toast('Perangkat saat ini sedang OFFLINE. Foto tetap aman di lokal dan akan otomatis diunggah saat koneksi internet terhubung.', 'warning', 5000);
        }
      }
    }

    broadcastPhotoStatus(reportId, photo) {
      if (typeof window !== 'undefined') {
        const ev = new CustomEvent('cloudinary-photo-status-changed', {
          detail: { reportId, photoId: photo.id, status: photo.sync_status, photo }
        });
        window.dispatchEvent(ev);

        // Update badge DOM langsung jika elemen sedang aktif
        const badgeEl = document.getElementById(`sync-badge-${photo.id}`);
        if (badgeEl) {
          badgeEl.outerHTML = this.renderBadge(photo, reportId);
        }
      }
    }

    /**
     * Menghasilkan komponen HTML Badge Status Sinkronisasi
     */
    renderBadge(photo, reportId = null) {
      const status = photo.sync_status || 'LOCAL / BELUM SYNC';
      const pId = photo.id;
      const repId = reportId || (window.simApp ? window.simApp.activeReportId : 1);

      if (status === 'SYNCED') {
        return `
          <div id="sync-badge-${pId}" class="cloudinary-sync-badge badge-synced" title="Tersimpan aman di Cloudinary (ID: ${photo.cloudinary_public_id || '-'})">
            <span class="badge-dot dot-synced"></span>
            <span class="badge-text">SYNCED (CLOUDINARY)</span>
            ${photo.cloudinary_url ? `
              <a href="${photo.cloudinary_url}" target="_blank" rel="noopener noreferrer" class="badge-cloud-link" title="Buka berkas di Cloudinary" onclick="event.stopPropagation()">
                ↗
              </a>
            ` : ''}
          </div>
        `;
      }

      if (status === 'SYNCING') {
        return `
          <div id="sync-badge-${pId}" class="cloudinary-sync-badge badge-syncing" title="Sedang mengunggah foto ke Cloudinary...">
            <span class="badge-spinner"></span>
            <span class="badge-text">SYNCING...</span>
          </div>
        `;
      }

      if (status === 'FAILED') {
        return `
          <div id="sync-badge-${pId}" class="cloudinary-sync-badge badge-failed" title="Upload tertunda: ${photo.sync_error || 'Gagal koneksi'}. Data tersimpan aman di lokal perangkat.">
            <span class="badge-dot dot-failed"></span>
            <span class="badge-text">FAILED (LOKAL AMAN)</span>
            <button type="button" class="btn-badge-retry" onclick="event.stopPropagation(); window.cloudinarySync.retrySinglePhoto(${repId}, '${pId}')" title="Coba unggah ulang sekarang">
              ↺ Coba Lagi
            </button>
          </div>
        `;
      }

      // Default: 'LOCAL / BELUM SYNC'
      return `
        <div id="sync-badge-${pId}" class="cloudinary-sync-badge badge-local" title="Foto tersimpan di penyimpanan offline browser Anda. Otomatis sinkron saat online.">
          <span class="badge-dot dot-local"></span>
          <span class="badge-text">LOCAL / BELUM SYNC</span>
          ${this.isOnline ? `
            <button type="button" class="btn-badge-retry" onclick="event.stopPropagation(); window.cloudinarySync.retrySinglePhoto(${repId}, '${pId}')" title="Unggah ke Cloudinary sekarang">
              ⚡ Sync
            </button>
          ` : ''}
        </div>
      `;
    }

    /**
     * Render bilah status sinkronisasi Cloudinary di bagian atas galeri lampiran
     */
    renderSyncStatusBanner(report) {
      const photos = (report && Array.isArray(report.photos)) ? report.photos : [];
      const totalPhotos = photos.length;
      const syncedCount = photos.filter(p => p && p.sync_status === 'SYNCED').length;
      const localCount = photos.filter(p => !p || p.sync_status !== 'SYNCED').length;
      const pendingQueueCount = this.queue.uploads.length;

      const isConnOnline = this.isOnline;
      const connBadge = isConnOnline 
        ? `<span class="conn-pill conn-online">🟢 Online (Tersambung Internet)</span>`
        : `<span class="conn-pill conn-offline">🔴 Offline (Mode Lokal Mandiri)</span>`;

      return `
        <div class="cloudinary-status-banner">
          <div class="csb-left">
            <div class="csb-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              <span>Penyimpanan Foto Cloudinary (Offline-First)</span>
              ${connBadge}
            </div>
            <div class="csb-desc">
              Semua foto lampiran tersimpan secara lokal dan otomatis disinkronkan ke Cloudinary saat perangkat terhubung internet.
            </div>
          </div>
          <div class="csb-right">
            <div class="csb-stats">
              <span class="csb-stat-item">Total Foto: <strong>${totalPhotos}</strong></span>
              <span class="csb-stat-item" style="color: #059669;">Tersinkron: <strong>${syncedCount}</strong></span>
              ${localCount > 0 ? `<span class="csb-stat-item" style="color: #d97706;">Belum Sync: <strong>${localCount}</strong></span>` : ''}
              ${pendingQueueCount > 0 ? `<span class="csb-stat-item" style="color: #2563eb;">Antrean: <strong>${pendingQueueCount}</strong></span>` : ''}
            </div>
            ${isConnOnline ? `
              <button type="button" class="btn btn-sm btn-outline csb-btn-sync" onclick="window.cloudinarySync.syncAll()" ${this.isSyncing ? 'disabled' : ''}>
                ${this.isSyncing ? '<span class="badge-spinner"></span> Menyinkronkan...' : '⚡ Sinkronkan Sekarang'}
              </button>
            ` : `
              <span class="csb-offline-note">Menunggu koneksi internet untuk sinkronisasi otomatis...</span>
            `}
          </div>
        </div>
      `;
    }

    updateUiConnectionStatus() {
      // Perbarui banner foto jika sedang terbuka
      if (window.simApp && window.simApp.activeTab === 'photos') {
        const area = document.getElementById('tab-content-area');
        const report = window.simApp.getActiveReport();
        if (area && report) {
          const bannerContainer = document.getElementById('cloudinary-banner-container');
          if (bannerContainer) {
            bannerContainer.innerHTML = this.renderSyncStatusBanner(report);
          }
        }
      }
    }

    compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDim = 1200;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          };
          img.onerror = reject;
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }

  // Singleton Instance
  const cloudinarySync = new CloudinarySyncManager();
  global.cloudinarySync = cloudinarySync;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      cloudinarySync.init();
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudinarySyncManager, cloudinarySync };
  }

})(typeof window !== 'undefined' ? window : global);
