/**
 * SIM-LAPOR SDN KALISALAK 01 - STORAGE LAYER
 * Mendukung IndexedDB (kapasitas besar untuk foto resolusi tinggi)
 * Dirancang dengan adapter pattern sehingga siap dialihkan ke Cloudflare D1 + Cloudinary
 */

const DB_NAME = 'SimLapor_SDNKalisalak01_DB';
const DB_VERSION = 1;
const STORE_REPORTS = 'reports';
const STORE_SETTINGS = 'settings';

class OfflineStorage {
  constructor() {
    this.db = null;
    this.isReady = false;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_REPORTS)) {
          const reportStore = db.createObjectStore(STORE_REPORTS, { keyPath: 'id' });
          reportStore.createIndex('category', 'category', { unique: false });
          reportStore.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = async (e) => {
        this.db = e.target.result;
        this.isReady = true;
        await this.ensureInitialSeed();
        this.initD1Sync();
        resolve(this);
      };

      request.onerror = (e) => {
        console.error('IndexedDB error, falling back to localStorage', e);
        this.fallbackToLocalStorage();
        this.initD1Sync();
        resolve(this);
      };
    });
  }

  async initD1Sync() {
    try {
      const res = await fetch('/api/d1/status');
      if (res.ok) {
        this.d1Status = await res.json();
        if (this.d1Status.connected) {
          console.log('[D1] Terhubung ke database Cloudflare D1:', this.d1Status.databaseId);
          await this.syncFromD1();
        } else {
          console.log('[D1] Status D1:', this.d1Status.message);
        }
      }
    } catch (err) {
      console.warn('[D1] Tidak dapat menghubungi endpoint status D1:', err.message);
    }
  }

  async syncFromD1() {
    try {
      const res = await fetch('/api/d1/reports');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reports) && data.reports.length > 0) {
          console.log(`[D1] Menyinkronkan ${data.reports.length} laporan dari Cloudflare D1 ke penyimpanan lokal...`);
          for (const rep of data.reports) {
            await this.saveReportLocalOnly(rep);
          }
        }
      }
    } catch (err) {
      console.warn('[D1] Gagal sinkronisasi data dari D1:', err.message);
    }
  }

  async ensureInitialSeed() {
    const existing = await this.getAllReports();
    if (!existing || existing.length === 0) {
      console.log('Seeding initial 44 reports into IndexedDB...');
      const tx = this.db.transaction([STORE_REPORTS, STORE_SETTINGS], 'readwrite');
      const repStore = tx.objectStore(STORE_REPORTS);
      const setStore = tx.objectStore(STORE_SETTINGS);

      // Seed reports
      if (window.INITIAL_REPORTS && Array.isArray(window.INITIAL_REPORTS)) {
        for (const rep of window.INITIAL_REPORTS) {
          repStore.put(rep);
        }
      }

      // Seed settings
      if (window.DEFAULT_SETTINGS) {
        setStore.put({ key: 'main_settings', value: window.DEFAULT_SETTINGS });
      }

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
      });
    } else if (window.INITIAL_REPORTS && Array.isArray(window.INITIAL_REPORTS)) {
      // Synchronize photoGuide to ensure guidance matches each program's points
      try {
        const tx = this.db.transaction([STORE_REPORTS], 'readwrite');
        const repStore = tx.objectStore(STORE_REPORTS);
        for (const rep of existing) {
          const initMatch = window.INITIAL_REPORTS.find(r => r.id === rep.id);
          if (initMatch && initMatch.photoGuide) {
            rep.photoGuide = initMatch.photoGuide;
            repStore.put(rep);
          }
        }
      } catch (e) {
        console.warn('Sync photoGuide warning:', e);
      }
    }
  }

  fallbackToLocalStorage() {
    this.useLocalStorage = true;
    if (!localStorage.getItem('simlapor_reports')) {
      localStorage.setItem('simlapor_reports', JSON.stringify(window.INITIAL_REPORTS || []));
    } else if (window.INITIAL_REPORTS && Array.isArray(window.INITIAL_REPORTS)) {
      try {
        const stored = JSON.parse(localStorage.getItem('simlapor_reports') || '[]');
        let changed = false;
        stored.forEach(rep => {
          const initMatch = window.INITIAL_REPORTS.find(r => r.id === rep.id);
          if (initMatch && initMatch.photoGuide) {
            rep.photoGuide = initMatch.photoGuide;
            changed = true;
          }
        });
        if (changed) localStorage.setItem('simlapor_reports', JSON.stringify(stored));
      } catch (_) {}
    }
    if (!localStorage.getItem('simlapor_settings')) {
      localStorage.setItem('simlapor_settings', JSON.stringify(window.DEFAULT_SETTINGS || {}));
    }
  }

  async getAllReports() {
    if (this.useLocalStorage) {
      return JSON.parse(localStorage.getItem('simlapor_reports') || '[]');
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_REPORTS, 'readonly');
      const store = tx.objectStore(STORE_REPORTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async getReportById(id) {
    if (this.useLocalStorage) {
      const all = await this.getAllReports();
      return all.find(r => r.id === parseInt(id));
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_REPORTS, 'readonly');
      const store = tx.objectStore(STORE_REPORTS);
      const req = store.get(parseInt(id));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async saveReportLocalOnly(report) {
    if (this.useLocalStorage) {
      const all = await this.getAllReports();
      const idx = all.findIndex(r => r.id === report.id);
      if (idx !== -1) all[idx] = report;
      else all.push(report);
      localStorage.setItem('simlapor_reports', JSON.stringify(all));
      return report;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_REPORTS, 'readwrite');
      const store = tx.objectStore(STORE_REPORTS);
      const req = store.put(report);
      req.onsuccess = () => resolve(report);
      req.onerror = () => reject(req.error);
    });
  }

  async saveReport(report) {
    report.updatedAt = new Date().toISOString();
    
    // 1. Simpan ke database lokal
    await this.saveReportLocalOnly(report);

    // 2. Sinkronkan ke Cloudflare D1 jika aktif
    if (this.d1Status && this.d1Status.connected) {
      fetch('/api/d1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }).catch(err => console.warn('[D1] Sinkronisasi laporan ke D1 gagal:', err.message));
    }

    return report;
  }

  async getSettings() {
    if (this.useLocalStorage) {
      return JSON.parse(localStorage.getItem('simlapor_settings') || JSON.stringify(window.DEFAULT_SETTINGS));
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get('main_settings');
      req.onsuccess = () => {
        if (req.result && req.result.value) resolve(req.result.value);
        else resolve(window.DEFAULT_SETTINGS);
      };
      req.onerror = () => resolve(window.DEFAULT_SETTINGS);
    });
  }

  async saveSettings(settings) {
    if (this.useLocalStorage) {
      localStorage.setItem('simlapor_settings', JSON.stringify(settings));
    } else {
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction(STORE_SETTINGS, 'readwrite');
        const store = tx.objectStore(STORE_SETTINGS);
        const req = store.put({ key: 'main_settings', value: settings });
        req.onsuccess = () => resolve(settings);
        req.onerror = () => reject(req.error);
      });
    }

    // Sinkronkan ke Cloudflare D1 jika aktif
    if (this.d1Status && this.d1Status.connected) {
      fetch('/api/d1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      }).catch(err => console.warn('[D1] Sinkronisasi settings ke D1 gagal:', err.message));
    }

    return settings;
  }

  /**
   * Kirim seluruh data 44 laporan & Pengaturan ke Cloudflare D1
   */
  async syncAllToD1() {
    const reports = await this.getAllReports();
    const settings = await this.getSettings();

    // 1. Inisialisasi skema tabel jika belum ada
    await fetch('/api/d1/init', { method: 'POST' });

    // 2. Kirim seluruh laporan
    const repRes = await fetch('/api/d1/reports/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reports })
    });

    // 3. Kirim pengaturan
    await fetch('/api/d1/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    });

    return await repRes.json();
  }

  async exportFullBackup() {
    const reports = await this.getAllReports();
    const settings = await this.getSettings();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      school: settings.sekolahNama || 'SD NEGERI KALISALAK 01',
      settings,
      reports
    };
  }

  async importFullBackup(backupData) {
    if (!backupData || !backupData.reports || !Array.isArray(backupData.reports)) {
      throw new Error('Format file cadangan tidak valid!');
    }

    if (backupData.settings) {
      await this.saveSettings(backupData.settings);
    }

    if (this.useLocalStorage) {
      localStorage.setItem('simlapor_reports', JSON.stringify(backupData.reports));
      return true;
    }

    const tx = this.db.transaction([STORE_REPORTS], 'readwrite');
    const store = tx.objectStore(STORE_REPORTS);
    await new Promise((res) => {
      const clrReq = store.clear();
      clrReq.onsuccess = () => res(true);
    });

    for (const r of backupData.reports) {
      store.put(r);
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
    });
  }

  async resetToDefaults() {
    const executeReset = () => {
      if (this.useLocalStorage) {
        localStorage.removeItem('simlapor_reports');
        localStorage.removeItem('simlapor_settings');
        location.reload();
        return;
      }
      const tx = this.db.transaction([STORE_REPORTS, STORE_SETTINGS], 'readwrite');
      tx.objectStore(STORE_REPORTS).clear();
      tx.objectStore(STORE_SETTINGS).clear();
      tx.oncomplete = () => {
        location.reload();
      };
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Reset Seluruh Data',
        message: 'PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke template bawaan? Perubahan yang belum dicadangkan akan hilang permanen.',
        confirmText: 'Ya, Reset Seluruh Data',
        variant: 'danger',
        onConfirm: executeReset
      });
    } else {
      executeReset();
    }
  }

  /**
   * Helper untuk persiapan Cloudflare D1
   * Menghasilkan SQL DUMP yang siap dieksekusi di Cloudflare D1
   */
  async generateCloudflareD1Dump() {
    const reports = await this.getAllReports();
    const settings = await this.getSettings();

    let sql = `-- =========================================================\n`;
    sql += `-- DUMP DATA UNTUK CLOUDFLARE D1 DATABASE (SQLITE)\n`;
    sql += `-- SDN KALISALAK 01 KECAMATAN MARGASARI TAHUN 2026\n`;
    sql += `-- Dibuat pada: ${new Date().toISOString()}\n`;
    sql += `-- =========================================================\n\n`;

    sql += `INSERT OR REPLACE INTO settings (id, data) VALUES (1, '${JSON.stringify(settings).replace(/'/g, "''")}');\n\n`;

    for (const r of reports) {
      const cleanTitle = (r.title || '').replace(/'/g, "''");
      const cleanPj = (r.pjName || '').replace(/'/g, "''");
      const cleanCategory = (r.category || '').replace(/'/g, "''");
      const payload = JSON.stringify(r).replace(/'/g, "''");

      sql += `INSERT OR REPLACE INTO reports (id, title, category, pj_name, pj_nip, status, data_json, updated_at)\n`;
      sql += `VALUES (${r.id}, '${cleanTitle}', '${cleanCategory}', '${cleanPj}', '${r.pjNip || ''}', '${r.status}', '${payload}', CURRENT_TIMESTAMP);\n`;
    }

    return sql;
  }
}

window.appStorage = new OfflineStorage();
