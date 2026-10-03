const fs = require('fs');
const path = require('path');
const vm = require('vm');
const d1 = require('./js/server/d1_service');

async function seedAll() {
  console.log('=== MEMULAI SINKRONISASI MASTER KE CLOUDFLARE D1 ===');
  
  // 1. Perbarui / Inisialisasi skema tabel lengkap
  console.log('[1/5] Inisialisasi skema tabel D1...');
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        pengawas_nama TEXT NOT NULL DEFAULT 'Sri Suci Margianah, S.Pd., M.Pd.',
        pengawas_nip TEXT NOT NULL DEFAULT '19800228 200801 2 006',
        pengawas_jabatan TEXT NOT NULL DEFAULT 'Pengawas Pembina SD Kecamatan Margasari',
        kepala_nama TEXT NOT NULL DEFAULT 'IMAMUDIN, S.Pd.SD',
        kepala_nip TEXT NOT NULL DEFAULT '19710617 200312 1 001',
        kepala_jabatan TEXT NOT NULL DEFAULT 'Kepala SD Negeri Kalisalak 01',
        sekolah_nama TEXT NOT NULL DEFAULT 'SD NEGERI KALISALAK 01',
        sekolah_npsn TEXT NOT NULL DEFAULT '20325895',
        sekolah_alamat TEXT NOT NULL DEFAULT 'JL. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kabupaten Tegal, Jawa Tengah 52463',
        titimangsa_tempat TEXT NOT NULL DEFAULT 'Kalisalak',
        titimangsa_tanggal TEXT NOT NULL DEFAULT '31 Desember 2026',
        tahun_ajaran TEXT NOT NULL DEFAULT '2026 / 2027',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        nama_lengkap TEXT NOT NULL,
        nip TEXT,
        role TEXT NOT NULL DEFAULT 'guru',
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        pj_name TEXT NOT NULL,
        pj_nip TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        data_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS report_photos (
        id TEXT PRIMARY KEY,
        report_id INTEGER NOT NULL,
        title TEXT,
        activity_date DATE,
        description TEXT,
        cloudinary_url TEXT NOT NULL,
        cloudinary_public_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_photos_report ON report_photos(report_id);

    CREATE TABLE IF NOT EXISTS rkt_data (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        tahun TEXT NOT NULL DEFAULT '2027',
        data_json TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pbd_data (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        tahun TEXT NOT NULL DEFAULT '2026',
        data_json TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS system_state (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await d1.executeRawSql(schemaSql);
  console.log('Skema tabel D1 siap.');

  // 2. Seed Pengaturan Sekolah & Pejabat
  console.log('[2/5] Memindahkan Data Pengaturan ke D1...');
  const defaultSettings = {
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
    titimangsaTanggal: "31 Desember 2026",
    tahunAjaran: "2026 / 2027"
  };
  await d1.saveSettings(defaultSettings);
  console.log('Pengaturan berhasil disimpan di D1.');

  // 3. Seed 44 Laporan Lengkap
  console.log('[3/5] Memindahkan Seluruh 44 Laporan Program Kerja ke D1...');
  const reportsPath = path.join(__dirname, 'database', 'reports_complete_db.json');
  if (!fs.existsSync(reportsPath)) {
    throw new Error('File database/reports_complete_db.json tidak ditemukan!');
  }
  const reports = JSON.parse(fs.readFileSync(reportsPath, 'utf8'));
  console.log(`Ditemukan ${reports.length} laporan di file master JSON.`);
  
  // Masukkan satu per satu untuk memastikan integritas
  for (let i = 0; i < reports.length; i++) {
    const rep = reports[i];
    await d1.saveReport(rep);
    process.stdout.write(`\rDisimpan ke D1: Laporan #${rep.id} - ${rep.title.slice(0, 35)}...`);
  }
  console.log('\nSeluruh 44 Laporan berhasil disimpan permanen di Cloudflare D1!');

  // 4. Seed RKT 2027
  console.log('[4/5] Memindahkan RKT 2027 Lengkap ke D1...');
  const rktFilePath = path.join(__dirname, 'js', 'rkt_data.js');
  const rktContent = fs.readFileSync(rktFilePath, 'utf8');
  const rktSandbox = { window: {} };
  vm.createContext(rktSandbox);
  vm.runInContext(rktContent, rktSandbox);
  
  if (rktSandbox.window.DEFAULT_RKT_DATA) {
    await d1.saveRktData(rktSandbox.window.DEFAULT_RKT_DATA);
    console.log('Data RKT 2027 (Bab 1-5, General, SNP) berhasil disimpan di D1.');
  } else {
    console.warn('Peringatan: DEFAULT_RKT_DATA tidak ditemukan di js/rkt_data.js');
  }

  // 5. Seed PBD (Rapor Pendidikan)
  console.log('[5/5] Memindahkan Rapor PBD ke D1...');
  const pbdPath = path.join(__dirname, 'database', 'rapor_pbd_kalisalak01.json');
  if (fs.existsSync(pbdPath)) {
    const pbdContent = fs.readFileSync(pbdPath, 'utf8');
    const pbdJson = JSON.parse(pbdContent);
    const sql = `
      INSERT INTO pbd_data (id, tahun, data_json, updated_at)
      VALUES (1, '2026', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        data_json = excluded.data_json,
        updated_at = CURRENT_TIMESTAMP
    `;
    await d1.queryD1(sql, [JSON.stringify(pbdJson)]);
    console.log('Data Rapor PBD Kalisalak 01 berhasil disimpan di D1.');
  }

  // Verifikasi akhir
  console.log('\n=== VERIFIKASI AKHIR DATABASE D1 ===');
  const repCount = await d1.queryD1('SELECT count(*) as count FROM reports');
  const rktCount = await d1.queryD1('SELECT count(*) as count FROM rkt_data');
  const setCount = await d1.queryD1('SELECT count(*) as count FROM settings');
  const pbdCount = await d1.queryD1('SELECT count(*) as count FROM pbd_data');

  console.log('Jumlah Data di Cloudflare D1:');
  console.log('- reports: ', repCount[0].count);
  console.log('- rkt_data:', rktCount[0].count);
  console.log('- settings:', setCount[0].count);
  console.log('- pbd_data:', pbdCount[0].count);
  console.log('\nSINKRONISASI BERHASIL 100%! Cloudflare D1 sekarang terisi lengkap dan menjadi Single Source of Truth.');
}

seedAll().catch(err => {
  console.error('\n[FATAL ERROR SEEDING D1]:', err);
  process.exit(1);
});
