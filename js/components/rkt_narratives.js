/**
 * RKT NARRATIVES & LONG TEXT COMPONENT REGISTRY
 * SDN KALISALAK 01 - Berdasarkan Dokumen Referensi Resmi:
 * DRAFT RKT SD 2027 / RKT_SDN_KALISALAK_01_TAHUN_2027_FINAL.docx
 * 
 * Unified namespace: window.RKT_NARRATIVES
 * Sentralisasi seluruh narasi, teks panjang, dasar hukum, dan template per BAB.
 * Semua pemanggilan di rkt_app.js, rkt_print.js, dan rkt_data.js tinggal memanggil komponen ini.
 */
(function (global) {
  'use strict';

  const RKT_NARRATIVES = {
    // =========================================================================
    // 1. LEMBAR PENETAPAN & VALIDASI
    // =========================================================================
    getPenetapan: function (general) {
      const g = general || {};
      const sekolah = g.sekolahNama || 'SD NEGERI KALISALAK 01';
      const kec = g.kecamatan || 'Margasari';
      const kab = g.kabupaten || 'Kabupaten Tegal';
      const tahun = g.tahunRkt || '2027';

      return `Setelah dilakukan serangkaian kegiatan evaluasi, perencanaan dan workshop penyusunan Rencana Kerja Tahunan Sekolah Dasar ${sekolah} Kecamatan ${kec} ${kab} yang melibatkan Kepala Sekolah, pendidik, tenaga kependidikan, pengawas sekolah dan komite sekolah maka Rencana Kerja Tahunan (RKT) Sekolah Dasar ${sekolah} ditetapkan untuk menjadi pedoman kinerja sekolah di SD ${sekolah} pada Tahun ${tahun}.`;
    },

    getValidasi: function (general) {
      const g = general || {};
      const sekolah = g.sekolahNama || 'SD NEGERI KALISALAK 01';
      const kec = g.kecamatan || 'Margasari';
      const kab = g.kabupaten || 'Kabupaten Tegal';
      const tahun = g.tahunRkt || '2027';

      return `Rencana Kerja Tahunan (RKT) ${sekolah} ${kab} Tahun ${tahun} telah divalidasi dan diverifikasi oleh Pengawas Sekolah dan merekomendasikan Rencana Kerja Tahunan (RKT) ${sekolah} Kecamatan ${kec} ${kab} Tahun ${tahun} untuk ditetapkan penggunaannya.`;
    },

    // =========================================================================
    // 2. KATA PENGANTAR
    // =========================================================================
    getKataPengantar: function (general) {
      const g = general || {};
      const sekolah = g.sekolahNama || 'SD NEGERI KALISALAK 01';
      const tahun = g.tahunRkt || '2027';

      return {
        paragraf1: `Puji syukur senantiasa kami panjatkan Kehadirat Allah SWT, Tuhan Yang Maha Kuasa yang telah memberikan rahmat dan karunia-Nya kepada kami, Tim Penyusun Rencana Kerja Tahunan (RKT) ${sekolah} sehingga dapat menyelesaikan Penyusunan Rencana Kerja Tahunan (RKT) ${sekolah} tahun ${tahun}.`,
        paragraf2: `Dokumen Rencana Tahunan (RKT) ini berisi sasaran, program, dan kegiatan tahunan yang dirancang untuk mencapai target yang diharapkan oleh satuan pendidikan. Dokumen RKT digunakan sebagai pedoman operasional menyusun ARKAS, menyelaraskan program dengan rapor pendidikan, memudahkan Kepala Sekolah memantau progres pelaksanaan program, serta menjadi kerangka kerja harian yang jelas sehingga program selaras dengan visi misi satuan pendidikan.`,
        paragraf3: `Dokumen ini memastikan setiap kegiatan memiliki arah yang jelas, efisien dalam penganggaran, serta memudahkan evaluasi kinerja. Mengacu pada tujuan tersebut, ${sekolah} selalu berupaya meningkatkan kualitas pendidikan secara komprehensif, sehingga output yang dihasilkan oleh sekolah dapat mewujudkan visi misi sekolah secara maksimal.`,
        paragraf4: `Akhirnya kepada semua pihak yang telah berpartisipasi dalam menyusun Rencana Kerja Tahunan (RKT) ini, kami sampaikan terima kasih.`
      };
    },

    // =========================================================================
    // 3. BAB I PENDAHULUAN
    // =========================================================================
    getBab1: function (general, bab1Data) {
      const g = general || {};
      const b1 = bab1Data || {};
      const sekolah = g.sekolahNama || 'SD NEGERI KALISALAK 01';
      const tahun = g.tahunRkt || '2027';

      const latarBelakang = b1.latarBelakang || (
        `Pendidikan di jenjang Sekolah Dasar (SD) merupakan fondasi utama dalam sistem pendidikan nasional. Pada fase ini, karakter, kecakapan literasi, numerasi, dan kemampuan berpikir kritis anak dibentuk untuk pertama kalinya secara formal. Guna memastikan proses pembelajaran berjalan optimal dan bermutu, sekolah memerlukan perencanaan yang matang, terukur, dan berdampak langsung pada peningkatan kualitas belajar murid.\n\n` +
        `Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional dan Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Standar Nasional Pendidikan (SNP) mengamanatkan setiap satuan pendidikan untuk melakukan perencanaan, pelaksanaan, dan pengawasan guna menjamin mutu pendidikan. Di tingkat operasional sekolah, amanat ini diwujudkan melalui penyusunan Rencana Kerja Tahunan (RKT) sebagai kompas implementasi program jangka pendek (satu tahun anggaran).\n\n` +
        `Penyusunan RKT di ${sekolah} pada tahun ${tahun} tidak lagi didasarkan pada asumsi semata, melainkan mengacu pada prinsip Perencanaan Berbasis Data (PBD). Sumber data utama yang digunakan adalah platform Rapor Pendidikan ${sekolah} tahun 2025. Berdasarkan hasil Rapor Pendidikan tersebut, sekolah masih menghadapi beberapa tantangan nyata, antara lain:\n` +
        `1. Perlunya peningkatan kompetensi Literasi dan Numerasi murid agar mencapai kategori mahir.\n` +
        `2. Perlunya penguatan Karakter siswa yang selaras dengan Dimensi Profil Lulusan / Profil Pelajar Pancasila.\n` +
        `3. Perlunya peningkatan kualitas Pembelajaran serta optimalisasi pemanfaatan Komunitas Belajar (Kombel) antar-guru.\n` +
        `4. Perlunya penguatan iklim keamanan sekolah dari segala bentuk perundungan (bullying) dan kekerasan.\n\n` +
        `Di sisi lain, pemberlakuan Kurikulum Merdeka menuntut sekolah untuk lebih adaptif dalam mengelola pembelajaran intrakurikuler serta Proyek Kokurikuler yang ramah anak. Oleh karena itu, melalui siklus Identifikasi, Refleksi, Benahi Perencanaan dan Benahi Pelaksanaan (IRBB), RKT ini dirancang untuk memetakan akar masalah secara tepat dan menyusun program kerja "Benahi" yang konkret.\n\n` +
        `Melalui RKT ini, ${sekolah} berkomitmen untuk mentransformasikan data evaluasi menjadi aksi nyata. Dokumen ini juga sekaligus menjadi dasar dan acuan mutlak dalam penyusunan Rencana Kegiatan dan Anggaran Sekolah (RKAS), sehingga pemanfaatan dana Bantuan Operasional Satuan Pendidikan (BOSP) dapat berjalan secara efektif, efisien, akuntabel, dan sepenuhnya berorientasi pada kepentingan murid.`
      );

      const landasanHukum = (b1.landasanHukum && b1.landasanHukum.length > 0) ? b1.landasanHukum : [
        "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.",
        "Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan atas Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan.",
        "Permendikdasmen Nomor 10 Tahun 2025 tentang Standar Kompetensi Lulusan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
        "Permendikdasmen No. 12 Tahun 2025 tentang Standar Isi pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
        "Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
        "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 21 Tahun 2022 tentang Standar Penilaian Pendidikan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
        "Permendikdasmen No. 26 Tahun 2025 tentang Standar Pengelolaan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
        "Permendikdasmen No. 13 Tahun 2025 tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.",
        "Permendikdasmen No. 8 Tahun 2026 tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP)."
      ];

      const tujuanUmum = b1.tujuanUmum || `Menjadi panduan operasional resmi bagi seluruh warga sekolah dalam melaksanakan program kerja, mengelola anggaran, serta mengevaluasi ketercapaian mutu pendidikan di jenjang sekolah dasar selama satu tahun ajaran ${tahun}.`;

      const tujuanKhusus = (b1.tujuanKhusus && b1.tujuanKhusus.length > 0) ? b1.tujuanKhusus : [
        "Meningkatkan Mutu Literasi dan Numerasi: Menjadi kompas untuk melaksanakan program perbaikan metode mengajar guru dan penyediaan fasilitas baca guna menaikkan nilai kompetensi dasar siswa di Rapor Pendidikan.",
        "Memfasilitasi Implementasi Kurikulum: Memastikan pelaksanaan kegiatan pembelajaran intrakurikuler dan Projek Kokurikuler berjalan terstruktur sesuai fase perkembangan anak SD.",
        "Mengoptimalkan Kompetensi Guru: Membimbing aktivasi Komunitas Belajar (Kombel) intra-sekolah sebagai wadah berbagi praktik baik antar-guru.",
        "Mewujudkan Sekolah Aman dan Inklusif: Menyediakan program preventif dan penanganan yang jelas untuk menciptakan lingkungan sekolah bebas perundungan, kekerasan, dan intoleransi.",
        "Menjamin Transparansi Anggaran: Menjadi dasar tunggal bagi Tim Pengembang Sekolah dalam menyusun RKAS, sehingga penyaluran dana BOSP fokus pada kegiatan \"Benahi\" yang berdampak langsung pada murid."
      ];

      return {
        latarBelakang: latarBelakang,
        landasanHukum: landasanHukum,
        tujuanUmum: tujuanUmum,
        tujuanKhusus: tujuanKhusus
      };
    },

    // =========================================================================
    // 4. BAB III A EVALUASI DIRI SEKOLAH INTERNAL
    // =========================================================================
    getBab3A: function (general, bab3Data) {
      const g = general || {};
      const b3 = bab3Data || {};
      const sekolah = g.sekolahNama || 'SD NEGERI KALISALAK 01';

      const pengantarEds = b3.pengantarEds || 
        "Evaluasi Diri Sekolah (EDS) dilaksanakan oleh Tim Pengembang Sekolah melalui pengisian instrumen, telaah dokumen, observasi, dan diskusi bersama kepala sekolah, guru, tenaga kependidikan, serta komite sekolah. Hasil EDS digunakan untuk memperoleh gambaran kondisi riil sekolah sebagai dasar penyusunan Rencana Kerja Tahunan (RKT) dan peningkatan mutu secara berkelanjutan.";

      const narasiPengelolaan = b3.narasiPengelolaan || 
        "Hasil evaluasi menunjukkan bahwa kualitas pengelolaan satuan pendidikan berada pada kategori Baik dengan capaian 88.5%. Sekolah telah melaksanakan Evaluasi Diri Sekolah sebagai dasar penyusunan perencanaan. Dokumen RKT, dan RKAS telah tersedia, saling berkaitan, dan menjadi acuan dalam pelaksanaan program sekolah. Pengelolaan administrasi dan keuangan telah berjalan secara tertib, transparan, dan akuntabel. Monitoring, supervisi, dan evaluasi program telah dilaksanakan sesuai jadwal yang direncanakan.\n\nNamun demikian, hasil evaluasi menunjukkan bahwa pengembangan kompetensi pendidik dan tenaga kependidikan belum dilaksanakan secara merata sesuai kebutuhan. Pemanfaatan hasil monitoring dan supervisi sebagai dasar penyempurnaan program juga belum optimal. Selain itu, kemitraan dengan orang tua, komite sekolah, dan masyarakat dalam mendukung peningkatan mutu sekolah masih perlu diperkuat.";

      const narasiPembelajaran = b3.narasiPembelajaran || 
        "Hasil evaluasi menunjukkan bahwa proses pembelajaran berada pada kategori Baik dengan capaian 86.0%. Sebagian besar guru telah menyusun perangkat pembelajaran sesuai Kurikulum Satuan Pendidikan. Pembelajaran telah dilaksanakan sesuai jadwal dan tujuan pembelajaran yang direncanakan. Guru juga telah melaksanakan asesmen pembelajaran dan memberikan umpan balik kepada murid sebagai bagian dari proses pembelajaran.\n\nMeskipun demikian, pembelajaran yang berpusat pada murid belum diterapkan secara konsisten di seluruh kelas. Pemanfaatan media pembelajaran, teknologi digital, serta strategi pembelajaran yang mengembangkan kemampuan berpikir kritis, kreativitas, komunikasi, dan kolaborasi murid masih perlu ditingkatkan. Refleksi pembelajaran dan tindak lanjut hasil supervisi akademik juga belum dilaksanakan secara optimal oleh seluruh guru.";

      const narasiHasilBelajar = b3.narasiHasilBelajar || 
        "Hasil evaluasi menunjukkan bahwa hasil belajar murid berada pada kategori Cukup dengan capaian 79.5%. Sebagian besar murid telah mencapai tujuan pembelajaran dan memenuhi target ketuntasan belajar yang ditetapkan sekolah. Tingkat kehadiran murid berada pada kategori baik dan prestasi nonakademik menunjukkan perkembangan yang positif.\n\nNamun demikian, kemampuan literasi dan numerasi murid masih belum mencapai target yang diharapkan. Kemampuan berpikir kritis, kreativitas, komunikasi, dan kemandirian belajar murid masih perlu ditingkatkan. Selain itu, masih terdapat sebagian murid yang memerlukan pembinaan dalam aspek disiplin, tanggung jawab, dan kepedulian terhadap lingkungan sekolah. Prestasi akademik juga belum menunjukkan peningkatan yang signifikan dibandingkan tahun sebelumnya.";

      const defaultEdsTable = [
        { no: "1", aspek: "Kualitas Pengelolaan Satuan Pendidikan", persentase: "88.5%", kategori: "Baik" },
        { no: "2", aspek: "Proses Pembelajaran", persentase: "86.0%", kategori: "Baik" },
        { no: "3", aspek: "Hasil Belajar Murid", persentase: "79.5%", kategori: "Cukup" },
        { no: "", aspek: "Rata-rata", persentase: "84.6%", kategori: "Baik" }
      ];

      const edsTable = (b3.eds && b3.eds.length > 0) ? b3.eds : defaultEdsTable;

      const kesimpulanEds = b3.kesimpulanEds || 
        "Berdasarkan hasil Evaluasi Diri Sekolah, secara umum mutu penyelenggaraan pendidikan berada pada kategori Baik. Kualitas pengelolaan satuan pendidikan telah berjalan dengan baik dan mendukung penyelenggaraan pendidikan di sekolah. Proses pembelajaran telah memenuhi sebagian besar indikator yang ditetapkan, namun masih memerlukan peningkatan dalam penerapan pembelajaran yang berpusat pada murid, pemanfaatan teknologi pembelajaran, dan tindak lanjut hasil supervisi akademik. Sementara itu, hasil belajar murid menunjukkan perkembangan yang cukup baik, tetapi peningkatan kemampuan literasi, numerasi, berpikir kritis, kreativitas, serta penguatan karakter masih menjadi fokus utama.";

      const defaultPrioritasMutu = [
        "Meningkatkan kualitas pembelajaran yang berpusat pada murid melalui penguatan kompetensi guru.",
        "Meningkatkan kemampuan literasi, numerasi, dan berpikir kritis murid.",
        "Mengoptimalkan pelaksanaan dan tindak lanjut supervisi akademik serta supervisi manajerial.",
        "Meningkatkan pemanfaatan media dan teknologi digital dalam pembelajaran.",
        "Memperkuat kemitraan antara sekolah, orang tua, komite sekolah, dan masyarakat dalam mendukung peningkatan mutu pendidikan."
      ];

      const prioritasMutu = (b3.prioritasMutu && b3.prioritasMutu.length > 0) ? b3.prioritasMutu : defaultPrioritasMutu;

      return {
        pengantarEds: pengantarEds,
        narasiPengelolaan: narasiPengelolaan,
        narasiPembelajaran: narasiPembelajaran,
        narasiHasilBelajar: narasiHasilBelajar,
        edsTable: edsTable,
        kesimpulanEds: kesimpulanEds,
        prioritasMutu: prioritasMutu
      };
    },

    // =========================================================================
    // 5. BAB IV LEMBAR KERJA RKT & TARGET KINERJA
    // =========================================================================
    getBab4: function (general, bab4Data) {
      const g = general || {};
      const tahun = g.tahunRkt || '2027';

      const pengantarTargetKinerja = 
        `Target kinerja tahunan merupakan capaian yang diharapkan pada akhir tahun pelaksanaan Rencana Kerja Tahunan (RKT). Target disusun berdasarkan hasil Evaluasi Diri Sekolah, Analisis Rapor Pendidikan Tahun 2025, rekomendasi prioritas, serta pemenuhan Standar Nasional Pendidikan (SNP). Target kinerja menjadi acuan dalam pelaksanaan program, monitoring, evaluasi, dan tindak lanjut peningkatan mutu sekolah.`;

      const defaultTargetKinerja = [
        {
          no: "1",
          snp: "Standar Kompetensi Lulusan",
          targetKinerja: "Meningkatnya kompetensi lulusan pada aspek literasi, numerasi, dan karakter.",
          targetTerukur: "Nilai literasi, numerasi, dan karakter pada Rapor Pendidikan meningkat minimal 3 poin dibanding tahun sebelumnya."
        },
        {
          no: "2",
          snp: "Standar Isi",
          targetKinerja: "Terlaksananya Kurikulum Satuan Pendidikan (KSP) yang sesuai dengan karakteristik sekolah.",
          targetTerukur: "Dokumen KSP direviu, disahkan, dan 100% guru melaksanakan pembelajaran sesuai KSP."
        },
        {
          no: "3",
          snp: "Standar Proses",
          targetKinerja: "Meningkatnya kualitas proses pembelajaran.",
          targetTerukur: "100% guru menerapkan pembelajaran aktif, pembelajaran mendalam, dan asesmen formatif; hasil supervisi akademik mencapai minimal kategori Baik."
        },
        {
          no: "4",
          snp: "Standar Penilaian Pendidikan",
          targetKinerja: "Terlaksananya sistem penilaian yang objektif dan berkelanjutan.",
          targetTerukur: "100% guru menyusun instrumen asesmen sesuai ketentuan dan memanfaatkan hasil asesmen untuk tindak lanjut pembelajaran."
        },
        {
          no: "5",
          snp: "Standar Pendidik dan Tenaga Kependidikan",
          targetKinerja: "Meningkatnya kompetensi pendidik dan tenaga kependidikan.",
          targetTerukur: "100% guru mengikuti minimal 1 kegiatan pengembangan diri dalam satu tahun dan 100% tenaga kependidikan mengikuti pembinaan sesuai tugasnya."
        },
        {
          no: "6",
          snp: "Standar Sarana dan Prasarana",
          targetKinerja: "Meningkatnya kualitas dan pemanfaatan sarana prasarana pembelajaran.",
          targetTerukur: "Minimal 90% sarana prasarana prioritas berada dalam kondisi baik dan dimanfaatkan dalam proses pembelajaran."
        },
        {
          no: "7",
          snp: "Standar Pengelolaan",
          targetKinerja: "Meningkatnya efektivitas tata kelola sekolah berbasis data.",
          targetTerukur: "100% program RKT terlaksana sesuai jadwal, monitoring dan evaluasi dilaksanakan minimal 2 kali dalam satu tahun, serta dokumen pengelolaan sekolah tersedia lengkap."
        },
        {
          no: "8",
          snp: "Standar Pembiayaan",
          targetKinerja: "Meningkatnya efektivitas pengelolaan pembiayaan sekolah.",
          targetTerukur: "100% RKAS disusun sesuai RKT, realisasi anggaran mencapai minimal 95%, dan laporan keuangan disusun tepat waktu sesuai ketentuan."
        }
      ];

      return {
        pengantarTargetKinerja: pengantarTargetKinerja,
        defaultTargetKinerja: defaultTargetKinerja
      };
    },

    // =========================================================================
    // 6. BAB V PENUTUP
    // =========================================================================
    getBab5: function (general, bab5Data) {
      const g = general || {};
      const b5 = bab5Data || {};
      const sekolah = g.sekolahNama || 'SD NEGERI KALISALAK 01';
      const tahun = g.tahunRkt || '2027';

      const simpulan = b5.simpulan || (
        `Rencana Kerja Tahunan (RKT) ${sekolah} Tahun ${tahun} merupakan dokumen strategis yang disusun secara partisipatif, transparan, dan akuntabel berbasis data riil Rapor Pendidikan sekolah. Melalui pendekatan Perencanaan Berbasis Data (PBD) dengan siklus Identifikasi, Refleksi, Benahi Perencanaan dan Benahi Pelaksanaan (IRBB), dokumen ini tidak hanya menjadi formalitas administratif, melainkan instrumen kunci untuk meningkatkan mutu literasi, numerasi, karakter murid, serta kualitas pembelajaran di kelas.\n\n` +
        `Keberhasilan seluruh program kerja dan pemanfaatan anggaran Bantuan Operasional Satuan Pendidikan (BOSP) yang tertuang dalam dokumen ini akan bermuara pada satu tujuan utama, yaitu terwujudnya layanan pendidikan dasar yang berkualitas, inklusif, aman, dan berorientasi seutuhnya pada kepentingan murid.`
      );

      const saran = {
        pendidik: "Diharapkan menjaga komitmen, berkolaborasi aktif dalam Komunitas Belajar (Kombel), serta konsisten menerapkan strategi pembelajaran baru yang telah direncanakan.",
        komite: "Diharapkan terus memperkuat sinergi dan kemitraan dalam mendukung program sekolah, khususnya dalam penguatan karakter siswa di rumah.",
        pengawas: "Memohon bimbingan, monitoring, dan evaluasi secara berkala agar pelaksanaan RKT ini tetap berjalan di koridor regulasi yang berlaku.",
        penutup: `Semoga Rencana Kerja Tahunan ini dapat terlaksana dengan baik demi membawa perubahan positif bagi kemajuan ${sekolah}.`
      };

      return {
        simpulan: simpulan,
        saran: saran
      };
    },

    // =========================================================================
    // 7. HTML RENDERING HELPERS (Dipanggil langsung oleh Print & UI)
    // =========================================================================
    renderBab3AHtml: function (bab3Data, general) {
      const b3a = this.getBab3A(general, bab3Data);
      
      const formatParagraphs = function (text) {
        if (!text) return '';
        return text.split(/\n+/).filter(Boolean).map(p => 
          `<p class="print-paragraph" style="text-align: justify; text-indent: 28pt; margin-bottom: 6pt; line-height: 1.5;">${p.trim()}</p>`
        ).join('');
      };

      return `
        <div style="font-weight: 700; margin-bottom: 4pt; font-size: 11pt;">A. Evaluasi Diri Sekolah Internal</div>
        
        <p class="print-paragraph" style="text-align: justify; text-indent: 28pt; margin-bottom: 8pt; line-height: 1.5;">
          ${b3a.pengantarEds}
        </p>

        <div style="font-weight: 700; margin-top: 8pt; margin-bottom: 3pt; font-size: 10pt;">1. Kualitas Pengelolaan Satuan Pendidikan</div>
        ${formatParagraphs(b3a.narasiPengelolaan)}

        <div style="font-weight: 700; margin-top: 8pt; margin-bottom: 3pt; font-size: 10pt;">2. Proses Pembelajaran</div>
        ${formatParagraphs(b3a.narasiPembelajaran)}

        <div style="font-weight: 700; margin-top: 8pt; margin-bottom: 3pt; font-size: 10pt;">3. Hasil Belajar Murid</div>
        ${formatParagraphs(b3a.narasiHasilBelajar)}

        <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt; font-size: 10pt;">Tabel 3.1 Rekapitulasi Hasil Evaluasi Diri Sekolah</div>
        <table class="print-table table-fit-content" style="font-size: 9.5pt; margin-bottom: 10pt;">
          <thead>
            <tr>
              <th style="width: 40px; min-width: 40px;" class="col-nowrap cell-center">No</th>
              <th style="width: 340px;">Aspek</th>
              <th style="width: 130px; text-align: center;">Persentase</th>
              <th style="width: 130px; text-align: center;">Kategori</th>
            </tr>
          </thead>
          <tbody>
            ${(b3a.edsTable || []).map((e, idx) => {
              const isAvg = !e.no || e.aspek.toLowerCase().includes('rata');
              return `
                <tr ${isAvg ? 'style="font-weight: 700; background: #fafafa;"' : ''}>
                  <td style="text-align: center;" class="cell-no">${e.no || ''}</td>
                  <td><strong>${e.aspek || ''}</strong></td>
                  <td style="text-align: center; font-weight: 700;">${e.persentase ? (e.persentase.includes('%') ? e.persentase : e.persentase + '%') : (e.persen ? e.persen + '%' : '-')}</td>
                  <td style="text-align: center;">${e.kategori || 'Baik'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <p class="print-paragraph" style="text-align: justify; text-indent: 28pt; margin-top: 6pt; margin-bottom: 6pt; line-height: 1.5;">
          ${b3a.kesimpulanEds}
        </p>

        <p class="print-paragraph" style="text-align: justify; margin-top: 4pt; margin-bottom: 3pt; line-height: 1.5;">
          Berdasarkan hasil Evaluasi Diri Sekolah tersebut, ditetapkan beberapa prioritas peningkatan mutu, yaitu:
        </p>
        <ol style="margin-left: 24px; margin-bottom: 12pt; line-height: 1.45;">
          ${(b3a.prioritasMutu || []).map(pm => `<li style="margin-bottom: 3pt; text-align: justify;">${pm}</li>`).join('')}
        </ol>
      `;
    },

    renderBab1Html: function (bab1Data, general) {
      const b1 = this.getBab1(general, bab1Data);
      
      const formatParagraphs = function (text) {
        if (!text) return '';
        return text.split(/\n+/).filter(Boolean).map(p => {
          if (p.trim().match(/^\d+\.\s/)) {
            return `<li style="margin-bottom: 3pt; text-align: justify;">${p.replace(/^\d+\.\s*/, '').trim()}</li>`;
          }
          return `<p class="print-paragraph" style="text-align: justify; text-indent: 28pt; margin-bottom: 6pt; line-height: 1.5;">${p.trim()}</p>`;
        }).join('');
      };

      return `
        <div style="font-weight: 700; margin-bottom: 4pt; font-size: 11pt;">A. Latar Belakang</div>
        ${formatParagraphs(b1.latarBelakang)}

        <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt; font-size: 11pt;">B. Landasan Hukum</div>
        <p class="print-paragraph" style="margin-bottom: 4pt;">Penyusunan Rencana Kerja Tahunan (RKT) didasarkan pada peraturan perundang-undangan yang berlaku sebagai berikut:</p>
        <ol style="margin-left: 20px; margin-bottom: 12pt; line-height: 1.45;">
          ${(b1.landasanHukum || []).map(lh => `<li style="margin-bottom: 3pt; text-align: justify;">${lh}</li>`).join('')}
        </ol>

        <div style="font-weight: 700; margin-top: 10pt; margin-bottom: 4pt; font-size: 11pt;">C. Tujuan RKT</div>
        <p class="print-paragraph" style="margin-bottom: 4pt;">Penyusunan Rencana Kerja Tahunan (RKT) memiliki maksud dan tujuan yang jelas demi kemajuan kualitas sekolah, antara lain:</p>
        <div style="font-weight: 700; margin-top: 4pt; margin-bottom: 2pt;">1. Tujuan Umum</div>
        <p class="print-paragraph" style="text-align: justify; text-indent: 20pt; margin-bottom: 6pt; line-height: 1.5;">
          ${b1.tujuanUmum}
        </p>

        <div style="font-weight: 700; margin-top: 4pt; margin-bottom: 2pt;">2. Tujuan Khusus</div>
        <ol style="margin-left: 20px; margin-bottom: 10pt; line-height: 1.45;">
          ${(b1.tujuanKhusus || []).map(tk => `<li style="margin-bottom: 3pt; text-align: justify;">${tk}</li>`).join('')}
        </ol>
      `;
    },

    renderBab5Html: function (bab5Data, general) {
      const b5 = this.getBab5(general, bab5Data);
      const g = general || {};

      const formatParagraphs = function (text) {
        if (!text) return '';
        return text.split(/\n+/).filter(Boolean).map(p => 
          `<p class="print-paragraph" style="text-align: justify; text-indent: 28pt; margin-bottom: 6pt; line-height: 1.5;">${p.trim()}</p>`
        ).join('');
      };

      return `
        <div style="font-weight: 700; margin-bottom: 4pt; font-size: 11pt;">A. Simpulan</div>
        ${formatParagraphs(b5.simpulan)}

        <div style="font-weight: 700; margin-top: 12pt; margin-bottom: 4pt; font-size: 11pt;">B. Saran</div>
        <p class="print-paragraph" style="margin-bottom: 6pt;">Demi kelancaran implementasi RKT ini, sekolah menyampaikan beberapa rekomendasi kepada pihak-pihak terkait:</p>
        
        <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 2pt;">Bagi Pendidik dan Tenaga Kependidikan:</div>
        <p class="print-paragraph" style="text-align: justify; text-indent: 20pt; margin-bottom: 6pt; line-height: 1.5;">
          ${b5.saran.pendidik}
        </p>

        <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 2pt;">Bagi Komite Sekolah dan Orang Tua:</div>
        <p class="print-paragraph" style="text-align: justify; text-indent: 20pt; margin-bottom: 6pt; line-height: 1.5;">
          ${b5.saran.komite}
        </p>

        <div style="font-weight: 700; margin-top: 6pt; margin-bottom: 2pt;">Bagi Dinas Pendidikan / Pengawas Sekolah:</div>
        <p class="print-paragraph" style="text-align: justify; text-indent: 20pt; margin-bottom: 8pt; line-height: 1.5;">
          ${b5.saran.pengawas}
        </p>

        <p class="print-paragraph" style="text-align: justify; text-indent: 28pt; margin-top: 8pt; margin-bottom: 16pt; line-height: 1.5;">
          ${b5.saran.penutup}
        </p>
      `;
    }
  };

  // Expose ke global scope
  global.RKT_NARRATIVES = RKT_NARRATIVES;

  // Sambungkan ke SIM_UI jika ada
  if (global.SIM_UI) {
    global.SIM_UI.rktNarratives = RKT_NARRATIVES;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
