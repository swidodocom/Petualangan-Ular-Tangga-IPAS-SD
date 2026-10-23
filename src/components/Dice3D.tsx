import React, { useState, useEffect } from 'react';
import { sound } from '../utils/soundEngine';

interface Dice3DProps {
  value: number; // 1 - 6
  isRolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
  playerName: string;
  playerColor: string;
}

// Target rotations for each face (1 - 6)
const faceRotations: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 }
};

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  isRolling,
  onRoll,
  disabled = false,
  playerName,
  playerColor
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isRolling) {
      sound.playDiceRoll();
      // Spin with multiple random 360-degree rotations
      const extraSpinsX = (Math.floor(Math.random() * 3) + 2) * 360;
      const extraSpinsY = (Math.floor(Math.random() * 3) + 2) * 360;
      const target = faceRotations[value] || { x: 0, y: 0 };
      setRotation({
        x: target.x + extraSpinsX,
        y: target.y + extraSpinsY
      });
    } else {
      const target = faceRotations[value] || { x: 0, y: 0 };
      setRotation(target);
    }
  }, [isRolling, value]);

  const handleRollClick = () => {
    if (disabled || isRolling) return;
    onRoll();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="dice-scene cursor-pointer" onClick={handleRollClick}>
        <div
          className="dice-cube"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isRolling ? 'transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2)' : 'transform 0.3s ease-out'
          }}
        >
          {/* Face 1: One pip center */}
          <div className="dice-face dice-front">
            <div className="col-start-2 row-start-2 dice-pip w-4 h-4 bg-red-600 rounded-full" />
          </div>

          {/* Face 2: Two pips opposite */}
          <div className="dice-face dice-back">
            <div className="col-start-1 row-start-1 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-3 dice-pip dice-pip-dark" />
          </div>

          {/* Face 3: Three pips diagonal */}
          <div className="dice-face dice-right">
            <div className="col-start-1 row-start-1 dice-pip dice-pip-dark" />
            <div className="col-start-2 row-start-2 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-3 dice-pip dice-pip-dark" />
          </div>

          {/* Face 4: Four corners */}
          <div className="dice-face dice-left">
            <div className="col-start-1 row-start-1 dice-pip dice-pip-blue" />
            <div className="col-start-3 row-start-1 dice-pip dice-pip-blue" />
            <div className="col-start-1 row-start-3 dice-pip dice-pip-blue" />
            <div className="col-start-3 row-start-3 dice-pip dice-pip-blue" />
          </div>

          {/* Face 5: Five pips */}
          <div className="dice-face dice-top">
            <div className="col-start-1 row-start-1 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-1 dice-pip dice-pip-dark" />
            <div className="col-start-2 row-start-2 dice-pip dice-pip-dark" />
            <div className="col-start-1 row-start-3 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-3 dice-pip dice-pip-dark" />
          </div>

          {/* Face 6: Six pips */}
          <div className="dice-face dice-bottom">
            <div className="col-start-1 row-start-1 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-1 dice-pip dice-pip-dark" />
            <div className="col-start-1 row-start-2 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-2 dice-pip dice-pip-dark" />
            <div className="col-start-1 row-start-3 dice-pip dice-pip-dark" />
            <div className="col-start-3 row-start-3 dice-pip dice-pip-dark" />
          </div>
        </div>
      </div>

      <button
        onClick={handleRollClick}
        disabled={disabled || isRolling}
        style={{
          backgroundColor: disabled || isRolling ? '#475569' : playerColor,
          boxShadow: `0 4px 14px ${playerColor}40`
        }}
        className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-150 transform active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0 ${
          disabled || isRolling
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:brightness-110 shadow-lg'
        }`}
      >
        <span
          className="w-3 h-3 rounded-full inline-block animate-pulse"
          style={{ backgroundColor: playerColor }}
        />
        <span>
          {isRolling ? 'Mengocok Dadu...' : `Lempar Dadu (${playerName})`}
        </span>
      </button>
    </div>
  );
};
