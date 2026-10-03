/**
 * RKT PRINT ENGINE
 * Modul Pencetakan Dokumen Induk RKT (Rencana Kerja Tahunan)
 * Standar Permendikbudristek & Kemenpan-RB
 * 
 * Fitur:
 * 1. Tata letak formal kedinasan (bebas dari emoji informal)
 * 2. Layout Campuran:
 *    - Portrait untuk Cover, Penetapan, Validasi, Pengantar, Daftar Isi, Bab I, Bab II, Bab V, Lampiran
 *    - Landscape otomatis (@page landscape-page) untuk BAB III (EDS), BAB IV (Lembar Kerja RKT), dan Lampiran 4 (Analisis 12 Bulan)
 * 3. Lembar Validasi Pengawas dikosongkan dengan teks resmi: [ LEMBAR DIISI OLEH PENGAWAS ]
 * 4. Penanggalan Cerdas:
 *    - Tahun RKT = Tahun Berjalan + 1
 *    - Tanggal dokumen RKT = 31 Desember tahun berjalan
 *    - Berita Acara & SK bertitimangsa dinamis dengan hari dan tahun terbilang otomatis
 * 5. Pemanggilan Data Master 100% dinamis (masterDb)
 */

(function (global) {
  'use strict';

  class RktPrintEngine {
    constructor() {}

    getOfficialKopHtml(g = {}) {
      return `
        <div class="official-kop kop-dinas-double" style="display: flex; align-items: center; border-bottom: 3px double #000; padding-bottom: 6pt; margin-bottom: 12pt;">
          <div style="width: 80px; flex-shrink: 0; text-align: left;">
            <img src="assets/LOGO RKT.svg" alt="Logo RKT" class="kop-logo" style="width: 68px; height: auto; object-fit: contain;">
          </div>
          <div class="kop-text" style="text-align: center; flex-grow: 1; padding: 0 10px; margin-right: 25px;">
            <div class="kop-line-1" style="font-size: 11.5pt; font-weight: 700; text-transform: uppercase;">PEMERINTAH KABUPATEN TEGAL</div>
            <div class="kop-line-2" style="font-size: 12.5pt; font-weight: 700; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
            <div class="kop-line-3" style="font-size: 14pt; font-weight: 900; text-transform: uppercase;">${g.sekolahNama || 'SD NEGERI KALISALAK 01'}</div>
            <div class="kop-line-4" style="font-size: 10pt; font-weight: 700; text-transform: uppercase;">KORWILCAM BIDANG PENDIDIKAN KECAMATAN MARGASARI</div>
            <div class="kop-address" style="font-size: 8pt; font-style: italic; margin-top: 2px;">${g.sekolahAlamat || 'Jl. Kyai Abdul Latif RT 01 RW 10, Kalisalak, Margasari 52463'}</div>
          </div>
        </div>
      `;
    }

    printDocument(app, rktData, skipPrint = false) {
      if (window.masterDb) {
        window.masterDb.ensureSchemaIntegrity();
      }

      const g = (window.masterDb ? window.masterDb.getPeriode() : {}) || (rktData ? rktData.general : {}) || {};
      const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || {};
      const pej = (window.masterDb ? window.masterDb.getPejabat(true) : {}) || {};

      Object.assign(g, {
        sekolahNama: sek.nama || g.sekolahNama,
        sekolahNpsn: sek.npsn || g.sekolahNpsn,
        sekolahAlamat: sek.alamat || g.sekolahAlamat,
        kecamatan: sek.kecamatan || g.kecamatan,
        kabupaten: sek.kabupaten || g.kabupaten,
        provinsi: sek.provinsi || g.provinsi,
        kepalaNama: pej.kepalaNama || g.kepalaNama,
        kepalaNip: pej.kepalaNip || g.kepalaNip,
        kepalaPangkat: pej.kepalaPangkat || g.kepalaPangkat,
        kepalaJabatan: pej.kepalaJabatan || g.kepalaJabatan,
        komiteNama: pej.komiteNama || g.komiteNama,
        pengawasNama: pej.pengawasNama || g.pengawasNama || "Yeyen Anggraeni, S.Pd.SD.",
        pengawasNip: pej.pengawasNip || g.pengawasNip || "198610132010012016",
        kadisdikNama: pej.kadisdikNama || g.kadisdikNama,
        kadisdikNip: pej.kadisdikNip || g.kadisdikNip,
        kadisdikPangkat: pej.kadisdikPangkat || g.kadisdikPangkat,
        kadisdikJabatan: pej.kadisdikJabatan || g.kadisdikJabatan
      });

      const b1 = (rktData && rktData.bab1) || {};
      const b2 = (rktData && rktData.bab2) || {};
      const b3 = (rktData && rktData.bab3) || {};
      const b4 = (rktData && rktData.bab4) || {};
      const b5 = (rktData && rktData.bab5) || {};
      const lamp = (rktData && rktData.lampiran) || {};

      const printArea = document.getElementById('print-section');
    if (!printArea) return;

    // g provided by wrapper
    // b1 provided by wrapper
    // b2 provided by wrapper
    // b3 provided by wrapper
    // b4 provided by wrapper
    // b5 provided by wrapper
    // lamp provided by wrapper

    const ptkList = (window.masterDb ? window.masterDb.getTendik() : []);

    printArea.innerHTML = `
      <div class="print-document rkt-official-print">
        
        <!-- ===================================================================
             1. HALAMAN COVER / JUDUL RESMI PERSIS ACUAN REFERENSI
             =================================================================== -->
        <div class="rkt-formal-cover">
          <!-- BAGIAN ATAS: LOGO & JUDUL RESMI PERSIS ACUAN DRAFT RKT SD 2027 -->
          <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div style="margin-bottom: 25pt;">
              <img src="assets/LOGO RKT.svg" alt="Logo Kabupaten Tegal" style="width: 120px; height: auto; object-fit: contain;">
            </div>

            <div style="text-align: center; font-family: 'Times New Roman', Times, Georgia, serif; font-weight: 700; color: #000000; line-height: 1.35;">
              <div style="font-size: 16pt; letter-spacing: 0.5px;">RENCANA KERJA TAHUNAN</div>
              <div style="font-size: 14pt; letter-spacing: 0.5px; margin: 3pt 0;">( RKT )</div>
              <div style="font-size: 16pt; letter-spacing: 0.5px; margin: 3pt 0;">TAHUN ${g.tahunRkt || '2027'}</div>
              <div style="font-size: 16pt; letter-spacing: 0.5px; margin-top: 8pt;">${(g.sekolahNama || 'SD NEGERI KALISALAK 01').toUpperCase()}</div>
              <div style="font-size: 11pt; font-weight: 400; margin-top: 6pt; line-height: 1.35;">
                Alamat : ${g.sekolahAlamat || 'Jl. Kyai Abdul Latif, RT.1/RW.10, Kalisalak, Kec. Margasari, Kab. Tegal Kode Pos 52463'}<br>
                Kecamatan ${g.kecamatan || 'Margasari'} Kabupaten ${g.kabupaten ? g.kabupaten.replace(/^Kabupaten\s+/i, '') : 'Tegal'}
              </div>
            </div>
          </div>

          <!-- BAGIAN TENGAH: ORNAMEN 3 GARIS VERTIKAL RESMI -->
          <div class="cover-lines-ornament">
            <div class="cover-line-side"></div>
            <div class="cover-line-center"></div>
            <div class="cover-line-side"></div>
          </div>

          <!-- BAGIAN BAWAH: INSTANSI RESMI PEMKAB TEGAL -->
          <div style="text-align: center; font-family: 'Times New Roman', Times, Georgia, serif; font-weight: 700; color: #000000; line-height: 1.35; font-size: 13.5pt; letter-spacing: 0.5px; width: 100%;">
            <div>PEMERINTAH KABUPATEN TEGAL</div>
            <div>DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
            <div>KABUPATEN TEGAL</div>
            <div style="margin-top: 4pt; font-size: 14pt;">${g.tahunRkt || '2027'}</div>
          </div>
        </div>

        <!-- ===================================================================
             2. LEMBAR PENETAPAN TRIPARTIT (KOMITE, KS, KADISDIK)
             =================================================================== -->
        <div class="rkt-print-page rkt-prelim-page">
          <div style="text-align: center; font-weight: 700; margin-bottom: 22pt;">
            <div style="font-size: 14pt; letter-spacing: 0.5px;">LEMBAR PENETAPAN</div>
            <div style="font-size: 13pt; margin-top: 3pt;">RENCANA KERJA TAHUNAN (RKT)</div>
            <div style="font-size: 13pt;">TAHUN ${g.tahunRkt || '2027'}</div>
            <div style="font-size: 13.5pt; font-weight: 800; margin-top: 4pt; letter-spacing: 0.5px;">${g.sekolahNama || 'SD NEGERI KALISALAK 01'}</div>
          </div>

          <p class="print-paragraph" style="text-indent: 1.25cm; margin-bottom: 22pt; line-height: 1.5;">
            ${(window.RKT_NARRATIVES ? window.RKT_NARRATIVES.getPenetapan(g) : `Setelah dilakukan serangkaian kegiatan evaluasi, perencanaan dan workshop penyusunan Rencana Kerja Tahunan Sekolah Dasar Negeri Kalisalak 01 Kecamatan Margasari Kabupaten Tegal yang melibatkan Kepala Sekolah, pendidik, tenaga kependidikan, pengawas sekolah dan komite sekolah maka Rencana Kerja Tahunan (RKT) Sekolah Dasar Negeri Kalisalak 01 ditetapkan untuk menjadi pedoman kinerja sekolah di SD Negeri Kalisalak 01 pada Tahun ${g.tahunRkt || '2027'}.`)}
          </p>

          <div class="signature-block" style="break-inside: avoid; page-break-inside: avoid;">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 12pt;">
              <div style="text-align: left; width: 320px; font-size: 11pt;">
                <div>Ditetapkan di : ${g.titimangsaTempat || 'Margasari'}</div>
                <div>Pada tanggal : ${g.titimangsaTanggalPenetapan || '31 Desember 2026'}</div>
              </div>
            </div>

            <table class="signature-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 11pt; line-height: 1.3; break-inside: avoid; page-break-inside: avoid;">
              <tr style="border: none !important; break-inside: avoid; page-break-inside: avoid;">
                <td style="width: 50%; text-align: center; vertical-align: top; border: none !important; padding: 0 10pt; break-inside: avoid; page-break-inside: avoid;">
                  <div class="role">Mengetahui<br><span style="font-weight: 700;">Komite Sekolah</span></div>
                  <div class="sig-space" style="height: 65px;"></div>
                  <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.komiteNama || 'IDA ELISA'}</div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top; border: none !important; padding: 0 10pt; break-inside: avoid; page-break-inside: avoid;">
                  <div class="role">Mengesahkan<br><span style="font-weight: 700;">Kepala SD Negeri Kalisalak 01</span></div>
                  <div class="sig-space" style="height: 65px;"></div>
                  <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
                  <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
                </td>
              </tr>
              <tr style="border: none !important; break-inside: avoid; page-break-inside: avoid;">
                <td colspan="2" style="text-align: center; padding-top: 25pt; border: none !important; break-inside: avoid; page-break-inside: avoid;">
                  <div class="role">Mengetahui,<br><span style="font-weight: 700;">Plt. Kepala Dinas Pendidikan dan Kebudayaan<br>Kabupaten Tegal,</span></div>
                  <div class="sig-space" style="height: 65px;"></div>
                  <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kadisdikNama || 'WINARTO, S.E., M.M.'}</div>
                  <div class="nip" style="break-before: avoid; page-break-before: avoid;">${g.kadisdikPangkat || 'Pembina Tk. I'}<br>NIP ${g.kadisdikNip || '196901251996031003'}</div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- ===================================================================
             3. LEMBAR VALIDASI DAN VERIFIKASI PENGAWAS SEKOLAH
             =================================================================== -->
        <div class="rkt-print-page rkt-prelim-page">
          <div style="text-align: center; font-weight: 700; margin-bottom: 18pt;">
            <div style="font-size: 14pt; letter-spacing: 0.5px;">LEMBAR VALIDASI DAN VERIFIKASI</div>
            <div style="font-size: 13pt; margin-top: 3pt;">RENCANA KERJA TAHUNAN (RKT) TAHUN ${g.tahunRkt || '2027'}</div>
            <div style="font-size: 13.5pt; font-weight: 800; margin-top: 4pt; letter-spacing: 0.5px;">${g.sekolahNama || 'SD NEGERI KALISALAK 01'}</div>
          </div>

          <p class="print-paragraph" style="text-indent: 1.25cm; margin-bottom: 14pt; line-height: 1.5;">
            ${(window.RKT_NARRATIVES ? window.RKT_NARRATIVES.getValidasi(g) : `Rencana Kerja Tahunan (RKT) ${g.sekolahNama || 'SD Negeri Kalisalak 01'} Kecamatan ${g.kecamatan || 'Margasari'} Kabupaten Tegal Tahun ${g.tahunRkt || '2027'} telah divalidasi dan diverifikasi oleh Pengawas Sekolah dan merekomendasikan Rencana Kerja Tahunan (RKT) ${g.sekolahNama || 'SD Negeri Kalisalak 01'} Kecamatan Margasari Kabupaten Tegal Tahun ${g.tahunRkt || '2027'} untuk ditetapkan penggunaannya.`)}
          </p>

          <table class="print-table table-full-width" style="width: 100%; font-size: 9.5pt; margin-bottom: 12pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 45%;">Komponen Verifikasi Instrumen RKT</th>
                <th style="width: 20%; text-align: center;">Status Kelayakan</th>
                <th style="width: 30%; text-align: center;">Catatan / Rekomendasi Pengawas</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="text-align: center;" class="cell-no">1</td><td>Kelengkapan Tata Naskah (Cover, Lembar Penetapan, Validasi, Pengantar, Daftar Isi)</td><td style="height: 28px;"></td><td></td></tr>
              <tr><td style="text-align: center;" class="cell-no">2</td><td>BAB I Pendahuluan (Latar Belakang, Landasan Hukum, Tujuan RKT)</td><td style="height: 28px;"></td><td></td></tr>
              <tr><td style="text-align: center;">3</td><td>BAB II Profil Sekolah (Visi Misi Tujuan, Data PTK &amp; Murid, Dana BOS, Sarpras)</td><td style="height: 28px;"></td><td></td></tr>
              <tr><td style="text-align: center;">4</td><td>BAB III Evaluasi Diri Sekolah (EDS Internal, Rapor Pendidikan, RKT Lalu, Rekomendasi)</td><td style="height: 28px;"></td><td></td></tr>
              <tr><td style="text-align: center;">5</td><td>BAB IV Lembar Kerja RKT (Target Capaian, Rencana PBD, ARKAS, 8 SNP, Jadwal)</td><td style="height: 28px;"></td><td></td></tr>
              <tr><td style="text-align: center;">6</td><td>BAB V Penutup (Kesimpulan, Saran dan Rekomendasi)</td><td style="height: 28px;"></td><td></td></tr>
              <tr><td style="text-align: center;">7</td><td>LAMPIRAN 1 - 5 (Undangan/Daftar Hadir/Notulen, Kaldik, Foto, Analisis Rutin, SK Tim)</td><td style="height: 28px;"></td><td></td></tr>
            </tbody>
          </table>
          <div style="border: 1.5px dashed #334155; padding: 10pt; margin: 10pt 0; text-align: center; font-weight: 800; font-size: 11pt; color: #0f172a; background: #f8fafc; letter-spacing: 0.5px;">
            [ LEMBAR DIISI OLEH PENGAWAS ]
          </div>

          <p class="print-paragraph" style="text-indent: 1.25cm; margin-bottom: 18pt; line-height: 1.5;">
            Berdasarkan hasil verifikasi dan validasi di atas, Rencana Kerja Tahunan (RKT) ${g.sekolahNama || 'SD Negeri Kalisalak 01'} dinyatakan <strong>MEMENUHI PERSYARATAN</strong> dan <strong>DIREKOMENDASIKAN</strong> untuk disahkan serta dipergunakan sebagai pedoman operasional penyelenggaraan pendidikan Tahun Anggaran ${g.tahunRkt || '2027'}.
          </p>

          <div class="signature-block" style="margin-top: 25pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 320px; text-align: center; font-size: 11pt; break-inside: avoid; page-break-inside: avoid;">
              <div>${g.titimangsaTempat || 'Margasari'}, ${g.titimangsaTanggalValidasi || '28 Desember 2026'}</div>
              <div class="role" style="font-weight: 700; margin-top: 4pt;">Pengawas Pembina Sekolah Dasar,</div>
              <div class="sig-space" style="height: 65px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.pengawasNama || 'Yeyen Anggraeni, S.Pd.SD.'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.pengawasNip || '198610132010012016'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             4. KATA PENGANTAR
             =================================================================== -->
        <div class="rkt-print-page rkt-prelim-page">
          <div style="text-align: center; font-weight: 700; margin-bottom: 18pt;">
            <div style="font-size: 14pt; letter-spacing: 0.5px;">KATA PENGANTAR</div>
          </div>

          <p class="print-paragraph">
            Puji syukur senantiasa kami panjatkan Kehadirat Allah SWT, Tuhan Yang Maha Kuasa yang telah memberikan rahmat dan karunianya kepada kami, Tim Penyusun Rencana Kerja Tahunan (RKT) ${g.sekolahNama || 'SD Negeri Kalisalak 01'} sehingga dapat menyelesaikan Penyusunan Rencana Kerja Tahunan (RKT) ${g.sekolahNama || 'SD Negeri Kalisalak 01'} tahun ${g.tahunRkt || '2027'}.
          </p>

          <p class="print-paragraph">
            Dokumen Rencana Kerja Tahunan (RKT) ini berisi sasaran, program, dan kegiatan tahunan yang dirancang untuk mencapai target yang diharapkan oleh satuan pendidikan. Dokumen RKT digunakan sebagai pedoman operasional menyusun ARKAS, menyelaraskan program dengan rapor pendidikan, memudahkan Kepala Sekolah memantau progres pelaksanaan program, serta menjadi kerangka kerja harian yang jelas sehingga program selaras dengan visi misi satuan pendidikan.
          </p>

          <p class="print-paragraph">
            Dokumen ini memastikan setiap kegiatan memiliki arah yang jelas, efisien dalam penganggaran, serta memudahkan evaluasi kinerja. Mengacu pada tujuan tersebut, ${g.sekolahNama || 'SD Negeri Kalisalak 01'} selalu berupaya meningkatkan kualitas pendidikan secara komprehensif, sehingga output yang dihasilkan oleh sekolah dapat mewujudkan visi misi sekolah secara maksimal.
          </p>

          <p class="print-paragraph">
            Akhirnya kepada semua pihak yang telah berpartisipasi dalam menyusun Rencana Kerja Tahunan (RKT) ini, kami sampaikan terima kasih.
          </p>

          <div class="signature-block" style="margin-top: 25pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 320px; text-align: center; font-size: 11pt; break-inside: avoid; page-break-inside: avoid;">
              <div>${g.titimangsaTempat || 'Margasari'}, ${g.titimangsaTanggalPengantar || '23 Desember 2026'}</div>
              <div class="name" style="font-weight: 700; margin-top: 4pt; break-after: avoid; page-break-after: avoid;">Tim Penyusun RKT ${g.tahunRkt || '2027'}<br>${g.sekolahNama || 'SD NEGERI KALISALAK 01'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             5. DAFTAR ISI
             =================================================================== -->
        <div class="rkt-print-page rkt-prelim-page">
          <div style="text-align: center; font-weight: 800; margin-bottom: 22pt;">
            <div style="font-size: 16pt; letter-spacing: 1px;">DAFTAR ISI</div>
          </div>

          <div class="toc-wrapper">
            <div class="toc-item">
              <span class="toc-title"><strong>COVER</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>i</strong></span>
            </div>
            <div class="toc-item">
              <span class="toc-title"><strong>LEMBAR PENETAPAN</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>ii</strong></span>
            </div>
            <div class="toc-item">
              <span class="toc-title"><strong>LEMBAR VALIDASI DAN VERIFIKASI</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>iii</strong></span>
            </div>
            <div class="toc-item">
              <span class="toc-title"><strong>KATA PENGANTAR</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>iv</strong></span>
            </div>
            <div class="toc-item">
              <span class="toc-title"><strong>DAFTAR ISI</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>v</strong></span>
            </div>
            <div class="toc-item">
              <span class="toc-title"><strong>DAFTAR TABEL</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>vi</strong></span>
            </div>

            <div class="toc-separator"></div>

            <div class="toc-item">
              <span class="toc-title"><strong>BAB I PENDAHULUAN</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>1</strong></span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">A. Latar Belakang</span>
              <span class="toc-dots"></span>
              <span class="toc-page">1</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">B. Landasan Hukum</span>
              <span class="toc-dots"></span>
              <span class="toc-page">2</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">C. Tujuan RKT</span>
              <span class="toc-dots"></span>
              <span class="toc-page">3</span>
            </div>

            <div class="toc-separator"></div>

            <div class="toc-item">
              <span class="toc-title"><strong>BAB II PROFIL SEKOLAH</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>5</strong></span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">A. Visi, Misi dan Tujuan Sekolah</span>
              <span class="toc-dots"></span>
              <span class="toc-page">5</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">B. Data Tendik dan Murid</span>
              <span class="toc-dots"></span>
              <span class="toc-page">6</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">C. Perkiraan Dana BOS</span>
              <span class="toc-dots"></span>
              <span class="toc-page">8</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">D. Sarana dan Prasarana</span>
              <span class="toc-dots"></span>
              <span class="toc-page">9</span>
            </div>

            <div class="toc-separator"></div>

            <div class="toc-item">
              <span class="toc-title"><strong>BAB III EVALUASI DIRI SEKOLAH</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>10</strong></span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">A. Evaluasi Diri Sekolah Internal</span>
              <span class="toc-dots"></span>
              <span class="toc-page">10</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">B. Analisis Laporan Rapor Pendidikan</span>
              <span class="toc-dots"></span>
              <span class="toc-page">11</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">C. Evaluasi RKT Tahun Lalu</span>
              <span class="toc-dots"></span>
              <span class="toc-page">13</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">D. Analisis Prioritas Rekomendasi</span>
              <span class="toc-dots"></span>
              <span class="toc-page">16</span>
            </div>

            <div class="toc-separator"></div>

            <div class="toc-item">
              <span class="toc-title"><strong>BAB IV LEMBAR KERJA RKT 2027</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>18</strong></span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">A. Target Capaian Kinerja 2027</span>
              <span class="toc-dots"></span>
              <span class="toc-page">18</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">B. Rencana Kegiatan PBD</span>
              <span class="toc-dots"></span>
              <span class="toc-page">19</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">C. Rencana Kerja ARKAS</span>
              <span class="toc-dots"></span>
              <span class="toc-page">21</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">D. Rencana Kerja Tahunan (RKT) 8 SNP</span>
              <span class="toc-dots"></span>
              <span class="toc-page">23</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">E. Program Kerja Strategis dan Jadwal</span>
              <span class="toc-dots"></span>
              <span class="toc-page">26</span>
            </div>

            <div class="toc-separator"></div>

            <div class="toc-item">
              <span class="toc-title"><strong>BAB V PENUTUP</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>28</strong></span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">A. Kesimpulan</span>
              <span class="toc-dots"></span>
              <span class="toc-page">28</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">B. Saran dan Rekomendasi</span>
              <span class="toc-dots"></span>
              <span class="toc-page">28</span>
            </div>

            <div class="toc-separator"></div>

            <div class="toc-item">
              <span class="toc-title"><strong>LAMPIRAN</strong></span>
              <span class="toc-dots"></span>
              <span class="toc-page"><strong>29</strong></span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">1. Undangan, Daftar Hadir, dan Notulen Penyusunan RKT/ARKAS</span>
              <span class="toc-dots"></span>
              <span class="toc-page">29</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">2. Kalender Pendidikan (Kaldik)</span>
              <span class="toc-dots"></span>
              <span class="toc-page">33</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">3. Foto Dokumentasi Kegiatan</span>
              <span class="toc-dots"></span>
              <span class="toc-page">34</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">4. Analisis Kegiatan Sekolah Rutin 12 Bulan</span>
              <span class="toc-dots"></span>
              <span class="toc-page">35</span>
            </div>
            <div class="toc-item toc-sub">
              <span class="toc-title">5. SK Tim Penyusun RKT/ARKAS</span>
              <span class="toc-dots"></span>
              <span class="toc-page">37</span>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             5b. DAFTAR TABEL
             =================================================================== -->
        <div class="rkt-print-page rkt-prelim-page" style="page-break-before: always; break-before: page;">
          <div style="text-align: center; font-weight: 800; margin-bottom: 22pt;">
            <div style="font-size: 16pt; letter-spacing: 1px;">DAFTAR TABEL</div>
          </div>

          <div class="toc-wrapper">
            <div class="toc-item">
              <span class="toc-title">1. Tabel 2.1 Data Siswa</span>
              <span class="toc-dots"></span>
              <span class="toc-page">7</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">2. Tabel 2.2 Perkiraan Dana BOS 2027 TW I-IV</span>
              <span class="toc-dots"></span>
              <span class="toc-page">8</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">3. Tabel 2.3 Data Sarana dan Prasarana</span>
              <span class="toc-dots"></span>
              <span class="toc-page">9</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">4. Tabel 3.1 Rekapitulasi Hasil Evaluasi Diri Sekolah</span>
              <span class="toc-dots"></span>
              <span class="toc-page">10</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">5. Tabel 3.2 Analisis Laporan Rapor Pendidikan</span>
              <span class="toc-dots"></span>
              <span class="toc-page">11</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">6. Tabel 3.3 Evaluasi RKT Tahun Lalu</span>
              <span class="toc-dots"></span>
              <span class="toc-page">13</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">7. Tabel 3.4 Analisis Prioritas Rekomendasi</span>
              <span class="toc-dots"></span>
              <span class="toc-page">16</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">8. Tabel 4.1 Target Capaian Kinerja 2027</span>
              <span class="toc-dots"></span>
              <span class="toc-page">18</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">9. Tabel 4.2 Rencana Kegiatan PBD</span>
              <span class="toc-dots"></span>
              <span class="toc-page">19</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">10. Tabel 4.3 Rencana Kerja ARKAS</span>
              <span class="toc-dots"></span>
              <span class="toc-page">21</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">11. Tabel 4.4 Rencana Kerja Tahunan 8 SNP</span>
              <span class="toc-dots"></span>
              <span class="toc-page">23</span>
            </div>
            <div class="toc-item">
              <span class="toc-title">12. Tabel 4.5 Program Kerja Strategis dan Jadwal</span>
              <span class="toc-dots"></span>
              <span class="toc-page">26</span>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             6. BAB I PENDAHULUAN
             =================================================================== -->
        <div class="rkt-print-page rkt-main-doc">
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 15pt;">
            BAB I PENDAHULUAN
          </div>

          ${(window.RKT_NARRATIVES ? window.RKT_NARRATIVES.renderBab1Html(b1, g) : `
            <div style="font-weight: 700; margin-bottom: 4pt;">A. Latar Belakang</div>
            <p class="print-paragraph" style="white-space: pre-line;">${b1.latarBelakang || ''}</p>

            <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">B. Landasan Hukum</div>
            <ol style="margin-left: 20px; margin-bottom: 12pt;">
              ${(b1.landasanHukum || []).map(lh => `<li style="margin-bottom: 3pt; text-align: justify;">${lh}</li>`).join('')}
            </ol>

            <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">C. Tujuan RKT</div>
            <p style="text-align: justify; margin-bottom: 4pt;"><strong>1. Tujuan Umum:</strong> ${b1.tujuanUmum || ''}</p>
            <div style="font-weight: 700; margin-top: 4pt;">2. Tujuan Khusus:</div>
            <ul style="margin-left: 20px; margin-bottom: 10pt;">
              ${(b1.tujuanKhusus || []).map(tk => `<li style="margin-bottom: 3pt; text-align: justify;">${tk}</li>`).join('')}
            </ul>
            <p class="print-paragraph" style="margin-top: 6pt;">
              RKT ini memberikan acuan operasional bagi seluruh warga sekolah, memandu prioritas alokasi belanja BOS pada ARKAS, serta menjadi instrumen akuntabilitas verifikasi-validasi ketercapaian standar mutu pendidikan daerah.
            </p>
          `)}
        </div>

        <!-- ===================================================================
             7. BAB II PROFIL SEKOLAH
             =================================================================== -->
        <div class="rkt-print-page">
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 15pt;">
            BAB II PROFIL SEKOLAH
          </div>

          <div style="font-weight: 700; margin-bottom: 4pt;">A. Visi, Misi dan Tujuan Sekolah</div>
          <div style="font-weight: 700; font-style: italic; margin-bottom: 3pt;">1. Visi Sekolah:</div>
          <p class="print-paragraph" style="font-style: italic; font-weight: 700; text-align: center; margin-bottom: 6pt;">
            "${b2.visi || 'Terwujudnya Peserta Didik yang Beriman, Bertaqwa, Berakhlak Mulia, Cerdas, Terampil, Mandiri, dan Berwawasan Lingkungan.'}"
          </p>

          <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 3pt;">2. Misi Sekolah:</div>
          <ol style="margin-left: 20px; margin-bottom: 8pt;">
            ${(b2.misi || []).map(m => `<li style="margin-bottom: 2pt; text-align: justify;">${m}</li>`).join('')}
          </ol>

          <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 3pt;">3. Tujuan Sekolah:</div>
          <ol style="margin-left: 20px; margin-bottom: 12pt;">
            ${(b2.tujuan || []).map(t => `<li style="margin-bottom: 2pt; text-align: justify;">${t}</li>`).join('')}
          </ol>

          <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">B. Data Tendik dan Murid</div>
          <div style="font-weight: 700; font-size: 9.5pt; margin-bottom: 3pt;">1. Data Pendidik dan Tenaga Kependidikan (PTK)</div>
          <table class="print-table table-fit-content" style="font-size: 9pt; margin-bottom: 12pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 35%;">Nama Pejabat / NIP</th>
                <th style="width: 35%;">Jabatan / Tugas Mengajar</th>
                <th style="width: 25%;">Kualifikasi &amp; Gol.</th>
              </tr>
            </thead>
            <tbody>
              ${ptkList.map(p => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${p.no}</td>
                  <td><strong>${p.nama}</strong><br><span style="font-size: 8pt; color: #333;">NIP. ${p.nip}</span></td>
                  <td>${p.jabatan}</td>
                  <td>${p.kualifikasi}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="font-weight: 700; font-size: 9.5pt; margin-bottom: 3pt;">2. Data Murid</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 2.1 Data Siswa</div>
          <table class="print-table table-fit-content" style="font-size: 9.5pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 40%;">Tingkat / Rombel</th>
                <th style="width: 18%; text-align: center;">Laki-Laki</th>
                <th style="width: 18%; text-align: center;">Perempuan</th>
                <th style="width: 18%; text-align: center;">Jumlah Total</th>
              </tr>
            </thead>
            <tbody>
              ${(window.masterDb ? window.masterDb.getKelasDanSiswa() : (b2.dataMurid || [])).map((m, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${m.kelas}</strong></td>
                  <td style="text-align: center;">${m.laki}</td>
                  <td style="text-align: center;">${m.perempuan}</td>
                  <td style="text-align: center; font-weight: 700;">${m.total}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="font-weight: 700; background: #f1f5f9;">
                <td colspan="2" style="text-align: center;">JUMLAH KESELURUHAN</td>
                <td style="text-align: center;">${(window.masterDb ? window.masterDb.getKelasDanSiswa() : (b2.dataMurid || [])).reduce((acc, c) => acc + (c.laki || 0), 0)}</td>
                <td style="text-align: center;">${(window.masterDb ? window.masterDb.getKelasDanSiswa() : (b2.dataMurid || [])).reduce((acc, c) => acc + (c.perempuan || 0), 0)}</td>
                <td style="text-align: center; font-size: 10.5pt;">${(window.masterDb ? window.masterDb.getKelasDanSiswa() : (b2.dataMurid || [])).reduce((acc, c) => acc + (c.total || 0), 0)} Siswa</td>
              </tr>
            </tfoot>
          </table>

          <div style="page-break-before: always; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">C. Perkiraan Dana BOS</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 2.2 Perkiraan Dana BOS 2027 TW I-IV</div>
          <p style="text-align: justify; font-size: 10pt; margin-bottom: 4pt;">
            Pagu Bantuan Operasional Satuan Pendidikan (BOSP) dihitung berdasarkan jumlah murid riil sejumlah <strong>${(b2.danaBos && (b2.danaBos.siswaTotal || b2.danaBos.totalSiswa)) || 225} siswa</strong> dikalikan satuan biaya BOS Kemendikdasmen sebesar <strong>Rp ${((b2.danaBos && (b2.danaBos.satuanBiaya || b2.danaBos.tarifPerSiswa)) || 900000).toLocaleString('id-ID')}/siswa/tahun</strong>.
          </p>
          <table class="print-table table-fit-content" style="font-size: 9pt; margin-bottom: 12pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 35%;">Tahap Penyaluran</th>
                <th style="width: 18%; text-align: center;">Persentase</th>
                <th style="width: 22%; text-align: right;">Alokasi Nominal (Rp)</th>
                <th style="width: 20%;">Jadwal Penyaluran</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="text-align: center;" class="cell-no">1</td><td>Tahap I - Triwulan I</td><td style="text-align: center;">30%</td><td style="text-align: right; font-weight: 700;">Rp ${((b2.danaBos && b2.danaBos.tw1) || 60750000).toLocaleString('id-ID')}</td><td>Januari - Maret</td></tr>
              <tr><td style="text-align: center;" class="cell-no">2</td><td>Tahap I - Triwulan II</td><td style="text-align: center;">30%</td><td style="text-align: right; font-weight: 700;">Rp ${((b2.danaBos && b2.danaBos.tw2) || 60750000).toLocaleString('id-ID')}</td><td>April - Juni</td></tr>
              <tr><td style="text-align: center;" class="cell-no">3</td><td>Tahap II - Triwulan III</td><td style="text-align: center;">20%</td><td style="text-align: right; font-weight: 700;">Rp ${((b2.danaBos && b2.danaBos.tw3) || 40500000).toLocaleString('id-ID')}</td><td>Juli - September</td></tr>
              <tr><td style="text-align: center;" class="cell-no">4</td><td>Tahap II - Triwulan IV</td><td style="text-align: center;">20%</td><td style="text-align: right; font-weight: 700;">Rp ${((b2.danaBos && b2.danaBos.tw4) || 40500000).toLocaleString('id-ID')}</td><td>Oktober - Desember</td></tr>
            </tbody>
            <tfoot>
              <tr style="font-weight: 700; background: #f1f5f9;">
                <td colspan="2" style="text-align: center;">TOTAL PAGU DANA BOS 2027</td>
                <td style="text-align: center;">100%</td>
                <td style="text-align: right; font-size: 10pt;">Rp ${((b2.danaBos && (b2.danaBos.totalPaguBos || b2.danaBos.totalPagu)) || 202500000).toLocaleString('id-ID')}</td>
                <td>1 Tahun Anggaran</td>
              </tr>
            </tfoot>
          </table>

          <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">D. Sarana dan Prasarana</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 2.3 Data Sarana dan Prasarana</div>
          <table class="print-table table-fit-content" style="font-size: 8.5pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 40%;">Jenis Sarana / Prasarana</th>
                <th style="width: 14%; text-align: center;">Jumlah</th>
                <th style="width: 14%; text-align: center;">Kondisi Baik</th>
                <th style="width: 14%; text-align: center;">Rusak Ringan</th>
                <th style="width: 14%; text-align: center;">Rusak Berat</th>
              </tr>
            </thead>
            <tbody>
              ${(b2.sarpras || []).map((sp, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td>${sp.jenis}</td>
                  <td style="text-align: center; font-weight: 700;">${sp.jumlah}</td>
                  <td style="text-align: center;">${sp.baik}</td>
                  <td style="text-align: center;">${sp.rusakRingan}</td>
                  <td style="text-align: center;">${sp.rusakBerat}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- ===================================================================
             8. BAB III EVALUASI DIRI SEKOLAH
             =================================================================== -->
        <div class="rkt-print-page print-landscape bab-3-section landscape-content" style="page-break-before: always; break-before: page;">
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 15pt;">
            BAB III EVALUASI DIRI SEKOLAH
          </div>

          ${(window.RKT_NARRATIVES ? window.RKT_NARRATIVES.renderBab3AHtml(b3, g) : `
            <div style="font-weight: 700; margin-bottom: 4pt;">A. Evaluasi Diri Sekolah Internal</div>
            <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 3.1 Rekapitulasi Hasil Evaluasi Diri Sekolah</div>
            <table class="print-table table-fit-content" style="font-size: 9.5pt; margin-bottom: 16pt;">
              <thead>
                <tr>
                  <th style="width: 40px; min-width: 40px;" class="col-nowrap">No</th>
                  <th style="width: 320px;">Aspek Evaluasi Standar Mutu</th>
                  <th style="width: 130px; text-align: center;">Persentase (%)</th>
                  <th style="width: 130px; text-align: center;">Kategori Mutu</th>
                </tr>
              </thead>
              <tbody>
                ${(b3.eds || []).map((e, idx) => `
                  <tr>
                    <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                    <td><strong>${e.aspek || ''}</strong></td>
                    <td style="text-align: center; font-weight: 700;">${e.persentase ? (e.persentase.includes('%') ? e.persentase : e.persentase + '%') : (e.persen ? e.persen + '%' : '-')}</td>
                    <td style="text-align: center;">${e.kategori || 'Baik'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `)}

          <div style="page-break-before: always; break-before: page; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">B. Analisis Laporan Rapor Pendidikan</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 3.2 Analisis Laporan Rapor Pendidikan</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 14%;">Indikator Dimensi</th>
                <th style="width: 12%;" class="col-nowrap">Capaian</th>
                <th style="width: 12%;" class="col-nowrap">Skor Max</th>
                <th style="width: 12%;" class="col-nowrap">Skor Min</th>
                <th style="width: 30%;">Definisi Capaian Mutu</th>
                <th style="width: 6%;" class="col-nowrap">Th Lalu</th>
                <th style="width: 6%;" class="col-nowrap">Th Ini</th>
                <th style="width: 8%;" class="col-nowrap">Trend</th>
              </tr>
            </thead>
            <tbody>
              ${(b3.raporPbd || []).map((r, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${r.indikator}</strong></td>
                  <td style="text-align: center;">${r.capaian}</td>
                  <td style="text-align: center;">${r.skorTertinggi}</td>
                  <td style="text-align: center;">${r.skorTerendah}</td>
                  <td style="font-size: 7.5pt; text-align: justify;">${r.definisi}</td>
                  <td style="text-align: center;" class="col-nowrap">${r.skorLalu}</td>
                  <td style="text-align: center; font-weight: 700;" class="col-nowrap">${r.skorIni}</td>
                  <td style="text-align: center; font-weight: 700; color: ${(r.trend || '').includes('Naik') ? '#047857' : '#b91c1c'};" class="col-nowrap">${r.trend}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="page-break-before: always; break-before: page; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">C. Evaluasi RKT Tahun Lalu</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 3.3 Evaluasi RKT Tahun Lalu</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 40px; min-width: 40px;" class="col-nowrap">No</th>
                <th style="width: 26%;">Nama Program &amp; Standar</th>
                <th style="width: 37%;">Hasil Evaluasi Pelaksanaan</th>
                <th style="width: 37%;">Tindak Lanjut Pembenahan 2027</th>
              </tr>
            </thead>
            <tbody>
              ${(b3.evaluasiRktLalu || []).map((ev, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${ev.program || ''}</strong><br><span style="font-size: 7.5pt; color: #555;">${ev.snp || ''}</span></td>
                  <td style="text-align: justify; font-size: 8pt;">${ev.hasilEvaluasi || ev.keterlaksanaan || 'Terlaksana dengan baik'}</td>
                  <td style="text-align: justify; font-size: 8pt;">${ev.tindakLanjut || 'Dipertahankan dan ditingkatkan'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="page-break-before: always; break-before: page; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">D. Analisis Prioritas Rekomendasi</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 3.4 Analisis Prioritas Rekomendasi</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 14%;">Identifikasi Prioritas</th>
                <th style="width: 10%;">Capaian</th>
                <th style="width: 16%;">Akar Masalah</th>
                <th style="width: 16%;">Kegiatan Benahi</th>
                <th style="width: 26%;">Inspirasi Benahi</th>
                <th style="width: 18%;">Kegiatan ARKAS</th>
              </tr>
            </thead>
            <tbody>
              ${(b3.prioritasPbd || []).map((p, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${p.identifikasi}</strong></td>
                  <td style="text-align: center;">${p.capaian}<br><span style="font-weight: 700;">${p.skor}</span></td>
                  <td>${p.akarMasalah}</td>
                  <td><strong>${p.kegiatanBenahi}</strong></td>
                  <td style="text-align: justify; font-size: 7.5pt;">${p.inspirasi || p.inspirasiBenahi || ''}</td>
                  <td>${p.kegiatanArkas}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- ===================================================================
             9. BAB IV LEMBAR KERJA RKT 2027
             =================================================================== -->
        <div class="rkt-print-page print-landscape landscape-content">
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 15pt;">
            BAB IV LEMBAR KERJA RKT 2027
          </div>

          <div style="font-weight: 700; margin-bottom: 4pt;">A. Target Capaian Kinerja 2027</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 4.1 Target Capaian Kinerja 2027</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 9pt; margin-bottom: 12pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 22%;">Standar Nasional (8 SNP)</th>
                <th style="width: 48%;">Target Kinerja Operasional 2027</th>
                <th style="width: 26%;">Target yang Dapat Diukur</th>
              </tr>
            </thead>
            <tbody>
              ${(b4.targetKinerja || []).map((tk, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${tk.snp}</strong></td>
                  <td>${tk.target}</td>
                  <td style="font-weight: 700;">${tk.targetTerukur}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="page-break-before: always; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">B. Rencana Kegiatan PBD</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 4.2 Rencana Kegiatan PBD</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 15.5%;">Identifikasi Masalah</th>
                <th style="width: 17%;">Akar Masalah</th>
                <th style="width: 17%;">Kegiatan Benahi</th>
                <th style="width: 39%;">Penjelasan Implementasi Kegiatan</th>
                <th style="width: 8%; text-align: center;" class="col-nowrap">Butuh Biaya?</th>
              </tr>
            </thead>
            <tbody>
              ${(b4.rencanaPbd || []).map((rp, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${rp.identifikasi}</strong></td>
                  <td>${rp.akarMasalah}</td>
                  <td><strong>${rp.kegiatanBenahi}</strong></td>
                  <td style="text-align: justify;">${rp.implementasi || rp.uraianKegiatan || ''}</td>
                  <td style="text-align: center; font-weight: 700;">${rp.butuhBiaya}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="page-break-before: always; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">C. Rencana Kerja ARKAS</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 4.3 Rencana Kerja ARKAS</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 18.5%;">Kegiatan ARKAS</th>
                <th style="width: 38%;">Uraian Rincian Belanja Barang/Jasa</th>
                <th style="width: 8%; text-align: center;" class="col-nowrap">Bulan</th>
                <th style="width: 8%; text-align: center;" class="col-nowrap">Volume</th>
                <th style="width: 11%; text-align: right;" class="col-nowrap">Harga (Rp)</th>
                <th style="width: 13%; text-align: right;" class="col-nowrap">Total Biaya (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${(b4.rencanaArkas || []).map((ra, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${ra.kegiatanArkas}</strong></td>
                  <td>${ra.uraian}</td>
                  <td style="text-align: center;">${ra.bulan}</td>
                  <td style="text-align: center;">${ra.jumlah} ${ra.satuan}</td>
                  <td style="text-align: right;">${ra.hargaSatuan}</td>
                  <td style="text-align: right; font-weight: 700;">${ra.total}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="font-weight: 700; background: #f1f5f9;">
                <td colspan="6" style="text-align: center;">TOTAL ALOKASI ANGGARAN ARKAS PBD</td>
                <td style="text-align: right; font-size: 9pt;">Rp ${((b2.danaBos && (b2.danaBos.totalPaguBos || b2.danaBos.totalPagu)) || 202500000).toLocaleString('id-ID')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="page-break-before: always; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">D. Rencana Kerja Tahunan (RKT) 8 SNP</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 4.4 Rencana Kerja Tahunan 8 SNP</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 14%;">Standar SNP</th>
                <th style="width: 14.5%;">Program PBD</th>
                <th style="width: 32%;">Kegiatan Utama &amp; Sub-Kegiatan</th>
                <th style="width: 8%; text-align: center;" class="col-nowrap">Kategori</th>
                <th style="width: 8%; text-align: center;" class="col-nowrap">Sumber</th>
                <th style="width: 12%; text-align: right;" class="col-nowrap">Biaya (Rp)</th>
                <th style="width: 8%; text-align: center;" class="col-nowrap">Bulan</th>
              </tr>
            </thead>
            <tbody>
              ${(b4.rkt8Snp || []).map((s, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${s.snp}</strong></td>
                  <td>${s.program || s.programPbd || ''}</td>
                  <td><strong>${s.kegiatanUtama}</strong><br><span style="font-size: 7.5pt; color: #333;">${s.subKegiatan}</span></td>
                  <td style="text-align: center;">${s.jenis}</td>
                  <td style="text-align: center;">${s.sumberDana}</td>
                  <td style="text-align: right; font-weight: 700;">${s.biaya}</td>
                  <td style="text-align: center;">${s.bulan}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="page-break-before: always; font-weight: 700; margin-top: 10pt; margin-bottom: 4pt;">E. Program Kerja Strategis dan Jadwal</div>
          <div style="font-weight: 700; margin-bottom: 3pt;">Tabel 4.5 Program Kerja Strategis dan Jadwal</div>
          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 15%;">Sasaran Indikator</th>
                <th style="width: 16.5%;">Program Utama</th>
                <th style="width: 38%;">Kegiatan &amp; Indikator Capaian</th>
                <th style="width: 11%; text-align: center;" class="col-nowrap">Waktu</th>
                <th style="width: 16%;">Penanggung Jawab</th>
              </tr>
            </thead>
            <tbody>
              ${(b4.jadwalStrategis || []).map((j, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${j.sasaran}</strong></td>
                  <td>${j.program}</td>
                  <td><strong>${j.kegiatan}</strong><br><span style="font-size: 7.5pt; color: #444;">Target: ${j.indikator}</span></td>
                  <td style="text-align: center; font-weight: 700;">${j.waktu}</td>
                  <td>${j.penanggungJawab}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- ===================================================================
             10. BAB V PENUTUP
             =================================================================== -->
        <div class="rkt-print-page">
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 15pt;">
            BAB V PENUTUP
          </div>

          ${(window.RKT_NARRATIVES ? window.RKT_NARRATIVES.renderBab5Html(b5, g) : `
            <div style="font-weight: 700; margin-bottom: 4pt;">A. Kesimpulan</div>
            <p class="print-paragraph" style="white-space: pre-line;">${b5.simpulan || ''}</p>

            <div style="font-weight: 700; margin-top: 12pt; margin-bottom: 4pt;">B. Saran dan Rekomendasi</div>
            <div style="font-weight: 700; margin-bottom: 2pt;">1. Bagi Pendidik dan Tenaga Kependidikan:</div>
            <p style="text-align: justify; margin-bottom: 6pt;">
              Meningkatkan komitmen dan konsistensi dalam mengimplementasikan pembelajaran berdiferensiasi yang berpusat pada murid, aktif dalam komunitas belajar intra maupun antar-sekolah (KKG), serta mendokumentasikan setiap proses evaluasi formatif secara berkala.
            </p>

            <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 2pt;">2. Bagi Komite Sekolah dan Orang Tua Murid:</div>
            <p style="text-align: justify; margin-bottom: 6pt;">
              Terus memperkuat sinergi dan kemitraan kolaboratif dengan pihak sekolah dalam mengawasi perkembangan putra-putrinya di rumah, memberikan dukungan moral dan material terhadap program kokurikuler/ekstrakurikuler, serta bersama-sama menjaga iklim sekolah yang aman dan nyaman.
            </p>

            <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 2pt;">3. Bagi Pengawas Pembina dan Dinas Pendidikan dan Kebudayaan:</div>
            <p style="text-align: justify; margin-bottom: 15pt;">
              Diharapkan dapat terus memberikan bimbingan teknis yang berkelanjutan, memonitor keterlaksanaan program kerja RKT melalui pendampingan berkala, serta memfasilitasi kebutuhan sarana teknologi dan pelatihan peningkatan kapasitas guru guna percepatan peningkatan mutu sekolah.
            </p>
          `)}

          <div class="signature-block" style="margin-top: 30pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 320px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div>${g.titimangsaTempat || 'Margasari'}, ${g.titimangsaTanggalPenetapan || '31 Desember 2026'}</div>
              <div class="role" style="font-weight: 700; margin-top: 4pt;">Kepala ${g.sekolahNama || 'SD Negeri Kalisalak 01'}</div>
              <div class="sig-space" style="height: 75px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             11. LAMPIRAN-LAMPIRAN RESMI
             =================================================================== -->
        
        <!-- ===================================================================
             11. LAMPIRAN-LAMPIRAN RESMI
             =================================================================== -->
        
        <!-- ===================================================================
             LAMPIRAN 1: UNDANGAN, DAFTAR HADIR, DAN NOTULEN PENYUSUNAN RKT/ARKAS
             =================================================================== -->

        <!-- 1.1 SURAT UNDANGAN RESMI -->
        <div class="rkt-print-page">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 1.1 : SURAT UNDANGAN RAPAT
          </div>
          ${this.getOfficialKopHtml(g)}
          
          <div style="display: flex; justify-content: space-between; margin-top: 8pt; margin-bottom: 12pt;">
            <table class="table-titik-dua" style="width: 58%; margin: 0;">
              <tr>
                <td class="col-label">Nomor</td>
                <td class="col-colon">:</td>
                <td>421.2 / 085 / 04.68 / 2026</td>
              </tr>
              <tr>
                <td class="col-label">Sifat</td>
                <td class="col-colon">:</td>
                <td>Penting / Biasa</td>
              </tr>
              <tr>
                <td class="col-label">Lampiran</td>
                <td class="col-colon">:</td>
                <td>-</td>
              </tr>
              <tr>
                <td class="col-label">Perihal</td>
                <td class="col-colon">:</td>
                <td><strong>Undangan Rapat Koordinasi Penyusunan RKT/ARKAS ${g.tahunRkt || '2027'}</strong></td>
              </tr>
            </table>
            <div style="text-align: right; width: 40%; font-size: 10.5pt;">
              <div>Margasari, 18 Desember 2026</div>
              <div style="margin-top: 10pt; text-align: left;">
                <div>Kepada Yth.</div>
                <div>1. Bapak/Ibu Dewan Guru &amp; Tenaga Kependidikan</div>
                <div>2. Ketua &amp; Pengurus Komite Sekolah</div>
                <div>di Tempat</div>
              </div>
            </div>
          </div>

          <p class="print-paragraph">
            Dengan hormat, dalam rangka menyusun perencanaan program kerja satuan pendidikan yang berbasis data (PBD) bersumber dari Rapor Pendidikan, kami mengharap kehadiran Bapak/Ibu pada rapat koordinasi penyusunan RKT dan ARKAS yang akan diselenggarakan pada:
          </p>

          <table class="table-titik-dua" style="width: 90%; margin: 8pt 0 12pt 20pt;">
            <tr>
              <td class="col-label">Hari / Tanggal</td>
              <td class="col-colon">:</td>
              <td>Kamis, 22 Desember 2026</td>
            </tr>
            <tr>
              <td class="col-label">Waktu</td>
              <td class="col-colon">:</td>
              <td>Pukul 09.00 WIB s.d. Selesai</td>
            </tr>
            <tr>
              <td class="col-label">Tempat</td>
              <td class="col-colon">:</td>
              <td>Ruang Guru ${g.sekolahNama || 'SD Negeri Kalisalak 01'}</td>
            </tr>
            <tr>
              <td class="col-label">Acara</td>
              <td class="col-colon">:</td>
              <td><strong>Koordinasi &amp; Musyawarah Penyusunan Draf RKT &amp; ARKAS Tahun ${g.tahunRkt || '2027'}</strong></td>
            </tr>
          </table>

          <p class="print-paragraph">
            Mengingat arti penting agenda musyawarah ini bagi kemajuan mutu pendidikan dan akuntabilitas tata kelola BOSP di satuan pendidikan kita, dimohon hadir tepat waktu. Atas perhatian dan kerja sama yang baik, kami sampaikan terima kasih.
          </p>

          <div class="signature-block" style="margin-top: 25pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 280px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div class="role">Kepala Sekolah,</div>
              <div class="sig-space" style="height: 55pt;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- 1.2 BERITA ACARA RAPAT -->
        <div class="rkt-print-page">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 1.2 : BERITA ACARA MUSYAWARAH
          </div>
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 4pt;">
            BERITA ACARA RAPAT PENYUSUNAN RKT/ARKAS TAHUN ${g.tahunRkt || '2027'}
          </div>
          <div style="text-align: center; font-weight: 700; font-size: 11pt; margin-bottom: 20pt;">
            SD NEGERI KALISALAK 01 KECAMATAN MARGASARI KABUPATEN TEGAL
          </div>

          <p class="print-paragraph">
            Pada hari ini, <strong>${g.beritaAcaraHari || "Kamis"}</strong> tanggal <strong>${g.beritaAcaraTanggalTerbilang || "Dua Puluh Dua"}</strong> bulan <strong>${g.beritaAcaraBulan || "Desember"}</strong> tahun <strong>${g.beritaAcaraTahunTerbilang || "Dua Ribu Dua Puluh Enam"}</strong> bertempat di ${g.sekolahNama || "SD Negeri Kalisalak 01"} Kecamatan Margasari Kabupaten Tegal, telah diselenggarakan Musyawarah Penyusunan Dokumen Rencana Kerja Tahunan (RKT) dan Rencana Kegiatan dan Anggaran Sekolah (ARKAS) Tahun Anggaran ${g.tahunRkt || '2027'}.
          </p>

          <p class="print-paragraph">
            Rapat musyawarah dihadiri oleh Kepala Sekolah, Dewan Guru, Tenaga Kependidikan, serta Pengurus Komite Sekolah sebagaimana terlampir dalam daftar hadir.
          </p>

          <p class="print-paragraph">
            Setelah mendengarkan penjelasan, paparan hasil evaluasi rapor mutu pendidikan, serta pembahasan secara musyawarah dan mufakat, maka disepakati:
          </p>

          <ol style="margin-left: 20px; margin-bottom: 15pt;">
            <li style="margin-bottom: 5pt; text-align: justify;">Menyetujui substansi dokumen Rencana Kerja Tahunan (RKT) SD Negeri Kalisalak 01 Tahun Anggaran ${g.tahunRkt || '2027'} yang disusun berbasis data Rapor Pendidikan;</li>
            <li style="margin-bottom: 5pt; text-align: justify;">Menyetujui rincian rencana pembiayaan kegiatan program sekolah pada Rencana Kegiatan dan Anggaran Sekolah (RKAS/ARKAS) BOSP Tahun Anggaran ${g.tahunRkt || '2027'} sebesar Rp ${((b2.danaBos && (b2.danaBos.totalPaguBos || b2.danaBos.totalPagu)) || 202500000).toLocaleString('id-ID')};</li>
            <li style="margin-bottom: 5pt; text-align: justify;">Mengajukan dokumen RKT dan RKAS/ARKAS Tahun ${g.tahunRkt || '2027'} kepada Pengawas Pembina dan Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Tegal untuk divalidasi dan disahkan secara resmi.</li>
          </ol>

          <p class="print-paragraph">
            Demikian Berita Acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
          </p>

          <div class="signature-block" style="margin-top: 35pt; display: flex; justify-content: space-between; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 250px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div>Mengetahui,</div>
              <div class="role" style="font-weight: 700;">Komite Sekolah,</div>
              <div class="sig-space" style="height: 70px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.komiteNama || 'IDA ELISA'}</div>
            </div>
            <div style="width: 250px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div>Mengesahkan,</div>
              <div class="role" style="font-weight: 700;">Kepala SD Negeri Kalisalak 01,</div>
              <div class="sig-space" style="height: 70px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- 1.3 NOTULEN RAPAT -->
        <div class="rkt-print-page">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 1.3 : NOTULEN RAPAT KOORDINASI
          </div>
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 4pt;">
            NOTULEN RAPAT KOORDINASI PENYUSUNAN RKT/ARKAS 2027
          </div>
          <div style="text-align: center; font-weight: 700; font-size: 11pt; margin-bottom: 15pt;">
            SD NEGERI KALISALAK 01 KECAMATAN MARGASARI
          </div>

          <table class="table-titik-dua" style="width: 100%; margin-bottom: 10pt;">
            <tr><td class="col-label">Hari / Tanggal</td><td class="col-colon">:</td><td>Kamis, 22 Desember 2026</td></tr>
            <tr><td class="col-label">Waktu</td><td class="col-colon">:</td><td>09.00 s.d. 13.30 WIB</td></tr>
            <tr><td class="col-label">Tempat</td><td class="col-colon">:</td><td>Ruang Guru ${g.sekolahNama || 'SD Negeri Kalisalak 01'}</td></tr>
            <tr><td class="col-label">Pimpinan Rapat</td><td class="col-colon">:</td><td>Kepala Sekolah (${g.kepalaNama || 'Imamudin, S. Pd.SD'})</td></tr>
            <tr><td class="col-label">Notulis</td><td class="col-colon">:</td><td>Retno Amalia, S.Pd.</td></tr>
            <tr><td class="col-label">Peserta Hadir</td><td class="col-colon">:</td><td>11 orang (Kepala Sekolah, Dewan Guru, Tendik, Komite Sekolah)</td></tr>
          </table>

          <div style="font-weight: 700; margin-top: 8pt; margin-bottom: 4pt;">Jalannya Rapat &amp; Catatan Pembahasan:</div>
          <ol style="margin-left: 20px; font-size: 10pt; text-align: justify; line-height: 1.4;">
            <li style="margin-bottom: 4pt;"><strong>Pembukaan:</strong> Rapat dibuka secara resmi oleh Kepala Sekolah dengan mengajak peserta memanjatkan rasa syukur dan menegaskan esensi Perencanaan Berbasis Data (PBD).</li>
            <li style="margin-bottom: 4pt;"><strong>Pemaparan Rapor Mutu:</strong> Analisis Rapor Pendidikan menunjukkan peningkatan literasi dan numerasi, namun kualitas pembelajaran dan iklim keamanan butuh pembenahan berkelanjutan.</li>
            <li style="margin-bottom: 4pt;"><strong>Tanggapan Komite Sekolah:</strong> Ibu Ida Elisa mendukung alokasi belanja BOS untuk buku bermutu perpustakaan dan pemeliharaan sarana jamban murid.</li>
            <li style="margin-bottom: 4pt;"><strong>Perumusan Lembar Kerja:</strong> Tim menyusun target capaian kinerja 8 SNP, pemetaan kegiatan benahi PBD, dan input pos belanja ARKAS 2027.</li>
            <li style="margin-bottom: 4pt;"><strong>Kesepakatan Akhir:</strong> Draf dokumen RKT dan RKAS/ARKAS disepakati untuk difinalisasi dan diajukan proses validasi kepada Pengawas Sekolah.</li>
          </ol>

          <div class="signature-block" style="margin-top: 30pt; display: flex; justify-content: space-between; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 250px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div>Mengetahui,</div>
              <div class="role" style="font-weight: 700;">Pimpinan Rapat / Kepala Sekolah,</div>
              <div class="sig-space" style="height: 65px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
            <div style="width: 250px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div>Margasari, 22 Desember 2026</div>
              <div class="role" style="font-weight: 700;">Notulis Rapat,</div>
              <div class="sig-space" style="height: 65px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">Retno Amalia, S.Pd.</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">Guru Kelas III</div>
            </div>
          </div>
        </div>

        <!-- 1.4 DAFTAR HADIR -->
        <div class="rkt-print-page" style="font-size: 10.5pt; line-height: 1.4;">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 1.4 : DAFTAR HADIR MUSYAWARAH
          </div>
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 4pt;">
            DAFTAR HADIR TIM PENYUSUN RKT/ARKAS TAHUN ${g.tahunRkt || '2027'}
          </div>
          <div style="text-align: center; font-weight: 700; font-size: 11pt; margin-bottom: 15pt;">
            SD NEGERI KALISALAK 01 • KAMIS, 22 DESEMBER 2026
          </div>

          <table class="print-table table-full-width" style="width: 100%; font-size: 9pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 35%;">Nama Peserta Rapat</th>
                <th style="width: 30%;">Jabatan / Unsur</th>
                <th style="width: 30%; text-align: center;" colspan="2">Tanda Tangan</th>
              </tr>
            </thead>
            <tbody>
              ${[
                { no: 1, nama: g.kepalaNama || 'IMAMUDIN, S. Pd.SD', jabatan: 'Kepala Sekolah / Penanggung Jawab' },
                { no: 2, nama: g.komiteNama || 'IDA ELISA', jabatan: 'Ketua Komite Sekolah' },
                { no: 3, nama: 'Ismi Kamaliyah, S.Pd.', jabatan: 'Guru Kelas VI / Ketua Tim' },
                { no: 4, nama: 'Retno Amalia, S.Pd.', jabatan: 'Guru Kelas III / Sekretaris' },
                { no: 5, nama: 'Syifa Septiyani Fauziah, S.Pd.', jabatan: 'Guru Kelas V / Bendahara' },
                { no: 6, nama: 'Hendry Badriarto, S.Pd.', jabatan: 'Guru Kelas IV / Anggota' },
                { no: 7, nama: 'Siti Maria Ulfah, S.Pd.', jabatan: 'Guru Kelas II / Anggota' },
                { no: 8, nama: 'Santi Anggraeni, S.Pd.', jabatan: 'Guru Kelas I / Anggota' },
                { no: 9, nama: 'Siti Khanah, S.Pd.I', jabatan: 'Guru PAI / Anggota' },
                { no: 10, nama: 'Emma Puji Rakhastiwi, S.M', jabatan: 'Guru PJOK / Anggota' },
                { no: 11, nama: 'Nanang Puji Sutrisno Fathyrin', jabatan: 'Penjaga / Tenaga Kependidikan' }
              ].map(d => `
                <tr>
                  <td style="text-align: center;">${d.no}</td>
                  <td><strong>${d.nama}</strong></td>
                  <td>${d.jabatan}</td>
                  <td style="width: 70px; height: 26px; vertical-align: middle;">${d.no % 2 === 1 ? d.no + '. .........' : ''}</td>
                  <td style="width: 70px; height: 26px; vertical-align: middle;">${d.no % 2 === 0 ? d.no + '. .........' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="signature-block" style="margin-top: 25pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 300px; text-align: center; break-inside: avoid; page-break-inside: avoid;">
              <div>Margasari, 22 Desember 2026</div>
              <div class="role" style="font-weight: 700; margin-top: 4pt;">Kepala Sekolah,</div>
              <div class="sig-space" style="height: 65px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             LAMPIRAN 2: KALDIK (KALENDER PENDIDIKAN TP 2026/2027)
             =================================================================== -->
        <div class="rkt-print-page">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 2 : KALENDER PENDIDIKAN (KALDIK)
          </div>
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 2pt;">
            KALENDER PENDIDIKAN (KALDIK) SD NEGERI KALISALAK 01
          </div>
          <div style="text-align: center; font-weight: 700; font-size: 11pt; margin-bottom: 12pt;">
            TAHUN PELAJARAN 2026/2027
          </div>

          <p class="print-paragraph" style="font-size: 9.5pt; margin-bottom: 8pt;">
            Kalender Pendidikan (Kaldik) ini menjadi pedoman operasional pengaturan alokasi waktu kegiatan belajar mengajar, pelaksanaan asesmen diagnostik, formatif, sumatif, serta hari libur sekolah bagi SD Negeri Kalisalak 01:
          </p>

          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; margin-bottom: 10pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 15%;">Semester</th>
                <th style="width: 20%;">Bulan / Periode</th>
                <th style="width: 45%;">Agenda Operasional Satuan Pendidikan</th>
                <th style="width: 15%; text-align: center;">Hari Efektif</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">1</td>
                <td><strong>Semester 1 (Ganjil)</strong></td>
                <td>Juli 2026</td>
                <td>Hari pertama masuk sekolah TP 2026/2027 (13 Juli 2026), Masa Pengenalan Lingkungan Sekolah (MPLS), Asesmen Awal Pembelajaran</td>
                <td style="text-align: center; font-weight: 700;">16 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">2</td>
                <td><strong>Semester 1 (Ganjil)</strong></td>
                <td>Agustus 2026</td>
                <td>HUT Kemerdekaan RI Ke-81, Pelaksanaan Kegiatan Proyek P5, Evaluasi Formatif Awal</td>
                <td style="text-align: center; font-weight: 700;">20 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">3</td>
                <td><strong>Semester 1 (Ganjil)</strong></td>
                <td>September 2026</td>
                <td>Penilaian Tengah Semester (PTS) Ganjil, Sinkronisasi Data Pelaksanaan ANBK Utama</td>
                <td style="text-align: center; font-weight: 700;">22 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">4</td>
                <td><strong>Semester 1 (Ganjil)</strong></td>
                <td>Oktober 2026</td>
                <td>Pelaksanaan Asesmen Nasional (ANBK SD) Gelombang I &amp; II, Monitoring Kombel Belajar</td>
                <td style="text-align: center; font-weight: 700;">22 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">5</td>
                <td><strong>Semester 1 (Ganjil)</strong></td>
                <td>November 2026</td>
                <td>Penilaian Akhir Semester (PAS) Ganjil, Pengolahan Nilai Rapor Semester Ganjil</td>
                <td style="text-align: center; font-weight: 700;">21 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">6</td>
                <td><strong>Semester 1 (Ganjil)</strong></td>
                <td>Desember 2026</td>
                <td>Titimangsa Penyerahan Buku Laporan Hasil Belajar (19 Des 2026), Libur Semester 1 (21-31 Des)</td>
                <td style="text-align: center; font-weight: 700;">15 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">7</td>
                <td><strong>Semester 2 (Genap)</strong></td>
                <td>Januari 2027</td>
                <td>Hari pertama masuk Semester Genap (4 Jan 2027), Kick-off Program Prioritas RKT/PBD</td>
                <td style="text-align: center; font-weight: 700;">21 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">8</td>
                <td><strong>Semester 2 (Genap)</strong></td>
                <td>Februari 2027</td>
                <td>Libur awal Ramadhan 1448 H, Penguatan Literasi/Numerasi Terintegrasi KKG Sekolah</td>
                <td style="text-align: center; font-weight: 700;">19 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">9</td>
                <td><strong>Semester 2 (Genap)</strong></td>
                <td>Maret 2027</td>
                <td>Penilaian Tengah Semester (PTS) Genap, Libur Hari Raya Idul Fitri 1448 H &amp; Cuti Bersama</td>
                <td style="text-align: center; font-weight: 700;">14 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">10</td>
                <td><strong>Semester 2 (Genap)</strong></td>
                <td>April 2027</td>
                <td>Kegiatan Belajar Pembiasaan Karakter Pasca Libur Idul Fitri, Persiapan Ujian Sekolah</td>
                <td style="text-align: center; font-weight: 700;">20 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">11</td>
                <td><strong>Semester 2 (Genap)</strong></td>
                <td>Mei 2027</td>
                <td>Penilaian Sumatif Akhir Jenjang (PSAJ) Kelas VI, Asesmen Sumatif Akhir Tahun (PAT) Kelas I-V</td>
                <td style="text-align: center; font-weight: 700;">19 Hari</td>
              </tr>
              <tr>
                <td style="text-align: center;">12</td>
                <td><strong>Semester 2 (Genap)</strong></td>
                <td>Juni 2027</td>
                <td>Pengumuman Kelulusan Kelas VI, Pembagian Rapor Semester Genap (19 Juni 2027), Libur Akhir TP</td>
                <td style="text-align: center; font-weight: 700;">14 Hari</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="font-weight: 700; background: #f1f5f9;">
                <td colspan="4" style="text-align: center;">TOTAL HARI EFEKTIF BELAJAR TAHUN PELAJARAN 2026/2027</td>
                <td style="text-align: center; font-size: 9.5pt;">223 Hari</td>
              </tr>
            </tfoot>
          </table>

          <div class="signature-block" style="margin-top: 25pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 300px; text-align: center; font-size: 10.5pt; break-inside: avoid; page-break-inside: avoid;">
              <div>Margasari, 13 Juli 2026</div>
              <div class="role" style="font-weight: 700; margin-top: 4pt;">Kepala SD Negeri Kalisalak 01</div>
              <div class="sig-space" style="height: 60px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             LAMPIRAN 3: FOTO KEGIATAN
             =================================================================== -->
        <div class="rkt-print-page">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 3 : DOKUMENTASI FOTO KEGIATAN
          </div>
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 2pt;">
            DOKUMENTASI FOTO KEGIATAN
          </div>
          <div style="text-align: center; font-weight: 700; font-size: 11pt; margin-bottom: 12pt;">
            PENYUSUNAN RKT &amp; ARKAS TAHUN ANGGARAN ${g.tahunRkt || '2027'}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; margin-top: 10pt;">
            ${[0, 1, 2, 3].map(idx => {
              const foto = (lamp.fotoKegiatan && lamp.fotoKegiatan[idx]) || {};
              const imgSrc = foto.dataUrl || foto.url;
              const defaultTitles = [
                'Foto 1: Rapat Koordinasi Tim Penyusun RKT',
                'Foto 2: Musyawarah Bersama Komite Sekolah',
                'Foto 3: Sinkronisasi dan Input ARKAS 4',
                'Foto 4: Validasi &amp; Verifikasi Pengawas Pembina'
              ];
              const defaultDescs = [
                'Kepala Sekolah memimpin pembahasan indikator prioritas Rapor Pendidikan bersama seluruh dewan guru di Ruang Guru (22 Desember 2026).',
                'Penyelarasan aspirasi wali murid dan pertimbangan ketua komite terkait skala prioritas belanja BOS 2027 (22 Desember 2026).',
                'Bendahara BOS dan Tim merinci pos belanja barang/jasa kegiatan pembenahan mutu ke aplikasi resmi ARKAS Kemendikdasmen (24 Desember 2026).',
                'Pengawas Pembina Korwilcam Margasari memverifikasi kelengkapan instrumen tata naskah dan lembar kerja RKT 2027 (28 Desember 2026).'
              ];
              const defaultIcons = ['👥', '🤝', '💻', '📑'];

              return `
                <div style="border: 1px solid #333; padding: 8pt; text-align: center; background: #ffffff;">
                  <div style="height: 140px; border: 1px dashed #999; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; margin-bottom: 6pt; overflow: hidden;">
                    ${imgSrc ? `
                      <img src="${imgSrc}" alt="${foto.title || defaultTitles[idx]}" style="width: 100%; height: 100%; object-fit: cover;">
                    ` : `
                      <div style="font-size: 28pt;">${defaultIcons[idx]}</div>
                      <div style="font-size: 8pt; color: #666; font-weight: 700;">DOKUMENTASI FOTO ${idx + 1}</div>
                    `}
                  </div>
                  <div style="font-weight: 700; font-size: 9pt; margin-bottom: 2pt;">${foto.title || defaultTitles[idx]}</div>
                  <div style="font-size: 8pt; color: #444; line-height: 1.25;">${foto.desc || defaultDescs[idx]}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="margin-top: 25pt; display: flex; justify-content: flex-end;">
            <div style="width: 300px; text-align: center; font-size: 10.5pt;">
              <div>${g.titimangsaTempat || "Margasari"}, ${g.titimangsaTanggalPenetapan}</div>
              <div style="font-weight: 700; margin-top: 4pt;">Kepala SD Negeri Kalisalak 01</div>
              <div style="height: 60px;"></div>
              <div style="font-weight: 700; text-decoration: underline;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div>NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             LAMPIRAN 4: ANALISIS KEGIATAN SEKOLAH RUTIN (12 BULAN)
             =================================================================== -->
        <div class="rkt-print-page print-landscape landscape-content" style="font-size: 10pt; line-height: 1.35;">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 4 : ANALISIS KEGIATAN SEKOLAH RUTIN
          </div>
          <div style="text-align: center; font-weight: 800; font-size: 12pt; margin-bottom: 2pt;">
            ANALISIS KEGIATAN SEKOLAH RUTIN (12 BULAN)
          </div>
          <div style="text-align: center; font-weight: 700; font-size: 10.5pt; margin-bottom: 12pt;">
            SD NEGERI KALISALAK 01 • TAHUN ANGGARAN ${g.tahunRkt || '2027'} (JANUARI S.D. DESEMBER)
          </div>

          <table class="print-table table-full-width" style="width: 100%; font-size: 8.5pt; line-height: 1.35;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 8%; text-align: center;">Bulan</th>
                <th style="width: 36.5%;">Nama Kegiatan Sekolah</th>
                <th style="width: 14%; text-align: right;">Anggaran (Rp)</th>
                <th style="width: 6%; text-align: center;">PBD</th>
                <th style="width: 6%; text-align: center;">Rutin</th>
                <th style="width: 6%; text-align: center;">Insid.</th>
                <th style="width: 20%;">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${(lamp.analisis12Bulan || []).map((ak, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td style="text-align: center; font-weight: 700;">${ak.bulan || ''}</td>
                  <td>${ak.kegiatan || ''}</td>
                  <td style="text-align: right; font-weight: 700;">${ak.anggaran && ak.anggaran !== '-' ? (String(ak.anggaran).startsWith('Rp') ? ak.anggaran : 'Rp ' + ak.anggaran) : '-'}</td>
                  <td style="text-align: center; font-weight: 700;">${(ak.isPbd || ak.kategori === 'PBD') ? 'V' : ''}</td>
                  <td style="text-align: center; font-weight: 700;">${(ak.isRutin || ak.kategori === 'Rutin') ? 'V' : ''}</td>
                  <td style="text-align: center; font-weight: 700;">${(ak.isInsidental || ak.kategori === 'Insidental') ? 'V' : ''}</td>
                  <td style="font-size: 7.5pt;">${ak.keterangan || ak.ket || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="signature-block" style="margin-top: 25pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 300px; text-align: center; font-size: 10pt; break-inside: avoid; page-break-inside: avoid;">
              <div>${g.titimangsaTempat || "Margasari"}, ${g.titimangsaTanggalPenetapan}</div>
              <div class="role" style="font-weight: 700; margin-top: 4pt;">Kepala Sekolah,</div>
              <div class="sig-space" style="height: 60px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             LAMPIRAN 5: SK TIM PENYUSUN RKT/ARKAS
             =================================================================== -->
        <div class="rkt-print-page" style="font-size: 10.5pt; line-height: 1.35;">
          <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 10.5pt; font-weight: 700; color: #000000; margin-bottom: 8pt; letter-spacing: 0.5px;">
            LAMPIRAN 5 : SURAT KEPUTUSAN KEPALA SEKOLAH
          </div>
          ${this.getOfficialKopHtml(g)}

          <div class="print-doc-title" style="text-align: center; margin-bottom: 8pt;">
            <h2 style="font-size: 11.5pt; font-weight: 800; text-transform: uppercase; margin: 0;">SURAT KEPUTUSAN KEPALA SD NEGERI KALISALAK 01</h2>
            <div class="print-doc-nomor" style="font-size: 10pt; margin: 2pt auto; text-align: center !important; text-indent: 0 !important; width: 100% !important; display: block !important;">NOMOR : 421.2 / 086 / 04.68 / 2026</div>
            <div style="font-weight: 800; font-size: 11pt; margin-top: 4pt; text-transform: uppercase;">
              TENTANG<br>
              PEMBENTUKAN DAN PENETAPAN TIM PENYUSUN RENCANA KERJA TAHUNAN (RKT)<br>
              DAN RENCANA KEGIATAN DAN ANGGARAN SEKOLAH (ARKAS)<br>
              SD NEGERI KALISALAK 01 TAHUN ANGGARAN ${g.tahunRkt || '2027'}
            </div>
          </div>

          <!-- KONSIDERANS & DIKTUM SK (TABLE NO-BORDER 3 KOLOM RESMI) -->
          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-top: 4pt; margin-bottom: 4pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2pt 0; white-space: nowrap; border: none !important;">Menimbang</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2pt 0; border: none !important;">
                <table style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt;">
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 0; border: none !important;">a.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 0; border: none !important;">bahwa dalam rangka menjamin kelancaran, akuntabilitas, transparansi, serta efektivitas penyusunan Rencana Kerja Tahunan (RKT) dan RKAS/ARKAS SD Negeri Kalisalak 01 Tahun Anggaran ${g.tahunRkt || '2027'}, dipandang perlu membentuk Tim Penyusun RKT/ARKAS Satuan Pendidikan;</td>
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
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Standar Nasional Pendidikan;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">3.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Permendikdasmen Nomor 8 Tahun 2026 tentang Petunjuk Teknis Pengelolaan Dana BOSP;</td>
                  </tr>
                  <tr style="border: none !important;">
                    <td style="width: 20px; vertical-align: top; padding: 2pt 0 0 0; border: none !important;">4.</td>
                    <td style="vertical-align: top; text-align: justify; padding: 2pt 0 0 0; border: none !important;">Rencana Kegiatan dan Anggaran Sekolah (RKAS/ARKAS) SD Negeri Kalisalak 01 Tahun Anggaran ${g.tahunRkt || '2027'}.</td>
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
                KEPUTUSAN KEPALA SD NEGERI KALISALAK 01 TENTANG PEMBENTUKAN DAN PENETAPAN TIM PENYUSUN RENCANA KERJA TAHUNAN (RKT) DAN ARKAS TAHUN ANGGARAN ${g.tahunRkt || '2027'}.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 3pt 0 2pt 0; white-space: nowrap; border: none !important;">KESATU</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 3pt 0 2pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 3pt 0 2pt 0; border: none !important;">
                Membentuk dan mengangkat Tim Penyusun Rencana Kerja Tahunan (RKT) dan RKAS/ARKAS SD Negeri Kalisalak 01 Tahun Anggaran ${g.tahunRkt || '2027'} dengan susunan personalia dan pembagian tugas sebagaimana tercantum pada tabel berikut:
              </td>
            </tr>
          </table>

          <table class="print-table table-full-width" style="width: 100%; margin-top: 4pt; margin-bottom: 6pt; font-size: 8.5pt;">
            <thead>
              <tr>
                <th style="width: 38px; min-width: 38px;" class="col-nowrap">No</th>
                <th style="width: 35%;">Nama / NIP</th>
                <th style="width: 30%;">Kedudukan dalam Tim</th>
                <th style="width: 30%;">Tugas &amp; Tanggung Jawab Utama</th>
              </tr>
            </thead>
            <tbody>
              ${(window.masterDb ? window.masterDb.getTimPenyusun() : (lamp.timPenyusun || [])).map((t, idx) => `
                <tr>
                  <td style="text-align: center;" class="cell-no">${idx + 1}</td>
                  <td><strong>${t.nama}</strong>${t.nip && t.nip !== '-' ? `<br><span style="font-size: 7.5pt;">NIP. ${t.nip}</span>` : ''}</td>
                  <td><strong>${t.jabatanTim || t.jabatan}</strong></td>
                  <td style="font-size: 8pt; text-align: justify;">${t.tugas || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table class="print-sk-table" style="width: 100%; border: none !important; border-collapse: collapse !important; font-size: 10pt; line-height: 1.35; margin-top: 4pt;">
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KEDUA</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Tim Penyusun sebagaimana dimaksud pada Diktum KESATU bertugas menganalisis Rapor Mutu Pendidikan, merumuskan 5 tabel lembar kerja RKT, menyusun draf dokumen, serta memfasilitasi pengesahan dan sosialisasi kepada warga sekolah.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KETIGA</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Segala pembiayaan yang timbul akibat pelaksanaan keputusan ini dibebankan pada pos anggaran Bantuan Operasional Satuan Pendidikan (BOSP) SD Negeri Kalisalak 01 Tahun Anggaran ${g.tahunRkt || '2027'}.
              </td>
            </tr>
            <tr style="border: none !important;">
              <td style="width: 95px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; white-space: nowrap; border: none !important;">KEEMPAT</td>
              <td style="width: 15px; vertical-align: top; font-weight: 700; padding: 2.5pt 0; text-align: center; border: none !important;">:</td>
              <td style="vertical-align: top; text-align: justify; padding: 2.5pt 0; border: none !important;">
                Keputusan ini mulai berlaku sejak tanggal ditetapkan, dan apabila terdapat kekeliruan di kemudian hari akan diadakan perbaikan sebagaimana mestinya.
              </td>
            </tr>
          </table>

          <div class="signature-block" style="margin-top: 18pt; display: flex; justify-content: flex-end; break-inside: avoid; page-break-inside: avoid;">
            <div style="width: 300px; text-align: center; font-size: 10.5pt; break-inside: avoid; page-break-inside: avoid;">
              <div>Ditetapkan di : Margasari</div>
              <div>Pada tanggal : 20 Desember 2026</div>
              <div class="role" style="margin-top: 4pt; font-weight: 700;">Kepala SD Negeri Kalisalak 01</div>
              <div class="sig-space" style="height: 55px;"></div>
              <div class="name" style="font-weight: 700; text-decoration: underline; break-after: avoid; page-break-after: avoid;">${g.kepalaNama || 'IMAMUDIN, S. Pd.SD'}</div>
              <div class="nip" style="break-before: avoid; page-break-before: avoid;">NIP. ${g.kepalaNip || '197106172003121001'}</div>
            </div>
          </div>
        </div>

      </div>
    `;

    const originalTitle = document.title;
    document.title = `DOKUMEN_RKT_${(g.sekolahNama || 'SDN_KALISALAK_01').replace(/\s+/g, '_')}_TAHUN_${g.tahunRkt || '2027'}`;
    if (!skipPrint) {
      setTimeout(() => {
        try {
          document.querySelectorAll('.sim-toast-stack, .sim-toast, .toast-container, .sim-modal-overlay').forEach(el => el.remove());
        } catch (_) {}
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
        }, 1000);
      }, 250);
    }
  }

    async downloadPdf(app, rktData) {
      if (this._isExporting) return;
      this._isExporting = true;

      // Blur input aktif agar data yang baru saja diedit tersimpan otomatis
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      // Tampilkan indikator proses dan loading overlay agar user tidak klik berulang kali
      if (window.SIM_UI && typeof window.SIM_UI.showLoading === 'function') {
        window.SIM_UI.showLoading(
          'Sedang Menyusun Dokumen PDF Resmi RKT...',
          'Sistem sedang memproses data terbaru, menyusun tata letak naskah dan tabel matriks secara presisi. Mohon tunggu sejenak...'
        );
      } else if (typeof window.showToast === 'function') {
        window.showToast('Memproses file PDF dokumen RKT...', 'info');
      }

      try {
        // Render dokumen terbaru ke dalam print-section (skipPrint = true)
        this.printDocument(app, rktData, true);
        const printSection = document.getElementById('print-section');
        if (!printSection) {
          throw new Error('Elemen dokumen (#print-section) tidak ditemukan.');
        }

        const g = (window.masterDb ? window.masterDb.getPeriode() : {}) || (rktData ? rktData.general : {}) || {};
        const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || {};
        const sekolahClean = (sek.nama || g.sekolahNama || 'SD NEGERI KALISALAK 01').trim().replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
        const tahun = g.tahunRkt || '2027';
        const filename = `RKT_${sekolahClean}_TAHUN_${tahun}.pdf`;

        let downloaded = false;

        // STRATEGI 1: Gunakan Engine Server Headless (Edge / Chrome) untuk hasil PDF vektor terbaik & orientasi campuran
        try {
          const response = await fetch('/api/export-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              html: printSection.innerHTML,
              title: `RKT ${sek.nama || g.sekolahNama || 'SD NEGERI KALISALAK 01'} TAHUN ${tahun}`,
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
            window.SIM_UI.toast(`Dokumen PDF berhasil diunduh: ${filename}`, 'success');
          } else if (typeof window.showToast === 'function') {
            window.showToast(`Dokumen PDF berhasil diunduh: ${filename}`, 'success');
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

    async downloadWordDoc(app, rktData) {
      if (this._isExportingWord) return;
      this._isExportingWord = true;

      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      if (window.SIM_UI && typeof window.SIM_UI.showLoading === 'function') {
        window.SIM_UI.showLoading(
          'Sedang Menyusun Dokumen Word Resmi RKT...',
          'Sistem sedang menyinkronkan data terbaru persis seperti dokumen PDF. Mohon tunggu sejenak...'
        );
      } else if (typeof window.showToast === 'function') {
        window.showToast('Memproses file Word dokumen RKT...', 'info');
      }

      try {
        // Render dokumen terbaru persis seperti yang digunakan pada PDF
        this.printDocument(app, rktData, true);
        const printSection = document.getElementById('print-section');
        if (!printSection) {
          throw new Error('Elemen dokumen (#print-section) tidak ditemukan.');
        }

        const g = (window.masterDb ? window.masterDb.getPeriode() : {}) || (rktData ? rktData.general : {}) || {};
        const sek = (window.masterDb ? window.masterDb.getSekolah() : {}) || {};
        const sekolahClean = (sek.nama || g.sekolahNama || 'SD NEGERI KALISALAK 01').trim().replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
        const tahun = g.tahunRkt || '2027';
        const filename = `RKT_${sekolahClean}_TAHUN_${tahun}.doc`;

        let downloaded = false;

        // STRATEGI 1: Gunakan Endpoint Server /api/export-docx
        try {
          const response = await fetch('/api/export-docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              html: printSection.innerHTML,
              title: `RKT ${sek.nama || g.sekolahNama || 'SD NEGERI KALISALAK 01'} TAHUN ${tahun}`,
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
          }
        } catch (serverErr) {
          console.warn('[Word Export] Server export-docx tidak merespons, beralih ke client fallback:', serverErr);
        }

        // STRATEGI 2: Fallback Client-side Blob (MSO-HTML)
        if (!downloaded) {
          const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>RKT ${sek.nama || g.sekolahNama || 'SD NEGERI KALISALAK 01'} TAHUN ${tahun}</title>
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
    }
    div.print-landscape,
    div.evaluasi-rkt-section,
    div.landscape-content,
    div.bab-3-section {
      page: SectionLandscape;
      mso-page-orientation: landscape;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    table.print-table {
      border-collapse: collapse;
      width: 100%;
    }
    table.table-fit-content {
      width: auto !important;
      max-width: 100% !important;
    }
    table.table-full-width {
      width: 100% !important;
    }
    table.table-titik-dua {
      width: 100%;
      border: none !important;
      border-collapse: collapse !important;
    }
    table.table-titik-dua td {
      border: none !important;
      padding: 2.5pt 4pt;
    }
    table.print-table th, table.print-table td {
      border: 1pt solid #000;
      padding: 4pt 6pt;
    }
    table.print-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .kop-dinas-double {
      border-bottom: 3px double #000000;
      padding-bottom: 6pt;
      margin-bottom: 12pt;
    }
    .toc-item {
      display: flex;
      align-items: baseline;
      margin-bottom: 3.5pt;
      font-size: 9.5pt;
    }
    .toc-item.toc-sub { padding-left: 18px; font-size: 9pt; }
    .toc-title { flex-shrink: 0; white-space: nowrap; }
    .toc-dots { flex-grow: 1; border-bottom: 1.5px dotted #000; margin: 0 5px 3px 5px; }
    .toc-page { flex-shrink: 0; text-align: right; font-weight: bold; min-width: 20px; }
  </style>
</head>
<body>
  <div id="print-section">
    ${printSection.innerHTML}
  </div>
</body>
</html>`;

          const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          downloaded = true;
        }

        if (downloaded) {
          if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
            window.SIM_UI.toast(`Dokumen Word berhasil diunduh: ${filename}`, 'success');
          } else if (typeof window.showToast === 'function') {
            window.showToast(`Dokumen Word berhasil diunduh: ${filename}`, 'success');
          }
        } else {
          throw new Error('Gagal menghasilkan file Word.');
        }

      } catch (err) {
        console.error('[Word Export] Error:', err);
        const errMsg = err.message || 'Terjadi kesalahan sistem saat membuat file Word.';
        if (window.SIM_UI && typeof window.SIM_UI.toast === 'function') {
          window.SIM_UI.toast(`Gagal mengunduh Word: ${errMsg}`, 'danger');
        } else if (typeof window.showToast === 'function') {
          window.showToast(`Gagal mengunduh Word: ${errMsg}`, 'danger');
        }
      } finally {
        if (window.SIM_UI && typeof window.SIM_UI.hideLoading === 'function') {
          window.SIM_UI.hideLoading();
        }
        this._isExportingWord = false;
      }
    }
  }

  global.rktPrint = new RktPrintEngine();

})(typeof window !== 'undefined' ? window : global);
