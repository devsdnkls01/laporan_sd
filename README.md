# SISTEM INFORMASI MANAJEMEN LAPORAN & RKT
### SD NEGERI KALISALAK 01 — KECAMATAN MARGASARI, KABUPATEN TEGAL

Sistem administrasi pelaporan program kerja kedinasan, Rencana Kerja Tahunan (RKT 2027), dan Perencanaan Berbasis Data (PBD) dengan integrasi penuh ke **Cloudflare D1 Database (Serverless SQLite)**, **Cloudflare Zero-Trust Tunnel**, dan **Cloudinary Cloud Storage**.

---

## 📁 Struktur Direktori Proyek

```text
.administrasi_sd/
├── assets/                     # Berkas gambar, emblem 3D Kabupaten Tegal, logo resmi
├── bin/                        # Binary eksekusi sistem (cloudflared-windows-amd64.exe)
├── css/                        # Lembar gaya antarmuka (Responsive Modern Theme)
├── database/                   # Skema D1 (schema_d1.sql) & data master JSON
├── distribusi_guru/            # Paket rilis mandiri untuk laptop Dewan Guru
│   ├── Aplikasi_Guru_SDN_Kalisalak_01.zip  # Berkas instalasi resmi (534 KB)
│   ├── DASHBOARD_LAPORAN_GURU.hta          # Antarmuka desktop guru
│   ├── Pasang_Di_Laptop_Guru.bat           # 1-Klik installer pintasan desktop
│   └── PETUNJUK_PENGGUNAAN_GURU.txt        # Panduan bagi dewan guru
├── dokumen_referensi/          # Naskah rujukan kedinasan & format instrumen
├── js/                         # Logika sistem, pengontrol modul, & controller UI
│   ├── server/                 # Layanan backend (d1_service.js)
│   ├── app.js                  # Pengontrol utama 44 Laporan Program Kerja
│   ├── rkt_app.js              # Pengontrol utama RKT 2027 (Bab 1-5, EDS, SNP)
│   ├── master_data.js          # Repository master PTK, siswa, & sarpras
│   └── storage.js              # Lapisan persistensi real-time Cloudflare D1
├── scripts/                    # Skrip utilitas & otomatisasi pemeliharaan
│   ├── seed_d1.js              # Migrasi data master ke Cloudflare D1
│   ├── publish_release.js      # Otomatisasi rilis ke GitHub Releases
│   └── set_window_icon.ps1     # Win32 icon injector logo resmi
├── DASHBOARD_LAPORAN.hta       # Konsol peluncur host & server lokal
├── DASHBOARD LAPORAN SDN KALISALAK 01.lnk  # Pintasan 1-klik Admin
├── index.html                  # Antarmuka web terpadu
├── server.js                   # Node.js backend server & tunnel watchdog
└── package.json                # Konfigurasi dependensi & npm scripts
```

---

## 🚀 Perintah Utama (NPM Scripts)

* **Menjalankan Server Host:**
  ```bash
  npm start
  ```
* **Sinkronisasi Ulang Data ke Cloudflare D1:**
  ```bash
  npm run seed:d1
  ```
* **Menerbitkan Rilis Paket Guru ke GitHub:**
  ```bash
  npm run publish:release
  ```

---

## 🔒 Protokol Keamanan & Database
1. **Zero-Trust Lockdown:** Akses web publik diproteksi oleh token otentikasi sesi.
2. **Cloudflare D1 Serverless:** Seluruh perubahan teks, nilai tabel, dan status tersimpan permanen secara real-time.
3. **Auto-Termination:** Server dan tunnel otomatis berhenti instan saat aplikasi ditutup melalui tombol (X).
