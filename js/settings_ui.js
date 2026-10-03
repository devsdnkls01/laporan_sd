/**
 * SETTINGS & MASTER DATA UI CONTROLLER
 * Menangani Antarmuka Modal Data Master (7 Sub-Menu):
 * 1. Identitas Satuan Pendidikan
 * 2. Pejabat Pengesah Kedinasan
 * 3. Dewan Guru & Tenaga Kependidikan (PTK)
 * 4. Rombel & Siswa per Kelas
 * 5. Sarana & Prasarana
 * 6. Dana BOS (BOSP)
 * 7. Periode & Penanggalan Cerdas
 * 
 * Auto-Save: Setiap kali input diubah, data otomatis tersimpan ke masterDb (Local Database)
 */

(function (global) {
  'use strict';

  class SettingsUiManager {
    constructor() {
      this.activeTab = 'tab-sekolah';
      this.saveDebounceTimer = null;
    }

    init() {
      this.bindGlobalEvents();
      if (global.simApp) {
        global.simApp.switchMasterTab = (tabId) => this.switchTab(tabId);
        global.simApp.addNewTeacherPrompt = () => this.addNewTeacherPrompt();
        global.simApp.addNewSarprasPrompt = () => this.addNewSarprasPrompt();
        global.simApp.recalculateBosPreview = () => this.recalculateBosPreview();
        global.simApp.resetMasterDefaultsConfirm = () => this.resetDefaultsConfirm();
        global.simApp.openSettingsModal = () => this.openModal();
        global.simApp.closeSettingsModal = () => this.closeModal();
      }
    }

    bindGlobalEvents() {
      // Tombol open settings di sidebar
      const btnOpen = document.getElementById('btn-open-settings');
      if (btnOpen) {
        btnOpen.addEventListener('click', () => this.openModal());
      }

      // Tombol close settings
      const btnClose = document.getElementById('btn-close-settings');
      if (btnClose) {
        btnClose.addEventListener('click', () => this.closeModal());
      }

      // Form submit (Simpan Manual jika user menekan tombol simpan)
      const form = document.getElementById('form-settings');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveFromForm(true);
        });
      }

      // Auto-save listeners on all form inputs
      if (form) {
        form.addEventListener('input', (e) => {
          this.triggerAutoSave();
        });
        form.addEventListener('change', (e) => {
          this.triggerAutoSave();
        });
      }

      // Listen to master-data-updated event from any module
      window.addEventListener('master-data-updated', () => {
        // Jika modal sedang terbuka, perbarui tampilannya
        const modal = document.getElementById('modal-settings');
        if (modal && modal.classList.contains('open')) {
          this.populateData();
        }
      });
    }

    openModal() {
      const modal = document.getElementById('modal-settings');
      if (!modal) return;

      this.populateData();
      modal.classList.add('open');
    }

    closeModal() {
      const modal = document.getElementById('modal-settings');
      if (modal) modal.classList.remove('open');
    }

    switchTab(tabId) {
      this.activeTab = tabId;

      // Update button tab states
      const tabBtns = document.querySelectorAll('.master-tab-btn');
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
      });

      // Update panes
      const panes = document.querySelectorAll('.master-tab-pane');
      panes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId);
      });
    }

    populateData() {
      if (!window.masterDb) return;

      const sek = window.masterDb.getSekolah();
      const pej = window.masterDb.getPejabat(false);
      const pejRkt = window.masterDb.getPejabat(true);
      const per = window.masterDb.getPeriode();
      const bos = window.masterDb.getBos();

      // 1. Identitas Sekolah
      this.setVal('set-sekolah-nama', sek.nama);
      this.setVal('set-sekolah-npsn', sek.npsn);
      this.setVal('set-sekolah-nss', sek.nss);
      this.setVal('set-sekolah-alamat', sek.alamat);
      this.setVal('set-sekolah-desa', sek.desa);
      this.setVal('set-sekolah-kecamatan', sek.kecamatan);
      this.setVal('set-sekolah-kabupaten', sek.kabupaten);
      this.setVal('set-sekolah-provinsi', sek.provinsi);
      this.setVal('set-sekolah-kodepos', sek.kodePos);
      this.setVal('set-sekolah-pemerintah', sek.pemerintah);
      this.setVal('set-sekolah-dinas', sek.dinas);
      this.setVal('set-sekolah-korwil', sek.korwil);
      this.setVal('set-sekolah-email', sek.email);

      // 2. Pejabat Pengesah
      this.setVal('set-kepala-nama', pej.kepalaNama);
      this.setVal('set-kepala-nip', pej.kepalaNip);
      this.setVal('set-kepala-pangkat', pej.kepalaPangkat);
      this.setVal('set-kepala-jabatan', pej.kepalaJabatan);

      this.setVal('set-komite-nama', pej.komiteNama);
      this.setVal('set-komite-jabatan', pej.komiteJabatan);

      this.setVal('set-pengawas-nama', pej.pengawasNama);
      this.setVal('set-pengawas-nip', pej.pengawasNip);
      this.setVal('set-pengawas-jabatan', pej.pengawasJabatan);

      this.setVal('set-pengawas-rkt-nama', pejRkt.pengawasNama);
      this.setVal('set-pengawas-rkt-nip', pejRkt.pengawasNip);
      this.setVal('set-pengawas-rkt-jabatan', pejRkt.pengawasJabatan);

      this.setVal('set-kadisdik-nama', pej.kadisdikNama);
      this.setVal('set-kadisdik-nip', pej.kadisdikNip);
      this.setVal('set-kadisdik-pangkat', pej.kadisdikPangkat);
      this.setVal('set-kadisdik-jabatan', pej.kadisdikJabatan);

      // 3. PTK List
      this.renderPtkTable();

      // 4. Kelas & Siswa
      this.renderSiswaTable();

      // 5. Sarpras
      this.renderSarprasTable();

      // 6. Dana BOS
      this.setVal('set-bos-pagu', bos.paguPerSiswa);
      this.recalculateBosPreview();

      // 7. Periode & Penanggalan Cerdas
      this.setVal('set-tahun-berjalan-display', per.tahunBerjalan);
      this.setVal('set-tahun-rkt-display', per.tahunRkt);
      this.setVal('set-tahun-pelajaran-display', per.tahunPelajaran);
      this.setVal('set-titimangsa-tempat', per.titimangsaTempat);
      this.setVal('set-titimangsa-tanggal-rkt', per.titimangsaTanggalPenetapan);
      this.setVal('set-titimangsa-tanggal-lapor', window.masterDb.getSmartLaporDate());

      this.setText('prev-tgl-penetapan', per.titimangsaTanggalPenetapan);
      this.setText('prev-tgl-validasi', per.titimangsaTanggalValidasi);
      this.setText('prev-tgl-pengantar', per.titimangsaTanggalPengantar);
      this.setText('prev-tgl-ba', per.titimangsaTanggalBeritaAcara);
      this.setText('prev-tgl-sk', per.titimangsaTanggalSk);
    }

    renderPtkTable() {
      const tbody = document.getElementById('master-ptk-tbody');
      if (!tbody) return;

      const tendik = window.masterDb.getTendik();
      tbody.innerHTML = tendik.map((t, idx) => {
        const isPns = (t.status || '').toUpperCase().includes('PNS');
        const isPppk = (t.status || '').toUpperCase().includes('PPPK');
        const badgeColor = isPns ? '#16a34a' : (isPppk ? '#2563eb' : '#d97706');

        return `
          <tr>
            <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
            <td>
              <input type="text" class="form-control-sm" value="${t.nama || ''}" onchange="window.settingsUi.updatePtkField('${t.id}', 'nama', this.value)" style="font-weight: 700;">
            </td>
            <td>
              <input type="text" class="form-control-sm" value="${t.nip || '-'}" onchange="window.settingsUi.updatePtkField('${t.id}', 'nip', this.value)">
            </td>
            <td>
              <input type="text" class="form-control-sm" value="${t.pangkat || '-'}" onchange="window.settingsUi.updatePtkField('${t.id}', 'pangkat', this.value)">
            </td>
            <td>
              <input type="text" class="form-control-sm" value="${t.jabatan || ''}" onchange="window.settingsUi.updatePtkField('${t.id}', 'jabatan', this.value)">
            </td>
            <td style="text-align: center;">
              <select class="form-control-sm" onchange="window.settingsUi.updatePtkField('${t.id}', 'status', this.value)" style="font-weight: 700; color: ${badgeColor};">
                <option value="PNS" ${t.status === 'PNS' ? 'selected' : ''}>PNS</option>
                <option value="PPPK" ${t.status === 'PPPK' ? 'selected' : ''}>PPPK</option>
                <option value="PPPK PW" ${t.status === 'PPPK PW' ? 'selected' : ''}>PPPK PW</option>
                <option value="WB" ${t.status === 'WB' || t.status === 'Honorer' ? 'selected' : ''}>WB/Honorer</option>
                <option value="Tendik" ${t.status === 'Tendik' ? 'selected' : ''}>Tendik</option>
              </select>
            </td>
            <td>
              <input type="text" class="form-control-sm" value="${t.guruKelas || '-'}" onchange="window.settingsUi.updatePtkField('${t.id}', 'guruKelas', this.value)">
            </td>
            <td style="text-align: center;">
              <button type="button" class="btn btn-sm btn-outline" style="color: #dc2626; border-color: #fca5a5; padding: 2px 6px; font-size: 0.75rem;" title="Hapus PTK" onclick="window.settingsUi.deletePtk('${t.id}')">✕</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderSiswaTable() {
      const tbody = document.getElementById('master-siswa-tbody');
      if (!tbody) return;

      const kelasList = window.masterDb.getKelasDanSiswa();
      tbody.innerHTML = kelasList.map((k, idx) => `
        <tr>
          <td style="font-weight: 700; color: #1e293b;">${k.kelas}</td>
          <td style="text-align: center;">
            <input type="number" class="form-control-sm" value="${k.rombel || 1}" min="1" max="10" onchange="window.settingsUi.updateKelasField(${idx}, 'rombel', this.value)" style="text-align: center; width: 55px; margin: 0 auto;">
          </td>
          <td style="text-align: center;">
            <input type="number" class="form-control-sm" value="${k.laki || 0}" min="0" oninput="window.settingsUi.updateKelasField(${idx}, 'laki', this.value)" style="text-align: center; font-weight: 700; color: #2563eb;">
          </td>
          <td style="text-align: center;">
            <input type="number" class="form-control-sm" value="${k.perempuan || 0}" min="0" oninput="window.settingsUi.updateKelasField(${idx}, 'perempuan', this.value)" style="text-align: center; font-weight: 700; color: #ec4899;">
          </td>
          <td style="text-align: center; font-weight: 800; font-size: 0.95rem; color: #047857;" id="row-total-siswa-${idx}">
            ${k.total || 0}
          </td>
          <td>
            <input type="text" class="form-control-sm" value="${k.waliKelas || ''}" onchange="window.settingsUi.updateKelasField(${idx}, 'waliKelas', this.value)">
          </td>
        </tr>
      `).join('');

      this.updateSiswaSummaryCards();
    }

    updateSiswaSummaryCards() {
      const totalSiswa = window.masterDb.getTotalSiswa();
      const totalLaki = window.masterDb.getTotalSiswaLaki();
      const totalPerempuan = window.masterDb.getTotalSiswaPerempuan();
      const totalRombel = (window.masterDb.getKelasDanSiswa() || []).reduce((a, k) => a + (parseInt(k.rombel) || 1), 0);

      this.setText('stat-total-siswa', `${totalSiswa} Siswa`);
      this.setText('stat-total-laki', `${totalLaki} Murid`);
      this.setText('stat-total-perempuan', `${totalPerempuan} Murid`);
      this.setText('stat-total-rombel', `${totalRombel} Rombel`);

      this.recalculateBosPreview();
    }

    renderSarprasTable() {
      const tbody = document.getElementById('master-sarpras-tbody');
      if (!tbody) return;

      const sarpras = window.masterDb.getSarpras();
      tbody.innerHTML = sarpras.map((sp, idx) => `
        <tr>
          <td style="text-align: center; font-weight: 700;">${idx + 1}</td>
          <td>
            <input type="text" class="form-control-sm" value="${sp.jenis || ''}" onchange="window.settingsUi.updateSarprasField(${idx}, 'jenis', this.value)" style="font-weight: 600;">
          </td>
          <td>
            <input type="number" class="form-control-sm" value="${sp.jumlah || 0}" min="0" oninput="window.settingsUi.updateSarprasField(${idx}, 'jumlah', this.value)" style="text-align: center; font-weight: 700;">
          </td>
          <td>
            <input type="number" class="form-control-sm" value="${sp.baik || 0}" min="0" oninput="window.settingsUi.updateSarprasField(${idx}, 'baik', this.value)" style="text-align: center; color: #16a34a; font-weight: 700;">
          </td>
          <td>
            <input type="number" class="form-control-sm" value="${sp.rusakRingan || 0}" min="0" oninput="window.settingsUi.updateSarprasField(${idx}, 'rusakRingan', this.value)" style="text-align: center; color: #d97706; font-weight: 700;">
          </td>
          <td>
            <input type="number" class="form-control-sm" value="${sp.rusakBerat || 0}" min="0" oninput="window.settingsUi.updateSarprasField(${idx}, 'rusakBerat', this.value)" style="text-align: center; color: #dc2626; font-weight: 700;">
          </td>
          <td>
            <input type="text" class="form-control-sm" value="${sp.keterangan || '-'}" onchange="window.settingsUi.updateSarprasField(${idx}, 'keterangan', this.value)">
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn btn-sm btn-outline" style="color: #dc2626; border-color: #fca5a5; padding: 2px 6px; font-size: 0.75rem;" title="Hapus Fasilitas" onclick="window.settingsUi.deleteSarpras(${idx})">✕</button>
          </td>
        </tr>
      `).join('');
    }

    recalculateBosPreview() {
      const paguInput = document.getElementById('set-bos-pagu');
      const paguPerSiswa = paguInput ? (parseInt(paguInput.value) || 900000) : 900000;
      const totalSiswa = window.masterDb ? window.masterDb.getTotalSiswa() : 225;
      const totalPagu = paguPerSiswa * totalSiswa;

      const tw1 = Math.round(totalPagu * 0.30);
      const tw2 = Math.round(totalPagu * 0.40);
      const tw3 = Math.round(totalPagu * 0.15);
      const tw4 = totalPagu - (tw1 + tw2 + tw3);

      this.setVal('set-bos-total-siswa', `${totalSiswa} Siswa (Riil)`);
      this.setVal('set-bos-total-pagu', `Rp ${totalPagu.toLocaleString('id-ID')}`);

      this.setText('stat-bos-tw1', `Rp ${tw1.toLocaleString('id-ID')}`);
      this.setText('stat-bos-tw2', `Rp ${tw2.toLocaleString('id-ID')}`);
      this.setText('stat-bos-tw3', `Rp ${tw3.toLocaleString('id-ID')}`);
      this.setText('stat-bos-tw4', `Rp ${tw4.toLocaleString('id-ID')}`);
    }

    // Inline field mutators
    updatePtkField(id, field, value) {
      if (!window.masterDb) return;
      window.masterDb.updateTendik(id, { [field]: value });
      this.triggerAutoSave();
    }

    deletePtk(id) {
      if (window.SIM_UI && window.SIM_UI.confirm) {
        window.SIM_UI.confirm({
          title: 'Hapus Guru / Tendik',
          message: 'Apakah Anda yakin ingin menghapus data guru/tendik ini dari Data Master?',
          confirmText: 'Ya, Hapus',
          variant: 'danger',
          onConfirm: () => {
            window.masterDb.deleteTendik(id);
            this.renderPtkTable();
            this.triggerAutoSave();
            this.showToast('Data guru/tendik berhasil dihapus');
          }
        });
      }
    }

    async addNewTeacherPrompt() {
      if (!window.SIM_UI || !window.SIM_UI.prompt) return;

      const nama = await window.SIM_UI.prompt({
        title: 'Tambah Guru / Tendik Baru',
        message: 'Masukkan Nama Lengkap & Gelar Guru/Tendik Baru:',
        placeholder: 'Contoh: Ahmad Subagyo, S.Pd.'
      });
      if (!nama || !nama.trim()) return;

      const jabatan = await window.SIM_UI.prompt({
        title: 'Jabatan Kedinasan',
        message: `Tentukan jabatan kedinasan untuk ${nama}:`,
        defaultValue: 'Guru Kelas',
        placeholder: 'Contoh: Guru Kelas, Guru PJOK, Operator Sekolah'
      });

      const nip = await window.SIM_UI.prompt({
        title: 'Nomor Induk Pegawai (NIP)',
        message: 'Masukkan NIP (kosongkan atau isi tanda - jika bukan PNS/PPPK):',
        defaultValue: '-',
        placeholder: 'Contoh: 198501012010011001'
      });

      const status = await window.SIM_UI.prompt({
        title: 'Status Kepegawaian',
        message: 'Pilih status kepegawaian (PNS / PPPK / WB / Tendik):',
        defaultValue: 'PPPK',
        placeholder: 'PPPK'
      });

      window.masterDb.addTendik({
        nama: nama.trim(),
        jabatan: jabatan || 'Guru Kelas',
        nip: nip || '-',
        status: status || 'PPPK',
        pangkat: '-',
        guruKelas: '-',
        kualifikasi: 'S1 PGSD',
        role: 'Anggota Pelaksana'
      });

      this.renderPtkTable();
      this.triggerAutoSave();
      this.showToast('Guru/Tendik baru berhasil ditambahkan');
    }

    updateKelasField(index, field, value) {
      if (!window.masterDb) return;
      const numVal = (field === 'laki' || field === 'perempuan' || field === 'rombel') ? (parseInt(value) || 0) : value;
      window.masterDb.updateKelas(index, { [field]: numVal });

      const k = window.masterDb.getKelasDanSiswa()[index];
      const rowTotalEl = document.getElementById(`row-total-siswa-${index}`);
      if (rowTotalEl && k) rowTotalEl.textContent = k.total;

      this.updateSiswaSummaryCards();
      this.triggerAutoSave();
    }

    updateSarprasField(index, field, value) {
      if (!window.masterDb) return;
      const sarpras = window.masterDb.getSarpras();
      if (sarpras[index]) {
        const numFields = ['jumlah', 'baik', 'rusakRingan', 'rusakBerat'];
        sarpras[index][field] = numFields.includes(field) ? (parseInt(value) || 0) : value;
        window.masterDb.saveAllSarpras(sarpras);
        this.triggerAutoSave();
      }
    }

    deleteSarpras(index) {
      if (window.SIM_UI && window.SIM_UI.confirm) {
        window.SIM_UI.confirm({
          title: 'Hapus Fasilitas Sarpras',
          message: 'Apakah Anda yakin ingin menghapus fasilitas ini dari inventaris Sarpras?',
          confirmText: 'Ya, Hapus',
          variant: 'danger',
          onConfirm: () => {
            window.masterDb.deleteSarpras(index);
            this.renderSarprasTable();
            this.triggerAutoSave();
            this.showToast('Fasilitas sarpras berhasil dihapus');
          }
        });
      }
    }

    async addNewSarprasPrompt() {
      if (!window.SIM_UI || !window.SIM_UI.prompt) return;

      const jenis = await window.SIM_UI.prompt({
        title: 'Tambah Sarana & Prasarana',
        message: 'Masukkan nama fasilitas / ruang sarana prasarana:',
        placeholder: 'Contoh: Ruang Laboratorium Komputer'
      });
      if (!jenis || !jenis.trim()) return;

      const jumlahStr = await window.SIM_UI.prompt({
        title: 'Jumlah Unit / Ruang',
        message: `Jumlah unit untuk ${jenis}:`,
        defaultValue: '1',
        placeholder: '1'
      });
      const jumlah = parseInt(jumlahStr) || 1;

      window.masterDb.addSarpras({
        jenis: jenis.trim(),
        jumlah: jumlah,
        baik: jumlah,
        rusakRingan: 0,
        rusakBerat: 0,
        keterangan: 'Kondisi baik'
      });

      this.renderSarprasTable();
      this.triggerAutoSave();
      this.showToast('Sarana prasarana baru berhasil ditambahkan');
    }

    resetDefaultsConfirm() {
      if (window.SIM_UI && window.SIM_UI.confirm) {
        window.SIM_UI.confirm({
          title: 'Kembalikan Pengaturan Baku',
          message: 'Apakah Anda yakin ingin MENGEMBALIKAN SEMUA DATA MASTER ke pengaturan baku standar (Dapodik & PTK Resmi)? Perubahan yang belum dicadangkan akan dikembalikan.',
          confirmText: 'Ya, Reset Data Master',
          variant: 'danger',
          onConfirm: () => {
            window.masterDb.resetToDefaults();
            this.populateData();
            this.showToast('Data Master Berhasil Direset ke Standar Baku!');
          }
        });
      }
    }

    triggerAutoSave() {
      if (this.saveDebounceTimer) clearTimeout(this.saveDebounceTimer);
      this.showIndicator('saving');

      this.saveDebounceTimer = setTimeout(() => {
        this.saveFromForm(false);
      }, 400);
    }

    saveFromForm(showManualAlert = false) {
      if (!window.masterDb) return;

      // 1. Sekolah
      window.masterDb.updateSekolah({
        nama: this.getVal('set-sekolah-nama'),
        npsn: this.getVal('set-sekolah-npsn'),
        nss: this.getVal('set-sekolah-nss'),
        alamat: this.getVal('set-sekolah-alamat'),
        desa: this.getVal('set-sekolah-desa'),
        kecamatan: this.getVal('set-sekolah-kecamatan'),
        kabupaten: this.getVal('set-sekolah-kabupaten'),
        provinsi: this.getVal('set-sekolah-provinsi'),
        kodePos: this.getVal('set-sekolah-kodepos'),
        pemerintah: this.getVal('set-sekolah-pemerintah'),
        dinas: this.getVal('set-sekolah-dinas'),
        korwil: this.getVal('set-sekolah-korwil'),
        email: this.getVal('set-sekolah-email')
      });

      // 2. Pejabat
      window.masterDb.updatePejabat({
        kepalaNama: this.getVal('set-kepala-nama'),
        kepalaNip: this.getVal('set-kepala-nip'),
        kepalaPangkat: this.getVal('set-kepala-pangkat'),
        kepalaJabatan: this.getVal('set-kepala-jabatan'),
        komiteNama: this.getVal('set-komite-nama'),
        komiteJabatan: this.getVal('set-komite-jabatan'),
        pengawasNama: this.getVal('set-pengawas-nama'),
        pengawasNip: this.getVal('set-pengawas-nip'),
        pengawasJabatan: this.getVal('set-pengawas-jabatan'),
        pengawasRktNama: this.getVal('set-pengawas-rkt-nama') || "Yeyen Anggraeni, S.Pd.SD.",
        pengawasRktNip: this.getVal('set-pengawas-rkt-nip') || "198610132010012016",
        pengawasRktJabatan: this.getVal('set-pengawas-rkt-jabatan') || "Pengawas Sekolah Pembina Gugus",
        kadisdikNama: this.getVal('set-kadisdik-nama'),
        kadisdikNip: this.getVal('set-kadisdik-nip'),
        kadisdikPangkat: this.getVal('set-kadisdik-pangkat'),
        kadisdikJabatan: this.getVal('set-kadisdik-jabatan')
      });

      // 3. Periode & Titimangsa Tempat
      const tempat = this.getVal('set-titimangsa-tempat');
      if (tempat) {
        window.masterDb.updatePeriode({ titimangsaTempat: tempat });
      }

      // 4. Dana BOS pagu
      const pagu = parseInt(this.getVal('set-bos-pagu')) || 900000;
      window.masterDb.updateBos({ paguPerSiswa: pagu });

      // Save to localStorage & trigger sync across SIM-LAPOR and SIM-RKT
      window.masterDb.save();
      this.showIndicator('saved');

      if (showManualAlert) {
        this.showToast('Semua Data Master & Penanggalan Cerdas Berhasil Disimpan!');
        this.closeModal();
      }
    }

    showIndicator(status) {
      const ind = document.getElementById('save-indicator');
      if (ind) {
        ind.className = 'save-indicator ' + status;
        const txt = ind.querySelector('.save-text');
        if (txt) {
          txt.textContent = status === 'saving' ? 'Menyimpan...' : (status === 'saved' ? 'Tersimpan Otomatis' : 'Gagal Menyimpan');
        }
      }
    }

    showToast(message) {
      if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
        window.SIM_UI.toast(message, 'success');
      } else if (window.simApp && typeof window.simApp.showToast === 'function') {
        window.simApp.showToast(message);
      }
    }

    // Helper getters/setters
    getVal(id) {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    setVal(id, val) {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    }

    setText(id, text) {
      const el = document.getElementById(id);
      if (el) el.textContent = text !== undefined && text !== null ? text : '';
    }
  }

  // Bind to global and expose shortcuts
  global.settingsUi = new SettingsUiManager();
  
  // Shortcuts on simApp for backward compatibility
  global.simApp = global.simApp || {};
  global.simApp.switchMasterTab = (tabId) => global.settingsUi.switchTab(tabId);
  global.simApp.addNewTeacherPrompt = () => global.settingsUi.addNewTeacherPrompt();
  global.simApp.addNewSarprasPrompt = () => global.settingsUi.addNewSarprasPrompt();
  global.simApp.recalculateBosPreview = () => global.settingsUi.recalculateBosPreview();
  global.simApp.resetMasterDefaultsConfirm = () => global.settingsUi.resetDefaultsConfirm();
  global.simApp.openSettingsModal = () => global.settingsUi.openModal();
  global.simApp.closeSettingsModal = () => global.settingsUi.closeModal();

  document.addEventListener('DOMContentLoaded', () => {
    global.settingsUi.init();
  });

})(typeof window !== 'undefined' ? window : global);
