import React from 'react';
import { Volume2, VolumeX, Music, HelpCircle, X, Check, FileSpreadsheet } from 'lucide-react';
import { GameSettings } from '../types/game';

interface RulesAndSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onExportCurrentExcel?: () => void;
}

export const RulesAndSettingsModal: React.FC<RulesAndSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportCurrentExcel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">Panduan & Pengaturan Game</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300">
          {/* Audio Controls */}
          <div className="space-y-3 bg-slate-800/70 p-4 rounded-2xl border border-slate-700/60">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Pengaturan Suara & Musik
            </h4>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span>Efek Suara (Dadu, Tangga, Ular)</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.soundEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className={`w-4 h-4 ${settings.musicEnabled ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>Musik Latar Belakang (BGM)</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.musicEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.musicEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Volume slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Volume Audio</span>
                <span>{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={e => onUpdateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Excel feature explanation */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Simpan Otomatis ke File Excel (.xlsx)</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setiap kali permainan selesai, sistem secara otomatis mengekspor seluruh statistik pemain, riwayat lemparan dadu, serta rincian evaluasi jawaban kuis IPAS ke dalam format spreadsheet Microsoft Excel (.xlsx).
            </p>
            {onExportCurrentExcel && (
              <button
                onClick={onExportCurrentExcel}
                className="mt-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Laporan Saat Ini (.xlsx)</span>
              </button>
            )}
          </div>

          {/* Game Rules */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Aturan & Mekanika Permainan
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 shrink-0 mt-0.5">
                  1
                </div>
                <span>
                  <strong>Lempar Dadu:</strong> Setiap pemain bergantian melempar dadu 3D dan melangkah maju sesuai angka dadu.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 shrink-0 mt-0.5">
                  2
                </div>
                <span>
                  <strong>Tangga Prestasi:</strong> Menginjak pangkal tangga memicu Ujian Soal IPAS. Jawab benar = Naik tangga ke petak atas (+100 Poin)! Jawab salah = Tetap di tempat.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-rose-400 shrink-0 mt-0.5">
                  3
                </div>
                <span>
                  <strong>Ular Rintangan:</strong> Menginjak kepala ular memicu Tantangan Penyelamatan. Jawab benar = Lolos dari gigitan ular (+50 Poin)! Jawab salah = Meluncur turun ke ekor.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-purple-400 shrink-0 mt-0.5">
                  4
                </div>
                <span>
                  <strong>Petak Kuis Misteri:</strong> Berisi pertanyaan seru seputar kurikulum IPAS SD untuk menambah poin skor.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0 mt-0.5">
                  5
                </div>
                <span>
                  <strong>Garis Finish:</strong> Pemain pertama yang mencapai petak terakhir dinobatkan sebagai Juara 1!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
