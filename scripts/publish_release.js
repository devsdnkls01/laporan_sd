const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

function getGitHubToken() {
  try {
    const out = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
    const tokenMatch = out.match(/password=(.+)/);
    if (tokenMatch) return tokenMatch[1].trim();
  } catch (e) {
    console.error('Error getting credential:', e.message);
  }
  return null;
}

function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data || '{}');
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      if (Buffer.isBuffer(body)) req.write(body);
      else req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  const token = getGitHubToken();
  if (!token) {
    console.error('Tidak dapat menemukan token GitHub dari Git Credential Manager');
    process.exit(1);
  }
  console.log('GitHub Token ditemukan.');

  const owner = 'devsdnkls01';
  const repo = 'laporan_sd';
  const tag = 'v1.0.0';

  // 1. Cek apakah release sudah ada
  console.log('Memeriksa rilis di GitHub...');
  const listRes = await httpsRequest({
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/releases`,
    method: 'GET',
    headers: {
      'User-Agent': 'NodeJS-Release-Uploader',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  let existingRelease = null;
  if (Array.isArray(listRes.body)) {
    existingRelease = listRes.body.find(r => r.tag_name === tag);
  }

  let releaseData = existingRelease;

  if (!existingRelease) {
    console.log(`Membuat rilis GitHub baru untuk tag ${tag}...`);
    const createRes = await httpsRequest({
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/releases`,
      method: 'POST',
      headers: {
        'User-Agent': 'NodeJS-Release-Uploader',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, {
      tag_name: tag,
      name: 'Aplikasi Guru SDN Kalisalak 01 v1.0.0 (Resmi)',
      body: `### Aplikasi Guru SDN Kalisalak 01 - SIM-LAPOR & SIM-RKT\n\nPaket instalasi resmi untuk Laptop Bapak/Ibu Dewan Guru SDN Kalisalak 01.\n\n#### Isi Paket:\n1. **DASHBOARD_LAPORAN_GURU.hta** (Aplikasi Dashboard Mandiri)\n2. **Pasang_Di_Laptop_Guru.bat** (1-Klik Pasang Pintasan di Desktop Guru)\n3. **logo.ico** (Ikon Resmi 3D Lambang Kabupaten Tegal Emas)\n4. **PETUNJUK_PENGGUNAAN_GURU.txt** (Panduan Singkat Penggunaan)\n\n#### Cara Pemasangan di Laptop Guru:\n1. Unduh berkas **Aplikasi_Guru_SDN_Kalisalak_01.zip** di bawah ini.\n2. Klik kanan berkas zip lalu pilih **Extract All** (Ekstrak Semua).\n3. Buka folder hasil ekstrak, lalu klik dua kali file **Pasang_Di_Laptop_Guru.bat**.\n4. Ikon **DASHBOARD LAPORAN SDN KALISALAK 01** akan otomatis muncul di Layar Desktop Anda!\n5. Buka aplikasi, lalu klik tombol **Masuk Dashboard Laporan** untuk mulai bekerja.`,
      draft: false,
      prerelease: false
    });

    if (createRes.status < 200 || createRes.status >= 300) {
      console.error('Gagal membuat release:', createRes.body);
      process.exit(1);
    }
    releaseData = createRes.body;
    console.log('Rilis berhasil dibuat! ID:', releaseData.id);
  } else {
    console.log('Rilis sudah ada! ID:', releaseData.id);
  }

  // 2. Unggah file zip sebagai Asset
  const zipPath = path.join(__dirname, '..', 'distribusi_guru', 'Aplikasi_Guru_SDN_Kalisalak_01.zip');
  if (!fs.existsSync(zipPath)) {
    console.error('File zip tidak ditemukan:', zipPath);
    process.exit(1);
  }


  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`Mengunggah Aplikasi_Guru_SDN_Kalisalak_01.zip (${zipBuffer.length} bytes) ke GitHub Release...`);

  // Hapus asset lama jika sudah ada file bernama sama
  if (releaseData.assets && releaseData.assets.length > 0) {
    for (const a of releaseData.assets) {
      if (a.name === 'Aplikasi_Guru_SDN_Kalisalak_01.zip') {
        console.log('Menghapus asset lama...');
        await httpsRequest({
          hostname: 'api.github.com',
          path: `/repos/${owner}/${repo}/releases/assets/${a.id}`,
          method: 'DELETE',
          headers: {
            'User-Agent': 'NodeJS-Release-Uploader',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    }
  }

  const uploadUrlObj = new URL(releaseData.upload_url.replace('{?name,label}', ''));
  const uploadOptions = {
    hostname: uploadUrlObj.hostname,
    path: `${uploadUrlObj.pathname}?name=Aplikasi_Guru_SDN_Kalisalak_01.zip`,
    method: 'POST',
    headers: {
      'User-Agent': 'NodeJS-Release-Uploader',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/zip',
      'Content-Length': zipBuffer.length
    }
  };

  const uploadRes = await httpsRequest(uploadOptions, zipBuffer);
  if (uploadRes.status >= 200 && uploadRes.status < 300) {
    console.log('SUCCESS! File zip berhasil diunggah ke GitHub Releases!');
    console.log('Download URL:', uploadRes.body.browser_download_url);
    console.log('Release URL:', releaseData.html_url);
  } else {
    console.error('Gagal mengunggah asset:', uploadRes.body);
  }
}

run().catch(console.error);
