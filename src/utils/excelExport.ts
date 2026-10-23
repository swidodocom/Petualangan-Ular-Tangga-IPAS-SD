import * as XLSX from 'xlsx';
import { Player, AnswerLog, TurnLog, GameSettings } from '../types/game';

export interface GameExportData {
  gameTitle: string;
  date: string;
  durationSeconds: number;
  settings: GameSettings;
  winner: Player;
  players: Player[];
  answerLogs: AnswerLog[];
  turnLogs: TurnLog[];
}

/**
 * Generates an Excel workbook (.xlsx) and triggers automatic download
 */
export const exportGameResultsToExcel = (data: GameExportData): boolean => {
  try {
    const workbook = XLSX.utils.book_new();

    // Format duration in mm:ss
    const minutes = Math.floor(data.durationSeconds / 60);
    const seconds = data.durationSeconds % 60;
    const durationFormatted = `${minutes} menit ${seconds} detik`;

    // -------------------------------------------------------------
    // SHEET 1: RINGKASAN HASIL PERMAINAN
    // -------------------------------------------------------------
    const summaryData: (string | number)[][] = [
      ['LAPORAN HASIL PERMAINAN ULAR TANGGA EDUKASI IPAS SD'],
      ['Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi - Kurikulum Merdeka'],
      [''],
      ['METADATA PERMAINAN', ''],
      ['Waktu Pelaksanaan', data.date],
      ['Durasi Permainan', durationFormatted],
      ['Mode Permainan', data.settings.mode === 'solo' ? 'Solo (Pemain vs AI Bot)' : 'Multiplayer Lokal'],
      ['Paket Bank Soal', `${data.settings.questionCount} Soal IPAS SD`],
      ['Ukuran Papan', `${data.settings.boardSize} Petak`],
      ['Pemenang / Juara 1', `${data.winner.name} (${data.winner.isBot ? 'AI Bot' : 'Pemain'})`],
      [''],
      ['KLASEMEN AKHIR PEMAIN', '', '', '', '', '', '', '', ''],
      [
        'Peringkat',
        'Nama Pemain',
        'Tipe',
        'Posisi Akhir',
        'Total Skor',
        'Total Dadu Dilempar',
        'Soal Benar',
        'Soal Salah',
        'Akurasi Jawaban (%)'
      ]
    ];

    // Sort players by position descending, then score descending
    const sortedPlayers = [...data.players].sort((a, b) => {
      if (b.position !== a.position) return b.position - a.position;
      return b.score - a.score;
    });

    sortedPlayers.forEach((p, idx) => {
      const totalAnswered = p.correctAnswers + p.wrongAnswers;
      const accuracy = totalAnswered > 0 ? Math.round((p.correctAnswers / totalAnswered) * 100) : 0;
      summaryData.push([
        idx + 1,
        p.name,
        p.isBot ? 'AI Bot' : 'Pemain Siswa',
        `Petak ${p.position}`,
        p.score,
        p.totalRolls,
        p.correctAnswers,
        p.wrongAnswers,
        `${accuracy}%`
      ]);
    });

    summaryData.push(['']);
    summaryData.push(['STATISTIK TANTANGAN PAPAN']);
    sortedPlayers.forEach(p => {
      summaryData.push([
        p.name,
        `Menaiki ${p.laddersClimbed} Tangga Prestasi`,
        `Melewati ${p.snakesBitten} Ular Rintangan`
      ]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    // Set column widths for sheet 1
    summarySheet['!cols'] = [
      { wch: 12 },
      { wch: 24 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
      { wch: 22 }
    ];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan Permainan');

    // -------------------------------------------------------------
    // SHEET 2: EVALUASI KUIS IPAS SD
    // -------------------------------------------------------------
    const quizHeader: (string | number)[][] = [
      ['EVALUASI DETIL JAWABAN KUIS IPAS SD SISWA'],
      ['Tercatat secara otomatis dari sesi permainan'],
      [''],
      [
        'No',
        'Waktu',
        'Nama Pemain',
        'Topik IPAS',
        'Pertanyaan Soal',
        'Jawaban Siswa',
        'Kunci Jawaban',
        'Status',
        'Poin',
        'Pembahasan & Fakta Edukatif'
      ]
    ];

    if (data.answerLogs.length === 0) {
      quizHeader.push(['Belum ada soal kuis yang dijawab pada sesi ini.']);
    } else {
      data.answerLogs.forEach((log, i) => {
        quizHeader.push([
          i + 1,
          log.timestamp,
          log.playerName,
          log.topic,
          log.questionText,
          log.selectedOption,
          log.correctOption,
          log.isCorrect ? 'BENAR' : 'SALAH',
          log.pointsEarned,
          log.explanation
        ]);
      });
    }

    const quizSheet = XLSX.utils.aoa_to_sheet(quizHeader);
    quizSheet['!cols'] = [
      { wch: 6 },
      { wch: 12 },
      { wch: 18 },
      { wch: 26 },
      { wch: 50 },
      { wch: 24 },
      { wch: 24 },
      { wch: 12 },
      { wch: 10 },
      { wch: 60 }
    ];
    XLSX.utils.book_append_sheet(workbook, quizSheet, 'Detail Kuis IPAS');

    // -------------------------------------------------------------
    // SHEET 3: RIWAYAT GILIRAN & DADU
    // -------------------------------------------------------------
    const turnHeader: (string | number)[][] = [
      ['RIWAYAT LANGKAH DAN LEMPARAN DADU PEMAIN'],
      [''],
      ['Giliran ke-', 'Nama Pemain', 'Angka Dadu', 'Dari Petak', 'Ke Petak', 'Kejadian Petak', 'Keterangan']
    ];

    data.turnLogs.forEach(log => {
      turnHeader.push([
        log.turnNumber,
        log.playerName,
        log.roll,
        log.fromTile,
        log.toTile,
        log.event.toUpperCase(),
        log.description
      ]);
    });

    const turnSheet = XLSX.utils.aoa_to_sheet(turnHeader);
    turnSheet['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 45 }
    ];
    XLSX.utils.book_append_sheet(workbook, turnSheet, 'Riwayat Dadu & Langkah');

    // Generate safe filename with timestamp
    const nowStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `Hasil_Ular_Tangga_IPAS_SD_${nowStr}.xlsx`;

    // Write file to trigger download
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (err) {
    console.error('Failed to export Excel:', err);
    return false;
  }
};
