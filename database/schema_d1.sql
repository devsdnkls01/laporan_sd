-- ====================================================================
-- SKEMA DATABASE CLOUDFLARE D1 (SQLITE SERVERLESS)
-- SISTEM PELAPORAN PROGRAM KERJA SDN KALISALAK 01 KECAMATAN MARGASARI
-- ====================================================================

-- 1. TABEL PENGATURAN SEKOLAH & PEJABAT
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
    tahun_ajaran TEXT NOT NULL DEFAULT '2026 / 2026-2027',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL PENGGUNA (DEWAN GURU & KEPALA SEKOLAH)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    nama_lengkap TEXT NOT NULL,
    nip TEXT,
    role TEXT NOT NULL DEFAULT 'guru', -- 'admin', 'kepala_sekolah', 'guru'
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL 44 DOKUMEN LAPORAN PROGRAM KERJA
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY, -- 1 s.d 44
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    pj_name TEXT NOT NULL,
    pj_nip TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'completed'
    data_json TEXT NOT NULL, -- Menyimpan seluruh isian Bab I s.d Bab V
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL DOKUMENTASI FOTO (TERINTEGRASI CLOUDINARY)
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

-- Indeks untuk pencarian cepat di edge
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_photos_report ON report_photos(report_id);

-- 5. TABEL RENCANA KERJA TAHUNAN (RKT 2027)
CREATE TABLE IF NOT EXISTS rkt_data (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    tahun TEXT NOT NULL DEFAULT '2027',
    data_json TEXT NOT NULL, -- Menyimpan BAB I - V, General, dan Lampiran
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL PERENCANAAN BERBASIS DATA (RAPOR PENDIDIKAN / PBD)
CREATE TABLE IF NOT EXISTS pbd_data (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    tahun TEXT NOT NULL DEFAULT '2026',
    data_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL STATE SYSTEM & MASTER DATA DINAMIS (KEY-VALUE DI EDGE D1)
CREATE TABLE IF NOT EXISTS system_state (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

