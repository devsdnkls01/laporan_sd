/**
 * DATABASE 44 LAPORAN PELAKSANAAN PROGRAM SDN KALISALAK 01 TAHUN 2026
 * Modul Agregator Terpadu (< 2.000 Baris)
 * Menggabungkan reports_data_part1 s.d part5 dan pbd_data.
 */

const REPORTS_DATA = [
  ...((typeof window !== 'undefined' && window.REPORTS_DATA_PART1) || []),
  ...((typeof window !== 'undefined' && window.REPORTS_DATA_PART2) || []),
  ...((typeof window !== 'undefined' && window.REPORTS_DATA_PART3) || []),
  ...((typeof window !== 'undefined' && window.REPORTS_DATA_PART4) || []),
  ...((typeof window !== 'undefined' && window.REPORTS_DATA_PART5) || [])
];

const PBD_OFFICIAL_DATA = (typeof window !== 'undefined' && window.PBD_OFFICIAL_DATA) || {};

const currentRealtimeYear = new Date().getFullYear();

const DEFAULT_SETTINGS = {
  pengawasNama: "Sri Suci Margianah, S.Pd., M.Pd.",
  pengawasNip: "19800228 200801 2 006",
  pengawasJabatan: "Pengawas Pembina SD Kec. Margasari",
  kepalaNama: "IMAMUDIN, S.Pd.SD",
  kepalaNip: "19710617 200312 1 001",
  kepalaJabatan: "Kepala SD Negeri Kalisalak 01",
  sekolahNama: "SD NEGERI KALISALAK 01",
  sekolahNpsn: "20325895",
  sekolahAlamat: "JL. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kabupaten Tegal, Jawa Tengah 52463",
  titimangsaTempat: "Kalisalak",
  titimangsaTanggal: `31 Desember ${currentRealtimeYear}`,
  tahunAjaran: `${currentRealtimeYear}/${currentRealtimeYear + 1}`
};

if (typeof window !== 'undefined') {
  window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  window.REPORTS_DATA = REPORTS_DATA;
  window.INITIAL_REPORTS = REPORTS_DATA;
  window.PBD_OFFICIAL_DATA = PBD_OFFICIAL_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REPORTS_DATA, PBD_OFFICIAL_DATA, DEFAULT_SETTINGS };
}
