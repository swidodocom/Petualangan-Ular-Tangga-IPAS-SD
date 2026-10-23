import React from 'react';
import { Player } from '../types/game';
import { BoardSetup, getTileGridPosition, getTileCenterPercent } from '../data/boardConfig';
import { Sparkles, Trophy, Flag, BookOpen, AlertCircle, ArrowUpRight } from 'lucide-react';

interface GameBoardProps {
  setup: BoardSetup;
  players: Player[];
  activePlayerId: string;
  is3DView: boolean;
  onToggle3D: () => void;
  movingPlayerId: string | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  setup,
  players,
  activePlayerId,
  is3DView,
  onToggle3D,
  movingPlayerId
}) => {
  const { size, gridRows, gridCols, ladders, snakes, quizTiles } = setup;

  // Generate tiles 1 to size
  const tiles = Array.from({ length: size }, (_, i) => i + 1);

  // Group players by current position to compute slight offset if sharing tile
  const playersAtTile: Record<number, Player[]> = {};
  players.forEach(p => {
    if (!playersAtTile[p.position]) {
      playersAtTile[p.position] = [];
    }
    playersAtTile[p.position].push(p);
  });

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto select-none">
      {/* 3D / 2D Perspective Toggle Bar */}
      <div className="w-full flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Papan Sains {size} Petak</span>
          <span>·</span>
          <span>{ladders.length} Tangga Prestasi</span>
          <span>·</span>
          <span>{snakes.length} Ular Rintangan</span>
        </div>
        <button
          onClick={onToggle3D}
          className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>{is3DView ? 'Tampilan 3D Aktif' : 'Tampilan 2D Datar'}</span>
          <span className="text-[10px] text-emerald-400">(Ubah)</span>
        </button>
      </div>

      {/* Board Outer Container with 3D perspective */}
      <div className={`w-full ${is3DView ? 'board-container-3d' : ''}`}>
        <div
          className={`relative w-full aspect-square bg-slate-900/90 rounded-2xl p-2.5 sm:p-4 shadow-2xl border-4 border-slate-800 transition-transform duration-500 overflow-hidden ${
            is3DView ? 'board-tilt-3d' : 'board-flat-2d'
          }`}
          style={{
            boxShadow: is3DView
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.7), 0 18px 36px -18px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255,255,255,0.1)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.05)'
          }}
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Tiles Grid */}
          <div
            className="w-full h-full grid gap-1 sm:gap-2 relative z-0"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`
            }}
          >
            {tiles.map(tileNum => {
              const { row, col } = getTileGridPosition(tileNum, gridRows, gridCols);
              const isStart = tileNum === 1;
              const isFinish = tileNum === size;

              const ladderObj = ladders.find(l => l.bottom === tileNum);
              const ladderTop = ladders.find(l => l.top === tileNum);
              const snakeObj = snakes.find(s => s.head === tileNum);
              const snakeTail = snakes.find(s => s.tail === tileNum);
              const isQuiz = quizTiles.includes(tileNum);

              // Distinct gentle background styling based on tile type
              let bgStyle = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60';
              let badgeText = '';

              if (isStart) {
                bgStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200';
                badgeText = 'START';
              } else if (isFinish) {
                bgStyle = 'bg-amber-950/60 border-amber-500/80 text-amber-200';
                badgeText = 'FINISH';
              } else if (ladderObj) {
                bgStyle = 'bg-cyan-950/50 border-cyan-500/50 text-cyan-200';
                badgeText = `▲ ${ladderObj.top}`;
              } else if (snakeObj) {
                bgStyle = 'bg-rose-950/50 border-rose-500/50 text-rose-200';
                badgeText = `▼ ${snakeObj.tail}`;
              } else if (isQuiz) {
                bgStyle = 'bg-purple-950/50 border-purple-500/50 text-purple-200';
                badgeText = 'KUIS';
              } else if (ladderTop) {
                bgStyle = 'bg-cyan-950/20 border-cyan-800/40 text-cyan-400';
              } else if (snakeTail) {
                bgStyle = 'bg-rose-950/20 border-rose-800/40 text-rose-400';
              }

              return (
                <div
                  key={tileNum}
                  style={{
                    gridColumnStart: col + 1,
                    gridRowStart: row + 1
                  }}
                  className={`relative rounded-lg sm:rounded-xl border p-1 sm:p-1.5 flex flex-col justify-between transition-all duration-200 ${bgStyle}`}
                >
                  {/* Tile Number and Badge */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] sm:text-xs font-black tracking-tight text-white/90">
                      {tileNum}
                    </span>
                    {badgeText && (
                      <span className="text-[8px] sm:text-[9px] font-bold px-1 py-0.2 rounded bg-black/40 tracking-wider">
                        {badgeText}
                      </span>
                    )}
                  </div>

                  {/* Tile Center Icon/Sign */}
                  <div className="flex items-center justify-center py-0.5">
                    {isStart && <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-bounce" />}
                    {isFinish && <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />}
                    {ladderObj && <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />}
                    {snakeObj && <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />}
                    {isQuiz && <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />}
                  </div>

                  {/* Subtle science topic label indicator */}
                  <div className="text-[7px] sm:text-[8px] text-slate-400/80 truncate text-center">
                    {isQuiz ? 'Tantangan IPAS' : ladderObj ? 'Tangga Sains' : snakeObj ? 'Rintangan Alam' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Overlay for Ladders and Snakes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              {/* Snake Gradient */}
              <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>

              {/* Ladder Gradient */}
              <linearGradient id="ladderGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Draw Ladders */}
            {ladders.map(ladder => {
              const start = getTileCenterPercent(ladder.bottom, gridRows, gridCols);
              const end = getTileCenterPercent(ladder.top, gridRows, gridCols);

              // Ladder side rails offset
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const angle = Math.atan2(dy, dx);
              const offset = 2.2; // percent width offset

              const ox = Math.sin(angle) * offset;
              const oy = -Math.cos(angle) * offset;

              // Rungs calculation
              const rungsCount = Math.max(3, Math.floor(Math.hypot(dx, dy) / 6));
              const rungs = [];
              for (let i = 1; i <= rungsCount; i++) {
                const t = i / (rungsCount + 1);
                const rx = start.x + dx * t;
                const ry = start.y + dy * t;
                rungs.push({
                  x1: rx - ox,
                  y1: ry - oy,
                  x2: rx + ox,
                  y2: ry + oy
                });
              }

              return (
                <g key={`ladder-${ladder.bottom}-${ladder.top}`} filter="url(#glow)">
                  {/* Left Rail */}
                  <line
                    x1={`${start.x - ox}%`}
                    y1={`${start.y - oy}%`}
                    x2={`${end.x - ox}%`}
                    y2={`${end.y - oy}%`}
                    stroke="url(#ladderGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Right Rail */}
                  <line
                    x1={`${start.x + ox}%`}
                    y1={`${start.y + oy}%`}
                    x2={`${end.x + ox}%`}
                    y2={`${end.y + oy}%`}
                    stroke="url(#ladderGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Rungs */}
                  {rungs.map((r, idx) => (
                    <line
                      key={idx}
                      x1={`${r.x1}%`}
                      y1={`${r.y1}%`}
                      x2={`${r.x2}%`}
                      y2={`${r.y2}%`}
                      stroke="#e0f2fe"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  ))}
                </g>
              );
            })}

            {/* Draw Snakes */}
            {snakes.map(snake => {
              const head = getTileCenterPercent(snake.head, gridRows, gridCols);
              const tail = getTileCenterPercent(snake.tail, gridRows, gridCols);

              // S-curve control points
              const dx = tail.x - head.x;
              const dy = tail.y - head.y;
              const midX = (head.x + tail.x) / 2;
              const midY = (head.y + tail.y) / 2;

              // Curve swing
              const perpX = -dy * 0.35;
              const perpY = dx * 0.35;

              const cp1X = head.x + dx * 0.25 + perpX;
              const cp1Y = head.y + dy * 0.25 + perpY;
              const cp2X = head.x + dx * 0.75 - perpX;
              const cp2Y = head.y + dy * 0.75 - perpY;

              const pathData = `M ${head.x} ${head.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${tail.x} ${tail.y}`;

              return (
                <g key={`snake-${snake.head}-${snake.tail}`}>
                  {/* Snake Body shadow */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.45)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    transform="translate(1, 2)"
                  />
                  {/* Snake Body */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="url(#snakeGradient)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="9 3"
                  />
                  {/* Snake Head */}
                  <circle
                    cx={`${head.x}%`}
                    cy={`${head.y}%`}
                    r="6.5"
                    fill="#ef4444"
                    stroke="#fee2e2"
                    strokeWidth="1.5"
                  />
                  {/* Snake Eyes */}
                  <circle cx={`${head.x - 1.8}%`} cy={`${head.y - 1.5}%`} r="1.2" fill="#ffffff" />
                  <circle cx={`${head.x - 1.8}%`} cy={`${head.y - 1.5}%`} r="0.6" fill="#000000" />
                  <circle cx={`${head.x + 1.8}%`} cy={`${head.y - 1.5}%`} r="1.2" fill="#ffffff" />
                  <circle cx={`${head.x + 1.8}%`} cy={`${head.y - 1.5}%`} r="0.6" fill="#000000" />
                </g>
              );
            })}
          </svg>

          {/* Animated Player Tokens */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {players.map(player => {
              const center = getTileCenterPercent(player.position, gridRows, gridCols);
              const playersHere = playersAtTile[player.position] || [];
              const myIdx = playersHere.findIndex(p => p.id === player.id);
              const totalHere = playersHere.length;

              // Calculate slight offset if multiple tokens share the exact tile
              let offsetX = 0;
              let offsetY = 0;
              if (totalHere > 1) {
                const angle = (myIdx / totalHere) * 2 * Math.PI;
                offsetX = Math.cos(angle) * 1.8;
                offsetY = Math.sin(angle) * 1.8;
              }

              const isActive = player.id === activePlayerId;
              const isMoving = player.id === movingPlayerId;

              return (
                <div
                  key={player.id}
                  style={{
                    left: `${center.x + offsetX}%`,
                    top: `${center.y + offsetY}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                  className={`absolute flex flex-col items-center justify-center transition-all ${
                    isMoving ? 'scale-125 z-30' : 'z-20'
                  }`}
                >
                  {/* Token Avatar Circle */}
                  <div
                    style={{
                      borderColor: player.color,
                      boxShadow: isActive
                        ? `0 0 16px ${player.color}, 0 4px 10px rgba(0,0,0,0.5)`
                        : '0 4px 8px rgba(0,0,0,0.4)'
                    }}
                    className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 sm:border-3 overflow-hidden bg-slate-800 ${
                      isActive ? 'ring-2 sm:ring-4 ring-white/60 animate-bounce' : ''
                    }`}
                  >
                    <img
                      src={player.avatar}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Player Name Pill */}
                  <div
                    style={{ backgroundColor: player.color }}
                    className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold text-white shadow whitespace-nowrap mt-0.5 tracking-tight"
                  >
                    {player.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
