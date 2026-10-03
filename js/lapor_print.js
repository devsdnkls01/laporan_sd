/**
 * LAPORAN PRINT ENGINE (SIM-LAPOR 44 PROGRAM KERJA)
 * Modul Pencetakan Naskah Dinas Resmi Standar Permendikbudristek & Kemenpan-RB
 * 
 * Prinsip:
 * 1. Penanggalan laporan selalu mengikuti tanggal realtime saat dicetak / digenerate.
 * 2. Seluruh identitas sekolah, kepala sekolah, pengawas diambil dari Data Master (masterDb).
 * 3. Bebas dari data atau tahun hardcoded.
 */

(function (global) {
  'use strict';

  class LaporPrintEngine {
    constructor() {}

    getOfficialKopHtml(s = {}, logoSrc = 'assets/image1.png') {
      const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || {};
      const pem = s.sekolahPemerintah || s.pemerintah || sek.pemerintah || 'PEMERINTAH KABUPATEN TEGAL';
      const din = s.sekolahDinas || s.dinas || sek.dinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';
      const nama = s.sekolahNama || s.nama || sek.nama || 'SD NEGERI KALISALAK 01';
      const kec = s.sekolahKecamatan || s.kecamatan || sek.kecamatan || 'KECAMATAN MARGASARI';
      const alm = s.sekolahAlamat || s.alamat || sek.alamat || 'JL. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kabupaten Tegal, Jawa Tengah 52463';

      return `
        <!-- KOP SURAT FORMAL PEMKAB TEGAL -->
        <div class="official-kop">
          <img class="kop-logo" src="${logoSrc}" alt="Logo Instansi">
          <div class="kop-text">
            <div class="kop-line-1">${pem}</div>
            <div class="kop-line-2">${din}</div>
            <div class="kop-line-3">${nama}</div>
            <div class="kop-line-4">${kec.toUpperCase()}</div>
            <div class="kop-address">${alm}</div>
          </div>
        </div>
        <div class="kop-divider"></div>
      `;
    }

    getLampiranMetaHeaderHtml({ lampiran = 'LAMPIRAN I', jenis = '', nomor = '', tanggal = '', tentang = '' } = {}) {
      const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || {};
      const namaSek = sek.nama || 'SD NEGERI KALISALAK 01';
      const finalJenis = jenis || `SURAT KEPUTUSAN KEPALA ${namaSek}`;

      return `
        <div style="display: flex; justify-content: flex-start; margin-bottom: 10pt; page-break-inside: avoid; break-inside: avoid; text-align: left;">
          <table style="font-size: 9pt; line-height: 1.25; border-collapse: collapse; text-align: left;">
            <tr>
              <td style="font-weight: 700; padding: 1pt 4pt; vertical-align: top; white-space: nowrap;">${lampiran}</td>
              <td style="vertical-align: top; padding: 1pt 2pt;">:</td>
              <td style="padding: 1pt 4pt; vertical-align: top;">${finalJenis}</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 1pt 4pt; vertical-align: top; white-space: nowrap;">NOMOR</td>
              <td style="vertical-align: top; padding: 1pt 2pt;">:</td>
              <td style="padding: 1pt 4pt; vertical-align: top;">${nomor}</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 1pt 4pt; vertical-align: top; white-space: nowrap;">TANGGAL</td>
              <td style="vertical-align: top; padding: 1pt 2pt;">:</td>
              <td style="padding: 1pt 4pt; vertical-align: top;">${tanggal}</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 1pt 4pt; vertical-align: top; white-space: nowrap;">TENTANG</td>
              <td style="vertical-align: top; padding: 1pt 2pt;">:</td>
              <td style="padding: 1pt 4pt; vertical-align: top; text-transform: uppercase;">${tentang}</td>
            </tr>
          </table>
        </div>
      `;
    }

    getPrintDocTitleHtml(reportTitle, tahunAnggaran, nomorDokumen) {
      const cleanTitle = (reportTitle || 'Laporan').toUpperCase().startsWith('LAPORAN')
        ? reportTitle.toUpperCase()
        : 'LAPORAN ' + (reportTitle || 'Laporan').toUpperCase();

      const finalNomor = (nomorDokumen || '').startsWith('NOMOR') || (nomorDokumen || '').startsWith('Nomor')
        ? nomorDokumen
        : `NOMOR : ${nomorDokumen}`;

      return `
        <div class="print-doc-title" style="text-align: center !important; margin-bottom: 12pt;">
          <h1 style="font-size: 13.5pt; font-weight: 800; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center !important; line-height: 1.25; letter-spacing: 0.02em;">${cleanTitle}</h1>
          <h2 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center !important; line-height: 1.25;">TAHUN ANGGARAN ${tahunAnggaran}</h2>
          <div class="print-doc-nomor" style="text-align: center !important; text-indent: 0 !important; margin: 3pt auto 0 auto !important; width: 100% !important; display: block !important;">${finalNomor}</div>
        </div>
      `;
    }

    getSignatureBlockHtml({ pjName, pjNip, kepalaNama, kepalaNip, pengawasNama, pengawasNip, printDateFull, sekolahNama, pengawasJabatan, titimangsaTempat } = {}) {
      const tempat = titimangsaTempat || 'Margasari';
      const sekName = sekolahNama || 'SD Negeri Kalisalak 01';

      return `
        <!-- KOLOM TANDA TANGAN FORMAL 3 PIHAK -->
        <div class="signature-container">
          <div class="sig-date">${tempat}, ${printDateFull}</div>
          
          <div class="sig-grid">
            <!-- Kiri: Penanggung Jawab Program -->
            <div class="sig-box">
              <div class="sig-title-role">Penanggung Jawab Program</div>
              <div class="sig-space"></div>
              <div class="sig-name">${pjName || ''}</div>
              <div class="sig-nip">${pjNip && pjNip !== '-' ? 'NIP. ' + pjNip : ''}</div>
            </div>

            <!-- Kanan: Kepala Sekolah -->
            <div class="sig-box">
              <div class="sig-title-role">Kepala ${sekName}</div>
              <div class="sig-space"></div>
              <div class="sig-name">${kepalaNama || 'Imamudin, S.Pd.SD'}</div>
              <div class="sig-nip">NIP. ${kepalaNip || '197106172003121001'}</div>
            </div>
          </div>

          <div class="sig-bottom-row" style="margin-top: 14pt;">
            <!-- Bawah Tengah: Mengetahui Pengawas Pembina -->
            <div class="sig-box sig-box-center">
              <div class="sig-title-role">Mengetahui,</div>
              <div class="sig-title-sub">${pengawasJabatan || 'Pengawas Pembina SD Kec. Margasari'}</div>
              <div class="sig-space"></div>
              <div class="sig-name">${pengawasNama || 'Sri Suci Margianah, S.Pd., M.Pd.'}</div>
              <div class="sig-nip">${pengawasNip && pengawasNip !== '-' ? 'NIP. ' + pengawasNip : ''}</div>
            </div>
          </div>
        </div>
      `;
    }

    printReport(app, report, skipPrint = false) {
      if (!report) return;
      const printSection = document.getElementById('print-section');
      if (!printSection) return;

      const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || (app.settings || {});
      const pej = (window.masterDb ? window.masterDb.getPejabat(false) : {}) || (app.settings || {});
      const per = (window.masterDb ? window.masterDb.getPeriode() : {}) || {};

      const now = new Date();
      // Smart Laporan Date: Tanggal dokumen laporan selalu mengikuti tanggal saat dokumen dicetak/digenerate
      const printDateFull = window.masterDb ? window.masterDb.getSmartLaporDate(now) : now.toLocaleDateString('id-ID');
      const currentRealtimeYear = window.masterDb ? window.masterDb.getSmartLaporYear(now) : now.getFullYear().toString();
      const tahunAnggaran = currentRealtimeYear;
      const nomorDokumen = `421.2 / <span class="space-manual-nomor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> / 04.68 / ${currentRealtimeYear}`;

      const defaultReport = (window.INITIAL_REPORTS || []).find(r => r.id === report.id);
      const logoSrc = 'assets/image1.png';

      // Format paragraf dinas
      const formatParagraphs = (text, indent = true) => {
        if (!text) return '<p class="print-paragraph">-</p>';
        const rawBlocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
        if (rawBlocks.length === 0) return '<p class="print-paragraph">-</p>';

        return rawBlocks.map(block => {
          if (block.startsWith('•') || block.startsWith('-')) {
            const items = block.split('\n').map(l => l.trim()).filter(Boolean);
            return `<ul class="print-bullet-list">${items.map(it => `<li>${it.replace(/^[•\-]\s*/, '')}</li>`).join('')}</ul>`;
          }
          if (/^\d+[\.\)]/.test(block)) {
            const items = block.split('\n').map(l => l.trim()).filter(Boolean);
            return `<ol class="print-legal-list">${items.map(it => `<li>${it.replace(/^\d+[\.\)]\s*/, '')}</li>`).join('')}</ol>`;
          }
          const pClass = indent ? 'print-paragraph' : 'print-paragraph-noindent';
          return `<p class="${pClass}">${block.replace(/\n/g, '<br>')}</p>`;
        }).join('');
      };

      const formatItemizedPrint = (listObj, fallbackText) => {
        if (listObj && listObj.items && listObj.items.length > 0) {
          return `
            ${listObj.intro ? `<p class="print-paragraph" style="margin-bottom: 4pt;">${listObj.intro}</p>` : ''}
            <ol class="print-legal-list">
              ${listObj.items.map(it => `<li>${it.replace(/^\d+[\.\)]\s*/, '')}</li>`).join('')}
            </ol>
          `;
        }
        return formatParagraphs(fallbackText);
      };

      const effectiveTimTable = (report.bab2?.timTable && report.bab2.timTable.length > 0) ? report.bab2.timTable : (defaultReport?.bab2?.timTable || []);
      const effectiveJadwalTable = (report.bab2?.jadwalTable && report.bab2.jadwalTable.length > 0) ? report.bab2.jadwalTable : (defaultReport?.bab2?.jadwalTable || []);
      const effectiveIndikatorTable = (report.bab3?.indikatorTable && report.bab3.indikatorTable.length > 0) ? report.bab3.indikatorTable : (defaultReport?.bab3?.indikatorTable || []);
      const effectiveRtlTable = (report.bab4?.rtlTable && report.bab4.rtlTable.length > 0) ? report.bab4.rtlTable : (defaultReport?.bab4?.rtlTable || []);

      const printTimTable = (effectiveTimTable && effectiveTimTable.length > 0) ? `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 32px; text-align: center;">No</th>
              <th style="width: 25%;">Jabatan Tim Kerja</th>
              <th style="width: 33%;">Nama & NIP Pejabat</th>
              <th>Uraian Tugas Utama Kedinasan</th>
            </tr>
          </thead>
          <tbody>
            ${effectiveTimTable.map(r => `
              <tr>
                <td style="text-align: center;">${r.no}</td>
                <td><strong>${r.jabatan}</strong></td>
                <td>${(r.namaNip || '').replace(/\n/g, '<br>')}</td>
                <td style="text-align: justify;">${(r.tugas || '').replace(/\n/g, '<br>')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : formatParagraphs(report.bab2?.susunanTim);

      const printJadwalTable = (effectiveJadwalTable && effectiveJadwalTable.length > 0) ? `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 32px; text-align: center;">No</th>
              <th>Tahapan Kegiatan Utama</th>
              <th style="width: 28%;">Target Capaian & Indikator Output</th>
              <th style="width: 22%;">Waktu Pelaksanaan</th>
            </tr>
          </thead>
          <tbody>
            ${effectiveJadwalTable.map(r => `
              <tr>
                <td style="text-align: center;">${r.no}</td>
                <td>${(r.kegiatan || '').replace(/\n/g, '<br>')}</td>
                <td>${(r.target || '').replace(/\n/g, '<br>')}</td>
                <td>${(r.waktu || '').replace(/\n/g, '<br>')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : formatParagraphs(report.bab2?.matriksJadwal);

      const printIndikatorTable = (effectiveIndikatorTable && effectiveIndikatorTable.length > 0) ? `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 32px; text-align: center;">No</th>
              <th>Indikator Kinerja Kunci</th>
              <th style="width: 24%; text-align: center;">Target yang Ditetapkan</th>
              <th style="width: 24%; text-align: center;">Realisasi Capaian</th>
            </tr>
          </thead>
          <tbody>
            ${effectiveIndikatorTable.map(r => `
              <tr>
                <td style="text-align: center;">${r.no}</td>
                <td>${(r.indikator || '').replace(/\n/g, '<br>')}</td>
                <td style="text-align: center; font-weight: 700;">${(r.target || '').replace(/\n/g, '<br>')}</td>
                <td style="text-align: center; font-weight: 700; color: #047857;">${(r.realisasi || '').replace(/\n/g, '<br>')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : formatParagraphs(report.bab3?.indikatorKinerja);

      const printRtlTable = (effectiveRtlTable && effectiveRtlTable.length > 0) ? `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 32px; text-align: center;">No</th>
              <th style="width: 44%;">Fokus Program Tindak Lanjut</th>
              <th style="width: 28%;">Target Perbaikan</th>
              <th>Penanggung Jawab</th>
            </tr>
          </thead>
          <tbody>
            ${effectiveRtlTable.map(r => `
              <tr>
                <td style="text-align: center;">${r.no}</td>
                <td><strong>${(r.fokus || r.rencanaAksi || '').replace(/\n/g, '<br>')}</strong></td>
                <td>${(r.target || r.targetPerbaikan || r.waktuBiaya || '').replace(/\n/g, '<br>')}</td>
                <td>${(r.pj || '').replace(/\n/g, '<br>')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : formatParagraphs(report.bab4?.tindakLanjut);

      // Lampiran I: SK Tim Pelaksana (Sesuai Format Baku Tata Naskah Dinas Resmi Permendikbudristek & Kemenpan-RB)
      // Bagian 1: Naskah Surat Keputusan (Konsideran, Diktum, dan Pengesahan Tanda Tangan Kepala Sekolah)
      // Bagian 2: Lampiran Surat Keputusan (Tabel Matriks Personalia Tim Pelaksana & Pengesahan Tanda Tangan Kepala Sekolah)
      const skTimPrintHtml = `
        <!-- HALAMAN 1 DARI SK: BADAN SURAT KEPUTUSAN RESMI -->
        <div class="print-attachment-section print-sk-page">
          ${this.getLampiranMetaHeaderHtml({
            lampiran: 'LAMPIRAN I',
            jenis: `SURAT KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'}`,
            nomor: `421.2 / <span class="space-manual-nomor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> / 04.68 / ${currentRealtimeYear}`,
            tanggal: printDateFull,
            tentang: `PEMBENTUKAN DAN PENETAPAN TIM PELAKSANA PROGRAM KERJA "${report.title.toUpperCase()}"`
          })}

          ${this.getOfficialKopHtml(sek, logoSrc)}

          <div class="print-doc-title">
            <h2>SURAT KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'}</h2>
            <div class="print-doc-nomor" style="text-align: center !important; text-indent: 0 !important; margin: 3pt auto 0 auto !important; width: 100% !important; display: block !important;">
              NOMOR : 421.2 / <span class="space-manual-nomor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> / 04.68 / ${currentRealtimeYear}
            </div>
            <div style="margin-top: 6pt; font-weight: 800; font-size: 11pt; text-transform: uppercase; line-height: 1.25;">
              TENTANG<br>
              PEMBENTUKAN DAN PENETAPAN TIM PELAKSANA PROGRAM KERJA<br>
              "${report.title.toUpperCase()}"<br>
              TAHUN ANGGARAN ${tahunAnggaran}
            </div>
          </div>

          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-top: 6pt; margin-bottom: 4pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2pt 0; white-space: nowrap; border: none !important;">Menimbang</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2pt 0; border: none !important;">
                <table style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt;">
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 0; border: none !important;">a.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 0; border: none !important;">bahwa dalam rangka menjamin kelancaran, akuntabilitas, transparansi, serta efektivitas pelaksanaan <strong>${report.title}</strong> pada ${sek.nama || 'SD Negeri Kalisalak 01'} Tahun Anggaran ${tahunAnggaran}, dipandang perlu membentuk dan menetapkan Tim Pelaksana Kegiatan Satuan Pendidikan;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">b.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">bahwa nama-nama yang tercantum dalam lampiran keputusan ini dipandang cakap, berdedikasi, dan memenuhi syarat untuk melaksanakan tugas yang diamanatkan.</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 3pt 0 2pt 0; white-space: nowrap; border: none !important;">Mengingat</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 3pt 0 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 3pt 0 2pt 0; border: none !important;">
                <table style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt;">
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 0; border: none !important;">1.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 0; border: none !important;">Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">2.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan atas PP Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">3.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Permendikdasmen Nomor 8 Tahun 2026 tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP);</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">4.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Rencana Kegiatan dan Anggaran Sekolah (RKAS/ARKAS) ${sek.nama || 'SD Negeri Kalisalak 01'} Tahun Anggaran ${tahunAnggaran}.</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div style="text-align: center; font-weight: 800; font-size: 10.5pt; margin: 6pt 0 4pt 0; letter-spacing: 0.08em;">
            MEMUTUSKAN:
          </div>

          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-bottom: 4pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2pt 0; white-space: nowrap; border: none !important;">Menetapkan</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; font-weight: 700; padding: 2pt 0; border: none !important;">
                KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'} TENTANG PEMBENTUKAN DAN PENETAPAN TIM PELAKSANA PROGRAM KERJA "${report.title.toUpperCase()}" TAHUN ANGGARAN ${tahunAnggaran}.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 3pt 0 2pt 0; white-space: nowrap; border: none !important;">KESATU</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 3pt 0 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 3pt 0 2pt 0; border: none !important;">
                Membentuk dan mengangkat Tim Pelaksana Kegiatan <strong>${report.title}</strong> ${sek.nama || 'SD Negeri Kalisalak 01'} Tahun Anggaran ${tahunAnggaran} dengan susunan personalia dan rincian pembagian tugas sebagaimana tercantum dalam Lampiran yang merupakan bagian tidak terpisahkan dari Keputusan ini.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KEDUA</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Tim Pelaksana sebagaimana dimaksud pada Diktum KESATU bertugas menyusun rencana kerja operasional, melaksanakan tahapan kegiatan sesuai matriks jadwal, mengkoordinasikan administrasi, serta menyusun dan menyampaikan laporan pertanggungjawaban kepada Kepala Sekolah.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KETIGA</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Segala pembiayaan yang timbul sehubungan dengan pelaksanaan tugas tim ini dibebankan pada pos anggaran Bantuan Operasional Satuan Pendidikan (BOSP) ${sek.nama || 'SD Negeri Kalisalak 01'} yang relevan.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KEEMPAT</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Surat Keputusan ini berlaku sejak tanggal ditetapkan, dan apabila di kemudian hari terdapat kekeliruan akan dilakukan perbaikan sebagaimana mestinya.
              </td>
            </tr>
          </table>

          <div style="margin-top: 14pt; display: flex; justify-content: flex-end; width: 100%; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 48%; text-align: center; font-size: 10.5pt; line-height: 1.25;">
              <div>Ditetapkan di : ${per.titimangsaTempat || sek.kecamatan || 'Margasari'}</div>
              <div>Pada tanggal : ${printDateFull}</div>
              <div style="margin-top: 4pt; font-weight: 700;">Kepala ${sek.nama || 'SD Negeri Kalisalak 01'}</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: 700; text-decoration: underline;">${pej.kepalaNama || 'Imamudin, S.Pd.SD'}</div>
              <div style="font-size: 9.5pt; margin-top: 2pt;">NIP. ${pej.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- HALAMAN 2 DARI SK: LAMPIRAN SUSUNAN TIM PELAKSANA RESMI -->
        <div class="print-attachment-section print-sk-lampiran-page" style="page-break-before: always; break-before: page; margin-top: 0 !important;">
          <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 10pt;">
            <div style="width: 62%; font-size: 9pt; line-height: 1.3; text-align: left;">
              <table style="border: none !important; border-collapse: collapse !important; font-size: 9pt; line-height: 1.25; width: 100%;">
                <tr style="border: none !important;">
                  <td style="width: 75px; vertical-align: top; font-weight: 700; padding: 1pt 0; white-space: nowrap; border: none !important;">LAMPIRAN</td>
                  <td style="width: 10px; vertical-align: top; padding: 1pt 0; border: none !important;">:</td>
                  <td style="vertical-align: top; padding: 1pt 0; font-weight: 700; border: none !important;">KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'}</td>
                </tr>
                <tr style="border: none !important;">
                  <td style="vertical-align: top; font-weight: 700; padding: 1pt 0; white-space: nowrap; border: none !important;">NOMOR</td>
                  <td style="vertical-align: top; padding: 1pt 0; border: none !important;">:</td>
                  <td style="vertical-align: top; padding: 1pt 0; border: none !important;">421.2 / <span class="space-manual-nomor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> / 04.68 / ${currentRealtimeYear}</td>
                </tr>
                <tr style="border: none !important;">
                  <td style="vertical-align: top; font-weight: 700; padding: 1pt 0; white-space: nowrap; border: none !important;">TANGGAL</td>
                  <td style="vertical-align: top; padding: 1pt 0; border: none !important;">:</td>
                  <td style="vertical-align: top; padding: 1pt 0; border: none !important;">${printDateFull}</td>
                </tr>
                <tr style="border: none !important;">
                  <td style="vertical-align: top; font-weight: 700; padding: 1pt 0; white-space: nowrap; border: none !important;">TENTANG</td>
                  <td style="vertical-align: top; padding: 1pt 0; border: none !important;">:</td>
                  <td style="vertical-align: top; padding: 1pt 0; text-transform: uppercase; font-weight: 700; border: none !important;">PEMBENTUKAN DAN PENETAPAN TIM PELAKSANA PROGRAM KERJA "${report.title.toUpperCase()}" TAHUN ANGGARAN ${tahunAnggaran}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="print-doc-title" style="margin-top: 8pt; margin-bottom: 10pt; text-align: center;">
            <h2 style="font-size: 11pt; font-weight: 800; text-transform: uppercase; margin: 0 0 4pt 0; line-height: 1.3;">
              SUSUNAN PERSONALIA DAN PEMBAGIAN TUGAS TIM PELAKSANA KEGIATAN<br>
              "${report.title.toUpperCase()}"<br>
              ${sek.nama || 'SD NEGERI KALISALAK 01'} TAHUN ANGGARAN ${tahunAnggaran}
            </h2>
          </div>

          <table class="print-table" style="margin-top: 6pt; margin-bottom: 10pt; width: 100%;">
            <thead>
              <tr>
                <th style="width: 32px; text-align: center;">No</th>
                <th style="width: 30%;">Nama &amp; NIP Pejabat</th>
                <th style="width: 25%;">Kedudukan dalam Tim</th>
                <th>Rincian Tugas &amp; Tanggung Jawab</th>
              </tr>
            </thead>
            <tbody>
              ${effectiveTimTable.map(r => `
                <tr>
                  <td style="text-align: center;">${r.no}</td>
                  <td>
                    <strong>${(r.namaNip || '').split('\n')[0]}</strong>
                    <div style="font-size: 8.5pt; color: #333333; margin-top: 1pt;">${(r.namaNip || '').split('\n').slice(1).join(' ') || ''}</div>
                  </td>
                  <td><strong>${r.jabatan}</strong></td>
                  <td style="text-align: justify; font-size: 9pt;">${(r.tugas || '').replace(/\n/g, '<br>')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 16pt; display: flex; justify-content: flex-end; width: 100%; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 48%; text-align: center; font-size: 10.5pt; line-height: 1.25;">
              <div>Ditetapkan di : ${per.titimangsaTempat || sek.kecamatan || 'Margasari'}</div>
              <div>Pada tanggal : ${printDateFull}</div>
              <div style="margin-top: 4pt; font-weight: 700;">Kepala ${sek.nama || 'SD Negeri Kalisalak 01'}</div>
              <div style="height: 50px;"></div>
              <div style="font-weight: 700; text-decoration: underline;">${pej.kepalaNama || 'Imamudin, S.Pd.SD'}</div>
              <div style="font-size: 9.5pt; margin-top: 2pt;">NIP. ${pej.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>
      `;

      // Lampiran II: Foto Dokumentasi
      let photoPrintHtml = '';
      if (report.photos && report.photos.length > 0) {
        photoPrintHtml = `
          <div class="print-attachment-section">
            ${this.getLampiranMetaHeaderHtml({
              lampiran: 'LAMPIRAN II',
              jenis: 'LAPORAN PELAKSANAAN PROGRAM KERJA',
              nomor: nomorDokumen,
              tanggal: printDateFull,
              tentang: `DOKUMENTASI FOTO PELAKSANAAN KEGIATAN ${report.title.toUpperCase()}`
            })}

            <div class="print-doc-title" style="margin-top: 10pt; text-align: center;">
              <h2>DOKUMENTASI FOTO PELAKSANAAN KEGIATAN</h2>
              <p style="font-size: 10pt; font-style: italic; margin-top: 2pt;">
                Bukti Fisik Pelaksanaan Program Kerja ${sek.nama || 'SDN Kalisalak 01'} Tahun Anggaran ${currentRealtimeYear}
              </p>
            </div>
            <div class="print-photo-grid">
              ${report.photos.map((p, idx) => `
                <div class="print-photo-box">
                  <img class="print-photo-img" src="${p.dataUrl}" alt="Foto ${idx+1}">
                  <div class="print-photo-caption">Foto ${idx+1}: ${p.title || 'Dokumentasi Program'}</div>
                  <div class="print-photo-desc">Tanggal: ${p.date || '-'} | ${p.desc || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      printSection.innerHTML = `
        <div class="print-page">
          ${this.getOfficialKopHtml(sek, logoSrc)}
          ${this.getPrintDocTitleHtml(report.title, tahunAnggaran, nomorDokumen)}

          <!-- BAB I -->
          <div class="print-bab-title">BAB I • PENDAHULUAN</div>
          <div class="print-sub-title">1.1 Latar Belakang Masalah</div>
          ${formatParagraphs(report.bab1?.latarBelakang)}

          <div class="print-sub-title">1.2 Dasar Hukum dan Landasan Operasional</div>
          ${formatItemizedPrint(report.bab1?.dasarHukumObj, report.bab1?.dasarHukum)}

          <div class="print-sub-title">1.3 Maksud dan Tujuan</div>
          ${formatItemizedPrint(report.bab1?.maksudTujuanObj, report.bab1?.maksudTujuan)}

          <div class="print-sub-title">1.4 Sasaran dan Ruang Lingkup</div>
          ${formatParagraphs(report.bab1?.sasaran)}

          <!-- BAB II -->
          <div class="print-bab-title">BAB II • PENGORGANISASIAN DAN RENCANA KERJA</div>
          <div class="print-sub-title">2.1 Struktur Organisasi dan Tim Pelaksana</div>
          ${printTimTable}

          <div class="print-sub-title">2.2 Matriks Rencana Kerja dan Jadwal Pelaksanaan</div>
          ${printJadwalTable}

          <div class="print-sub-title">2.3 Alokasi Sumber Daya dan Anggaran (BOS)</div>
          ${formatParagraphs(report.bab2?.alokasiAnggaran)}

          <!-- BAB III -->
          <div class="print-bab-title">BAB III • PELAKSANAAN DAN HASIL CAPAIAN</div>
          <div class="print-sub-title">3.1 Realisasi Pelaksanaan Kegiatan</div>
          ${formatParagraphs(report.bab3?.realisasi)}

          <div class="print-sub-title">3.2 Indikator Keberhasilan dan Capaian Kinerja</div>
          ${printIndikatorTable}

          <div class="print-sub-title">3.3 Faktor Pendukung dan Kendala yang Dihadapi</div>
          <div class="print-factor-group">
            <div class="factor-heading">a. Faktor Pendukung:</div>
            ${formatParagraphs(report.bab3?.faktorPendukung, false)}
          </div>
          <div class="print-factor-group" style="margin-top: 6pt;">
            <div class="factor-heading">b. Faktor Penghambat / Kendala:</div>
            ${formatParagraphs(report.bab3?.faktorKendala, false)}
          </div>

          <!-- BAB IV -->
          <div class="print-bab-title">BAB IV • EVALUASI DAN RENCANA TINDAK LANJUT</div>
          <div class="print-sub-title">4.1 Analisis Hasil Evaluasi Keterlaksanaan Program</div>
          ${formatParagraphs(report.bab4?.analisisEvaluasi)}

          <div class="print-sub-title">4.2 Solusi dan Strategi Pembenahan Mutu</div>
          ${formatItemizedPrint(report.bab4?.solusiObj, report.bab4?.solusiPembenahan)}

          <div class="print-sub-title">4.3 Rencana Tindak Lanjut (RTL) Berkelanjutan</div>
          ${printRtlTable}

          <!-- BAB V -->
          <div class="print-bab-title">BAB V • PENUTUP</div>
          <div class="print-sub-title">5.1 Kesimpulan</div>
          ${formatParagraphs(report.bab5?.kesimpulan)}

          <div class="print-sub-title">5.2 Rekomendasi dan Saran</div>
          ${formatItemizedPrint(report.bab5?.saranObj, report.bab5?.saranRekomendasi)}

          ${this.getSignatureBlockHtml({
            pjName: report.pjName,
            pjNip: report.pjNip,
            kepalaNama: pej.kepalaNama || 'Imamudin, S.Pd.SD',
            kepalaNip: pej.kepalaNip || '197106172003121001',
            pengawasNama: pej.pengawasNama || 'Sri Suci Margianah, S.Pd., M.Pd.',
            pengawasNip: pej.pengawasNip || '19800228 200801 2 006',
            pengawasJabatan: pej.pengawasJabatan || 'Pengawas Pembina SD Kec. Margasari',
            sekolahNama: sek.nama || 'SD Negeri Kalisalak 01',
            printDateFull: printDateFull,
            titimangsaTempat: per.titimangsaTempat || sek.kecamatan || 'Margasari'
          })}

          ${skTimPrintHtml}
          ${photoPrintHtml}
        </div>
      `;

      const originalDocTitle = document.title;
      const sanitizedTitle = (report.title || 'Laporan').replace(/[^a-zA-Z0-9]/g, '_');
      document.title = `LAPORAN_${String(report.id).padStart(2, '0')}_${sanitizedTitle}_${(sek.nama || 'SDN_KALISALAK_01').replace(/\s+/g, '_')}_${currentRealtimeYear}`;

      if (!skipPrint) {
        setTimeout(() => {
          window.print();
          setTimeout(() => {
            document.title = originalDocTitle;
          }, 1000);
        }, 250);
      }
    }

    async downloadPdf(app, report) {
      if (!report) return;
      if (this._isExporting) return;
      this._isExporting = true;

      // Blur input aktif agar data yang baru saja diedit tersimpan otomatis
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      // Tampilkan indikator proses dan loading overlay agar user tidak klik berulang kali
      if (window.SIM_UI && typeof window.SIM_UI.showLoading === 'function') {
        window.SIM_UI.showLoading(
          'Sedang Menyusun Dokumen PDF Laporan...',
          'Sistem sedang memproses data terbaru, menyusun tata letak naskah dan lampiran foto. Mohon tunggu sejenak...'
        );
      } else if (typeof window.showToast === 'function') {
        window.showToast('Memproses file PDF laporan...', 'info');
      }

      try {
        this.printReport(app, report, true);
        const printSection = document.getElementById('print-section');
        if (!printSection) {
          throw new Error('Elemen dokumen (#print-section) tidak ditemukan.');
        }

        const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || (app.settings || {});
        const currentYear = new Date().getFullYear();
        const sanitizedTitle = (report.title || 'Laporan').replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `LAPORAN_${String(report.id).padStart(2, '0')}_${sanitizedTitle}_${(sek.nama || 'SDN_KALISALAK_01').replace(/\s+/g, '_')}_${currentYear}.pdf`;

        let downloaded = false;

        // STRATEGI 1: Gunakan Engine Server Headless (Edge / Chrome)
        try {
          const response = await fetch('/api/export-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              html: printSection.innerHTML,
              title: `LAPORAN ${report.title || 'Program'} - ${sek.nama || 'SDN KALISALAK 01'}`,
              filename: filename
            })
          });

          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            downloaded = true;
          } else {
            const errData = await response.json().catch(() => ({}));
            console.warn('[PDF Export] Backend engine merespon error, beralih ke fallback client-side:', errData.error || response.status);
          }
        } catch (fetchErr) {
          console.warn('[PDF Export] Backend fetch gagal, beralih ke fallback client-side:', fetchErr.message);
        }

        // STRATEGI 2: Fallback Client-side via html2pdf.js jika backend tidak dapat diakses
        if (!downloaded && typeof window.html2pdf === 'function') {
          console.log('[PDF Export] Menjalankan fallback client-side html2pdf...');
          const opt = {
            margin: [8, 8, 8, 8],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };
          await window.html2pdf().set(opt).from(printSection).save();
          downloaded = true;
        }

        if (downloaded) {
          if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
            window.SIM_UI.toast(`Dokumen PDF laporan berhasil diunduh: ${filename}`, 'success');
          } else if (typeof window.showToast === 'function') {
            window.showToast(`Dokumen PDF laporan berhasil diunduh: ${filename}`, 'success');
          }
        } else {
          throw new Error('Gagal menghasilkan file PDF melalui engine server maupun client-side.');
        }

      } catch (err) {
        console.error('[PDF Export] Error:', err);
        const errMsg = err.message || 'Terjadi kesalahan sistem saat membuat file PDF.';
        if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
          window.SIM_UI.toast(`Gagal mengunduh PDF: ${errMsg}`, 'danger');
        } else if (typeof window.showToast === 'function') {
          window.showToast(`Gagal mengunduh PDF: ${errMsg}`, 'danger');
        }
      } finally {
        if (window.SIM_UI && typeof window.SIM_UI.hideLoading === 'function') {
          window.SIM_UI.hideLoading();
        }
        this._isExporting = false;
      }
    }

    printSkOnly(app, report) {
      if (!report) return;
      const printSection = document.getElementById('print-section');
      if (!printSection) return;

      const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || (app.settings || {});
      const pej = (window.masterDb ? window.masterDb.getPejabat(false) : {}) || (app.settings || {});
      const per = (window.masterDb ? window.masterDb.getPeriode() : {}) || {};
      const logoSrc = 'assets/image1.png';

      const now = new Date();
      const printDateFull = window.masterDb ? window.masterDb.getSmartLaporDate(now) : now.toLocaleDateString('id-ID');
      const currentRealtimeYear = window.masterDb ? window.masterDb.getSmartLaporYear(now) : now.getFullYear().toString();
      const tahunAnggaran = currentRealtimeYear;

      const defaultReport = (window.INITIAL_REPORTS || []).find(r => r.id === report.id);
      const effectiveTimTable = (report.bab2 && report.bab2.timTable && report.bab2.timTable.length > 0)
        ? report.bab2.timTable
        : (defaultReport?.bab2?.timTable || []);

      printSection.innerHTML = `
        <div class="print-page">
          ${this.getLampiranMetaHeaderHtml({
            lampiran: 'LAMPIRAN I',
            jenis: `SURAT KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'}`,
            nomor: `421.2 / <span class="space-manual-nomor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> / 04.68 / ${currentRealtimeYear}`,
            tanggal: printDateFull,
            tentang: `PEMBENTUKAN TIM PELAKSANA ${report.title.toUpperCase()}`
          })}

          ${this.getOfficialKopHtml(sek, logoSrc)}

          <div class="print-doc-title">
            <h2>SURAT KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'}</h2>
            <div class="print-doc-nomor" style="text-align: center !important; text-indent: 0 !important; margin: 3pt auto 0 auto !important; width: 100% !important; display: block !important;">
              NOMOR : 421.2 / <span class="space-manual-nomor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> / 04.68 / ${currentRealtimeYear}
            </div>
            <div style="margin-top: 6pt; font-weight: 800; font-size: 11pt; text-transform: uppercase; line-height: 1.25;">
              TENTANG<br>
              PEMBENTUKAN DAN PENETAPAN TIM PELAKSANA PROGRAM KERJA<br>
              "${report.title.toUpperCase()}"<br>
              TAHUN ANGGARAN ${tahunAnggaran}
            </div>
          </div>

          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-top: 8pt; margin-bottom: 4pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2pt 0; white-space: nowrap; border: none !important;">Menimbang</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2pt 0; border: none !important;">
                <table style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt;">
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 0; border: none !important;">a.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 0; border: none !important;">bahwa dalam rangka menjamin kelancaran, akuntabilitas, transparansi, serta efektivitas pelaksanaan <strong>${report.title}</strong> pada ${sek.nama || 'SD Negeri Kalisalak 01'} Tahun Anggaran ${tahunAnggaran}, dipandang perlu membentuk dan menetapkan Tim Pelaksana Kegiatan Satuan Pendidikan;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">b.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">bahwa nama-nama yang tercantum dalam lampiran keputusan ini dipandang cakap, berdedikasi, dan memenuhi syarat untuk melaksanakan tugas yang diamanatkan.</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 4pt 0 2pt 0; white-space: nowrap; border: none !important;">Mengingat</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 4pt 0 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 4pt 0 2pt 0; border: none !important;">
                <table style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt;">
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 0; border: none !important;">1.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 0; border: none !important;">Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">2.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan atas PP Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">3.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Permendikdasmen Nomor 8 Tahun 2026 tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP);</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">4.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Rencana Kegiatan dan Anggaran Sekolah (RKAS/ARKAS) ${sek.nama || 'SD Negeri Kalisalak 01'} Tahun Anggaran ${tahunAnggaran}.</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div style="text-align: center; font-weight: 800; font-size: 10.5pt; margin: 8pt 0 5pt 0; letter-spacing: 0.08em;">
            MEMUTUSKAN:
          </div>

          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-bottom: 5pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2pt 0; white-space: nowrap; border: none !important;">Menetapkan</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; font-weight: 700; padding: 2pt 0; border: none !important;">
                KEPUTUSAN KEPALA ${sek.nama || 'SD NEGERI KALISALAK 01'} TENTANG PEMBENTUKAN DAN PENETAPAN TIM PELAKSANA PROGRAM KERJA "${report.title.toUpperCase()}" TAHUN ANGGARAN ${tahunAnggaran}.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 4pt 0 2pt 0; white-space: nowrap; border: none !important;">KESATU</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 4pt 0 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 4pt 0 2pt 0; border: none !important;">
                Membentuk dan mengangkat Tim Pelaksana Kegiatan <strong>${report.title}</strong> ${sek.nama || 'SD Negeri Kalisalak 01'} Tahun Anggaran ${tahunAnggaran} dengan susunan personalia dan rincian pembagian tugas sebagaimana tercantum pada tabel berikut:
              </td>
            </tr>
          </table>

          <table class="print-table" style="margin-top: 4pt; margin-bottom: 6pt;">
            <thead>
              <tr>
                <th style="width: 32px; text-align: center;">No</th>
                <th style="width: 32%;">Nama &amp; NIP Pejabat</th>
                <th style="width: 25%;">Kedudukan dalam Tim</th>
                <th>Rincian Tugas &amp; Tanggung Jawab</th>
              </tr>
            </thead>
            <tbody>
              ${effectiveTimTable.map(r => `
                <tr>
                  <td style="text-align: center;">${r.no}</td>
                  <td>
                    <strong>${(r.namaNip || '').split('\n')[0]}</strong>
                    <div style="font-size: 8.5pt; color: #333333; margin-top: 1pt;">${(r.namaNip || '').split('\n').slice(1).join(' ') || ''}</div>
                  </td>
                  <td><strong>${r.jabatan}</strong></td>
                  <td style="text-align: justify; font-size: 9pt;">${(r.tugas || '').replace(/\n/g, '<br>')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-top: 4pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KEDUA</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Tim Pelaksana sebagaimana dimaksud pada Diktum KESATU bertugas menyusun rencana kerja operasional, melaksanakan tahapan kegiatan sesuai matriks jadwal, mengkoordinasikan administrasi, serta menyusun dan menyampaikan laporan pertanggungjawaban kepada Kepala Sekolah.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KETIGA</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Segala pembiayaan yang timbul sehubungan dengan pelaksanaan tugas tim ini dibebankan pada pos anggaran Bantuan Operasional Satuan Pendidikan (BOSP) ${sek.nama || 'SD Negeri Kalisalak 01'} yang relevan.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KEEMPAT</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Surat Keputusan ini berlaku sejak tanggal ditetapkan, dan apabila di kemudian hari terdapat kekeliruan akan dilakukan perbaikan sebagaimana mestinya.
              </td>
            </tr>
          </table>

          <div style="margin-top: 18pt; display: flex; justify-content: flex-end; width: 100%; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 48%; text-align: center; font-size: 10.5pt; line-height: 1.25;">
              <div>Ditetapkan di : ${per.titimangsaTempat || sek.kecamatan || 'Margasari'}</div>
              <div>Pada tanggal : ${printDateFull}</div>
              <div style="margin-top: 4pt; font-weight: 700;">Kepala ${sek.nama || 'SD Negeri Kalisalak 01'}</div>
              <div style="height: 55px;"></div>
              <div style="font-weight: 700; text-decoration: underline;">${pej.kepalaNama || 'Imamudin, S.Pd.SD'}</div>
              <div style="font-size: 9.5pt; margin-top: 2pt;">NIP. ${pej.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>
      `;

      const originalDocTitle = document.title;
      const sanitizedTitle = (report.title || 'SK_Tim').replace(/[^a-zA-Z0-9]/g, '_');
      document.title = `LAMPIRAN_SK_TIM_${String(report.id).padStart(2, '0')}_${sanitizedTitle}_${(sek.nama || 'SDN_KALISALAK_01').replace(/\s+/g, '_')}_${currentRealtimeYear}`;

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = originalDocTitle;
        }, 1000);
      }, 250);
    }
  }

  global.laporPrint = new LaporPrintEngine();

})(typeof window !== 'undefined' ? window : global);
