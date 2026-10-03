/**
 * MASTER DROPDOWN SPESIFIK PER LAPORAN (1 s.d 44)
 * SDN KALISALAK 01 - KECAMATAN MARGASARI
 * Menggabungkan modul Part 1 & Part 2 agar setiap file < 2.000 baris.
 */
window.REPORT_SPECIFIC_DROPDOWNS = Object.assign(
  {},
  (typeof window !== 'undefined' && window.DROPDOWNS_PART1) ? window.DROPDOWNS_PART1 : {},
  (typeof window !== 'undefined' && window.DROPDOWNS_PART2) ? window.DROPDOWNS_PART2 : {}
);

/* ==========================================================================
   GLOBAL REUSABLE FALLBACK BANKS (Extracted from app.js)
   ========================================================================== */
const BANK_KEGIATAN_SEKOLAH = [
  { kegiatan: "Rapat Koordinasi Tim Pelaksana & Penyusunan Program Kerja", target: "SK Tim Pelaksana & Matriks Program Kerja Definitif 2026", waktu: "Januari 2026" },
  { kegiatan: "Sosialisasi Program Kerja kepada Dewan Guru, Komite & Wali Murid", target: "100% Warga Sekolah Memahami Alur Pelaksanaan Program", waktu: "Januari 2026" },
  { kegiatan: "Pengadaan dan Penataan Sarana / Bahan Pendukung Kegiatan", target: "Ketersediaan Sarana & Bahan Pustaka/Media Siap Pakai 100%", waktu: "Februari 2026" },
  { kegiatan: "Pembiasaan Rutin Harian / Mingguan di Lingkungan Sekolah", target: "100% Peserta Didik Aktif Mengikuti Pembiasaan Terjadwal", waktu: "Februari - November 2026" },
  { kegiatan: "Workshop / Bimbingan Teknis Peningkatan Kompetensi Guru di Kombel", target: "100% Dewan Guru Menguasai Modul Ajar & Strategi KBM", waktu: "Maret & Agustus 2026" },
  { kegiatan: "Asesmen Formatif, Diagnostik & Pemantauan Ketercapaian Murid", target: "Terkumpulnya Rekap Nilai Evaluasi & Portofolio Siswa", waktu: "Tengah & Akhir Semester" },
  { kegiatan: "Gelar Karya / Pameran / Festival Unjuk Kebolehan Prestasi Siswa", target: "100% Kelas Menampilkan Karya & Partisipasi Kreatif", waktu: "Juni & Desember 2026" },
  { kegiatan: "Rapat Pleno Evaluasi Keterlaksanaan Program & Refleksi Mutu", target: "Notulensi Rapat Evaluasi & Catatan Pembenahan Kendala", waktu: "Juni & Desember 2026" },
  { kegiatan: "Penyusunan Draf Laporan Pertanggungjawaban & Bukti Fisik", target: "1 Bundel Dokumen Laporan Pelaksanaan Program Kerja Lengkap", waktu: "Desember 2026" },
  { kegiatan: "Pengesahan Naskah Resmi oleh Kepala Sekolah & Pengawas Pembina", target: "Naskah Laporan Bertandatangan Resmi & Terarsip Kedinasan", waktu: "31 Desember 2026" }
];

const DAFTAR_TARGET_PERSENTASE = [
  "100% (Tuntas Sempurna)",
  "95% (Sangat Tinggi)",
  "90% (Tinggi)",
  "85% (Optimal)",
  "80% (Baik)",
  "75% (Memadai)",
  "70% (Standar Minimum Kemendikdasmen)",
  "65% (Kategori Sedang Menuju Baik)",
  "60% (Kategori Cukup)",
  "50% (Tahap Pengenalan Awal)",
  "> 70% (Kategori Baik Rapor Pendidikan)",
  "> 65% (Kategori Sedang/Baik Rapor Pendidikan)",
  "100% Peserta Didik Terlibat Aktif",
  "100% Dewan Guru & Tenaga Kependidikan",
  "6 Ruang Kelas (100% Kelas I - VI)",
  "Nol Kasus Pelanggaran (0%)"
];

const BANK_INDIKATOR_SEKOLAH = [
  { indikator: "Capaian Indikator Mutu pada Rapor Pendidikan Satuan Pendidikan", defaultTarget: "> 70% (Kategori Baik)" },
  { indikator: "Tingkat Partisipasi Aktif Peserta Didik dalam Pembiasaan Rutin", defaultTarget: "100% Peserta Didik Terlibat Aktif" },
  { indikator: "Keterlaksanaan Agenda Program Sesuai Matriks Jadwal Kerja", defaultTarget: "100% (Tuntas Sempurna)" },
  { indikator: "Ketuntasan Capaian Kompetensi Minimum Peserta Didik", defaultTarget: "85% (Optimal)" },
  { indikator: "Ketersediaan dan Kelayakan Sarana Prasarana Pendukung Program", defaultTarget: "100% (Tuntas Sempurna)" },
  { indikator: "Tingkat Keterlibatan dan Kolaborasi Pendidik di Komunitas Belajar", defaultTarget: "100% Dewan Guru & Tenaga Kependidikan" },
  { indikator: "Kepatuhan dan Ketertiban Administrasi serta Pelaporan Kedinasan", defaultTarget: "100% (Tuntas Sempurna)" },
  { indikator: "Tingkat Kepuasan Orang Tua / Komite Sekolah terhadap Layanan", defaultTarget: "90% (Tinggi)" },
  { indikator: "Pencegahan Kasus Pelanggaran Tata Tertib dan Perundungan", defaultTarget: "Nol Kasus Pelanggaran (0%)" }
];
