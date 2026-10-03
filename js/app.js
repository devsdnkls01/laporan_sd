
/* ==========================================================================
   MASTER DATA GURU SDN KALISALAK 01 & JABATAN TIM DENGAN URAIAN TUGAS OTOMATIS
   ========================================================================== */
/* ==========================================================================
   DYNAMIC MASTER DATA GURU SDN KALISALAK 01 (DIPANGGIL DARI MASTER DB)
   ========================================================================== */
function getDaftarGuruKalisalak() {
  if (window.masterDb) {
    return window.masterDb.getTendik().map(t => ({
      nama: t.nama,
      nip: t.nip,
      pangkat: t.pangkat || '-',
      jabatanSekolah: t.jabatan || t.guruKelas || 'Guru',
      status: t.status || 'PTK',
      avatar: (t.nama || 'G').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase(),
      role: t.role || t.jabatan,
      display: `${t.nama} — ${t.jabatan}${t.nip && t.nip !== '-' ? ' (NIP: ' + t.nip + ')' : ''}`
    }));
  }
  return [];
}

// Proxy dynamic accessor so DAFTAR_GURU_KALISALAK always reads fresh data from masterDb
const DAFTAR_GURU_KALISALAK = new Proxy([], {
  get(target, prop) {
    const list = getDaftarGuruKalisalak();
    if (prop === 'length') return list.length;
    if (typeof list[prop] === 'function') {
      return list[prop].bind(list);
    }
    return list[prop];
  }
});

const DAFTAR_JABATAN_TIM = window.DAFTAR_JABATAN_TIM || [];

/**
 * SIM-LAPOR SDN KALISALAK 01 - MAIN APPLICATION CONTROLLER
 * Versi Modern & User-Friendly:
 * - Pemisahan Nomor Menjadi Kotak Poin Mandiri (Itemized Numbered Lists)
 * - Interactive Spreadsheet Tables
 * - Smart Factor Chips (Pendukung & Kendala)
 * - Dedicated Dual Photo Slots
 * - Focus Mode (Toggle Sidebar)
 * - Auto-Save IndexedDB & Cetak Naskah Dinas Presisi PDF
 */


class SimLaporApp {
  constructor() {
    this.reports = [];
    this.activeReportId = 1;
    this.activeTab = 'bab1';
    this.settings = null;
    this.searchQuery = '';
    this.categoryFilter = 'all';
    this.statusFilter = 'all';
    this.saveTimeout = null;
    this.isDirty = false;
    this.isSidebarCollapsed = false;
    this.currentModule = 'lapor';
  }

  toggleCategoryAccordion(group) {
    const isTargetRkt = group === 'rkt';
    const targetHeader = document.getElementById(`cat-header-${group}`);
    const targetBody = document.getElementById(`cat-body-${group}`);
    const targetChevron = document.getElementById(`chevron-${group}`);

    const otherGroup = isTargetRkt ? 'lapor' : 'rkt';
    const otherHeader = document.getElementById(`cat-header-${otherGroup}`);
    const otherBody = document.getElementById(`cat-body-${otherGroup}`);
    const otherChevron = document.getElementById(`chevron-${otherGroup}`);

    if (!targetHeader || !targetBody) return;

    const isTargetCollapsed = targetBody.classList.contains('collapsed');

    if (isTargetCollapsed) {
      // Buka target yang diklik
      targetBody.classList.remove('collapsed');
      targetHeader.classList.remove('collapsed');
      targetHeader.classList.add('active-group');
      if (targetChevron) targetChevron.textContent = '▼';

      // TUTUP OTOMATIS SIDEBAR LAINNYA (MUTUALLY EXCLUSIVE)
      if (otherBody) otherBody.classList.add('collapsed');
      if (otherHeader) {
        otherHeader.classList.add('collapsed');
        otherHeader.classList.remove('active-group');
      }
      if (otherChevron) otherChevron.textContent = '▶';

      // Aktifkan modul terkait
      if (isTargetRkt) {
        this.selectRktSection(window.simRkt ? window.simRkt.activeTab : 'cover');
      } else {
        this.selectLaporReport(this.activeReportId || 1);
      }
    } else {
      // Jika yang aktif diklik lagi, tutup target dan alihkan ke lawannya agar tampilan tetap fungsional
      targetBody.classList.add('collapsed');
      targetHeader.classList.add('collapsed');
      targetHeader.classList.remove('active-group');
      if (targetChevron) targetChevron.textContent = '▶';

      // Buka modul lawannya
      if (otherBody) otherBody.classList.remove('collapsed');
      if (otherHeader) {
        otherHeader.classList.remove('collapsed');
        otherHeader.classList.add('active-group');
      }
      if (otherChevron) otherChevron.textContent = '▼';

      if (!isTargetRkt) {
        this.selectRktSection(window.simRkt ? window.simRkt.activeTab : 'cover');
      } else {
        this.selectLaporReport(this.activeReportId || 1);
      }
    }
  }

  selectRktSection(tabKey) {
    this.currentModule = 'rkt';

    // Buka Accordion RKT
    const groupRkt = document.getElementById('group-rkt');
    const hdrRkt = document.getElementById('cat-header-rkt');
    const bodyRkt = document.getElementById('cat-body-rkt');
    const chevronRkt = document.getElementById('chevron-rkt');
    if (groupRkt) {
      groupRkt.classList.remove('is-collapsed-group');
      groupRkt.classList.add('is-expanded-group');
    }
    if (hdrRkt) {
      hdrRkt.classList.remove('collapsed');
      hdrRkt.classList.add('active-group');
    }
    if (bodyRkt) bodyRkt.classList.remove('collapsed');
    if (chevronRkt) chevronRkt.textContent = '▼';

    // TUTUP OTOMATIS Accordion Pelaporan Program (Mutually Exclusive)
    const groupLapor = document.getElementById('group-lapor');
    const hdrLapor = document.getElementById('cat-header-lapor');
    const bodyLapor = document.getElementById('cat-body-lapor');
    const chevronLapor = document.getElementById('chevron-lapor');
    if (groupLapor) {
      groupLapor.classList.remove('is-expanded-group');
      groupLapor.classList.add('is-collapsed-group');
    }
    if (hdrLapor) {
      hdrLapor.classList.add('collapsed');
      hdrLapor.classList.remove('active-group');
    }
    if (bodyLapor) bodyLapor.classList.add('collapsed');
    if (chevronLapor) chevronLapor.textContent = '▶';

    // Switch Header Actions & Tabs
    const actionsLapor = document.getElementById('header-actions-lapor');
    const actionsRkt = document.getElementById('header-actions-rkt');
    const tabsLapor = document.getElementById('tabs-nav-lapor');
    const tabsRkt = document.getElementById('tabs-nav-rkt');

    if (actionsLapor) actionsLapor.style.display = 'none';
    if (actionsRkt) actionsRkt.style.display = 'flex';
    if (tabsLapor) tabsLapor.style.display = 'none';
    if (tabsRkt) tabsRkt.style.display = 'flex';

    // Remove active highlight from report items
    const reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(i => i.classList.remove('active'));

    // Switch RKT Tab
    if (window.simRkt) {
      window.simRkt.init();
      window.simRkt.switchTab(tabKey);
    }
  }

  selectLaporReport(reportId) {
    this.currentModule = 'lapor';

    // Buka Accordion Pelaporan Program
    const groupLapor = document.getElementById('group-lapor');
    const hdrLapor = document.getElementById('cat-header-lapor');
    const bodyLapor = document.getElementById('cat-body-lapor');
    const chevronLapor = document.getElementById('chevron-lapor');
    if (groupLapor) {
      groupLapor.classList.remove('is-collapsed-group');
      groupLapor.classList.add('is-expanded-group');
    }
    if (hdrLapor) {
      hdrLapor.classList.remove('collapsed');
      hdrLapor.classList.add('active-group');
    }
    if (bodyLapor) bodyLapor.classList.remove('collapsed');
    if (chevronLapor) chevronLapor.textContent = '▼';

    // TUTUP OTOMATIS Accordion RKT (Mutually Exclusive)
    const groupRkt = document.getElementById('group-rkt');
    const hdrRkt = document.getElementById('cat-header-rkt');
    const bodyRkt = document.getElementById('cat-body-rkt');
    const chevronRkt = document.getElementById('chevron-rkt');
    if (groupRkt) {
      groupRkt.classList.remove('is-expanded-group');
      groupRkt.classList.add('is-collapsed-group');
    }
    if (hdrRkt) {
      hdrRkt.classList.add('collapsed');
      hdrRkt.classList.remove('active-group');
    }
    if (bodyRkt) bodyRkt.classList.add('collapsed');
    if (chevronRkt) chevronRkt.textContent = '▶';

    // Switch Header Actions & Tabs
    const actionsLapor = document.getElementById('header-actions-lapor');
    const actionsRkt = document.getElementById('header-actions-rkt');
    const tabsLapor = document.getElementById('tabs-nav-lapor');
    const tabsRkt = document.getElementById('tabs-nav-rkt');

    if (actionsLapor) actionsLapor.style.display = 'flex';
    if (actionsRkt) actionsRkt.style.display = 'none';
    if (tabsLapor) tabsLapor.style.display = 'flex';
    if (tabsRkt) tabsRkt.style.display = 'none';

    // Remove active highlight from RKT items
    const rktItems = document.querySelectorAll('.rkt-nav-item');
    rktItems.forEach(i => i.classList.remove('active'));

    this.loadReport(reportId);
  }

  // Alias for backward compatibility
  switchModule(moduleName) {
    if (moduleName === 'rkt') {
      this.selectRktSection(window.simRkt ? window.simRkt.activeTab : 'cover');
    } else {
      this.selectLaporReport(this.activeReportId || 1);
    }
  }

  async init() {
    console.log('Inisialisasi SIM-LAPOR SDN KALISALAK 01...');
    await window.appStorage.init();
    this.settings = await window.appStorage.getSettings();
    const newAlamatResmi = "JL. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kabupaten Tegal, Jawa Tengah 52463";
    if (!this.settings || !this.settings.sekolahAlamat || this.settings.sekolahAlamat.includes('Kalisalak No. 01') || this.settings.sekolahAlamat.includes('Desa Kalisalak')) {
      if (!this.settings) this.settings = Object.assign({}, window.DEFAULT_SETTINGS);
      this.settings.sekolahAlamat = newAlamatResmi;
      await window.appStorage.saveSettings(this.settings);
    }
    this.reports = await window.appStorage.getAllReports();

    if (!this.reports || this.reports.length === 0) {
      this.reports = window.INITIAL_REPORTS || [];
    }


    this.bindEvents();
    this.renderCategoryFilter();
    this.renderSidebar();
    if (window.simRkt) {
      window.simRkt.init();
      window.simRkt.renderSidebar();
    }
    this.loadReport(this.activeReportId);
    this.updateStats();
  }

  bindEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderSidebar();
        if (window.simRkt) window.simRkt.filterSections(this.searchQuery);
      });
    }

    const categorySelect = document.getElementById('category-filter');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.renderSidebar();
      });
    }

    const tabButtons = document.querySelectorAll('#tabs-nav-lapor .tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab && this.currentModule === 'lapor') {
          this.switchTab(tab);
        }
      });
    });

    
    const btnOpenPbd = document.getElementById('btn-open-pbd');
    const btnClosePbd = document.getElementById('btn-close-pbd');
    const btnClosePbdFooter = document.getElementById('btn-close-pbd-footer');
    if (btnOpenPbd) btnOpenPbd.addEventListener('click', () => this.openPbdModal());
    if (btnClosePbd) btnClosePbd.addEventListener('click', () => this.closePbdModal());
    if (btnClosePbdFooter) btnClosePbdFooter.addEventListener('click', () => this.closePbdModal());

    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const formSettings = document.getElementById('form-settings');

    if (btnOpenSettings) btnOpenSettings.addEventListener('click', () => this.openSettingsModal());
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => this.closeSettingsModal());
    if (btnCancelSettings) btnCancelSettings.addEventListener('click', () => this.closeSettingsModal());
    if (formSettings) {
      formSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettingsFromForm();
      });
    }

    const btnOpenBackup = document.getElementById('btn-open-backup');
    const btnCloseBackup = document.getElementById('btn-close-backup');
    if (btnOpenBackup) btnOpenBackup.addEventListener('click', () => this.openBackupModal());
    if (btnCloseBackup) btnCloseBackup.addEventListener('click', () => this.closeBackupModal());

    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) btnExportJson.addEventListener('click', () => this.handleExportJson());

    const fileImportJson = document.getElementById('file-import-json');
    if (fileImportJson) fileImportJson.addEventListener('change', (e) => this.handleImportJson(e));

    const btnExportD1 = document.getElementById('btn-export-d1');
    if (btnExportD1) btnExportD1.addEventListener('click', () => this.handleExportD1Sql());

    const btnSyncToD1 = document.getElementById('btn-sync-to-d1');
    if (btnSyncToD1) btnSyncToD1.addEventListener('click', () => { if (window.simApp.handleSyncToD1) window.simApp.handleSyncToD1(); });

    const btnInitD1 = document.getElementById('btn-init-d1');
    if (btnInitD1) btnInitD1.addEventListener('click', () => { if (window.simApp.handleInitD1) window.simApp.handleInitD1(); });

    const btnRefreshD1 = document.getElementById('btn-refresh-d1-status');
    if (btnRefreshD1) btnRefreshD1.addEventListener('click', () => { if (window.simApp.refreshD1Status) window.simApp.refreshD1Status(); });

    const btnResetTemplate = document.getElementById('btn-reset-template');
    if (btnResetTemplate) btnResetTemplate.addEventListener('click', () => window.appStorage.resetToDefaults());

    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    if (btnDownloadPdf) btnDownloadPdf.addEventListener('click', () => this.downloadCurrentReportPdf());

    const btnPrintPdf = document.getElementById('btn-print-pdf');
    if (btnPrintPdf) btnPrintPdf.addEventListener('click', () => this.printCurrentReport());

    const btnToggleStatus = document.getElementById('btn-toggle-status');
    if (btnToggleStatus) btnToggleStatus.addEventListener('click', () => this.toggleReportStatus());
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const btn = document.getElementById('btn-toggle-sidebar');
    if (!sidebar) return;

    if (window.innerWidth < 768) {
      const isOpening = !sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open', isOpening);
      if (backdrop) backdrop.classList.toggle('open', isOpening);
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      sidebar.classList.toggle('collapsed', this.isSidebarCollapsed);

      if (btn) {
        btn.innerHTML = this.isSidebarCollapsed 
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg><span>Buka Menu</span>'
          : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span>Menu</span>';
      }
    }
  }

  closeSidebarMobile() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('open');
  }

  renderCategoryFilter() {
    const categorySelect = document.getElementById('category-filter');
    if (!categorySelect) return;

    if (window.SIM_SIDEBAR && typeof window.SIM_SIDEBAR.renderCategoryOptions === 'function') {
      window.SIM_SIDEBAR.renderCategoryOptions(categorySelect, this.reports, this.categoryFilter);
      return;
    }

    const categories = Array.from(new Set(this.reports.map(r => r.category)));
    categorySelect.innerHTML = '<option value="all">Semua Kategori (' + this.reports.length + ')</option>';
    categories.forEach(cat => {
      const count = this.reports.filter(r => r.category === cat).length;
      categorySelect.innerHTML += '<option value="' + cat + '">' + cat + ' (' + count + ')</option>';
    });
  }

  renderSidebar() {
    const listContainer = document.getElementById('report-list');
    if (!listContainer) return;

    if (window.SIM_SIDEBAR && typeof window.SIM_SIDEBAR.renderReportList === 'function') {
      window.SIM_SIDEBAR.renderReportList(
        listContainer,
        this.reports,
        this.activeReportId,
        this.currentModule,
        this.searchQuery,
        this.categoryFilter,
        (reportId) => this.selectLaporReport(reportId)
      );
      return;
    }

    let filtered = this.reports.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(this.searchQuery) ||
                          r.pjName.toLowerCase().includes(this.searchQuery) ||
                          String(r.id) === this.searchQuery;
      const matchCat = this.categoryFilter === 'all' || r.category === this.categoryFilter;
      return matchSearch && matchCat;
    });

    listContainer.innerHTML = '';

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          Tidak ditemukan laporan yang sesuai.
        </div>
      `;
      return;
    }

    filtered.forEach(r => {
      const item = document.createElement('div');
      item.className = 'report-item ' + (this.currentModule === 'lapor' && r.id === this.activeReportId ? 'active' : '');
      item.onclick = () => this.selectLaporReport(r.id);

      const statusBadge = r.status === 'completed' 
        ? '<span class="item-badge badge-complete">Lengkap</span>'
        : '<span class="item-badge badge-draft">Draf</span>';

      item.innerHTML = `
        <div class="item-number">${r.id}</div>
        <div class="item-content">
          <div class="item-title">${r.title}</div>
          <div class="item-meta">
            <span class="item-pj" title="${r.pjName}">${r.pjName}</span>
            ${statusBadge}
          </div>
        </div>
      `;

      listContainer.appendChild(item);
    });
  }

  updateStats() {
    const statElement = document.getElementById('sidebar-stat');
    if (!statElement) return;

    if (window.SIM_SIDEBAR && typeof window.SIM_SIDEBAR.updateSidebarStats === 'function') {
      window.SIM_SIDEBAR.updateSidebarStats(statElement, this.reports);
      return;
    }

    const totalCount = this.reports.length;
    const completedCount = this.reports.filter(r => r.status === 'completed').length;
    statElement.textContent = completedCount + ' dari ' + totalCount + ' Selesai';
  }

  getActiveReport() {
    return this.reports.find(r => r.id === this.activeReportId) || this.reports[0];
  }

  loadReport(id) {
    this.activeReportId = parseInt(id);
    const report = this.getActiveReport();
    if (!report) return;

    this.renderSidebar();
    this.closeSidebarMobile();

    document.getElementById('header-category-tag').textContent = 'Program #' + report.id + ' • ' + report.category;
    document.getElementById('header-title').textContent = report.title;

    const statusBtn = document.getElementById('btn-toggle-status');
    if (statusBtn) {
      if (report.status === 'completed') {
        statusBtn.textContent = '✓ Status: Lengkap (Siap Cetak)';
        statusBtn.className = 'btn btn-success';
      } else {
        statusBtn.textContent = '○ Status: Masih Draf';
        statusBtn.className = 'btn btn-outline';
      }
    }

    this.updateTabBadges(report);
    this.renderActiveTabContent();
  }

  updateTabBadges(report) {
    const photoCount = (report.photos || []).length;
    const photoTab = document.querySelector('.tab-btn[data-tab="photos"]');
    if (photoTab) {
      photoTab.innerHTML = '📷 Lampiran Foto ' + (photoCount >= 2 ? '<span class="tab-badge badge-done">' + photoCount + ' Foto</span>' : (photoCount === 1 ? '<span class="tab-badge badge-pending">1 Foto</span>' : '<span class="tab-badge">0 Foto</span>'));
    }
  }

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('#tabs-nav-lapor .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.renderActiveTabContent();
  }

  renderActiveTabContent() {
    const container = document.getElementById('tab-content-area');
    if (!container) return;

    const report = this.getActiveReport();
    if (!report) return;

    // Pastikan struktur tabel & list tersedia
    if (!report.bab2.timTable) report.bab2.timTable = [];
    if (!report.bab2.jadwalTable) report.bab2.jadwalTable = [];
    if (!report.bab3.indikatorTable) report.bab3.indikatorTable = [];
    if (!report.bab4.rtlTable) report.bab4.rtlTable = [];
    if (!report.photos) report.photos = [];

    // Pastikan objek list terpisah tersedia
    if (!report.bab1.maksudTujuanObj) {
      report.bab1.maksudTujuanObj = {
        intro: 'Maksud dan tujuan dari pelaksanaan program ini adalah:',
        items: ['Menganalisis hasil evaluasi diri sekolah.', 'Merumuskan prioritas pembenahan mutu.', 'Menyusun RKAS berbasis data.']
      };
    }
    if (!report.bab1.dasarHukumObj) {
      report.bab1.dasarHukumObj = {
        intro: 'Penyusunan dan pelaksanaan program ini dilandasi oleh peraturan perundang-undangan:',
        items: ['UU No. 20 Tahun 2003 tentang Sisdiknas', 'PP No. 57 Tahun 2021 jo PP No. 4 Tahun 2022', 'Permendikbudristek Nomor 9 Tahun 2022']
      };
    }
    if (!report.bab4.solusiObj) {
      report.bab4.solusiObj = {
        intro: 'Untuk mengatasi berbagai kendala di lapangan, tim pelaksana telah merumuskan sejumlah langkah solutif:',
        items: ['Mengadakan koordinasi berkala di tingkat Kombel sekolah.', 'Menyesuaikan proporsi belanja operasional BOS pada komponen pembenahan.']
      };
    }
    if (!report.bab5.saranObj) {
      report.bab5.saranObj = {
        intro: 'Rekomendasi dan saran demi peningkatan mutu berkelanjutan:',
        items: ['Konsistensi kerja sama seluruh warga sekolah terus dipertahankan.', 'Bimbingan teknis dari Pengawas Pembina senantiasa diharapkan.']
      };
    }

    
    const pbdBannerHtml = report.pbdLink ? `
      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 1.5px solid #6ee7b7; border-left: 5px solid #059669; border-radius: 8px; padding: 0.85rem 1.15rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div>
          <div style="font-weight: 700; color: #065f46; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">
            <span style="background: #10b981; color: #fff; font-size: 0.68rem; padding: 2px 7px; border-radius: 999px; font-weight: 800; text-transform: uppercase;">PBD Kemendikdasmen</span>
            ${report.pbdLink?.indikator || ''} &bull; Skor Resmi: <strong style="color: #047857;">${report.pbdLink?.skor || '-'}</strong> (${report.pbdLink?.capaian || '-'})
          </div>
          <div style="font-size: 0.78rem; color: #047857; margin-top: 0.25rem; line-height: 1.4;">
            <strong>Akar Masalah:</strong> ${report.pbdLink?.akarMasalah || '-'} <br>
            <strong>Kegiatan BOS / ARKAS:</strong> ${report.pbdLink?.posBOS || '-'}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn btn-sm btn-outline" style="border-color: #059669; color: #065f46; font-size: 0.75rem; background: #fff;" onclick="window.simApp.openPbdModal()">
            📊 Rapor Sekolah
          </button>
          <button type="button" class="btn btn-sm btn-primary" style="font-size: 0.75rem; background: #059669; border-color: #047857;" onclick="window.simApp.applyPbdRecommendations(${report.id})">
            ⚡ Terapkan Inspirasi Benahi
          </button>
        </div>
      </div>
    ` : '';

    if (this.activeTab === 'bab1') {
      container.innerHTML = pbdBannerHtml + `
        <div class="form-section-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">BAB I • PENDAHULUAN</div>
              <div class="section-card-desc">Pertanyaan Permanen: Setiap Nomor Poin Dipisah ke Dalam Kotak Isian Mandiri</div>
            </div>
          </div>
          
          <!-- 1.1 Latar Belakang -->
          <div class="form-group">
            <label class="form-label">
              1.1 Latar Belakang Masalah & Urgensi Program
              <span class="form-helper">Narasi Kedinasan</span>
            </label>
            <textarea class="form-control" rows="5" data-field="bab1.latarBelakang">${report.bab1?.latarBelakang || ''}</textarea>
          </div>

          <!-- 1.2 Dasar Hukum (ITEMIZED LIST) -->
          <!-- 1.2 Dasar Hukum (REUSABLE DYNAMIC LIST) -->
          ${window.SIM_UI && window.SIM_UI.dynamicList ? window.SIM_UI.dynamicList({
            id: 'list-container-dasarhukum',
            title: '⚖️ 1.2 Dasar Hukum dan Landasan Operasional',
            badgeText: 'REGULASI',
            badgeColor: 'blue',
            hint: 'Setiap regulasi dipisah per butir nomor rapi',
            introHtml: `<input type="text" class="itemized-intro-input" value="${report.bab1.dasarHukumObj.intro || ''}" placeholder="Kalimat pengantar (opsional)..." onchange="window.simApp.updateListIntro('bab1.dasarHukumObj', this.value)">`,
            items: report.bab1.dasarHukumObj.items,
            placeholder: 'Tuliskan butir dasar hukum...',
            addButtonText: 'Tambah Dasar Hukum',
            onUpdateItem: (idx) => `window.simApp.updateListItem('bab1.dasarHukumObj', ${idx}, this.value)`,
            onAddItem: "window.simApp.addListItem('bab1.dasarHukumObj')",
            onRemoveItem: (idx) => `window.simApp.deleteListItem('bab1.dasarHukumObj', ${idx})`,
            rows: 2
          }) : `
            <div class="form-group">
              <label class="form-label">1.2 Dasar Hukum dan Landasan Operasional</label>
              <div class="itemized-list-wrapper">
                <input type="text" class="itemized-intro-input" value="${report.bab1.dasarHukumObj.intro || ''}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab1.dasarHukumObj', this.value)">
                <div id="list-container-dasarhukum" style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${report.bab1.dasarHukumObj.items.map((item, idx) => `
                    <div class="itemized-row">
                      <span class="item-badge-num">${idx + 1}</span>
                      <textarea class="item-textarea" rows="2" onchange="window.simApp.updateListItem('bab1.dasarHukumObj', ${idx}, this.value)">${item}</textarea>
                      <button type="button" class="btn-del-item" onclick="window.simApp.deleteListItem('bab1.dasarHukumObj', ${idx})">✕</button>
                    </div>
                  `).join('')}
                </div>
                <button type="button" class="btn-add-item" onclick="window.simApp.addListItem('bab1.dasarHukumObj')">+ Tambah Dasar Hukum</button>
              </div>
            </div>
          `}

          <!-- 1.3 Maksud dan Tujuan (REUSABLE DYNAMIC LIST) -->
          ${window.SIM_UI && window.SIM_UI.dynamicList ? window.SIM_UI.dynamicList({
            id: 'list-container-tujuan',
            title: '🎯 1.3 Maksud dan Tujuan Pelaksanaan',
            badgeText: 'TUJUAN',
            badgeColor: 'green',
            hint: 'Setiap poin tujuan terpisah rapi dengan penomoran urut otomatis',
            introHtml: `<input type="text" class="itemized-intro-input" value="${report.bab1.maksudTujuanObj.intro || 'Maksud dan tujuan dari pelaksanaan program ini adalah:'}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab1.maksudTujuanObj', this.value)">`,
            items: report.bab1.maksudTujuanObj.items,
            placeholder: 'Tuliskan butir maksud dan tujuan...',
            addButtonText: 'Tambah Poin Tujuan',
            onUpdateItem: (idx) => `window.simApp.updateListItem('bab1.maksudTujuanObj', ${idx}, this.value)`,
            onAddItem: "window.simApp.addListItem('bab1.maksudTujuanObj')",
            onRemoveItem: (idx) => `window.simApp.deleteListItem('bab1.maksudTujuanObj', ${idx})`,
            rows: 2
          }) : `
            <div class="form-group">
              <label class="form-label">1.3 Maksud dan Tujuan Pelaksanaan</label>
              <div class="itemized-list-wrapper">
                <input type="text" class="itemized-intro-input" value="${report.bab1.maksudTujuanObj.intro || ''}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab1.maksudTujuanObj', this.value)">
                <div id="list-container-tujuan" style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${report.bab1.maksudTujuanObj.items.map((item, idx) => `
                    <div class="itemized-row">
                      <span class="item-badge-num">${idx + 1}</span>
                      <textarea class="item-textarea" rows="2" onchange="window.simApp.updateListItem('bab1.maksudTujuanObj', ${idx}, this.value)">${item}</textarea>
                      <button type="button" class="btn-del-item" onclick="window.simApp.deleteListItem('bab1.maksudTujuanObj', ${idx})">✕</button>
                    </div>
                  `).join('')}
                </div>
                <button type="button" class="btn-add-item" onclick="window.simApp.addListItem('bab1.maksudTujuanObj')">+ Tambah Poin Tujuan</button>
              </div>
            </div>
          `}

          <!-- 1.4 Sasaran -->
          <div class="form-group">
            <label class="form-label">
              1.4 Sasaran dan Ruang Lingkup Program
              <span class="form-helper">Sasaran Warga Satuan Pendidikan</span>
            </label>
            <textarea class="form-control" rows="3" data-field="bab1.sasaran">${report.bab1?.sasaran || ''}</textarea>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'bab2') {
      container.innerHTML = `
        <div class="form-section-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">BAB II • PERENCANAAN DAN PENGORGANISASIAN</div>
              <div class="section-card-desc">Editor Tabel / Grid: Susunan Tim Pelaksana dan Matriks Jadwal Kegiatan 2026</div>
            </div>
          </div>

          <!-- BANNER LAMPIRAN 1 SK TIM -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1.5px solid #93c5fd; border-left: 5px solid #2563eb; border-radius: 8px; padding: 0.75rem 1rem; margin-top: 0.25rem; display: flex; align-items: center; justify-content: space-between; gap: 0.85rem; flex-wrap: wrap;">
            <div>
              <div style="font-weight: 700; color: #1e3a8a; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem;">
                <span style="background: #2563eb; color: #fff; font-size: 0.65rem; padding: 2px 7px; border-radius: 999px; font-weight: 800; text-transform: uppercase;">Lampiran I Resmi</span>
                Surat Keputusan (SK) & Surat Tugas Tim Pelaksana
              </div>
              <div style="font-size: 0.74rem; color: #1e40af; margin-top: 0.2rem; line-height: 1.4;">
                Susunan Tim Kerja dan Rincian Tugas di bawah ini otomatis diterbitkan menjadi <strong>LAMPIRAN 1: SURAT KEPUTUSAN KEPALA SEKOLAH</strong> lengkap dengan konsideran dan tanda tangan saat mencetak PDF.
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-primary" style="font-size: 0.72rem; background: #2563eb; border-color: #1d4ed8;" onclick="window.simApp.printSkTimOnly()">
              🖨 Pratinjau Naskah & SK Tim
            </button>
          </div>

          <div class="input-row">
            <div class="form-group">
              <label class="form-label">Penanggung Jawab / Koordinator Pelaksana</label>
              <input type="text" class="form-control" data-field="pjName" value="${report.pjName || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">NIP Penanggung Jawab</label>
              <input type="text" class="form-control" data-field="pjNip" value="${report.pjNip || '-'}">
            </div>
          </div>

          <!-- TABEL 2.1 SUSUNAN TIM -->
          <div class="table-editor-wrapper">
            <div class="table-editor-header">
              <div class="table-editor-title">
                📊 Tabel 2.1 : Susunan Tim Kerja Pelaksana Satuan Pendidikan
              </div>
              <button type="button" class="btn-add-row" onclick="window.simApp.addTableRow('bab2.timTable')">
                + Tambah Anggota Tim
              </button>
            </div>
            <div class="table-responsive">
              <table class="grid-table">
                <thead>
                  <tr>
                    <th style="width: 50px;" class="cell-center">No</th>
                    <th style="width: 25%;">Jabatan Tim</th>
                    <th style="width: 35%;">Nama & NIP Pejabat</th>
                    <th>Uraian Tugas Utama</th>
                    <th style="width: 45px;" class="cell-center">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tbody-tim">
                  ${report.bab2.timTable.map((row, idx) => {
                    const isCustomJabatan = row.jabatan && !DAFTAR_JABATAN_TIM.some(j => j.nama === row.jabatan);
                    const matchingGuru = DAFTAR_GURU_KALISALAK.find(g => (row.namaNip || '').includes(g.nama));
                    const selectedGuruName = matchingGuru ? matchingGuru.nama : (row.namaNip ? '__custom__' : '');

                    return `
                    <tr>
                      <td class="cell-center">
                        <input type="text" class="cell-input cell-center" value="${row.no || idx + 1}" onchange="window.simApp.updateTableCell('bab2.timTable', ${idx}, 'no', this.value)">
                      </td>
                      <td style="min-width: 220px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onJabatanTimChange(${idx}, this.value)">
                            <option value="">-- Pilih Jabatan Tim --</option>
                            ${DAFTAR_JABATAN_TIM.map(j => `
                              <option value="${j.nama}" ${row.jabatan === j.nama ? 'selected' : ''}>${j.nama}</option>
                            `).join('')}
                            <option value="__custom__" ${isCustomJabatan ? 'selected' : ''}>-- Ketik Jabatan Manual --</option>
                          </select>
                          <input type="text" class="cell-input" style="font-size: 0.75rem; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 3px 6px; border-radius: 4px;" value="${row.jabatan || ''}" placeholder="Ketik jabatan kustom jika perlu..." onchange="window.simApp.updateTableCell('bab2.timTable', ${idx}, 'jabatan', this.value)" id="input-jabatan-${idx}">
                        </div>
                      </td>
                      <td style="min-width: 240px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onGuruTimChange(${idx}, this.value)">
                            <option value="">-- Pilih Guru SDN Kalisalak 01 --</option>
                            ${DAFTAR_GURU_KALISALAK.map(g => `
                              <option value="${g.nama}" ${selectedGuruName === g.nama ? 'selected' : ''}>${g.display}</option>
                            `).join('')}
                            <option value="__custom__" ${selectedGuruName === '__custom__' ? 'selected' : ''}>-- Ketik Nama & NIP Manual --</option>
                          </select>
                          <textarea class="cell-input" style="font-size: 0.75rem; min-height: 42px; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 4px 6px; border-radius: 4px; line-height: 1.25;" placeholder="Nama & NIP pejabat..." onchange="window.simApp.updateTableCell('bab2.timTable', ${idx}, 'namaNip', this.value)" id="input-namanip-${idx}">${row.namaNip || ''}</textarea>
                        </div>
                      </td>
                      <td>
                        <textarea class="cell-input" style="min-height: 68px; line-height: 1.4;" placeholder="Uraian tugas utama tim (otomatis terisi saat memilih jabatan)..." onchange="window.simApp.updateTableCell('bab2.timTable', ${idx}, 'tugas', this.value)" id="input-tugas-${idx}">${row.tugas || ''}</textarea>
                      </td>
                      <td class="cell-center">
                        <button type="button" class="btn-table-action" title="Hapus Anggota Ini" onclick="window.simApp.deleteTableRow('bab2.timTable', ${idx})">&times;</button>
                      </td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- TABEL 2.2 MATRIKS JADWAL -->
          <div class="table-editor-wrapper">
            <div class="table-editor-header">
              <div class="table-editor-title">
                📅 Tabel 2.2 : Matriks Rencana Kerja dan Jadwal Pelaksanaan 2026
              </div>
              <button type="button" class="btn-add-row" onclick="window.simApp.addTableRow('bab2.jadwalTable')">
                + Tambah Kegiatan
              </button>
            </div>
            <div class="table-responsive">
              <table class="grid-table">
                <thead>
                  <tr>
                    <th style="width: 50px;" class="cell-center">No</th>
                    <th style="width: 40%;">Nama Kegiatan Operasional</th>
                    <th style="width: 30%;">Target / Output</th>
                    <th style="width: 25%;">Waktu Pelaksanaan</th>
                    <th style="width: 45px;" class="cell-center">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tbody-jadwal">
                  ${report.bab2.jadwalTable.map((row, idx) => {
                    const spec = (window.REPORT_SPECIFIC_DROPDOWNS && window.REPORT_SPECIFIC_DROPDOWNS[report.id]) || {};
                    const specificActivities = spec.kegiatanOptions || [];
                    const isCustomKegiatan = row.kegiatan && !specificActivities.some(a => a.kegiatan === row.kegiatan);

                    return `
                    <tr>
                      <td class="cell-center">
                        <input type="text" class="cell-input cell-center" value="${row.no || idx + 1}" onchange="window.simApp.updateTableCell('bab2.jadwalTable', ${idx}, 'no', this.value)">
                      </td>
                      <td style="min-width: 250px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onKegiatanJadwalChange(${idx}, this.value)">
                            <option value="">-- Pilih Kegiatan Operasional (Khusus Laporan Ini) --</option>
                            <optgroup label="📌 Agenda Khusus: ${report.title}">
                              ${specificActivities.map(a => `
                                <option value="${a.kegiatan}" ${row.kegiatan === a.kegiatan ? 'selected' : ''}>${a.kegiatan}</option>
                              `).join('')}
                            </optgroup>
                            ${isCustomKegiatan ? `<option value="${row.kegiatan}" selected>${row.kegiatan} (Kustom)</option>` : ''}
                            <option value="__custom__">-- Ketik Kegiatan Manual --</option>
                          </select>
                          <textarea class="cell-input" style="font-size: 0.78rem; min-height: 48px; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 4px 6px; border-radius: 4px; line-height: 1.3;" placeholder="Tuliskan nama kegiatan..." onchange="window.simApp.updateTableCell('bab2.jadwalTable', ${idx}, 'kegiatan', this.value)" id="input-jadwal-kegiatan-${idx}">${row.kegiatan || ''}</textarea>
                        </div>
                      </td>
                      <td style="min-width: 220px;">
                        <textarea class="cell-input" style="min-height: 68px; line-height: 1.35;" placeholder="Target / output kegiatan (otomatis terisi saat memilih kegiatan)..." onchange="window.simApp.updateTableCell('bab2.jadwalTable', ${idx}, 'target', this.value)" id="input-jadwal-target-${idx}">${row.target || ''}</textarea>
                      </td>
                      <td style="min-width: 140px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onWaktuJadwalChange(${idx}, this.value)">
                            <option value="">-- Pilih Waktu --</option>
                            <option value="Januari 2026" ${row.waktu === 'Januari 2026' ? 'selected' : ''}>Januari 2026</option>
                            <option value="Februari 2026" ${row.waktu === 'Februari 2026' ? 'selected' : ''}>Februari 2026</option>
                            <option value="Maret 2026" ${row.waktu === 'Maret 2026' ? 'selected' : ''}>Maret 2026</option>
                            <option value="April 2026" ${row.waktu === 'April 2026' ? 'selected' : ''}>April 2026</option>
                            <option value="Mei 2026" ${row.waktu === 'Mei 2026' ? 'selected' : ''}>Mei 2026</option>
                            <option value="Juni 2026" ${row.waktu === 'Juni 2026' ? 'selected' : ''}>Juni 2026</option>
                            <option value="Juli 2026" ${row.waktu === 'Juli 2026' ? 'selected' : ''}>Juli 2026</option>
                            <option value="Agustus 2026" ${row.waktu === 'Agustus 2026' ? 'selected' : ''}>Agustus 2026</option>
                            <option value="September 2026" ${row.waktu === 'September 2026' ? 'selected' : ''}>September 2026</option>
                            <option value="Oktober 2026" ${row.waktu === 'Oktober 2026' ? 'selected' : ''}>Oktober 2026</option>
                            <option value="November 2026" ${row.waktu === 'November 2026' ? 'selected' : ''}>November 2026</option>
                            <option value="Desember 2026" ${row.waktu === 'Desember 2026' ? 'selected' : ''}>Desember 2026</option>
                            <option value="Semester I (Jan - Jun 2026)" ${row.waktu === 'Semester I (Jan - Jun 2026)' ? 'selected' : ''}>Semester I (Jan - Jun 2026)</option>
                            <option value="Semester II (Jul - Des 2026)" ${row.waktu === 'Semester II (Jul - Des 2026)' ? 'selected' : ''}>Semester II (Jul - Des 2026)</option>
                            <option value="Sepanjang Tahun 2026" ${row.waktu === 'Sepanjang Tahun 2026' ? 'selected' : ''}>Sepanjang Tahun 2026</option>
                            <option value="__custom__">-- Ketik Waktu Manual --</option>
                          </select>
                          <input type="text" class="cell-input" style="font-size: 0.75rem; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 3px 6px; border-radius: 4px;" value="${row.waktu || ''}" placeholder="Waktu..." onchange="window.simApp.updateTableCell('bab2.jadwalTable', ${idx}, 'waktu', this.value)" id="input-jadwal-waktu-${idx}">
                        </div>
                      </td>
                      <td class="cell-center">
                        <button type="button" class="btn-table-action" title="Hapus Baris Ini" onclick="window.simApp.deleteTableRow('bab2.jadwalTable', ${idx})">&times;</button>
                      </td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              2.3 Alokasi Kebutuhan dan Pembiayaan (Dana BOS)
              <span class="form-helper">Realisasi Anggaran Sesuai RKAS</span>
            </label>
            <textarea class="form-control" rows="3" data-field="bab2.alokasiAnggaran">${report.bab2?.alokasiAnggaran || ''}</textarea>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'bab3') {
      container.innerHTML = `
        <div class="form-section-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">BAB III • PELAKSANAAN DAN HASIL CAPAIAN</div>
              <div class="section-card-desc">Narasi Realisasi, Tabel Matriks Capaian, serta Pemisahan Faktor Pendukung & Kendala</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              3.1 Narasi Realisasi Pelaksanaan Kegiatan
              <span class="form-helper">Uraikan keterlaksanaan kegiatan di lapangan</span>
            </label>
            <textarea class="form-control" rows="5" data-field="bab3.realisasi">${report.bab3?.realisasi || ''}</textarea>
          </div>

          <!-- TABEL 3.2 MATRIKS INDIKATOR CAPAIAN -->
          <div class="table-editor-wrapper">
            <div class="table-editor-header">
              <div class="table-editor-title">
                📈 Tabel 3.2 : Matriks Indikator Keberhasilan dan Capaian Kinerja
              </div>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <button type="button" class="btn btn-outline" style="font-size: 0.74rem; padding: 4px 8px; border-color: #059669; color: #047857; background: #ecfdf5; font-weight: 700;" onclick="window.simApp.autoFillRealisasiFromPbd()" title="Ambil Capaian Riil dari Rapor Pendidikan Asli SDN Kalisalak 01">
                  ✨ Capaian Riil Rapor PBD
                </button>
                <button type="button" class="btn-add-row" onclick="window.simApp.addTableRow('bab3.indikatorTable')">
                  + Tambah Indikator
                </button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="grid-table">
                <thead>
                  <tr>
                    <th style="width: 50px;" class="cell-center">No</th>
                    <th style="width: 35%;">Indikator Sasaran</th>
                    <th style="width: 30%;">Target 2026</th>
                    <th>Realisasi / Capaian Riil</th>
                    <th style="width: 45px;" class="cell-center">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tbody-indikator">
                  ${report.bab3.indikatorTable.map((row, idx) => {
                    const spec = (window.REPORT_SPECIFIC_DROPDOWNS && window.REPORT_SPECIFIC_DROPDOWNS[report.id]) || {};
                    const specificIndikators = spec.indikatorOptions || [];
                    const isCustomIndikator = row.indikator && !specificIndikators.some(x => x.indikator === row.indikator);

                    return `
                    <tr>
                      <td class="cell-center">
                        <input type="text" class="cell-input cell-center" value="${row.no || idx + 1}" onchange="window.simApp.updateTableCell('bab3.indikatorTable', ${idx}, 'no', this.value)">
                      </td>
                      <td style="min-width: 260px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onIndikatorSasaranChange(${idx}, this.value)">
                            <option value="">-- Pilih Indikator Sasaran Mutu (Khusus Laporan Ini) --</option>
                            <optgroup label="🎯 Indikator Mutu Khusus: ${report.title}">
                              ${specificIndikators.map(ind => `
                                <option value="${ind.indikator}" ${row.indikator === ind.indikator ? 'selected' : ''}>${ind.indikator}</option>
                              `).join('')}
                            </optgroup>
                            ${isCustomIndikator ? `<option value="${row.indikator}" selected>${row.indikator} (Kustom)</option>` : ''}
                            <option value="__custom__">-- Ketik Indikator Manual --</option>
                          </select>
                          <textarea class="cell-input" style="font-size: 0.78rem; min-height: 48px; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 4px 6px; border-radius: 4px; line-height: 1.3;" placeholder="Indikator sasaran mutu..." onchange="window.simApp.updateTableCell('bab3.indikatorTable', ${idx}, 'indikator', this.value)" id="input-indikator-sasaran-${idx}">${row.indikator || ''}</textarea>
                        </div>
                      </td>
                      <td style="min-width: 210px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onTargetPersentaseChange(${idx}, this.value)">
                            <option value="">-- Pilih Target Persentase (%) --</option>
                            ${DAFTAR_TARGET_PERSENTASE.map(p => `
                              <option value="${p}" ${(row.target || '').includes(p.split(' ')[0]) ? 'selected' : ''}>${p}</option>
                            `).join('')}
                            <option value="__custom__">-- Ketik Target Manual --</option>
                          </select>
                          <input type="text" class="cell-input" style="font-size: 0.78rem; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 4px 6px; border-radius: 4px;" value="${row.target || ''}" placeholder="Target 2026..." onchange="window.simApp.updateTableCell('bab3.indikatorTable', ${idx}, 'target', this.value)" id="input-target-2026-${idx}">
                        </div>
                      </td>
                      <td style="min-width: 240px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <textarea class="cell-input" id="input-realisasi-${idx}" style="min-height: 52px; line-height: 1.35;" placeholder="Realisasi / capaian riil..." onchange="window.simApp.updateTableCell('bab3.indikatorTable', ${idx}, 'realisasi', this.value)">${row.realisasi || ''}</textarea>
                          <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                            ${(window.raporPbdSmart ? window.raporPbdSmart.getSmartChipsForIndicator(report.id, idx, row.indikator) : []).map(chip => `
                              <span class="chip-status-mini" style="background: #ecfdf5; color: #065f46; border-color: #a7f3d0; cursor: pointer;" title="Terapkan: ${chip.replace(/"/g, '&quot;')}" onclick="window.simApp.setPresetRealisasi(${idx}, ${JSON.stringify(chip).replace(/"/g, '&quot;')})">📊 ${chip.length > 25 ? chip.substring(0, 23) + '...' : chip}</span>
                            `).join('')}
                            <span class="chip-status-mini" style="background: #dcfce7; color: #15803d; border-color: #86efac;" onclick="window.simApp.setPresetRealisasi(${idx}, '100% Tercapai Sesuai Target')">+ 100% Tercapai</span>
                          </div>
                        </div>
                      </td>
                      <td class="cell-center">
                        <button type="button" class="btn-table-action" title="Hapus Indikator Ini" onclick="window.simApp.deleteTableRow('bab3.indikatorTable', ${idx})">&times;</button>
                      </td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3.3 DEDICATED CARDS: FAKTOR PENDUKUNG & KENDALA DENGAN CHIPS PINTAR -->
          <div style="margin-top: 0.5rem;">
            <label class="form-label" style="font-size: 0.95rem; font-weight: 800; color: var(--primary);">
              3.3 Faktor Pendukung dan Kendala yang Dihadapi
            </label>
            <div class="form-helper" style="margin-bottom: 0.5rem;">
              Telah dipisahkan ke dalam 2 kartu mandiri berlabel jelas agar Anda tidak perlu bingung menentukan faktor-faktornya.
            </div>

            <div class="factor-box-grid">
              
              <!-- KARTU A: FAKTOR PENDUKUNG -->
              <div class="factor-card card-support">
                <div class="factor-card-header">
                  <div class="factor-card-title">
                    <span>🌿</span> a. Faktor-Faktor Pendukung Keberhasilan
                  </div>
                </div>

                <div class="chips-wrapper">
                  <span class="chips-label">Klik untuk Menambah Cepat:</span>
                  <div class="chips-list">
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorPendukung', 'Komitmen penuh kepala sekolah dan dewan guru dalam program.')">+ Komitmen Pimpinan & Guru</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorPendukung', 'Dukungan pendampingan intensif dari Pengawas Pembina Kecamatan Margasari.')">+ Pendampingan Pengawas</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorPendukung', 'Tingginya antusiasme dan partisipasi aktif peserta didik.')">+ Partisipasi Murid</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorPendukung', 'Sinergi positif pengurus Komite Sekolah dan paguyuban wali murid.')">+ Dukungan Komite & Wali</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorPendukung', 'Ketersediaan sarana prasarana dan lingkungan belajar yang kondusif.')">+ Sarana Kondusif</button>
                  </div>
                </div>

                <textarea id="input-faktor-pendukung" class="form-control" rows="6" data-field="bab3.faktorPendukung" placeholder="Tuliskan faktor-faktor yang mendukung kelancaran program...">${report.bab3?.faktorPendukung || ''}</textarea>
              </div>

              <!-- KARTU B: FAKTOR PENGHAMBAT / KENDALA -->
              <div class="factor-card card-barrier">
                <div class="factor-card-header">
                  <div class="factor-card-title">
                    <span>⚠️</span> b. Faktor Penghambat / Kendala yang Dihadapi
                  </div>
                </div>

                <div class="chips-wrapper">
                  <span class="chips-label">Klik untuk Menambah Cepat:</span>
                  <div class="chips-list">
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorKendala', 'Variasi pemahaman guru terhadap analisis butir data instrumen.')">+ Pemahaman Teknis Guru</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorKendala', 'Keterbatasan media ajar dan alat peraga praktik penunjang.')">+ Keterbatasan Media Ajar</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorKendala', 'Alokasi waktu pembiasaan yang bersamaan dengan jam KBM reguler.')">+ Keterbatasan Alokasi Waktu</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorKendala', 'Perlunya penguatan pendampingan belajar dan konsistensi di rumah.')">+ Konsistensi Belajar Murid</button>
                    <button type="button" class="chip-btn" onclick="window.simApp.appendChip('bab3.faktorKendala', 'Perlu penguatan alokasi anggaran BOS untuk pengadaan sarana berkala.')">+ Dukungan Anggaran BOS</button>
                  </div>
                </div>

                <textarea id="input-faktor-kendala" class="form-control" rows="6" data-field="bab3.faktorKendala" placeholder="Tuliskan kendala atau hambatan nyata di lapangan...">${report.bab3?.faktorKendala || ''}</textarea>
              </div>

            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'bab4') {
      container.innerHTML = `
        <div class="form-section-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">BAB IV • EVALUASI DAN RENCANA TINDAK LANJUT (RTL)</div>
              <div class="section-card-desc">Analisis Evaluasi, Solusi Pembenahan (Per Nomor), dan Matriks RTL Tabel</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              4.1 Analisis Hasil Evaluasi Keterlaksanaan Program
              <span class="form-helper">Tingkat keberhasilan, kedisiplinan, dan respon peserta didik</span>
            </label>
            <textarea class="form-control" rows="5" data-field="bab4.analisisEvaluasi">${report.bab4?.analisisEvaluasi || ''}</textarea>
          </div>

          <!-- 4.2 Solusi Pembenahan (REUSABLE DYNAMIC LIST) -->
          ${window.SIM_UI && window.SIM_UI.dynamicList ? window.SIM_UI.dynamicList({
            id: 'list-container-solusi',
            title: '💡 4.2 Solusi dan Strategi Pembenahan Mutu',
            badgeText: 'SOLUSI',
            badgeColor: 'amber',
            hint: 'Setiap butir langkah pembenahan dipisah per nomor urut',
            introHtml: `<input type="text" class="itemized-intro-input" value="${report.bab4.solusiObj.intro || 'Untuk mengatasi berbagai kendala di lapangan, tim pelaksana telah merumuskan sejumlah langkah solutif:'}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab4.solusiObj', this.value)">`,
            items: report.bab4.solusiObj.items,
            placeholder: 'Tuliskan langkah solusi pembenahan...',
            addButtonText: 'Tambah Poin Solusi',
            onUpdateItem: (idx) => `window.simApp.updateListItem('bab4.solusiObj', ${idx}, this.value)`,
            onAddItem: "window.simApp.addListItem('bab4.solusiObj')",
            onRemoveItem: (idx) => `window.simApp.deleteListItem('bab4.solusiObj', ${idx})`,
            rows: 2
          }) : `
            <div class="form-group">
              <label class="form-label">4.2 Solusi dan Strategi Pembenahan Mutu</label>
              <div class="itemized-list-wrapper">
                <input type="text" class="itemized-intro-input" value="${report.bab4.solusiObj.intro || ''}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab4.solusiObj', this.value)">
                <div id="list-container-solusi" style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${report.bab4.solusiObj.items.map((item, idx) => `
                    <div class="itemized-row">
                      <span class="item-badge-num">${idx + 1}</span>
                      <textarea class="item-textarea" rows="2" onchange="window.simApp.updateListItem('bab4.solusiObj', ${idx}, this.value)">${item}</textarea>
                      <button type="button" class="btn-del-item" onclick="window.simApp.deleteListItem('bab4.solusiObj', ${idx})">✕</button>
                    </div>
                  `).join('')}
                </div>
                <button type="button" class="btn-add-item" onclick="window.simApp.addListItem('bab4.solusiObj')">+ Tambah Poin Solusi</button>
              </div>
            </div>
          `}

          <!-- TABEL 4.3 MATRIKS RTL -->
          <div class="table-editor-wrapper">
            <div class="table-editor-header">
              <div class="table-editor-title">
                🎯 Tabel 4.3 : Matriks Rencana Tindak Lanjut (RTL) Berkelanjutan
              </div>
              <button type="button" class="btn-add-row" onclick="window.simApp.addTableRow('bab4.rtlTable')">
                + Tambah Rencana Tindak Lanjut
              </button>
            </div>
            <div class="table-responsive">
              <table class="grid-table">
                <thead>
                  <tr>
                    <th style="width: 50px;" class="cell-center">No</th>
                    <th style="width: 45%;">Fokus Program Tindak Lanjut</th>
                    <th style="width: 30%;">Target Perbaikan</th>
                    <th>Penanggung Jawab</th>
                    <th style="width: 45px;" class="cell-center">Aksi</th>
                  </tr>
                </thead>
                <tbody id="tbody-rtl">
                  ${report.bab4.rtlTable.map((row, idx) => `
                    <tr>
                      <td class="cell-center">
                        <input type="text" class="cell-input cell-center" value="${row.no || idx + 1}" onchange="window.simApp.updateTableCell('bab4.rtlTable', ${idx}, 'no', this.value)">
                      </td>
                      <td>
                        <textarea class="cell-input" placeholder="Fokus program tindak lanjut..." onchange="window.simApp.updateTableCell('bab4.rtlTable', ${idx}, 'fokus', this.value)">${row.fokus || ''}</textarea>
                      </td>
                      <td>
                        <textarea class="cell-input" placeholder="Target perbaikan..." onchange="window.simApp.updateTableCell('bab4.rtlTable', ${idx}, 'target', this.value)">${row.target || ''}</textarea>
                      </td>
                      <td style="min-width: 220px;">
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          <select class="cell-input cell-select" onchange="window.simApp.onRtlPjChange(${idx}, this.value)">
                            <option value="">-- Pilih PJ RTL --</option>
                            <option value="${report.pjName || ''}">[PJ Program Ini] ${report.pjName || ''}</option>
                            ${DAFTAR_GURU_KALISALAK.map(g => `
                              <option value="${g.nama}" ${(row.pj || '').includes(g.nama) ? 'selected' : ''}>${g.display}</option>
                            `).join('')}
                            <option value="__custom__">-- Ketik PJ Manual --</option>
                          </select>
                          <input type="text" class="cell-input" style="font-size: 0.75rem; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 3px 6px; border-radius: 4px;" value="${row.pj || ''}" placeholder="Nama Penanggung Jawab..." onchange="window.simApp.updateTableCell('bab4.rtlTable', ${idx}, 'pj', this.value)" id="input-rtl-pj-${idx}">
                        </div>
                      </td>
                      <td class="cell-center">
                        <button type="button" class="btn-table-action" title="Hapus Baris RTL" onclick="window.simApp.deleteTableRow('bab4.rtlTable', ${idx})">&times;</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'bab5') {
      container.innerHTML = `
        <div class="form-section-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">BAB V • PENUTUP</div>
              <div class="section-card-desc">Kesimpulan Pelaksanaan dan Saran/Rekomendasi (Per Nomor)</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              5.1 Kesimpulan
              <span class="form-helper">Rangkuman hasil capaian program kerja</span>
            </label>
            <textarea class="form-control" rows="5" data-field="bab5.kesimpulan">${report.bab5?.kesimpulan || ''}</textarea>
          </div>

          <!-- 5.2 Saran (REUSABLE DYNAMIC LIST) -->
          ${window.SIM_UI && window.SIM_UI.dynamicList ? window.SIM_UI.dynamicList({
            id: 'list-container-saran',
            title: '📌 5.2 Saran dan Rekomendasi Berkelanjutan',
            badgeText: 'SARAN',
            badgeColor: 'purple',
            hint: 'Setiap butir saran dan rekomendasi dipisah per nomor',
            introHtml: `<input type="text" class="itemized-intro-input" value="${report.bab5.saranObj.intro || 'Rekomendasi dan saran demi penyempurnaan mutu berkelanjutan:'}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab5.saranObj', this.value)">`,
            items: report.bab5.saranObj.items,
            placeholder: 'Tuliskan butir rekomendasi/saran...',
            addButtonText: 'Tambah Butir Saran',
            onUpdateItem: (idx) => `window.simApp.updateListItem('bab5.saranObj', ${idx}, this.value)`,
            onAddItem: "window.simApp.addListItem('bab5.saranObj')",
            onRemoveItem: (idx) => `window.simApp.deleteListItem('bab5.saranObj', ${idx})`,
            rows: 2
          }) : `
            <div class="form-group">
              <label class="form-label">5.2 Saran dan Rekomendasi</label>
              <div class="itemized-list-wrapper">
                <input type="text" class="itemized-intro-input" value="${report.bab5.saranObj.intro || ''}" placeholder="Kalimat pengantar..." onchange="window.simApp.updateListIntro('bab5.saranObj', this.value)">
                <div id="list-container-saran" style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${report.bab5.saranObj.items.map((item, idx) => `
                    <div class="itemized-row">
                      <span class="item-badge-num">${idx + 1}</span>
                      <textarea class="item-textarea" rows="2" onchange="window.simApp.updateListItem('bab5.saranObj', ${idx}, this.value)">${item}</textarea>
                      <button type="button" class="btn-del-item" onclick="window.simApp.deleteListItem('bab5.saranObj', ${idx})">✕</button>
                    </div>
                  `).join('')}
                </div>
                <button type="button" class="btn-add-item" onclick="window.simApp.addListItem('bab5.saranObj')">+ Tambah Butir Saran</button>
              </div>
            </div>
          `}
        </div>
      `;
    } else if (this.activeTab === 'photos') {
      this.renderPhotosTab(container, report);
    }

    this.attachInputListeners(container);
  }

  /* ==========================================================================
     MANIPULASI ITEM POIN TERPISAH (ITEMIZED LISTS)
     ========================================================================== */
  updateListIntro(listPath, introText) {
    const report = this.getActiveReport();
    const parts = listPath.split('.');
    if (report[parts[0]] && report[parts[0]][parts[1]]) {
      report[parts[0]][parts[1]].intro = introText;
      this.syncListToString(report, listPath);
      this.triggerAutoSave();
    }
  }

  updateListItem(listPath, itemIdx, value) {
    const report = this.getActiveReport();
    const parts = listPath.split('.');
    if (report[parts[0]] && report[parts[0]][parts[1]]) {
      report[parts[0]][parts[1]].items[itemIdx] = value;
      this.syncListToString(report, listPath);
      this.triggerAutoSave();
    }
  }

  addListItem(listPath) {
    const report = this.getActiveReport();
    const parts = listPath.split('.');
    if (!report[parts[0]][parts[1]]) {
      report[parts[0]][parts[1]] = { intro: '', items: [] };
    }
    report[parts[0]][parts[1]].items.push('');
    this.syncListToString(report, listPath);
    this.renderActiveTabContent();
    this.triggerAutoSave();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Butir baru berhasil ditambahkan', 'success');
    }
  }

  deleteListItem(listPath, itemIdx) {
    const report = this.getActiveReport();
    const parts = listPath.split('.');
    if (!report[parts[0]] || !report[parts[0]][parts[1]]) return;

    const doDelete = () => {
      report[parts[0]][parts[1]].items.splice(itemIdx, 1);
      this.syncListToString(report, listPath);
      this.renderActiveTabContent();
      this.triggerAutoSave();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast(`Butir ke-${itemIdx + 1} berhasil dihapus`, 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Butir',
        message: `Apakah Anda yakin ingin menghapus butir ke-${itemIdx + 1}?`,
        type: 'danger',
        confirmText: 'Ya, Hapus',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  syncListToString(report, listPath) {
    // Sinkronisasi otomatis ke field string bawaan agar format cetak & backup selalu sinkron
    const parts = listPath.split('.');
    const obj = report[parts[0]][parts[1]];
    if (!obj) return;

    let compiled = (obj.intro || '').trim();
    if (obj.items && obj.items.length > 0) {
      const itemsText = obj.items
        .map((it, i) => (i + 1) + '. ' + it)
        .join('\n\n');
      compiled += (compiled ? '\n\n' : '') + itemsText;
    }

    if (parts[1] === 'maksudTujuanObj') report.bab1.maksudTujuan = compiled;
    else if (parts[1] === 'dasarHukumObj') report.bab1.dasarHukum = compiled;
    else if (parts[1] === 'solusiObj') report.bab4.solusiPembenahan = compiled;
    else if (parts[1] === 'saranObj') report.bab5.saranRekomendasi = compiled;
  }

  appendChip(fieldPath, textToAppend) {
    const report = this.getActiveReport();
    const parts = fieldPath.split('.');
    let curVal = (report[parts[0]] && report[parts[0]][parts[1]]) || '';
    
    if (curVal.trim().length > 0) {
      curVal = curVal.trim() + '\n• ' + textToAppend;
    } else {
      curVal = '• ' + textToAppend;
    }

    if (!report[parts[0]]) report[parts[0]] = {};
    report[parts[0]][parts[1]] = curVal;

    const targetInput = document.querySelector('[data-field="' + fieldPath + '"]');
    if (targetInput) {
      targetInput.value = curVal;
    }

    this.triggerAutoSave();
  }

  updateTableCell(tablePath, rowIdx, colKey, value) {
    const report = this.getActiveReport();
    const parts = tablePath.split('.');
    const table = report[parts[0]][parts[1]];
    if (table && table[rowIdx]) {
      table[rowIdx][colKey] = value;
      this.triggerAutoSave();
    }
  }

  
  /* ==========================================================================
     SISTEM DROPDOWN OTOMATIS: JABATAN TIM, NAMA GURU, & URAIAN TUGAS
     ========================================================================== */
  onJabatanTimChange(rowIdx, selectedJabatan) {
    const report = this.getActiveReport();
    if (!report || !report.bab2 || !report.bab2.timTable || !report.bab2.timTable[rowIdx]) return;
    const row = report.bab2.timTable[rowIdx];

    if (selectedJabatan === '__custom__') {
      const inputEl = document.getElementById(`input-jabatan-${rowIdx}`);
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
      return;
    }

    if (selectedJabatan) {
      row.jabatan = selectedJabatan;
      const inputEl = document.getElementById(`input-jabatan-${rowIdx}`);
      if (inputEl) inputEl.value = selectedJabatan;

      // Otomatis isi Uraian Tugas Utama sesuai jabatan yang dipilih
      const foundJabatan = DAFTAR_JABATAN_TIM.find(j => j.nama === selectedJabatan);
      if (foundJabatan) {
        row.tugas = foundJabatan.tugas;
        const tugasEl = document.getElementById(`input-tugas-${rowIdx}`);
        if (tugasEl) {
          tugasEl.value = foundJabatan.tugas;
          tugasEl.classList.add('flash-highlight');
          setTimeout(() => tugasEl.classList.remove('flash-highlight'), 1200);
        }

        // Jika memilih Penanggung Jawab Umum & kolom nama masih kosong -> otomatis set Kepala Sekolah
        if (foundJabatan.defaultGuru && (!row.namaNip || row.namaNip.trim() === '')) {
          this.onGuruTimChange(rowIdx, foundJabatan.defaultGuru);
        }
      }
      this.triggerAutoSave();
    }
  }

  onGuruTimChange(rowIdx, selectedGuruName) {
    const report = this.getActiveReport();
    if (!report || !report.bab2 || !report.bab2.timTable || !report.bab2.timTable[rowIdx]) return;
    const row = report.bab2.timTable[rowIdx];

    if (selectedGuruName === '__custom__') {
      const inputEl = document.getElementById(`input-namanip-${rowIdx}`);
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
      return;
    }

    if (selectedGuruName) {
      const g = DAFTAR_GURU_KALISALAK.find(x => x.nama === selectedGuruName);
      if (g) {
        const formatted = (g.nip && g.nip !== '-') ? `${g.nama}\nNIP. ${g.nip}` : `${g.nama}\n(Guru SDN Kalisalak 01)`;
        row.namaNip = formatted;
        const inputEl = document.getElementById(`input-namanip-${rowIdx}`);
        if (inputEl) {
          inputEl.value = formatted;
          inputEl.classList.add('flash-highlight');
          setTimeout(() => inputEl.classList.remove('flash-highlight'), 1200);
        }
      }
      this.triggerAutoSave();
    }
  }

  onRtlPjChange(rowIdx, selectedVal) {
    const report = this.getActiveReport();
    if (!report || !report.bab4 || !report.bab4.rtlTable || !report.bab4.rtlTable[rowIdx]) return;
    const row = report.bab4.rtlTable[rowIdx];

    if (selectedVal === '__custom__') {
      const inputEl = document.getElementById(`input-rtl-pj-${rowIdx}`);
      if (inputEl) { inputEl.focus(); inputEl.select(); }
      return;
    }

    if (selectedVal) {
      const g = DAFTAR_GURU_KALISALAK.find(x => x.nama === selectedVal);
      const valToSet = g ? (g.nip && g.nip !== '-' ? `${g.nama} (NIP. ${g.nip})` : g.nama) : selectedVal;
      row.pj = valToSet;
      const inputEl = document.getElementById(`input-rtl-pj-${rowIdx}`);
      if (inputEl) {
        inputEl.value = valToSet;
        inputEl.classList.add('flash-highlight');
        setTimeout(() => inputEl.classList.remove('flash-highlight'), 1200);
      }
      this.triggerAutoSave();
    }
  }

  
  onKegiatanJadwalChange(rowIdx, selectedKegiatan) {
    const report = this.getActiveReport();
    if (!report || !report.bab2 || !report.bab2.jadwalTable || !report.bab2.jadwalTable[rowIdx]) return;
    const row = report.bab2.jadwalTable[rowIdx];

    if (selectedKegiatan === '__custom__') {
      const inputEl = document.getElementById(`input-jadwal-kegiatan-${rowIdx}`);
      if (inputEl) { inputEl.focus(); inputEl.select(); }
      return;
    }

    if (selectedKegiatan) {
      row.kegiatan = selectedKegiatan;
      const inputEl = document.getElementById(`input-jadwal-kegiatan-${rowIdx}`);
      if (inputEl) inputEl.value = selectedKegiatan;

      // Otomatis cari target/output dan waktu dari daftar spesifik laporan ini
      const spec = (window.REPORT_SPECIFIC_DROPDOWNS && window.REPORT_SPECIFIC_DROPDOWNS[report.id]) || {};
      const found = (spec.kegiatanOptions || []).find(k => k.kegiatan === selectedKegiatan);

      if (found) {
        if (found.target) {
          row.target = found.target;
          const targetEl = document.getElementById(`input-jadwal-target-${rowIdx}`);
          if (targetEl) targetEl.value = found.target;
        }
        if (found.waktu) {
          row.waktu = found.waktu;
          const waktuEl = document.getElementById(`input-jadwal-waktu-${rowIdx}`);
          if (waktuEl) waktuEl.value = found.waktu;
        }
      }

      this.scheduleAutoSave();
    }
  }

  onWaktuJadwalChange(rowIdx, val) {
    const report = this.getActiveReport();
    if (!report || !report.bab2 || !report.bab2.jadwalTable || !report.bab2.jadwalTable[rowIdx]) return;
    const row = report.bab2.jadwalTable[rowIdx];

    if (val === '__custom__') {
      const el = document.getElementById(`input-jadwal-waktu-${rowIdx}`);
      if (el) { el.focus(); el.select(); }
      return;
    }
    if (val) {
      row.waktu = val;
      const el = document.getElementById(`input-jadwal-waktu-${rowIdx}`);
      if (el) el.value = val;
      this.triggerAutoSave();
    }
  }

  onIndikatorSasaranChange(rowIdx, val) {
    const report = this.getActiveReport();
    if (!report || !report.bab3 || !report.bab3.indikatorTable || !report.bab3.indikatorTable[rowIdx]) return;
    const row = report.bab3.indikatorTable[rowIdx];

    if (val === '__custom__') {
      const el = document.getElementById(`input-indikator-sasaran-${rowIdx}`);
      if (el) { el.focus(); el.select(); }
      return;
    }
    if (val) {
      row.indikator = val;
      const el = document.getElementById(`input-indikator-sasaran-${rowIdx}`);
      if (el) el.value = val;

      // Otomatis isi target mutu dari daftar spesifik laporan ini
      const spec = (window.REPORT_SPECIFIC_DROPDOWNS && window.REPORT_SPECIFIC_DROPDOWNS[report.id]) || {};
      const found = (spec.indikatorOptions || []).find(x => x.indikator === val);
      if (found && found.defaultTarget) {
        row.target = found.defaultTarget;
        const targetEl = document.getElementById(`input-target-2026-${rowIdx}`);
        if (targetEl) targetEl.value = found.defaultTarget;
      }

      this.scheduleAutoSave();
    }
  }

  onTargetPersentaseChange(rowIdx, val) {
    const report = this.getActiveReport();
    if (!report || !report.bab3 || !report.bab3.indikatorTable || !report.bab3.indikatorTable[rowIdx]) return;
    const row = report.bab3.indikatorTable[rowIdx];

    if (val === '__custom__') {
      const el = document.getElementById(`input-target-2026-${rowIdx}`);
      if (el) { el.focus(); el.select(); }
      return;
    }
    if (val) {
      row.target = val;
      const el = document.getElementById(`input-target-2026-${rowIdx}`);
      if (el) {
        el.value = val;
        el.classList.add('flash-highlight');
        setTimeout(() => el.classList.remove('flash-highlight'), 1200);
      }
      this.triggerAutoSave();
    }
  }

  setPresetRealisasi(rowIdx, presetText) {
    const report = this.getActiveReport();
    if (!report || !report.bab3 || !report.bab3.indikatorTable || !report.bab3.indikatorTable[rowIdx]) return;
    const row = report.bab3.indikatorTable[rowIdx];

    row.realisasi = presetText;
    const inputEl = document.getElementById(`input-realisasi-${rowIdx}`);
    if (inputEl) {
      inputEl.value = presetText;
      inputEl.classList.add('flash-highlight');
      setTimeout(() => inputEl.classList.remove('flash-highlight'), 1200);
    }
    this.triggerAutoSave();
  }

  autoFillRealisasiFromPbd() {
    const report = this.getActiveReport();
    if (!report || !report.bab3 || !report.bab3.indikatorTable) return;
    if (!window.raporPbdSmart) {
      this.showToast('Data Rapor Pendidikan belum siap.');
      return;
    }
    let count = 0;
    report.bab3.indikatorTable.forEach((row, idx) => {
      const smartVal = window.raporPbdSmart.getSmartRealisasi(report.id, idx, row.indikator);
      if (smartVal) {
        row.realisasi = smartVal;
        count++;
      }
    });
    if (count > 0) {
      this.triggerAutoSave();
      this.renderActiveTabContent();
      this.showToast(`✨ ${count} Capaian Riil Rapor PBD berhasil diterapkan!`);
    }
  }

  addTableRow(tablePath) {
    const report = this.getActiveReport();
    const parts = tablePath.split('.');
    if (!report[parts[0]][parts[1]]) report[parts[0]][parts[1]] = [];
    const table = report[parts[0]][parts[1]];

    const newNo = String(table.length + 1);
    if (parts[1] === 'timTable') {
      if (table.length === 0) {
        table.push({
          no: newNo,
          jabatan: DAFTAR_JABATAN_TIM[0].nama,
          namaNip: 'IMAMUDIN, S.Pd.SD\nNIP. 19710617 200312 1 001',
          tugas: DAFTAR_JABATAN_TIM[0].tugas
        });
      } else if (table.length === 1) {
        const pjName = report.pjName || '';
        const pjNip = report.pjNip && report.pjNip !== '-' ? `\nNIP. ${report.pjNip}` : '';
        table.push({
          no: newNo,
          jabatan: DAFTAR_JABATAN_TIM[1].nama,
          namaNip: pjName ? `${pjName}${pjNip}` : '',
          tugas: DAFTAR_JABATAN_TIM[1].tugas
        });
      } else if (table.length === 2) {
        table.push({
          no: newNo,
          jabatan: DAFTAR_JABATAN_TIM[2].nama,
          namaNip: '',
          tugas: DAFTAR_JABATAN_TIM[2].tugas
        });
      } else if (table.length === 3) {
        table.push({
          no: newNo,
          jabatan: DAFTAR_JABATAN_TIM[3].nama,
          namaNip: '',
          tugas: DAFTAR_JABATAN_TIM[3].tugas
        });
      } else {
        table.push({
          no: newNo,
          jabatan: DAFTAR_JABATAN_TIM[DAFTAR_JABATAN_TIM.length - 1].nama,
          namaNip: '',
          tugas: DAFTAR_JABATAN_TIM[DAFTAR_JABATAN_TIM.length - 1].tugas
        });
      }
    } else if (parts[1] === 'jadwalTable') {
      const spec = (window.REPORT_SPECIFIC_DROPDOWNS && window.REPORT_SPECIFIC_DROPDOWNS[report.id]) || {};
      const opts = spec.kegiatanOptions || [];
      // Cari kegiatan spesifik yang belum digunakan
      const unused = opts.find(o => !table.some(r => r.kegiatan === o.kegiatan)) || opts[table.length % (opts.length || 1)] || { kegiatan: '', target: 'Tercapai Sesuai Target', waktu: 'Sepanjang Tahun 2026' };
      table.push({
        no: newNo,
        kegiatan: unused.kegiatan,
        target: unused.target,
        waktu: unused.waktu
      });
    } else if (parts[1] === 'indikatorTable') {
      const spec = (window.REPORT_SPECIFIC_DROPDOWNS && window.REPORT_SPECIFIC_DROPDOWNS[report.id]) || {};
      const opts = spec.indikatorOptions || [];
      // Cari indikator spesifik yang belum digunakan
      const unused = opts.find(o => !table.some(r => r.indikator === o.indikator)) || opts[table.length % (opts.length || 1)] || { indikator: '', defaultTarget: '100% (Tuntas Sempurna)' };
      table.push({
        no: newNo,
        indikator: unused.indikator,
        target: unused.defaultTarget,
        realisasi: '......%'
      });
    } else if (parts[1] === 'rtlTable') {
      table.push({ no: newNo, fokus: '', target: '', pj: report.pjName || '' });
    }

    this.renderActiveTabContent();
    this.triggerAutoSave();
  }

  deleteTableRow(tablePath, rowIdx) {
    const report = this.getActiveReport();
    const parts = tablePath.split('.');
    const table = report[parts[0]][parts[1]];
    if (table && table.length > 0) {
      table.splice(rowIdx, 1);
      table.forEach((r, i) => { r.no = String(i + 1); });
      this.renderActiveTabContent();
      this.triggerAutoSave();
    }
  }

  /* ==========================================================================
     DEDICATED 2-SLOT PHOTO ARCHITECTURE (DELEGATED TO laporPhotosUi)
     ========================================================================== */
  renderPhotosTab(container, report) {
    if (window.laporPhotosUi) {
      window.laporPhotosUi.renderPhotosTab(this, container, report);
    }
  }

  async handleSlotPhoto(slotNum, file) {
    if (window.laporPhotosUi) {
      await window.laporPhotosUi.handleSlotPhoto(this, slotNum, file);
    }
  }

  attachInputListeners(container) {
    const inputs = container.querySelectorAll('[data-field]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const fieldPath = input.dataset.field;
        this.updateReportField(fieldPath, input.value);
        this.triggerAutoSave();
      });
    });
  }

  updateReportField(fieldPath, value) {
    const report = this.getActiveReport();
    if (!report) return;

    const parts = fieldPath.split('.');
    if (parts.length === 1) {
      report[parts[0]] = value;
    } else if (parts.length === 2) {
      if (!report[parts[0]]) report[parts[0]] = {};
      report[parts[0]][parts[1]] = value;
    }
    this.isDirty = true;
  }

  triggerAutoSave() {
    const indicator = document.getElementById('save-indicator');
    if (indicator) {
      indicator.className = 'save-indicator saving';
      indicator.innerHTML = '<span class="save-dot"></span> Menyimpan...';
    }

    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(async () => {
      const report = this.getActiveReport();
      await window.appStorage.saveReport(report);
      this.isDirty = false;

      if (indicator) {
        indicator.className = 'save-indicator saved';
        indicator.innerHTML = '<span class="save-dot"></span> Tersimpan Otomatis';
      }
    }, 800);
  }

  async handlePhotoFiles(files) {
    if (window.laporPhotosUi) {
      await window.laporPhotosUi.handlePhotoFiles(this, files);
    }
  }

  async deletePhoto(photoId) {
    if (window.laporPhotosUi) {
      await window.laporPhotosUi.deletePhoto(this, photoId);
    }
  }

  async updatePhotoMeta(photoId, field, value) {
    if (window.laporPhotosUi) {
      await window.laporPhotosUi.updatePhotoMeta(this, photoId, field, value);
    }
  }

  async toggleReportStatus() {
    const report = this.getActiveReport();
    report.status = report.status === 'completed' ? 'draft' : 'completed';
    await window.appStorage.saveReport(report);
    this.loadReport(report.id);
    this.updateStats();
  }

  openSettingsModal() {
    if (window.settingsUi) {
      window.settingsUi.openModal();
    } else {
      document.getElementById('modal-settings')?.classList.add('open');
    }
  }

  closeSettingsModal() {
    if (window.settingsUi) {
      window.settingsUi.closeModal();
    } else {
      document.getElementById('modal-settings')?.classList.remove('open');
    }
  }

  async saveSettingsFromForm() {
    if (window.settingsUi) {
      window.settingsUi.saveFromForm(true);
    }
  }

  switchMasterTab(tabId) {
    if (window.settingsUi) return window.settingsUi.switchTab(tabId);
  }

  addNewTeacherPrompt() {
    if (window.settingsUi) return window.settingsUi.addNewTeacherPrompt();
  }

  addNewSarprasPrompt() {
    if (window.settingsUi) return window.settingsUi.addNewSarprasPrompt();
  }

  recalculateBosPreview() {
    if (window.settingsUi) return window.settingsUi.recalculateBosPreview();
  }

  resetMasterDefaultsConfirm() {
    if (window.settingsUi) return window.settingsUi.resetDefaultsConfirm();
  }

  filterTeachersGrid(query) {
    if (window.settingsUi) {
      window.settingsUi.filterTeachers(query);
    }
  }

  openPbdModal() {
    if (window.pbdBackupUi) return window.pbdBackupUi.openPbdModal();
  }

  closePbdModal() {
    if (window.pbdBackupUi) return window.pbdBackupUi.closePbdModal();
  }

  renderPbdPrioritiesTable() {
    if (window.pbdBackupUi) return window.pbdBackupUi.renderPbdPrioritiesTable();
  }

  async applyPbdRecommendations(reportId) {
    if (window.pbdBackupUi) return window.pbdBackupUi.applyPbdRecommendations(reportId);
  }

  async syncAllWithOfficialPBD() {
    if (window.pbdBackupUi) return window.pbdBackupUi.syncAllWithOfficialPBD();
  }

  openBackupModal() {
    if (window.pbdBackupUi) return window.pbdBackupUi.openBackupModal();
  }

  closeBackupModal() {
    if (window.pbdBackupUi) return window.pbdBackupUi.closeBackupModal();
  }

  async handleExportJson() {
    if (window.pbdBackupUi) return window.pbdBackupUi.handleExportJson();
  }

  async handleImportJson(event) {
    if (window.pbdBackupUi) return window.pbdBackupUi.handleImportJson(event);
  }

  async handleExportD1Sql() {
    if (window.pbdBackupUi) return window.pbdBackupUi.handleExportD1Sql();
  }

  printCurrentReport() {
    const report = this.getActiveReport();
    if (window.laporPrint) {
      window.laporPrint.printReport(this, report);
    } else {
      window.print();
    }
  }

  downloadCurrentReportPdf() {
    const report = this.getActiveReport();
    if (window.laporPrint && typeof window.laporPrint.downloadPdf === 'function') {
      window.laporPrint.downloadPdf(this, report);
    } else {
      if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
        window.SIM_UI.toast('Modul generator PDF (laporPrint) belum siap.', 'danger');
      } else if (typeof window.showToast === 'function') {
        window.showToast('Modul generator PDF (laporPrint) belum siap.', 'danger');
      }
    }
  }

  printSkTimOnly() {
    const report = this.getActiveReport();
    if (window.laporPrint) {
      window.laporPrint.printSkOnly(this, report);
    } else {
      window.print();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.simApp = new SimLaporApp();
  window.simApp.init();
});
