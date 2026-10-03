/**
 * SIM-UI Sidebar Navigation Component
 * SDN Kalisalak 01 - Unified Sidebar Renderer for SIM-LAPOR & SIM-RKT
 * Encapsulates report listing, RKT chapter navigation, search filter, and category stats.
 */
(function (global) {
  'use strict';

  const SIM_SIDEBAR = {
    /**
     * Data master bab/seksi RKT standar kedinasan
     */
    rktSections: [
      {
        id: 'cover',
        label: 'Cover & Lembar Penetapan',
        desc: 'Lembar Penetapan, Validasi & Verifikasi Pengawas'
      },
      {
        id: 'bab1',
        label: 'Bab 1 — Pendahuluan',
        desc: 'Latar Belakang, Landasan Hukum, Tujuan Program'
      },
      {
        id: 'bab2',
        label: 'Bab 2 — Profil Satuan Pendidikan',
        desc: 'Visi Misi, Data Tendik & Murid, Pagu BOS, Sarpras'
      },
      {
        id: 'bab3',
        label: 'Bab 3 — Evaluasi Diri Sekolah',
        desc: 'EDS Internal, Rapor PBD, Rekomendasi Pembenahan'
      },
      {
        id: 'bab4',
        label: 'Bab 4 — Lembar Kerja RKT',
        desc: 'Target Capaian, Matriks Program, Rencana ARKAS'
      },
      {
        id: 'bab5',
        label: 'Bab 5 — Penutup',
        desc: 'Kesimpulan Umum, Saran & Rekomendasi Mutu'
      },
      {
        id: 'lampiran',
        label: 'Lampiran & SK Tim Pelaksana',
        desc: 'Surat Undangan, Notulen, Foto Kegiatan, SK Tim'
      }
    ],

    /**
     * Render daftar navigasi RKT (Bab I - V & Lampiran)
     */
    renderRktSections: function (container, activeTab, onSelect) {
      if (!container) return;
      let html = '';
      this.rktSections.forEach(s => {
        const isActive = activeTab === s.id ? ' active' : '';
        html += `
          <div class="rkt-nav-item${isActive}" data-rkt-section="${s.id}" role="button" tabindex="0">
            <div class="rkt-nav-text">
              <div class="rkt-nav-title">${s.label}</div>
              <div class="rkt-nav-desc">${s.desc}</div>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;

      // Event listener delegation
      container.querySelectorAll('.rkt-nav-item').forEach(el => {
        el.addEventListener('click', () => {
          const secId = el.dataset.rktSection;
          if (typeof onSelect === 'function') {
            onSelect(secId);
          } else if (global.simApp && typeof global.simApp.selectRktSection === 'function') {
            global.simApp.selectRktSection(secId);
          }
        });
      });
    },

    /**
     * Filter seksi RKT dengan pencarian cerdas (angka arab & angka romawi)
     */
    filterRktSections: function (query) {
      const q = (query || '').toLowerCase().trim();
      const items = document.querySelectorAll('.rkt-nav-item');
      items.forEach(el => {
        const text = el.textContent.toLowerCase();
        let match = text.includes(q);
        if (!match && q) {
          const numMap = { '1': 'i', '2': 'ii', '3': 'iii', '4': 'iv', '5': 'v', 'i': '1', 'ii': '2', 'iii': '3', 'iv': '4', 'v': '5' };
          for (const [k, v] of Object.entries(numMap)) {
            if (q.includes(k) && text.includes(v)) match = true;
          }
        }
        el.style.display = (!q || match) ? 'flex' : 'none';
      });
    },

    /**
     * Render daftar 44 Laporan SIM-LAPOR
     */
    renderReportList: function (container, reports, activeReportId, currentModule, searchQuery, categoryFilter, onSelect) {
      if (!container) return;
      const q = (searchQuery || '').toLowerCase().trim();
      const cat = categoryFilter || 'all';

      const filtered = (reports || []).filter(r => {
        const matchSearch = (r.title || '').toLowerCase().includes(q) ||
                            (r.pjName || '').toLowerCase().includes(q) ||
                            String(r.id) === q;
        const matchCat = cat === 'all' || r.category === cat;
        return matchSearch && matchCat;
      });

      container.innerHTML = '';

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: var(--font-sm);">
            Tidak ditemukan program kerja yang sesuai.
          </div>
        `;
        return;
      }

      filtered.forEach(r => {
        const item = document.createElement('div');
        const isActive = currentModule === 'lapor' && r.id === activeReportId;
        item.className = 'report-item' + (isActive ? ' active' : '');
        item.role = 'button';
        item.tabIndex = 0;

        const statusBadge = r.status === 'completed'
          ? '<span class="item-badge badge-complete">Lengkap</span>'
          : '<span class="item-badge badge-draft">Draf</span>';

        item.innerHTML = `
          <div class="item-number">${r.id}</div>
          <div class="item-content">
            <div class="item-title">${r.title || ''}</div>
            <div class="item-meta">
              <span class="item-pj" title="${r.pjName || ''}">${r.pjName || ''}</span>
              ${statusBadge}
            </div>
          </div>
        `;

        item.addEventListener('click', () => {
          if (typeof onSelect === 'function') {
            onSelect(r.id);
          } else if (global.simApp && typeof global.simApp.selectLaporReport === 'function') {
            global.simApp.selectLaporReport(r.id);
          }
        });

        container.appendChild(item);
      });
    },

    /**
     * Update opsi dropdown kategori laporan
     */
    renderCategoryOptions: function (selectElement, reports, currentCategory) {
      if (!selectElement || !reports) return;
      const categories = Array.from(new Set(reports.map(r => r.category))).filter(Boolean);
      let html = `<option value="all">Semua Kategori (${reports.length})</option>`;
      categories.forEach(cat => {
        const count = reports.filter(r => r.category === cat).length;
        const isSelected = (currentCategory === cat) ? ' selected' : '';
        html += `<option value="${cat}"${isSelected}>${cat} (${count})</option>`;
      });
      selectElement.innerHTML = html;
    },

    /**
     * Update ringkasan progres di pill stat sidebar
     */
    updateSidebarStats: function (statElement, reports) {
      if (!statElement || !reports) return;
      const total = reports.length;
      const completed = reports.filter(r => r.status === 'completed').length;
      statElement.textContent = `${completed} dari ${total} Selesai`;
    }
  };

  global.SIM_SIDEBAR = SIM_SIDEBAR;
})(typeof window !== 'undefined' ? window : global);
