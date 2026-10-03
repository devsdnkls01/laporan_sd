/**
 * MASTER DATA PORTAL MULTI-ADMINISTRASI SDN KALISALAK 01
 * Terintegrasi penuh dengan dokumen resmi:
 * 1. RAPOR-PBD-SD-NEGERI-KALISALAK-01-20325895-DATA-2025 (1).xlsx (RKT & ARKAS)
 * 2. Administrasi Sekolah & Program Kerja 2026
 * 3. Pemetaan Mutu Pendidikan SPMI 2026 (8 Standar Nasional Pendidikan)
 * 4. SIM-LAPOR (44 Laporan Program Kerja)
 */

// ============================================================================
// 1. DATA LEMBAR KERJA RKT 2026 (RENCANA KERJA TAHUNAN)
// ============================================================================
const DEFAULT_RKT_ITEMS = [
  {
    id: "RKT-01",
    identifikasi: "A.2 Kemampuan numerasi",
    capaian: "Kurang (36,67% peserta didik mencapai batas kompetensi)",
    akarMasalah: "A.2.4 Kompetensi pada domain Data dan Ketidakpastian",
    kegiatanBenahi: "Peningkatan kompetensi pendidik dan kepala sekolah dalam penguatan domain Data dan Ketidakpastian",
    penjelasanKegiatan: "Pendidik mengikuti pelatihan mandiri pada Platform Rumah Pendidikan Kemendikdasmen, diskusi terstruktur di Komunitas Belajar (Kombel) sekolah, serta merancang modul ajar numerasi berbasis data kontekstual.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Peningkatan kompetensi guru untuk memperkuat numerasi",
    pj: "Hendry Badriarto, S.Pd. & Tim Numerasi"
  },
  {
    id: "RKT-02",
    identifikasi: "A.2 Kemampuan numerasi",
    capaian: "Kurang (36,67% peserta didik mencapai batas kompetensi)",
    akarMasalah: "A.1.2 Kompetensi membaca dan memahami teks sastra/soal cerita",
    kegiatanBenahi: "Penguatan kemampuan membaca pemahaman siswa dalam memecahkan soal numerasi kontekstual",
    penjelasanKegiatan: "Mengintegrasikan literasi membaca ke dalam pemecahan soal cerita numerasi dengan pembiasaan 'Math Morning / Berhitung Ceria' 10 menit sebelum KBM reguler di kelas I s.d VI.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pengembangan kegiatan literasi dan numerasi",
    pj: "Ismi Kamaliyah, S.Pd."
  },
  {
    id: "RKT-03",
    identifikasi: "A.1 Kemampuan literasi",
    capaian: "Kurang (40,00% peserta didik mencapai batas kompetensi)",
    akarMasalah: "A.1.2 Kompetensi membaca dan merefleksikan teks sastra",
    kegiatanBenahi: "Program Gerakan Literasi Sekolah (GLS) dan Revitalisasi Pojok Baca Kelas",
    penjelasanKegiatan: "Menumbuhkan budaya membaca 15 menit setiap hari sebelum KBM, penataan pojok baca kreatif di setiap ruang kelas, dan penyediaan buku bacaan nonteks cerita sastra bermutu yang ramah anak.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pemberdayaan perpustakaan dan pengadaan buku bacaan nonteks",
    pj: "Syifa Septiyani Fauziah, S.Pd."
  },
  {
    id: "RKT-04",
    identifikasi: "A.1 Kemampuan literasi",
    capaian: "Kurang (40,00% peserta didik mencapai batas kompetensi)",
    akarMasalah: "D.1.1 Manajemen kelas yang interaktif dan berpusat pada murid",
    kegiatanBenahi: "Peningkatan kualitas strategi manajemen kelas dan pembelajaran literasi aktif",
    penjelasanKegiatan: "Guru menerapkan metode membaca interaktif (shared reading, read aloud) serta menyusun lembar refleksi bacaan siswa bergradasi sesuai fase capaian.",
    butuhBiaya: "Tidak",
    posKegiatanArkas: "-",
    pj: "Siti Maria Ulfah, S.Pd."
  },
  {
    id: "RKT-05",
    identifikasi: "A.3 Karakter peserta didik",
    capaian: "Sedang (Indeks Karakter 52,17)",
    akarMasalah: "A.3.4 Dimensi Nalar Kritis dan Kemandirian Siswa",
    kegiatanBenahi: "Pembiasaan budaya nalar kritis, empati, dan gotong royong dalam KBM harian",
    penjelasanKegiatan: "Pemberian tugas berbasis projek mini di kelas, diskusi kelompok terarah, dan refleksi harian perilaku positif siswa.",
    butuhBiaya: "Tidak",
    posKegiatanArkas: "-",
    pj: "Santi Anggraeni, S.Pd.SD"
  },
  {
    id: "RKT-06",
    identifikasi: "A.3 Karakter peserta didik",
    capaian: "Sedang (Indeks Karakter 52,17)",
    akarMasalah: "D.1.3 Penerapan metode pembelajaran aktif pada Projek P5",
    kegiatanBenahi: "Penguatan Projek Penguatan Profil Pelajar Pancasila (P5) Berbasis Kearifan Lokal Tegal",
    penjelasanKegiatan: "Penyelenggaraan 2 tema projek P5 per tahun ajaran, gelar karya seni dan kreativitas siswa, serta pameran hasil karya daur ulang sampah ramah lingkungan.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Penyelenggaraan Projek Penguatan Profil Pelajar Pancasila (P5)",
    pj: "Retno Amalia, S.Pd."
  },
  {
    id: "RKT-07",
    identifikasi: "D.4 Iklim keamanan satuan pendidikan",
    capaian: "Baik (Skor Keamanan 65,01)",
    akarMasalah: "D.4.1 Pencegahan dan Penanganan Kekerasan di Satuan Pendidikan",
    kegiatanBenahi: "Penguatan Program Sekolah Ramah Anak dan Optimalisasi Tim TPPK Sekolah",
    penjelasanKegiatan: "Sosialisasi anti-perundungan (bullying) kepada seluruh murid dan wali murid, pemasangan poster edukatif, penyediaan kotak pengaduan rahasia, dan apel deklarasi sekolah aman nyaman.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pencegahan dan penanggulangan tindak kekerasan / Sekolah Ramah Anak",
    pj: "Mukhammad Lu'lu Khulaluddin"
  },
  {
    id: "RKT-08",
    identifikasi: "D.8 Iklim kebinekaan",
    capaian: "Baik (Skor Kebinekaan 67,80)",
    akarMasalah: "D.8.2 Sikap inklusif dan toleransi terhadap keberagaman",
    kegiatanBenahi: "Pembiasaan sikap toleransi, saling menghargai, dan pendidikan inklusif",
    penjelasanKegiatan: "Peringatan hari besar nasional dan keagamaan secara inklusif, pendampingan ramah bagi anak berkebutuhan khusus, serta penanaman lagu-lagu wajib nasional.",
    butuhBiaya: "Tidak",
    posKegiatanArkas: "-",
    pj: "Emma Puji Rakhastiwi, S.Pd."
  },
  {
    id: "RKT-09",
    identifikasi: "D.1 Kualitas pembelajaran",
    capaian: "Sedang (Skor Kualitas Pembelajaran 58,40)",
    akarMasalah: "D.1.2 Pemanfaatan perangkat TIK dan media digital sekolah",
    kegiatanBenahi: "Optimalisasi pemanfaatan Chromebook bantuan dinas dan akun Belajar.id",
    penjelasanKegiatan: "Simulasi asesmen digital murid kelas IV-VI berbantuan Chromebook, penggunaan aplikasi kuis interaktif (Quizizz/Kahoot), dan servis berkala perangkat IT.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pemeliharaan dan servis perangkat TIK / multimedia sekolah",
    pj: "Retno Amalia, S.Pd. (Operator TIK)"
  },
  {
    id: "RKT-10",
    identifikasi: "D.3 Kepemimpinan instruksional",
    capaian: "Sedang (Skor Kepemimpinan 55,20)",
    akarMasalah: "D.3.1 Supervisi akademik dan bimbingan guru secara berkala",
    kegiatanBenahi: "Pelaksanaan supervisi akademik klinis dan refleksi pasca observasi kelas",
    penjelasanKegiatan: "Kepala Sekolah melaksanakan observasi KBM kelas I s.d VI minimal 2 kali per semester dengan instrumen supervisi resmi, dilanjutkan sesi coaching dan umpan balik pembinaan.",
    butuhBiaya: "Tidak",
    posKegiatanArkas: "-",
    pj: "IMAMUDIN, S.Pd.SD (Kepala Sekolah)"
  },
  {
    id: "RKT-11",
    identifikasi: "E.1 Partisipasi warga sekolah",
    capaian: "Baik (Skor Kemitraan 62,50)",
    akarMasalah: "E.1.1 Kemitraan paguyuban kelas dan komite sekolah",
    kegiatanBenahi: "Rapat koordinasi rutin triwulanan bersama Komite Sekolah dan Paguyuban Kelas",
    penjelasanKegiatan: "Penyampaian transparansi program kerja, laporan perkembangan belajar anak, serta gotong royong kebersihan lingkungan sekolah.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Penyelenggaraan rapat pleno dan koordinasi komite sekolah",
    pj: "Syifa Septiyani Fauziah, S.Pd."
  },
  {
    id: "RKT-12",
    identifikasi: "E.2 Pengelolaan anggaran sekolah",
    capaian: "Baik (Transparansi Akuntabilitas 71,00)",
    akarMasalah: "E.2.1 Sinkronisasi RKT ke dalam RKAS/ARKAS tepat waktu",
    kegiatanBenahi: "Perencanaan Berbasis Data terpadu dan penatausahaan pembukuan BOS melalui aplikasi ARKAS",
    penjelasanKegiatan: "Operator ARKAS dan Bendahara menyusun anggaran berbasis bukti nyata Rapor PBD, pembukuan BKU berkala, serta pelaporan SPJ triwulanan secara transparan dan tertib pajak.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Penyusunan dokumen perencanaan dan pengelolaan ARKAS BOS",
    pj: "Syifa Septiyani Fauziah, S.Pd. (Operator BOS & ARKAS)"
  }
];

// ============================================================================
// 2. DATA LEMBAR KERJA ARKAS 2026 (RENCANA KEGIATAN & ANGGARAN SEKOLAH)
// ============================================================================
const DEFAULT_ARKAS_ITEMS = [
  {
    id: "ARKAS-01",
    rktRefId: "RKT-01",
    kegiatanBenahi: "Peningkatan kompetensi pendidik dalam penguatan domain Data dan Ketidakpastian",
    penjelasanKegiatan: "Workshop intensif bedah domain data dan penalaran matematika bagi seluruh dewan guru",
    kodeKegiatan: "02.04.01",
    kegiatanArkas: "Peningkatan kompetensi guru untuk memperkuat numerasi",
    uraianBarangJasa: "Honorarium Narasumber Pelatihan Guru & Konsumsi Kegiatan Kombel",
    bulan: "Juni",
    jumlah: 1,
    satuan: "Kegiatan",
    hargaSatuan: 1500000,
    total: 1500000
  },
  {
    id: "ARKAS-02",
    rktRefId: "RKT-02",
    kegiatanBenahi: "Penguatan kemampuan membaca pemahaman siswa dalam memecahkan soal numerasi",
    penjelasanKegiatan: "Pengadaan media alat peraga konkret untuk pembelajaran numerasi ramah anak di kelas I-VI",
    kodeKegiatan: "02.04.02",
    kegiatanArkas: "Pengembangan kegiatan literasi dan numerasi",
    uraianBarangJasa: "Pengadaan Kit Alat Peraga Matematika Manipulatif (Dakon, Kartu Bilangan, Bangun Ruang)",
    bulan: "Maret",
    jumlah: 6,
    satuan: "Paket",
    hargaSatuan: 350000,
    total: 2100000
  },
  {
    id: "ARKAS-03",
    rktRefId: "RKT-03",
    kegiatanBenahi: "Program Gerakan Literasi Sekolah (GLS) dan Revitalisasi Pojok Baca Kelas",
    penjelasanKegiatan: "Pengadaan bahan pustaka buku nonteks bacaan cerita sastra anak bermutu melalui SIPLah",
    kodeKegiatan: "03.01.05",
    kegiatanArkas: "Pengadaan buku teks dan nonteks pengayaan literasi",
    uraianBarangJasa: "Buku Cerita Fiksi & Sains Populer Anak Terbitan Terakreditasi Kemendikdasmen",
    bulan: "Mei",
    jumlah: 180,
    satuan: "Eksemplar",
    hargaSatuan: 45000,
    total: 8100000
  },
  {
    id: "ARKAS-04",
    rktRefId: "RKT-03",
    kegiatanBenahi: "Program Gerakan Literasi Sekolah (GLS) dan Revitalisasi Pojok Baca Kelas",
    penjelasanKegiatan: "Penataan fasilitas rak dan display pojok baca agar menarik dan nyaman di 6 ruang kelas",
    kodeKegiatan: "04.02.01",
    kegiatanArkas: "Pemeliharaan sarana dan prasarana ruang kelas & pojok baca",
    uraianBarangJasa: "Rak Kayu Buku Pojok Baca Ramah Anak Ruang Kelas I s.d VI",
    bulan: "Februari",
    jumlah: 6,
    satuan: "Unit",
    hargaSatuan: 450000,
    total: 2700000
  },
  {
    id: "ARKAS-05",
    rktRefId: "RKT-06",
    kegiatanBenahi: "Penguatan Projek Penguatan Profil Pelajar Pancasila (P5) Berbasis Kearifan Lokal",
    penjelasanKegiatan: "Penyelenggaraan pameran gelar karya kreasi budaya lokal dan produk daur ulang siswa",
    kodeKegiatan: "02.05.01",
    kegiatanArkas: "Penyelenggaraan Projek Penguatan Profil Pelajar Pancasila (P5)",
    uraianBarangJasa: "Bahan dan Perlengkapan Gelar Karya Siswa (Kain Kanvas, Cat Ramah Anak, Display)",
    bulan: "Oktober",
    jumlah: 1,
    satuan: "Paket",
    hargaSatuan: 2250000,
    total: 2250000
  },
  {
    id: "ARKAS-06",
    rktRefId: "RKT-07",
    kegiatanBenahi: "Penguatan Program Sekolah Ramah Anak dan Optimalisasi Tim TPPK Sekolah",
    penjelasanKegiatan: "Pemasangan media kampanye anti-bullying dan kotak aduan ramah anak di lingkungan sekolah",
    kodeKegiatan: "06.03.01",
    kegiatanArkas: "Pencegahan dan penanggulangan tindak kekerasan / Sekolah Ramah Anak",
    uraianBarangJasa: "Banner Standing & Poster Akrilik Edukasi Anti Perundungan & Kotak Saran",
    bulan: "Januari",
    jumlah: 10,
    satuan: "Lembar",
    hargaSatuan: 75000,
    total: 750000
  },
  {
    id: "ARKAS-07",
    rktRefId: "RKT-09",
    kegiatanBenahi: "Optimalisasi pemanfaatan Chromebook bantuan dinas dan akun Belajar.id",
    penjelasanKegiatan: "Pemeliharaan rutin perangkat Chromebook dan penyediaan kuota/akses internet lancar",
    kodeKegiatan: "04.05.02",
    kegiatanArkas: "Pemeliharaan dan servis perangkat TIK / multimedia sekolah",
    uraianBarangJasa: "Langganan Koneksi Internet Sekolah Kecepatan Tinggi & Servis Berkala IT",
    bulan: "Tiap Bulan (12x)",
    jumlah: 12,
    satuan: "Bulan",
    hargaSatuan: 450000,
    total: 5400000
  },
  {
    id: "ARKAS-08",
    rktRefId: "RKT-01",
    kegiatanBenahi: "Penyelenggaraan Asesmen Formatif, Sumatif ASTS, dan SAS Murid",
    penjelasanKegiatan: "Penggandaan instrumen asesmen dan lembar kerja formatif numerasi/literasi kelas I-VI",
    kodeKegiatan: "05.01.02",
    kegiatanArkas: "Penyelenggaraan asesmen diagnostik, formatif, dan sumatif sekolah",
    uraianBarangJasa: "Kertas HVS A4/F4 70gr dan Tinta Penggandaan Naskah Asesmen Siswa",
    bulan: "Maret",
    jumlah: 10,
    satuan: "Rim",
    hargaSatuan: 65000,
    total: 650000
  },
  {
    id: "ARKAS-09",
    rktRefId: "RKT-11",
    kegiatanBenahi: "Rapat koordinasi rutin triwulanan bersama Komite Sekolah dan Paguyuban Kelas",
    penjelasanKegiatan: "Penyelenggaraan pertemuan pleno pembinaan dan penyampaian hasil belajar bersama komite",
    kodeKegiatan: "08.01.03",
    kegiatanArkas: "Penyelenggaraan rapat pleno dan koordinasi komite sekolah",
    uraianBarangJasa: "Snack dan Konsumsi Rapat Pleno Evaluasi Kinerja bersama Komite Sekolah",
    bulan: "September",
    jumlah: 3,
    satuan: "Pertemuan",
    hargaSatuan: 400000,
    total: 1200000
  },
  {
    id: "ARKAS-10",
    rktRefId: "RKT-12",
    kegiatanBenahi: "Perencanaan Berbasis Data terpadu dan penatausahaan pembukuan BOS ARKAS",
    penjelasanKegiatan: "Pengadaan perlengkapan administrasi kantor, penjilidan dokumen kedinasan, dan materi perpajakan",
    kodeKegiatan: "07.01.01",
    kegiatanArkas: "Penyusunan dokumen perencanaan dan pengelolaan ARKAS BOS",
    uraianBarangJasa: "Paket ATK Administrasi Sekolah, Map Portofolio Siswa, & Penjilidan SPJ BOS",
    bulan: "Juli",
    jumlah: 1,
    satuan: "Paket",
    hargaSatuan: 3940000,
    total: 3940000
  }
];

// ============================================================================
// 3. DATA ADMINISTRASI SEKOLAH DAN PROGRAM KERJA 2026
// ============================================================================
const DEFAULT_ADMINISTRASI_2026 = [
  // A. BIDANG KURIKULUM & PEMBELAJARAN
  {
    id: "ADM-KUR-01",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kurikulum & Pembelajaran",
    namaDokumen: "Dokumen Kurikulum Operasional Satuan Pendidikan (KOSP) Tahun 2026",
    status: "Lengkap",
    pjNama: "IMAMUDIN, S.Pd.SD",
    keterangan: "Telah divalidasi oleh Pengawas Pembina dan disahkan Kepala Sekolah.",
    tanggalSelesai: "15 Juli 2026"
  },
  {
    id: "ADM-KUR-02",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kurikulum & Pembelajaran",
    namaDokumen: "Kalender Pendidikan Satuan Pendidikan TA 2026/2027",
    status: "Lengkap",
    pjNama: "Retno Amalia, S.Pd.",
    keterangan: "Mengacu pada Kalender Pendidikan Dinas Dikbud Kabupaten Tegal.",
    tanggalSelesai: "10 Juli 2026"
  },
  {
    id: "ADM-KUR-03",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kurikulum & Pembelajaran",
    namaDokumen: "Kumpulan Modul Ajar / RPP dan KKTP Guru Kelas I s.d VI",
    status: "Proses",
    pjNama: "Dewan Guru Kelas",
    keterangan: "Semester I telah lengkap 100%, Semester II dalam tahap penyusunan.",
    tanggalSelesai: "31 Agustus 2026"
  },
  {
    id: "ADM-KUR-04",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kurikulum & Pembelajaran",
    namaDokumen: "Buku Kerja Guru 1 s.d 4 Lengkap (Silabus/ATP, Jurnal, Nilai, Absensi)",
    status: "Lengkap",
    pjNama: "Dewan Guru Kelas & PJOK",
    keterangan: "Telah diperiksa berkala melalui supervisi akademik Kepala Sekolah.",
    tanggalSelesai: "10 September 2026"
  },

  // B. BIDANG PENGELOLAAN & KETENAGAAN
  {
    id: "ADM-KEL-01",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Pengelolaan & Ketenagaan",
    namaDokumen: "Surat Keputusan (SK) Pembagian Tugas Mengajar & Tugas Tambahan Guru 2026",
    status: "Lengkap",
    pjNama: "IMAMUDIN, S.Pd.SD",
    keterangan: "SK bernomor 421.2/015/04.68/2026 terdistribusi ke seluruh dewan guru.",
    tanggalSelesai: "18 Juli 2026"
  },
  {
    id: "ADM-KEL-02",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Pengelolaan & Ketenagaan",
    namaDokumen: "Jadwal Pelajaran Tematik/Mapel & Jadwal Guru Piket Harian",
    status: "Lengkap",
    pjNama: "Syifa Septiyani Fauziah, S.Pd.",
    keterangan: "Terpasang rapi di papan pengumuman ruang guru dan kantor sekolah.",
    tanggalSelesai: "20 Juli 2026"
  },
  {
    id: "ADM-KEL-03",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Pengelolaan & Ketenagaan",
    namaDokumen: "Buku Agenda Notula Rapat Dinas & Rapat Pleno Komite Sekolah",
    status: "Lengkap",
    pjNama: "Retno Amalia, S.Pd.",
    keterangan: "Terdokumentasi notula rapat dinas bulanan beserta daftar hadir resmi.",
    tanggalSelesai: "Bulanan"
  },
  {
    id: "ADM-KEL-04",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Pengelolaan & Ketenagaan",
    namaDokumen: "Instrumen Supervisi Akademik & Penilaian Kinerja Guru (PKG)",
    status: "Proses",
    pjNama: "IMAMUDIN, S.Pd.SD",
    keterangan: "Supervisi semester gasal terlaksana untuk 9 orang pendidik.",
    tanggalSelesai: "Oktober 2026"
  },

  // C. BIDANG KESISWAAN & EKSTRAKURIKULER
  {
    id: "ADM-SIS-01",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kesiswaan & Ekstrakurikuler",
    namaDokumen: "Buku Induk Peserta Didik & Buku Klapper Kelas I s.d VI",
    status: "Lengkap",
    pjNama: "Mukhammad Lu'lu Khulaluddin",
    keterangan: "Telah diverifikasi dan sinkron 100% dengan database Dapodikdasmen.",
    tanggalSelesai: "30 Agustus 2026"
  },
  {
    id: "ADM-SIS-02",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kesiswaan & Ekstrakurikuler",
    namaDokumen: "SK Tim Pencegahan dan Penanganan Kekerasan (TPPK) & Tata Tertib Siswa",
    status: "Lengkap",
    pjNama: "Syifa Septiyani Fauziah, S.Pd.",
    keterangan: "Telah dilaporkan pada portal resmi Kemendikdasmen dan dipajang di lobi.",
    tanggalSelesai: "05 Agustus 2026"
  },
  {
    id: "ADM-SIS-03",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kesiswaan & Ekstrakurikuler",
    namaDokumen: "Program Kerja & Absensi Ekstrakurikuler Wajib Pramuka",
    status: "Lengkap",
    pjNama: "Hendry Badriarto, S.Pd. & Emma Puji Rakhastiwi, S.Pd.",
    keterangan: "Latihan rutin setiap hari Jumat sore untuk regu Siaga dan Penggalang.",
    tanggalSelesai: "Mingguan"
  },
  {
    id: "ADM-SIS-04",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Kesiswaan & Ekstrakurikuler",
    namaDokumen: "Buku Catatan Pelayanan Bimbingan Konseling (BK) & Kasus Siswa",
    status: "Proses",
    pjNama: "Dewan Guru Kelas",
    keterangan: "Pencatatan pembinaan perilaku dan kunjungan rumah (home visit) siswa.",
    tanggalSelesai: "Berkala"
  },

  // D. BIDANG SARPRAS & PERSURATAN
  {
    id: "ADM-SAR-01",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Sarpras & Kearsipan",
    namaDokumen: "Buku Inventaris Barang Milik Daerah (KIR Ruang Kelas & Laboratorium)",
    status: "Lengkap",
    pjNama: "Mukhammad Lu'lu Khulaluddin",
    keterangan: "Inventarisasi meja, kursi, papan tulis, lemari, dan proyektor terdata lengkap.",
    tanggalSelesai: "15 September 2026"
  },
  {
    id: "ADM-SAR-02",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Sarpras & Kearsipan",
    namaDokumen: "Kartu Inventaris dan Pemeliharaan Perangkat TIK (Chromebook)",
    status: "Lengkap",
    pjNama: "Retno Amalia, S.Pd.",
    keterangan: "Perangkat Chromebook dalam kondisi terawat dan siap pakai di laboratorium.",
    tanggalSelesai: "Bulanan"
  },
  {
    id: "ADM-SAR-03",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Sarpras & Kearsipan",
    namaDokumen: "Buku Agenda Surat Masuk, Surat Keluar, & Buku Ekspedisi Dinas 2026",
    status: "Lengkap",
    pjNama: "Mukhammad Lu'lu Khulaluddin",
    keterangan: "Penomoran surat kedinasan tertib dan terarsip dalam binder fisik.",
    tanggalSelesai: "Harian"
  },
  {
    id: "ADM-SAR-04",
    tahunAjaran: "2026 / 2026-2027",
    kategori: "Sarpras & Kearsipan",
    namaDokumen: "Arsip Digital Cloud Satuan Pendidikan (Google Workspace)",
    status: "Lengkap",
    pjNama: "Syifa Septiyani Fauziah, S.Pd.",
    keterangan: "Seluruh berkas scan SK, laporan BOS, dan naskah dinas tercadangkan di cloud.",
    tanggalSelesai: "Aktif Realtime"
  }
];

// ============================================================================
// 4. DATA PEMETAAN MUTU PENDIDIKAN (SPMI 2026 SDN KALISALAK 01)
// ============================================================================
const DEFAULT_SPMI_2026 = [
  {
    id: "SPMI-SNP-01",
    standarSnp: "1. Standar Kompetensi Lulusan (SKL)",
    bobot: 15,
    skor: 76.5,
    kategori: "Menuju SNP 4 (Baik)",
    bintang: 4,
    fokusUtama: "Literasi (40%), Numerasi (36,67%), Karakter (52,17), dan Kebugaran Jasmani Murid",
    analisisMutu: "Capaian karakter dan kepedulian sosial murid tergolong baik. Fokus perbaikan mendesak berada pada kompetensi literasi membaca teks sastra dan penalaran domain data numerasi.",
    rekomendasiPbd: "Optimalisasi program pembiasaan membaca 15 menit, Math Morning, dan pendampingan remedial individual.",
    target2027: 85.0
  },
  {
    id: "SPMI-SNP-02",
    standarSnp: "2. Standar Isi",
    bobot: 10,
    skor: 82.0,
    kategori: "Memenuhi SNP (Sangat Baik)",
    bintang: 5,
    fokusUtama: "Struktur Kurikulum Merdeka, KOSP Kontekstual, dan Projek Penguatan Profil Pelajar Pancasila (P5)",
    analisisMutu: "Dokumen KOSP SDN Kalisalak 01 tersusun sangat lengkap dan memuat kekhasan budaya lokal Margasari Tegal. Pelaksanaan 2 tema P5 berjalan terencana.",
    rekomendasiPbd: "Mempertahankan mutu dokumen kurikulum dan memperluas variasi bahan ajar kontekstual berbasis lingkungan sekitar.",
    target2027: 88.0
  },
  {
    id: "SPMI-SNP-03",
    standarSnp: "3. Standar Proses",
    bobot: 15,
    skor: 74.0,
    kategori: "Menuju SNP 4 (Baik)",
    bintang: 4,
    fokusUtama: "Perencanaan Pembelajaran, Manajemen Kelas Interaktif, dan Pembelajaran Berdiferensiasi",
    analisisMutu: "Guru telah menyusun modul ajar secara tertib. Manajemen kelas perlu ditingkatkan agar lebih interaktif dan mengakomodasi keberagaman kesiapan belajar murid (diferensiasi).",
    rekomendasiPbd: "Pelatihan internal di Komunitas Belajar (Kombel) mengenai teknik asesmen diagnostik awal dan model pembelajaran berdiferensiasi.",
    target2027: 82.0
  },
  {
    id: "SPMI-SNP-04",
    standarSnp: "4. Standar Penilaian Pendidikan",
    bobot: 15,
    skor: 78.0,
    kategori: "Menuju SNP 4 (Baik)",
    bintang: 4,
    fokusUtama: "Asesmen Formatif, Asesmen Sumatif (ASTS & SAS), KKTP, dan Pelaporan e-Rapor",
    analisisMutu: "Sistem penilaian hasil belajar murid telah terlaksana secara berkala dan diolah menggunakan aplikasi e-Rapor resmi. Tindak lanjut pengayaan dan remedial perlu terdokumentasi lebih rapi.",
    rekomendasiPbd: "Menerapkan instrumen asesmen formatif harian yang variatif dan menyusun portofolio hasil karya murid secara konsisten.",
    target2027: 85.0
  },
  {
    id: "SPMI-SNP-05",
    standarSnp: "5. Standar Pendidik dan Tenaga Kependidikan (PTK)",
    bobot: 15,
    skor: 80.5,
    kategori: "Memenuhi SNP (Sangat Baik)",
    bintang: 5,
    fokusUtama: "Kualifikasi Akademik S1/S2, Sertifikasi Pendidik, Partisipasi PMM, dan Disiplin Kerja",
    analisisMutu: "100% dewan guru berkualifikasi sarjana (S.Pd/S.Pd.SD) dan aktif dalam kegiatan KKG Gugus Margasari. Pemanfaatan Platform Merdeka Mengajar (PMM) menunjukkan keaktifan tinggi.",
    rekomendasiPbd: "Mendorong guru untuk menyelesaikan aksi nyata di PMM dan mengikuti program peningkatan kompetensi numerasi daring.",
    target2027: 88.0
  },
  {
    id: "SPMI-SNP-06",
    standarSnp: "6. Standar Sarana dan Prasarana",
    bobot: 10,
    skor: 71.0,
    kategori: "Menuju SNP 3 (Cukup)",
    bintang: 3,
    fokusUtama: "Ruang Kelas, Pojok Baca, Toilet Sanitasi Murid, Sumber Air, dan Perangkat Chromebook",
    analisisMutu: "Gedung dan ruang kelas dalam kondisi kokoh dan terawat. Kebutuhan pengadaan bahan pustaka nonteks di pojok baca dan perbaikan minor sanitasi toilet perlu terus dialokasikan dari dana BOS.",
    rekomendasiPbd: "Alokasi bertahap pemeliharaan sanitasi toilet ramah anak dan penambahan koleksi buku fiksi ramah anak melalui SIPLah.",
    target2027: 80.0
  },
  {
    id: "SPMI-SNP-07",
    standarSnp: "7. Standar Pengelolaan",
    bobot: 10,
    skor: 84.0,
    kategori: "Memenuhi SNP (Sangat Baik)",
    bintang: 5,
    fokusUtama: "Manajemen Berbasis Sekolah (MBS), Perencanaan Berbasis Data (PBD), dan Kemitraan Komite",
    analisisMutu: "Kepala Sekolah memimpin dengan gaya demokratis, partisipatif, dan transparan. Hubungan kemitraan dengan Pengawas Pembina dan Pengurus Komite Sekolah terjalin sangat harmonis.",
    rekomendasiPbd: "Mempertahankan siklus evaluasi diri berbasis Rapor Pendidikan dan meningkatkan frekuensi diseminasi capaian sekolah kepada wali murid.",
    target2027: 90.0
  },
  {
    id: "SPMI-SNP-08",
    standarSnp: "8. Standar Pembiayaan",
    bobot: 10,
    skor: 85.0,
    kategori: "Memenuhi SNP (Sangat Baik)",
    bintang: 5,
    fokusUtama: "Pengelolaan Dana BOS Reguler, Penginputan Aplikasi ARKAS, Transparansi, dan Akuntabilitas SPJ",
    analisisMutu: "Penatausahaan keuangan BOS Reguler dikelola secara tertib oleh Operator BOS & ARKAS (Bu Syifa). Pembukuan BKU selalu tepat waktu dan nihil temuan audit administratif.",
    rekomendasiPbd: "Mempertahankan ketepatan waktu pelaporan SPJ triwulanan dan konsistensi belanja barang/jasa melalui SIPLah.",
    target2027: 92.0
  }
];

// ============================================================================
// 5. DATA LEMBAR KERJA RKT 2027 (PROYEKSI TARGET CAPAIAN MUTU 2027)
// ============================================================================
const DEFAULT_RKT_2027_ITEMS = [
  {
    id: "RKT27-01",
    identifikasi: "A.1 Kemampuan literasi murid",
    capaian: "Target 2027: > 75,00% (Kategori Baik / Mahir)",
    akarMasalah: "A.1.2 Kompetensi membaca teks informasi dan refleksi sastra",
    kegiatanBenahi: "Optimalisasi Gerakan Literasi Sekolah Terpadu & Digitalisasi Pojok Baca",
    penjelasanKegiatan: "Menyediakan koleksi e-book di perpustakaan digital, pemanfaatan Chromebook untuk membaca interaktif, dan penulisan karya mandiri antologi cerita anak.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pengembangan kegiatan literasi dan numerasi",
    pj: "Ismi Kamaliyah, S.Pd. & Tim Literasi"
  },
  {
    id: "RKT27-02",
    identifikasi: "A.2 Kemampuan numerasi murid",
    capaian: "Target 2027: > 70,00% (Kategori Baik)",
    akarMasalah: "A.2.4 Penalaran Domain Data, Aljabar, dan Geometri",
    kegiatanBenahi: "Pembelajaran Numerasi Berbasis Projek Kontekstual & Alat Peraga Manipulatif",
    penjelasanKegiatan: "Penerapan metode Pembelajaran Berbasis Masalah (PBL) dalam matematika kontekstual dan Math Morning terjadwal.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Peningkatan kompetensi guru untuk memperkuat numerasi",
    pj: "Hendry Badriarto, S.Pd."
  },
  {
    id: "RKT27-03",
    identifikasi: "A.3 Karakter Profil Pelajar Pancasila",
    capaian: "Target 2027: Indeks Karakter 65,00 (Kategori Membudaya)",
    akarMasalah: "A.3.4 Dimensi Mandiri, Nalar Kritis, dan Gotong Royong",
    kegiatanBenahi: "Penguatan Budaya Positif Sekolah dan Gelar Karya P5 Mandiri Siswa",
    penjelasanKegiatan: "Pelaksanaan 2 tema Projek P5, pembiasaan apel pagi bergiliran, dan festival unjuk bakat seni kearifan lokal.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Penyelenggaraan Projek Penguatan Profil Pelajar Pancasila (P5)",
    pj: "Santi Anggraeni, S.Pd.SD"
  },
  {
    id: "RKT27-04",
    identifikasi: "D.1 Kualitas pembelajaran interaktif",
    capaian: "Target 2027: Indeks Pembelajaran 75,00 (Kategori Terarah)",
    akarMasalah: "D.1.1 Manajemen kelas aktif dan penerapan asesmen formatif",
    kegiatanBenahi: "Workshop Pembelajaran Berdiferensiasi dan Lesson Study di Kombel",
    penjelasanKegiatan: "Guru rutin mendiskusikan strategi KBM diferensiasi, asesmen diagnostik berkala, dan refleksi teman sejawat.",
    butuhBiaya: "Tidak",
    posKegiatanArkas: "-",
    pj: "Siti Maria Ulfah, S.Pd."
  },
  {
    id: "RKT27-05",
    identifikasi: "D.3 Kepemimpinan instruksional",
    capaian: "Target 2027: Skor Kepemimpinan 70,00",
    akarMasalah: "D.3.1 Supervisi akademik klinis berkelanjutan",
    kegiatanBenahi: "Supervisi Pembelajaran Berbasis Coaching dan Umpan Balik Positif",
    penjelasanKegiatan: "Kepala Sekolah melaksanakan observasi KBM berkala 2 siklus per semester dengan tindak lanjut pembinaan personal.",
    butuhBiaya: "Tidak",
    posKegiatanArkas: "-",
    pj: "IMAMUDIN, S.Pd.SD (Kepala Sekolah)"
  },
  {
    id: "RKT27-06",
    identifikasi: "D.4 Iklim keamanan sekolah ramah anak",
    capaian: "Target 2027: Indeks Keamanan 80,00 (Sangat Aman)",
    akarMasalah: "D.4.1 Pencegahan dini kekerasan fisik dan perundungan siber",
    kegiatanBenahi: "Pemberdayaan Tim Pencegahan dan Penanganan Kekerasan (TPPK) Sekolah",
    penjelasanKegiatan: "Sosialisasi anti-bullying, pembentukan duta ramah anak, dan penyediaan ruang konseling ramah anak.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pencegahan dan penanggulangan tindak kekerasan / SRA",
    pj: "Mukhammad Lu'lu Khulaluddin"
  },
  {
    id: "RKT27-07",
    identifikasi: "D.8 Iklim kebinekaan dan inklusivitas",
    capaian: "Target 2027: Skor Kebinekaan 78,00 (Kategori Membudaya)",
    akarMasalah: "D.8.2 Budaya toleransi, kepedulian sosial, dan layanan disabilitas",
    kegiatanBenahi: "Pendidikan Inklusif Ramah Anak dan Peringatan Hari Besar Nasional",
    penjelasanKegiatan: "Peringatan hari besar secara kolaboratif, pentas kebudayaan daerah Tegal, dan santunan sosial murid.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Kegiatan kesiswaan dan pembinaan karakter",
    pj: "Emma Puji Rakhastiwi, S.Pd."
  },
  {
    id: "RKT27-08",
    identifikasi: "E.1 Partisipasi warga dan kemitraan",
    capaian: "Target 2027: Indeks Kemitraan 75,00",
    akarMasalah: "E.1.1 Peran serta aktif paguyuban kelas dan komite",
    kegiatanBenahi: "Penguatan Kemitraan Tri Sentra Pendidikan (Sekolah, Keluarga, Masyarakat)",
    penjelasanKegiatan: "Pertemuan paguyuban kelas dwibulanan, kelas inspirasi orang tua mengajar, dan bakti sosial lingkungan sekolah.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Rapat koordinasi komite dan sosialisasi program",
    pj: "Retno Amalia, S.Pd."
  },
  {
    id: "RKT27-09",
    identifikasi: "E.2 Pengelolaan akuntabilitas BOS",
    capaian: "Target 2027: Kepatuhan 100% (Akuntabel Sempurna)",
    akarMasalah: "E.2.1 Ketepatan waktu input ARKAS dan pembukuan BKU",
    kegiatanBenahi: "Digitalisasi Pembukuan Kas dan Pelaporan Realtime Berbasis ARKAS",
    penjelasanKegiatan: "Penutupan BKU setiap tanggal 10 bulan berikutnya, pengarsipan bukti belanja digital, dan transparansi papan BOS.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Penyusunan dokumen perencanaan dan pengelolaan BOS",
    pj: "Syifa Septiyani Fauziah, S.Pd. (Operator BOS & ARKAS)"
  },
  {
    id: "RKT27-10",
    identifikasi: "6. Standar Sarana dan Prasarana",
    capaian: "Target 2027: Kelayakan Sarpras 80,00%",
    akarMasalah: "Kerusakan ringan meja kursi murid dan plafon kelas",
    kegiatanBenahi: "Pemeliharaan Berkala Gedung, Ruang Kelas, dan Sanitasi Sehat",
    penjelasanKegiatan: "Pengecatan ruang kelas I-VI, perbaikan mebeler murid rusak ringan, dan pemeliharaan instalasi air bersih.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Pemeliharaan sarana dan prasarana sekolah",
    pj: "Hendry Badriarto, S.Pd."
  },
  {
    id: "RKT27-11",
    identifikasi: "5. Standar Pendidik dan Tenaga Kependidikan",
    capaian: "Target 2027: 100% Guru Tersertifikasi / Linier",
    akarMasalah: "Pemanfaatan media ajar interaktif dan IT",
    kegiatanBenahi: "Bimbingan Teknis Integrasi IT Chromebook dalam Pembelajaran Tematik",
    penjelasanKegiatan: "Pelatihan mandiri di Kombel mengenai pembuatan media ajar Canva for Education dan asesmen Quizizz.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Peningkatan kompetensi pendidik dan tenaga kependidikan",
    pj: "Retno Amalia, S.Pd."
  },
  {
    id: "RKT27-12",
    identifikasi: "2. Standar Isi dan KOSP",
    capaian: "Target 2027: Dokumen KOSP Unggul 100%",
    akarMasalah: "Penyelarasan kurikulum dengan perkembangan terbaru",
    kegiatanBenahi: "Review dan Validasi Dokumen KOSP Bersama Pengawas Pembina",
    penjelasanKegiatan: "Workshop penyusunan dan penelaahan KOSP TA 2027/2028 dengan mengintegrasikan 7 Permendikdasmen terbaru.",
    butuhBiaya: "Ya",
    posKegiatanArkas: "Penyusunan dokumen kurikulum operasional sekolah",
    pj: "IMAMUDIN, S.Pd.SD & Tim Pengembang Kurikulum"
  }
];

// ============================================================================
// 6. DAFTAR REGULASI BARU (PERMENDIKDASMEN 2025 & 2026 RESMI)
// ============================================================================
const DEFAULT_PERMENDIKDASMEN_LIST = [
  {
    nomor: "Permendikdasmen No. 10 Tahun 2025",
    tentang: "Standar Kompetensi Lulusan (SKL) pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
    fokus: "Penetapan kesatuan kriteria minimal capaian sikap, pengetahuan, dan keterampilan murid pada Fase A (Kelas 1-2), B (Kelas 3-4), dan C (Kelas 5-6).",
    kaitan: "Dasar penentuan target capaian kemampuan literasi dan numerasi minimal murid SDN Kalisalak 01.",
    fileRef: "PERMENDIKDASMEN-10-2025_SKL.pdf"
  },
  {
    nomor: "Permendikdasmen No. 12 Tahun 2025",
    tentang: "Standar Isi pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
    fokus: "Ruang lingkup materi pembelajaran Kurikulum Merdeka yang kontekstual, terpadu, adaptif, serta memfasilitasi keragaman potensi peserta didik.",
    kaitan: "Rujukan resmi penyusunan dokumen KOSP, Capaian Pembelajaran (CP), dan Modul Ajar dewan guru.",
    fileRef: "PERMENDIKDASMEN-12-2025_STANDAR ISI.pdf"
  },
  {
    nomor: "Salinan Permendikdasmen No. 1 Tahun 2026",
    tentang: "Standar Proses pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
    fokus: "Pelaksanaan proses KBM yang interaktif, inspiratif, menyenangkan, menantang, serta memotivasi murid berpartisipasi aktif dalam suasana aman.",
    kaitan: "Pedoman pengelolaan kelas interaktif, strategi asesmen diagnostik, dan KBM berdiferensiasi.",
    fileRef: "Salinan Permendikdasmen 1 2026 Standar Proses (JDIH).pdf"
  },
  {
    nomor: "Permendikdasmen No. 26 Tahun 2025",
    tentang: "Standar Pengelolaan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah",
    fokus: "Tata kelola satuan pendidikan berbasis Manajemen Berbasis Sekolah (MBS) dan Perencanaan Berbasis Data (PBD) dari Rapor Pendidikan.",
    kaitan: "Payung hukum wajib dalam penyusunan RKT, RKAS/ARKAS, dan evaluasi keterlaksanaan program tahunan.",
    fileRef: "Permendikdasmen 26 2025 Standar Pengelolaan (JDIH).pdf"
  },
  {
    nomor: "Permendikdasmen No. 21 Tahun 2025",
    tentang: "Standar Pendidik dan Tenaga Kependidikan (PTK)",
    fokus: "Kualifikasi akademik dan 4 pilar kompetensi guru (pedagogik, kepribadian, sosial, profesional) dan kepemimpinan manajerial kepala sekolah.",
    kaitan: "Dasar pelaksanaan kegiatan Komunitas Belajar (Kombel) dan peningkatan kompetensi guru secara mandiri.",
    fileRef: "Permendikdasmen No 21 Tahun 2025_PTK.pdf"
  },
  {
    nomor: "Permendikdasmen No. 21 Tahun 2026",
    tentang: "Sistem Penjaminan Mutu Internal (SPMI) Pendidikan Dasar dan Menengah",
    fokus: "Siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) mutu internal sekolah berdasarkan 8 SNP.",
    kaitan: "Landasan operasional audit mutu internal sekolah oleh Tim TPMPS SDN Kalisalak 01.",
    fileRef: "Permendikdasmen-no-21-tahun-2026_SPMI_E.pdf"
  },
  {
    nomor: "Permendikdasmen No. 8 Tahun 2026",
    tentang: "Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOS)",
    fokus: "Prinsip fleksibel, efektif, efisien, akuntabel, dan transparan dalam perencanaan pembelanjaan barang/jasa melalui SIPLah & ARKAS.",
    kaitan: "Juknis resmi penyusunan anggaran belanja BOS Reguler Rp 28.590.000 (2026) dan pagu anggaran 2027.",
    fileRef: "Permendikdasmen Nomor 8 Tahun 2026_JUKNIS BOS.pdf"
  }
];

// ============================================================================
// 7. NASKAH LENGKAP BUKU RKT BAB I - V (SESUAI DRAFT RKT SD 2027 RESMI)
// ============================================================================
const DEFAULT_RKT_BUKU_SDN_KALISALAK = {
  cover: {
    judul: "RENCANA KERJA TAHUNAN (RKT)",
    tahun: "2027",
    sekolah: "SD NEGERI KALISALAK 01",
    alamat: "JL. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kabupaten Tegal, Jawa Tengah 52463",
    pemerintah: "PEMERINTAH KABUPATEN TEGAL\nDINAS PENDIDIKAN DAN KEBUDAYAAN\nKABUPATEN TEGAL"
  },
  penetapan: {
    tempat: "Margasari",
    tanggal: "31 Desember 2026",
    kepalaNama: "IMAMUDIN, S.Pd.SD",
    kepalaNip: "19710617 200312 1 001",
    komiteNama: "SUWARDI, S.Pd.",
    kadisNama: "WINARTO, S.E., M.M.",
    kadisPangkat: "Pembina Tk. I",
    kadisNip: "19690125 199603 1 003",
    kadisJabatan: "Plt. Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Tegal"
  },
  validasi: {
    tempat: "Margasari",
    tanggal: "28 Desember 2026",
    pengawasNama: "Sri Suci Margianah, S.Pd., M.Pd.",
    pengawasNip: "19800228 200801 2 006",
    pengawasJabatan: "Pengawas Pembina SD Kecamatan Margasari"
  },
  bab1: {
    latarBelakang: "Pendidikan dasar merupakan tonggak fundamental dalam pembentukan kepribadian, karakter mulia, dan kompetensi literasi-numerasi murid. Sekolah Dasar Negeri Kalisalak 01 sebagai lembaga pendidikan dasar di lingkungan Dinas Pendidikan dan Kebudayaan Kabupaten Tegal memiliki tanggung jawab moral dan konstitusional untuk menyelenggarakan pendidikan yang berpusat pada murid (student-centered learning), aman, inklusif, dan berorientasi pada pencapaian standar mutu nasional.\n\nDalam mengimplementasikan prinsip Manajemen Berbasis Sekolah (MBS) dan Perencanaan Berbasis Data (PBD), dokumen Rencana Kerja Tahunan (RKT) Tahun 2027 ini disusun berdasarkan potret nyata mutu sekolah yang tercermin dalam Rapor Pendidikan Satuan Pendidikan tahun 2025/2026. Melalui RKT ini, seluruh prioritas pembenahan mutu diuraikan secara rinci dan terukur, serta diselaraskan dengan rencana penganggaran dana Bantuan Operasional Satuan Pendidikan (BOS) melalui aplikasi ARKAS.",
    tujuan: [
      "Menjamin keselarasan antara prioritas pembenahan mutu hasil analisis Rapor Pendidikan dengan rencana program operasional sekolah.",
      "Menjadi acuan baku bagi Tim Manajemen BOS dan Bendahara dalam menyusun dokumen RKAS pada aplikasi ARKAS secara efisien dan akuntabel.",
      "Memberikan kejelasan pembagian tugas kedinasan bagi seluruh dewan guru dan tenaga kependidikan dalam mengawal target mutu sekolah.",
      "Mewujudkan lingkungan belajar yang menyenangkan, ramah anak, bebas dari kekerasan, serta kaya akan budaya literasi dan numerasi."
    ]
  },
  bab2: {
    visi: "Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Terampil, Mandiri, dan Berwawasan Lingkungan.",
    misi: [
      "Menumbuhkembangkan penghayatan dan pengamalan ajaran agama dalam kehidupan sehari-hari.",
      "Melaksanakan proses pembelajaran yang aktif, kreatif, inovatif, dan berdiferensiasi.",
      "Mengembangkan budaya literasi membaca dan numerasi di seluruh lingkungan sekolah.",
      "Menumbuhkan jiwa kewirausahaan, gotong royong, dan nalar kritis melalui Projek P5.",
      "Mewujudkan lingkungan sekolah yang ASRI (Aman, Sehat, Rapi, dan Indah)."
    ],
    tujuanSekolah: "Menghasilkan lulusan yang bertakwa, memiliki kemampuan dasar literasi-numerasi di atas standar minimum, serta siap melanjutkan pendidikan ke jenjang SMP/sederajat dengan karakter Profil Pelajar Pancasila yang tangguh.",
    profilMurid: [
      { kelas: "Kelas I", jumlah: 25 },
      { kelas: "Kelas II", jumlah: 26 },
      { kelas: "Kelas III", jumlah: 24 },
      { kelas: "Kelas IV", jumlah: 28 },
      { kelas: "Kelas V", jumlah: 25 },
      { kelas: "Kelas VI", jumlah: 26 }
    ],
    totalMurid: 154,
    danaBos: {
      paguPerSiswa: 900000,
      totalPaguTahunan: 138600000,
      keterangan: "Estimasi Pagu Alokasi Dana BOS Reguler 154 Siswa x Rp 900.000"
    }
  },
  bab3: {
    ringkasanRapor: "Berdasarkan hasil Rapor Pendidikan PBD SDN Kalisalak 01 Tahun 2025/2026, capaian iklim keamanan dan karakter berada pada kategori Baik. Namun demikian, kompetensi literasi (40% mencapai batas minimum) dan numerasi (36,67% mencapai batas minimum) masih menjadi domain yang memerlukan pembenahan intensif, khususnya pada kompetensi penalaran teks sastra dan domain data.",
    rekomendasiPbd: "Memperkuat pembiasaan literasi 15 menit, revitalisasi pojok baca kelas ramah anak, pembiasaan Math Morning, optimalisasi Chromebook bantuan dinas, dan penguatan kolaborasi dewan guru melalui Komunitas Belajar (Kombel)."
  },
  bab5: {
    simpulan: "Rencana Kerja Tahunan (RKT) SD Negeri Kalisalak 01 Tahun 2027 merupakan peta jalan strategis operasional yang disusun secara partisipatif, transparan, dan akuntabel berbasis data nyata Rapor Pendidikan. Ketercapaian target dalam RKT ini sangat ditentukan oleh komitmen dan sinergi bersama antara kepala sekolah, dewan guru, komite sekolah, dan orang tua murid.",
    saran: [
      "Kepada Pendidik & Tenaga Kependidikan: Mempertahankan dedikasi, konsisten menjalankan refleksi di Kombel, serta menerapkan strategi KBM berdiferensiasi.",
      "Kepada Komite & Wali Murid: Memperkuat kemitraan positif dalam mendampingi kebiasaan belajar dan pembentukan karakter anak di rumah.",
      "Kepada Dinas Pendidikan & Pengawas Pembina: Senantiasa memberikan pembinaan, arahan, dan supervisi berkala demi kemajuan SDN Kalisalak 01."
    ]
  }
};

if (typeof window !== 'undefined') {
  window.DEFAULT_RKT_ITEMS = DEFAULT_RKT_ITEMS;
  window.DEFAULT_RKT_2027_ITEMS = DEFAULT_RKT_2027_ITEMS;
  window.DEFAULT_PERMENDIKDASMEN_LIST = DEFAULT_PERMENDIKDASMEN_LIST;
  window.DEFAULT_RKT_BUKU_SDN_KALISALAK = DEFAULT_RKT_BUKU_SDN_KALISALAK;
  window.DEFAULT_ARKAS_ITEMS = DEFAULT_ARKAS_ITEMS;
  window.DEFAULT_ADMINISTRASI_2026 = DEFAULT_ADMINISTRASI_2026;
  window.DEFAULT_SPMI_2026 = DEFAULT_SPMI_2026;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_RKT_ITEMS,
    DEFAULT_RKT_2027_ITEMS,
    DEFAULT_PERMENDIKDASMEN_LIST,
    DEFAULT_RKT_BUKU_SDN_KALISALAK,
    DEFAULT_ARKAS_ITEMS,
    DEFAULT_ADMINISTRASI_2026,
    DEFAULT_SPMI_2026
  };
}

