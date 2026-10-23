import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Player, AnswerLog, GameSettings, TurnLog } from '../types/game';
import { exportGameResultsToExcel } from '../utils/excelExport';
import { sound } from '../utils/soundEngine';
import {
  Trophy,
  FileSpreadsheet,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Download,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';

interface GameSummaryModalProps {
  winner: Player;
  players: Player[];
  answerLogs: AnswerLog[];
  turnLogs: TurnLog[];
  settings: GameSettings;
  durationSeconds: number;
  onRestart: () => void;
}

export const GameSummaryModal: React.FC<GameSummaryModalProps> = ({
  winner,
  players,
  answerLogs,
  turnLogs,
  settings,
  durationSeconds,
  onRestart
}) => {
  const [activeTab, setActiveTab] = useState<'podium' | 'answers'>('podium');
  const [autoExportSuccess, setAutoExportSuccess] = useState<boolean>(false);

  // Trigger confetti and auto export on mount
  useEffect(() => {
    sound.playVictory();

    // Confetti burst
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Automatic Excel Export
    const success = exportGameResultsToExcel({
      gameTitle: 'Ular Tangga IPAS SD',
      date: new Date().toLocaleString('id-ID'),
      durationSeconds,
      settings,
      winner,
      players,
      answerLogs,
      turnLogs
    });

    setAutoExportSuccess(success);
  }, []);

  const handleManualExport = () => {
    exportGameResultsToExcel({
      gameTitle: 'Ular Tangga IPAS SD',
      date: new Date().toLocaleString('id-ID'),
      durationSeconds,
      settings,
      winner,
      players,
      answerLogs,
      turnLogs
    });
  };

  // Sort players for podium
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    return b.score - a.score;
  });

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 p-5 sm:p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 shadow-inner">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-200 animate-bounce" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-yellow-200">
              Selamat Kepada Pemenang!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
              {winner.name} Meraih Juara 1!
            </h2>
            <p className="text-xs sm:text-sm text-yellow-100/90 mt-1">
              Petualangan Ular Tangga IPAS SD ({settings.boardSize} Petak · {settings.questionCount} Soal)
            </p>
          </div>
        </div>

        {/* Excel Auto-Export Notice Banner */}
        <div className="bg-emerald-950/80 border-y border-emerald-500/40 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm text-emerald-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {autoExportSuccess
                ? 'Hasil permainan telah otomatis diunduh ke format Excel (.xlsx)!'
                : 'Laporan hasil permainan siap diunduh ke Excel (.xlsx)'}
            </span>
          </div>
          <button
            onClick={handleManualExport}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Ulang Excel</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('podium')}
            className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'podium'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Klasemen & Skor Akhir</span>
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'answers'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Jawaban Soal IPAS ({answerLogs.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'podium' && (
            <div className="space-y-4">
              {/* Duration and Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">WAKTU BERMAIN</span>
                  <span className="text-sm font-bold text-white">{minutes}m {seconds}s</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">TOTAL SOAL DIJAWAB</span>
                  <span className="text-sm font-bold text-cyan-300">{answerLogs.length} Pertanyaan</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">TOTAL PUTARAN</span>
                  <span className="text-sm font-bold text-amber-300">{turnLogs.length} Giliran</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">STATUS FILE</span>
                  <span className="text-sm font-bold text-emerald-400">Tersimpan Excel</span>
                </div>
              </div>

              {/* Player Standings Cards */}
              <div className="space-y-2.5">
                {sortedPlayers.map((p, idx) => {
                  const totalAnswered = p.correctAnswers + p.wrongAnswers;
                  const accuracy = totalAnswered > 0 ? Math.round((p.correctAnswers / totalAnswered) * 100) : 0;
                  const isTop1 = idx === 0;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        isTop1
                          ? 'bg-gradient-to-r from-amber-950/40 to-slate-800/80 border-amber-500/60 shadow-lg'
                          : 'bg-slate-800/60 border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-900'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          #{idx + 1}
                        </span>

                        <div
                          style={{ borderColor: p.color }}
                          className="w-11 h-11 rounded-full border-2 overflow-hidden bg-slate-800 shrink-0 shadow"
                        >
                          <img
                            src={p.avatar}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm sm:text-base font-bold text-white">{p.name}</h4>
                            {p.isBot && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                AI Bot
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>Petak {p.position}</span>
                            <span>·</span>
                            <span>{p.totalRolls} lemparan</span>
                            <span>·</span>
                            <span>{p.laddersClimbed} tangga</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-xl font-black text-amber-300">
                          {p.score} <span className="text-xs font-semibold text-slate-400">Poin</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                          {p.correctAnswers} Benar / {totalAnswered} Soal ({accuracy}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'answers' && (
            <div className="space-y-3">
              {answerLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Tidak ada kuis yang terpicu selama sesi ini.
                </div>
              ) : (
                answerLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm space-y-2 ${
                      log.isCorrect
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : 'bg-rose-950/20 border-rose-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.playerName}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-cyan-400 font-semibold">{log.topic}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        {log.isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            BENAR (+{log.pointsEarned})
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            SALAH (0)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="font-semibold text-white leading-relaxed">
                      {index + 1}. {log.questionText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs pt-1">
                      <div className="text-slate-300">
                        <span className="text-slate-400">Pilihan Siswa: </span>
                        <strong className={log.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                          {log.selectedOption}
                        </strong>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Kunci Jawaban: </span>
                        <strong className="text-emerald-300">{log.correctOption}</strong>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5 leading-relaxed">
                      <strong className="text-cyan-300">Pembahasan: </strong>
                      {log.explanation}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleManualExport}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Unduh Laporan Lengkap (.xlsx)</span>
          </button>

          <button
            onClick={onRestart}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Petualangan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
