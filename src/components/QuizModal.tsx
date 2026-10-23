import React, { useState, useEffect } from 'react';
import { IPASQuestion, Player } from '../types/game';
import { sound } from '../utils/soundEngine';
import { CheckCircle2, XCircle, Lightbulb, Clock, Sparkles, BookOpen, Bot } from 'lucide-react';

export type QuizTriggerType = 'ladder' | 'snake' | 'mystery';

interface QuizModalProps {
  question: IPASQuestion;
  player: Player;
  triggerType: QuizTriggerType;
  targetTile?: number;
  onAnswer: (isCorrect: boolean, selectedOption: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  player,
  triggerType,
  targetTile,
  onAnswer
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30 seconds timer
  const [isBotThinking, setIsBotThinking] = useState<boolean>(player.isBot || false);

  // Bot auto-answer simulation
  useEffect(() => {
    if (player.isBot && !isAnswered) {
      setIsBotThinking(true);
      const timer = setTimeout(() => {
        setIsBotThinking(false);
        // Bot has ~80% chance of correct answer
        const isBotSmart = Math.random() < 0.8;
        let chosenIdx = question.correctIndex;
        if (!isBotSmart) {
          const wrongIndices = [0, 1, 2, 3].filter(i => i !== question.correctIndex);
          chosenIdx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        }
        handleOptionSelect(chosenIdx);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [player.isBot, question, isAnswered]);

  // Countdown timer for human players
  useEffect(() => {
    if (player.isBot || isAnswered) return;

    if (timeLeft <= 0) {
      // Time up counts as wrong
      handleOptionSelect(-1);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isAnswered, player.isBot]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  };

  const handleProceed = () => {
    const isCorrect = selectedIndex === question.correctIndex;
    const selectedOption = selectedIndex !== null && selectedIndex >= 0
      ? question.options[selectedIndex]
      : 'Waktu Habis / Tidak Memilih';
    onAnswer(isCorrect, selectedOption);
  };

  // Header banner based on trigger type
  let triggerTitle = 'Tantangan Soal IPAS SD';
  let triggerSubtitle = 'Jawab pertanyaan dengan tepat untuk meraih poin!';
  let headerColor = 'from-purple-600 to-indigo-700';

  if (triggerType === 'ladder') {
    triggerTitle = '🪜 Ujian Tangga Prestasi Sains!';
    triggerSubtitle = targetTile
      ? `Jawab benar untuk memanjat langsung ke Petak ${targetTile} (+100 Poin)!`
      : 'Jawab benar untuk memanjat tangga prestasi!';
    headerColor = 'from-cyan-600 to-blue-700';
  } else if (triggerType === 'snake') {
    triggerTitle = '🐍 Tantangan Lolos Ular Rintangan!';
    triggerSubtitle = 'Jawab benar untuk lolos dan tetap bertahan di petak ini (+50 Poin)!';
    headerColor = 'from-rose-600 to-amber-700';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className={`p-4 sm:p-5 bg-gradient-to-r ${headerColor} text-white relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                style={{ borderColor: player.color }}
                className="w-10 h-10 rounded-full border-2 overflow-hidden bg-slate-800 shrink-0 shadow-md"
              >
                <img
                  src={player.avatar}
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-80 flex items-center gap-1">
                  {player.isBot ? <Bot className="w-3.5 h-3.5" /> : null}
                  Giliran: {player.name}
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight">{triggerTitle}</h3>
              </div>
            </div>

            {/* Timer Badge */}
            {!player.isBot && !isAnswered && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                timeLeft <= 10 ? 'bg-rose-500/30 border-rose-400 text-rose-200 animate-pulse' : 'bg-black/30 border-white/20 text-white'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/90 mt-2 font-medium">{triggerSubtitle}</p>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Topic & Grade Tag */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{question.topic}</span>
            <span>·</span>
            <span>{question.grade}</span>
            <span>·</span>
            <span className="text-slate-300">Soal #{question.id}</span>
          </div>

          {/* Question Text */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shadow-inner">
            <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {question.question}
            </h4>
          </div>

          {/* Bot Thinking indicator */}
          {isBotThinking && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-purple-300 bg-purple-950/40 border border-purple-800/50 rounded-xl">
              <Bot className="w-4 h-4 animate-spin" />
              <span>{player.name} sedang memikirkan jawaban IPAS...</span>
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedIndex === idx;
              const isCorrectAnswer = idx === question.correctIndex;

              let btnStyle = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered || isBotThinking}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle} ${
                    !isAnswered && !isBotThinking ? 'active:scale-[0.99]' : ''
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isAnswered && isCorrectAnswer
                      ? 'bg-emerald-500 text-white'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-xs sm:text-sm font-medium flex-1 pt-0.5">{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
              selectedIndex === question.correctIndex
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-600/50 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedIndex === question.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Jawaban Tepat! Luar Biasa!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Jawaban Kurang Tepat! Kunci Jawaban: {question.options[question.correctIndex]}</span>
                  </>
                )}
              </div>

              <div className="text-xs sm:text-sm text-slate-300 pt-1 border-t border-white/10 leading-relaxed flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300">Pembahasan Sains: </strong>
                  {question.explanation}
                </div>
              </div>

              {question.funFact && (
                <div className="text-xs text-amber-200/90 pt-1 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300">Fakta Menarik: </strong>
                    {question.funFact}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Proceed Button */}
        {isAnswered && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
            <button
              onClick={handleProceed}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:brightness-110 shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Lanjutkan Petualangan</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
