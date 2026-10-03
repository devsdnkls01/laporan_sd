# PANDUAN STANDAR REUSABLE UI COMPONENTS (SIM-UI)

## Portal Administrasi & SIM-Lapor SD Negeri Kalisalak 01

Dokumen ini merupakan panduan teknis dan standar desain (*living design system*) untuk seluruh pengembang dalam membangun dan memperbarui antarmuka aplikasi. Seluruh komponen bersifat murni Vanilla JS, ringan (*zero dependency*), modular, dan terpusat di bawah namespace `window.SIM_UI`.

---

## 1. Arsitektur & Direktori Komponen

```text
d:\DEVELZY\.administrasi_sd/
├── css/
│   ├── style.css               # Styling global & @media print
│   └── components.css          # Styling terstandar untuk seluruh komponen SIM-UI
└── js/components/
    ├── ui_core.js              # Utilitas escape HTML, class merger, registry ikon SVG
    ├── ui_buttons.js           # Komponen tombol seragam (Primary, Success, Danger, Outline)
    ├── ui_forms.js             # Komponen Input, Select, Textarea, FormGroup
    ├── ui_tables.js            # Komponen Data Table dinamis & sel terstandar
    ├── ui_cards.js             # Komponen Section Card dengan badge pill & toolbar
    ├── ui_modals.js            # Komponen Modal Dialog & Konfirmasi Interaktif
    ├── ui_feedback.js          # Komponen Floating Toasts & Status Badges
    └── index.js                # Bundle utama: window.SIM_UI
```

---

## 2. Katalog Komponen & Contoh Penggunaan

### A. Tombol (`SIM_UI.button`)

Menghasilkan string HTML elemen button dengan kelas standar, ikon SVG, dan varian warna konsisten.

```javascript
// Contoh: Tombol Tambah Data
window.SIM_UI.button({
  text: 'Tambah Belanja ARKAS',
  icon: 'plus',           // 'plus' | 'download' | 'print' | 'trash' | 'check' | 'refresh' | 'doc'
  variant: 'primary',     // 'primary' | 'success' | 'danger' | 'outline' | 'outline-danger' | 'secondary' | 'ghost'
  size: 'sm',             // 'xs' | 'sm' | 'md' | 'lg'
  onClick: 'window.simRkt.addArkasRow()'
});

// Contoh: Tombol Unduh PDF
window.SIM_UI.button({
  text: 'Unduh PDF Resmi',
  icon: 'download',
  variant: 'success',
  size: 'md',
  onClick: 'window.simRkt.downloadRktPdf()'
});
```

---

### B. Form Controls & Input (`SIM_UI.input`, `SIM_UI.select`, `SIM_UI.textarea`, `SIM_UI.formGroup`)

#### 1. Form Group & Input Teks

```javascript
window.SIM_UI.formGroup({
  label: 'Visi Sekolah',
  hint: 'Cita-cita luhur satuan pendidikan',
  content: window.SIM_UI.input({
    value: b2.visi || '',
    placeholder: 'Tuliskan visi sekolah...',
    onInput: "window.simRkt.updateBab2('visi', this.value)"
  })
});
```

#### 2. Textarea Naratif Panjang

Untuk teks naratif panjang seperti Latar Belakang dan Simpulan Akhir:

```javascript
window.SIM_UI.formGroup({
  label: 'Teks Simpulan Akhir (Naratif)',
  content: window.SIM_UI.textarea({
    rows: 7,
    value: b5.simpulan || '',
    placeholder: 'Tulis uraian simpulan strategis RKT...',
    onInput: "window.simRkt.updateBab5('simpulan', this.value)"
  })
});
```

#### 3. Dynamic List / Form Butir Poin Mandiri (`SIM_UI.dynamicList`)

Komponen terstandar untuk seluruh form berbasis butir daftar (Landasan Hukum/Peraturan, Tujuan Khusus, Misi, Tujuan Sekolah, dan Saran Stakeholder). Setiap butir memiliki baris tersendiri, nomor urut otomatis yang dinamis, tombol hapus dengan konfirmasi, dan tombol tambah butir baru:

```javascript
window.SIM_UI.dynamicList({
  id: 'misi-sekolah-list',
  title: '🎯 Butir Misi Satuan Pendidikan',
  badgeText: `${(b2.misi || []).length} Butir Misi`,
  badgeColor: 'blue', // 'blue' | 'green' | 'amber' | 'purple' | 'red'
  items: b2.misi || [],
  placeholder: 'Tulis butir misi sekolah...',
  addButtonText: 'Tambah Butir Misi',
  onUpdateItem: (idx) => `window.simRkt.updateListItem('bab2', 'misi', ${idx}, this.value)`,
  onAddItem: `window.simRkt.addListItem('bab2', 'misi')`,
  onRemoveItem: (idx) => `window.simRkt.removeListItem('bab2', 'misi', ${idx})`
});
```

#### 3. Select / Dropdown Standar ARKAS

```javascript
window.SIM_UI.select({
  value: ra.satuan || 'Paket',
  options: window.SIM_UI.presets.arkasSatuan, // Otomatis memuat 17 satuan baku ARKAS
  onChange: `window.simRkt.updateArkasCell(${idx}, 'satuan', this.value)`
});
```

---

### C. Tabel Data Terpusat (`SIM_UI.table`)

Menstandarkan rendering tabel dengan kolom yang fleksibel dan terproteksi dari masalah teks terpotong:

```javascript
window.SIM_UI.table({
  id: 'table-rencana-arkas',
  columns: [
    { key: 'no', label: 'No', width: '38px', align: 'center', type: 'number-badge' },
    { key: 'kegiatanArkas', label: 'Kegiatan ARKAS', width: '180px', bold: true },
    { key: 'uraian', label: 'Rincian Uraian Belanja', type: 'input-text', onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'uraian', this.value)` },
    { key: 'bulan', label: 'Bulan', width: '125px', type: 'input-text', onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'bulan', this.value)` },
    { key: 'jumlah', label: 'Jml', width: '60px', align: 'center', type: 'input-number', min: 1, onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'jumlah', this.value)` },
    { key: 'satuan', label: 'Satuan', width: '120px', align: 'center', type: 'select', options: window.SIM_UI.presets.arkasSatuan, onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'satuan', this.value)` },
    { key: 'hargaSatuan', label: 'Harga Satuan', width: '125px', align: 'right', type: 'currency-input', onChange: (idx) => `window.simRkt.updateArkasCell(${idx}, 'hargaSatuan', this.value)` },
    { key: 'total', label: 'Total (Rp)', width: '125px', align: 'center', type: 'readonly-currency' },
    { key: 'actions', label: 'Aksi', width: '42px', align: 'center', type: 'delete', onDelete: (idx) => `window.simRkt.deleteArkasRow(${idx})` }
  ],
  data: b4.rencanaArkas || []
});
```

**Tipe Kolom yang Didukung:**

* `number-badge`: Menampilkan nomor urut baris (1, 2, 3...) otomatis dengan badge rounded.
* `input-text`: Input inline sel teks dengan penyesuaian lebar kolom otomatis.
* `input-number`: Input angka inline dengan alignment tengah.
* `select`: Dropdown inline sel dengan opsi baku.
* `currency-input`: Input nominal uang dengan perataan teks kanan (*right-aligned*).
* `readonly-currency`: Teks format mata uang dengan warna primer dan teks tebal.
* `badge`: Status badge pill otomatis.
* `delete`: Tombol aksi hapus baris yang rapi.
* `render`: Fungsi custom `(row, idx, col) => 'HTML string'`.

---

### D. Kartu Bagian / Bab (`SIM_UI.sectionCard`)

Membungkus setiap seksi bab dengan header elegan, badge pill kategori, deskripsi, dan slot tombol aksi:

```javascript
window.SIM_UI.sectionCard({
  badge: 'TABEL 4.3 • ANGGARAN BOSP',
  badgeColor: 'green', // 'blue' | 'green' | 'purple' | 'amber' | 'red'
  title: '💳 Rencana Kerja ARKAS PBD (Rincian Anggaran Barang & Jasa)',
  description: 'Rincian belanja barang, jasa, dan modal pendukung PBD yang masuk dalam sistem aplikasi ARKAS 4.',
  actions: [
    window.SIM_UI.button({
      text: 'Tambah Belanja ARKAS',
      icon: 'plus',
      variant: 'primary',
      size: 'sm',
      onClick: 'window.simRkt.addArkasRow()'
    })
  ],
  content: tabelHtml
});
```

---

### E. Dialog Konfirmasi Modern (`SIM_UI.confirm`)

Menggantikan `confirm()` standar browser yang kaku dengan modal interaktif yang menarik:

```javascript
window.SIM_UI.confirm({
  title: 'Hapus Belanja ARKAS',
  message: 'Apakah Anda yakin ingin menghapus baris belanja ARKAS ini?',
  confirmText: 'Ya, Hapus',
  cancelText: 'Batal',
  onConfirm: () => {
    // Logika penghapusan data
    window.SIM_UI.toast('Baris belanja berhasil dihapus', 'info');
  }
});
```

---

### F. Notifikasi Toast Mengambang (`SIM_UI.toast`)

Menampilkan umpan balik instan di pojok kanan atas aplikasi:

```javascript
window.SIM_UI.toast('Data berhasil disimpan secara otomatis!', 'success');
window.SIM_UI.toast('Sedang memproses unduh PDF resmi...', 'info');
window.SIM_UI.toast('Koneksi lambat, beralih ke penyimpanan lokal', 'warning');
window.SIM_UI.toast('Terjadi kesalahan saat memproses data', 'danger');
```

### G. Sidebar Navigasi Berbasis Tipografi (`.rkt-nav-item`)

Navigasi sidebar formal dan minimalis untuk dokumen perencanaan dan pelaporan tanpa menggunakan angka Romawi atau ornamen kekanak-kanakan:

* **Indikator Aktif**: Garis aksen vertikal 3.5px (`#2563eb`), latar belakang biru lembut (`#f0f7ff`), teks tebal formal (`#1e40af`).
* **Hierarki Tipografi**: Judul bab berukuran 0.84rem (font-weight: 600) dipadukan dengan deskripsi ringkas 0.72rem (`#64748b`).
* **Interaksi Halus**: Transisi cubic-bezier pada hover dengan latar belakang netral slate-50 (`#f8fafc`).

---

## 3. Panduan Pemeliharaan

1. **Perubahan Warna / Tema**: Cukup sesuaikan variabel di [css/style.css](file:///d:/DEVELZY/.administrasi_sd/css/style.css) pada `:root`.
2. **Penambahan Preset Baru**: Tambahkan ke objek `presets` di [js/components/ui_forms.js](file:///d:/DEVELZY/.administrasi_sd/js/components/ui_forms.js).
3. **Penambahan Ikon SVG Baru**: Daftarkan di objek `SIM_ICONS` pada [js/components/ui_core.js](file:///d:/DEVELZY/.administrasi_sd/js/components/ui_core.js).
4. **Navigasi Sidebar**: Seluruh struktur bab terpusat di `renderSidebar()` pada [js/rkt_app.js](file:///d:/DEVELZY/.administrasi_sd/js/rkt_app.js).
