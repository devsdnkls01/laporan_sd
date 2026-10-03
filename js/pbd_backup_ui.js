/**
 * PBD & BACKUP UI CONTROLLER
 * Menangani Dialog Rapor PBD Kemendikdasmen RI dan Cadangan Data Offline / D1
 */

(function (global) {
  'use strict';

  class PbdBackupUiManager {
    constructor() {}

    openPbdModal() {
      const modal = document.getElementById('modal-pbd');
      if (!modal) return;
      this.renderPbdPrioritiesTable();
      modal.classList.add('open');
    }

    closePbdModal() {
      const modal = document.getElementById('modal-pbd');
      if (modal) modal.classList.remove('open');
    }

    renderPbdPrioritiesTable() {
      const tbody = document.getElementById('pbd-priorities-tbody');
      if (!tbody || !window.PBD_OFFICIAL_DATA || !window.PBD_OFFICIAL_DATA.rekomendasiPrioritas) return;

      const priorities = window.PBD_OFFICIAL_DATA.rekomendasiPrioritas;
      const reportMap = {
        '1': 15, '2': 15, '3': 14, '4': 14, '5': 16, '6': 16,
        '7': 21, '8': 21, '9': 40, '10': 40, '11': 16, '12': 21
      };

      let html = '';
      priorities.forEach((p, idx) => {
        const targetReportId = reportMap[p.no] || 43;
        const isKurang = (p.capaianText || '').toLowerCase().includes('kurang');
        const badgeStyle = isKurang 
          ? 'background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;' 
          : 'background: #fef3c7; color: #b45309; border: 1px solid #fde68a;';

        html += `
          <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 1 ? 'background: #f8fafc;' : ''}">
            <td style="padding: 8px; text-align: center;"><span class="table-no-badge">${p.no}</span></td>
            <td style="padding: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem;">${p.prioritas}</div>
              <div style="margin-top: 4px;">
                <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 700; ${badgeStyle}">
                  ${p.capaianText || p.skor}
                </span>
              </div>
            </td>
            <td style="padding: 10px; font-size: 0.78rem; line-height: 1.45;">
              <div><strong style="color: #991b1b;">Akar Masalah:</strong> ${p.akarMasalah}</div>
              <div style="margin-top: 4px; color: #334155;"><strong style="color: #065f46;">Inspirasi Benahi:</strong> ${p.inspirasiBenahi}</div>
            </td>
            <td style="padding: 10px; font-size: 0.78rem; color: #475569; line-height: 1.4;">
              ${(p.kegiatanArkas || '').replace(/\n/g, '<br>')}
            </td>
            <td style="padding: 10px; text-align: center;">
              <button type="button" class="btn btn-sm btn-outline" style="font-size: 0.72rem; padding: 4px 8px; white-space: nowrap;" onclick="window.simApp.selectLaporReport(${targetReportId}); window.pbdBackupUi.closePbdModal();">
                Buka Lap. #${targetReportId} &rarr;
              </button>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
    }

    async applyPbdRecommendations(reportId) {
      const id = parseInt(reportId || (window.simApp && window.simApp.activeReportId));
      const officialReports = window.INITIAL_REPORTS || [];
      const official = officialReports.find(r => r.id === id);

      if (!official) {
        if (window.SIM_UI && window.SIM_UI.toast) {
          window.SIM_UI.toast('Template resmi untuk laporan ini tidak ditemukan.', 'danger');
        }
        return;
      }

      const current = window.simApp.getActiveReport();
      if (!current) return;

      if (official.bab1) {
        current.bab1.latarBelakang = official.bab1.latarBelakang;
        if (official.bab1.dasarHukumObj) current.bab1.dasarHukumObj = JSON.parse(JSON.stringify(official.bab1.dasarHukumObj));
        if (official.bab1.maksudTujuanObj) current.bab1.maksudTujuanObj = JSON.parse(JSON.stringify(official.bab1.maksudTujuanObj));
      }
      if (official.bab2 && official.bab2.timTable) {
        current.bab2.timTable = JSON.parse(JSON.stringify(official.bab2.timTable));
      }
      if (official.bab3) {
        if (official.bab3.indikatorTable) current.bab3.indikatorTable = JSON.parse(JSON.stringify(official.bab3.indikatorTable));
        if (official.bab3.faktorPendukungObj) current.bab3.faktorPendukungObj = JSON.parse(JSON.stringify(official.bab3.faktorPendukungObj));
        if (official.bab3.faktorKendalaObj) current.bab3.faktorKendalaObj = JSON.parse(JSON.stringify(official.bab3.faktorKendalaObj));
      }
      if (official.bab4) {
        if (official.bab4.solusiObj) current.bab4.solusiObj = JSON.parse(JSON.stringify(official.bab4.solusiObj));
        if (official.bab4.rtlTable) current.bab4.rtlTable = JSON.parse(JSON.stringify(official.bab4.rtlTable));
      }
      if (official.pbdLink) {
        current.pbdLink = JSON.parse(JSON.stringify(official.pbdLink));
      }

      await window.appStorage.saveReport(current);
      window.simApp.renderActiveTabContent();
      if (window.SIM_UI && window.SIM_UI.alert) {
        await window.SIM_UI.alert({
          title: 'Sinkronisasi PBD Berhasil',
          message: `Rekomendasi resmi Rapor PBD Kemendikdasmen RI telah berhasil diterapkan ke Program #${id}.`,
          icon: 'success'
        });
      }
    }

    async syncAllWithOfficialPBD() {
      const executeSync = async () => {
        const officialReports = window.INITIAL_REPORTS || [];
        for (const off of officialReports) {
          const existing = (window.simApp.reports || []).find(r => r.id === off.id);
          if (existing) {
            if (off.pbdLink) existing.pbdLink = JSON.parse(JSON.stringify(off.pbdLink));
            if (off.bab1 && off.bab1.latarBelakang) existing.bab1.latarBelakang = off.bab1.latarBelakang;
            if (off.bab1 && off.bab1.dasarHukumObj) existing.bab1.dasarHukumObj = JSON.parse(JSON.stringify(off.bab1.dasarHukumObj));
            if (off.bab1 && off.bab1.maksudTujuanObj) existing.bab1.maksudTujuanObj = JSON.parse(JSON.stringify(off.bab1.maksudTujuanObj));
            if (off.bab2 && off.bab2.timTable) existing.bab2.timTable = JSON.parse(JSON.stringify(off.bab2.timTable));
            if (off.bab3 && off.bab3.indikatorTable) existing.bab3.indikatorTable = JSON.parse(JSON.stringify(off.bab3.indikatorTable));
            if (off.bab3 && off.bab3.faktorPendukungObj) existing.bab3.faktorPendukungObj = JSON.parse(JSON.stringify(off.bab3.faktorPendukungObj));
            if (off.bab3 && off.bab3.faktorKendalaObj) existing.bab3.faktorKendalaObj = JSON.parse(JSON.stringify(off.bab3.faktorKendalaObj));
            if (off.bab4 && off.bab4.solusiObj) existing.bab4.solusiObj = JSON.parse(JSON.stringify(off.bab4.solusiObj));
            if (off.bab4 && off.bab4.rtlTable) existing.bab4.rtlTable = JSON.parse(JSON.stringify(off.bab4.rtlTable));
            await window.appStorage.saveReport(existing);
          }
        }

        this.closePbdModal();
        window.simApp.loadReport(window.simApp.activeReportId);
        if (window.SIM_UI && window.SIM_UI.alert) {
          await window.SIM_UI.alert({
            title: 'Sinkronisasi 44 Laporan Sukses',
            message: 'Seluruh 44 Laporan Program Kerja SDN Kalisalak 01 berhasil disinkronkan penuh dengan Rapor PBD Kemendikdasmen RI!',
            icon: 'success'
          });
        }
      };

      if (window.SIM_UI && window.SIM_UI.confirm) {
        window.SIM_UI.confirm({
          title: 'Sinkronisasi Rapor PBD',
          message: 'Apakah Anda ingin menyinkronkan seluruh 44 laporan dengan pemutakhiran resmi Rapor PBD Kemendikdasmen RI?',
          confirmText: 'Ya, Sinkronkan Semua',
          variant: 'gold',
          onConfirm: executeSync
        });
      } else {
        await executeSync();
      }
    }

    openBackupModal() {
      const modal = document.getElementById('modal-backup');
      if (modal) modal.classList.add('open');
    }

    closeBackupModal() {
      const modal = document.getElementById('modal-backup');
      if (modal) modal.classList.remove('open');
    }

    async handleExportJson() {
      const data = await window.appStorage.exportFullBackup();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CADANGAN_LAPORAN_SDN_KALISALAK_01_' + new Date().toISOString().split('T')[0] + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    async handleImportJson(event) {
      const file = event.target.files[0];
      if (!file) return;

      const executeImport = () => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const backupData = JSON.parse(e.target.result);
            await window.appStorage.importFullBackup(backupData);
            if (window.SIM_UI && window.SIM_UI.alert) {
              await window.SIM_UI.alert({
                title: 'Pemulihan Berhasil',
                message: 'Data laporan berhasil dipulihkan dari berkas cadangan!',
                icon: 'success'
              });
            }
            location.reload();
          } catch (err) {
            if (window.SIM_UI && window.SIM_UI.alert) {
              window.SIM_UI.alert({
                title: 'Gagal Memulihkan Data',
                message: 'Berkas cadangan tidak valid atau rusak: ' + err.message,
                icon: 'danger'
              });
            }
          }
        };
        reader.readAsText(file);
      };

      if (window.SIM_UI && window.SIM_UI.confirm) {
        window.SIM_UI.confirm({
          title: 'Impor Cadangan Data',
          message: 'Impor berkas cadangan ini akan menimpa seluruh data yang ada saat ini. Lanjutkan?',
          confirmText: 'Ya, Timpa & Impor',
          variant: 'danger',
          onConfirm: executeImport,
          onCancel: () => { event.target.value = ''; }
        });
      } else {
        executeImport();
      }
    }

    openBackupModal() {
      const modal = document.getElementById('modal-backup');
      if (!modal) return;
      modal.classList.add('open');
      this.refreshD1Status();
    }

    closeBackupModal() {
      const modal = document.getElementById('modal-backup');
      if (modal) modal.classList.remove('open');
    }

    async refreshD1Status() {
      const statusText = document.getElementById('d1-status-text');
      if (!statusText) return;

      statusText.innerHTML = '⏳ Memeriksa konektivitas Cloudflare D1...';
      try {
        const res = await fetch('/api/d1/status');
        const data = await res.json();
        if (data.connected) {
          statusText.innerHTML = `<span style="color: #059669; font-weight: 700;">🟢 Terhubung ke Cloudflare D1</span> (${data.databaseId}) &bull; Domain: <strong>${data.domain}</strong>`;
        } else if (data.configured) {
          statusText.innerHTML = `<span style="color: #dc2626; font-weight: 700;">🔴 Gagal Konek D1:</span> ${data.message}`;
        } else {
          statusText.innerHTML = `<span style="color: #d97706; font-weight: 700;">🟡 Mode Offline/Lokal (IndexedDB)</span> &bull; Isi kredensial di <code>.env</code> untuk menghubungkan D1`;
        }
      } catch (e) {
        statusText.innerHTML = `<span style="color: #64748b;">⚪ Server D1 lokal tidak merespons: ${e.message}</span>`;
      }
    }

    async handleSyncToD1() {
      if (window.SIM_UI && window.SIM_UI.showLoading) {
        window.SIM_UI.showLoading('Menyinkronkan seluruh data 44 laporan & RKT 2027 ke Cloudflare D1...');
      }

      try {
        const res = await window.appStorage.syncAllToD1();
        // Juga sinkronkan RKT 2027
        if (window.simRkt && window.simRkt.rktData) {
          await fetch('/api/d1/rkt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rktData: window.simRkt.rktData })
          });
        }
        if (window.SIM_UI && window.SIM_UI.hideLoading) window.SIM_UI.hideLoading();

        if (window.SIM_UI && window.SIM_UI.toast) {
          window.SIM_UI.toast(`Berhasil menyinkronkan data ke Cloudflare D1 (${res.count || 44} laporan)!`, 'success');
        }
        this.refreshD1Status();
      } catch (err) {
        if (window.SIM_UI && window.SIM_UI.hideLoading) window.SIM_UI.hideLoading();
        if (window.SIM_UI && window.SIM_UI.alert) {
          window.SIM_UI.alert({
            title: 'Sinkronisasi D1 Gagal',
            message: err.message,
            icon: 'danger'
          });
        }
      }
    }

    async handleInitD1() {
      if (window.SIM_UI && window.SIM_UI.showLoading) {
        window.SIM_UI.showLoading('Menginisialisasi tabel Cloudflare D1...');
      }

      try {
        const res = await fetch('/api/d1/init', { method: 'POST' });
        const data = await res.json();
        if (window.SIM_UI && window.SIM_UI.hideLoading) window.SIM_UI.hideLoading();

        if (data.success) {
          if (window.SIM_UI && window.SIM_UI.toast) {
            window.SIM_UI.toast('Tabel Cloudflare D1 berhasil diinisialisasi!', 'success');
          }
        } else {
          throw new Error(data.error || 'Gagal inisialisasi tabel D1');
        }
        this.refreshD1Status();
      } catch (err) {
        if (window.SIM_UI && window.SIM_UI.hideLoading) window.SIM_UI.hideLoading();
        if (window.SIM_UI && window.SIM_UI.alert) {
          window.SIM_UI.alert({
            title: 'Inisialisasi Tabel Gagal',
            message: err.message,
            icon: 'danger'
          });
        }
      }
    }

    async handleExportD1Sql() {
      const sql = await window.appStorage.generateCloudflareD1Dump();
      const blob = new Blob([sql], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cloudflare_d1_seed_kalisalak01.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  global.pbdBackupUi = new PbdBackupUiManager();

  // Wire shortcuts to simApp
  global.simApp = global.simApp || {};
  global.simApp.openPbdModal = () => global.pbdBackupUi.openPbdModal();
  global.simApp.closePbdModal = () => global.pbdBackupUi.closePbdModal();
  global.simApp.applyPbdRecommendations = (id) => global.pbdBackupUi.applyPbdRecommendations(id);
  global.simApp.syncAllWithOfficialPBD = () => global.pbdBackupUi.syncAllWithOfficialPBD();
  global.simApp.openBackupModal = () => global.pbdBackupUi.openBackupModal();
  global.simApp.closeBackupModal = () => global.pbdBackupUi.closeBackupModal();
  global.simApp.handleExportJson = () => global.pbdBackupUi.handleExportJson();
  global.simApp.handleImportJson = (e) => global.pbdBackupUi.handleImportJson(e);
  global.simApp.handleExportD1Sql = () => global.pbdBackupUi.handleExportD1Sql();
  global.simApp.handleSyncToD1 = () => global.pbdBackupUi.handleSyncToD1();
  global.simApp.handleInitD1 = () => global.pbdBackupUi.handleInitD1();
  global.simApp.refreshD1Status = () => global.pbdBackupUi.refreshD1Status();

})(typeof window !== 'undefined' ? window : global);
