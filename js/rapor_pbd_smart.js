/**
 * RAPOR PBD SMART RETRIEVAL ENGINE
 * SDN KALISALAK 01 - KECAMATAN MARGASARI (NPSN: 20325895)
 */
(function (global) {
  'use strict';

  class RaporPbdSmartEngine {
    constructor() {
      this.init();
    }

    init() {
      this.indicators = global.AUTHENTIC_PBD_INDICATORS || [];
      this.prioritas = global.AUTHENTIC_PBD_PRIORITAS || [];
      this.mapping = global.SMART_REPORT_REALISASI_MAP || {};
    }

    getAllIndicators() {
      if (!this.indicators.length && global.AUTHENTIC_PBD_INDICATORS) {
        this.indicators = global.AUTHENTIC_PBD_INDICATORS;
      }
      return this.indicators;
    }

    getPriorityRecommendations() {
      if (!this.prioritas.length && global.AUTHENTIC_PBD_PRIORITAS) {
        this.prioritas = global.AUTHENTIC_PBD_PRIORITAS;
      }
      return this.prioritas;
    }

    searchIndicators(keyword) {
      const list = this.getAllIndicators();
      if (!keyword) return list.slice(0, 15);
      const q = keyword.toLowerCase().trim();
      return list.filter(ind => {
        return (
          ind.kode.toLowerCase().includes(q) ||
          ind.judul.toLowerCase().includes(q) ||
          ind.penjelasan.toLowerCase().includes(q) ||
          ind.capaian.toLowerCase().includes(q)
        );
      });
    }

    getByKode(kode) {
      if (!kode) return null;
      const cleanKode = kode.trim().toUpperCase();
      const list = this.getAllIndicators();
      return list.find(i => i.kode.toUpperCase() === cleanKode) || null;
    }

    getSmartRealisasi(reportId, rowIndex, indicatorText = '') {
      const repId = parseInt(reportId);
      if (!this.mapping || !Object.keys(this.mapping).length) {
        this.mapping = global.SMART_REPORT_REALISASI_MAP || {};
      }
      const rows = this.mapping[repId];
      if (rows && rows[rowIndex]) {
        return rows[rowIndex].realisasi;
      }

      if (indicatorText) {
        const text = indicatorText.toLowerCase();
        if (text.includes('literasi')) {
          const l = this.getByKode('A.1');
          if (l) return `${l.skor2025} (${l.capaian.split('(')[0].trim()} | Rerata: 42,54)`;
        }
        if (text.includes('numerasi') || text.includes('hitung')) {
          const n = this.getByKode('A.2');
          if (n) return `${n.skor2025} (${n.capaian.split('(')[0].trim()} | Rerata: 39,57)`;
        }
        if (text.includes('karakter')) {
          const k = this.getByKode('A.3');
          if (k) return `Skor ${k.skor2025} (${k.capaian} Rapor Pendidikan)`;
        }
        if (text.includes('kualitas') || text.includes('pembelajaran')) {
          const kp = this.getByKode('D.1');
          if (kp) return `Skor ${kp.skor2025} (${kp.capaian} Rapor Pendidikan)`;
        }
        if (text.includes('keamanan') || text.includes('perundungan')) {
          const km = this.getByKode('D.4');
          if (km) return `Skor ${km.skor2025} (${km.capaian} | D.4.4: 33,33% Murid Aman)`;
        }
        if (text.includes('kebinekaan') || text.includes('toleransi')) {
          const kb = this.getByKode('D.8');
          if (kb) return `Skor ${kb.skor2025} (${kb.capaian} | Komitmen Kebangsaan: 75,85)`;
        }
        if (text.includes('tik') || text.includes('chromebook')) {
          const tik = this.getByKode('E.7.4');
          if (tik) return `Skor ${tik.skor2025} (Baik Sempurna | 15 Unit Siap Pakai)`;
        }
      }

      return '100% Tercapai Sesuai Target Program';
    }

    getSmartChipsForIndicator(reportId, rowIndex, indicatorText = '') {
      const repId = parseInt(reportId);
      const defaultSmart = this.getSmartRealisasi(repId, rowIndex, indicatorText);
      const chips = [defaultSmart];

      const text = (indicatorText || '').toLowerCase();
      if (text.includes('literasi')) {
        chips.push('40,00% (Kurang - Capaian Minimum)');
        chips.push('Rerata Skor: 42,54 (Turun 50,00)');
        chips.push('Teks Informasi: 44,16 | Teks Sastra: 42,21');
      } else if (text.includes('numerasi') || text.includes('hitung')) {
        chips.push('36,67% (Kurang - Capaian Minimum)');
        chips.push('Rerata Skor: 39,57');
        chips.push('Domain Data & Ketidakpastian: 35,62');
      } else if (text.includes('karakter')) {
        chips.push('Skor 52,17 (Sedang)');
        chips.push('Gotong Royong: 56,26 | Nalar Kritis: 47,59');
        chips.push('Kemandirian: 51,11 | Kreativitas: 47,18');
      } else if (text.includes('kualitas') || text.includes('kelas') || text.includes('kombel')) {
        chips.push('Skor 55,41 (Sedang Rapor Pendidikan)');
        chips.push('Manajemen Kelas: 47,24 (Kurang)');
        chips.push('Refleksi Guru: 74,08 (Baik)');
      } else if (text.includes('keamanan') || text.includes('perundungan') || text.includes('kekerasan')) {
        chips.push('Skor 65,01 (Sedang Rapor Pendidikan)');
        chips.push('Bebas Hukuman Fisik: 70,00% Murid Aman');
        chips.push('Bebas Perundungan: 33,33% Murid Aman');
      } else if (text.includes('kebinekaan') || text.includes('toleransi')) {
        chips.push('Skor 66,58 (Baik Rapor Pendidikan)');
        chips.push('Komitmen Kebangsaan: 75,85');
        chips.push('Toleransi Agama & Budaya: 66,27');
      } else if (text.includes('sarana') || text.includes('toilet') || text.includes('sanitasi')) {
        chips.push('Sanitasi Toilet: Skor 70,00 (Baik)');
        chips.push('Fasilitas TIK: Skor 100,00 (Sempurna)');
        chips.push('Kelayakan Ruang: Skor 62,50 (Sedang)');
      } else {
        chips.push('100% Tercapai Sesuai Target');
        chips.push('Sedang Berjalan Rutin');
      }

      return Array.from(new Set(chips)).slice(0, 4);
    }
  }

  const raporPbdSmart = new RaporPbdSmartEngine();
  global.raporPbdSmart = raporPbdSmart;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      RaporPbdSmartEngine,
      raporPbdSmart
    };
  }

})(typeof window !== 'undefined' ? window : global);
