/**
 * CLOUDFLARE D1 SERVICE FOR SIM-LAPOR SDN KALISALAK 01
 * Menangani koneksi, migrasi skema, dan operasi CRUD database serverless Cloudflare D1 (SQLite)
 * melalui Cloudflare v4 REST API.
 */
const fs = require('fs');
const path = require('path');

// 1. Parser .env sederhana & mandiri (zero external dependencies)
function loadEnv() {
  const rootDir = path.resolve(__dirname, '../../');
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// Jalankan auto-load env
loadEnv();

function getD1Config() {
  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    tunnelToken: process.env.CLOUDFLARE_TUNNEL_TOKEN || '',
    publicDomain: process.env.PUBLIC_DOMAIN || 'laporan_sdnkalisalak01.develzy.my.id'
  };
}

function isConfigured() {
  const cfg = getD1Config();
  return Boolean(cfg.accountId && cfg.databaseId && cfg.apiToken);
}

/**
 * Eksekusi query SQL tunggal ke Cloudflare D1 via REST API
 */
async function queryD1(sql, params = []) {
  const cfg = getD1Config();
  if (!cfg.accountId || !cfg.databaseId || !cfg.apiToken) {
    throw new Error('Konfigurasi Cloudflare D1 belum lengkap. Isi CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, dan CLOUDFLARE_API_TOKEN di file .env');
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/d1/database/${cfg.databaseId}/query`;

  const payload = {
    sql: sql,
    params: params
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfg.apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json();
  if (!resJson.success) {
    const errorMsg = (resJson.errors && resJson.errors[0] && resJson.errors[0].message) 
      ? resJson.errors[0].message 
      : JSON.stringify(resJson.errors || 'Unknown D1 error');
    throw new Error(`Cloudflare D1: ${errorMsg}`);
  }

  // Cloudflare D1 mengembalikan result array
  const firstResult = (resJson.result && resJson.result[0]) ? resJson.result[0] : null;
  return firstResult ? (firstResult.results || []) : [];
}

/**
 * Eksekusi sekumpulan instruksi SQL (multi-statement)
 */
async function executeRawSql(rawSql) {
  const cfg = getD1Config();
  if (!cfg.accountId || !cfg.databaseId || !cfg.apiToken) {
    throw new Error('Konfigurasi Cloudflare D1 belum lengkap di file .env');
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/d1/database/${cfg.databaseId}/query`;

  // Bersihkan komentar SQL sebelum memecah statement
  const cleanSql = rawSql.replace(/\/\*[\s\S]*?\*\/|--[^\n]*/g, '');
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const results = [];
  for (const st of statements) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfg.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql: st })
      });
      const data = await response.json();
      results.push(data);
    } catch (err) {
      console.warn('[D1 Statement Error]:', err.message);
    }
  }

  return results;
}

/**
 * Inisialisasi skema tabel database Cloudflare D1 dari file database/schema_d1.sql
 */
async function initSchema() {
  const rootDir = path.resolve(__dirname, '../../');
  const schemaPath = path.join(rootDir, 'database', 'schema_d1.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('File database/schema_d1.sql tidak ditemukan.');
  }

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  return await executeRawSql(schemaContent);
}

/**
 * Tes koneksi dan status D1
 */
async function getStatus() {
  const cfg = getD1Config();
  const configured = isConfigured();
  
  if (!configured) {
    return {
      configured: false,
      connected: false,
      message: 'Cloudflare D1 belum dikonfigurasi di file .env',
      accountId: cfg.accountId ? (cfg.accountId.slice(0, 4) + '***') : null,
      databaseId: cfg.databaseId ? (cfg.databaseId.slice(0, 4) + '***') : null,
      domain: cfg.publicDomain
    };
  }

  try {
    const res = await queryD1('SELECT 1 AS ok');
    return {
      configured: true,
      connected: true,
      message: 'Koneksi ke Cloudflare D1 berhasil terhubung',
      accountId: cfg.accountId.slice(0, 6) + '...',
      databaseId: cfg.databaseId.slice(0, 6) + '...',
      domain: cfg.publicDomain,
      test: res
    };
  } catch (err) {
    return {
      configured: true,
      connected: false,
      message: `Gagal terhubung ke Cloudflare D1: ${err.message}`,
      accountId: cfg.accountId.slice(0, 6) + '...',
      databaseId: cfg.databaseId.slice(0, 6) + '...',
      domain: cfg.publicDomain
    };
  }
}

/**
 * Ambil semua laporan dari D1
 */
async function getAllReports() {
  const rows = await queryD1('SELECT id, title, category, pj_name, pj_nip, status, data_json, updated_at FROM reports ORDER BY id ASC');
  return rows.map(r => {
    try {
      const parsed = JSON.parse(r.data_json || '{}');
      return {
        ...parsed,
        id: Number(r.id),
        title: r.title || parsed.title,
        category: r.category || parsed.category,
        pjName: r.pj_name || parsed.pjName,
        pjNip: r.pj_nip || parsed.pjNip,
        status: r.status || parsed.status,
        updatedAt: r.updated_at
      };
    } catch (e) {
      return {
        id: Number(r.id),
        title: r.title,
        category: r.category,
        pjName: r.pj_name,
        pjNip: r.pj_nip,
        status: r.status
      };
    }
  });
}

/**
 * Simpan laporan tunggal ke D1
 */
async function saveReport(report) {
  if (!report || !report.id) {
    throw new Error('Data laporan tidak valid (membutuhkan id)');
  }

  const sql = `
    INSERT INTO reports (id, title, category, pj_name, pj_nip, status, data_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      pj_name = excluded.pj_name,
      pj_nip = excluded.pj_nip,
      status = excluded.status,
      data_json = excluded.data_json,
      updated_at = CURRENT_TIMESTAMP
  `;

  const payloadStr = JSON.stringify(report);
  const params = [
    Number(report.id),
    report.title || '',
    report.category || '',
    report.pjName || '',
    report.pjNip || '',
    report.status || 'draft',
    payloadStr
  ];

  await queryD1(sql, params);
  return { success: true, id: report.id };
}

/**
 * Simpan sekumpulan laporan ke D1 (Batch Seed / Migration)
 */
async function saveReportsBatch(reports) {
  if (!Array.isArray(reports)) {
    throw new Error('Format laporan harus berupa array');
  }

  let count = 0;
  for (const r of reports) {
    if (r && r.id) {
      await saveReport(r);
      count++;
    }
  }

  return { success: true, count: count };
}

/**
 * Ambil data RKT 2027 dari D1
 */
async function getRktData() {
  const rows = await queryD1('SELECT data_json, updated_at FROM rkt_data WHERE id = 1');
  if (rows && rows.length > 0 && rows[0].data_json) {
    try {
      return JSON.parse(rows[0].data_json);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Simpan data RKT 2027 ke D1
 */
async function saveRktData(rktData) {
  if (!rktData) throw new Error('Data RKT tidak boleh kosong');

  const sql = `
    INSERT INTO rkt_data (id, tahun, data_json, updated_at)
    VALUES (1, '2027', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      data_json = excluded.data_json,
      updated_at = CURRENT_TIMESTAMP
  `;

  const jsonStr = JSON.stringify(rktData);
  await queryD1(sql, [jsonStr]);
  return { success: true, updated_at: new Date().toISOString() };
}

/**
 * Ambil data Pengaturan (Settings) dari D1
 */
async function getSettings() {
  const rows = await queryD1('SELECT * FROM settings WHERE id = 1');
  if (rows && rows.length > 0) {
    return rows[0];
  }
  return null;
}

/**
 * Simpan data Pengaturan (Settings) ke D1
 */
async function saveSettings(settings) {
  if (!settings) throw new Error('Data settings tidak boleh kosong');

  const sql = `
    INSERT INTO settings (id, pengawas_nama, pengawas_nip, pengawas_jabatan, kepala_nama, kepala_nip, kepala_jabatan, sekolah_nama, sekolah_npsn, sekolah_alamat, titimangsa_tempat, titimangsa_tanggal, tahun_ajaran, updated_at)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      pengawas_nama = excluded.pengawas_nama,
      pengawas_nip = excluded.pengawas_nip,
      pengawas_jabatan = excluded.pengawas_jabatan,
      kepala_nama = excluded.kepala_nama,
      kepala_nip = excluded.kepala_nip,
      kepala_jabatan = excluded.kepala_jabatan,
      sekolah_nama = excluded.sekolah_nama,
      sekolah_npsn = excluded.sekolah_npsn,
      sekolah_alamat = excluded.sekolah_alamat,
      titimangsa_tempat = excluded.titimangsa_tempat,
      titimangsa_tanggal = excluded.titimangsa_tanggal,
      tahun_ajaran = excluded.tahun_ajaran,
      updated_at = CURRENT_TIMESTAMP
  `;

  const params = [
    settings.pengawasNama || settings.pengawas_nama || '',
    settings.pengawasNip || settings.pengawas_nip || '',
    settings.pengawasJabatan || settings.pengawas_jabatan || '',
    settings.kepalaNama || settings.kepala_nama || '',
    settings.kepalaNip || settings.kepala_nip || '',
    settings.kepalaJabatan || settings.kepala_jabatan || '',
    settings.sekolahNama || settings.sekolah_nama || 'SD NEGERI KALISALAK 01',
    settings.sekolahNpsn || settings.sekolah_npsn || '20325895',
    settings.sekolahAlamat || settings.sekolah_alamat || '',
    settings.titimangsaTempat || settings.titimangsa_tempat || 'Margasari',
    settings.titimangsaTanggal || settings.titimangsa_tanggal || '31 Desember 2026',
    settings.tahunAjaran || settings.tahun_ajaran || '2026 / 2027'
  ];

  await queryD1(sql, params);
  return { success: true };
}

/**
 * Ambil data Rapor PBD dari D1
 */
async function getPbdData() {
  const rows = await queryD1('SELECT data_json, updated_at FROM pbd_data WHERE id = 1');
  if (rows && rows.length > 0 && rows[0].data_json) {
    try {
      return JSON.parse(rows[0].data_json);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Simpan data Rapor PBD ke D1
 */
async function savePbdData(pbdData) {
  if (!pbdData) throw new Error('Data PBD tidak boleh kosong');

  const sql = `
    INSERT INTO pbd_data (id, tahun, data_json, updated_at)
    VALUES (1, '2026', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      data_json = excluded.data_json,
      updated_at = CURRENT_TIMESTAMP
  `;

  const jsonStr = JSON.stringify(pbdData);
  await queryD1(sql, [jsonStr]);
  return { success: true, updated_at: new Date().toISOString() };
}

/**
 * Ambil State Sistem Arbitrer dari D1 (Key-Value)
 */
async function getSystemState(key) {
  if (!key) return null;
  const rows = await queryD1('SELECT value_json, updated_at FROM system_state WHERE key = ?', [key]);
  if (rows && rows.length > 0 && rows[0].value_json) {
    try {
      return JSON.parse(rows[0].value_json);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Simpan State Sistem Arbitrer ke D1 (Key-Value)
 */
async function saveSystemState(key, value) {
  if (!key) throw new Error('Key tidak boleh kosong');

  const sql = `
    INSERT INTO system_state (key, value_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = CURRENT_TIMESTAMP
  `;

  const jsonStr = JSON.stringify(value);
  await queryD1(sql, [key, jsonStr]);
  return { success: true, updated_at: new Date().toISOString() };
}

module.exports = {
  loadEnv,
  getD1Config,
  isConfigured,
  queryD1,
  executeRawSql,
  initSchema,
  getStatus,
  getAllReports,
  saveReport,
  saveReportsBatch,
  getRktData,
  saveRktData,
  getSettings,
  saveSettings,
  getPbdData,
  savePbdData,
  getSystemState,
  saveSystemState
};

