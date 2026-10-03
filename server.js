const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const { exec } = require('child_process');

// Inisialisasi Cloudflare D1 Service & Auto-load .env
const d1Service = require('./js/server/d1_service');

let PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Cloudinary Secure Configuration (Backend Only - NEVER sent to client)
const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'ixjihcvx',
  apiKey: process.env.CLOUDINARY_API_KEY || '691765734874534',
  apiSecret: process.env.CLOUDINARY_API_SECRET || 'bGDsN9ZSA1F837suY3vibpDpiqo',
  defaultFolder: 'sdn_kalisalak_01/laporan'
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.pdf': 'application/pdf'
};

/**
 * Upload gambar ke Cloudinary melalui backend proxy yang aman.
 */
function uploadImageToCloudinary({ file, folder, tags }) {
  return new Promise((resolve, reject) => {
    const targetFolder = folder || CLOUDINARY_CONFIG.defaultFolder;
    const timestamp = Math.floor(Date.now() / 1000);

    // Siapkan parameter yang wajib ditandatangani (disortir secara alfabetis)
    const signParams = [`folder=${targetFolder}`, `timestamp=${timestamp}`];
    if (tags) signParams.push(`tags=${tags}`);
    signParams.sort();

    const strToSign = signParams.join('&') + CLOUDINARY_CONFIG.apiSecret;
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const postPayload = JSON.stringify({
      file: file,
      api_key: CLOUDINARY_CONFIG.apiKey,
      timestamp: timestamp,
      folder: targetFolder,
      tags: tags || undefined,
      signature: signature
    });

    const req = https.request(
      {
        hostname: 'api.cloudinary.com',
        port: 443,
        path: `/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postPayload)
        },
        timeout: 60000
      },
      (res) => {
        let body = '';
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error((parsed.error && parsed.error.message) || `Cloudinary HTTP ${res.statusCode}`));
            }
          } catch (e) {
            reject(new Error(`Respon Cloudinary tidak valid: ${body.slice(0, 100)}`));
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Koneksi upload ke Cloudinary timeout (60 detik)'));
    });

    req.on('error', reject);
    req.write(postPayload);
    req.end();
  });
}

/**
 * Hapus gambar dari Cloudinary untuk mencegah file yatim (orphaned files).
 */
function destroyImageFromCloudinary(publicId) {
  return new Promise((resolve, reject) => {
    if (!publicId) return resolve({ result: 'no_id' });

    const timestamp = Math.floor(Date.now() / 1000);
    const strToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const postPayload = JSON.stringify({
      public_id: publicId,
      api_key: CLOUDINARY_CONFIG.apiKey,
      timestamp: timestamp,
      signature: signature
    });

    const req = https.request(
      {
        hostname: 'api.cloudinary.com',
        port: 443,
        path: `/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postPayload)
        },
        timeout: 30000
      },
      (res) => {
        let body = '';
        res.on('data', chunk => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            resolve({ result: 'parse_error', raw: body });
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Koneksi hapus ke Cloudinary timeout'));
    });

    req.on('error', reject);
    req.write(postPayload);
    req.end();
  });
}

/**
 * Helper untuk membaca JSON body dari request HTTP
 */
function readJsonBody(req, limitBytes = 35 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limitBytes) {
        req.destroy();
        reject(new Error('Ukuran file/payload melebihi batas 35MB'));
      } else {
        raw += chunk;
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch (e) {
        reject(new Error('Format JSON payload tidak valid'));
      }
    });
    req.on('error', reject);
  });
}

function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// =========================================================================
// KEAMANAN AKSES (OPSI B: WAJIB LEWAT .HTA)
// =========================================================================
const ACCESS_TOKEN = process.env.APP_ACCESS_TOKEN || 'kalisalak01_secure_key_9f82a17b3c';

function parseCookies(req) {
  const list = {};
  const rc = req.headers && req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function sendAccessDeniedHtml(res) {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>403 - AKSES DITOLAK // SDN KALISALAK 01</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Consolas', monospace; }
    body { background: #030804; color: #00ff66; display: flex; align-items: center; justify-content: center; height: 100vh; padding: 20px; text-align: center; }
    .box { border: 2px solid #ff3333; background: rgba(30, 5, 5, 0.95); padding: 35px 25px; max-width: 600px; box-shadow: 0 0 35px rgba(255, 51, 51, 0.35); border-radius: 6px; }
    h1 { color: #ff3333; font-size: 1.8rem; margin-bottom: 16px; letter-spacing: 2px; }
    p { color: #ccc; font-size: 0.95rem; line-height: 1.6; margin-bottom: 14px; }
    .badge { display: inline-block; background: #3a0000; color: #ff5555; border: 1px solid #ff3333; padding: 8px 16px; font-weight: bold; margin-top: 10px; font-size: 0.85rem; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>403 // AKSES DITOLAK</h1>
    <p>Situs ini dilindungi oleh Protokol Keamanan Zero-Trust <strong>SDN KALISALAK 01</strong>.</p>
    <p>Akses langsung via tautan publik <strong>DILARANG</strong>.</p>
    <div class="badge">WAJIB DIBUKA MELALUI: DASHBOARD_LAPORAN.hta</div>
  </div>
</body>
</html>`;

  res.writeHead(403, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // =========================================================================
  // ZERO-TRUST AUTHORIZATION CHECK (OPSI B)
  // =========================================================================
  const urlObj = new URL(req.url, 'http://localhost');
  const authKeyParam = urlObj.searchParams.get('auth_key');
  const cookies = parseCookies(req);
  const hasValidSession = cookies['sdn_auth_token'] === ACCESS_TOKEN;

  // 1. Jika membawa auth_key yang sah dari .hta, pasang cookie sesi lalu redirect ke URL bersih
  if (authKeyParam === ACCESS_TOKEN) {
    res.writeHead(302, {
      'Set-Cookie': `sdn_auth_token=${ACCESS_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
      'Location': '/'
    });
    res.end();
    return;
  }

  // 2. Jika tidak ada sesi cookie yang sah dan tidak ada auth_key sah -> TOLAK TOTAL (403)
  if (!hasValidSession) {
    sendAccessDeniedHtml(res);
    return;
  }

  let rawUrl = req.url.split('?')[0];
  let reqPath = decodeURI(rawUrl).replace(/\/+$/, '') || '/';

  // =========================================================================
  // API CLOUDFLARE D1 ENDPOINTS (DATABASE SERVERLESS SQLITE)
  // =========================================================================

  // 1. Status D1 & Konektivitas
  if (reqPath === '/api/d1/status' && req.method === 'GET') {
    const status = await d1Service.getStatus();
    sendJsonResponse(res, 200, status);
    return;
  }

  // 2. Inisialisasi Skema Tabel D1 (schema_d1.sql)
  if (reqPath === '/api/d1/init' && req.method === 'POST') {
    try {
      const results = await d1Service.initSchema();
      sendJsonResponse(res, 200, { success: true, message: 'Skema database Cloudflare D1 berhasil diinisialisasi', results });
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 3. Ambil Seluruh 44 Laporan dari D1
  if (reqPath === '/api/d1/reports' && req.method === 'GET') {
    try {
      const reports = await d1Service.getAllReports();
      sendJsonResponse(res, 200, { success: true, count: reports.length, reports });
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 4. Simpan Laporan Tunggal ke D1
  if (reqPath === '/api/d1/reports' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const result = await d1Service.saveReport(body);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 5. Simpan Sekumpulan Laporan (Batch Seed / Sinkronisasi Lokal ke D1)
  if (reqPath === '/api/d1/reports/batch' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const list = Array.isArray(body) ? body : (body.reports || []);
      const result = await d1Service.saveReportsBatch(list);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 6. Ambil Data RKT 2027 dari D1
  if (reqPath === '/api/d1/rkt' && req.method === 'GET') {
    try {
      const rkt = await d1Service.getRktData();
      sendJsonResponse(res, 200, { success: true, rkt });
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 7. Simpan Data RKT 2027 ke D1
  if (reqPath === '/api/d1/rkt' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const rktPayload = body.rktData || body;
      const result = await d1Service.saveRktData(rktPayload);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 8. Ambil Pengaturan Pejabat & Sekolah dari D1
  if (reqPath === '/api/d1/settings' && req.method === 'GET') {
    try {
      const settings = await d1Service.getSettings();
      sendJsonResponse(res, 200, { success: true, settings });
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // 9. Simpan Pengaturan Pejabat & Sekolah ke D1
  if (reqPath === '/api/d1/settings' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const settingsPayload = body.settings || body;
      const result = await d1Service.saveSettings(settingsPayload);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // =========================================================================
  // API CLOUDINARY ENDPOINTS (SECURE PROXY)
  // =========================================================================

  // Status & Konektivitas Cloudinary
  if (reqPath === '/api/cloudinary/status' && req.method === 'GET') {
    sendJsonResponse(res, 200, {
      online: true,
      configured: true,
      cloudName: CLOUDINARY_CONFIG.cloudName,
      folder: CLOUDINARY_CONFIG.defaultFolder,
      timestamp: Date.now()
    });
    return;
  }

  // Upload Foto ke Cloudinary & Hapus Foto Lama (Jika Mengganti Foto)
  if (reqPath === '/api/cloudinary/upload' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      if (!body.file) {
        return sendJsonResponse(res, 400, { success: false, error: 'Parameter "file" wajib disertakan' });
      }

      console.log(`[Cloudinary] Mengunggah foto ke Cloudinary (folder: ${body.folder || CLOUDINARY_CONFIG.defaultFolder})...`);
      const uploadResult = await uploadImageToCloudinary({
        file: body.file,
        folder: body.folder,
        tags: body.tags || 'sdn_kalisalak_01,simlapor'
      });

      console.log(`[Cloudinary] Sukses diunggah: ${uploadResult.public_id} (${uploadResult.secure_url})`);

      // JIKA PENGGUNA MENGGANTI FOTO: Hapus foto lama dari Cloudinary agar tidak menjadi file yatim
      let oldDeletedResult = null;
      if (body.oldPublicId && body.oldPublicId !== uploadResult.public_id) {
        try {
          console.log(`[Cloudinary] Menghapus file lama pengganti: ${body.oldPublicId}`);
          oldDeletedResult = await destroyImageFromCloudinary(body.oldPublicId);
          console.log(`[Cloudinary] Hasil penghapusan file lama:`, oldDeletedResult);
        } catch (delErr) {
          console.warn(`[Cloudinary] Peringatan: Gagal menghapus file lama ${body.oldPublicId}:`, delErr.message);
        }
      }

      sendJsonResponse(res, 200, {
        success: true,
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        created_at: uploadResult.created_at,
        oldDeleted: oldDeletedResult
      });
    } catch (err) {
      console.error('[Cloudinary] Gagal mengunggah:', err.message);
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // Hapus Foto dari Cloudinary (Saat Pengguna Menghapus Foto)
  if (reqPath === '/api/cloudinary/delete' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      if (!body.public_id) {
        return sendJsonResponse(res, 400, { success: false, error: 'Parameter "public_id" wajib disertakan' });
      }

      console.log(`[Cloudinary] Menghapus foto dari Cloudinary: ${body.public_id}...`);
      const destroyResult = await destroyImageFromCloudinary(body.public_id);
      console.log(`[Cloudinary] Sukses dihapus: ${body.public_id}`, destroyResult);

      sendJsonResponse(res, 200, {
        success: true,
        public_id: body.public_id,
        result: destroyResult.result || 'ok'
      });
    } catch (err) {
      console.error('[Cloudinary] Gagal menghapus:', err.message);
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // Handler for authentic Word Export (Identical to PDF pipeline)
  if (reqPath === '/api/export-docx') {
    if (req.method === 'POST') {
      try {
        const body = await readJsonBody(req, 50 * 1024 * 1024);
        if (!body.html) {
          return sendJsonResponse(res, 400, { success: false, error: 'Parameter "html" wajib disertakan' });
        }

        const cssPath = path.join(__dirname, 'css', 'style.css');
        const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

        const wordDocContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${body.title || 'Dokumen RKT Resmi'}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page SectionPortrait {
      size: 210mm 297mm;
      margin: 20mm 20mm 20mm 30mm;
      mso-page-orientation: portrait;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
    }
    div.rkt-print-page:not(.print-landscape),
    div.print-page:not(.print-landscape) {
      page: SectionPortrait;
      mso-page-orientation: portrait;
    }
    @page SectionLandscape {
      size: 297mm 210mm;
      margin: 20mm;
      mso-page-orientation: landscape;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
    }
    div.print-landscape,
    div.evaluasi-rkt-section,
    div.landscape-content,
    div.bab-3-section {
      page: SectionLandscape;
      mso-page-orientation: landscape;
    }
    ${cssContent}
  </style>
</head>
<body>
  <div id="print-section">
    ${body.html}
  </div>
</body>
</html>`;

        const rawFilename = (body.filename || 'Dokumen_RKT_Resmi').replace(/\.(docx|doc|pdf)$/i, '');
        const safeFilename = rawFilename.replace(/[^a-zA-Z0-9_\-\.]/g, '_') + '.doc';

        const buffer = Buffer.from('\ufeff' + wordDocContent, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/msword; charset=utf-8',
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Content-Length': buffer.length
        });
        res.end(buffer);
        return;
      } catch (err) {
        console.error('[DOCX Export] Error:', err);
        return sendJsonResponse(res, 500, { success: false, error: err.message });
      }
    } else {
      const defaultDocx = path.join(__dirname, 'dokumen_referensi', 'DRAFT RKT SD 2027', 'RKT_SDN_KALISALAK_01_TAHUN_2027_FINAL.docx');
      if (fs.existsSync(defaultDocx)) {
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="RKT_SDN_KALISALAK_01_TAHUN_2027.docx"'
        });
        fs.createReadStream(defaultDocx).pipe(res);
        return;
      }
    }
  }

  // Handler for authentic PDF Export (Mixed Portrait & Landscape)
  if (reqPath === '/api/export-pdf' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req, 50 * 1024 * 1024);
      if (!body.html) {
        return sendJsonResponse(res, 400, { success: false, error: 'Parameter "html" wajib disertakan' });
      }

      // Cari browser engine di Windows (Edge atau Chrome)
      const browserCandidates = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      ];
      let browserPath = browserCandidates.find(p => fs.existsSync(p));

      if (!browserPath) {
        return sendJsonResponse(res, 500, {
          success: false,
          error: 'Browser Edge/Chrome tidak ditemukan untuk rendering PDF headless.'
        });
      }

      const scratchDir = path.join(__dirname, 'scratch');
      if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

      const timestamp = Date.now();
      const tempHtmlPath = path.join(scratchDir, `render_${timestamp}.html`);
      const tempPdfPath = path.join(scratchDir, `export_${timestamp}.pdf`);

      const cssPath = path.join(__dirname, 'css', 'style.css');
      const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
      const baseHref = `file:///${__dirname.replace(/\\/g, '/')}/`;

      const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${body.title || 'Dokumen Dinas'}</title>
  <base href="${baseHref}">
  <style>
    ${cssContent}

    /* Rules for direct headless PDF rendering */
    html, body {
      background-color: #ffffff !important;
      color: #000000 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    #print-section {
      display: block !important;
      visibility: visible !important;
    }

    @page {
      size: A4 portrait;
      margin: 20mm 20mm 20mm 30mm;
    }

    @page landscape-section {
      size: A4 landscape;
      margin: 20mm;
    }

    @page cover-page {
      size: A4 portrait;
      margin: 20mm 20mm 20mm 30mm;
    }

    *, *:before, *:after {
      box-sizing: border-box !important;
    }

    html, body {
      width: 100% !important;
      background-color: #ffffff !important;
      color: #000000 !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'Times New Roman', Times, Georgia, serif !important;
      font-size: 12pt !important;
      line-height: 1.5 !important;
    }

    #print-section {
      display: block !important;
      visibility: visible !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .print-page:not(.print-landscape),
    .rkt-print-page:not(.print-landscape) {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
    }

    .rkt-print-page.print-landscape,
    .print-page.print-landscape,
    .print-landscape,
    .landscape-content,
    .evaluasi-rkt-section,
    .bab-3-section {
      page: landscape-section !important;
      break-before: page !important;
      page-break-before: always !important;
      break-after: page !important;
      page-break-after: always !important;
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
    }

    /* Tabel data resmi umum (Full-width default kecuali ditandai table-fit-content) */
    table.print-table,
    .print-table,
    .table-responsive table,
    .rkt-print-page table.print-table,
    .landscape-content table.print-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 8pt 0 !important;
    }

    /* Tipe A: Menyesuaikan Isi (Fit-Content, Jangan Paksa 100% Margin) */
    table.table-fit-content,
    .table-fit-content,
    .rkt-print-page table.table-fit-content,
    .landscape-content table.table-fit-content {
      width: auto !important;
      min-width: auto !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: auto !important;
      table-layout: auto !important;
    }

    /* Tipe B: Wajib Memenuhi Margin Maksimal (Full-Width 100%) */
    table.table-full-width,
    .table-full-width,
    .rkt-print-page table.table-full-width,
    .landscape-content table.table-full-width {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      table-layout: auto !important;
    }

    /* Tabel Titik Dua Kedinasan (Surat Undangan & Acara) */
    .table-titik-dua {
      width: 100% !important;
      border: none !important;
      border-collapse: collapse !important;
      margin: 4pt 0 8pt 0 !important;
      font-size: 10.5pt !important;
      line-height: 1.35 !important;
    }

    .table-titik-dua tr,
    .table-titik-dua td {
      border: none !important;
      padding: 2.5pt 4pt !important;
      vertical-align: top !important;
    }

    .table-titik-dua .col-label {
      width: 110px !important;
      min-width: 90px !important;
      white-space: nowrap !important;
      font-weight: 400 !important;
      border: none !important;
    }

    .table-titik-dua .col-colon {
      width: 15px !important;
      min-width: 15px !important;
      text-align: center !important;
      white-space: nowrap !important;
      border: none !important;
    }

    .kop-dinas-double {
      border-bottom: 3px double #000000 !important;
      padding-bottom: 6pt !important;
      margin-bottom: 12pt !important;
      width: 100% !important;
    }

    .landscape-content th,
    .landscape-content td,
    .rkt-print-page.print-landscape th,
    .rkt-print-page.print-landscape td,
    .print-landscape th,
    .print-landscape td {
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      word-break: normal !important;
      vertical-align: middle !important;
      box-sizing: border-box !important;
      padding: 3.5pt 4.5pt !important;
    }

    /* Kolom nomor urut tidak boleh terpotong / terbelah */
    .print-table th:first-child,
    .print-table td:first-child,
    .landscape-content th:first-child,
    .landscape-content td:first-child,
    .cell-no {
      white-space: nowrap !important;
      min-width: 38px !important;
      text-align: center !important;
    }

    .col-nowrap,
    .th-nowrap {
      white-space: nowrap !important;
    }

    /* DAFTAR ISI & DAFTAR TABEL RESMI (DOT LEADERS) */
    .toc-wrapper {
      width: 100% !important;
      margin-top: 10pt !important;
    }

    .toc-item {
      display: flex !important;
      align-items: baseline !important;
      width: 100% !important;
      margin-bottom: 3.5pt !important;
      font-size: 9.5pt !important;
      line-height: 1.35 !important;
    }

    .toc-item.toc-sub {
      padding-left: 18px !important;
      font-size: 9pt !important;
    }

    .toc-title {
      flex-shrink: 0 !important;
      white-space: nowrap !important;
    }

    .toc-dots {
      flex-grow: 1 !important;
      border-bottom: 1.5px dotted #000000 !important;
      margin: 0 5px 3px 5px !important;
      min-width: 20px !important;
    }

    .toc-page {
      flex-shrink: 0 !important;
      text-align: right !important;
      font-weight: 700 !important;
      min-width: 20px !important;
      font-variant-numeric: tabular-nums !important;
    }

    .toc-separator {
      height: 4pt !important;
    }

    .rkt-print-page:last-child,
    .print-page:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }

    /* Keutuhan Blok Tanda Tangan & Pengesahan Kedinasan (Keep Together) */
    .signature-block,
    .signature-container,
    .signature-table,
    .print-signature-block {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
      width: 100% !important;
    }

    .signature-block .name,
    .sig-name,
    .signature-name,
    .print-signature-name {
      break-after: avoid !important;
      page-break-after: avoid !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .signature-block .nip,
    .sig-nip,
    .signature-nip,
    .print-signature-nip {
      break-before: avoid !important;
      page-break-before: avoid !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .signature-block .role,
    .sig-title-role {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }
  </style>
</head>
<body>
  <div id="print-section">
    ${body.html}
  </div>
</body>
</html>`;

      fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

      const cmd = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${tempPdfPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;

      exec(cmd, (execErr) => {
        if (execErr) {
          console.error('[PDF Export] Gagal rendering headless PDF:', execErr);
          // Hapus file HTML temporary
          try { fs.unlinkSync(tempHtmlPath); } catch (_) {}
          return sendJsonResponse(res, 500, { success: false, error: 'Gagal membuat file PDF: ' + execErr.message });
        }

        if (!fs.existsSync(tempPdfPath)) {
          try { fs.unlinkSync(tempHtmlPath); } catch (_) {}
          return sendJsonResponse(res, 500, { success: false, error: 'File PDF tidak terbentuk oleh engine browser.' });
        }

        const safeFilename = (body.filename || 'Dokumen_Resmi.pdf').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Content-Length': fs.statSync(tempPdfPath).size
        });

        const readStream = fs.createReadStream(tempPdfPath);
        readStream.pipe(res);
        readStream.on('close', () => {
          // Bersihkan file temporer
          setTimeout(() => {
            try { fs.unlinkSync(tempHtmlPath); } catch (_) {}
            try { fs.unlinkSync(tempPdfPath); } catch (_) {}
          }, 1000);
        });
      });
    } catch (err) {
      console.error('[PDF Export] Error:', err);
      sendJsonResponse(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // Static File Serving
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Akses Ditolak');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Berkas tidak ditemukan: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    const url = 'http://localhost:' + portToTry;
    const d1Cfg = d1Service.getD1Config();
    const d1StatusText = d1Service.isConfigured() ? 'TERKONFIGURASI' : 'BELUM AKTIF (Lokal/IndexedDB Aktif)';

    console.log('================================================================');
    console.log('  SIM-LAPOR & RKT SDN KALISALAK 01 KECAMATAN MARGASARI');
    console.log('  Alamat Server Lokal    : ' + url);
    console.log('  Domain Publik Cloud    : ' + d1Cfg.publicDomain);
    console.log('  Database Cloudflare D1 : ' + d1StatusText);
    console.log('  Penyimpanan Cloudinary : ' + CLOUDINARY_CONFIG.cloudName);
    console.log('  Tekan Ctrl + C di jendela ini untuk menghentikan server.');
    console.log('================================================================');

    // Auto open browser directly to public domain with auth_key
    const targetBaseUrl = (d1Cfg.publicDomain && d1Cfg.publicDomain.trim() !== '') 
      ? 'https://' + d1Cfg.publicDomain.trim() 
      : url;
    const targetOpenUrl = targetBaseUrl + '/?auth_key=' + ACCESS_TOKEN;

    if (process.env.AUTO_OPEN !== 'false') {
      exec('start ' + targetOpenUrl);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    PORT++;
    console.log('Port sedang digunakan, beralih ke port ' + PORT + '...');
    startServer(PORT);
  } else {
    console.error('Terjadi kesalahan server:', err);
  }
});

// Do not auto-start if imported as a module
if (require.main === module) {
  startServer(PORT);
}

module.exports = { server, uploadImageToCloudinary, destroyImageFromCloudinary, CLOUDINARY_CONFIG };
