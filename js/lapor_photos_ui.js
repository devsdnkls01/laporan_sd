/**
 * SIM-LAPOR PHOTOS UI & DOCUMENTATION GALLERY
 * SDN KALISALAK 01 - KECAMATAN MARGASARI
 * Modular Photo Slot, Extra Photos, & Cloudinary Sync Handler
 */
(function (global) {
  'use strict';

  class LaporPhotosUi {
    renderPhotosTab(app, container, report) {
      let guide1 = '';
      if (report.bab2 && Array.isArray(report.bab2.jadwalTable) && report.bab2.jadwalTable.length > 0) {
        const acts = report.bab2.jadwalTable
          .map(x => (x.kegiatan || '').replace(/&amp;/g, '&').replace(/^•\s*/, '').trim())
          .filter(Boolean)
          .slice(0, 3);
        if (acts.length > 0) {
          guide1 = acts.map(a => `• ${a}`).join(' ');
        }
      }
      if (!guide1) {
        guide1 = report.photoGuide?.foto1Desc || 'Foto siswa/guru melaksanakan kegiatan aksi nyata di sekolah.';
      }
      const guide2 = report.photoGuide?.foto2Desc || 'Rapat koordinasi / evaluasi tim pelaksana bersama Kepala Sekolah / Pengawas.';

      const photo1 = (report.photos && report.photos[0]) || null;
      const photo2 = (report.photos && report.photos[1]) || null;
      const additionalPhotos = (report.photos && report.photos.slice(2)) || [];

      const renderSlotCard = (slotNum, slotTitle, guidanceText, photoObj) => {
        if (photoObj) {
          return `
            <div class="photo-slot-card has-photo">
              <div class="slot-badge-title" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span><span>📷</span> ${slotTitle}</span>
                ${window.cloudinarySync ? window.cloudinarySync.renderBadge(photoObj, report.id) : ''}
              </div>
              <div class="slot-guidance-pill">${guidanceText}</div>
              
              <div class="slot-preview-box">
                <img src="${photoObj.dataUrl}" alt="${photoObj.title || 'Foto'}">
                <button type="button" class="btn-slot-delete" title="Hapus Foto" onclick="window.simApp.deletePhoto('${photoObj.id}')">✕</button>
              </div>

              <div class="form-group" style="margin-top: 0.5rem;">
                <label class="form-label">Judul Foto</label>
                <input type="text" class="form-control" value="${photoObj.title || ''}" placeholder="Keterangan foto..." onchange="window.simApp.updatePhotoMeta('${photoObj.id}', 'title', this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Kegiatan</label>
                <input type="date" class="form-control" value="${photoObj.date || ''}" onchange="window.simApp.updatePhotoMeta('${photoObj.id}', 'date', this.value)">
              </div>
              <div class="form-group">
                <label class="form-label">Deskripsi Aktivitas</label>
                <textarea class="form-control" rows="2" placeholder="Uraian aktivitas pada foto..." onchange="window.simApp.updatePhotoMeta('${photoObj.id}', 'desc', this.value)">${photoObj.desc || ''}</textarea>
              </div>
            </div>
          `;
        } else {
          return `
            <div class="photo-slot-card">
              <div class="slot-badge-title">
                <span>📷</span> ${slotTitle}
              </div>
              <div class="slot-guidance-pill">${guidanceText}</div>

              <div class="slot-empty-dropzone" onclick="document.getElementById('slot-input-${slotNum}').click()">
                <input type="file" id="slot-input-${slotNum}" accept="image/*" style="display: none;" onchange="window.simApp.handleSlotPhoto(${slotNum}, this.files[0])">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>+ Pilih / Tarik Foto ke Sini</span>
                <p style="font-size: 0.72rem; color: var(--text-muted);">Mendukung JPG, PNG (Otomatis Disimpan &amp; Sinkron Cloudinary)</p>
              </div>
            </div>
          `;
        }
      };

      container.innerHTML = `
        <div class="form-section-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">LAMPIRAN • DOKUMENTASI FOTO KEGIATAN RESMI</div>
              <div class="section-card-desc">Sesuai Panduan SDN Kalisalak 01: Tersimpan offline &amp; otomatis tersinkron ke Cloudinary saat online</div>
            </div>
          </div>

          <div id="cloudinary-banner-container">
            ${window.cloudinarySync ? window.cloudinarySync.renderSyncStatusBanner(report) : ''}
          </div>

          <div class="photo-dual-slots">
            ${renderSlotCard(1, 'FOTO 1 : AKSI NYATA KEGIATAN', 'Petunjuk: ' + guide1, photo1)}
            ${renderSlotCard(2, 'FOTO 2 : RAPAT / KOORDINASI TIM', 'Petunjuk: ' + guide2, photo2)}
          </div>

          ${additionalPhotos.length > 0 ? `
            <div style="margin-top: 2rem;">
              <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">Foto Dokumentasi Tambahan:</h4>
              <div class="photos-grid">
                ${additionalPhotos.map(p => `
                  <div class="photo-card" data-photo-id="${p.id}">
                    <div class="photo-preview-wrap">
                      <img src="${p.dataUrl}" alt="${p.title}">
                      <button class="btn-delete-photo" title="Hapus Foto" onclick="window.simApp.deletePhoto('${p.id}')">✕</button>
                    </div>
                    <div style="padding: 0.35rem 0.5rem 0 0.5rem;">
                      ${window.cloudinarySync ? window.cloudinarySync.renderBadge(p, report.id) : ''}
                    </div>
                    <div class="photo-card-body">
                      <input type="text" class="form-control" value="${p.title || ''}" placeholder="Judul Foto..." onchange="window.simApp.updatePhotoMeta('${p.id}', 'title', this.value)">
                      <input type="date" class="form-control" value="${p.date || ''}" onchange="window.simApp.updatePhotoMeta('${p.id}', 'date', this.value)">
                      <textarea class="form-control" rows="2" placeholder="Deskripsi..." onchange="window.simApp.updatePhotoMeta('${p.id}', 'desc', this.value)">${p.desc || ''}</textarea>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 1.5rem; text-align: center;">
            <input type="file" id="extra-photo-input" accept="image/*" multiple style="display: none;" onchange="window.simApp.handlePhotoFiles(this.files)">
            <button type="button" class="btn btn-outline" style="font-size: 0.8rem;" onclick="document.getElementById('extra-photo-input').click()">
              + Tambah Foto Dokumentasi Tambahan (Opsional)
            </button>
          </div>
        </div>
      `;
    }

    async handleSlotPhoto(app, slotNum, file) {
      if (!file) return;
      const report = app.getActiveReport();
      if (!report.photos) report.photos = [];

      const indicator = document.getElementById('save-indicator');
      if (indicator) {
        indicator.className = 'save-indicator saving';
        indicator.innerHTML = '<span class="save-dot"></span> Mengompres foto...';
      }

      try {
        const compressed = await app.compressImage(file);
        const targetIdx = slotNum - 1;
        const existingPhoto = (report.photos && report.photos[targetIdx]) || null;
        const oldPublicId = (existingPhoto && existingPhoto.cloudinary_public_id) || null;

        const newPhoto = {
          id: 'photo_slot_' + slotNum + '_' + Date.now(),
          title: slotNum === 1 ? 'Foto 1: Aksi Nyata Pelaksanaan Program' : 'Foto 2: Koordinasi Tim Pelaksana Program',
          date: new Date().toISOString().split('T')[0],
          desc: slotNum === 1 ? 'Peserta didik dan guru melaksanakan kegiatan secara aktif di sekolah.' : 'Rapat koordinasi dan evaluasi pelaksanaan program bersama tim kerja.',
          dataUrl: compressed,
          cloudinary_public_id: null,
          cloudinary_url: null,
          sync_status: 'LOCAL / BELUM SYNC',
          old_public_id: oldPublicId
        };

        if (report.photos.length > targetIdx) {
          report.photos[targetIdx] = newPhoto;
        } else {
          while (report.photos.length < targetIdx) {
            report.photos.push(null);
          }
          report.photos[targetIdx] = newPhoto;
        }

        report.photos = report.photos.filter(Boolean);

        await window.appStorage.saveReport(report);
        app.updateTabBadges(report);
        this.renderPhotosTab(app, document.getElementById('tab-content-area'), report);

        if (window.cloudinarySync) {
          window.cloudinarySync.enqueueUpload(report.id, newPhoto.id, oldPublicId);
        }

        if (indicator) {
          indicator.className = 'save-indicator saved';
        }
      } catch (err) {
        console.error('Gagal memproses foto:', err);
      }
    }

    async handlePhotoFiles(app, files) {
      if (!files || files.length === 0) return;

      const report = app.getActiveReport();
      if (!report.photos) report.photos = [];

      const indicator = document.getElementById('save-indicator');
      if (indicator) {
        indicator.className = 'save-indicator saving';
        indicator.innerHTML = '<span class="save-dot"></span> Mengompres foto...';
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const compressedBase64 = await app.compressImage(file);
          const newPhoto = {
            id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            title: 'Dokumentasi Pelaksanaan Kegiatan (' + (report.photos.length + 1) + ')',
            date: new Date().toISOString().split('T')[0],
            desc: 'Dokumentasi bukti fisik pelaksanaan program kerja di SDN Kalisalak 01.',
            dataUrl: compressedBase64,
            cloudinary_public_id: null,
            cloudinary_url: null,
            sync_status: 'LOCAL / BELUM SYNC'
          };
          report.photos.push(newPhoto);
          if (window.cloudinarySync) {
            window.cloudinarySync.enqueueUpload(report.id, newPhoto.id);
          }
        } catch (err) {
          console.error('Gagal memproses foto:', err);
        }
      }

      await window.appStorage.saveReport(report);
      app.updateTabBadges(report);
      this.renderPhotosTab(app, document.getElementById('tab-content-area'), report);

      if (indicator) {
        indicator.className = 'save-indicator saved';
        indicator.innerHTML = '<span class="save-dot"></span> Foto Tersimpan (Lokal)';
      }
    }

    async deletePhoto(app, photoId) {
      const executeDelete = async () => {
        const report = app.getActiveReport();
        const photoToDelete = (report.photos || []).find(p => p.id === photoId);
        if (photoToDelete && photoToDelete.cloudinary_public_id && window.cloudinarySync) {
          window.cloudinarySync.enqueueDelete(photoToDelete.cloudinary_public_id);
        }
        report.photos = (report.photos || []).filter(p => p.id !== photoId);
        await window.appStorage.saveReport(report);
        app.updateTabBadges(report);
        this.renderPhotosTab(app, document.getElementById('tab-content-area'), report);
        if (window.SIM_UI && window.SIM_UI.toast) {
          window.SIM_UI.toast('Foto dokumentasi berhasil dihapus', 'info');
        }
      };

      if (window.SIM_UI && window.SIM_UI.confirm) {
        window.SIM_UI.confirm({
          title: 'Hapus Foto Dokumentasi',
          message: 'Apakah Anda yakin ingin menghapus foto kegiatan ini?',
          confirmText: 'Ya, Hapus Foto',
          variant: 'danger',
          onConfirm: executeDelete
        });
      } else {
        await executeDelete();
      }
    }

    async updatePhotoMeta(app, photoId, field, value) {
      const report = app.getActiveReport();
      const photo = (report.photos || []).find(p => p.id === photoId);
      if (photo) {
        photo[field] = value;
        await window.appStorage.saveReport(report);
      }
    }
  }

  global.laporPhotosUi = new LaporPhotosUi();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LaporPhotosUi, laporPhotosUi: global.laporPhotosUi };
  }
})(typeof window !== 'undefined' ? window : global);
