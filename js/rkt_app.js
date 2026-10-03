/**
 * SIM-RKT (SISTEM INFORMASI MANAJEMEN RENCANA KERJA TAHUNAN)
 * SDN KALISALAK 01 KECAMATAN MARGASARI TAHUN 2027
 * 
 * Terintegrasi penuh dengan SIM-LAPOR (Berbagi data sekolah, PTK, dan Rapor PBD)
 * Format output presisi mengacu pada Dokumen Resmi DRAFT RKT SD 2027
 */

class SimRktController {
  constructor() {
    this.rktData = null;
    this.activeTab = 'cover';
    this.saveTimeout = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.loadData();
    this.syncWithSchoolSettings();
    this.setupGlobalInputHandlers();
    this.isInitialized = true;
    console.log('SIM-RKT Controller initialized successfully.');
  }

  setupGlobalInputHandlers() {
    document.addEventListener('input', (e) => {
      if (e.target && e.target.tagName === 'TEXTAREA' && (e.target.classList.contains('auto-resize-input') || e.target.classList.contains('cell-input'))) {
        this.autoResizeTextarea(e.target);
      }
    });
  }

  autoResizeTextarea(el) {
    if (!el) return;
    el.style.height = 'auto';
    const minH = 48;
    const maxH = 240;
    const scrollH = el.scrollHeight;
    if (scrollH > minH) {
      el.style.height = Math.min(scrollH, maxH) + 'px';
      el.style.overflowY = scrollH > maxH ? 'auto' : 'hidden';
    } else {
      el.style.height = minH + 'px';
      el.style.overflowY = 'hidden';
    }
  }

  initAutoResizeTextareas(scope = document) {
    requestAnimationFrame(() => {
      const textareas = scope.querySelectorAll('textarea.auto-resize-input, textarea.cell-input');
      textareas.forEach(ta => this.autoResizeTextarea(ta));
    });
  }

  loadData() {
    try {
      const saved = localStorage.getItem('simlapor_rkt_2027');
      if (saved) {
        this.rktData = JSON.parse(saved);
      } else if (window.DEFAULT_RKT_DATA) {
        this.rktData = JSON.parse(JSON.stringify(window.DEFAULT_RKT_DATA));
      } else {
        this.rktData = {};
      }

      // Jalankan sinkronisasi background dari Cloudflare D1
      this.syncD1Rkt();

      // Merge with defaults to guarantee all schema properties exist
      if (window.DEFAULT_RKT_DATA) {
        this.ensureRktSchemaIntegrity(window.DEFAULT_RKT_DATA);
      }

      // Standarisasi khusus penetapan resmi naskah RKT
      if (this.rktData && this.rktData.general) {
        if (!this.rktData.general.komiteNama || this.rktData.general.komiteNama === 'H. M. SYAMSUDIN') {
          this.rktData.general.komiteNama = 'IDA ELISA';
        }
        if (!this.rktData.general.kepalaNama || this.rktData.general.kepalaNama === 'IMAMUDIN, S.Pd.SD') {
          this.rktData.general.kepalaNama = 'IMAMUDIN, S. Pd.SD';
        }
        if (!this.rktData.general.kepalaNip || this.rktData.general.kepalaNip === '19710617 200312 1 001') {
          this.rktData.general.kepalaNip = '197106172003121001';
        }
        if (!this.rktData.general.kadisdikNama) {
          this.rktData.general.kadisdikNama = 'WINARTO, S.E., M.M.';
        }
        if (!this.rktData.general.kadisdikPangkat) {
          this.rktData.general.kadisdikPangkat = 'Pembina Tk. I';
        }
        if (!this.rktData.general.kadisdikNip) {
          this.rktData.general.kadisdikNip = '196901251996031003';
        }
        // Khusus RKT: Pengawas Pembina adalah Yeyen Anggraeni, S.Pd.SD.
        if (!this.rktData.general.pengawasNama || this.rktData.general.pengawasNama.includes('Sri Suci') || !this.rktData.general.pengawasNama.includes('Yeyen')) {
          this.rktData.general.pengawasNama = 'Yeyen Anggraeni, S.Pd.SD.';
          this.rktData.general.pengawasNip = '198610132010012016';
        }
        // Standarisasi tahun wajib RKT 2027 (bukan 2025)
        if (this.rktData.general.tahunPenyusunan === '2025' || !this.rktData.general.tahunPenyusunan) {
          this.rktData.general.tahunPenyusunan = '2027';
        }
        if (this.rktData.general.tahunPelajaran === '2025/2026' || !this.rktData.general.tahunPelajaran) {
          this.rktData.general.tahunPelajaran = '2026/2027';
        }
        if (!this.rktData.general.tahunRkt || this.rktData.general.tahunRkt === '2025') {
          this.rktData.general.tahunRkt = '2027';
        }
        if (!this.rktData.general.tahunAnggaran || this.rktData.general.tahunAnggaran === '2025') {
          this.rktData.general.tahunAnggaran = '2027';
        }
      }

      // Sinkronisasi otomatis data riil peserta didik TP 2026/2027 (225 Siswa) dari file resmi
      if (this.rktData && this.rktData.bab2) {
        const totalMuridNow = (this.rktData.bab2.dataMurid || []).reduce((a, b) => a + (parseInt(b.total) || 0), 0);
        if (totalMuridNow <= 150 || (this.rktData.bab2.dataMurid && this.rktData.bab2.dataMurid[0] && this.rktData.bab2.dataMurid[0].total === 25)) {
          if (window.DEFAULT_RKT_DATA && window.DEFAULT_RKT_DATA.bab2) {
            this.rktData.bab2.dataMurid = JSON.parse(JSON.stringify(window.DEFAULT_RKT_DATA.bab2.dataMurid));
            this.rktData.bab2.danaBos = JSON.parse(JSON.stringify(window.DEFAULT_RKT_DATA.bab2.danaBos));
          }
        }
      }
    } catch (e) {
      console.error('Error loading RKT data, falling back to defaults:', e);
      this.rktData = JSON.parse(JSON.stringify(window.DEFAULT_RKT_DATA || {}));
    }
  }

  ensureRktSchemaIntegrity(defaults) {
    if (!this.rktData) this.rktData = {};
    
    // Ensure all root sections exist
    ['general', 'bab1', 'bab2', 'bab3', 'bab4', 'bab5', 'lampiran'].forEach(sec => {
      if (!this.rktData[sec] || typeof this.rktData[sec] !== 'object') {
        this.rktData[sec] = JSON.parse(JSON.stringify(defaults[sec] || {}));
      }
    });

    // Bab 3: EDS integrity (persentase & persen & narasi resmi docx)
    if (this.rktData.bab3) {
      const defBab3A = window.RKT_NARRATIVES ? window.RKT_NARRATIVES.getBab3A(this.rktData.general, this.rktData.bab3) : null;
      if (!this.rktData.bab3.pengantarEds && defBab3A) {
        this.rktData.bab3.pengantarEds = defBab3A.pengantarEds;
      }
      if (!this.rktData.bab3.narasiPengelolaan && defBab3A) {
        this.rktData.bab3.narasiPengelolaan = defBab3A.narasiPengelolaan;
      }
      if (!this.rktData.bab3.narasiPembelajaran && defBab3A) {
        this.rktData.bab3.narasiPembelajaran = defBab3A.narasiPembelajaran;
      }
      if (!this.rktData.bab3.narasiHasilBelajar && defBab3A) {
        this.rktData.bab3.narasiHasilBelajar = defBab3A.narasiHasilBelajar;
      }
      if (!this.rktData.bab3.kesimpulanEds && defBab3A) {
        this.rktData.bab3.kesimpulanEds = defBab3A.kesimpulanEds;
      }
      if (!this.rktData.bab3.prioritasMutu || this.rktData.bab3.prioritasMutu.length === 0) {
        this.rktData.bab3.prioritasMutu = defBab3A ? JSON.parse(JSON.stringify(defBab3A.prioritasMutu)) : (defaults.bab3?.prioritasMutu || []);
      }

      if (!this.rktData.bab3.eds || this.rktData.bab3.eds.length === 0) {
        this.rktData.bab3.eds = JSON.parse(JSON.stringify(defaults.bab3?.eds || (defBab3A ? defBab3A.edsTable : [])));
      } else {
        this.rktData.bab3.eds.forEach((e, idx) => {
          const def = defaults.bab3?.eds?.[idx] || {};
          if (!e.persentase && e.persen) e.persentase = e.persen + '%';
          if (!e.persentase && def.persentase) e.persentase = def.persentase;
          if (!e.persen && e.persentase) e.persen = e.persentase.replace('%', '');
          if (!e.kategori && def.kategori) e.kategori = def.kategori;
        });
      }

      // Bab 3: Evaluasi RKT Lalu
      if (!this.rktData.bab3.evaluasiRktLalu || this.rktData.bab3.evaluasiRktLalu.length === 0) {
        this.rktData.bab3.evaluasiRktLalu = JSON.parse(JSON.stringify(defaults.bab3?.evaluasiRktLalu || []));
      } else {
        this.rktData.bab3.evaluasiRktLalu.forEach((ev, idx) => {
          const def = defaults.bab3?.evaluasiRktLalu?.[idx] || {};
          if (!ev.hasilEvaluasi && def.hasilEvaluasi) ev.hasilEvaluasi = def.hasilEvaluasi;
          if (!ev.tindakLanjut && def.tindakLanjut) ev.tindakLanjut = def.tindakLanjut;
          if (!ev.keterlaksanaan) ev.keterlaksanaan = ev.hasilEvaluasi || 'Terlaksana dengan baik';
        });
      }

      // Bab 3: Rapor PBD
      if (!this.rktData.bab3.raporPbd || this.rktData.bab3.raporPbd.length === 0) {
        this.rktData.bab3.raporPbd = JSON.parse(JSON.stringify(defaults.bab3?.raporPbd || []));
      }
      // Bab 3: Prioritas PBD
      if (!this.rktData.bab3.prioritasPbd || this.rktData.bab3.prioritasPbd.length === 0) {
        this.rktData.bab3.prioritasPbd = JSON.parse(JSON.stringify(defaults.bab3?.prioritasPbd || []));
      }
    }

    // Bab 4: targetKinerja, rencanaPbd, rencanaArkas, rkt8Snp, jadwalStrategis
    if (this.rktData.bab4) {
      ['targetKinerja', 'rencanaPbd', 'rencanaArkas', 'rkt8Snp', 'jadwalStrategis'].forEach(key => {
        if (!this.rktData.bab4[key] || this.rktData.bab4[key].length === 0) {
          this.rktData.bab4[key] = JSON.parse(JSON.stringify(defaults.bab4?.[key] || []));
        }
      });
    }

    // Lampiran: instrumenValidasi & analisis12Bulan
    if (this.rktData.lampiran) {
      if (!this.rktData.lampiran.instrumenValidasi || this.rktData.lampiran.instrumenValidasi.length === 0 || !this.rktData.lampiran.instrumenValidasi[0].hasil) {
        this.rktData.lampiran.instrumenValidasi = JSON.parse(JSON.stringify(defaults.lampiran?.instrumenValidasi || []));
      }
      if (!this.rktData.lampiran.analisis12Bulan || this.rktData.lampiran.analisis12Bulan.length === 0) {
        this.rktData.lampiran.analisis12Bulan = JSON.parse(JSON.stringify(defaults.lampiran?.analisis12Bulan || []));
      }
      this.ensureFotoKegiatanIntegrity();
    }
  }

  ensureFotoKegiatanIntegrity() {
    if (!this.rktData.lampiran) this.rktData.lampiran = {};
    const defaultGuides = [
      { id: 'rkt-foto-1', title: 'Foto 1: Rapat Tim Penyusun RKT', desc: 'Pemaparan rapor mutu dan evaluasi 8 Standar Nasional bersama seluruh guru kelas dan mapel.' },
      { id: 'rkt-foto-2', title: 'Foto 2: Musyawarah Komite Sekolah', desc: 'Penyelarasan aspirasi wali murid dan pertimbangan komite sekolah terkait skala prioritas BOS.' },
      { id: 'rkt-foto-3', title: 'Foto 3: Input Anggaran ARKAS 4', desc: 'Sinkronisasi kode rekening belanja barang/jasa kegiatan PBD ke dalam sistem ARKAS resmi.' },
      { id: 'rkt-foto-4', title: 'Foto 4: Validasi Pengawas Pembina', desc: 'Pemeriksaan kesesuaian instrumen perencanaan berbasis data oleh Pengawas Korwilcam Margasari.' }
    ];

    if (!Array.isArray(this.rktData.lampiran.fotoKegiatan) || this.rktData.lampiran.fotoKegiatan.length === 0) {
      this.rktData.lampiran.fotoKegiatan = defaultGuides.map(g => ({
        id: g.id,
        title: g.title,
        desc: g.desc,
        dataUrl: null,
        url: null,
        publicId: null,
        syncStatus: null
      }));
    } else {
      defaultGuides.forEach((g, idx) => {
        if (!this.rktData.lampiran.fotoKegiatan[idx]) {
          this.rktData.lampiran.fotoKegiatan[idx] = { id: g.id, title: g.title, desc: g.desc, dataUrl: null, url: null, publicId: null };
        } else {
          if (!this.rktData.lampiran.fotoKegiatan[idx].title) this.rktData.lampiran.fotoKegiatan[idx].title = g.title;
          if (!this.rktData.lampiran.fotoKegiatan[idx].desc) this.rktData.lampiran.fotoKegiatan[idx].desc = g.desc;
        }
      });
    }
  }

  syncWithSchoolSettings() {
    this.syncWithMasterData();
  }

  syncWithMasterData() {
    if (!this.rktData || !this.rktData.general) return;
    if (window.masterDb) {
      const sek = window.masterDb.getSekolah();
      const pej = window.masterDb.getPejabat(true);
      const per = window.masterDb.getPeriode();
      const siswa = window.masterDb.getKelasDanSiswa();
      const bos = window.masterDb.getBos();
      const sarpras = window.masterDb.getSarpras();
      const tendik = window.masterDb.getTendik();
      const tim = window.masterDb.getTimPenyusun();

      this.rktData.general.sekolahNama = sek.nama;
      this.rktData.general.sekolahNpsn = sek.npsn;
      this.rktData.general.sekolahNss = sek.nss;
      this.rktData.general.sekolahAlamat = sek.alamat;
      this.rktData.general.kecamatan = sek.kecamatan;
      this.rktData.general.kabupaten = sek.kabupaten;
      this.rktData.general.provinsi = sek.provinsi;
      this.rktData.general.email = sek.email;

      this.rktData.general.kepalaNama = pej.kepalaNama;
      this.rktData.general.kepalaNip = pej.kepalaNip;
      this.rktData.general.kepalaPangkat = pej.kepalaPangkat;
      this.rktData.general.kepalaJabatan = pej.kepalaJabatan;

      this.rktData.general.komiteNama = pej.komiteNama;
      this.rktData.general.komiteJabatan = pej.komiteJabatan;

      this.rktData.general.pengawasNama = pej.pengawasNama || 'Yeyen Anggraeni, S.Pd.SD.';
      this.rktData.general.pengawasNip = pej.pengawasNip || '198610132010012016';
      this.rktData.general.pengawasJabatan = pej.pengawasJabatan || 'Pengawas Sekolah Pembina Gugus';

      this.rktData.general.kadisdikNama = pej.kadisdikNama;
      this.rktData.general.kadisdikNip = pej.kadisdikNip;
      this.rktData.general.kadisdikPangkat = pej.kadisdikPangkat;
      this.rktData.general.kadisdikJabatan = pej.kadisdikJabatan;

      this.rktData.general.tahunBerjalan = per.tahunBerjalan;
      this.rktData.general.tahunRkt = per.tahunRkt;
      this.rktData.general.tahunAnggaran = per.tahunAnggaran;
      this.rktData.general.tahunPelajaran = per.tahunPelajaran;
      this.rktData.general.tahunPenyusunan = per.tahunRkt;
      this.rktData.general.tahunLalu = per.tahunLalu;
      this.rktData.general.titimangsaTempat = per.titimangsaTempat || sek.kecamatan || 'Margasari';
      this.rktData.general.titimangsaTanggalPenetapan = per.titimangsaTanggalPenetapan;
      this.rktData.general.titimangsaTanggalValidasi = per.titimangsaTanggalValidasi;
      this.rktData.general.titimangsaTanggalPengantar = per.titimangsaTanggalPengantar;
      this.rktData.general.titimangsaTanggalUndangan = per.titimangsaTanggalUndangan;
      this.rktData.general.titimangsaTanggalBeritaAcara = per.titimangsaTanggalBeritaAcara;
      this.rktData.general.titimangsaTanggalSk = per.titimangsaTanggalSk;

      if (this.rktData.bab2) {
        this.rktData.bab2.dataMurid = siswa;
        this.rktData.bab2.sarpras = sarpras;
      }
      if (this.rktData.lampiran) {
        this.rktData.lampiran.timPenyusun = tim;
      }
    }
  }

  saveData() {
    if (!this.rktData) return;
    try {
      localStorage.setItem('simlapor_rkt_2027', JSON.stringify(this.rktData));
      this.showSaveIndicator('saved');

      // Sinkronkan ke Cloudflare D1 di latar belakang
      fetch('/api/d1/rkt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rktData: this.rktData })
      }).catch(() => {});
    } catch (e) {
      console.error('Error saving RKT data to localStorage:', e);
      this.showSaveIndicator('error');
    }
  }

  async syncD1Rkt() {
    try {
      const res = await fetch('/api/d1/rkt');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.rkt && json.rkt.general) {
          console.log('[D1] Menyinkronkan data RKT 2027 dari Cloudflare D1...');
          this.rktData = json.rkt;
          if (window.DEFAULT_RKT_DATA) {
            this.ensureRktSchemaIntegrity(window.DEFAULT_RKT_DATA);
          }
          localStorage.setItem('simlapor_rkt_2027', JSON.stringify(this.rktData));
          this.renderActiveTab();
        }
      }
    } catch (_) {}
  }

  triggerAutoSave() {
    this.showSaveIndicator('saving');
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveData();
    }, 600);
  }

  showSaveIndicator(status) {
    const indicator = document.getElementById('save-indicator-rkt') || document.getElementById('save-indicator');
    if (!indicator) return;

    indicator.className = 'save-indicator ' + status;
    const textEl = indicator.querySelector('.save-text');
    if (textEl) {
      if (status === 'saving') textEl.textContent = 'Menyimpan...';
      else if (status === 'saved') textEl.textContent = 'Tersimpan Otomatis';
      else if (status === 'error') textEl.textContent = 'Gagal Menyimpan';
    }
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;

    // Update Tab Navigation Active State
    const navButtons = document.querySelectorAll('.rkt-tab-btn');
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.rktTab === tabKey);
    });

    // Update Sidebar Item Active State
    const sidebarItems = document.querySelectorAll('.rkt-nav-item');
    sidebarItems.forEach(item => {
      item.classList.toggle('active', item.dataset.rktSection === tabKey);
    });

    this.renderActiveTab();
  }

  // =========================================================================
  // RENDERERS
  // =========================================================================

  renderSidebar() {
    const container = document.getElementById('rkt-sidebar-list');
    if (!container) return;

    if (window.SIM_SIDEBAR && typeof window.SIM_SIDEBAR.renderRktSections === 'function') {
      window.SIM_SIDEBAR.renderRktSections(container, this.activeTab, (secId) => {
        if (window.simApp && typeof window.simApp.selectRktSection === 'function') {
          window.simApp.selectRktSection(secId);
        } else {
          this.switchTab(secId);
        }
      });
      return;
    }

    const sections = [
      { id: 'cover', label: 'Cover & Lembar Penetapan', desc: 'Lembar Penetapan, Validasi & Verifikasi Pengawas' },
      { id: 'bab1', label: 'Bab 1 — Pendahuluan', desc: 'Latar Belakang, Landasan Hukum, Tujuan Program' },
      { id: 'bab2', label: 'Bab 2 — Profil Satuan Pendidikan', desc: 'Visi Misi, Data Tendik & Murid, Pagu BOS, Sarpras' },
      { id: 'bab3', label: 'Bab 3 — Evaluasi Diri Sekolah', desc: 'EDS Internal, Rapor PBD, Rekomendasi Pembenahan' },
      { id: 'bab4', label: 'Bab 4 — Lembar Kerja RKT', desc: 'Target Capaian, Matriks Program, Rencana ARKAS' },
      { id: 'bab5', label: 'Bab 5 — Penutup', desc: 'Kesimpulan Umum, Saran & Rekomendasi Mutu' },
      { id: 'lampiran', label: 'Lampiran & SK Tim Pelaksana', desc: 'Surat Undangan, Notulen, Foto Kegiatan, SK Tim' }
    ];

    let html = '';
    sections.forEach(s => {
      const isActive = this.activeTab === s.id ? ' active' : '';
      html += `
        <div class="rkt-nav-item${isActive}" data-rkt-section="${s.id}" onclick="window.simApp.selectRktSection('${s.id}')" role="button" tabindex="0">
          <div class="rkt-nav-text">
            <div class="rkt-nav-title">${s.label}</div>
            <div class="rkt-nav-desc">${s.desc}</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  filterSections(query) {
    if (window.SIM_SIDEBAR && typeof window.SIM_SIDEBAR.filterRktSections === 'function') {
      window.SIM_SIDEBAR.filterRktSections(query);
      return;
    }
    const q = (query || '').toLowerCase().trim();
    const items = document.querySelectorAll('.rkt-nav-item');
    items.forEach(el => {
      const text = el.textContent.toLowerCase();
      let match = text.includes(q);
      el.style.display = (!q || match) ? 'flex' : 'none';
    });
  }

  renderActiveTab() {
    const container = document.getElementById('tab-content-area');
    if (!container) return;

    // Synchronize Header
    const catTag = document.getElementById('header-category-tag');
    const titleEl = document.getElementById('header-title');
    if (catTag) catTag.textContent = 'Dokumen Induk Resmi • Perencanaan Berbasis Data (PBD)';
    if (titleEl) titleEl.textContent = `RKT ${this.rktData.general.sekolahNama || 'SDN KALISALAK 01'} TAHUN ${this.rktData.general.tahunRkt || '2027'}`;

    // Delegated tab rendering through SIM_UI / SIM_RKT_TABS component
    if (window.SIM_RKT_TABS && typeof window.SIM_RKT_TABS.renderTab === 'function') {
      window.SIM_RKT_TABS.renderTab(this.activeTab, container, this.rktData, this);
    } else {
      switch (this.activeTab) {
        case 'cover': this.renderTabCover(container); break;
        case 'bab1': this.renderTabBab1(container); break;
        case 'bab2': this.renderTabBab2(container); break;
        case 'bab3': this.renderTabBab3(container); break;
        case 'bab4': this.renderTabBab4(container); break;
        case 'bab5': this.renderTabBab5(container); break;
        case 'lampiran': this.renderTabLampiran(container); break;
        default: this.renderTabCover(container);
      }
    }
    this.initAutoResizeTextareas(container);
  }

  // -------------------------------------------------------------------------
  // DELEGATED TAB RENDERERS (COMPONENTS)
  // -------------------------------------------------------------------------
  getPbdHeroBannerHtml() {
    return window.SIM_RKT_TABS ? window.SIM_RKT_TABS.getPbdHeroBannerHtml(this.rktData) : '';
  }

  renderTabCover(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabCover(container, this.rktData, this);
  }

  renderTabBab1(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabBab1(container, this.rktData, this);
  }

  renderTabBab2(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabBab2(container, this.rktData, this);
  }

  renderTabBab3(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabBab3(container, this.rktData, this);
  }

  renderTabBab4(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabBab4(container, this.rktData, this);
  }

  renderTabBab5(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabBab5(container, this.rktData, this);
  }

  renderTabLampiran(container) {
    if (window.SIM_RKT_TABS) window.SIM_RKT_TABS.renderTabLampiran(container, this.rktData, this);
  }

  // =========================================================================
  // DATA UPDATE HANDLERS
  // =========================================================================
  updateGeneral(key, val) {
    this.rktData.general[key] = val;
    this.triggerAutoSave();
  }

  updateBab1(key, val) {
    this.rktData.bab1[key] = val;
    this.triggerAutoSave();
  }

  // Universal dynamic list handler for any point-by-point lists (Peraturan, Tujuan, Misi, Saran)
  updateListItem(babKey, listKey, idx, val) {
    if (!this.rktData[babKey]) this.rktData[babKey] = {};
    if (!Array.isArray(this.rktData[babKey][listKey])) this.rktData[babKey][listKey] = [];
    this.rktData[babKey][listKey][idx] = val;
    this.triggerAutoSave();
  }

  addListItem(babKey, listKey, defaultValue = '') {
    if (!this.rktData[babKey]) this.rktData[babKey] = {};
    if (!Array.isArray(this.rktData[babKey][listKey])) this.rktData[babKey][listKey] = [];
    this.rktData[babKey][listKey].push(defaultValue);
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Butir baru berhasil ditambahkan', 'success');
    }
  }

  removeListItem(babKey, listKey, idx) {
    const doRemove = () => {
      if (this.rktData[babKey] && Array.isArray(this.rktData[babKey][listKey])) {
        this.rktData[babKey][listKey].splice(idx, 1);
        this.triggerAutoSave();
        this.renderActiveTab();
        if (window.SIM_UI && window.SIM_UI.toast) {
          window.SIM_UI.toast('Butir berhasil dihapus', 'info');
        }
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Butir',
        message: `Apakah Anda yakin ingin menghapus butir ke-${idx + 1}?`,
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doRemove
      });
    } else {
      doRemove();
    }
  }

  updateLandasanHukum(val) {
    this.rktData.bab1.landasanHukum = val.split('\n').filter(s => s.trim().length > 0);
    this.triggerAutoSave();
  }

  updateTujuanKhusus(val) {
    this.rktData.bab1.tujuanKhusus = val.split('\n').filter(s => s.trim().length > 0);
    this.triggerAutoSave();
  }

  updateBab2(key, val) {
    this.rktData.bab2[key] = val;
    this.triggerAutoSave();
  }

  updateBab2Array(key, val) {
    this.rktData.bab2[key] = val.split('\n').filter(s => s.trim().length > 0);
    this.triggerAutoSave();
  }

  updateBab2List(key, val) {
    this.updateBab2Array(key, val);
  }

  updateBab2Item(key, idx, val) {
    if (!this.rktData.bab2[key]) {
      this.rktData.bab2[key] = [];
    }
    this.rktData.bab2[key][idx] = val;
    this.triggerAutoSave();
  }

  addBab2Item(key) {
    if (!this.rktData.bab2[key]) {
      this.rktData.bab2[key] = [];
    }
    this.rktData.bab2[key].push('');
    this.triggerAutoSave();
    this.renderActiveTab();
  }

  removeBab2Item(key, idx) {
    if (this.rktData.bab2[key] && this.rktData.bab2[key].length > 0) {
      this.rktData.bab2[key].splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
    }
  }

  updateMuridCell(idx, field, val) {
    const row = this.rktData.bab2.dataMurid[idx];
    if (row) {
      row[field] = parseInt(val) || 0;
      row.total = (parseInt(row.laki) || 0) + (parseInt(row.perempuan) || 0);
      this.recalcDanaBos();
      this.triggerAutoSave();
      this.renderActiveTab();
    }
  }

  recalcDanaBos() {
    const totalSiswa = (this.rktData.bab2.dataMurid || []).reduce((a, b) => a + (parseInt(b.total) || 0), 0);
    const tarif = parseInt(this.rktData.bab2.danaBos.tarifPerSiswa || this.rktData.bab2.danaBos.satuanBiaya) || 900000;
    const totalPagu = totalSiswa * tarif;

    this.rktData.bab2.danaBos.totalSiswa = totalSiswa;
    this.rktData.bab2.danaBos.siswaTotal = totalSiswa;
    this.rktData.bab2.danaBos.tarifPerSiswa = tarif;
    this.rktData.bab2.danaBos.satuanBiaya = tarif;
    this.rktData.bab2.danaBos.totalPagu = totalPagu;
    this.rktData.bab2.danaBos.totalPaguBos = totalPagu;
    this.rktData.bab2.danaBos.tw1 = Math.round(totalPagu * 0.3);
    this.rktData.bab2.danaBos.tw2 = Math.round(totalPagu * 0.3);
    this.rktData.bab2.danaBos.tw3 = Math.round(totalPagu * 0.2);
    this.rktData.bab2.danaBos.tw4 = Math.round(totalPagu * 0.2);
  }

  updateTarifBos(val) {
    this.rktData.bab2.danaBos.tarifPerSiswa = parseInt(val) || 900000;
    this.recalcDanaBos();
    this.triggerAutoSave();
    this.renderActiveTab();
  }

  recalcMurid() {
    this.recalcDanaBos();
    this.triggerAutoSave();
    this.renderActiveTab();
  }

  updateSarprasCell(idx, field, val) {
    const row = this.rktData.bab2.sarpras[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addSarprasRow() {
    if (!this.rktData.bab2.sarpras) this.rktData.bab2.sarpras = [];
    this.rktData.bab2.sarpras.push({
      jenis: 'Sarana / Prasarana Baru',
      jumlah: '1 Ruang',
      baik: '1',
      rusakRingan: '0',
      rusakBerat: '0'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
  }

  deleteSarprasRow(idx) {
    const doDelete = () => {
      this.rktData.bab2.sarpras.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Data sarpras berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Sarana Prasarana',
        message: 'Apakah Anda yakin ingin menghapus baris data sarana prasarana ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateBab3(key, val) {
    this.rktData.bab3[key] = val;
    this.triggerAutoSave();
  }

  updatePrioritasMutu(idx, val) {
    if (!this.rktData.bab3.prioritasMutu) this.rktData.bab3.prioritasMutu = [];
    this.rktData.bab3.prioritasMutu[idx] = val;
    this.triggerAutoSave();
  }

  addPrioritasMutu() {
    if (!this.rktData.bab3.prioritasMutu) this.rktData.bab3.prioritasMutu = [];
    this.rktData.bab3.prioritasMutu.push('Prioritas peningkatan mutu baru...');
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Prioritas peningkatan mutu baru berhasil ditambahkan', 'success');
    }
  }

  deletePrioritasMutu(idx) {
    const doDelete = () => {
      if (!this.rktData.bab3.prioritasMutu) return;
      this.rktData.bab3.prioritasMutu.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Prioritas peningkatan mutu berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Prioritas Mutu',
        message: 'Apakah Anda yakin ingin menghapus butir prioritas peningkatan mutu ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateEdsCell(idx, field, val) {
    const row = this.rktData.bab3.eds[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addEdsRow() {
    if (!this.rktData.bab3.eds) this.rktData.bab3.eds = [];
    this.rktData.bab3.eds.push({
      no: String(this.rktData.bab3.eds.length + 1),
      aspek: 'Aspek Mutu Baru',
      persentase: '85%',
      kategori: 'Baik'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Aspek EDS baru berhasil ditambahkan', 'success');
    }
  }

  deleteEdsRow(idx) {
    const doDelete = () => {
      this.rktData.bab3.eds.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Aspek EDS berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Aspek EDS',
        message: 'Apakah Anda yakin ingin menghapus baris aspek evaluasi diri sekolah ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateEvaluasiRktCell(idx, field, val) {
    if (!this.rktData.bab3.evaluasiRktLalu) this.rktData.bab3.evaluasiRktLalu = [];
    const row = this.rktData.bab3.evaluasiRktLalu[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addEvaluasiRktRow() {
    if (!this.rktData.bab3.evaluasiRktLalu) this.rktData.bab3.evaluasiRktLalu = [];
    this.rktData.bab3.evaluasiRktLalu.push({
      no: this.rktData.bab3.evaluasiRktLalu.length + 1,
      snp: 'Standar Proses',
      program: 'Program Pembenahan Mutu',
      hasilEvaluasi: 'Ketercapaian baik, perlu ditingkatkan',
      tindakLanjut: 'Diprogramkan kembali dalam RKT tahun berjalan'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Program evaluasi RKT berhasil ditambahkan', 'success');
    }
  }

  deleteEvaluasiRktRow(idx) {
    const doDelete = () => {
      this.rktData.bab3.evaluasiRktLalu.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Baris evaluasi RKT berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Evaluasi RKT',
        message: 'Apakah Anda yakin ingin menghapus baris evaluasi RKT tahun lalu ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updatePrioritasPbdCell(idx, field, val) {
    if (!this.rktData.bab3.prioritasPbd) this.rktData.bab3.prioritasPbd = [];
    const row = this.rktData.bab3.prioritasPbd[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addPrioritasPbdRow() {
    if (!this.rktData.bab3.prioritasPbd) this.rktData.bab3.prioritasPbd = [];
    this.rktData.bab3.prioritasPbd.push({
      identifikasi: 'Identifikasi Prioritas Baru',
      capaian: 'Sedang',
      akarMasalah: 'Akar masalah teridentifikasi',
      kegiatanBenahi: 'Peningkatan Kompetensi Pendidik',
      inspirasi: 'Pelatihan Mandiri di Platform Merdeka Mengajar (PMM)',
      kegiatanArkas: 'Workshop Peningkatan Kualitas Pembelajaran'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Prioritas rekomendasi baru berhasil ditambahkan', 'success');
    }
  }

  deletePrioritasPbdRow(idx) {
    const doDelete = () => {
      this.rktData.bab3.prioritasPbd.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Baris rekomendasi PBD berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Rekomendasi PBD',
        message: 'Apakah Anda yakin ingin menghapus baris prioritas rekomendasi ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateTargetKinerjaCell(idx, field, val) {
    const row = this.rktData.bab4.targetKinerja[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addTargetKinerjaRow() {
    if (!this.rktData.bab4.targetKinerja) this.rktData.bab4.targetKinerja = [];
    this.rktData.bab4.targetKinerja.push({
      snp: 'Standar Nasional Pendidikan',
      target: 'Target kinerja umum',
      targetTerukur: 'Target capaian indikator kunci'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Target kinerja baru berhasil ditambahkan', 'success');
    }
  }

  deleteTargetKinerjaRow(idx) {
    const doDelete = () => {
      this.rktData.bab4.targetKinerja.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Target kinerja berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Target Kinerja',
        message: 'Apakah Anda yakin ingin menghapus target kinerja ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateRencanaPbdCell(idx, field, val) {
    if (!this.rktData.bab4.rencanaPbd) this.rktData.bab4.rencanaPbd = [];
    const row = this.rktData.bab4.rencanaPbd[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addRencanaPbdRow() {
    if (!this.rktData.bab4.rencanaPbd) this.rktData.bab4.rencanaPbd = [];
    this.rktData.bab4.rencanaPbd.push({
      identifikasi: 'Program PBD Baru',
      akarMasalah: 'Analisis akar masalah teridentifikasi',
      kegiatanBenahi: 'Peningkatan Kompetensi GTK',
      implementasi: 'Pelaksanaan workshop dan implementasi di kelas',
      butuhBiaya: 'Ya'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Kegiatan PBD baru berhasil ditambahkan', 'success');
    }
  }

  deleteRencanaPbdRow(idx) {
    const doDelete = () => {
      this.rktData.bab4.rencanaPbd.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Kegiatan PBD berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Rencana PBD',
        message: 'Apakah Anda yakin ingin menghapus kegiatan rencana PBD ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateRkt8SnpCell(idx, field, val) {
    if (!this.rktData.bab4.rkt8Snp) this.rktData.bab4.rkt8Snp = [];
    const row = this.rktData.bab4.rkt8Snp[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addRkt8SnpRow() {
    if (!this.rktData.bab4.rkt8Snp) this.rktData.bab4.rkt8Snp = [];
    this.rktData.bab4.rkt8Snp.push({
      snp: 'Standar Proses',
      program: 'Optimalisasi Proses Pembelajaran',
      kegiatanUtama: 'Kegiatan Pembelajaran Berdiferensiasi',
      subKegiatan: 'Pengadaan modul dan media belajar interaktif',
      jenis: 'PBD',
      sumberDana: 'BOS Reguler',
      bulan: 'Agustus 2027'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Program RKT 8 SNP baru berhasil ditambahkan', 'success');
    }
  }

  deleteRkt8SnpRow(idx) {
    const doDelete = () => {
      this.rktData.bab4.rkt8Snp.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Baris RKT 8 SNP berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus RKT 8 SNP',
        message: 'Apakah Anda yakin ingin menghapus baris program RKT 8 SNP ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateJadwalStrategisCell(idx, field, val) {
    if (!this.rktData.bab4.jadwalStrategis) this.rktData.bab4.jadwalStrategis = [];
    const row = this.rktData.bab4.jadwalStrategis[idx];
    if (row) {
      row[field] = val;
      this.triggerAutoSave();
    }
  }

  addJadwalStrategisRow() {
    if (!this.rktData.bab4.jadwalStrategis) this.rktData.bab4.jadwalStrategis = [];
    this.rktData.bab4.jadwalStrategis.push({
      sasaran: 'Sasaran Mutu Baru',
      program: 'Program Kerja Strategis',
      kegiatan: 'Kegiatan Pembenahan',
      indikator: 'Target capaian indikator terukur',
      waktu: 'Januari - Desember 2027',
      penanggungJawab: 'Tim Pengembang Sekolah'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Program kerja strategis baru berhasil ditambahkan', 'success');
    }
  }

  deleteJadwalStrategisRow(idx) {
    const doDelete = () => {
      this.rktData.bab4.jadwalStrategis.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Baris program strategis berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Jadwal Strategis',
        message: 'Apakah Anda yakin ingin menghapus baris program kerja strategis ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateArkasCell(idx, field, val) {
    const row = this.rktData.bab4.rencanaArkas[idx];
    if (row) {
      row[field] = val;
      if (field === 'jumlah' || field === 'hargaSatuan') {
        const jml = parseInt(row.jumlah) || 0;
        const harga = parseInt(String(row.hargaSatuan).replace(/[^0-9]/g, '')) || 0;
        row.total = (jml * harga).toLocaleString('id-ID');
      }
      this.triggerAutoSave();
      this.renderActiveTab();
    }
  }

  addArkasRow() {
    this.rktData.bab4.rencanaArkas.push({
      no: String(this.rktData.bab4.rencanaArkas.length + 1),
      kegiatanBenahi: 'Pengembangan Mutu Pembelajaran',
      implementasi: 'Penyelenggaraan kegiatan pembelajaran',
      kegiatanArkas: 'Kegiatan Pembelajaran & Ekstrakurikuler',
      uraian: 'Perlengkapan dan ATK kegiatan siswa',
      bulan: 'Juli 2027',
      jumlah: '1',
      satuan: 'Paket',
      hargaSatuan: '500.000',
      total: '500.000'
    });
    this.triggerAutoSave();
    this.renderActiveTab();
    if (window.SIM_UI && window.SIM_UI.toast) {
      window.SIM_UI.toast('Baris belanja baru berhasil ditambahkan', 'success');
    }
  }

  deleteArkasRow(idx) {
    const doDelete = () => {
      this.rktData.bab4.rencanaArkas.splice(idx, 1);
      this.triggerAutoSave();
      this.renderActiveTab();
      if (window.SIM_UI && window.SIM_UI.toast) {
        window.SIM_UI.toast('Baris belanja berhasil dihapus', 'info');
      }
    };

    if (window.SIM_UI && window.SIM_UI.confirm) {
      window.SIM_UI.confirm({
        title: 'Hapus Belanja ARKAS',
        message: 'Apakah Anda yakin ingin menghapus baris belanja ARKAS ini?',
        confirmText: 'Ya, Hapus',
        variant: 'danger',
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  }

  updateBab5(key, val) {
    this.rktData.bab5[key] = val;
    this.triggerAutoSave();
  }

  updateBab5Saran(val) {
    this.rktData.bab5.saran = val.split('\n').filter(s => s.trim().length > 0);
    this.triggerAutoSave();
  }

  // =========================================================================
  // LAMPIRAN 3: FOTO DOKUMENTASI UPLOAD & CLOUDINARY HANDLERS
  // =========================================================================
  handleUploadFoto(idx, file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
        window.SIM_UI.toast('Format file tidak didukung. Harap pilih file gambar (JPG, PNG, dll).', 'danger');
      } else if (window.toast) {
        window.toast.error('Format file tidak didukung. Harap pilih file gambar (JPG, PNG, dll).');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      this.ensureFotoKegiatanIntegrity();

      const foto = this.rktData.lampiran.fotoKegiatan[idx];
      const oldPublicId = foto.publicId;

      foto.dataUrl = dataUrl;
      foto.updatedAt = new Date().toISOString();
      foto.syncStatus = 'offline';

      this.triggerAutoSave();
      this.renderActiveTab();

      // Sinkronisasi ke Cloudinary jika modul aktif dan online
      if (window.cloudinarySync && window.cloudinarySync.isOnline) {
        try {
          foto.syncStatus = 'uploading';
          this.renderActiveTab();

          const result = await window.cloudinarySync.uploadFileToCloudinary({
            file: dataUrl,
            folder: 'sdn_kalisalak_01/rkt_lampiran',
            oldPublicId: oldPublicId
          });

          if (result && result.secure_url) {
            foto.url = result.secure_url;
            foto.publicId = result.public_id;
            foto.syncStatus = 'synced';
            this.triggerAutoSave();
            this.renderActiveTab();
          }
        } catch (err) {
          console.warn('Upload Cloudinary gagal, foto tetap aman tersimpan offline lokal:', err);
          foto.syncStatus = 'offline';
          this.triggerAutoSave();
          this.renderActiveTab();
        }
      }
    };
    reader.readAsDataURL(file);
  }

  deleteUploadFoto(idx) {
    const doDelete = () => {
      this.ensureFotoKegiatanIntegrity();

      const foto = this.rktData.lampiran.fotoKegiatan[idx];
      if (!foto) return;
      const oldPublicId = foto.publicId;

      foto.dataUrl = null;
      foto.url = null;
      foto.publicId = null;
      foto.syncStatus = null;

      this.triggerAutoSave();
      this.renderActiveTab();

      // Hapus foto dari Cloudinary jika memiliki public_id
      if (oldPublicId && window.cloudinarySync) {
        window.cloudinarySync.deleteFileFromCloudinary(oldPublicId).catch(err => {
          console.warn('Gagal menghapus file Cloudinary:', err);
        });
      }
      if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
        window.SIM_UI.toast('Foto dokumentasi berhasil dihapus.', 'info');
      }
    };

    if (window.SIM_UI && typeof window.SIM_UI.confirm === 'function') {
      window.SIM_UI.confirm({
        title: 'Hapus Foto Dokumentasi',
        message: 'Apakah Anda yakin ingin menghapus foto dokumentasi ini?',
        confirmText: 'Ya, Hapus Foto',
        cancelText: 'Batal',
        variant: 'danger',
        onConfirm: () => doDelete()
      });
    } else {
      doDelete();
    }
  }

  updateFotoMeta(idx, field, val) {
    this.ensureFotoKegiatanIntegrity();
    this.rktData.lampiran.fotoKegiatan[idx][field] = val;
    this.triggerAutoSave();
  }

  // =========================================================================
  // PRINT & EXPORT
  // =========================================================================
  // =========================================================================
  // PRINT & EXPORT: DOKUMEN RESMI LENGKAP PERSIS ACUAN DINAS
  // (Mengacu pada RKT SDN Kalisalak 01 2025/2026 & DRAFT RKT SD 2027 FINAL)
  // =========================================================================
  getOfficialKopHtml(g) {
    return `
      <div class="official-kop" style="position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 2pt;">
        <img src="assets/LOGO RKT.svg" alt="Logo RKT" class="kop-logo" style="position: absolute; left: 0; top: 0; width: 68px; height: auto; object-fit: contain;">
        <div class="kop-text" style="text-align: center; width: 100%; padding: 0 75px;">
          <div class="kop-line-1" style="font-size: 11.5pt; font-weight: 700; text-transform: uppercase;">PEMERINTAH KABUPATEN TEGAL</div>
          <div class="kop-line-2" style="font-size: 12.5pt; font-weight: 700; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
          <div class="kop-line-3" style="font-size: 14pt; font-weight: 900; text-transform: uppercase;">${g.sekolahNama || 'SD NEGERI KALISALAK 01'}</div>
          <div class="kop-line-4" style="font-size: 10pt; font-weight: 700; text-transform: uppercase;">KORWILCAM BIDANG PENDIDIKAN KECAMATAN MARGASARI</div>
          <div class="kop-address" style="font-size: 8pt; font-style: italic; margin-top: 2px;">${g.sekolahAlamat || 'Jl. Kyai Abdul Latif RT 01 RW 10, Kalisalak, Margasari 52463'}</div>
        </div>
      </div>
      <div class="kop-divider" style="border-top: 2.5pt solid #000; border-bottom: 0.75pt solid #000; height: 3px; margin: 3px 0 10pt 0;"></div>
    `;
  }

  printRktDoc() {
    if (window.rktPrint) {
      window.rktPrint.printDocument(this, this.rktData);
    } else {
      console.warn('rktPrint module not loaded, calling window.print()');
      window.print();
    }
  }

  async downloadRktPdf() {
    if (window.rktPrint && typeof window.rktPrint.downloadPdf === 'function') {
      await window.rktPrint.downloadPdf(this, this.rktData);
    } else {
      if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
        window.SIM_UI.toast('Modul generator PDF (rktPrint) belum siap.', 'danger');
      } else if (window.toast) {
        window.toast.error('Modul generator PDF (rktPrint) belum siap.');
      }
    }
  }

  async exportWordDoc() {
    if (window.rktPrint && typeof window.rktPrint.downloadWordDoc === 'function') {
      await window.rktPrint.downloadWordDoc(this, this.rktData);
    } else {
      const g = (window.masterDb ? window.masterDb.getPeriode() : {}) || (this.rktData ? this.rktData.general : {}) || {};
      const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || {};
      const sekolahClean = (sek.nama || g.sekolahNama || 'SD NEGERI KALISALAK 01').trim().replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
      const tahun = g.tahunRkt || '2027';
      const link = document.createElement('a');
      link.href = '/api/export-docx';
      link.download = `RKT_${sekolahClean}_TAHUN_${tahun}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// Global instance
window.simRkt = new SimRktController();
