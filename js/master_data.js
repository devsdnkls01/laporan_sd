/**
 * MASTER DATA MANAGER & REPOSITORY
 * Pusat Konfigurasi & Basis Data Master Terpadu
 * 
 * Mengimplementasikan arsitektur data master terpusat:
 * Pengaturan/Data Master -> Database (Local/IndexedDB) -> Pemanggilan Data Dinamis -> RKT & 44 Laporan
 * 
 * Prinsip: TIDAK ADA DATA SEKOLAH, PEJABAT, GURU, SISWA, ATAU SARPRAS YANG DI-HARDCODE.
 * Seluruh dokumen dan form mengambil data langsung dari repository ini.
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'simlapor_master_data_v2';

  const INDO_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  function formatIndoDate(date = new Date()) {
    const d = date.getDate();
    const m = INDO_MONTHS[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  }

  function angkaKeTerbilang(n) {
    const bil = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    n = parseInt(n, 10);
    if (isNaN(n) || n === 0) return "Nol";
    if (n < 12) return bil[n];
    if (n < 20) return bil[n - 10] + " Belas";
    if (n < 100) return bil[Math.floor(n / 10)] + " Puluh" + (n % 10 !== 0 ? " " + bil[n % 10] : "");
    if (n < 200) return "Seratus" + (n % 100 !== 0 ? " " + angkaKeTerbilang(n % 100) : "");
    if (n < 1000) return bil[Math.floor(n / 100)] + " Ratus" + (n % 100 !== 0 ? " " + angkaKeTerbilang(n % 100) : "");
    if (n < 2000) return "Seribu" + (n % 1000 !== 0 ? " " + angkaKeTerbilang(n % 1000) : "");
    if (n < 1000000) return angkaKeTerbilang(Math.floor(n / 1000)) + " Ribu" + (n % 1000 !== 0 ? " " + angkaKeTerbilang(n % 1000) : "");
    if (n < 1000000000) return angkaKeTerbilang(Math.floor(n / 1000000)) + " Juta" + (n % 1000000 !== 0 ? " " + angkaKeTerbilang(n % 1000000) : "");
    return n.toString();
  }

  const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  /**
   * Logika Cerdas Penanggalan RKT:
   * 1. RKT selalu untuk tahun berikutnya: Tahun RKT = Tahun Berjalan + 1
   * 2. Tanggal dokumen RKT: 31 Desember pada tahun berjalan (bukan tanggal cetak)
   * 3. Tahun Pelajaran: [Tahun Berjalan] / [Tahun Berjalan + 1]
   */
  function getSmartRktDates(baseDate = new Date()) {
    const currentYear = baseDate.getFullYear();
    const nextYear = currentYear + 1;
    const baDate = new Date(currentYear, 11, 22);
    const baDayName = INDO_DAYS[baDate.getDay()];
    return {
      tahunBerjalan: currentYear.toString(),
      tahunRkt: nextYear.toString(),
      tahunAnggaran: nextYear.toString(),
      tahunPelajaran: `${currentYear}/${nextYear}`,
      tahunDokumen: nextYear.toString(),
      tahunLalu: (currentYear - 1).toString(),
      tahunRapor: currentYear.toString(),
      titimangsaTempat: "Margasari",
      titimangsaTanggalPenetapan: `31 Desember ${currentYear}`,
      titimangsaTanggalValidasi: `28 Desember ${currentYear}`,
      titimangsaTanggalPengantar: `23 Desember ${currentYear}`,
      titimangsaTanggalUndangan: `15 Desember ${currentYear}`,
      titimangsaTanggalBeritaAcara: `22 Desember ${currentYear}`,
      titimangsaTanggalSk: `20 Desember ${currentYear}`,
      beritaAcaraHari: baDayName,
      beritaAcaraTanggalTerbilang: "Dua Puluh Dua",
      beritaAcaraBulan: "Desember",
      beritaAcaraTahunTerbilang: angkaKeTerbilang(currentYear)
    };
  }

  /**
   * Logika Cerdas Penanggalan Laporan Pelaksanaan Program:
   * Tanggal dokumen laporan selalu mengikuti tanggal real-time saat dokumen dicetak/digenerate.
   */
  function getSmartLaporDate(targetDate = new Date()) {
    return formatIndoDate(targetDate);
  }

  function getSmartLaporYear(targetDate = new Date()) {
    return targetDate.getFullYear().toString();
  }

  const DEFAULT_MASTER_DATA = {
    sekolah: {
      nama: "SD NEGERI KALISALAK 01",
      npsn: "20325895",
      nss: "101032804001",
      alamat: "Jl. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kab. Tegal, Jawa Tengah 52463",
      desa: "Kalisalak",
      kecamatan: "Margasari",
      kabupaten: "Kabupaten Tegal",
      provinsi: "Jawa Tengah",
      kodePos: "52463",
      pemerintah: "PEMERINTAH KABUPATEN TEGAL",
      dinas: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
      korwil: "Korwilcam Diktuk Margasari",
      email: "sdnkalisalak01@gmail.com",
      telepon: "-"
    },
    pejabat: {
      kepalaNama: "IMAMUDIN, S. Pd.SD",
      kepalaNip: "197106172003121001",
      kepalaPangkat: "Penata Tk. I",
      kepalaGolongan: "IV/b",
      kepalaJabatan: "Kepala SD Negeri Kalisalak 01",
      komiteNama: "IDA ELISA",
      komiteJabatan: "Ketua Komite SD Negeri Kalisalak 01",
      pengawasNama: "Sri Suci Margianah, S.Pd., M.Pd.",
      pengawasNip: "19800228 200801 2 006",
      pengawasJabatan: "Pengawas Pembina SD Kec. Margasari",
      pengawasRktNama: "Yeyen Anggraeni, S.Pd.SD.",
      pengawasRktNip: "198610132010012016",
      pengawasRktJabatan: "Pengawas Sekolah Pembina Gugus",
      kadisdikNama: "WINARTO, S.E., M.M.",
      kadisdikNip: "196901251996031003",
      kadisdikPangkat: "Pembina Tk. I",
      kadisdikJabatan: "Plt. Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Tegal"
    },
    periode: getSmartRktDates(),
    kelasDanSiswa: [
      { kelas: "Kelas I", rombel: 1, laki: 18, perempuan: 16, total: 34, waliKelas: "Siti Maria Ulfah, S.Pd." },
      { kelas: "Kelas II", rombel: 1, laki: 16, perempuan: 16, total: 32, waliKelas: "Santi Anggraeni, S.Pd.SD" },
      { kelas: "Kelas III", rombel: 1, laki: 23, perempuan: 20, total: 43, waliKelas: "Retno Amalia, S.Pd." },
      { kelas: "Kelas IV", rombel: 1, laki: 22, perempuan: 20, total: 42, waliKelas: "Ismi Kamaliyah, S.Pd." },
      { kelas: "Kelas V", rombel: 1, laki: 12, perempuan: 12, total: 24, waliKelas: "Syifa Septiyani Fauziah, S.Pd." },
      { kelas: "Kelas VI", rombel: 1, laki: 26, perempuan: 24, total: 50, waliKelas: "Hendry Badriarto, S.Pd." }
    ],
    bos: {
      paguPerSiswa: 900000,
      tw1Persen: 30,
      tw2Persen: 40,
      tw3Persen: 15,
      tw4Persen: 15
    },
    tendik: [
      { id: "ptk-1", no: 1, nama: "Imamudin, S.Pd.SD", nip: "197106172003121001", pangkat: "Penata Tingkat I, III/d", jabatan: "Kepala Sekolah", status: "PNS", guruKelas: "-", kualifikasi: "S1 PGSD", noHp: "089652476493", alamat: "RT 004/RW 001 Kel. Debong Kidul, Kec. Tegal Selatan", role: "Penanggung Jawab Umum Program" },
      { id: "ptk-2", no: 2, nama: "Hendry Badriarto, S.Pd.", nip: "198411162025211088", pangkat: "-", jabatan: "Guru Kelas VI", status: "PPPK PW", guruKelas: "VI", kualifikasi: "S1 PGSD", noHp: "0882005655804", alamat: "RT 003/RW 007, Desa Kalisalak", role: "Guru Kelas VI / Numerasi" },
      { id: "ptk-3", no: 3, nama: "Ismi Kamaliyah, S.Pd.", nip: "199410142020122002", pangkat: "Panata Muda Tingkat I, III/b", jabatan: "Guru Kelas IV / Bendahara Sekolah", status: "PNS", guruKelas: "IV", kualifikasi: "S1 PGSD", noHp: "083126056019", alamat: "RT 001/RW 001, Desa Wanasari", role: "Ketua TPMPS & Tim PBD" },
      { id: "ptk-4", no: 4, nama: "Retno Amalia, S.Pd.", nip: "-", pangkat: "-", jabatan: "Guru Kelas III / Operator Dapodik", status: "WB", guruKelas: "III", kualifikasi: "S1 PGSD", noHp: "085325009470", alamat: "RT 003/RW 011, Desa Kalisalak", role: "Operator Dapodik & Kls III" },
      { id: "ptk-5", no: 5, nama: "Santi Anggraeni, S.Pd.SD", nip: "197312242023212003", pangkat: "Ahli Pertama, IX", jabatan: "Guru Kelas II", status: "PPPK", guruKelas: "II", kualifikasi: "S1 PGSD", noHp: "082324036803", alamat: "RT 002/RW 006, Desa Kalisalak", role: "Guru Kelas II / Literasi" },
      { id: "ptk-6", no: 6, nama: "Siti Maria Ulfah, S.Pd.", nip: "199011152025212036", pangkat: "Ahli Pertama, IX", jabatan: "Guru Kelas I", status: "PPPK", guruKelas: "I", kualifikasi: "S1 PGSD", noHp: "087774993329", alamat: "RT 003/RW 007, Desa Kalisalak", role: "Guru Kelas I / Pembiasaan" },
      { id: "ptk-7", no: 7, nama: "Syifa Septiyani Fauziah, S.Pd.", nip: "199609212022212004", pangkat: "Ahli Pertama, IX", jabatan: "Guru Kelas V / Operator BOS & ARKAS", status: "PPPK", guruKelas: "V", kualifikasi: "S1 PGSD", noHp: "087771889563", alamat: "RT 001/RW 006, Desa Jembayat", role: "Bendahara BOS / ARKAS" },
      { id: "ptk-8", no: 8, nama: "Emma Puji Rakhastiwi, S.Pd.", nip: "-", pangkat: "-", jabatan: "Guru PJOK", status: "WB", guruKelas: "I-VI", kualifikasi: "S1 Olahraga", noHp: "0882003097704", alamat: "RT 001/RW 005, Desa Margasari", role: "Guru PJOK & Olahraga" },
      { id: "ptk-9", no: 9, nama: "Mukhammad Lu'lu Khulaluddin", nip: "-", pangkat: "-", jabatan: "Guru PAI / Tenaga Administrasi", status: "WB", guruKelas: "-", kualifikasi: "S1 PAI", noHp: "085171542025", alamat: "RT 003/RW003, Desa Kalisalak", role: "Keagamaan & Administrasi" },
      { id: "ptk-10", no: 10, nama: "Umi Latifah", nip: "-", pangkat: "-", jabatan: "Penjaga Sekolah", status: "WB", guruKelas: "-", kualifikasi: "SMA", noHp: "085643076164", alamat: "RT 001/RW 005,Desa Kalisalak", role: "Kebersihan & Keamanan" }
    ],
    sarpras: [
      { jenis: "Ruang Kelas", jumlah: 6, baik: 4, rusakRingan: 2, rusakBerat: 0, keterangan: "Perlu pengecatan ulang 2 ruang" },
      { jenis: "Ruang Kepala Sekolah", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Kondisi sangat baik" },
      { jenis: "Ruang Guru", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Fasilitas meja guru lengkap" },
      { jenis: "Ruang Tata Usaha", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Menyatu dengan ruang kepala sekolah" },
      { jenis: "Perpustakaan", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Perlu penambahan rak buku fiksi" },
      { jenis: "Laboratorium IPA", jumlah: 0, baik: 0, rusakRingan: 0, rusakBerat: 0, keterangan: "Terintegrasi di pojok perpustakaan" },
      { jenis: "Laboratorium Komputer", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "15 unit Chromebook bantuan Kemendikbud" },
      { jenis: "Ruang UKS", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Dilengkapi tempat tidur periksa & P3K" },
      { jenis: "Ruang BK", jumlah: 0, baik: 0, rusakRingan: 0, rusakBerat: 0, keterangan: "Terpadu dalam ruang guru" },
      { jenis: "Mushala", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Digunakan pembiasaan Asmaul Husna" },
      { jenis: "Toilet Guru", jumlah: 2, baik: 2, rusakRingan: 0, rusakBerat: 0, keterangan: "Sanitasi mengalir lancar" },
      { jenis: "Toilet Murid", jumlah: 4, baik: 3, rusakRingan: 1, rusakBerat: 0, keterangan: "1 unit pintu toilet murid perlu perbaikan" },
      { jenis: "Gudang", jumlah: 1, baik: 0, rusakRingan: 1, rusakBerat: 0, keterangan: "Perlu penataan arsip dan inventaris fisik" },
      { jenis: "Kantin", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Kantin sehat ramah anak" },
      { jenis: "Lapangan Olahraga", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "Multifungsi upacara & bola voli" }
    ],
    timPenyusun: [
      { no: 1, nama: "IMAMUDIN, S. Pd.SD", nip: "197106172003121001", jabatanDinas: "Kepala Sekolah", jabatanTim: "Penanggung Jawab", tugas: "Memberikan arahan kebijakan makro, menetapkan regulasi, serta mengesahkan RKT & RKAS." },
      { no: 2, nama: "Ismi Kamaliyah, S.Pd.", nip: "199410142020122002", jabatanDinas: "Guru Kelas VI / Tim PBD", jabatanTim: "Ketua Tim Penyusun", tugas: "Memimpin telaah Rapor Pendidikan, merumuskan tabel lembar kerja RKT, serta menyusun draf naskah." },
      { no: 3, nama: "Retno Amalia, S.Pd.", nip: "-", jabatanDinas: "Guru Kelas III / Operator Dapodik", jabatanTim: "Sekretaris Tim", tugas: "Mempersiapkan instrumen administrasi, notulensi rapat, dan sinkronisasi data Dapodik." },
      { no: 4, nama: "Syifa Septiyani Fauziah, S.Pd.", nip: "199609212022212004", jabatanDinas: "Guru Kelas V / Bendahara BOS", jabatanTim: "Bendahara Tim", tugas: "Menyelaraskan alokasi anggaran belanja program kegiatan ke dalam format RKAS/ARKAS." },
      { no: 5, nama: "IDA ELISA", nip: "-", jabatanDinas: "Ketua Komite Sekolah", jabatanTim: "Anggota (Unsur Komite)", tugas: "Memberikan pertimbangan persetujuan kebutuhan sarana dan program kemitraan murid." },
      { no: 6, nama: "Dewan Guru & Tendik", nip: "-", jabatanDinas: "Pendidik & Tenaga Kependidikan", jabatanTim: "Anggota Tim", tugas: "Merumuskan target kinerja pada masing-masing 8 Standar Nasional Pendidikan." }
    ]
  };

  class MasterDataManager {
    constructor() {
      this.data = null;
      this.isInitialized = false;
      this.init();
    }

    init() {
      try {
        const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
          this.data = JSON.parse(saved);
        } else {
          this.data = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
        }

        this.ensureSchemaIntegrity();
        this.saveSilently();
        this.isInitialized = true;
        this.syncFromD1State();
      } catch (err) {
        console.error('Failed to init MasterData from localStorage, using defaults:', err);
        this.data = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
        this.isInitialized = true;
        this.syncFromD1State();
      }
    }


    async syncFromD1State() {
      try {
        const res = await fetch('/api/d1/state/master_data');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.state && typeof json.state === 'object') {
            console.log('[D1] Master Data terverifikasi & sinkron dari Cloudflare D1.');
            this.data = json.state;
            this.ensureSchemaIntegrity();
            this.saveSilently();
            this.syncToExternalModules();
            if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
              window.dispatchEvent(new CustomEvent('master-data-updated', { detail: this.data }));
            }
          }
        }
      } catch (_) {}
    }


    ensureSchemaIntegrity() {
      if (!this.data) this.data = {};
      const def = DEFAULT_MASTER_DATA;

      ['sekolah', 'pejabat', 'periode', 'bos'].forEach(section => {
        if (!this.data[section] || typeof this.data[section] !== 'object') {
          this.data[section] = JSON.parse(JSON.stringify(def[section]));
        } else {
          for (const key in def[section]) {
            if (this.data[section][key] === undefined || this.data[section][key] === null) {
              this.data[section][key] = def[section][key];
            }
          }
        }
      });

      // Validasi khusus RKT: Pengawas adalah Yeyen Anggraeni
      if (!this.data.pejabat.pengawasRktNama || this.data.pejabat.pengawasRktNama.includes('Sri Suci')) {
        this.data.pejabat.pengawasRktNama = def.pejabat.pengawasRktNama;
        this.data.pejabat.pengawasRktNip = def.pejabat.pengawasRktNip;
        this.data.pejabat.pengawasRktJabatan = def.pejabat.pengawasRktJabatan;
      }

      // Validasi tahun & tanggal cerdas (Smart Date & Year Logic):
      // 1. RKT selalu untuk tahun berikutnya (Tahun Berjalan + 1)
      // 2. Tanggal dokumen RKT selalu 31 Desember tahun berjalan
      const smart = getSmartRktDates();
      if (!this.data.periode.tahunRkt || parseInt(this.data.periode.tahunRkt) <= parseInt(smart.tahunBerjalan)) {
        this.data.periode.tahunBerjalan = smart.tahunBerjalan;
        this.data.periode.tahunRkt = smart.tahunRkt;
        this.data.periode.tahunAnggaran = smart.tahunAnggaran;
        this.data.periode.tahunPelajaran = smart.tahunPelajaran;
        this.data.periode.tahunDokumen = smart.tahunDokumen;
        this.data.periode.titimangsaTanggalPenetapan = smart.titimangsaTanggalPenetapan;
        this.data.periode.titimangsaTanggalValidasi = smart.titimangsaTanggalValidasi;
        this.data.periode.titimangsaTanggalPengantar = smart.titimangsaTanggalPengantar;
        this.data.periode.titimangsaTanggalUndangan = smart.titimangsaTanggalUndangan;
        this.data.periode.titimangsaTanggalBeritaAcara = smart.titimangsaTanggalBeritaAcara;
        this.data.periode.titimangsaTanggalSk = smart.titimangsaTanggalSk;
      }

      // Arrays integrity
      if (!Array.isArray(this.data.kelasDanSiswa) || this.data.kelasDanSiswa.length === 0) {
        this.data.kelasDanSiswa = JSON.parse(JSON.stringify(def.kelasDanSiswa));
      }
      if (!Array.isArray(this.data.tendik) || this.data.tendik.length === 0) {
        this.data.tendik = JSON.parse(JSON.stringify(def.tendik));
      }
      if (!Array.isArray(this.data.sarpras) || this.data.sarpras.length === 0) {
        this.data.sarpras = JSON.parse(JSON.stringify(def.sarpras));
      }
      if (!Array.isArray(this.data.timPenyusun) || this.data.timPenyusun.length === 0) {
        this.data.timPenyusun = JSON.parse(JSON.stringify(def.timPenyusun));
      }

      // Recompute total siswa per kelas
      this.recalculateTotals();
    }

    recalculateTotals() {
      if (Array.isArray(this.data.kelasDanSiswa)) {
        this.data.kelasDanSiswa.forEach(k => {
          const l = parseInt(k.laki) || 0;
          const p = parseInt(k.perempuan) || 0;
          k.total = l + p;
        });
      }
    }

    saveSilently() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
      } catch (e) {
        console.error('MasterData save error:', e);
      }
    }


    save() {
      this.recalculateTotals();
      this.saveSilently();

      // Trigger custom broadcast event
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        const ev = new CustomEvent('master-data-updated', { detail: this.data });
        window.dispatchEvent(ev);
      }

      // Sinkronkan ke Cloudflare D1 secara real-time
      try {
        fetch('/api/d1/state/master_data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: this.data })
        }).then(r => r.json()).then(res => {
          if (res.success) console.log('[D1 Realtime] Data Master (PTK, Siswa, Sarpras) tersimpan di Cloudflare D1');
        }).catch(() => {});
      } catch (_) {}

      // Sinkronisasi otomatis ke SIM-LAPOR (app.js) dan SIM-RKT (rkt_app.js)
      this.syncToExternalModules();
    }


    syncToExternalModules() {
      // 1. Sync ke SIM-LAPOR app.js
      if (window.simApp) {
        const sek = this.getSekolah();
        const pej = this.getPejabat(false);
        const per = this.getPeriode();
        window.simApp.settings = {
          sekolahNama: sek.nama,
          sekolahNpsn: sek.npsn,
          sekolahNss: sek.nss,
          sekolahAlamat: sek.alamat,
          sekolahDesa: sek.desa,
          sekolahKecamatan: sek.kecamatan,
          sekolahKabupaten: sek.kabupaten,
          sekolahProvinsi: sek.provinsi,
          sekolahDinas: sek.dinas,
          sekolahPemerintah: sek.pemerintah,
          kepalaNama: pej.kepalaNama,
          kepalaNip: pej.kepalaNip,
          kepalaPangkat: pej.kepalaPangkat,
          kepalaJabatan: pej.kepalaJabatan,
          pengawasNama: pej.pengawasNama,
          pengawasNip: pej.pengawasNip,
          pengawasJabatan: pej.pengawasJabatan,
          titimangsaTempat: per.titimangsaTempat,
          titimangsaTanggal: per.titimangsaTanggalPenetapan,
          tahunAjaran: per.tahunPelajaran
        };
        if (window.appStorage) {
          window.appStorage.saveSettings(window.simApp.settings).catch(() => {});
        }
      }

      // 2. Sync ke SIM-RKT rkt_app.js
      if (window.simRkt) {
        window.simRkt.syncWithMasterData();
      }
    }

    // =========================================================================
    // GETTERS DINAMIS (PEMANGGILAN DATA DARI MASTER)
    // =========================================================================
    getSekolah() {
      return Object.assign({}, this.data.sekolah);
    }

    getPejabat(khususRkt = false) {
      const p = Object.assign({}, this.data.pejabat);
      if (khususRkt) {
        // Gunakan pengawas khusus RKT (Ibu Yeyen Anggraeni)
        p.pengawasNama = this.data.pejabat.pengawasRktNama || "Yeyen Anggraeni, S.Pd.SD.";
        p.pengawasNip = this.data.pejabat.pengawasRktNip || "198610132010012016";
        p.pengawasJabatan = this.data.pejabat.pengawasRktJabatan || "Pengawas Sekolah Pembina Gugus";
      }
      return p;
    }

    getPeriode(baseDate = new Date()) {
      const smart = getSmartRktDates(baseDate);
      const stored = (this.data && this.data.periode) || {};
      return {
        ...smart,
        titimangsaTempat: stored.titimangsaTempat || (this.data && this.data.sekolah && this.data.sekolah.kecamatan) || "Margasari",
        tahunBerjalan: smart.tahunBerjalan,
        tahunRkt: smart.tahunRkt,
        tahunAnggaran: smart.tahunAnggaran,
        tahunPelajaran: smart.tahunPelajaran,
        tahunDokumen: smart.tahunDokumen,
        tahunLalu: smart.tahunLalu,
        tahunRapor: smart.tahunRapor,
        titimangsaTanggalPenetapan: smart.titimangsaTanggalPenetapan,
        titimangsaTanggalValidasi: smart.titimangsaTanggalValidasi,
        titimangsaTanggalPengantar: smart.titimangsaTanggalPengantar,
        titimangsaTanggalUndangan: smart.titimangsaTanggalUndangan,
        titimangsaTanggalBeritaAcara: smart.titimangsaTanggalBeritaAcara,
        titimangsaTanggalSk: smart.titimangsaTanggalSk,
        beritaAcaraHari: smart.beritaAcaraHari,
        beritaAcaraTanggalTerbilang: smart.beritaAcaraTanggalTerbilang,
        beritaAcaraBulan: smart.beritaAcaraBulan,
        beritaAcaraTahunTerbilang: smart.beritaAcaraTahunTerbilang
      };
    }

    getSmartRktDates(baseDate) {
      return getSmartRktDates(baseDate);
    }

    getSmartLaporDate(targetDate) {
      return getSmartLaporDate(targetDate);
    }

    getSmartLaporYear(targetDate) {
      return getSmartLaporYear(targetDate);
    }

    terbilang(n) {
      return angkaKeTerbilang(n);
    }

    getKelasDanSiswa() {
      this.recalculateTotals();
      return JSON.parse(JSON.stringify(this.data.kelasDanSiswa));
    }

    getKelas() {
      return this.getKelasDanSiswa();
    }

    getTotalSiswa() {
      this.recalculateTotals();
      return (this.data.kelasDanSiswa || []).reduce((acc, k) => acc + (parseInt(k.total) || 0), 0);
    }

    getTotalSiswaLaki() {
      return (this.data.kelasDanSiswa || []).reduce((acc, k) => acc + (parseInt(k.laki) || 0), 0);
    }

    getTotalSiswaPerempuan() {
      return (this.data.kelasDanSiswa || []).reduce((acc, k) => acc + (parseInt(k.perempuan) || 0), 0);
    }

    getBos() {
      const totalSiswa = this.getTotalSiswa();
      const paguPerSiswa = parseInt(this.data.bos.paguPerSiswa) || 900000;
      const totalPagu = totalSiswa * paguPerSiswa;

      const tw1 = Math.round(totalPagu * ((this.data.bos.tw1Persen || 30) / 100));
      const tw2 = Math.round(totalPagu * ((this.data.bos.tw2Persen || 40) / 100));
      const tw3 = Math.round(totalPagu * ((this.data.bos.tw3Persen || 15) / 100));
      const tw4 = totalPagu - (tw1 + tw2 + tw3);

      return {
        paguPerSiswa: paguPerSiswa,
        totalSiswa: totalSiswa,
        totalPagu: totalPagu,
        tw1Persen: this.data.bos.tw1Persen || 30,
        tw2Persen: this.data.bos.tw2Persen || 40,
        tw3Persen: this.data.bos.tw3Persen || 15,
        tw4Persen: this.data.bos.tw4Persen || 15,
        tw1Nilai: tw1,
        tw2Nilai: tw2,
        tw3Nilai: tw3,
        tw4Nilai: tw4
      };
    }

    getBosCalculation() {
      return this.getBos();
    }

    getTendik() {
      return JSON.parse(JSON.stringify(this.data.tendik || []));
    }

    getSarpras() {
      return JSON.parse(JSON.stringify(this.data.sarpras || []));
    }

    getTimPenyusun() {
      return JSON.parse(JSON.stringify(this.data.timPenyusun || []));
    }

    // =========================================================================
    // MUTASI / UPDATE DATA MASTER
    // =========================================================================
    updateSekolah(patch) {
      Object.assign(this.data.sekolah, patch);
      this.save();
    }

    updatePejabat(patch) {
      Object.assign(this.data.pejabat, patch);
      this.save();
    }

    updatePeriode(patch) {
      Object.assign(this.data.periode, patch);
      this.save();
    }

    updateBos(patch) {
      Object.assign(this.data.bos, patch);
      this.save();
    }

    updateKelas(index, patch) {
      if (this.data.kelasDanSiswa[index]) {
        Object.assign(this.data.kelasDanSiswa[index], patch);
        this.save();
      }
    }

    saveAllKelas(kelasList) {
      if (Array.isArray(kelasList)) {
        this.data.kelasDanSiswa = JSON.parse(JSON.stringify(kelasList));
        this.save();
      }
    }

    saveAllTendik(tendikList) {
      if (Array.isArray(tendikList)) {
        this.data.tendik = JSON.parse(JSON.stringify(tendikList));
        this.save();
      }
    }

    addTendik(ptk) {
      const id = 'ptk-' + Date.now();
      const no = (this.data.tendik.length || 0) + 1;
      const initials = (ptk.nama || 'G').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      const newPtk = Object.assign({ id, no, avatar: initials }, ptk);
      this.data.tendik.push(newPtk);
      this.save();
      return newPtk;
    }

    updateTendik(id, patch) {
      const idx = this.data.tendik.findIndex(t => t.id === id);
      if (idx !== -1) {
        Object.assign(this.data.tendik[idx], patch);
        this.save();
      }
    }

    deleteTendik(id) {
      this.data.tendik = this.data.tendik.filter(t => t.id !== id);
      this.data.tendik.forEach((t, i) => t.no = i + 1);
      this.save();
    }

    saveAllSarpras(sarprasList) {
      if (Array.isArray(sarprasList)) {
        this.data.sarpras = JSON.parse(JSON.stringify(sarprasList));
        this.save();
      }
    }

    addSarpras(item) {
      this.data.sarpras.push(Object.assign({ jenis: "Fasilitas Baru", jumlah: 1, baik: 1, rusakRingan: 0, rusakBerat: 0, keterangan: "-" }, item));
      this.save();
    }

    deleteSarpras(index) {
      if (this.data.sarpras[index]) {
        this.data.sarpras.splice(index, 1);
        this.save();
      }
    }

    saveAllTimPenyusun(timList) {
      if (Array.isArray(timList)) {
        this.data.timPenyusun = JSON.parse(JSON.stringify(timList));
        this.save();
      }
    }

    resetToDefaults() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
      this.save();
    }

    exportJson() {
      return JSON.stringify(this.data, null, 2);
    }

    importJson(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed && typeof parsed === 'object') {
          this.data = parsed;
          this.ensureSchemaIntegrity();
          this.save();
          return { success: true };
        }
      } catch (err) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'Format JSON data master tidak valid' };
    }
  }

  const DAFTAR_JABATAN_TIM = [
    {
      nama: "Penanggung Jawab Umum / Kepala Sekolah",
      tugas: "Memberikan arahan kebijakan makro, memonitor keterlaksanaan program kerja, memfasilitasi kebutuhan sarana anggaran, serta menandatangani pengesahan dokumen laporan kedinasan.",
      defaultGuru: "IMAMUDIN, S.Pd.SD"
    },
    {
      nama: "Ketua Pelaksana / Koordinator Program",
      tugas: "Memimpin dan mengkoordinasikan seluruh tahapan perencanaan, pengorganisasian jadwal kegiatan, membagi tugas teknis anggota, dan memastikan ketercapaian target indikator program."
    },
    {
      nama: "Sekretaris Pelaksana / Notulis",
      tugas: "Menyusun instrumen administrasi kegiatan, mengelola persuratan, mencatat notulensi rapat koordinasi tim, mengumpulkan bukti fisik dokumentasi, serta menyusun kompilasi draf laporan."
    },
    {
      nama: "Bendahara Pelaksana / Pengelola Anggaran",
      tugas: "Merencanakan alokasi anggaran operasional kegiatan sesuai juknis BOS/ARKAS, membukukan pengeluaran secara transparan, serta menyusun SPJ bukti pembelanjaan barang/jasa."
    },
    {
      nama: "Seksi Pembelajaran & Kurikulum",
      tugas: "Menelaah modul ajar, merancang instrumen asesmen pembelajaran kontekstual, memantau kemajuan belajar murid, dan mengkoordinasikan tindak lanjut hasil evaluasi akademik."
    },
    {
      nama: "Seksi Kesiswaan & Pembiasaan Karakter",
      tugas: "Mengorganisir partisipasi aktif peserta didik, mengawasi kedisiplinan pembiasaan harian, membina karakter budi pekerti, serta mengawal kegiatan kokurikuler dan lomba."
    },
    {
      nama: "Seksi Sarana Prasarana & TIK",
      tugas: "Menyiapkan ruang kelas/tempat pelaksanaan, memastikan kesiapan perangkat media digital, laptop/Chromebook, sound system, serta sarana pendukung lainnya."
    },
    {
      nama: "Fasilitator / Pendamping Lapangan",
      tugas: "Mendampingi peserta didik selama pelaksanaan aktivitas praktik lapangan secara langsung, memberikan instruksi teknis, dan menjamin keselamatan serta ketertiban murid."
    },
    {
      nama: "Anggota Pelaksana / Guru Pendamping",
      tugas: "Membantu kelancaran teknis operasional harian, berkolaborasi dalam pendampingan siswa, serta membantu pengumpulan data evaluasi kegiatan."
    }
  ];

  // Instansiasi Singleton Global
  const masterDb = new MasterDataManager();
  global.masterDb = masterDb;
  global.DEFAULT_MASTER_DATA = DEFAULT_MASTER_DATA;
  global.DAFTAR_JABATAN_TIM = DAFTAR_JABATAN_TIM;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MasterDataManager, masterDb, DEFAULT_MASTER_DATA, DAFTAR_JABATAN_TIM };
  }

})(typeof window !== 'undefined' ? window : global);
