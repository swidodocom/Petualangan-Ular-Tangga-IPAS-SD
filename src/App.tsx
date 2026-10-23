/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Player,
  GameMode,
  QuestionCountChoice,
  GameSettings,
  AnswerLog,
  TurnLog,
  IPASQuestion
} from './types/game';
import { BOARD_36, BOARD_64, BoardSetup } from './data/boardConfig';
import { getQuestionsForGame } from './data/ipasQuestions';
import { AVATARS, HERO_COVER_IMAGE } from './data/avatars';
import { sound } from './utils/soundEngine';
import { exportGameResultsToExcel } from './utils/excelExport';
import { GameBoard } from './components/GameBoard';
import { Dice3D } from './components/Dice3D';
import { QuizModal, QuizTriggerType } from './components/QuizModal';
import { GameSummaryModal } from './components/GameSummaryModal';
import { RulesAndSettingsModal } from './components/RulesAndSettingsModal';
import {
  Play,
  Users,
  User,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  Trophy,
  Sparkles,
  Bot,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Game lifecycle
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAME_OVER'>('MENU');

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'solo',
    questionCount: 15,
    boardSize: 36,
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.6,
    is3DView: true
  });

  // Player configuration during setup
  const [playerCount, setPlayerCount] = useState<number>(2); // for multiplayer
  const [configuredPlayers, setConfiguredPlayers] = useState<Player[]>([
    {
      id: 'p1',
      name: 'Bima Galaksi',
      avatar: AVATARS[1].image,
      avatarKey: 'scientist',
      color: '#3b82f6',
      position: 1,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalRolls: 0,
      laddersClimbed: 0,
      snakesBitten: 0,
      isBot: false
    },
    {
      id: 'p2',
      name: 'Prof. Kancil AI',
      avatar: AVATARS[3].image,
      avatarKey: 'kancil',
      color: '#8b5cf6',
      position: 1,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalRolls: 0,
      laddersClimbed: 0,
      snakesBitten: 0,
      isBot: true
    }
  ]);

  // Active game session state
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [movingPlayerId, setMovingPlayerId] = useState<string | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  // Question bank & Quiz modal state
  const [activeQuestion, setActiveQuestion] = useState<IPASQuestion | null>(null);
  const [quizTriggerType, setQuizTriggerType] = useState<QuizTriggerType>('mystery');
  const [quizTargetTile, setQuizTargetTile] = useState<number | undefined>(undefined);
  const [questionPool, setQuestionPool] = useState<IPASQuestion[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);

  // Logs & statistics
  const [answerLogs, setAnswerLogs] = useState<AnswerLog[]>([]);
  const [turnLogs, setTurnLogs] = useState<TurnLog[]>([]);
  const [turnCount, setTurnCount] = useState<number>(1);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Board setup based on settings
  const currentBoardSetup: BoardSetup = settings.boardSize === 64 ? BOARD_64 : BOARD_36;

  // Duration timer during gameplay
  useEffect(() => {
    let timer: number;
    if (gameState === 'PLAYING') {
      timer = window.setInterval(() => {
        setDurationSeconds(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, gameStartTime]);

  // Sync audio settings with sound engine
  useEffect(() => {
    sound.setMute(!settings.soundEnabled);
    sound.setMasterVolume(settings.volume);
    if (settings.musicEnabled && settings.soundEnabled && gameState === 'PLAYING') {
      sound.startMusic();
    } else {
      sound.stopMusic();
    }
  }, [settings.soundEnabled, settings.musicEnabled, settings.volume, gameState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Helper to start the game
  const handleStartGame = () => {
    sound.playClick();
    const questions = getQuestionsForGame(settings.questionCount);
    setQuestionPool(questions);
    setUsedQuestionIds([]);
    setAnswerLogs([]);
    setTurnLogs([]);
    setTurnCount(1);
    setWinner(null);
    setGameStartTime(Date.now());
    setDurationSeconds(0);

    let initialPlayers: Player[] = [];
    if (settings.mode === 'solo') {
      // Human player vs Bot
      initialPlayers = [
        {
          ...configuredPlayers[0],
          id: 'p1',
          position: 1,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          totalRolls: 0,
          laddersClimbed: 0,
          snakesBitten: 0,
          isBot: false
        },
        {
          id: 'bot_kancil',
          name: 'Prof. Kancil AI',
          avatar: AVATARS[3].image,
          avatarKey: 'kancil',
          color: '#8b5cf6',
          position: 1,
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          totalRolls: 0,
          laddersClimbed: 0,
          snakesBitten: 0,
          isBot: true
        }
      ];
    } else {
      // Multiplayer (2-4 human players)
      initialPlayers = configuredPlayers.slice(0, playerCount).map((p, idx) => ({
        ...p,
        id: `p${idx + 1}`,
        position: 1,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalRolls: 0,
        laddersClimbed: 0,
        snakesBitten: 0,
        isBot: false
      }));
    }

    setPlayers(initialPlayers);
    setActivePlayerIndex(0);
    setGameState('PLAYING');

    if (settings.musicEnabled && settings.soundEnabled) {
      sound.startMusic();
    }
  };

  // Pick a fresh question from pool
  const pickNextQuestion = (): IPASQuestion => {
    const available = questionPool.filter(q => !usedQuestionIds.includes(q.id));
    if (available.length > 0) {
      const q = available[Math.floor(Math.random() * available.length)];
      setUsedQuestionIds(prev => [...prev, q.id]);
      return q;
    }
    // If all used, recycle randomly
    return questionPool[Math.floor(Math.random() * questionPool.length)];
  };

  // Turn management: Check if active player is a bot and roll automatically
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const activePlayer = players[activePlayerIndex];
    if (activePlayer && activePlayer.isBot && !isRolling && !activeQuestion && !movingPlayerId) {
      const botTimer = setTimeout(() => {
        handleRollDice();
      }, 1000);
      return () => clearTimeout(botTimer);
    }
  }, [gameState, activePlayerIndex, players, isRolling, activeQuestion, movingPlayerId]);

  // Roll the dice and initiate step-by-step token movement
  const handleRollDice = () => {
    if (isRolling || movingPlayerId || activeQuestion) return;

    setIsRolling(true);
    const rolled = Math.floor(Math.random() * 6) + 1;
    setDiceValue(rolled);

    setTimeout(() => {
      setIsRolling(false);
      executePlayerMove(rolled);
    }, 850);
  };

  // Animate pawn step-by-step
  const executePlayerMove = (roll: number) => {
    const activePlayer = players[activePlayerIndex];
    if (!activePlayer) return;

    setMovingPlayerId(activePlayer.id);
    const fromPos = activePlayer.position;
    const boardSize = currentBoardSetup.size;
    const targetPos = Math.min(boardSize, fromPos + roll);

    // Update player roll count
    setPlayers(prev =>
      prev.map(p => (p.id === activePlayer.id ? { ...p, totalRolls: p.totalRolls + 1 } : p))
    );

    // Step-by-step hopping
    let currentStep = fromPos;
    const stepInterval = setInterval(() => {
      if (currentStep < targetPos) {
        currentStep++;
        sound.playPawnStep();
        setPlayers(prev =>
          prev.map(p => (p.id === activePlayer.id ? { ...p, position: currentStep } : p))
        );
      } else {
        clearInterval(stepInterval);
        setMovingPlayerId(null);
        // Landed on targetPos! Check board events
        handleTileLanded(activePlayer, fromPos, targetPos, roll);
      }
    }, 220);
  };

  // Inspect the landed tile (Ladder, Snake, Mystery Quiz, or Finish)
  const handleTileLanded = (
    player: Player,
    fromPos: number,
    landedTile: number,
    roll: number
  ) => {
    const boardSize = currentBoardSetup.size;

    // Check WIN condition (reached last tile)
    if (landedTile >= boardSize) {
      const updatedPlayer = {
        ...player,
        position: boardSize,
        score: player.score + 250 // finish bonus
      };
      setPlayers(prev => prev.map(p => (p.id === player.id ? updatedPlayer : p)));
      setWinner(updatedPlayer);

      // Record win turn log
      setTurnLogs(prev => [
        ...prev,
        {
          turnNumber: turnCount,
          playerName: player.name,
          roll,
          fromTile: fromPos,
          toTile: boardSize,
          event: 'win',
          description: `Mencapai Garis Finish di Petak ${boardSize}! Juara Sains!`
        }
      ]);

      setGameState('GAME_OVER');
      return;
    }

    // Check LADDER
    const ladder = currentBoardSetup.ladders.find(l => l.bottom === landedTile);
    if (ladder) {
      const question = pickNextQuestion();
      setActiveQuestion(question);
      setQuizTriggerType('ladder');
      setQuizTargetTile(ladder.top);
      return;
    }

    // Check SNAKE
    const snake = currentBoardSetup.snakes.find(s => s.head === landedTile);
    if (snake) {
      const question = pickNextQuestion();
      setActiveQuestion(question);
      setQuizTriggerType('snake');
      setQuizTargetTile(snake.tail);
      return;
    }

    // Check MYSTERY QUIZ TILE
    const isQuizTile = currentBoardSetup.quizTiles.includes(landedTile);
    if (isQuizTile) {
      const question = pickNextQuestion();
      setActiveQuestion(question);
      setQuizTriggerType('mystery');
      setQuizTargetTile(undefined);
      return;
    }

    // NORMAL TILE
    setTurnLogs(prev => [
      ...prev,
      {
        turnNumber: turnCount,
        playerName: player.name,
        roll,
        fromTile: fromPos,
        toTile: landedTile,
        event: 'normal',
        description: `Melangkah maju ${roll} kotak ke Petak ${landedTile}.`
      }
    ]);

    // Advance to next turn
    advanceTurn();
  };

  // Handle result from QuizModal
  const handleQuizAnswer = (isCorrect: boolean, selectedOption: string) => {
    if (!activeQuestion) return;

    const activePlayer = players[activePlayerIndex];
    const currentPos = activePlayer.position;
    let newPosition = currentPos;
    let pointsEarned = 0;
    let logEvent: 'ladder' | 'snake' | 'quiz' = 'quiz';
    let turnDescription = '';

    if (quizTriggerType === 'ladder') {
      logEvent = 'ladder';
      if (isCorrect && quizTargetTile) {
        newPosition = quizTargetTile;
        pointsEarned = 100;
        sound.playLadderClimb();
        turnDescription = `Menjawab BENAR! Naik Tangga Prestasi dari Petak ${currentPos} ke Petak ${quizTargetTile} (+100 Poin)!`;
        showToast(`🎉 ${activePlayer.name} naik tangga ke Petak ${quizTargetTile}!`);
      } else {
        turnDescription = `Jawaban SALAH. Tetap di Petak ${currentPos} dan gagal menaiki tangga.`;
      }
    } else if (quizTriggerType === 'snake') {
      logEvent = 'snake';
      if (isCorrect) {
        newPosition = currentPos; // Saved!
        pointsEarned = 50;
        turnDescription = `Menjawab BENAR! Lolos dari gigitan ular dan bertahan di Petak ${currentPos} (+50 Poin)!`;
        showToast(`🛡️ ${activePlayer.name} selamat dari gigitan ular!`);
      } else if (quizTargetTile) {
        newPosition = quizTargetTile;
        sound.playSnakeSlide();
        turnDescription = `Jawaban SALAH. Digigit ular dan meluncur turun ke Petak ${quizTargetTile}!`;
        showToast(`🐍 ${activePlayer.name} meluncur turun ke Petak ${quizTargetTile}!`);
      }
    } else {
      // Mystery Quiz
      logEvent = 'quiz';
      if (isCorrect) {
        pointsEarned = 75;
        turnDescription = `Menjawab BENAR Kuis Misteri IPAS (+75 Poin)!`;
        showToast(`⭐ Jawaban benar! +75 Poin untuk ${activePlayer.name}`);
      } else {
        turnDescription = `Menjawab SALAH Kuis Misteri IPAS.`;
      }
    }

    // Record Answer Log for Excel export
    const newAnswerLog: AnswerLog = {
      timestamp: new Date().toLocaleTimeString('id-ID'),
      playerName: activePlayer.name,
      questionId: activeQuestion.id,
      questionText: activeQuestion.question,
      topic: activeQuestion.topic,
      selectedOption,
      correctOption: activeQuestion.options[activeQuestion.correctIndex],
      isCorrect,
      pointsEarned,
      explanation: activeQuestion.explanation
    };
    setAnswerLogs(prev => [...prev, newAnswerLog]);

    // Update active player's stats & position
    setPlayers(prev =>
      prev.map(p => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            position: newPosition,
            score: p.score + pointsEarned,
            correctAnswers: isCorrect ? p.correctAnswers + 1 : p.correctAnswers,
            wrongAnswers: !isCorrect ? p.wrongAnswers + 1 : p.wrongAnswers,
            laddersClimbed:
              quizTriggerType === 'ladder' && isCorrect ? p.laddersClimbed + 1 : p.laddersClimbed,
            snakesBitten:
              quizTriggerType === 'snake' && !isCorrect ? p.snakesBitten + 1 : p.snakesBitten
          };
        }
        return p;
      })
    );

    // Record Turn Log for Excel
    setTurnLogs(prev => [
      ...prev,
      {
        turnNumber: turnCount,
        playerName: activePlayer.name,
        roll: diceValue,
        fromTile: currentPos,
        toTile: newPosition,
        event: logEvent,
        description: turnDescription
      }
    ]);

    // Close Quiz Modal & advance turn
    setActiveQuestion(null);
    advanceTurn();
  };

  const advanceTurn = () => {
    setTurnCount(prev => prev + 1);
    setActivePlayerIndex(prev => (prev + 1) % players.length);
  };

  const handleManualExcelDownload = () => {
    sound.playClick();
    const activeWinner = winner || players[0];
    exportGameResultsToExcel({
      gameTitle: 'Ular Tangga IPAS SD',
      date: new Date().toLocaleString('id-ID'),
      durationSeconds,
      settings,
      winner: activeWinner,
      players,
      answerLogs,
      turnLogs
    });
    showToast('📊 Laporan Excel (.xlsx) berhasil diunduh!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Bar following Design Constitution */}
      <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <span className="text-xl sm:text-2xl">🎲</span>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-white whitespace-nowrap">
            Petualangan Ular Tangga IPAS SD
          </h1>
        </div>

        {/* Zone 2: 4 nav links / indicators */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-400">
          <button
            onClick={() => setGameState('MENU')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Pilihan Mode
          </button>
          <span className="text-slate-600">·</span>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Aturan Main & Materi IPAS
          </button>
          <span className="text-slate-600">·</span>
          <button
            onClick={handleManualExcelDownload}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-emerald-400"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title={settings.soundEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="Pengaturan & Panduan"
          >
            <Settings className="w-4 h-4" />
          </button>

          {gameState === 'PLAYING' && (
            <button
              onClick={() => setGameState('MENU')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Menu Utama</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 border border-emerald-500/70 text-emerald-200 rounded-full text-xs sm:text-sm font-bold shadow-xl animate-fade-in flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: MENU UTAMA & PENGATURAN PERMAINAN                     */}
        {/* ------------------------------------------------------------- */}
        {gameState === 'MENU' && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-4 space-y-6">
            {/* Hero Cover Card with 3D generated image */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full">
                <img
                  src={HERO_COVER_IMAGE}
                  alt="Petualangan Ular Tangga IPAS SD"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-8">
                  <span className="text-xs sm:text-sm font-black tracking-widest text-emerald-400 uppercase">
                    Game Edukasi Interaktif Kurikulum Merdeka
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                    Jelajah Sains & Sosial Bersama Ular Tangga 3D
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1.5 hidden sm:block">
                    Taklukkan rintangan alam, panjat tangga prestasi sains, dan buktikan pemahamanmu di mata pelajaran IPAS SD dengan laporan evaluasi otomatis ke Microsoft Excel!
                  </p>
                </div>
              </div>
            </div>

            {/* Game Setup Configuration Box */}
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Mode Permainan (Solo vs Multiplayer) */}
                <div className="space-y-3">
                  <label className="text-xs font-black tracking-wider uppercase text-slate-400 block">
                    1. Pilih Mode Bermain
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSettings(s => ({ ...s, mode: 'solo' }));
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                        settings.mode === 'solo'
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Bot className={`w-6 h-6 ${settings.mode === 'solo' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs sm:text-sm font-bold">Solo vs AI Bot</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Lawan Prof. Kancil Cilik</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setSettings(s => ({ ...s, mode: 'multiplayer' }));
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                        settings.mode === 'multiplayer'
                          ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Users className={`w-6 h-6 ${settings.mode === 'multiplayer' ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs sm:text-sm font-bold">Multiplayer Lokal</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">2 - 4 Siswa Bergiliran</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Pilihan Bank Soal: 15 Soal vs 30 Soal */}
                <div className="space-y-3">
                  <label className="text-xs font-black tracking-wider uppercase text-slate-400 block">
                    2. Pilihan Bank Soal & Papan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSettings(s => ({ ...s, questionCount: 15, boardSize: 36 }));
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                        settings.questionCount === 15
                          ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg ring-1 ring-purple-500'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-base font-black text-purple-400">15 Soal IPAS</div>
                      <div className="text-xs font-bold text-slate-200">Papan Kilat 36 Petak</div>
                      <div className="text-[10px] text-slate-400">Sesi Cepat ~10 Menit</div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setSettings(s => ({ ...s, questionCount: 30, boardSize: 64 }));
                      }}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                        settings.questionCount === 30
                          ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg ring-1 ring-amber-500'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-base font-black text-amber-400">30 Soal IPAS</div>
                      <div className="text-xs font-bold text-slate-200">Papan Agung 64 Petak</div>
                      <div className="text-[10px] text-slate-400">Sesi Lengkap ~20 Menit</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Pengaturan Karakter & Nama Siswa */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black tracking-wider uppercase text-slate-400">
                    3. Profil Pemain & Karakter 3D
                  </label>
                  {settings.mode === 'multiplayer' && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>Jumlah Pemain:</span>
                      {[2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => {
                            sound.playClick();
                            setPlayerCount(num);
                          }}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            playerCount === num ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Character preview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {AVATARS.slice(0, settings.mode === 'solo' ? 2 : playerCount).map((avatar, idx) => {
                    const isBotPlayer = settings.mode === 'solo' && idx === 1;

                    return (
                      <div
                        key={avatar.id}
                        className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 flex flex-col items-center text-center gap-2 relative overflow-hidden"
                      >
                        <div
                          style={{ borderColor: avatar.themeColor }}
                          className="w-16 h-16 rounded-full border-2 overflow-hidden bg-slate-900 shadow-md mt-1"
                        >
                          <img
                            src={avatar.image}
                            alt={avatar.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="w-full">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">
                            {isBotPlayer ? 'Lawan AI Bot' : `Pemain ${idx + 1}`}
                          </span>
                          {isBotPlayer ? (
                            <span className="text-xs font-bold text-purple-300 block mt-0.5">
                              {avatar.name}
                            </span>
                          ) : (
                            <input
                              type="text"
                              value={configuredPlayers[idx]?.name || avatar.name}
                              onChange={e => {
                                const newName = e.target.value;
                                setConfiguredPlayers(prev => {
                                  const updated = [...prev];
                                  if (!updated[idx]) {
                                    updated[idx] = {
                                      id: `p${idx + 1}`,
                                      name: newName,
                                      avatar: avatar.image,
                                      avatarKey: 'explorer',
                                      color: avatar.themeColor,
                                      position: 1,
                                      score: 0,
                                      correctAnswers: 0,
                                      wrongAnswers: 0,
                                      totalRolls: 0,
                                      laddersClimbed: 0,
                                      snakesBitten: 0,
                                      isBot: false
                                    };
                                  } else {
                                    updated[idx].name = newName;
                                  }
                                  return updated;
                                });
                              }}
                              className="text-xs font-bold text-white bg-slate-900/90 border border-slate-700 rounded-lg px-2 py-1 w-full text-center focus:border-cyan-500 focus:outline-none mt-0.5"
                              placeholder="Nama Siswa"
                            />
                          )}
                          <div className="text-[10px] text-emerald-400 mt-1 font-medium">{avatar.badge}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start Game Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Hasil permainan otomatis tersimpan ke file Excel (.xlsx) setelah finish.</span>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:brightness-110 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Mulai Petualangan IPAS Sekarang!</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: ACTIVE GAMEPLAY VIEW                                  */}
        {/* ------------------------------------------------------------- */}
        {gameState === 'PLAYING' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Left Column: Game Board Canvas */}
            <div className="w-full lg:flex-1 flex flex-col items-center">
              <GameBoard
                setup={currentBoardSetup}
                players={players}
                activePlayerId={players[activePlayerIndex]?.id || ''}
                is3DView={settings.is3DView}
                onToggle3D={() => setSettings(s => ({ ...s, is3DView: !s.is3DView }))}
                movingPlayerId={movingPlayerId}
              />
            </div>

            {/* Right Column: Interactive Dice, Active Player HUD, and Standings */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              {/* Active Player Status Card */}
              {players[activePlayerIndex] && (
                <div
                  style={{
                    borderColor: players[activePlayerIndex].color,
                    boxShadow: `0 8px 24px ${players[activePlayerIndex].color}25`
                  }}
                  className="bg-slate-900 border-2 rounded-3xl p-4 sm:p-5 flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Glowing header light */}
                  <div
                    style={{ backgroundColor: players[activePlayerIndex].color }}
                    className="absolute -top-10 w-32 h-16 rounded-full blur-2xl opacity-40"
                  />

                  <div className="relative z-10 flex flex-col items-center w-full">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                      GILIRAN MELEMPAR DADU
                    </span>

                    {/* Active Avatar */}
                    <div
                      style={{ borderColor: players[activePlayerIndex].color }}
                      className="w-16 h-16 rounded-full border-3 overflow-hidden bg-slate-800 shadow-xl my-2.5"
                    >
                      <img
                        src={players[activePlayerIndex].avatar}
                        alt={players[activePlayerIndex].name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white">
                      {players[activePlayerIndex].name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>Petak {players[activePlayerIndex].position}</span>
                      <span>·</span>
                      <span className="text-amber-400 font-bold">{players[activePlayerIndex].score} Poin</span>
                    </div>

                    {/* 3D Dice Component */}
                    <div className="mt-4 mb-1">
                      <Dice3D
                        value={diceValue}
                        isRolling={isRolling}
                        onRoll={handleRollDice}
                        disabled={players[activePlayerIndex].isBot || !!movingPlayerId || !!activeQuestion}
                        playerName={players[activePlayerIndex].name}
                        playerColor={players[activePlayerIndex].color}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Standings Panel */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-black tracking-wider uppercase text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Klasemen Sementara
                  </span>
                  <span className="text-slate-500 font-mono">Turn #{turnCount}</span>
                </div>

                <div className="space-y-2">
                  {[...players]
                    .sort((a, b) => b.position - a.position)
                    .map((p, idx) => {
                      const isActive = p.id === players[activePlayerIndex]?.id;
                      return (
                        <div
                          key={p.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            isActive
                              ? 'bg-slate-800 border-slate-600 shadow-sm ring-1 ring-white/20'
                              : 'bg-slate-850/60 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                            <div
                              style={{ borderColor: p.color }}
                              className="w-7 h-7 rounded-full border overflow-hidden bg-slate-800 shrink-0"
                            >
                              <img
                                src={p.avatar}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-bold text-white truncate max-w-[100px]">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-slate-400">Petak {p.position}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-amber-300">{p.score} Poin</span>
                            <span className="text-[10px] text-emerald-400 block">
                              {p.correctAnswers} Benar
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Game Log / Catatan Perjalanan */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2">
                <span className="text-xs font-black tracking-wider uppercase text-slate-400 block">
                  Catatan Perjalanan Terakhir
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-slate-300">
                  {turnLogs.length === 0 ? (
                    <div className="text-slate-500 text-[11px] italic">Permainan baru dimulai. Lempar dadu untuk melangkah!</div>
                  ) : (
                    turnLogs
                      .slice(-4)
                      .reverse()
                      .map((log, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 leading-relaxed text-[11px]">
                          <strong className="text-white">{log.playerName}</strong>: {log.description}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* QUIZ MODAL (Ladder / Snake / Mystery Question)                */}
        {/* ------------------------------------------------------------- */}
        {activeQuestion && players[activePlayerIndex] && (
          <QuizModal
            question={activeQuestion}
            player={players[activePlayerIndex]}
            triggerType={quizTriggerType}
            targetTile={quizTargetTile}
            onAnswer={handleQuizAnswer}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* GAME SUMMARY / VICTORY MODAL & AUTO EXCEL EXPORT              */}
        {/* ------------------------------------------------------------- */}
        {gameState === 'GAME_OVER' && winner && (
          <GameSummaryModal
            winner={winner}
            players={players}
            answerLogs={answerLogs}
            turnLogs={turnLogs}
            settings={settings}
            durationSeconds={durationSeconds}
            onRestart={() => setGameState('MENU')}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* RULES & SETTINGS MODAL                                        */}
        {/* ------------------------------------------------------------- */}
        <RulesAndSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          settings={settings}
          onUpdateSettings={newS => setSettings(s => ({ ...s, ...newS }))}
          onExportCurrentExcel={gameState === 'PLAYING' ? handleManualExcelDownload : undefined}
        />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 sm:px-8 py-3 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Media Pembelajaran IPAS SD &copy; 2026 · Kurikulum Merdeka
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Materi: Ekosistem, Fotosintesis, Benda, Energi, Tata Surya, Budaya & Sejarah</span>
          <span>·</span>
          <span className="text-emerald-400 font-semibold">Simpan Otomatis Excel</span>
        </div>
      </footer>
    </div>
  );
}
