/**
 * SIM-RKT Tab Components
 * SDN KALISALAK 01 - Modul UI Tab Renderers (Cover, Bab 1 - 5, Lampiran)
 * Modularized to ensure lightweight files (< 2000 lines) and unified styling
 */
(function (global) {
  'use strict';

  const SIM_RKT_TABS = {
  getPbdHeroBannerHtml: function (data) {
    const rkt = data || (window.simRkt ? window.simRkt.rktData : {});
    const g = rkt?.general || {};
    return `
      <div class="pbd-hero-banner">
        <div class="pbd-hero-top">
          <div>
            <div class="pbd-hero-tag">
              <span>🏛️ Sistem Terpadu</span> &bull; Perencanaan Berbasis Data (PBD)
            </div>
            <h2 class="pbd-hero-title">Rencana Kerja Tahunan (RKT) ${g.sekolahNama || 'SDN KALISALAK 01'}</h2>
            <div class="pbd-hero-sub">Tahun Dokumen: <strong>${g.tahunRkt || '2027'}</strong> &bull; Tahun Pelajaran: <strong>${g.tahunPelajaran || '2026/2027'}</strong> &bull; NPSN: <strong>${g.sekolahNpsn || '20325895'}</strong></div>
          </div>
          <div class="pbd-hero-badges">
            <span class="pbd-hero-pill" style="background: rgba(16, 185, 129, 0.2); border-color: rgba(52, 211, 153, 0.4); color: #6ee7b7;">
              🟢 Terhubung Data Master
            </span>
            <span class="pbd-hero-pill">
              ⚡ Rapor Pendidikan 2025 Aktif
            </span>
          </div>
        </div>

        <div class="pbd-hero-metrics">
          <div class="pbd-metric-card">
            <div class="pbd-metric-label">📖 Literasi (A.1)</div>
            <div class="pbd-metric-val">40,00%</div>
            <div class="pbd-metric-desc" style="color: #fca5a5;">Kurang &bull; Intervensi Utama</div>
          </div>
          <div class="pbd-metric-card">
            <div class="pbd-metric-label">🔢 Numerasi (A.2)</div>
            <div class="pbd-metric-val">36,67%</div>
            <div class="pbd-metric-desc" style="color: #fca5a5;">Kurang &bull; Capaian Minimum</div>
          </div>
          <div class="pbd-metric-card">
            <div class="pbd-metric-label">🌟 Karakter (A.3)</div>
            <div class="pbd-metric-val">52,17</div>
            <div class="pbd-metric-desc" style="color: #fef08a;">Sedang &bull; Pembiasaan P5</div>
          </div>
          <div class="pbd-metric-card">
            <div class="pbd-metric-label">🛡️ Keamanan (D.4)</div>
            <div class="pbd-metric-val">65,01</div>
            <div class="pbd-metric-desc" style="color: #86efac;">Sedang &bull; 70% Aman Fisik</div>
          </div>
          <div class="pbd-metric-card">
            <div class="pbd-metric-label">💻 TIK (E.7.4)</div>
            <div class="pbd-metric-val">100,00</div>
            <div class="pbd-metric-desc" style="color: #6ee7b7;">Sempurna &bull; 15 Chromebook</div>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 1: COVER & LEMBAR PENGESAHAN
  // -------------------------------------------------------------------------
  renderTabCover: function (container, rktData, controller) {
    const rkt = rktData || (controller ? controller.rktData : (window.simRkt ? window.simRkt.rktData : {}));
    const g = rkt.general || {};
    container.innerHTML = this.getPbdHeroBannerHtml(rkt) + `
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill">BAGIAN DEPAN &bull; SAMPUL</span>
            <h3 class="section-title-modern">📘 Sampul &amp; Identitas Dokumen RKT</h3>
            <p class="section-desc-modern">Identitas resmi dokumen Rencana Kerja Tahunan yang tercetak pada halaman muka (cover) naskah kedinasan.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="input-row-3">
            <div class="form-group">
              <label class="form-label">Tahun RKT <span class="required-star">*</span></label>
              <input type="text" class="form-control" value="${g.tahunRkt || '2027'}" oninput="window.simRkt.updateGeneral('tahunRkt', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Nama Sekolah <span class="required-star">*</span></label>
              <input type="text" class="form-control" value="${g.sekolahNama || ''}" oninput="window.simRkt.updateGeneral('sekolahNama', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">NPSN</label>
              <input type="text" class="form-control" value="${g.sekolahNpsn || ''}" oninput="window.simRkt.updateGeneral('sekolahNpsn', this.value)">
            </div>
          </div>
          <div class="input-row-3" style="margin-top: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Kecamatan</label>
              <input type="text" class="form-control" value="${g.kecamatan || 'Margasari'}" oninput="window.simRkt.updateGeneral('kecamatan', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Kabupaten</label>
              <input type="text" class="form-control" value="${g.kabupaten || 'Kabupaten Tegal'}" oninput="window.simRkt.updateGeneral('kabupaten', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Provinsi</label>
              <input type="text" class="form-control" value="${g.provinsi || 'Jawa Tengah'}" oninput="window.simRkt.updateGeneral('provinsi', this.value)">
            </div>
          </div>
          <div class="form-group" style="margin-top: 0.75rem;">
            <label class="form-label">Alamat Lengkap Satuan Pendidikan</label>
            <input type="text" class="form-control" value="${g.sekolahAlamat || ''}" oninput="window.simRkt.updateGeneral('sekolahAlamat', this.value)">
          </div>
          <div class="input-row-3" style="margin-top: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Tahun RKT</label>
              <input type="text" class="form-control" value="${g.tahunRkt || '2027'}" oninput="window.simRkt.updateGeneral('tahunRkt', this.value)" placeholder="contoh: 2027">
            </div>
            <div class="form-group">
              <label class="form-label">Tahun Pelajaran</label>
              <input type="text" class="form-control" value="${g.tahunPelajaran || '2026/2027'}" oninput="window.simRkt.updateGeneral('tahunPelajaran', this.value)" placeholder="contoh: 2026/2027">
            </div>
            <div class="form-group">
              <label class="form-label">Tahun Dokumen (Bawah Sampul)</label>
              <input type="text" class="form-control" value="${g.tahunPenyusunan || '2027'}" oninput="window.simRkt.updateGeneral('tahunPenyusunan', this.value)" placeholder="contoh: 2027">
            </div>
          </div>
        </div>
      </div>

      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #fef3c7; color: #b45309; border-color: #fde68a;">LEGALITAS &bull; PENGESAHAN</span>
            <h3 class="section-title-modern">✍️ Lembar Penetapan &amp; Pengesahan Kedinasan</h3>
            <p class="section-desc-modern">Pihak-pihak penandatangan resmi lembar penetapan RKT (Kepala Sekolah, Komite Sekolah, Pengawas Pembina, dan Plt. Kepala Dinas Dikbud Kabupaten Tegal).</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="input-row-3">
            <div class="form-group">
              <label class="form-label">Tempat Titimangsa</label>
              <input type="text" class="form-control" value="${g.titimangsaTempat || 'Margasari'}" oninput="window.simRkt.updateGeneral('titimangsaTempat', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Penetapan RKT</label>
              <input type="text" class="form-control" value="${g.titimangsaTanggalPenetapan || '31 Desember 2026'}" oninput="window.simRkt.updateGeneral('titimangsaTanggalPenetapan', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Validasi Pengawas</label>
              <input type="text" class="form-control" value="${g.titimangsaTanggalValidasi || '28 Desember 2026'}" oninput="window.simRkt.updateGeneral('titimangsaTanggalValidasi', this.value)">
            </div>
          </div>

          <div class="signatories-grid">
            <!-- Box 1: KS & Komite -->
            <div class="signatory-box">
              <div class="signatory-box-header">
                <div class="signatory-icon-circle">1</div>
                <div class="signatory-box-title">Pihak Satuan Pendidikan (KS &amp; Komite)</div>
              </div>
              <div class="form-group">
                <label class="form-label">Nama Kepala Sekolah</label>
                <input type="text" class="form-control" value="${g.kepalaNama || ''}" oninput="window.simRkt.updateGeneral('kepalaNama', this.value)">
              </div>
              <div class="form-group" style="margin-top: 0.5rem;">
                <label class="form-label">NIP Kepala Sekolah</label>
                <input type="text" class="form-control" value="${g.kepalaNip || ''}" oninput="window.simRkt.updateGeneral('kepalaNip', this.value)">
              </div>
              <div class="form-group" style="margin-top: 0.5rem;">
                <label class="form-label">Nama Ketua Komite Sekolah</label>
                <input type="text" class="form-control" value="${g.komiteNama || ''}" oninput="window.simRkt.updateGeneral('komiteNama', this.value)">
              </div>
            </div>

            <!-- Box 2: Pengawas & Kadisdik -->
            <div class="signatory-box">
              <div class="signatory-box-header">
                <div class="signatory-icon-circle" style="background: #f0fdf4; border-color: #bbf7d0; color: #15803d;">2</div>
                <div class="signatory-box-title">Pihak Kedinasan (Pengawas &amp; Kadisdik)</div>
              </div>
              <div class="form-group">
                <label class="form-label">Nama Pengawas Pembina</label>
                <input type="text" class="form-control" value="${g.pengawasNama || ''}" oninput="window.simRkt.updateGeneral('pengawasNama', this.value)">
              </div>
              <div class="form-group" style="margin-top: 0.5rem;">
                <label class="form-label">NIP Pengawas Pembina</label>
                <input type="text" class="form-control" value="${g.pengawasNip || ''}" oninput="window.simRkt.updateGeneral('pengawasNip', this.value)">
              </div>
              <div class="form-group" style="margin-top: 0.5rem;">
                <label class="form-label">Nama Kepala Dinas Dikbud Kab. Tegal</label>
                <input type="text" class="form-control" value="${g.kadisdikNama || ''}" oninput="window.simRkt.updateGeneral('kadisdikNama', this.value)">
              </div>
              <div class="form-group" style="margin-top: 0.5rem;">
                <label class="form-label">NIP Kepala Dinas Dikbud</label>
                <input type="text" class="form-control" value="${g.kadisdikNip || ''}" oninput="window.simRkt.updateGeneral('kadisdikNip', this.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 2: BAB I PENDAHULUAN
  // -------------------------------------------------------------------------
  renderTabBab1: function (container, rktData, controller) {
    const rkt = rktData || (controller ? controller.rktData : (window.simRkt ? window.simRkt.rktData : {}));
    const b1 = rkt.bab1 || {};
    container.innerHTML = this.getPbdHeroBannerHtml(rkt) + `
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill">BAB I &bull; PENDAHULUAN</span>
            <h3 class="section-title-modern">📜 Latar Belakang Perencanaan Berbasis Data (PBD)</h3>
            <p class="section-desc-modern">Uraian dasar filosofis, regulasi Kurikulum Merdeka, dan siklus Identifikasi, Refleksi, Benahi Perencanaan, dan Benahi Pelaksanaan (IRBB).</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="form-group">
            <label class="form-label">Teks Narasi Latar Belakang</label>
            <textarea class="form-control" rows="8" oninput="window.simRkt.updateBab1('latarBelakang', this.value)">${b1.latarBelakang || ''}</textarea>
          </div>
        </div>
      </div>

      <!-- LANDASAN HUKUM (DYNAMIC LIST PER BUTIR PERATURAN) -->
      ${window.SIM_UI ? window.SIM_UI.sectionCard({
        badge: 'REGULASI TERBARU',
        badgeColor: 'amber',
        title: '⚖️ Landasan Hukum (Permendikdasmen 2025 / 2026)',
        description: 'Daftar peraturan perundang-undangan pendidikan nasional terbaru yang memayungi pelaksanaan RKT dan pengelolaan BOSP.',
        content: window.SIM_UI.dynamicList({
          id: 'landasan-hukum-list',
          title: 'Daftar Peraturan Perundang-undangan',
          badgeText: `${(b1.landasanHukum || []).length} Regulasi`,
          badgeColor: 'amber',
          items: b1.landasanHukum || [],
          placeholder: 'Tulis nama dan nomor peraturan perundang-undangan...',
          addButtonText: 'Tambah Peraturan',
          onUpdateItem: (idx) => `window.simRkt.updateListItem('bab1', 'landasanHukum', ${idx}, this.value)`,
          onAddItem: `window.simRkt.addListItem('bab1', 'landasanHukum')`,
          onRemoveItem: (idx) => `window.simRkt.removeListItem('bab1', 'landasanHukum', ${idx})`
        })
      }) : ''}

      <!-- TUJUAN RKT (UMUM & KHUSUS PER BUTIR) -->
      ${window.SIM_UI ? window.SIM_UI.sectionCard({
        badge: 'TUJUAN RKT',
        badgeColor: 'green',
        title: '🎯 Tujuan Umum &amp; Tujuan Khusus',
        description: 'Arah sasaran strategis sekolah dalam peningkatan literasi, numerasi, dan mutu karakter.',
        content: `
          ${window.SIM_UI.formGroup({
            label: 'Tujuan Umum Satuan Pendidikan',
            content: window.SIM_UI.textarea({
              rows: 2,
              value: b1.tujuanUmum || '',
              placeholder: 'Tuliskan uraian naratif tujuan umum sekolah...',
              onInput: "window.simRkt.updateBab1('tujuanUmum', this.value)"
            })
          })}
          ${window.SIM_UI.dynamicList({
            id: 'tujuan-khusus-list',
            title: '🎯 Butir-butir Tujuan Khusus Satuan Pendidikan',
            badgeText: `${(b1.tujuanKhusus || []).length} Butir Tujuan`,
            badgeColor: 'green',
            items: b1.tujuanKhusus || [],
            placeholder: 'Tuliskan butir tujuan khusus sekolah...',
            addButtonText: 'Tambah Tujuan Khusus',
            onUpdateItem: (idx) => `window.simRkt.updateListItem('bab1', 'tujuanKhusus', ${idx}, this.value)`,
            onAddItem: `window.simRkt.addListItem('bab1', 'tujuanKhusus')`,
            onRemoveItem: (idx) => `window.simRkt.removeListItem('bab1', 'tujuanKhusus', ${idx})`
          })}
        `
      }) : ''}
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 3: BAB II PROFIL SEKOLAH
  // -------------------------------------------------------------------------
  renderTabBab2: function (container, rktData, controller) {
    const rkt = rktData || (controller ? controller.rktData : (window.simRkt ? window.simRkt.rktData : {}));
    const b2 = rkt.bab2 || {};
    container.innerHTML = this.getPbdHeroBannerHtml(rkt) + `
      ${window.SIM_UI ? window.SIM_UI.sectionCard({
        badge: 'BAB II • PROFIL SATUAN PENDIDIKAN',
        badgeColor: 'blue',
        title: '🌟 Visi, Misi, dan Tujuan Sekolah',
        description: 'Cita-cita luhur dan panduan operasional pendidikan di SDN Kalisalak 01.',
        content: `
          ${window.SIM_UI.formGroup({
            label: '🌟 Visi Sekolah',
            content: window.SIM_UI.input({
              value: b2.visi || '',
              placeholder: 'Tuliskan visi sekolah...',
              onInput: "window.simRkt.updateBab2('visi', this.value)"
            })
          })}
          ${window.SIM_UI.dynamicList({
            id: 'misi-sekolah-list',
            title: '🎯 Butir Misi Satuan Pendidikan',
            badgeText: `${(b2.misi || []).length} Butir Misi`,
            badgeColor: 'blue',
            items: b2.misi || [],
            placeholder: 'Tuliskan butir misi sekolah...',
            addButtonText: 'Tambah Butir Misi',
            onUpdateItem: (idx) => `window.simRkt.updateListItem('bab2', 'misi', ${idx}, this.value)`,
            onAddItem: `window.simRkt.addListItem('bab2', 'misi')`,
            onRemoveItem: (idx) => `window.simRkt.removeListItem('bab2', 'misi', ${idx})`
          })}
          ${window.SIM_UI.dynamicList({
            id: 'tujuan-sekolah-list',
            title: '🏆 Butir Tujuan Satuan Pendidikan',
            badgeText: `${(b2.tujuan || []).length} Butir Tujuan`,
            badgeColor: 'green',
            items: b2.tujuan || [],
            placeholder: 'Tuliskan butir tujuan sekolah...',
            addButtonText: 'Tambah Butir Tujuan',
            onUpdateItem: (idx) => `window.simRkt.updateListItem('bab2', 'tujuan', ${idx}, this.value)`,
            onAddItem: `window.simRkt.addListItem('bab2', 'tujuan')`,
            onRemoveItem: (idx) => `window.simRkt.removeListItem('bab2', 'tujuan', ${idx})`
          })}
        `
      }) : ''}

      <!-- TABEL 2.1: DATA MURID -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div class="section-header-left">
            <span class="section-badge-pill">TABEL 2.1</span>
            <h3 class="section-title-modern">👥 Keadaan Peserta Didik &amp; Rombel</h3>
            <p class="section-desc-modern">Data riil siswa per kelas tahun ajaran 2026/2027 (Terhubung otomatis dengan Database Master).</p>
          </div>
          <button type="button" class="btn btn-sm btn-outline" style="border-color: #3b82f6; color: #1d4ed8; font-weight: 700;" onclick="window.simRkt.recalcMurid()">🔄 Hitung Ulang Total</button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.82rem;">
              <thead>
                <tr>
                  <th style="width: 45px;" class="cell-center">No</th>
                  <th>Tingkat Kelas</th>
                  <th style="width: 100px;" class="cell-center">Jml Rombel</th>
                  <th style="width: 120px;" class="cell-center">Laki-Laki</th>
                  <th style="width: 120px;" class="cell-center">Perempuan</th>
                  <th style="width: 120px;" class="cell-center">Total Siswa</th>
                </tr>
              </thead>
              <tbody>
                ${(b2.dataMurid || []).map((m, idx) => `
                  <tr>
                    <td class="cell-center">${idx + 1}</td>
                    <td><strong>${m.kelas}</strong></td>
                    <td class="cell-center"><input type="number" class="murid-cell-input" value="${m.rombel}" min="1" onchange="window.simRkt.updateMuridCell(${idx}, 'rombel', this.value)"></td>
                    <td class="cell-center"><input type="number" class="murid-cell-input" value="${m.laki}" min="0" onchange="window.simRkt.updateMuridCell(${idx}, 'laki', this.value)"></td>
                    <td class="cell-center"><input type="number" class="murid-cell-input" value="${m.perempuan}" min="0" onchange="window.simRkt.updateMuridCell(${idx}, 'perempuan', this.value)"></td>
                    <td class="cell-center" style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">${m.total}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background: #f1f5f9; font-weight: 700;">
                  <td colspan="2" class="cell-center">JUMLAH KESELURUHAN</td>
                  <td class="cell-center">${(b2.dataMurid || []).reduce((a, b) => a + (parseInt(b.rombel) || 0), 0)} Rombel</td>
                  <td class="cell-center">${(b2.dataMurid || []).reduce((a, b) => a + (parseInt(b.laki) || 0), 0)}</td>
                  <td class="cell-center">${(b2.dataMurid || []).reduce((a, b) => a + (parseInt(b.perempuan) || 0), 0)}</td>
                  <td class="cell-center" style="color: var(--accent); font-size: 0.95rem;">${(b2.dataMurid || []).reduce((a, b) => a + (parseInt(b.total) || 0), 0)} Murid</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- TABEL 2.2: PERKIRAAN DANA BOS -->
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #ecfdf5; color: #047857; border-color: #a7f3d0;">TABEL 2.2</span>
            <h3 class="section-title-modern">💰 Perkiraan Dana Bantuan Operasional Satuan Pendidikan (BOSP) 2027</h3>
            <p class="section-desc-modern">Kalkulasi pagu otomatis: Total Murid × Tarif BOSP Jenjang SD (Rp900.000 / murid / tahun).</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="input-row-3" style="margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Tarif BOSP per Siswa (Rp)</label>
              <input type="number" class="form-control" value="${b2.danaBos.tarifPerSiswa || 900000}" onchange="window.simRkt.updateTarifBos(this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Total Murid Terdaftar</label>
              <input type="text" class="form-control" value="${b2.danaBos.totalSiswa || 150} Siswa" readonly style="background: #f8fafc; font-weight: 700;">
            </div>
            <div class="form-group">
              <label class="form-label">Total Estimasi Pagu BOS 2027</label>
              <input type="text" class="form-control" value="Rp ${(b2.danaBos.totalPagu || 0).toLocaleString('id-ID')}" readonly style="background: #ecfdf5; color: #047857; font-weight: 800;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">TRIWULAN I (30%)</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem;">Rp ${(b2.danaBos.tw1 || 0).toLocaleString('id-ID')}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">TRIWULAN II (40%)</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem;">Rp ${(b2.danaBos.tw2 || 0).toLocaleString('id-ID')}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">TRIWULAN III (Reguler)</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-secondary); margin-top: 0.25rem;">Rp ${(b2.danaBos.tw3 || 0).toLocaleString('id-ID')}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">TRIWULAN IV (30%)</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem;">Rp ${(b2.danaBos.tw4 || 0).toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABEL 2.3: SARPRAS -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill">TABEL 2.3</span>
            <h3 class="section-title-modern">🏢 Profil Sarana dan Prasarana Sekolah</h3>
            <p class="section-desc-modern">Kondisi fasilitas fisik, ruang belajar, dan sarana penunjang pembelajaran.</p>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addSarprasRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah Sarpras
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th style="width: 45px;" class="cell-center">No</th>
                  <th>Jenis Sarana / Prasarana</th>
                  <th style="width: 90px;" class="cell-center">Jumlah</th>
                  <th style="width: 110px;" class="cell-center">Kondisi Baik</th>
                  <th style="width: 110px;" class="cell-center">Rusak Ringan</th>
                  <th style="width: 110px;" class="cell-center">Rusak Berat</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b2.sarpras || []).map((sp, idx) => `
                  <tr>
                    <td class="cell-center">${idx + 1}</td>
                    <td><input type="text" class="form-control cell-input" style="font-weight: 700;" value="${sp.jenis || ''}" placeholder="Nama sarana/prasarana..." onchange="window.simRkt.updateSarprasCell(${idx}, 'jenis', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${sp.jumlah}" onchange="window.simRkt.updateSarprasCell(${idx}, 'jumlah', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${sp.baik}" onchange="window.simRkt.updateSarprasCell(${idx}, 'baik', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${sp.rusakRingan}" onchange="window.simRkt.updateSarprasCell(${idx}, 'rusakRingan', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${sp.rusakBerat}" onchange="window.simRkt.updateSarprasCell(${idx}, 'rusakBerat', this.value)"></td>
                    <td class="cell-center">
                      <button type="button" class="btn-delete-row" title="Hapus Data Sarpras" onclick="window.simRkt.deleteSarprasRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 4: BAB III EVALUASI DIRI SEKOLAH & RAPOR PBD
  // -------------------------------------------------------------------------
  renderTabBab3: function (container, rktData, controller) {
    const rkt = rktData || (controller ? controller.rktData : (window.simRkt ? window.simRkt.rktData : {}));
    const b3 = rkt.bab3 || {};
    container.innerHTML = this.getPbdHeroBannerHtml(rkt) + `
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill">BAB III &bull; EVALUASI DIRI SEKOLAH</span>
            <h3 class="section-title-modern">📊 Evaluasi Diri Sekolah Internal &amp; Rekapitulasi (Tabel 3.1)</h3>
            <p class="section-desc-modern">Penilaian mandiri satuan pendidikan pada dimensi manajemen, proses KBM, dan capaian siswa.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="form-group">
            <label class="form-label"><strong>Pengantar Evaluasi Diri Sekolah (EDS)</strong></label>
            <textarea class="form-control" rows="2" oninput="window.simRkt.updateBab3('pengantarEds', this.value)">${b3.pengantarEds || ''}</textarea>
          </div>
          <div class="form-group" style="margin-top: 0.75rem;">
            <label class="form-label"><strong>1. Kualitas Pengelolaan Satuan Pendidikan</strong></label>
            <textarea class="form-control" rows="3" oninput="window.simRkt.updateBab3('narasiPengelolaan', this.value)">${b3.narasiPengelolaan || ''}</textarea>
          </div>
          <div class="form-group" style="margin-top: 0.75rem;">
            <label class="form-label"><strong>2. Proses Pembelajaran</strong></label>
            <textarea class="form-control" rows="3" oninput="window.simRkt.updateBab3('narasiPembelajaran', this.value)">${b3.narasiPembelajaran || ''}</textarea>
          </div>
          <div class="form-group" style="margin-top: 0.75rem;">
            <label class="form-label"><strong>3. Hasil Belajar Murid</strong></label>
            <textarea class="form-control" rows="3" oninput="window.simRkt.updateBab3('narasiHasilBelajar', this.value)">${b3.narasiHasilBelajar || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin: 1.25rem 0 0.5rem 0; flex-wrap: wrap; gap: 0.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--primary); margin: 0;">Tabel 3.1 Rekapitulasi Hasil Evaluasi Diri Sekolah</h4>
            <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addEdsRow()" style="display: flex; align-items: center; gap: 4px;">
              <span>➕</span> Tambah Aspek EDS
            </button>
          </div>
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.82rem;">
              <thead>
                <tr>
                  <th style="width: 50px;" class="cell-center">No</th>
                  <th>Aspek Evaluasi Mutu</th>
                  <th style="width: 140px;" class="cell-center">Persentase</th>
                  <th style="width: 140px;" class="cell-center">Kategori</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b3.eds || []).map((e, idx) => `
                  <tr ${idx === (b3.eds.length - 1) ? 'style="font-weight: 700; background: #f8fafc;"' : ''}>
                    <td class="cell-center">${e.no}</td>
                    <td><input type="text" class="form-control cell-input" value="${e.aspek || ''}" placeholder="Aspek mutu..." onchange="window.simRkt.updateEdsCell(${idx}, 'aspek', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${e.persentase}" onchange="window.simRkt.updateEdsCell(${idx}, 'persentase', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${e.kategori}" onchange="window.simRkt.updateEdsCell(${idx}, 'kategori', this.value)"></td>
                    <td class="cell-center">
                      <button type="button" class="btn-delete-row" title="Hapus Aspek EDS" onclick="window.simRkt.deleteEdsRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="form-group" style="margin-top: 1.25rem;">
            <label class="form-label"><strong>Kesimpulan Hasil Evaluasi Diri Sekolah</strong></label>
            <textarea class="form-control" rows="3" oninput="window.simRkt.updateBab3('kesimpulanEds', this.value)">${b3.kesimpulanEds || ''}</textarea>
          </div>

          <div style="margin-top: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <label class="form-label" style="margin-bottom: 0;"><strong>Prioritas Peningkatan Mutu Berdasarkan EDS (5 Butir)</strong></label>
              <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addPrioritasMutu()" style="display: flex; align-items: center; gap: 4px;">
                <span>➕</span> Tambah Butir Prioritas
              </button>
            </div>
            <div id="prioritas-mutu-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${(b3.prioritasMutu || []).map((pm, idx) => `
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: 700; width: 24px; text-align: center; color: var(--primary);">${idx + 1}.</span>
                  <input type="text" class="form-control cell-input" value="${pm || ''}" onchange="window.simRkt.updatePrioritasMutu(${idx}, this.value)" style="flex: 1;" placeholder="Butir prioritas peningkatan mutu...">
                  <button type="button" class="btn-delete-row" title="Hapus Butir" onclick="window.simRkt.deletePrioritasMutu(${idx})">🗑️</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- TABEL 3.2: ANALISIS RAPOR PBD -->
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;">TABEL 3.2</span>
            <h3 class="section-title-modern">📈 Analisis Laporan Rapor Pendidikan (Dimensi A s.d. E)</h3>
            <p class="section-desc-modern">Data capaian mutu resmi platform Rapor Pendidikan Kemendikdasmen RI.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.78rem;">
              <thead>
                <tr>
                  <th style="width: 45px;" class="cell-center">No</th>
                  <th style="width: 150px;">Indikator Dimensi</th>
                  <th style="width: 160px;">Capaian Mutu</th>
                  <th>Skor Tertinggi / Indikator Unggul</th>
                  <th>Skor Terendah / Titik Lemah</th>
                  <th style="width: 75px;" class="cell-center">Skor Lalu</th>
                  <th style="width: 75px;" class="cell-center">Skor Kini</th>
                  <th style="width: 95px;" class="cell-center">Tren</th>
                </tr>
              </thead>
              <tbody>
                ${(b3.raporPbd || []).map((rp, idx) => `
                  <tr>
                    <td class="cell-center"><strong>${rp.no}</strong></td>
                    <td><strong>${rp.indikator}</strong></td>
                    <td><span class="badge ${rp.capaian.toLowerCase().includes('baik') ? 'badge-completed' : (rp.capaian.toLowerCase().includes('kurang') ? 'badge-failed' : 'badge-draft')}" style="padding: 2px 7px; border-radius: 4px; font-weight: 700;">${rp.capaian}</span></td>
                    <td>${rp.skorTertinggi}</td>
                    <td>${rp.skorTerendah}</td>
                    <td class="cell-center">${rp.skorLalu}</td>
                    <td class="cell-center" style="font-weight: 800; color: var(--primary);">${rp.skorIni}</td>
                    <td class="cell-center"><span class="badge ${rp.trend.toLowerCase().includes('turun') ? 'badge-draft' : 'badge-completed'}">${rp.trend}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TABEL 3.3: EVALUASI RKT TAHUN LALU -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #fef3c7; color: #b45309; border-color: #fde68a;">TABEL 3.3 &bull; EVALUASI RKT LALU</span>
            <h3 class="section-title-modern">🔄 Evaluasi Ketercapaian RKT Tahun Lalu</h3>
            <p class="section-desc-modern">Penilaian pelaksanaan program kerja tahun anggaran sebelumnya dan tindak lanjut pembenahan.</p>
          </div>
          <button type="button" class="btn btn-sm btn-primary" onclick="window.simRkt.addEvaluasiRktRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah Program Evaluasi
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th style="width: 40px;" class="cell-center">No</th>
                  <th style="width: 230px;">Nama Program &amp; Standar (SNP)</th>
                  <th>Hasil Evaluasi Pelaksanaan</th>
                  <th>Tindak Lanjut Pembenahan</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b3.evaluasiRktLalu || []).map((ev, idx) => `
                  <tr>
                    <td class="cell-center"><strong>${idx + 1}</strong></td>
                    <td>
                      <input type="text" class="form-control cell-input" style="font-weight: 700; margin-bottom: 4px;" value="${ev.program || ''}" placeholder="Nama Program..." onchange="window.simRkt.updateEvaluasiRktCell(${idx}, 'program', this.value)">
                      <input type="text" class="form-control cell-input" style="font-size: 0.75rem; color: #555;" value="${ev.snp || ''}" placeholder="Standar Nasional (SNP)..." onchange="window.simRkt.updateEvaluasiRktCell(${idx}, 'snp', this.value)">
                    </td>
                    <td>
                      <textarea class="form-control cell-input" rows="2" placeholder="Hasil evaluasi keterlaksanaan..." onchange="window.simRkt.updateEvaluasiRktCell(${idx}, 'hasilEvaluasi', this.value)">${ev.hasilEvaluasi || ev.keterlaksanaan || ''}</textarea>
                    </td>
                    <td>
                      <textarea class="form-control cell-input" rows="2" placeholder="Tindak lanjut pembenahan..." onchange="window.simRkt.updateEvaluasiRktCell(${idx}, 'tindakLanjut', this.value)">${ev.tindakLanjut || ''}</textarea>
                    </td>
                    <td class="cell-center">
                      <button type="button" class="btn-delete-row" title="Hapus Baris Evaluasi" onclick="window.simRkt.deleteEvaluasiRktRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TABEL 3.4: PRIORITAS PBD -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #fef2f2; color: #b91c1c; border-color: #fecaca;">TABEL 3.4 &bull; REKOMENDASI PRIORITAS</span>
            <h3 class="section-title-modern">⚡ Analisis Prioritas Rekomendasi PBD</h3>
            <p class="section-desc-modern">Pemetaan Akar Masalah dan Inspirasi Benahi yang menjadi dasar kegiatan ARKAS.</p>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addPrioritasPbdRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah Rekomendasi
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th style="width: 140px;">Identifikasi Mutu</th>
                  <th style="width: 150px;">Akar Masalah</th>
                  <th style="width: 170px;">Kegiatan Benahi</th>
                  <th>Inspirasi Implementasi Benahi</th>
                  <th style="width: 170px;">Kegiatan ARKAS</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b3.prioritasPbd || []).map((pr, idx) => `
                  <tr>
                    <td>
                      <input type="text" class="form-control cell-input" style="font-weight: 700; margin-bottom: 3px;" value="${pr.identifikasi || ''}" onchange="window.simRkt.updatePrioritasPbdCell(${idx}, 'identifikasi', this.value)">
                      <input type="text" class="form-control cell-input" style="font-size: 0.72rem;" value="${pr.capaian || ''}" placeholder="Capaian..." onchange="window.simRkt.updatePrioritasPbdCell(${idx}, 'capaian', this.value)">
                    </td>
                    <td>
                      <textarea class="form-control cell-input" rows="2" onchange="window.simRkt.updatePrioritasPbdCell(${idx}, 'akarMasalah', this.value)">${pr.akarMasalah || ''}</textarea>
                    </td>
                    <td>
                      <textarea class="form-control cell-input" rows="2" style="font-weight: 600; color: #047857;" onchange="window.simRkt.updatePrioritasPbdCell(${idx}, 'kegiatanBenahi', this.value)">${pr.kegiatanBenahi || ''}</textarea>
                    </td>
                    <td>
                      <textarea class="form-control cell-input" rows="2" onchange="window.simRkt.updatePrioritasPbdCell(${idx}, 'inspirasi', this.value)">${pr.inspirasi || ''}</textarea>
                    </td>
                    <td>
                      <textarea class="form-control cell-input" rows="2" style="font-weight: 700; color: var(--primary);" onchange="window.simRkt.updatePrioritasPbdCell(${idx}, 'kegiatanArkas', this.value)">${pr.kegiatanArkas || ''}</textarea>
                    </td>
                    <td class="cell-center">
                      <button type="button" class="btn-delete-row" title="Hapus Baris Rekomendasi" onclick="window.simRkt.deletePrioritasPbdRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 5: BAB IV LEMBAR KERJA RKT 2027
  // -------------------------------------------------------------------------
  renderTabBab4: function (container, rktData, controller) {
    const rkt = rktData || (controller ? controller.rktData : (window.simRkt ? window.simRkt.rktData : {}));
    const b4 = rkt.bab4 || {};
    container.innerHTML = this.getPbdHeroBannerHtml(rkt) + `
      <!-- TABEL 4.1: TARGET KINERJA -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill">TABEL 4.1 &bull; 8 SNP</span>
            <h3 class="section-title-modern">🎯 Target Capaian Kinerja Tahun 2027 (8 Standar Nasional Pendidikan)</h3>
            <p class="section-desc-modern">Target kuantitatif dan kualitatif yang terukur untuk setiap Standar Nasional Pendidikan.</p>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addTargetKinerjaRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah Target SNP
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table table-target-kinerja" style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th style="width: 45px;" class="cell-center">No</th>
                  <th style="width: 220px;">Standar Nasional Pendidikan (SNP)</th>
                  <th>Target Kinerja Umum</th>
                  <th>Target Terukur (Indikator Kunci)</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b4.targetKinerja || []).map((tk, idx) => `
                  <tr>
                    <td class="cell-center" style="vertical-align: middle;">${idx + 1}</td>
                    <td><input type="text" class="form-control cell-input" style="font-weight: 700; height: 48px; padding: 6px 10px; font-size: 13px;" value="${tk.snp || ''}" placeholder="Standar SNP..." onchange="window.simRkt.updateTargetKinerjaCell(${idx}, 'snp', this.value)"></td>
                    <td><textarea class="form-control cell-input auto-resize-input" rows="2" style="min-height: 48px; padding: 6px 10px; font-size: 13px;" placeholder="Target kinerja umum..." oninput="window.simRkt.autoResizeTextarea(this)" onchange="window.simRkt.updateTargetKinerjaCell(${idx}, 'target', this.value)">${tk.target}</textarea></td>
                    <td><textarea class="form-control cell-input auto-resize-input" rows="2" style="min-height: 48px; padding: 6px 10px; font-size: 13px;" placeholder="Target terukur..." oninput="window.simRkt.autoResizeTextarea(this)" onchange="window.simRkt.updateTargetKinerjaCell(${idx}, 'targetTerukur', this.value)">${tk.targetTerukur}</textarea></td>
                    <td class="cell-center" style="vertical-align: middle;">
                      <button type="button" class="btn-delete-row" title="Hapus Target Kinerja" onclick="window.simRkt.deleteTargetKinerjaRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TABEL 4.2: RENCANA KEGIATAN PBD -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;">TABEL 4.2 &bull; SIKLUS PBD</span>
            <h3 class="section-title-modern">📋 Rencana Kegiatan PBD (Identifikasi, Akar Masalah &amp; Benahi)</h3>
            <p class="section-desc-modern">Penerjemahan rekomendasi profil rapor pendidikan ke dalam agenda intervensi konkret sekolah.</p>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addRencanaPbdRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah Kegiatan PBD
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.78rem;">
              <thead>
                <tr>
                  <th style="width: 40px;" class="cell-center">No</th>
                  <th style="width: 150px;">Identifikasi Indikator</th>
                  <th style="width: 160px;">Akar Masalah</th>
                  <th style="width: 180px;">Kegiatan Benahi</th>
                  <th>Penjelasan Implementasi Kegiatan</th>
                  <th style="width: 85px;" class="cell-center">Biaya?</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b4.rencanaPbd || []).map((rp, idx) => `
                  <tr>
                    <td class="cell-center" style="vertical-align: middle;">${idx + 1}</td>
                    <td><input type="text" class="form-control cell-input" style="font-weight: 700; height: 48px; padding: 6px 10px; font-size: 13px;" value="${rp.identifikasi || ''}" onchange="window.simRkt.updateRencanaPbdCell(${idx}, 'identifikasi', this.value)"></td>
                    <td><textarea class="form-control cell-input auto-resize-input" rows="2" style="min-height: 48px; padding: 6px 10px; font-size: 13px;" oninput="window.simRkt.autoResizeTextarea(this)" onchange="window.simRkt.updateRencanaPbdCell(${idx}, 'akarMasalah', this.value)">${rp.akarMasalah || ''}</textarea></td>
                    <td><textarea class="form-control cell-input auto-resize-input" rows="2" style="min-height: 48px; padding: 6px 10px; font-size: 13px; font-weight: 600; color: #047857;" oninput="window.simRkt.autoResizeTextarea(this)" onchange="window.simRkt.updateRencanaPbdCell(${idx}, 'kegiatanBenahi', this.value)">${rp.kegiatanBenahi || ''}</textarea></td>
                    <td><textarea class="form-control cell-input auto-resize-input" rows="2" style="min-height: 48px; padding: 6px 10px; font-size: 13px;" oninput="window.simRkt.autoResizeTextarea(this)" onchange="window.simRkt.updateRencanaPbdCell(${idx}, 'implementasi', this.value)">${rp.implementasi || ''}</textarea></td>
                    <td class="cell-center" style="vertical-align: middle;">
                      <select class="form-control cell-input" style="height: 48px; font-size: 13px;" onchange="window.simRkt.updateRencanaPbdCell(${idx}, 'butuhBiaya', this.value)">
                        <option value="Ya" ${rp.butuhBiaya === 'Ya' ? 'selected' : ''}>Ya</option>
                        <option value="Tidak" ${rp.butuhBiaya === 'Tidak' ? 'selected' : ''}>Tidak</option>
                      </select>
                    </td>
                    <td class="cell-center" style="vertical-align: middle;">
                      <button type="button" class="btn-delete-row" title="Hapus Kegiatan PBD" onclick="window.simRkt.deleteRencanaPbdRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TABEL 4.3: RENCANA KERJA ARKAS (STANDAR REUSABLE COMPONENT) -->
      ${window.SIM_UI ? window.SIM_UI.sectionCard({
        badge: 'TABEL 4.3 • ANGGARAN BOSP',
        badgeColor: 'green',
        title: '💳 Rencana Kerja ARKAS PBD (Rincian Anggaran Barang &amp; Jasa)',
        description: 'Rincian belanja barang, jasa, dan modal pendukung PBD yang masuk dalam sistem aplikasi ARKAS 4 Kemendikdasmen.',
        actions: [
          window.SIM_UI.button({
            text: 'Tambah Belanja ARKAS',
            icon: 'plus',
            variant: 'primary',
            size: 'sm',
            onClick: 'window.simRkt.addArkasRow()'
          })
        ],
        content: window.SIM_UI.table({
          id: 'table-rencana-arkas',
          columns: [
            { key: 'no', label: 'No', width: '38px', align: 'center', type: 'number-badge' },
            { key: 'kegiatanArkas', label: 'Kegiatan ARKAS', width: '180px', bold: true },
            { key: 'uraian', label: 'Rincian Uraian Belanja', type: 'input-text', onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'uraian', this.value)` },
            { key: 'bulan', label: 'Bulan', width: '125px', type: 'input-text', onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'bulan', this.value)` },
            { key: 'jumlah', label: 'Jml', width: '60px', align: 'center', type: 'input-number', min: 1, onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'jumlah', this.value)` },
            { key: 'satuan', label: 'Satuan', width: '120px', align: 'center', type: 'select', options: window.SIM_UI.presets.arkasSatuan, onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'satuan', this.value)` },
            { key: 'hargaSatuan', label: 'Harga Satuan', width: '125px', align: 'right', type: 'currency-input', onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'hargaSatuan', this.value)` },
            { key: 'total', label: 'Total (Rp)', width: '125px', align: 'center', type: 'readonly-currency' },
            { key: 'actions', label: 'Aksi', width: '42px', align: 'center', type: 'delete', onDelete: (idx) => `window.simRkt.deleteArkasRow(${idx})` }
          ],
          data: b4.rencanaArkas || []
        })
      }) : ''}

      <!-- TABEL 4.4: RKT 8 SNP -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #fdf4ff; color: #a21caf; border-color: #f0abfc;">TABEL 4.4 &bull; INTEGRASI 8 SNP</span>
            <h3 class="section-title-modern">🏛️ Tabel Rencana Kerja Tahunan (RKT) Berdasarkan 8 SNP</h3>
            <p class="section-desc-modern">Memuat seluruh program PBD, Rutin, dan Insidental yang dilaksanakan sekolah dalam 1 tahun anggaran.</p>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.simRkt.addRkt8SnpRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah RKT 8 SNP
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.78rem;">
              <thead>
                <tr>
                  <th style="width: 35px;" class="cell-center">No</th>
                  <th style="width: 150px;">Standar Nasional (SNP)</th>
                  <th style="width: 150px;">Program / Identifikasi</th>
                  <th>Kegiatan Utama &amp; Sub-Aktivitas</th>
                  <th style="width: 90px;" class="cell-center">Kategori</th>
                  <th style="width: 110px;">Sumber Dana</th>
                  <th style="width: 90px;" class="cell-center">Bulan</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b4.rkt8Snp || []).map((rk, idx) => `
                  <tr>
                    <td class="cell-center">${idx + 1}</td>
                    <td><input type="text" class="form-control cell-input" style="font-weight: 700;" value="${rk.snp || ''}" onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'snp', this.value)"></td>
                    <td><input type="text" class="form-control cell-input" value="${rk.program || ''}" onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'program', this.value)"></td>
                    <td>
                      <input type="text" class="form-control cell-input" style="font-weight: 700; margin-bottom: 2px;" value="${rk.kegiatanUtama || ''}" placeholder="Kegiatan Utama..." onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'kegiatanUtama', this.value)">
                      <input type="text" class="form-control cell-input" style="font-size: 0.72rem;" value="${rk.subKegiatan || ''}" placeholder="Sub Aktivitas..." onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'subKegiatan', this.value)">
                    </td>
                    <td class="cell-center">
                      <select class="form-control cell-input" onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'jenis', this.value)">
                        <option value="PBD" ${rk.jenis === 'PBD' ? 'selected' : ''}>PBD</option>
                        <option value="Rutin" ${rk.jenis === 'Rutin' ? 'selected' : ''}>Rutin</option>
                        <option value="Insidental" ${rk.jenis === 'Insidental' ? 'selected' : ''}>Insidental</option>
                      </select>
                    </td>
                    <td><input type="text" class="form-control cell-input" value="${rk.sumberDana || 'BOS Reguler'}" onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'sumberDana', this.value)"></td>
                    <td class="cell-center"><input type="text" class="form-control cell-input cell-center" value="${rk.bulan || ''}" onchange="window.simRkt.updateRkt8SnpCell(${idx}, 'bulan', this.value)"></td>
                    <td class="cell-center">
                      <button type="button" class="btn-delete-row" title="Hapus Baris RKT SNP" onclick="window.simRkt.deleteRkt8SnpRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TABEL 4.5: PROGRAM KERJA STRATEGIS DAN JADWAL -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">TABEL 4.5 &bull; STRATEGIS &amp; JADWAL</span>
            <h3 class="section-title-modern">📅 Program Kerja Strategis dan Jadwal Pelaksanaan (Tabel 4.5)</h3>
            <p class="section-desc-modern">Penjadwalan program kerja strategis, target capaian, waktu, dan penanggung jawab kegiatan.</p>
          </div>
          <button type="button" class="btn btn-sm btn-primary" onclick="window.simRkt.addJadwalStrategisRow()" style="display: flex; align-items: center; gap: 4px;">
            <span>➕</span> Tambah Program Strategis
          </button>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th style="width: 38px;" class="cell-center">No</th>
                  <th style="width: 140px;">Sasaran Indikator</th>
                  <th style="width: 160px;">Program Utama</th>
                  <th>Kegiatan &amp; Indikator Capaian</th>
                  <th style="width: 130px;" class="cell-center">Waktu</th>
                  <th style="width: 160px;">Penanggung Jawab</th>
                  <th style="width: 45px;" class="cell-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${(b4.jadwalStrategis || []).map((j, idx) => `
                  <tr>
                    <td class="cell-center"><strong>${idx + 1}</strong></td>
                    <td>
                      <input type="text" class="form-control cell-input" style="font-weight: 700;" value="${j.sasaran || ''}" placeholder="Sasaran Indikator..." onchange="window.simRkt.updateJadwalStrategisCell(${idx}, 'sasaran', this.value)">
                    </td>
                    <td>
                      <input type="text" class="form-control cell-input" value="${j.program || ''}" placeholder="Program Utama..." onchange="window.simRkt.updateJadwalStrategisCell(${idx}, 'program', this.value)">
                    </td>
                    <td>
                      <input type="text" class="form-control cell-input" style="font-weight: 700; margin-bottom: 3px;" value="${j.kegiatan || ''}" placeholder="Kegiatan..." onchange="window.simRkt.updateJadwalStrategisCell(${idx}, 'kegiatan', this.value)">
                      <input type="text" class="form-control cell-input" style="font-size: 0.75rem; color: #555;" value="${j.indikator || ''}" placeholder="Target Indikator Capaian..." onchange="window.simRkt.updateJadwalStrategisCell(${idx}, 'indikator', this.value)">
                    </td>
                    <td class="cell-center">
                      <input type="text" class="form-control cell-input cell-center" style="font-weight: 600;" value="${j.waktu || ''}" placeholder="Waktu Pelaksanaan..." onchange="window.simRkt.updateJadwalStrategisCell(${idx}, 'waktu', this.value)">
                    </td>
                    <td>
                      <input type="text" class="form-control cell-input" value="${j.penanggungJawab || ''}" placeholder="Penanggung Jawab..." onchange="window.simRkt.updateJadwalStrategisCell(${idx}, 'penanggungJawab', this.value)">
                    </td>
                    <td class="cell-center">
                      <button type="button" class="btn-delete-row" title="Hapus Baris Jadwal Strategis" onclick="window.simRkt.deleteJadwalStrategisRow(${idx})">🗑️</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 6: BAB V PENUTUP
  // -------------------------------------------------------------------------
  renderTabBab5: function (container, rktData, controller) {
    const rkt = rktData || (controller ? controller.rktData : (window.simRkt ? window.simRkt.rktData : {}));
    const b5 = rkt.bab5 || {};
    container.innerHTML = `
      <!-- SIMPULAN (NARASI PANJANG) -->
      ${window.SIM_UI ? window.SIM_UI.sectionCard({
        badge: 'BAB V • PENUTUP',
        badgeColor: 'blue',
        title: '📑 Simpulan Strategis RKT 2027',
        description: 'Rangkuman komitmen satuan pendidikan dalam menindaklanjuti rencana kerja berbasis data.',
        content: window.SIM_UI.formGroup({
          label: 'Teks Simpulan Akhir (Naratif)',
          content: window.SIM_UI.textarea({
            rows: 7,
            value: b5.simpulan || '',
            placeholder: 'Tuliskan uraian simpulan strategis RKT...',
            onInput: "window.simRkt.updateBab5('simpulan', this.value)"
          })
        })
      }) : ''}

      <!-- DAFTAR SARAN (DYNAMIC LIST PER BUTIR STAKEHOLDER) -->
      ${window.SIM_UI ? window.SIM_UI.sectionCard({
        badge: 'REKOMENDASI STAKEHOLDER',
        badgeColor: 'amber',
        title: '💡 Saran &amp; Rekomendasi Pemangku Kepentingan',
        description: 'Saran konstruktif untuk dinas pendidikan, komite sekolah, dan dewan guru demi kelancaran program.',
        content: window.SIM_UI.dynamicList({
          id: 'saran-stakeholder-list',
          title: 'Butir-butir Saran & Rekomendasi Pemangku Kepentingan',
          badgeText: `${(b5.saran || []).length} Butir Saran`,
          badgeColor: 'amber',
          items: b5.saran || [],
          placeholder: 'Tulis butir saran atau rekomendasi stakeholder...',
          addButtonText: 'Tambah Saran',
          onUpdateItem: (idx) => `window.simRkt.updateListItem('bab5', 'saran', ${idx}, this.value)`,
          onAddItem: `window.simRkt.addListItem('bab5', 'saran')`,
          onRemoveItem: (idx) => `window.simRkt.removeListItem('bab5', 'saran', ${idx})`
        })
      }) : ''}
    `;
  },

  // -------------------------------------------------------------------------
  // TAB 7: LAMPIRAN & SK TIM
  // -------------------------------------------------------------------------
  renderTabLampiran: function (container, rktData, controller) {
    const lamp = rkt.lampiran;
    const g = rkt.general;
    container.innerHTML = `
      <!-- LAMPIRAN 1: UNDANGAN, DAFTAR HADIR, NOTULEN -->
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill">LAMPIRAN 1</span>
            <h3 class="section-title-modern">✉️ Undangan, Daftar Hadir, dan Notulen Penyusunan RKT/ARKAS</h3>
            <p class="section-desc-modern">Dokumen bukti fisik rapat koordinasi penyusunan RKT & ARKAS bersama Komite Sekolah dan Dewan Guru.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
              <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">1. Surat Undangan Rapat</h4>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Nomor: 421.2 / 085 / 04.68 / 2026<br>Tanggal: 18 Desember 2026<br>Perihal: Rapat Koordinasi Penyusunan Draf RKT & ARKAS 2027</p>
              <div style="font-size: 0.75rem; color: var(--accent); font-weight: 600;">Status: Siap Cetak Kedinasan</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
              <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">2. Berita Acara Rapat</h4>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Hari/Tgl: Kamis, 22 Desember 2026<br>Tempat: Ruang Guru SDN Kalisalak 01<br>Hasil: Kesepakatan draf RKT & alokasi belanja BOSP secara aklamasi</p>
              <div style="font-size: 0.75rem; color: var(--accent); font-weight: 600;">Status: Diteken KS & Komite</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
              <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">3. Notulen Rapat Koordinasi</h4>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Pimpinan: Imamudin, S. Pd.SD<br>Notulis: Retno Amalia, S.Pd.<br>Catatan: Pembahasan 8 SNP, prioritas PBD, & RKAS BOSP 2027</p>
              <div style="font-size: 0.75rem; color: var(--accent); font-weight: 600;">Status: Format Baku Terlampir</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
              <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">4. Daftar Hadir Peserta</h4>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Jumlah: 11 Personel Lengkap<br>Unsur: KS, Komite, Guru Kelas I-VI, Guru Mapel, Tendik<br>Tanda Tangan: Format selang-seling kedinasan</p>
              <div style="font-size: 0.75rem; color: var(--accent); font-weight: 600;">Status: 100% Hadir Lengkap</div>
            </div>
          </div>
        </div>
      </div>

      <!-- LAMPIRAN 2: KALDIK -->
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;">LAMPIRAN 2</span>
            <h3 class="section-title-modern">📅 Kalender Pendidikan (Kaldik) TP 2026/2027</h3>
            <p class="section-desc-modern">Pedoman alokasi waktu dan agenda operasional akademik SD Negeri Kalisalak 01 Semester 1 &amp; 2.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive">
            <table class="grid-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th style="width: 40px;" class="cell-center">No</th>
                  <th style="width: 130px;">Semester</th>
                  <th style="width: 180px;">Bulan / Periode</th>
                  <th>Agenda Pokok Satuan Pendidikan</th>
                  <th style="width: 140px;" class="cell-center">Hari Efektif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="cell-center">1</td>
                  <td><strong>Semester 1 (Ganjil)</strong></td>
                  <td>Juli - Agustus 2026</td>
                  <td>Awal TP 2026/2027, MPLS Ramah Anak, HUT Kemerdekaan RI Ke-81, Asesmen Diagnostik Awal</td>
                  <td class="cell-center">36 Hari Belajar</td>
                </tr>
                <tr>
                  <td class="cell-center">2</td>
                  <td><strong>Semester 1 (Ganjil)</strong></td>
                  <td>September - Oktober 2026</td>
                  <td>Penilaian Tengah Semester (PTS), Pelaksanaan ANBK Utama SD Gelombang 1-2, Monev Kombel</td>
                  <td class="cell-center">48 Hari Belajar</td>
                </tr>
                <tr>
                  <td class="cell-center">3</td>
                  <td><strong>Semester 1 (Ganjil)</strong></td>
                  <td>November - Desember 2026</td>
                  <td>Penilaian Akhir Semester (PAS), Titimangsa Penyerahan Rapor Smt 1 (19 Des), Libur Smt 1</td>
                  <td class="cell-center">38 Hari Belajar</td>
                </tr>
                <tr>
                  <td class="cell-center">4</td>
                  <td><strong>Semester 2 (Genap)</strong></td>
                  <td>Januari - Februari 2027</td>
                  <td>Hari Pertama Masuk Semester Genap (4 Jan 2027), Kick-off Program Prioritas PBD Literasi-Numerasi</td>
                  <td class="cell-center">44 Hari Belajar</td>
                </tr>
                <tr>
                  <td class="cell-center">5</td>
                  <td><strong>Semester 2 (Genap)</strong></td>
                  <td>Maret - April 2027</td>
                  <td>Libur Awal Ramadhan 1448 H, PTS Genap, Libur Hari Raya Idul Fitri 1448 H &amp; Cuti Bersama</td>
                  <td class="cell-center">32 Hari Belajar</td>
                </tr>
                <tr>
                  <td class="cell-center">6</td>
                  <td><strong>Semester 2 (Genap)</strong></td>
                  <td>Mei - Juni 2027</td>
                  <td>Ujian Sekolah / PSAJ Kelas VI, PAT / SAS Kelas I-V, Penyerahan Rapor Kelulusan &amp; Libur Akhir TP</td>
                  <td class="cell-center">42 Hari Belajar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- LAMPIRAN 3: FOTO KEGIATAN -->
      <div class="rkt-section-card">
        <div class="section-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #fdf4ff; color: #a21caf; border-color: #f0abfc;">LAMPIRAN 3</span>
            <h3 class="section-title-modern">📸 Dokumentasi Foto Kegiatan Penyusunan RKT/ARKAS</h3>
            <p class="section-desc-modern">Dokumentasi visual tahapan musyawarah (Tersimpan offline &amp; otomatis tersinkron ke Cloudinary saat online).</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            ${(lamp.fotoKegiatan || []).map((foto, idx) => {
              const hasImg = !!(foto.dataUrl || foto.url);
              const imgSrc = foto.dataUrl || foto.url;
              return `
                <div style="border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden; background: #ffffff; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <div style="position: relative; height: 160px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${hasImg ? `
                      <img src="${imgSrc}" alt="${foto.title}" style="width: 100%; height: 100%; object-fit: cover;">
                      <div style="position: absolute; top: 6px; right: 6px; display: flex; gap: 4px;">
                        <button type="button" class="btn btn-xs" style="background: rgba(0,0,0,0.65); color: #ffffff; border: none; border-radius: 4px; padding: 3px 7px; font-size: 0.72rem; cursor: pointer;" title="Ganti Foto" onclick="document.getElementById('rkt-foto-input-${idx}').click()">🔄 Ganti</button>
                        <button type="button" class="btn btn-xs" style="background: rgba(220,38,38,0.85); color: #ffffff; border: none; border-radius: 4px; padding: 3px 7px; font-size: 0.72rem; cursor: pointer;" title="Hapus Foto" onclick="window.simRkt.deleteUploadFoto(${idx})">🗑️</button>
                      </div>
                    ` : `
                      <div onclick="document.getElementById('rkt-foto-input-${idx}').click()" style="cursor: pointer; text-align: center; padding: 1rem; width: 100%;">
                        <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">📷</div>
                        <div style="font-weight: 700; color: #1e3a8a; font-size: 0.82rem;">+ Klik untuk Unggah Foto</div>
                        <div style="font-size: 0.7rem; color: #64748b;">Mendukung JPG, PNG</div>
                      </div>
                    `}
                    <input type="file" id="rkt-foto-input-${idx}" accept="image/*" style="display: none;" onchange="window.simRkt.handleUploadFoto(${idx}, this.files[0])">
                  </div>
                  
                  <div style="padding: 0.75rem; flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                      <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${foto.title || `Foto ${idx + 1}`}</span>
                      ${foto.publicId ? `<span class="badge badge-completed" style="font-size: 0.65rem;">☁️ Cloudinary</span>` : (hasImg ? `<span class="badge badge-draft" style="font-size: 0.65rem;">💾 Offline</span>` : '')}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; flex: 1;">${foto.desc || ''}</div>
                    
                    ${!hasImg ? `
                      <button type="button" class="btn btn-sm btn-outline" style="width: 100%; border-color: #3b82f6; color: #1d4ed8; font-weight: 600; font-size: 0.78rem; border-radius: 6px; padding: 4px;" onclick="document.getElementById('rkt-foto-input-${idx}').click()">
                        📁 Pilih File Foto
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- LAMPIRAN 4: ANALISIS KEGIATAN SEKOLAH RUTIN (12 BULAN) -->
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #f0fdf4; color: #15803d; border-color: #bbf7d0;">LAMPIRAN 4</span>
            <h3 class="section-title-modern">📊 Analisis Kegiatan Sekolah Rutin (Matriks Analisis 12 Bulan)</h3>
            <p class="section-desc-modern">Distribusi agenda kegiatan rutin kedinasan, operasional BOSP, dan program PBD sepanjang Januari s.d. Desember 2027.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div class="table-responsive" style="max-height: 480px; overflow-y: auto;">
            <table class="grid-table" style="font-size: 0.78rem;">
              <thead style="position: sticky; top: 0; background: #ffffff; z-index: 2;">
                <tr>
                  <th style="width: 40px;" class="cell-center">No</th>
                  <th style="width: 90px;">Bulan</th>
                  <th>Kegiatan Sekolah</th>
                  <th style="width: 120px;" class="cell-center">Anggaran (Rp)</th>
                  <th style="width: 60px;" class="cell-center">PBD</th>
                  <th style="width: 60px;" class="cell-center">Rutin</th>
                  <th style="width: 60px;" class="cell-center">Insidental</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                ${(lamp.analisis12Bulan || []).map((ak, idx) => `
                  <tr>
                    <td class="cell-center">${idx + 1}</td>
                    <td><strong>${ak.bulan}</strong></td>
                    <td>${ak.kegiatan}</td>
                    <td class="cell-center">${ak.anggaran !== '-' ? 'Rp ' + ak.anggaran : '-'}</td>
                    <td class="cell-center">${ak.isPbd ? '✅' : ''}</td>
                    <td class="cell-center">${ak.isRutin ? '✅' : ''}</td>
                    <td class="cell-center">${ak.isInsidental ? '✅' : ''}</td>
                    <td><small style="color: var(--text-muted);">${ak.keterangan || '-'}</small></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- LAMPIRAN 5: SK TIM PENYUSUN RKT/ARKAS -->
      <div class="rkt-section-card">
        <div class="section-card-header">
          <div class="section-header-left">
            <span class="section-badge-pill" style="background: #fef2f2; color: #b91c1c; border-color: #fecaca;">LAMPIRAN 5 &bull; LEGALITAS</span>
            <h3 class="section-title-modern">📜 SK Tim Penyusun RKT/ARKAS Satuan Pendidikan</h3>
            <p class="section-desc-modern">Surat Keputusan Kepala SD Negeri Kalisalak 01 tentang Pembentukan dan Penetapan Tim Penyusun RKT &amp; ARKAS 2027.</p>
          </div>
        </div>
        <div class="section-card-body" style="margin-top: 1rem;">
          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-weight: 700; font-size: 0.9rem; text-align: center; margin-bottom: 0.5rem; text-transform: uppercase;">
              KEPUTUSAN KEPALA SD NEGERI KALISALAK 01<br>
              NOMOR : 421.2 / 086 / 04.68 / 2026<br>
              TENTANG PEMBENTUKAN DAN PENETAPAN TIM PENYUSUN RKT &amp; ARKAS TAHUN ANGGARAN ${g.tahunRkt || '2027'}
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); text-align: justify; margin: 0.75rem 0;">
              Dokumen SK Kepala Sekolah ini memuat konsiderans resmi (Menimbang a-b, Mengingat 1-4, Memutuskan, Menetapkan) dengan diktum tugas pokok personalia tim dalam mengawal siklus Perencanaan Berbasis Data (PBD) hingga pelaporan ARKAS.
            </p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <span class="badge badge-completed">Penanggung Jawab: Kepala Sekolah</span>
              <span class="badge badge-completed">Penasihat: Komite Sekolah</span>
              <span class="badge badge-completed">Ketua: Guru Kelas VI</span>
              <span class="badge badge-completed">Sekretaris: Guru Kelas III</span>
              <span class="badge badge-completed">Bendahara: Guru Kelas V</span>
              <span class="badge badge-completed">Anggota: Dewan Guru &amp; Tendik</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTab: function (tabKey, container, rktData, controller) {
      switch (tabKey) {
        case 'cover':
          this.renderTabCover(container, rktData, controller);
          break;
        case 'bab1':
          this.renderTabBab1(container, rktData, controller);
          break;
        case 'bab2':
          this.renderTabBab2(container, rktData, controller);
          break;
        case 'bab3':
          this.renderTabBab3(container, rktData, controller);
          break;
        case 'bab4':
          this.renderTabBab4(container, rktData, controller);
          break;
        case 'bab5':
          this.renderTabBab5(container, rktData, controller);
          break;
        case 'lampiran':
          this.renderTabLampiran(container, rktData, controller);
          break;
        default:
          this.renderTabCover(container, rktData, controller);
      }
    }
  };

  global.SIM_RKT_TABS = SIM_RKT_TABS;
})(typeof window !== 'undefined' ? window : global);
